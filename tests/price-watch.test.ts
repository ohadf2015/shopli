import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DROP_RATIO,
  FETCH_CHUNK,
  REALERT_COOLDOWN_MS,
  buildDigestEmail,
  chunkIds,
  dropPercent,
  escapeHtml,
  isPriceDrop,
  pdpUrl,
  runPriceDropAlerts,
  safeRegion,
  shouldAlert,
  WatchRow,
  WatchStore,
  Subscriber,
} from '../lib/price-watch';

// --- pure drop-detection logic ---------------------------------------------

test('isPriceDrop: strictly more than 10% below baseline qualifies', () => {
  assert.equal(isPriceDrop(100, 89.99), true);
  assert.equal(isPriceDrop(100, 50), true);
});

test('isPriceDrop: exactly 10% below baseline does NOT qualify', () => {
  assert.equal(isPriceDrop(100, 90), false, 'boundary: last == baseline * DROP_RATIO is not a drop');
  assert.equal(DROP_RATIO, 0.9);
});

test('isPriceDrop: rises, flat prices and non-positive prices never qualify', () => {
  assert.equal(isPriceDrop(100, 100), false);
  assert.equal(isPriceDrop(100, 120), false);
  assert.equal(isPriceDrop(0, 0), false);
  assert.equal(isPriceDrop(100, 0), false, 'failed fetch (0) must not alert');
  assert.equal(isPriceDrop(0, 50), false, 'no baseline, no drop');
});

test('shouldAlert: never-alerted rows alert immediately', () => {
  assert.equal(shouldAlert({ alerted_at: null }, new Date()), true);
});

test('shouldAlert: 7-day cooldown suppresses recent alerts', () => {
  const now = new Date('2026-09-13T12:00:00Z');
  const recent = new Date(now.getTime() - REALERT_COOLDOWN_MS + 60_000);
  const old = new Date(now.getTime() - REALERT_COOLDOWN_MS - 60_000);
  assert.equal(shouldAlert({ alerted_at: recent }, now), false);
  assert.equal(shouldAlert({ alerted_at: old }, now), true);
  assert.equal(shouldAlert({ alerted_at: recent.toISOString() }, now), false, 'string timestamps work too');
});

test('chunkIds splits at the AliExpress 4-id fetch cap', () => {
  assert.equal(FETCH_CHUNK, 4);
  const ids = Array.from({ length: 9 }, (_, i) => String(1000000 + i));
  const chunks = chunkIds(ids);
  assert.deepEqual(chunks.map((c) => c.length), [4, 4, 1]);
  assert.deepEqual(chunks.flat(), ids);
  assert.deepEqual(chunkIds([]), []);
});

test('safeRegion accepts two-letter slugs and falls back to eu', () => {
  assert.equal(safeRegion('IL'), 'il');
  assert.equal(safeRegion(' de '), 'de');
  assert.equal(safeRegion('../../etc'), 'eu');
  assert.equal(safeRegion(''), 'eu');
  assert.equal(safeRegion(undefined), 'eu');
});

test('pdpUrl links back to the regional PDP', () => {
  assert.equal(pdpUrl('il', '1005007001'), 'https://www.tryshopli.com/il/product/1005007001');
  assert.equal(pdpUrl('bogus-region', '1005007001'), 'https://www.tryshopli.com/eu/product/1005007001');
});

test('escapeHtml neutralizes markup in product titles', () => {
  assert.equal(escapeHtml('<b>"x" & \'y\''), '&lt;b&gt;&quot;x&quot; &amp; &#39;y&#39;');
});

test('dropPercent rounds the real discount', () => {
  assert.equal(dropPercent(100, 85), 15);
  assert.equal(dropPercent(0, 85), 0);
});

test('buildDigestEmail: one email carries every dropped item with PDP links', () => {
  const items = [
    { productId: '111', title: 'A <script>', baselinePrice: 100, lastPrice: 80, currency: 'USD', url: pdpUrl('il', '111') },
    { productId: '222', title: 'B', baselinePrice: 50, lastPrice: 40, currency: 'ILS', url: pdpUrl('il', '222') },
  ];
  const digest = buildDigestEmail('il', items);
  assert.match(digest.subject, /2 saved items/);
  for (const it of items) {
    assert.ok(digest.html.includes(it.url), `html missing ${it.url}`);
    assert.ok(digest.text.includes(it.url), `text missing ${it.url}`);
  }
  assert.ok(!digest.html.includes('<script>'), 'title markup must be escaped');
  assert.ok(digest.html.includes('&#39;') === false, 'title has no apostrophes to escape here');
  assert.match(digest.html, /USD 100\.00/);
  assert.match(digest.html, /ILS 40\.00/);
});

