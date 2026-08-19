import { passesQualityGate } from './quality';
import { ensureFeedProductsTable } from './feed-store';
import { rankPicks, scoreTerms, type PickReason } from './ranking';

/**
 * "What's actually interesting today", computed from our own history.
 *
 * The old answer was a hardcoded weekday rotation in scripts/telegram-daily.js:
 * Monday meant content-creator, Tuesday meant balcony-garden, forever, whatever
 * the market was doing. Nothing about it was a fact about products.
 *
 * We already snapshot every catalogue product's lifetime order count and price
 * once a day (lib/trend-velocity.ts, /api/cron/trend-snapshot). Measured
 * 2026-08-15 on 30 days of history for region il: 763 of 831 products have two
 * or more readings, 223 are selling right now, 44 are at least 10% below their
 * own median price, and 22 are selling at more than double their own recent
 * rate. That is a real, first-party answer to "what is moving", and none of it
 * depends on our own traffic.
 *
 * Three reasons a product is interesting, in priority order:
 *   surging     — selling far faster this week than it has been
 *   price_drop  — cheaper than its OWN median, which is the only honest
 *                 discount signal available; AliExpress "discounts" are quoted
 *                 against a list price the seller can set to anything
 *   bestseller  — simply selling a lot, every day
 *
 * Deterministic: same snapshots in, same ranking out, ties broken by product id.
 * No sampling, no shuffling, no model in the loop.
 *
 * This file is the measurement half — reading snapshots, deciding what counts
 * as a mover. The scoring and ordering half lives in lib/ranking.ts, which is
 * pure and database-free so a browser can re-run it over the inputs we publish
 * and check the order it was served (/api/products/picks?verify=1).
 */

// Only the two the existing callers use. Everything else — rankPicks,
// RANKING_SPEC, verifyRanking — is imported from lib/ranking directly, because
// reaching them through this file drags feed-store, and with it the Neon
// driver, into whatever bundle does the reaching.
export { dedupePicks, diversifyPicks } from './ranking';
export type { PickReason, ScoreInput, ScoreTerms } from './ranking';

export interface PickSnapshot {
  productId: string;
  seenOn: string;
  volume: number;
  price: number | null;
}

export interface PickMetrics {
  productId: string;
  /** Units sold per day across the whole observed window. */
  perDay: number;
  /** Units sold per day between the two most recent readings. */
  recentPerDay: number;
  /** recentPerDay / perDay. 1 means steady; 3 means selling triple its usual rate. */
  surge: number;
  spanDays: number;
  priceNow: number | null;
  priceMedian: number | null;
  /** Percent below its own median price. Negative means it got more expensive. */
  dropPct: number;
}

export interface Pick extends PickMetrics {
  title: string;
  price: number;
  currency: string;
  imageUrl: string;
  rating: number;
  volume: number;
  /** The collection or trend label this product was swept under. */
  category: string;
  reason: PickReason;
  score: number;
}

/** A product needs this many units/day before "surging" means anything. */
const SURGE_MIN_PER_DAY = 3;
const SURGE_RATIO = 2;
const DROP_MIN_PCT = 10;

/**
 * A discount on something nobody buys is not a deal, it is a clearance shelf.
 * Measured on live picks, this was letting through a sunscreen selling 0/day
 * and a ₪98 bath-bomb set at 5/day purely because the price moved.
 */
const DROP_MIN_PER_DAY = 3;

/** "Best seller" has to mean something; 1 unit a day is not a best seller. */
const BESTSELLER_MIN_PER_DAY = 10;

/**
 * Picks are the showcase — the Telegram post, the game, the rails — so they
 * clear a higher bar than the catalogue floor (lib/quality.ts, 90%). Measured
 * over 395 live products, 65% of the catalogue is 94%+, which is far more than
 * a dozen picks needs.
 */
const PICK_MIN_RATE = 94;

