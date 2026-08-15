import type { GmcFeedItem } from './gmc-feed';

/**
 * First-party product cache behind the Google Merchant Center feed.
 *
 * The feed route used to fan out a live AliExpress search per collection on
 * every uncached request — ~1,500 signed API calls against a key that
 * rate-limits ~10% of calls (see lib/aliexpress.ts), minutes of runtime, and
 * an error response cached as "no products". The feed is now generated from
 * this table, which the daily trend-snapshot cron fills from products it
 * already fetches. Zero live API calls per feed request.
 *
 * Everything here fails open, matching lib/trend-velocity.ts: with no
 * DATABASE_URL, or on any query error, writers no-op and readers get [] —
 * the feed route then falls back to a bounded live sample.
 */

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
/**
 * Exported because lib/picks.ts reads this table with its own connection and
 * needs the `rating` column to exist. Schema stays owned here rather than being
 * duplicated at the reader.
 */
export async function ensureFeedProductsTable(sql: any): Promise<boolean> {
  return ensureTable(sql);
}

async function ensureTable(sql: any): Promise<boolean> {
  if (ensured) return true;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS feed_products (
        product_id      TEXT NOT NULL,
        region          TEXT NOT NULL,
        title           TEXT NOT NULL,
        price           NUMERIC(12,2) NOT NULL,
        currency        TEXT NOT NULL DEFAULT 'ILS',
        image_url       TEXT NOT NULL DEFAULT '',
        brand           TEXT NOT NULL DEFAULT '',
        product_type    TEXT NOT NULL DEFAULT '',
        google_category TEXT NOT NULL DEFAULT '',
        volume          BIGINT NOT NULL DEFAULT 0,
        updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
        PRIMARY KEY (product_id, region)
      )`;
    // Added after the table shipped, so it is a separate statement rather than a
    // column in the CREATE. lib/picks.ts quality-gates on it; existing rows keep
    // 0, which reads as "unknown" and passes the gate rather than being culled.
    await sql`ALTER TABLE feed_products ADD COLUMN IF NOT EXISTS rating NUMERIC(5,2) NOT NULL DEFAULT 0`;
    ensured = true;
    return true;
  } catch {
    return false;
  }
}

/**
 * Upsert the products a sweep just saw. Items without a title, a positive
 * price or an image are dropped here too, so the store never holds a row
 * the feed would have to filter out anyway.
 */
export async function recordFeedProducts(region: string, items: GmcFeedItem[]): Promise<number> {
  const sql = db();
  if (!sql) return 0;
  if (!(await ensureTable(sql))) return 0;

  const rows = items.filter((p) => p.id && p.title && p.price > 0 && p.imageUrl);
  if (!rows.length) return 0;

  try {
    await sql`
      INSERT INTO feed_products (product_id, region, title, price, currency, image_url, brand, product_type, google_category, volume, rating)
      SELECT id, ${region}, t, pr, cur, img, br, pt, gc, vol, rt
      FROM UNNEST(
        ${rows.map((p) => p.id)}::text[],
        ${rows.map((p) => p.title.slice(0, 500))}::text[],
        ${rows.map((p) => String(p.price))}::numeric[],
        ${rows.map((p) => p.currency || '')}::text[],
        ${rows.map((p) => p.imageUrl)}::text[],
        ${rows.map((p) => (p.brand || '').slice(0, 200))}::text[],
        ${rows.map((p) => (p.productType || '').slice(0, 200))}::text[],
        ${rows.map((p) => p.googleCategory || '')}::text[],
        ${rows.map((p) => String(p.volume ?? 0))}::bigint[],
        ${rows.map((p) => String(p.rating ?? 0))}::numeric[]
      ) AS t(id, t, pr, cur, img, br, pt, gc, vol, rt)
      ON CONFLICT (product_id, region)
      DO UPDATE SET
        title           = EXCLUDED.title,
        price           = EXCLUDED.price,
        currency        = EXCLUDED.currency,
        image_url       = EXCLUDED.image_url,
        brand           = EXCLUDED.brand,
        product_type    = EXCLUDED.product_type,
        google_category = EXCLUDED.google_category,
        volume          = EXCLUDED.volume,
        rating          = EXCLUDED.rating,
        updated_at      = now()`;
    return rows.length;
  } catch {
    return 0;
  }
}

/**
 * Products for one region, best sellers first. `limit` keeps the XML under
 * GMC's file-size guidance even if the store grows past what a feed needs.
 */
export async function getFeedProducts(region: string, limit = 500): Promise<GmcFeedItem[]> {
  const sql = db();
  if (!sql) return [];
  if (!(await ensureTable(sql))) return [];

  try {
    const rows: Array<Record<string, any>> = await sql`
      SELECT product_id, title, price, currency, image_url, brand, product_type, google_category, volume
      FROM feed_products
      WHERE region = ${region}
      ORDER BY volume DESC, updated_at DESC
      LIMIT ${limit}`;
    return rows.map((r) => ({
      id: r.product_id,
      title: r.title,
      description: r.title,
      price: Number(r.price),
      currency: r.currency,
      imageUrl: r.image_url,
      brand: r.brand,
      productType: r.product_type,
      googleCategory: r.google_category,
      volume: Number(r.volume || 0),
    }));
  } catch {
    return [];
  }
}

/**
 * Drop rows no sweep has re-seen recently. A product that disappears from
 * AliExpress would otherwise stay in the feed forever, and GMC disapproves
 * items whose landing page 404s.
 */
export async function pruneFeedProducts(region: string, keepDays = 14): Promise<void> {
  const sql = db();
  if (!sql) return;
  if (!(await ensureTable(sql))) return;
  try {
    await sql`
      DELETE FROM feed_products
      WHERE region = ${region}
        AND updated_at < now() - (${keepDays}::text || ' days')::interval`;
  } catch { /* pruning is housekeeping; never fail the cron over it */ }
}