// --- orchestration against an in-memory store -------------------------------

class MemStore implements WatchStore {
  subscribers: Subscriber[];
  rows = new Map<string, WatchRow>();
  constructor(subscribers: Subscriber[]) {
    this.subscribers = subscribers;
  }
  private key(email: string, region: string, id: string) {
    return `${email}|${region}|${id}`;
  }
  async loadSubscribers(limit: number) {
    return this.subscribers.slice(0, limit);
  }
  async loadWatch(email: string, region: string) {
    const map = new Map<string, WatchRow>();
    for (const [k, v] of this.rows) {
      if (k.startsWith(`${email}|${region}|`)) map.set(v.product_id, { ...v });
    }
    return map;
  }
  async upsertWatch(row: WatchRow) {
    this.rows.set(this.key(row.email, row.region, row.product_id), { ...row });
  }
  get(email: string, region: string, id: string) {
    return this.rows.get(this.key(email, region, id));
  }
}

type PriceBook = Record<string, { title: string; price: number; currency: string }>;

function freshPrices(): PriceBook {
  return {
    '1000001': { title: 'Widget A', price: 100, currency: 'USD' },
    '1000002': { title: 'Widget B', price: 200, currency: 'USD' },
  };
}

function makeDeps(prices: PriceBook, overrides: Partial<Parameters<typeof runPriceDropAlerts>[1]> = {}) {
  const sent: Array<{ to: string; subject: string; html: string; text: string }> = [];
  const deps = {
    fetchPrices: async (ids: string[]) =>
      ids
        .filter((id) => prices[id])
        .map((id) => ({ id, title: prices[id].title, price: prices[id].price, currency: prices[id].currency })),
    sendEmail: async (to: string, subject: string, html: string, text: string) => {
      sent.push({ to, subject, html, text });
      return true;
    },
    ...overrides,
  };
  return { deps, sent };
}

test('first sight snapshots a baseline and never alerts', async () => {
  const prices = freshPrices();
  const store = new MemStore([{ email: 'a@x.com', region: 'il', wishlistIds: ['1000001'] }]);
  const { deps, sent } = makeDeps(prices);
  const r = await runPriceDropAlerts(store, deps);
  assert.equal(r.baselinesSnapshotted, 1);
  assert.equal(r.drops, 0);
  assert.equal(sent.length, 0);
  const row = store.get('a@x.com', 'il', '1000001');
  assert.ok(row, 'watch row must exist after first sight');
  assert.equal(row!.baseline_price, 100);
  assert.equal(row!.alerted_at, null);
});

test('a >=10% drop on a later run sends ONE digest with all dropped items', async () => {
  const prices = freshPrices();
  const store = new MemStore([{ email: 'a@x.com', region: 'il', wishlistIds: ['1000001', '1000002'] }]);
  const { deps, sent } = makeDeps(prices);
  await runPriceDropAlerts(store, deps); // baselines
  prices['1000001'].price = 85; // -15%
  prices['1000002'].price = 170; // -15%
  const r = await runPriceDropAlerts(store, deps);
  assert.equal(r.drops, 2);
  assert.equal(r.emailsSent, 1, 'one digest per email address, never one per item');
  assert.equal(sent.length, 1);
  assert.equal(sent[0].to, 'a@x.com');
  assert.ok(sent[0].html.includes('/il/product/1000001'));
  assert.ok(sent[0].html.includes('/il/product/1000002'));
  const row = store.get('a@x.com', 'il', '1000001');
  assert.ok(row!.alerted_at, 'alerted_at marked after send');
  assert.equal(row!.baseline_price, 85, 'baseline re-anchors at the alert price');
});

test('alerted items stay quiet while the price holds (no weekly spam)', async () => {
  const prices = freshPrices();
  const store = new MemStore([{ email: 'a@x.com', region: 'eu', wishlistIds: ['1000001'] }]);
  const { deps, sent } = makeDeps(prices);
  await runPriceDropAlerts(store, deps);
  prices['1000001'].price = 80;
  await runPriceDropAlerts(store, deps); // alerts once, baseline re-anchors to 80
  const r = await runPriceDropAlerts(store, deps); // same price, same day
  assert.equal(r.drops, 0);
  assert.equal(sent.length, 1, 'no second email while the price holds');
});

