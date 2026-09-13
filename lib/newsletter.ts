// Deals newsletter — email capture + lead gen for Shopli
// Primary store: Neon Postgres via @neondatabase/serverless (fetch-based, serverless-safe).
// The table self-creates on first use so a fresh DB never 500s.

import { neon } from '@neondatabase/serverless';

export interface SignupResult {
  ok: boolean;
  message: string;
}

export interface SignupOptions {
  /** True when the signup came from the wishlist page's price-drop promise. */
  wishlist?: boolean;
  /** AliExpress product ids the subscriber saved — the first-party data that
   *  makes a price-drop alert (and any re-engagement mail) possible. */
  items?: unknown;
}

/** Keep only plausible AliExpress numeric ids, capped so the column stays small. */
export function sanitizeWishlistIds(items: unknown): string[] {
  if (!Array.isArray(items)) return [];
  const out: string[] = [];
  for (const raw of items) {
    const id = String(raw ?? '').trim();
    if (/^\d{6,20}$/.test(id) && !out.includes(id)) out.push(id);
    if (out.length >= 50) break;
  }
  return out;
}

let tableReady = false;

async function ensureTable(sql: ReturnType<typeof neon>) {
  if (tableReady) return;
  await sql`
    CREATE TABLE IF NOT EXISTS shopli_newsletter (
      id BIGSERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      region TEXT NOT NULL DEFAULT 'eu',
      source TEXT NOT NULL DEFAULT 'shopli_web',
      subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS shopli_newsletter_email_region_idx
    ON shopli_newsletter (email, region)
  `;
  // Added 2026-09-13: product ids behind the wishlist price-drop promise.
  // The form always promised alerts on saved items but only stored the email,
  // so the data needed to ever fulfill it was discarded at capture time.
  await sql`
    ALTER TABLE shopli_newsletter
    ADD COLUMN IF NOT EXISTS wishlist_ids JSONB
  `;
  tableReady = true;
}

export async function handleNewsletterSignup(
  email: string,
  region: string,
  opts: SignupOptions = {},
): Promise<SignupResult> {
  if (!email || !email.includes('@')) {
    return { ok: false, message: 'Invalid email address' };
  }

  const dbUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
  if (!dbUrl) {
    console.log(`[NEWSLETTER] no DATABASE_URL — dropping signup for ${email} (${region})`);
    return { ok: false, message: 'Service unavailable' };
  }

  const wishlistIds = opts.wishlist ? sanitizeWishlistIds(opts.items) : [];
  const source = opts.wishlist ? 'shopli_wishlist' : 'shopli_web';

  try {
    const sql = neon(dbUrl);
    await ensureTable(sql);
    await sql`
      INSERT INTO shopli_newsletter (email, region, source, wishlist_ids)
      VALUES (
        ${email.toLowerCase().trim()},
        ${region},
        ${source},
        ${wishlistIds.length ? JSON.stringify(wishlistIds) : null}
      )
      ON CONFLICT (email, region) DO UPDATE SET
        wishlist_ids = COALESCE(EXCLUDED.wishlist_ids, shopli_newsletter.wishlist_ids),
        source = CASE
          WHEN EXCLUDED.source = 'shopli_wishlist' THEN 'shopli_wishlist'
          ELSE shopli_newsletter.source
        END
    `;
    return { ok: true, message: 'Subscribed!' };
  } catch (err) {
    console.error('[NEWSLETTER] insert failed:', err);
    return { ok: false, message: 'Service unavailable' };
  }
}
