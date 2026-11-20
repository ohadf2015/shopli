/**
 * Database half of the Shopli Weekly (lib/weekly.ts holds the pure half).
 *
 * Kept in its own file so only getServerSideProps imports it: the issue view
 * imports lib/weekly.ts for its formatters, and anything that file required
 * would ship to the browser, the Neon driver included (see PR #89).
 */

import { PRICE_SERIES_START } from './verdict';
import {
  addDays,
  buildWeeklyIssue,
  PRICE_WINDOW_DAYS,
  type ProductMeta,
  type Reading,
  type WeeklyIssue,
  type WeeklyRegion,
} from './weekly';

// ---------------------------------------------------------------------------
// Neon reader. Fails open like everything else that reads snapshots: no
// database, or any error, gives an empty issue and the page says so.
// ---------------------------------------------------------------------------

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

export async function loadWeeklyIssue(region: WeeklyRegion, issueDate: string): Promise<WeeklyIssue | null> {
  const sql = db();
  if (!sql) return null;
  const from = addDays(issueDate, -(PRICE_WINDOW_DAYS + 3));
  try {
    // One aggregated row per product keeps the payload to ~700 rows for il,
    // not ~25,000. The arrays are [day, volume, price] in day order.
    const [snapRows, metaRows] = await Promise.all([
      sql`
        SELECT product_id,
               json_agg(json_build_array(to_char(seen_on, 'YYYY-MM-DD'), volume,
                 CASE WHEN seen_on >= ${PRICE_SERIES_START}::date OR ${issueDate}::date < ${PRICE_SERIES_START}::date THEN price END)
                 ORDER BY seen_on) AS s
        FROM product_volume_snapshots
        WHERE region = ${region}
          AND seen_on BETWEEN ${from}::date AND ${issueDate}::date
        GROUP BY product_id`,
      sql`
        SELECT product_id, title, currency, image_url, rating, product_type
        FROM feed_products
        WHERE region = ${region}`,
    ]);
    const series = new Map<string, Reading[]>();
    for (const r of snapRows as any[]) {
      const arr = Array.isArray(r.s) ? r.s : [];
      series.set(
        String(r.product_id),
        arr.map((x: any[]) => ({
          day: String(x[0]),
          volume: Number(x[1]),
          price: x[2] == null ? null : Number(x[2]),
        }))
      );
    }
    const meta = new Map<string, ProductMeta>();
    for (const r of metaRows as any[]) {
      meta.set(String(r.product_id), {
        title: String(r.title || ''),
        currency: String(r.currency || ''),
        imageUrl: String(r.image_url || ''),
        rating: Number(r.rating || 0),
        category: String(r.product_type || ''),
      });
    }
    return buildWeeklyIssue(region, issueDate, series, meta);
  } catch {
    return null;
  }
}