test('a FURTHER >=10% drop after the cooldown alerts again', async () => {
  const prices = freshPrices();
  const store = new MemStore([{ email: 'a@x.com', region: 'eu', wishlistIds: ['1000001'] }]);
  const t0 = new Date('2026-09-01T00:00:00Z');
  const { deps, sent } = makeDeps(prices, { now: t0 });
  await runPriceDropAlerts(store, deps);
  prices['1000001'].price = 80;
  await runPriceDropAlerts(store, deps); // alert #1 at t0
  prices['1000001'].price = 70; // further -12.5% vs re-anchored 80
  const t8 = new Date(t0.getTime() + REALERT_COOLDOWN_MS + 86_400_000);
  const r = await runPriceDropAlerts(store, { ...deps, now: t8 });
  assert.equal(r.emailsSent, 1);
  assert.equal(sent.length, 2, 'second alert fires after cooldown on a further drop');
});

test('a further drop INSIDE the cooldown window is suppressed', async () => {
  const prices = freshPrices();
  const store = new MemStore([{ email: 'a@x.com', region: 'eu', wishlistIds: ['1000001'] }]);
  const t0 = new Date('2026-09-01T00:00:00Z');
  const { deps, sent } = makeDeps(prices, { now: t0 });
  await runPriceDropAlerts(store, deps);
  prices['1000001'].price = 80;
  await runPriceDropAlerts(store, deps);
  prices['1000001'].price = 70;
  const t2 = new Date(t0.getTime() + 2 * 86_400_000);
  const r = await runPriceDropAlerts(store, { ...deps, now: t2 });
  assert.equal(r.drops, 0, 'drop detected but suppressed by the 7-day cooldown');
  assert.equal(sent.length, 1);
});

test('dry run counts without sending or touching alerted_at', async () => {
  const prices = freshPrices();
  const store = new MemStore([{ email: 'a@x.com', region: 'eu', wishlistIds: ['1000001'] }]);
  const { deps, sent } = makeDeps(prices);
  await runPriceDropAlerts(store, deps);
  prices['1000001'].price = 50;
  const r = await runPriceDropAlerts(store, { ...deps, dryRun: true });
  assert.equal(r.dryRun, true);
  assert.equal(r.drops, 1);
  assert.equal(r.emailsWouldSend, 1);
  assert.equal(r.emailsSent, 0);
  assert.equal(sent.length, 0);
  assert.equal(store.get('a@x.com', 'eu', '1000001')!.alerted_at, null, 'dry run must not mark alerted_at');
});

test('a failed send does not mark alerted_at (retry next run)', async () => {
  const prices = freshPrices();
  const store = new MemStore([{ email: 'a@x.com', region: 'eu', wishlistIds: ['1000001'] }]);
  const { deps } = makeDeps(prices);
  await runPriceDropAlerts(store, deps);
  prices['1000001'].price = 50;
  const r = await runPriceDropAlerts(store, { ...deps, sendEmail: async () => false });
  assert.equal(r.sendFailures, 1);
  assert.equal(r.emailsSent, 0);
  assert.equal(store.get('a@x.com', 'eu', '1000001')!.alerted_at, null);
});

test('malformed wishlist ids are ignored, unknown products skipped', async () => {
  const store = new MemStore([
    { email: 'a@x.com', region: 'eu', wishlistIds: ['abc', '123', '9999999'] },
  ]);
  const { deps } = makeDeps(freshPrices());
  const r = await runPriceDropAlerts(store, deps);
  assert.equal(r.subscribers, 1);
  assert.equal(r.productsChecked, 0, '9999999 is not in the fake catalog; junk ids never reach fetch');
  assert.equal(r.baselinesSnapshotted, 0);
});

test('a product vanishing from the API leaves its watch row untouched', async () => {
  const store = new MemStore([{ email: 'a@x.com', region: 'eu', wishlistIds: ['1000001'] }]);
  const { deps } = makeDeps(freshPrices());
  await runPriceDropAlerts(store, deps);
  const before = { ...store.get('a@x.com', 'eu', '1000001')! };
  const r = await runPriceDropAlerts(store, { ...deps, fetchPrices: async () => [] });
  assert.equal(r.productsChecked, 0);
  assert.deepEqual(store.get('a@x.com', 'eu', '1000001'), before);
});
