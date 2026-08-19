/**
 * The pick ranking, as a disclosed algorithm anyone can re-run.
 *
 * lib/picks.ts already ranks deterministically — same snapshots in, same order
 * out — but "trust us, it's deterministic" is not something a reader can check.
 * Everything a pick's score is made of is a first-party measurement we already
 * serialise (recentPerDay, surge, dropPct, rating, volume), so the honest move
 * is to publish the inputs and the function, and let the client recompute the
 * order it was given.
 *
 * This module is that function. It is pure and imports nothing that touches a
 * database or the network (lib/quality.ts and lib/similar.ts are pure too), so
 * the same code runs on the server and in the browser. /api/products/picks
 * serves RANKING_SPEC with every response and, with ?verify=1, the full scored
 * candidate list the ranking ran over.
 *
 * Neutrality is structural, not a policy: ScoreInput is the ENTIRE input to the
 * score, and it has no commission, margin, sponsorship or seller field in it.
 * There is no term to weight, so there is nothing to audit. (This repo has no
 * sponsored inventory at all — commissionRate never reaches picks — so a
 * sponsored-below-organic rule would be vacuous here and is not implemented.)
 */

import { qualityScore } from './quality';
import { titleTokenOverlap } from './similar';

export const RANKING_ALGO_VERSION = 'picks-v1';

export type PickReason = 'surging' | 'price_drop' | 'bestseller';

/** Round-robin order, best first within each reason (see diversifyPicks). */
export const REASON_ORDER: PickReason[] = ['surging', 'price_drop', 'bestseller'];

/** Two titles this similar are the same product from a different seller. */
export const DUPLICATE_OVERLAP = 0.45;

/**
 * One per category. Nobody wants a list of five smart plugs — and measured
 * across regions, one-per-category still yields 9-12 picks (il 12, us 9, eu 10,
 * de 9, uk 9), which is more than the five a post or a game round uses. Two per
 * category filled the list to 12 but collapsed it to 7-8 distinct ideas.
 *
 * Non-IL regions bottom out around 9 because only IL sweeps the 78 collections;
 * the others see the ~10 trend categories (see the ponytail note in
 * /api/cron/trend-snapshot).
 */
export const MAX_PER_CATEGORY = 1;

/** The whole input to the score. Nothing outside this can move a product. */
export interface ScoreInput {
  /** Units sold per day between the two most recent readings. */
  recentPerDay: number;
  /** recentPerDay / perDay. 1 means steady; 3 means selling triple its usual rate. */
  surge: number;
  /** Percent below its own median price. */
  dropPct: number;
  /** AliExpress evaluate_rate, 0-100. */
  rating: number;
  /** Lifetime orders. */
  volume: number;
}

export interface ScoreTerms {
  momentum: number;
  surge: number;
  discount: number;
  quality: number;
  /** The published score: the four terms summed, then rounded to one decimal. */
  total: number;
}

const CAP = { momentum: 40, surge: 25, discount: 20, quality: 15 } as const;

/**
 * The published description of the algorithm, served with every ranked
 * response. Caps are read from the same constants the scorer uses, so the
 * disclosure cannot drift away from the code.
 */
export const RANKING_SPEC = {
  version: RANKING_ALGO_VERSION,
  /** Every field the score reads, and the only fields a client needs. */
  inputs: ['recentPerDay', 'surge', 'dropPct', 'rating', 'volume'] as const,
  terms: [
    { key: 'momentum', max: CAP.momentum, of: ['recentPerDay'], formula: 'min(40, log10(recentPerDay + 1) * 30)' },
    { key: 'surge', max: CAP.surge, of: ['surge'], formula: 'min(25, max(0, (surge - 1) * 12))' },
    { key: 'discount', max: CAP.discount, of: ['dropPct'], formula: 'min(20, max(0, dropPct))' },
    { key: 'quality', max: CAP.quality, of: ['rating', 'volume'], formula: 'qualityScore(rating, volume) / 100 * 15' },
  ],
  total: 'round(sum(terms) * 10) / 10',
  tieBreak: 'productId ascending',
  dedupe: { titleTokenOverlap: DUPLICATE_OVERLAP, maxPerCategory: MAX_PER_CATEGORY },
  diversify: REASON_ORDER,
  /** No commission, margin or sponsorship term exists — see the note above. */
  neutral: true,
} as const;

/**
 * How interesting, 0-100ish, broken into its terms.
 *
 * Momentum and a real discount are what make a product worth interrupting
 * someone for; quality decides whether it is worth showing at all (that gate
 * runs before this). Terms are returned at full precision and only the sum is
 * rounded — rounding each term first would give a client that sums them a
 * different number than the one it was served.
 */
export function scoreTerms(i: ScoreInput): ScoreTerms {
  const momentum = Math.min(CAP.momentum, Math.log10(i.recentPerDay + 1) * 30);
  const surge = Math.min(CAP.surge, Math.max(0, (i.surge - 1) * 12));
  const discount = Math.min(CAP.discount, Math.max(0, i.dropPct));
  const quality = (qualityScore({ rating: i.rating, volume: i.volume }) / 100) * CAP.quality;
  const total = Math.round((momentum + surge + discount + quality) * 10) / 10;
  return { momentum, surge, discount, quality, total };
}

