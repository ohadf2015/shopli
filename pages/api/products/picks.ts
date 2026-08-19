import type { NextApiRequest, NextApiResponse } from 'next';
import { getPickCandidates, type PickReason } from '../../../lib/picks';
import { RANKING_SPEC, rankPicks, scoreTerms } from '../../../lib/ranking';
import { getRegion, ALL_REGIONS } from '../../../lib/regions';
import { SITE_URL } from '../../../lib/seo';

/**
 * Today's picks, computed from our own price/volume history (lib/picks.ts).
 *
 * This is the shared source of truth for "what is worth showing today": the
 * site's movers rail, the swipe game and the Telegram channel all read it, so
 * the channel can no longer drift into promoting products the site does not
 * even rank. Every item carries a Shopli URL, not a raw affiliate link — a
 * broadcast should send people to the product page, where the buyer reviews and
 * the quality signals are.
 *
 * Reads only our own tables, so it is cheap and safe to cache.
 *
 * The ranking is disclosed, not asserted: every response carries the algorithm
 * spec and each pick carries the score broken into its terms, and `?verify=1`
 * adds the full scored candidate list the ranking ran over. A client that wants
 * to check the order it was given imports lib/ranking.ts (pure, no database)
 * and calls verifyRanking(candidates, picks) — same code the server ran, so a
 * mismatch means a real mismatch.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const region = String(req.query.region || 'il').toLowerCase();
  if (!ALL_REGIONS.some((r) => r.code === region)) {
    return res.status(400).json({ success: false, error: 'unknown region', picks: [] });
  }
  const limit = Math.min(parseInt(String(req.query.limit || '12'), 10) || 12, 50);
  const reasonParam = String(req.query.reason || '');
  const reason = (['surging', 'price_drop', 'bestseller'] as PickReason[]).find((r) => r === reasonParam);

  try {
    const candidates = await getPickCandidates(region, { reason });
    const picks = rankPicks(candidates, { limit, reason });
    const config = getRegion(region);
    // Empty is never cached long: the picks table is filled by a daily cron, and
    // a cron that has not run yet must not freeze an empty answer at the CDN.
    res.setHeader(
      'Cache-Control',
      picks.length ? 's-maxage=1800, stale-while-revalidate=3600' : 'public, s-maxage=30, must-revalidate'
    );
    res.status(200).json({
      success: true,
      region,
      currency: config.currency,
      currencySymbol: config.currencySymbol,
      ranking: { ...RANKING_SPEC, limit, reason: reason || null },
      picks: picks.map((p) => ({
        ...p,
        terms: scoreTerms(p),
        url: `${SITE_URL}/${region}/product/${p.productId}`,
      })),
      // Only on request: the candidate list is every qualifying product, which
      // is an order of magnitude more rows than the dozen we publish.
      ...(String(req.query.verify || '') === '1'
        ? {
            candidates: candidates.map((p) => ({
              productId: p.productId,
              title: p.title,
              category: p.category,
              reason: p.reason,
              score: p.score,
              recentPerDay: p.recentPerDay,
              surge: p.surge,
              dropPct: p.dropPct,
              rating: p.rating,
              volume: p.volume,
            })),
          }
        : {}),
    });
  } catch (error: any) {
    res.status(200).json({ success: false, error: error.message, picks: [] });
  }
}
