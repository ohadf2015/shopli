/**
 * Real sales velocity, from AliExpress order counts we snapshot ourselves.
 *
 * `lib/trending.ts` scores on a VelocityMap of first-party clicks and views.
 * With the traffic this site currently has, that signal is cold and will stay
 * cold, so ranking falls back to lifetime popularity — which is why the same
 * products sit at the top week after week.
 *
 * AliExpress reports `volume`, a lifetime order count. Snapshot it daily and
 * the difference between snapshots is units sold per day, which is genuine
 * momentum and does not depend on our own traffic at all.
 *
 * Everything here fails open: with no DATABASE_URL, or on any query error,
 * callers get an empty map and ranking behaves exactly as it did before.
 */

export interface VolumeVelocity {
  /** Units sold per day, averaged over the observed window. */
  perDay: number;
  /** Days between the oldest snapshot used and now. */
  spanDays: number;
}

export type VolumeVelocityMap = Record<string, VolumeVelocity | undefined>;

/** The oldest reading in the window, before it is compared with live volume. */
export interface VolumeBaseline {
  volume: number;
  spanDays: number;
}

export type VolumeBaselineMap = Record<string, VolumeBaseline | undefined>;

function db() {
  const url = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
  if (!url) return null;
  try {
    // Required lazily so builds and local runs without the dep configured
    // don't pay for it, matching lib/newsletter.ts.
    const { neon } = require('@neondatabase/serverless');
    return neon(url);
  } catch {
    return null;
  }
}

let ensured = false;
async function ensureTable(sql: any): Promise<boolean> {
  if (ensured) return true;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS product_volume_snapshots (
        product_id TEXT NOT NULL,
        region     TEXT NOT NULL,
        volume     BIGINT NOT NULL,
        seen_on    DATE NOT NULL DEFAULT CURRENT_DATE,
        PRIMARY KEY (product_id, region, seen_on)
      )`;
    // Added after the table shipped, so it is a separate statement rather than
    // a column in the CREATE — existing rows keep a NULL price, which reads
    // correctly as "no reading that day".
    await sql`ALTER TABLE product_volume_snapshots ADD COLUMN IF NOT EXISTS price NUMERIC(12,2)`;
    ensured = true;
    return true;
  } catch {
    return false;
  }
}

/**
 * Record today's order count for each product. Idempotent per day — running
 * it twice overwrites rather than double-counting.
 */
export async function recordVolumes(
  region: string,
  products: Array<{ id?: string; volume?: number; price?: number }>
): Promise<number> {
  const sql = db();
  if (!sql) return 0;
  if (!(await ensureTable(sql))) return 0;

  const rows = products.filter((p) => p.id && typeof p.volume === 'number' && p.volume > 0);
  if (!rows.length) return 0;

  // One multi-row statement, not one round trip per product: a full sweep is
  // ~1,700 products across the regions, and sequential inserts took the cron
  // past Vercel's function limit.
  try {
    const ids = rows.map((p) => p.id as string);
    const volumes = rows.map((p) => String(p.volume));
    // Price rides along in the same statement. AliExpress "discounts" are quoted
    // against a list price the seller sets and can move at will, so the only way
    // to answer "is this actually cheap?" is our own record of what it cost on
    // previous days. Nothing reads this yet — it needs two readings to say
    // anything — but a day not collected is a day that cannot be backfilled.
    const prices = rows.map((p) => (typeof p.price === 'number' && p.price > 0 ? String(p.price) : null));
    await sql`
      INSERT INTO product_volume_snapshots (product_id, region, volume, price)
      SELECT id, ${region}, vol, pr
      FROM UNNEST(${ids}::text[], ${volumes}::bigint[], ${prices}::numeric[]) AS t(id, vol, pr)
      ON CONFLICT (product_id, region, seen_on)
      DO UPDATE SET volume = EXCLUDED.volume, price = COALESCE(EXCLUDED.price, product_volume_snapshots.price)`;
    return rows.length;
  } catch {
    return 0;
  }
}

/**
 * Units sold per day for each id, from the oldest snapshot within `windowDays`.
 *
 * Products with only today's snapshot are absent from the map rather than
 * present with perDay 0 — "no reading yet" and "sold nothing" must not rank
 * the same.
 */
export async function getVolumeBaselines(
  region: string,
  ids: string[],
  windowDays = 7
): Promise<VolumeBaselineMap> {
  const sql = db();
  if (!sql || !ids.length) return {};
  if (!(await ensureTable(sql))) return {};

  try {
    const rows: Array<{ product_id: string; volume: string | number; seen_on: string | Date }> = await sql`
      SELECT DISTINCT ON (product_id) product_id, volume, seen_on
      FROM product_volume_snapshots
      WHERE region = ${region}
        AND product_id = ANY(${ids})
        AND seen_on >= CURRENT_DATE - ${windowDays}::int
      ORDER BY product_id, seen_on ASC`;

    const now = Date.now();
    const out: VolumeBaselineMap = {};
    for (const r of rows) {
      const spanDays = Math.round((now - new Date(r.seen_on).getTime()) / 86400000);
      // A same-day baseline gives no elapsed time to divide by.
      if (spanDays < 1) continue;
      out[r.product_id] = { volume: Number(r.volume), spanDays };
    }
    return out;
  } catch {
    return {};
  }
}

/**
 * Units sold per day = (live volume - baseline volume) / days elapsed.
 *
 * Kept separate from the query so the caller can apply it to whatever live
 * product list it just fetched. Products without a usable baseline are absent
 * from the result rather than present with perDay 0 — "no reading yet" and
 * "sold nothing" must not rank the same.
 */
export function computeVolumeVelocity(
  baselines: VolumeBaselineMap,
  products: Array<{ id?: string; volume?: number }>
): VolumeVelocityMap {
  const out: VolumeVelocityMap = {};
  for (const p of products) {
    if (!p.id) continue;
    const base = baselines[p.id];
    if (!base || base.spanDays < 1) continue;
    const sold = (p.volume ?? 0) - base.volume;
    // Negative means AliExpress reset the counter or the item was re-listed;
    // that is a broken reading, not a decline.
    if (sold < 0) continue;
    out[p.id] = { perDay: sold / base.spanDays, spanDays: base.spanDays };
  }
  return out;
}
