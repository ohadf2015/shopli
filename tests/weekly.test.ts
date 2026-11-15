import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  addDays,
  buildWeeklyIssue,
  dedupeListings,
  issueDates,
  isIssueDate,
  isSunday,
  sundayOnOrBefore,
  weeklyInsights,
  FIRST_ISSUE,
  type ProductMeta,
  type Reading,
} from '../lib/weekly';

const END = '2026-11-15';

/** Daily readings for `days` days up to END: orders grow by `perDay`, prices from `price(i)`. */
function daily(days: number, perDay: number, price: (i: number) => number | null, vol0 = 5000): Reading[] {
  const out: Reading[] = [];
  for (let i = 0; i < days; i++) {
    out.push({ day: addDays(END, -(days - 1 - i)), volume: vol0 + i * perDay, price: price(i) });
  }
  return out;
}

function meta(title: string, extra: Partial<ProductMeta> = {}): ProductMeta {
  return { title, currency: 'ILS', imageUrl: 'https://img/x.jpg', rating: 98, category: 'Cables', ...extra };
}

test('issue dates are Sundays from the first issue, newest first', () => {
  assert.equal(isSunday('2026-11-15'), true);
  assert.equal(isSunday('2026-11-16'), false);
  assert.equal(sundayOnOrBefore('2026-11-21'), '2026-11-15');
  assert.equal(sundayOnOrBefore('2026-11-22'), '2026-11-22');
  assert.deepEqual(issueDates('2026-11-29'), ['2026-11-29', '2026-11-22', '2026-11-15']);
  assert.deepEqual(issueDates('2026-11-14'), []);
  assert.equal(isIssueDate(FIRST_ISSUE, '2026-11-20'), true);
  assert.equal(isIssueDate('2026-11-08', '2026-11-20'), false, 'before the first issue');
  assert.equal(isIssueDate('2026-11-22', '2026-11-20'), false, 'in the future');
  assert.equal(isIssueDate('2026-11-16', '2026-11-20'), false, 'not a Sunday');
});

test('sellers rank by orders per day over the week and respect the quality bar', () => {
  const series = new Map<string, Reading[]>([
    ['a', daily(20, 100, () => 10)],
    ['b', daily(20, 300, () => 10)],
    ['low-rating', daily(20, 900, () => 10)],
    ['few-orders', daily(20, 20, () => 10, 100)],
  ]);
  const m = new Map<string, ProductMeta>([
    ['a', meta('Phone stand aluminium')],
    ['b', meta('Lip balm moisturising')],
    ['low-rating', meta('Cheap earbuds', { rating: 90 })],
    ['few-orders', meta('Garden hose')],
  ]);
  const issue = buildWeeklyIssue('il', END, series, m);
  assert.deepEqual(issue.sellers.map((s) => s.id), ['b', 'a']);
  assert.equal(issue.sellers[0].perDay, 300);
  assert.equal(issue.sellers[0].weekOrders, 2100);
  assert.equal(issue.asOf, END);
});

test('a missing baseline day falls back to an earlier reading, never a later one', () => {
  // No reading 7 days back; the one 9 days back is used, so per-day stays honest.
  const rs = daily(20, 100, () => 10).filter((r) => r.day !== addDays(END, -7) && r.day !== addDays(END, -8));
  const issue = buildWeeklyIssue('il', END, new Map([['a', rs]]), new Map([['a', meta('Thing')]]));
  assert.equal(issue.sellers[0].spanDays, 9);
  assert.equal(issue.sellers[0].perDay, 100);
});

test('real drops are measured against the product\'s own median, not a list price', () => {
  // 30 days at 10, today 8: 20% under usual and the lowest recorded.
  const drop = daily(30, 20, (i) => (i === 29 ? 8 : 10));
  // Under its median but it was cheaper last week: not its low.
  const notLowest = daily(30, 20, (i) => (i === 29 ? 8.5 : i === 22 ? 7 : 10));
  // Only 5% under: not a real drop.
  const small = daily(30, 20, (i) => (i === 29 ? 9.5 : 10));
  // Too little history to know what "usual" is.
  const thin = daily(6, 20, (i) => (i === 5 ? 5 : 10));
  const series = new Map([
    ['drop', drop],
    ['notlow', notLowest],
    ['small', small],
    ['thin', thin],
  ]);
  const m = new Map([
    ['drop', meta('Silk sleep mask')],
    ['notlow', meta('LED desk lamp rechargeable')],
    ['small', meta('Nail brush set')],
    ['thin', meta('Hair dryer')],
  ]);
  const issue = buildWeeklyIssue('il', END, series, m);
  assert.deepEqual(issue.drops.map((d) => d.id), ['drop', 'notlow']);
  const [d, n] = issue.drops;
  assert.equal(d.usual, 10);
  assert.equal(d.dropPct, 20);
  assert.equal(d.isLowest, true);
  assert.equal(n.isLowest, false);
  assert.equal(n.low, 7);
  assert.equal(n.lowDay, addDays(END, -7));
  assert.equal(issue.stats.judged, 3);
  assert.equal(issue.stats.realDrops, 2);
});