/**
 * Collapse one product's snapshots into the numbers a pick is judged on.
 * Pure, so the thresholds are testable without a database.
 */
export function aggregateSnapshots(snaps: PickSnapshot[]): PickMetrics | null {
  if (snaps.length < 2) return null; // one reading is not a trend
  const sorted = [...snaps].sort((a, b) => a.seenOn.localeCompare(b.seenOn));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const days = Math.max(1, Math.round((Date.parse(last.seenOn) - Date.parse(first.seenOn)) / 86400000));

  const sold = last.volume - first.volume;
  // A negative difference means AliExpress reset the counter or the item was
  // relisted. That is a broken reading, not a decline.
  if (sold < 0) return null;
  const perDay = sold / days;

  const prev = sorted[sorted.length - 2];
  const recentDays = Math.max(1, Math.round((Date.parse(last.seenOn) - Date.parse(prev.seenOn)) / 86400000));
  const recentSold = Math.max(0, last.volume - prev.volume);
  const recentPerDay = recentSold / recentDays;

  const prices = sorted.map((s) => s.price).filter((p): p is number => typeof p === 'number' && p > 0).sort((a, b) => a - b);
  // True median, averaging the middle pair on an even count. With only two
  // readings the naive version returns the higher one, which turns a price rise
  // into "no change" instead of a rise.
  const mid = prices.length >> 1;
  const priceMedian = prices.length
    ? (prices.length % 2 ? prices[mid] : (prices[mid - 1] + prices[mid]) / 2)
    : null;
  const priceNow = typeof last.price === 'number' && last.price > 0 ? last.price : null;
  const dropPct = priceMedian && priceNow ? Math.round((1 - priceNow / priceMedian) * 100) : 0;

  return {
    productId: last.productId,
    perDay,
    recentPerDay,
    surge: perDay > 0 ? recentPerDay / perDay : 0,
    spanDays: days,
    priceNow,
    priceMedian,
    dropPct,
  };
}

export function pickReason(m: PickMetrics): PickReason | null {
  if (m.recentPerDay >= SURGE_MIN_PER_DAY && m.surge >= SURGE_RATIO) return 'surging';
  if (m.dropPct >= DROP_MIN_PCT && m.recentPerDay >= DROP_MIN_PER_DAY) return 'price_drop';
  if (m.perDay >= BESTSELLER_MIN_PER_DAY) return 'bestseller';
  return null;
}

/**
 * How interesting, 0-100ish. The terms and their weights live in
 * lib/ranking.ts, which is what the client re-runs.
 */
export function scorePick(m: PickMetrics, rating: number, volume: number): number {
  return scoreTerms({ ...m, rating, volume }).total;
}

function db() {
  const url = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
  if (!url) return null;
  try {
    const { neon } = require('@neondatabase/serverless');
    return neon(url);
  } catch {
    return null;
  }
}

/**
 * Every product that qualifies as a pick today, scored, best first — before
 * de-duplication and diversification pick the published dozen.
 *
 * This is the disclosed input to the ranking: /api/products/picks?verify=1
 * serves it so a client can re-run rankPicks() over it and confirm the order it
 * was given.
 *
 * Reads only our own tables — no AliExpress call — so this is safe to hit from
 * a cron, an API route and a page render alike. Fails open: with no database
 * the caller gets [] and falls back to whatever it showed before.
 */
