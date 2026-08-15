import type { NextApiRequest, NextApiResponse } from 'next';
import { getPicks } from '../../../lib/picks';
import { buildPicksMessage, sendTelegramMessage } from '../../../lib/telegram';
import { getRegion, ALL_REGIONS } from '../../../lib/regions';

/**
 * The daily Telegram post, on a schedule.
 *
 * It used to live in two scripts nothing ever ran: no workflow, no cron, just
 * an npm script someone had to remember. A channel that posts when a laptop is
 * open is not a channel.
 *
 * Runs after the snapshot cron so today's picks exist. `?dry=1` returns the
 * message without sending, which is the only safe way to check formatting
 * against a live channel.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return res.status(503).json({ error: 'CRON_SECRET not configured' });
  if (req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const dry = req.query.dry === '1';
  const only = String(req.query.region || '').toLowerCase();
  const regions = only ? ALL_REGIONS.filter((r) => r.code === only) : ALL_REGIONS;
  const count = Math.min(parseInt(String(req.query.count || '5'), 10) || 5, 10);

  const out: Record<string, string> = {};
  for (const { code } of regions) {
    // Sequential: Telegram rate-limits a bot to roughly one message a second,
    // and nine regions in parallel is exactly how a bot gets throttled.
    const picks = await getPicks(code, { limit: 12 }).catch(() => []);
    const message = buildPicksMessage(code, picks, {
      currencySymbol: getRegion(code).currencySymbol,
      count,
    });

    if (!message) {
      out[code] = 'skipped: no picks';
      continue;
    }
    if (dry) {
      out[code] = message;
      continue;
    }
    const sent = await sendTelegramMessage(message);
    out[code] = sent.ok ? 'sent' : `failed: ${sent.error}`;
    await new Promise((r) => setTimeout(r, 1200));
  }

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ ok: true, dry, results: out });
}