test('a drop nobody buys, or with poor feedback, is not listed', () => {
  const series = new Map([
    ['dead', daily(30, 0, (i) => (i === 29 ? 5 : 10))],
    ['bad', daily(30, 20, (i) => (i === 29 ? 5 : 10))],
  ]);
  const m = new Map([
    ['dead', meta('Sunscreen')],
    ['bad', meta('Hair pen', { rating: 85 })],
  ]);
  const issue = buildWeeklyIssue('il', END, series, m);
  assert.equal(issue.drops.length, 0);
  assert.equal(issue.stats.realDrops, 2, 'still counted in the honest total');
});

test('listings sharing one order counter count once', () => {
  const series = new Map([
    ['x1', daily(20, 600, () => 6.29, 160000)],
    ['x2', daily(20, 600, () => 4.9, 160000)],
    ['y', daily(20, 100, () => 8)],
  ]);
  const m = new Map([
    ['x1', meta('USB-C cable 240W nylon fast charge')],
    ['x2', meta('Fast charge cable for Samsung and Xiaomi')],
    ['y', meta('Lip gloss')],
  ]);
  const issue = buildWeeklyIssue('il', END, series, m);
  assert.deepEqual(issue.sellers.map((s) => s.id), ['x1', 'y']);
  assert.equal(
    dedupeListings([
      { title: 'Toocki 100W USB-C cable fast charging', volume: 1 },
      { title: 'Toocki 100W USB-C cable fast charging', volume: 2 },
    ]).length,
    1
  );
});

test('categories compare this week with the week before, normalised per week', () => {
  const mk = (id: string, cat: string, early: number, late: number): [string, Reading[]] => [
    id,
    Array.from({ length: 15 }, (_, i) => ({
      day: addDays(END, -(14 - i)),
      volume: 1000 + (i <= 7 ? i * early : 7 * early + (i - 7) * late),
      price: 10,
    })),
  ];
  const series = new Map([
    mk('l1', 'Lip care', 10, 20),
    mk('l2', 'Lip care', 10, 20),
    mk('l3', 'Lip care', 10, 20),
    mk('c1', 'Cables', 30, 15),
    mk('c2', 'Cables', 30, 15),
    mk('c3', 'Cables', 30, 15),
    mk('s1', 'Small', 5, 50), // only one product: too thin to report
  ]);
  const m = new Map<string, ProductMeta>([...series.keys()].map((id) => [id, meta(`Item ${id}`, {
    category: id.startsWith('l') ? 'Lip care' : id.startsWith('c') ? 'Cables' : 'Small',
  })]));
  const issue = buildWeeklyIssue('eu', END, series, m);
  assert.deepEqual(issue.categories.map((c) => [c.category, c.changePct]), [['Lip care', 100], ['Cables', -50]]);
  assert.equal(issue.categories[0].weekOrders, 420);
  assert.equal(issue.categories[0].prevWeekOrders, 210);
});

test('a missed cron day still publishes from the latest reading; stale data publishes nothing', () => {
  const rs = daily(20, 100, () => 10).filter((r) => r.day !== END);
  const ok = buildWeeklyIssue('il', END, new Map([['a', rs]]), new Map([['a', meta('A')]]));
  assert.equal(ok.asOf, addDays(END, -1));
  assert.equal(ok.sellers.length, 1);

  const old = daily(20, 100, () => 10).map((r) => ({ ...r, day: addDays(r.day, -10) }));
  const stale = buildWeeklyIssue('il', END, new Map([['a', old]]), new Map([['a', meta('A')]]));
  assert.equal(stale.sellers.length, 0);
  assert.equal(stale.drops.length, 0);
});

test('products without a title or image never reach the page', () => {
  const series = new Map([['a', daily(20, 100, () => 10)]]);
  const issue = buildWeeklyIssue('il', END, series, new Map([['a', meta('A', { imageUrl: '' })]]));
  assert.equal(issue.sellers.length, 0);
});

test('insights only state what the issue shows', () => {
  const series = new Map([
    ['drop', daily(30, 20, (i) => (i === 29 ? 8 : 10))],
    ['dear', daily(30, 20, (i) => (i === 29 ? 12 : 10))],
    ['flat', daily(30, 20, () => 10)],
  ]);
  const m = new Map([
    ['drop', meta('Silk sleep mask')],
    ['dear', meta('Desk lamp')],
    ['flat', meta('Cable')],
  ]);
  const issue = buildWeeklyIssue('il', END, series, m);
  const en = weeklyInsights(issue, 'en');
  assert.match(en[0], /Of the 3 products/);
  assert.match(en[0], /only 1 \(33%\)/);
  assert.match(en[1], /^1 are 10% or more above/);
  assert.ok(en.some((s) => s.startsWith('Biggest real drop: Silk sleep mask')));
  assert.ok(en.some((s) => /lowest we've recorded/.test(s)));
  const he = weeklyInsights(issue, 'he');
  assert.equal(he.length, en.length);
});

test('deterministic: same input, same issue', () => {
  const series = new Map([
    ['b', daily(20, 100, () => 10, 7000)],
    ['a', daily(20, 100, () => 10)],
  ]);
  const m = new Map([
    ['a', meta('Alpha thing')],
    ['b', meta('Beta other')],
  ]);
  const one = buildWeeklyIssue('il', END, series, m);
  const two = buildWeeklyIssue('il', END, new Map([...series.entries()].reverse()), m);
  assert.deepEqual(one, two);
  assert.deepEqual(one.sellers.map((s) => s.id), ['a', 'b']);
});