export async function getPickCandidates(
  region: string,
  { windowDays = 14, reason }: { windowDays?: number; reason?: PickReason } = {}
): Promise<Pick[]> {
  const sql = db();
  if (!sql) return [];
  // feed_products.rating was added after that table shipped; without this the
  // SELECT below fails on a database that has not run a sweep since.
  if (!(await ensureFeedProductsTable(sql))) return [];

  let rows: Array<Record<string, any>>;
  try {
    rows = await sql`
      SELECT s.product_id, s.seen_on, s.volume, s.price,
             f.title, f.currency, f.image_url, f.rating, f.product_type
      FROM product_volume_snapshots s
      JOIN feed_products f ON f.product_id = s.product_id AND f.region = s.region
      WHERE s.region = ${region}
        AND s.seen_on >= CURRENT_DATE - ${windowDays}::int
      ORDER BY s.product_id, s.seen_on ASC`;
  } catch {
    return [];
  }

  const byProduct = new Map<string, { snaps: PickSnapshot[]; meta: Record<string, any> }>();
  for (const r of rows) {
    const id = String(r.product_id);
    if (!byProduct.has(id)) byProduct.set(id, { snaps: [], meta: r });
    byProduct.get(id)!.snaps.push({
      productId: id,
      seenOn: new Date(r.seen_on).toISOString().slice(0, 10),
      volume: Number(r.volume),
      price: r.price == null ? null : Number(r.price),
    });
  }

  const picks: Pick[] = [];
  for (const { snaps, meta } of byProduct.values()) {
    const m = aggregateSnapshots(snaps);
    if (!m) continue;
    const rating = Number(meta.rating || 0);
    const volume = snaps[snaps.length - 1].volume;
    // Quality first: a surging product nobody should buy is not a good pick.
    if (!passesQualityGate({ rating, volume })) continue;
    // And picks clear the higher showcase bar, not just the catalogue floor.
    // A rating of 0 means the sweep has not rated it yet, not that it is bad.
    if (rating > 0 && rating < PICK_MIN_RATE) continue;
    const why = pickReason(m);
    if (!why) continue;
    if (reason && why !== reason) continue;
    picks.push({
      ...m,
      title: String(meta.title || ''),
      price: m.priceNow ?? 0,
      currency: String(meta.currency || ''),
      imageUrl: String(meta.image_url || ''),
      rating,
      volume,
      category: String(meta.product_type || ''),
      reason: why,
      score: scorePick(m, rating, volume),
    });
  }

  return picks
    .filter((p) => p.title && p.imageUrl && p.price > 0)
    .sort((a, b) => b.score - a.score || a.productId.localeCompare(b.productId));
}

/** Today's published picks for a region, best first. */
export async function getPicks(
  region: string,
  { limit = 12, windowDays = 14, reason }: { limit?: number; windowDays?: number; reason?: PickReason } = {}
): Promise<Pick[]> {
  return rankPicks(await getPickCandidates(region, { windowDays, reason }), { limit, reason });
}

/**
 * Two decoys around the real price.
 *
 * The first version always returned {0.42x, 1x, 2.1x} and rotated the order,
 * which meant the answer was ALWAYS the middle number when sorted — sort the
 * three, take the median, win every round without looking at the product. The
 * shape of the spread now varies too: sometimes both decoys are above the real
 * price, sometimes both below, sometimes either side.
 *
 * Derived from the product id rather than a random number, so today's game is
 * the same for everyone and the server and client render identically.
 */
export function buildPriceOptions(price: number, productId: string): number[] {
  const round2 = (n: number) => Math.round(n * 100) / 100;
  const seed = [...productId].reduce((a, ch) => a + ch.charCodeAt(0), 0);

  const shapes: Array<[number, number]> = [
    [0.42, 2.1],   // one either side
    [1.55, 2.4],   // both above — the real price is the cheapest option
    [0.34, 0.62],  // both below — the real price is the dearest option
  ];
  const [a, b] = shapes[seed % shapes.length];

  const opts = [price, round2(Math.max(0.5, price * a)), round2(Math.max(0.5, price * b))];
  // Rounding can collide on cheap items (0.5 floor, or two multipliers landing
  // on the same cent). A duplicate option would give the answer away.
  for (let i = 1; i < opts.length; i++) {
    while (opts.slice(0, i).includes(opts[i])) opts[i] = round2(opts[i] + 0.5);
  }

  const shift = Math.floor(seed / shapes.length) % opts.length;
  return [...opts.slice(shift), ...opts.slice(0, shift)];
}
