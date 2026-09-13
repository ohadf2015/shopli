import type { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless';
import { getProductsByIds } from '../../../lib/aliexpress';
import {
  createNeonWatchStore,
  ensureWatchTable,
  runPriceDropAlerts,
} from '../../../lib/price-watch';

/**
 * Daily price-drop alert cron — fulfills the wishlist page's "get notified
 * when prices drop on your saved items" promise. Reads
 * shopli_newsletter.wishlist_ids (captured since PR #32), re-fetches current
 * prices via the region-aware AliExpress client, snapshots baselines into
 * shopli_price_watch on first sight, and sends ONE digest email per
 * subscriber when any saved item drops >=10% below its baseline (7-day
 * re-alert cooldown per item; baseline re-anchors at the alert price so a
 * permanently-cheaper item does not spam weekly).
 *
 * Wired to Vercel Cron (see vercel.json), same CRON_SECRET bearer contract as
 * the other crons. Also runnable by hand:
 *   curl -H "Authorization: Bearer $CRON_SECRET" \
 *     "https://www.tryshopli.com/api/cron/price-drop?dry=1"
 *
 * ?dry=1 detects and counts without sending or touching alerted_at.
 * ?limit=N caps subscribers processed this run (default 200).
 *
 * Sending goes through the shared Resend account (RESEND_API_KEY /
 * RESEND_FROM_EMAIL). If those are not configured the endpoint 503s loudly —
 * no fallback sender, per task spec.
 */

const DEADLINE_MS = 240_000;

async function sendResendEmail(
  apiKey: string,
  from: string,
  to: string,
  subject: string,
  html: string,
  text: string,
): Promise<boolean> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to: [to], subject, html, text }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error(`[PRICE-DROP] resend ${res.status} for ${to}: ${body.slice(0, 200)}`);
  }
  return res.ok;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return res.status(503).json({ error: 'CRON_SECRET not configured' });
  if (req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  const dbUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
  if (!dbUrl) return res.status(503).json({ error: 'DATABASE_URL not configured' });
  const resendKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.RESEND_FROM_EMAIL;
  if (!resendKey || !resendFrom) {
    return res.status(503).json({ error: 'RESEND_API_KEY/RESEND_FROM_EMAIL not configured' });
  }

  const dry = req.query.dry === '1' || req.query.dry === 'true';
  const limit = Math.max(1, Math.min(1000, parseInt(String(req.query.limit || '200'), 10) || 200));

  const sql = neon(dbUrl);
  await ensureWatchTable(sql);
  const store = createNeonWatchStore(sql);

  const result = await runPriceDropAlerts(store, {
    fetchPrices: async (ids, region) => {
      const products = await getProductsByIds(ids, region);
      return products.map((p) => ({ id: p.id, title: p.title, price: p.price, currency: p.currency }));
    },
    sendEmail: (to, subject, html, text) =>
      sendResendEmail(resendKey, resendFrom, to, subject, html, text),
    dryRun: dry,
    limit,
    deadlineMs: DEADLINE_MS,
  });

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json(result);
}
