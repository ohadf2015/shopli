// Deals newsletter — email capture + lead gen for Shopli
// Primary store: Neon Postgres via @neondatabase/serverless (fetch-based, serverless-safe).
// The table self-creates on first use so a fresh DB never 500s.

import { neon } from '@neondatabase/serverless';

export interface SignupResult {
  ok: boolean;
  message: string;
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
  tableReady = true;
}

export async function handleNewsletterSignup(email: string, region: string): Promise<SignupResult> {
  if (!email || !email.includes('@')) {
    return { ok: false, message: 'Invalid email address' };
  }

  const dbUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
  if (!dbUrl) {
    console.log(`[NEWSLETTER] no DATABASE_URL — dropping signup for ${email} (${region})`);
    return { ok: false, message: 'Service unavailable' };
  }

  try {
    const sql = neon(dbUrl);
    await ensureTable(sql);
    await sql`
      INSERT INTO shopli_newsletter (email, region, source)
      VALUES (${email.toLowerCase().trim()}, ${region}, 'shopli_web')
      ON CONFLICT (email, region) DO NOTHING
    `;
    return { ok: true, message: 'Subscribed!' };
  } catch (err) {
    console.error('[NEWSLETTER] insert failed:', err);
    return { ok: false, message: 'Service unavailable' };
  }
}