/** The fields the ordering steps read, on top of the score inputs. */
export interface RankItem {
  productId: string;
  title: string;
  category?: string;
  reason: PickReason;
  score: number;
}

/**
 * Drop the same product sold by five different sellers, and stop one category
 * from eating the list.
 *
 * Live US picks before this: three Tuya smart sockets and two mini fans out of
 * twelve. Each was independently a legitimate mover — they are simply the same
 * thing, and a reader scanning the list sees one idea, not twelve.
 *
 * Title overlap reuses lib/similar.ts rather than a second implementation, and
 * runs on the already-ranked list so the best of each cluster is the one kept.
 */
export function dedupePicks<T extends { title: string; category?: string }>(
  ranked: T[],
  { maxPerCategory = MAX_PER_CATEGORY, seed = [] as T[] }: { maxPerCategory?: number; seed?: T[] } = {}
): T[] {
  const out: T[] = [...seed];
  const perCategory = new Map<string, number>();
  for (const p of out) {
    if (p.category) perCategory.set(p.category, (perCategory.get(p.category) || 0) + 1);
  }
  for (const p of ranked) {
    if (out.includes(p)) continue;
    if (out.some((k) => titleTokenOverlap(k.title, p.title) >= DUPLICATE_OVERLAP)) continue;
    const cat = p.category || '';
    if (cat) {
      const n = perCategory.get(cat) || 0;
      if (n >= maxPerCategory) continue;
      perCategory.set(cat, n + 1);
    }
    out.push(p);
  }
  return out;
}

/**
 * Round-robin across the three reasons, best first within each.
 *
 * Straight score order gives an all-surging list — momentum scores higher than
 * a discount by construction — and a page or a post that says "surging" five
 * times running is less useful than one that shows what is moving AND what
 * genuinely got cheaper. Round-robin, not a quota, so a reason with nothing in
 * it costs nothing: the remaining reasons just fill the list.
 *
 * Deterministic: same input order in, same output order out.
 */
export function diversifyPicks<T extends { reason: PickReason }>(picks: T[], limit: number): T[] {
  const buckets = REASON_ORDER.map((r) => picks.filter((p) => p.reason === r));
  const out: T[] = [];
  for (let round = 0; out.length < limit; round++) {
    let added = false;
    for (const bucket of buckets) {
      if (round >= bucket.length) continue;
      out.push(bucket[round]);
      added = true;
      if (out.length === limit) break;
    }
    if (!added) break; // every bucket exhausted
  }
  return out;
}

/**
 * Scored candidates in, the published list out. The whole ordering, in one
 * pure function, so the client runs exactly what the server ran.
 *
 * The seed reserves one slot for each reason before the category cap applies:
 * momentum outscores a discount by construction, so with one product per
 * category the best-scoring member of a category is almost always the surging
 * one — and it evicts that category's price_drop before the round-robin ever
 * sees it. Measured on live US data: one price-drop candidate existed and zero
 * survived.
 */
export function rankPicks<T extends RankItem>(
  candidates: T[],
  { limit = 12, reason }: { limit?: number; reason?: PickReason } = {}
): T[] {
  const scored = [...candidates].sort((a, b) => b.score - a.score || a.productId.localeCompare(b.productId));

  const seed: T[] = [];
  for (const r of REASON_ORDER) {
    const best = scored.find(
      (p) => p.reason === r && !seed.some((s) => titleTokenOverlap(s.title, p.title) >= DUPLICATE_OVERLAP)
    );
    if (best) seed.push(best);
  }

  const ranked = dedupePicks(scored, { seed });
  // A caller that asked for one reason already has the list it wants.
  return reason ? ranked.slice(0, limit) : diversifyPicks(ranked, limit);
}

export interface RankingVerdict {
  ok: boolean;
  /** Product ids whose served score does not match their served inputs. */
  badScores: string[];
  expectedOrder: string[];
  servedOrder: string[];
}

/**
 * Re-run the ranking over the disclosed inputs and check the order we were
 * given. This is the client's half of the deal, and it is the same code path
 * the server used — a divergence is a real divergence, not a reimplementation
 * bug.
 */
export function verifyRanking(
  candidates: Array<RankItem & ScoreInput>,
  served: Array<{ productId: string }>,
  { limit = 12, reason }: { limit?: number; reason?: PickReason } = {}
): RankingVerdict {
  const badScores = candidates.filter((c) => scoreTerms(c).total !== c.score).map((c) => c.productId);
  const expectedOrder = rankPicks(candidates, { limit, reason }).map((p) => p.productId);
  const servedOrder = served.map((p) => p.productId);
  const ok =
    badScores.length === 0 &&
    expectedOrder.length === servedOrder.length &&
    expectedOrder.every((id, n) => id === servedOrder[n]);
  return { ok, badScores, expectedOrder, servedOrder };
}
