// Price-drop watch — fulfills the wishlist page's "get notified when prices
// drop on your saved items" promise. shopli_newsletter.wishlist_ids (captured
// since PR #32) is the input; this module snapshots a baseline price per
// (email, region, product_id) into shopli_price_watch, detects >=10% drops
// against that baseline, and hands ONE digest email per subscriber to an
// injected sender. The table self-creates on first use, same pattern as
// lib/newsletter.ts's ensureTable, so a fresh DB never 500s.
//
// All drop-detection logic is pure and unit-tested in tests/price-watch.test.ts;
// the Neon-backed store is injected behind WatchStore so the orchestration
// runs against an in-memory store in tests.

import { neon } from '@neondatabase/serverless';

/** A drop is last_price strictly under 90% of baseline — matches the
 *  movers-rail convention "no price_drop copy under a 10% drop" (PR #31). */
export const DROP_RATIO = 0.9;
/** Minimum gap between alerts for the same (email, region, product). */
export const REALERT_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;
/** getProductsByIds caps at 4 ids per call (lib/aliexpress.ts). */
export const FETCH_CHUNK = 4;

export interface WatchRow {
  email: string;
  region: string;
  product_id: string;
  baseline_price: number;
  last_price: number;
  last_checked_at: string | Date | null;
  alerted_at: string | Date | null;
}

export interface Subscriber {
  email: string;
  region: string;
  wishlistIds: string[];
}

export interface FetchedPrice {
  id: string;
  title: string;
  price: number;
  currency: string;
}

export interface DroppedItem {
  productId: string;
  title: string;
  baselinePrice: number;
  lastPrice: number;
  currency: string;
  url: string;
}

/** Strictly-greater-than-10% drop; a drop of exactly 10% does not qualify,
 *  and non-positive prices (failed/empty fetches) never trigger. */
export function isPriceDrop(baselinePrice: number, lastPrice: number): boolean {
  return baselinePrice > 0 && lastPrice > 0 && lastPrice < baselinePrice * DROP_RATIO;
}

/** True when this watch row may alert at `now`: never alerted, or the last
 *  alert is at least REALERT_COOLDOWN_MS old. */
export function shouldAlert(
  watch: { alerted_at: string | Date | null },
  now: Date,
): boolean {
  if (!watch.alerted_at) return true;
  const at = watch.alerted_at instanceof Date ? watch.alerted_at : new Date(watch.alerted_at);
  if (Number.isNaN(at.getTime())) return true;
  return now.getTime() - at.getTime() >= REALERT_COOLDOWN_MS;
}

export function chunkIds(ids: string[], size: number = FETCH_CHUNK): string[][] {
  const out: string[][] = [];
  for (let i = 0; i < ids.length; i += size) out.push(ids.slice(i, i + size));
  return out;
}

/** Region slugs are two lowercase letters; anything else falls back to eu so
 *  a malformed DB row can never produce a broken or off-site PDP link. */
export function safeRegion(region: unknown): string {
  const r = String(region || '').toLowerCase().trim();
  return /^[a-z]{2}$/.test(r) ? r : 'eu';
}

export function pdpUrl(region: string, productId: string): string {
  return `https://www.tryshopli.com/${safeRegion(region)}/product/${encodeURIComponent(productId)}`;
}

export function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function dropPercent(baselinePrice: number, lastPrice: number): number {
  if (baselinePrice <= 0) return 0;
  return Math.round((1 - lastPrice / baselinePrice) * 100);
}

function fmtPrice(currency: string, price: number): string {
  const c = /^[A-Z]{3}$/.test(currency) ? currency : 'USD';
  return `${c} ${price.toFixed(2)}`;
}

/** ONE digest per subscriber: every dropped item in a single email, each
 *  linking back to its PDP. Never one email per item. */
