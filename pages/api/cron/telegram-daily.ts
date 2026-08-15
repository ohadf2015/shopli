import type { NextApiRequest, NextApiResponse } from 'next';
import { getPicks } from '../../../lib/picks';
import { getProductReviews } from '../../../lib/review-store';
import { buildPicksMessage, sendTelegramMessage } from '../../../lib/telegram';
import { getRegion, ALL_REGIONS } from '../../../lib/regions';

/**
 * The daily Telegram post, on a schedule.
 *
 * It used to live in two scripts nothing ever ran: no workflow, no cron, just
 * an npm script someone had to remember. A channel that posts when a laptop is
 * open is not a channel.
 *
 * Runs at 06:00, three hours after the snapshot sweep, so today's picks exist.
 * `?dry=1` returns the messages without sending; `scripts/telegram-preview.mjs`
 * does the same locally without needing CRON_SECRET, which is a Vercel
 * Sensitive variable and cannot be read back to trigger this by hand.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return res.status(503).json({ error: 'CRON_SECRET not configured' });
  if (req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const dry = req.query.dry === '1';
  const only = String(req.query.region || '').toLowerCase();
  const count = Math.min(parseInt(String(req.query.count || '5'), 10) || 5, 10);

  /**
   * A region posts only if it declares its own channel, and each channel is
   * posted to once. Two regions currently share one channel (il and ru are both
   * Israel, in Hebrew and Russian) — without the dedupe that channel would get
   * the same products twice a day in two languages.
   *
   * The env channel is only a manual override for an explicit ?region= run, so
   * a misconfigured variable cannot turn one cron into nine broadcasts.
   */
  const targets: Array<{ code: string; chatId: string }> = [];
  const seenChannels = new Set<string>();
  for (const { code } of ALL_REGIONS) {
    if (only && code !== only) continue;
    const channel = getRegion(code).tgChannel;
    const chatId = channel ? `@${channel}` : only === code ? process.env.TELEGRAM_CHANNEL_ID || '' : '';
    if (!chatId || seenChannels.has(chatId)) continue;
    seenChannels.add(chatId);
    targets.push({ code, chatId });
  }

  const out: Record<string, string> = {};
  for (const { code, chatId } of targets) {
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

    // Warm the reviews for what we are about to broadcast, so the product pages
    // these links land on already have them. This lives here rather than in the
    // snapshot cron: that function's headroom against its 300s ceiling is
    // unmeasured, and a snapshot day that gets truncated cannot be backfilled.
    for (const p of picks.slice(0, count)) {
      await getProductReviews(p.productId, code, { timeoutMs: 3000 }).catch(() => null);
    }

    let sent = await sendTelegramMessage(message, chatId);
    // A channel can be addressed by @username or by numeric id, and which one
    // works depends on how the bot was added and whether the channel is public.
    // The old scripts used TELEGRAM_CHANNEL_ID; if the handle is rejected, try
    // that before giving up, so day one is not a silent dead channel.
    const fallback = process.env.TELEGRAM_CHANNEL_ID;
    if (!sent.ok && fallback && fallback !== chatId) {
      const retry = await sendTelegramMessage(message, fallback);
      if (retry.ok) sent = { ok: true };
      else sent = { ok: false, error: `${sent.error} (fallback: ${retry.error})` };
    }
    out[code] = sent.ok ? `sent to ${chatId}` : `failed: ${sent.error}`;
    // Telegram throttles a bot at roughly one message a second.
    await new Promise((r) => setTimeout(r, 1200));
  }

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ ok: true, dry, targets: targets.map((t) => t.code), results: out });
}
