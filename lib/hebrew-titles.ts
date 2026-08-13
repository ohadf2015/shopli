/**
 * Natural Hebrew product titles.
 *
 * The AliExpress affiliate API's target_language=HE returns literal machine
 * translations of keyword-stuffed listing titles ("TIMEMORE צרפתי עיתונות
 * עיתונות, מכונת קפה תה" — literally "french press press, coffee machine
 * tea"). To a native speaker they read as spam, and they are the h3 on every
 * card and the text of every WhatsApp share on /il — the market shopli
 * targets hardest.
 *
 * The fix is an override table: a batch job (pages/api/cron/hebrew-titles.ts)
 * rewrites each garbled title into a short natural Hebrew title with an LLM
 * and stores it here. Render paths (lib/aliexpress.ts) swap the override in
 * for the API title and keep the full original on `originalTitle`.
 *
 * Everything fails open, matching lib/feed-store.ts: with no DATABASE_URL,
 * or on any query error, readers get an empty map and the site keeps the
 * sanitized API titles it had before.
 */

function db() {
  const url = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
  if (!url) return null;
  try {
    // Required lazily so builds and local runs without the dep configured
    // don't pay for it, matching lib/feed-store.ts.
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
      CREATE TABLE IF NOT EXISTS hebrew_titles (
        product_id   TEXT PRIMARY KEY,
        title        TEXT NOT NULL,
        source_title TEXT NOT NULL DEFAULT '',
        updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
    ensured = true;
    return true;
  } catch {
    return false;
  }
}

/**
 * Overrides for a set of product ids. One round-trip for the whole page; a
 * miss simply means the product keeps its API title.
 */
export async function getHebrewTitles(ids: string[]): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  const clean = [...new Set(ids.map((id) => String(id || '').trim()).filter(Boolean))];
  if (!clean.length) return out;
  const sql = db();
  if (!sql) return out;
  if (!(await ensureTable(sql))) return out;
  try {
    const rows: Array<Record<string, any>> = await sql`
      SELECT product_id, title FROM hebrew_titles
      WHERE product_id = ANY(${clean}::text[])`;
    for (const r of rows) {
      if (r.product_id && r.title) out.set(String(r.product_id), String(r.title));
    }
  } catch { /* fail open */ }
  return out;
}

export async function saveHebrewTitles(
  rows: Array<{ id: string; title: string; sourceTitle?: string }>
): Promise<number> {
  const sql = db();
  if (!sql) return 0;
  if (!(await ensureTable(sql))) return 0;
  const clean = rows.filter((r) => r.id && r.title);
  if (!clean.length) return 0;
  try {
    await sql`
      INSERT INTO hebrew_titles (product_id, title, source_title)
      SELECT id, t, s
      FROM UNNEST(
        ${clean.map((r) => r.id)}::text[],
        ${clean.map((r) => r.title.slice(0, 120))}::text[],
        ${clean.map((r) => (r.sourceTitle || '').slice(0, 500))}::text[]
      ) AS t(id, t, s)
      ON CONFLICT (product_id)
      DO UPDATE SET
        title        = EXCLUDED.title,
        source_title = EXCLUDED.source_title,
        updated_at   = now()`;
    return clean.length;
  } catch {
    return 0;
  }
}

/**
 * Products from the il feed store that still have no override, best sellers
 * first — the batch generator's work queue.
 */
export async function getProductsMissingHebrewTitles(
  limit = 30
): Promise<Array<{ id: string; title: string; productType: string }>> {
  const sql = db();
  if (!sql) return [];
  if (!(await ensureTable(sql))) return [];
  try {
    const rows: Array<Record<string, any>> = await sql`
      SELECT f.product_id, f.title, f.product_type
      FROM feed_products f
      LEFT JOIN hebrew_titles h ON h.product_id = f.product_id
      WHERE f.region = 'il' AND h.product_id IS NULL
      ORDER BY f.volume DESC, f.updated_at DESC
      LIMIT ${limit}`;
    return rows.map((r) => ({
      id: String(r.product_id),
      title: String(r.title || ''),
      productType: String(r.product_type || ''),
    }));
  } catch {
    return [];
  }
}

/**
 * Validate one LLM-generated title before it can reach a page. Rejects
 * anything that would look as broken as what we are replacing: no Hebrew,
 * a near-copy of the source, or keyword-stuffing length.
 */
export function cleanGeneratedTitle(raw: unknown, sourceTitle: string): string | null {
  if (typeof raw !== 'string') return null;
  const title = raw.replace(/\s+/g, ' ').replace(/^["'`]+|["'`]+$/g, '').trim();
  if (!/[א-ת]/.test(title)) return null;
  if (title.length < 4 || title.length > 60) return null;
  const words = title.split(' ').length;
  if (words < 2 || words > 8) return null;
  if (sourceTitle && title === sourceTitle.trim()) return null;
  // No sizes / model-number junk the prompt told the model to drop.
  if (/\d\s?(מ"מ|מיליליטר|אונקיה|ml|oz|V\b|W\b)/i.test(title)) return null;
  return title;
}

/**
 * Parse the LLM's reply into {id, title} pairs. Tolerates the ```json fence
 * every model adds despite being told not to, and prose around the array.
 */
export function parseGeneratedTitles(text: string): Array<{ id: string; title: unknown }> {
  if (!text) return [];
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) return [];
  try {
    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((r) => r && typeof r === 'object' && r.id != null);
  } catch {
    return [];
  }
}
