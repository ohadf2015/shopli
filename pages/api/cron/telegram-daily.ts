import type { NextApiRequest, NextApiResponse } from 'next';
import { getPicks } from '../../../lib/picks';
import { getProductReviews } from '../../../lib/review-store';
import { buildPickPost, sendPickPost } from '../../../lib/telegram';
import { generatePromotionLinks } from '../../../lib/aliexpress';
import { getHebrewTitles } from '../../../lib/hebrew-titles';
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
  const count = Math.min(parseInt(String(req.query.count || '4'), 10) || 4, 10);

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
  const previews: Record<string, unknown> = {};
  for (const { code, chatId } of targets) {
    const picks = (await getPicks(code, { limit: 12 }).catch(() => [])).slice(0, count);
    if (!picks.length) {
      out[code] = 'skipped: no picks';
      continue;
    }
    const ids = picks.map((p) => p.productId);
    const [links, titles] = await Promise.all([
      generatePromotionLinks(ids).catch(() => new Map<string, string>()),
      getRegion(code).lang === 'he' ? getHebrewTitles(ids).catch(() => new Map<string, string>()) : new Map<string, string>(),
    ]);
    // Also warms the reviews, so the product pages these posts link to already have them.
    const reviews = await Promise.all(
      ids.map((id) => getProductReviews(id, code, { timeoutMs: 3000 }).catch(() => null))
    );
    const posts = picks.map((p, i) =>
      buildPickPost(code, p, {
        currencySymbol: getRegion(code).currencySymbol,
        reviews: reviews[i]?.writtenCount,
        buyLink: links.get(p.productId),
        title: titles.get(p.productId),
      })
    );

    if (dry) {
      previews[code] = posts;
      out[code] = `dry: ${posts.length} posts`;
      continue;
    }

    const errors: string[] = [];
    let target = chatId;
    for (const post of posts) {
      let sent = await sendPickPost(post, target);
      // Whether @handle or the numeric id works depends on how the bot was added.
      const fallback = process.env.TELEGRAM_CHANNEL_ID;
      if (!sent.ok && fallback && fallback !== target) {
        const retry = await sendPickPost(post, fallback);
        if (retry.ok) {
          target = fallback;
          sent = retry;
        }
      }
      if (!sent.ok) errors.push(sent.error || 'unknown');
      // Telegram throttles a bot at roughly one message a second per chat.
      await new Promise((r) => setTimeout(r, 1500));
    }
    out[code] = errors.length === posts.length
      ? `failed: ${errors[0]}`
      : `sent ${posts.length - errors.length}/${posts.length} to ${target}`;
  }

  // A 200 here hid a missing bot token for months; Vercel only flags a cron that errors.
  const failed = Object.entries(out).filter(([, r]) => r.startsWith('failed:'));
  if (failed.length) console.error('[TELEGRAM-DAILY]', JSON.stringify(Object.fromEntries(failed)));
  res.setHeader('Cache-Control', 'no-store');
  return res
    .status(failed.length ? 500 : 200)
    .json({ ok: !failed.length, dry, targets: targets.map((t) => t.code), results: out, ...(dry ? { previews } : {}) });
}