export function buildDigestEmail(
  region: string,
  items: DroppedItem[],
): { subject: string; html: string; text: string } {
  const n = items.length;
  const subject = `Price drop alert: ${n} saved item${n === 1 ? '' : 's'} just got cheaper`;
  const lines = items.map((it) => {
    const pct = dropPercent(it.baselinePrice, it.lastPrice);
    return { ...it, pct, safeTitle: escapeHtml(it.title) };
  });
  const html = [
    '<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#111">',
    `<h2 style="margin:0 0 12px">Prices dropped on ${n} item${n === 1 ? '' : 's'} you saved</h2>`,
    '<ul style="padding:0;list-style:none">',
    ...lines.map(
      (it) =>
        `<li style="margin:0 0 16px;padding:12px;border:1px solid #e5e5e5;border-radius:8px">` +
        `<div style="font-weight:600;margin-bottom:4px">${it.safeTitle}</div>` +
        `<div style="margin-bottom:8px"><s style="color:#888">${fmtPrice(it.currency, it.baselinePrice)}</s>` +
        ` &rarr; <b style="color:#0a7f3f">${fmtPrice(it.currency, it.lastPrice)}</b>` +
        ` <span style="color:#0a7f3f">(-${it.pct}%)</span></div>` +
        `<a href="${it.url}" style="color:#fff;background:#111;padding:8px 14px;border-radius:6px;text-decoration:none">View deal</a>` +
        `</li>`,
    ),
    '</ul>',
    '<p style="color:#888;font-size:12px">You are getting this because you saved items to your wishlist on tryshopli.com and asked for price-drop alerts.</p>',
    '</div>',
  ].join('');
  const text = [
    `Prices dropped on ${n} item${n === 1 ? '' : 's'} you saved:`,
    '',
    ...lines.map(
      (it) =>
        `- ${it.title}: ${fmtPrice(it.currency, it.baselinePrice)} -> ${fmtPrice(it.currency, it.lastPrice)} (-${it.pct}%)\n  ${it.url}`,
    ),
    '',
    'You are getting this because you saved items to your wishlist on tryshopli.com and asked for price-drop alerts.',
  ].join('\n');
  return { subject, html, text };
}

/** Storage behind the orchestration — the Neon implementation is below,
 *  tests inject an in-memory one. */
export interface WatchStore {
  loadSubscribers(limit: number): Promise<Subscriber[]>;
  loadWatch(email: string, region: string): Promise<Map<string, WatchRow>>;
  upsertWatch(row: WatchRow): Promise<void>;
}

export interface PriceDropDeps {
  fetchPrices: (ids: string[], region: string) => Promise<FetchedPrice[]>;
  sendEmail: (to: string, subject: string, html: string, text: string) => Promise<boolean>;
  /** Dry run: detect and count, but never send and never touch alerted_at. */
  dryRun?: boolean;
  /** Max subscribers processed this run (default 200). */
  limit?: number;
  /** Soft deadline in ms — stops starting new subscribers past it (default 240s). */
  deadlineMs?: number;
  now?: Date;
}

export interface PriceDropResult {
  ok: boolean;
  dryRun: boolean;
  subscribers: number;
  productsChecked: number;
  baselinesSnapshotted: number;
  drops: number;
  emailsSent: number;
  emailsWouldSend: number;
  sendFailures: number;
  skippedDeadline: boolean;
  ms: number;
}

export async function runPriceDropAlerts(
  store: WatchStore,
  deps: PriceDropDeps,
): Promise<PriceDropResult> {
  const started = Date.now();
  const now = deps.now || new Date();
  const limit = Math.max(1, Math.min(1000, deps.limit ?? 200));
  const deadlineMs = deps.deadlineMs ?? 240_000;
  const dryRun = deps.dryRun === true;
  const result: PriceDropResult = {
    ok: true,
    dryRun,
    subscribers: 0,
    productsChecked: 0,
    baselinesSnapshotted: 0,
    drops: 0,
    emailsSent: 0,
    emailsWouldSend: 0,
    sendFailures: 0,
    skippedDeadline: false,
    ms: 0,
  };

  const subscribers = await store.loadSubscribers(limit);
  for (const sub of subscribers) {
    if (Date.now() - started > deadlineMs) {
      result.skippedDeadline = true;
      break;
    }
    const ids = [...new Set(sub.wishlistIds)].filter((id) => /^\d{6,20}$/.test(id)).slice(0, 50);
    if (!ids.length) continue;
    result.subscribers++;
    const region = safeRegion(sub.region);

    const fetched = new Map<string, FetchedPrice>();
    for (const chunk of chunkIds(ids)) {
      const list = await deps.fetchPrices(chunk, region).catch(() => [] as FetchedPrice[]);
      for (const p of list) {
        if (p && p.id && p.price > 0) fetched.set(p.id, p);
      }
    }
    if (!fetched.size) continue;

    const watch = await store.loadWatch(sub.email, region);
    const drops: DroppedItem[] = [];

    for (const [id, p] of fetched) {
      result.productsChecked++;
      const existing = watch.get(id);
      if (!existing) {
        // First sight: snapshot the baseline, never alert on it.
        await store.upsertWatch({
          email: sub.email,
          region,
          product_id: id,
          baseline_price: p.price,
          last_price: p.price,
          last_checked_at: now,
          alerted_at: null,
        });
        result.baselinesSnapshotted++;
        continue;
      }
      const dropped = isPriceDrop(existing.baseline_price, p.price);
      await store.upsertWatch({
        ...existing,
        last_price: p.price,
        last_checked_at: now,
      });
      if (dropped && shouldAlert(existing, now)) {
        result.drops++;
        drops.push({
          productId: id,
          title: p.title,
          baselinePrice: existing.baseline_price,
          lastPrice: p.price,
          currency: p.currency,
          url: pdpUrl(region, id),
        });
      }
    }

    if (!drops.length) continue;
    if (dryRun) {
      result.emailsWouldSend++;
      continue;
    }
    const digest = buildDigestEmail(region, drops);
    const sent = await deps
      .sendEmail(sub.email, digest.subject, digest.html, digest.text)
      .catch(() => false);
    if (sent) {
      result.emailsSent++;
      // Mark alerted AND re-anchor the baseline at the alert price: a product
      // that stays cheap must not re-alert every 7 days forever — the next
      // alert requires a FURTHER >=10% drop from the alerted price.
      for (const d of drops) {
        const row = watch.get(d.productId);
        if (!row) continue;
        await store.upsertWatch({
          ...row,
          baseline_price: d.lastPrice,
          last_price: d.lastPrice,
          last_checked_at: now,
          alerted_at: now,
        });
      }
    } else {
      result.sendFailures++;
    }
  }

  result.ms = Date.now() - started;
  return result;
}

