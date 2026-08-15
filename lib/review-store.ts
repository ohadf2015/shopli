import { fetchProductReviews, type ProductReviews } from './reviews';

/**
 * Read-through cache for buyer reviews.
 *
 * Reviews come from an undocumented, keyless AliExpress endpoint
 * (lib/reviews.ts). Calling it on every product render would put a second
 * unmetered upstream on the critical path of a site that has already lost hours
 * of pages to exactly that failure mode (see lib/cache.ts). So: first render of
 * a product pays one fetch and writes the answer here; every later render reads
 * the row until it goes stale.
 *
 * Reviews on a product with thousands of ratings move slowly, so a week-old row
 * is not a worse answer — it is the same answer, cheaper.
 *
 * Everything fails open, matching lib/feed-store.ts and lib/trend-velocity.ts:
 * with no DATABASE_URL, or on any query error, the store is transparent and the
 * caller just does a live fetch.
 */

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

let ensured = false;
async function ensureTable(sql: any): Promise<boolean> {
  if (ensured) return true;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS product_reviews (
        product_id    TEXT NOT NULL,
        region        TEXT NOT NULL,
        payload       JSONB NOT NULL,
        rating_count  INTEGER NOT NULL DEFAULT 0,
        average_stars NUMERIC(3,2) NOT NULL DEFAULT 0,
        updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
        PRIMARY KEY (product_id, region)
      )`;
    ensured = true;
    return true;
  } catch {
    return false;
  }
}

const FRESH_DAYS = 7;

async function readRow(region: string, productId: string): Promise<{ reviews: ProductReviews; ageDays: number } | null> {
  const sql = db();
  if (!sql) return null;
  if (!(await ensureTable(sql))) return null;
  try {
    const rows: Array<{ payload: any; updated_at: string | Date }> = await sql`
      SELECT payload, updated_at FROM product_reviews
      WHERE region = ${region} AND product_id = ${productId}
      LIMIT 1`;
    if (!rows.length) return null;
    const ageDays = (Date.now() - new Date(rows[0].updated_at).getTime()) / 86400000;
    const payload = typeof rows[0].payload === 'string' ? JSON.parse(rows[0].payload) : rows[0].payload;
    return { reviews: payload as ProductReviews, ageDays };
  } catch {
    return null;
  }
}

export async function saveProductReviews(region: string, r: ProductReviews): Promise<void> {
  const sql = db();
  if (!sql) return;
  if (!(await ensureTable(sql))) return;
  try {
    await sql`
      INSERT INTO product_reviews (product_id, region, payload, rating_count, average_stars)
      VALUES (${r.productId}, ${region}, ${JSON.stringify(r)}::jsonb, ${r.ratingCount}, ${r.averageStars})
      ON CONFLICT (product_id, region)
      DO UPDATE SET payload = EXCLUDED.payload,
                    rating_count = EXCLUDED.rating_count,
                    average_stars = EXCLUDED.average_stars,
                    updated_at = now()`;
  } catch { /* the cache is an optimisation; never fail a render over it */ }
}

/**
 * Reviews for one product: fresh row, else live fetch, else whatever stale row
 * we have. Stale beats empty — the alternative is a PDP that loses its reviews
 * every time the upstream has a bad minute.
 */
export async function getProductReviews(
  productId: string,
  region: string,
  opts: { timeoutMs?: number } = {}
): Promise<ProductReviews | null> {
  const cached = await readRow(region, productId);
  if (cached && cached.ageDays < FRESH_DAYS) return cached.reviews;

  const live = await fetchProductReviews(productId, region, opts);
  if (live) {
    await saveProductReviews(region, live);
    return live;
  }
  return cached?.reviews ?? null;
}

/**
 * Rating counts for a batch of products, from the store only — never a fetch.
 *
 * Cards in a grid must not each trigger an upstream call, so a listing shows
 * the real count for the products a PDP view or the cron has already warmed,
 * and shows nothing for the rest. Nothing is honest; "0 reviews" was not.
 */
export async function getReviewCounts(
  region: string,
  productIds: string[]
): Promise<Record<string, { ratingCount: number; averageStars: number }>> {
  const sql = db();
  if (!sql || !productIds.length) return {};
  if (!(await ensureTable(sql))) return {};
  try {
    const rows: Array<{ product_id: string; rating_count: number; average_stars: string }> = await sql`
      SELECT product_id, rating_count, average_stars
      FROM product_reviews
      WHERE region = ${region} AND product_id = ANY(${productIds})`;
    const out: Record<string, { ratingCount: number; averageStars: number }> = {};
    for (const r of rows) {
      out[r.product_id] = { ratingCount: Number(r.rating_count), averageStars: Number(r.average_stars) };
    }
    return out;
  } catch {
    return {};
  }
}