// ---------------------------------------------------------------------------
// Neon-backed store
// ---------------------------------------------------------------------------

type Sql = ReturnType<typeof neon>;

let watchTableReady = false;

export async function ensureWatchTable(sql: Sql): Promise<void> {
  if (watchTableReady) return;
  await sql`
    CREATE TABLE IF NOT EXISTS shopli_price_watch (
      email TEXT NOT NULL,
      region TEXT NOT NULL DEFAULT 'eu',
      product_id TEXT NOT NULL,
      baseline_price DOUBLE PRECISION NOT NULL,
      last_price DOUBLE PRECISION NOT NULL,
      last_checked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      alerted_at TIMESTAMPTZ,
      PRIMARY KEY (email, region, product_id)
    )
  `;
  watchTableReady = true;
}

export function createNeonWatchStore(sql: Sql): WatchStore {
  return {
    async loadSubscribers(limit: number): Promise<Subscriber[]> {
      const rows = await sql`
        SELECT email, region, wishlist_ids
        FROM shopli_newsletter
        WHERE wishlist_ids IS NOT NULL
        ORDER BY id
        LIMIT ${limit}
      `;
      const out: Subscriber[] = [];
      for (const r of rows as any[]) {
        const raw = r.wishlist_ids;
        const ids = Array.isArray(raw) ? raw.map((x: unknown) => String(x)) : [];
        if (ids.length) out.push({ email: String(r.email), region: String(r.region), wishlistIds: ids });
      }
      return out;
    },
    async loadWatch(email: string, region: string): Promise<Map<string, WatchRow>> {
      const rows = await sql`
        SELECT email, region, product_id, baseline_price, last_price, last_checked_at, alerted_at
        FROM shopli_price_watch
        WHERE email = ${email} AND region = ${region}
      `;
      const map = new Map<string, WatchRow>();
      for (const r of rows as any[]) {
        map.set(String(r.product_id), {
          email: String(r.email),
          region: String(r.region),
          product_id: String(r.product_id),
          baseline_price: Number(r.baseline_price),
          last_price: Number(r.last_price),
          last_checked_at: r.last_checked_at ?? null,
          alerted_at: r.alerted_at ?? null,
        });
      }
      return map;
    },
    async upsertWatch(row: WatchRow): Promise<void> {
      await sql`
        INSERT INTO shopli_price_watch
          (email, region, product_id, baseline_price, last_price, last_checked_at, alerted_at)
        VALUES (
          ${row.email}, ${row.region}, ${row.product_id},
          ${row.baseline_price}, ${row.last_price},
          ${row.last_checked_at ? new Date(row.last_checked_at) : new Date()},
          ${row.alerted_at ? new Date(row.alerted_at) : null}
        )
        ON CONFLICT (email, region, product_id) DO UPDATE SET
          baseline_price = EXCLUDED.baseline_price,
          last_price = EXCLUDED.last_price,
          last_checked_at = EXCLUDED.last_checked_at,
          alerted_at = EXCLUDED.alerted_at
      `;
    },
  };
}
