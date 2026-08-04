/**
 * Deterministic "find similar" recommender — pure functions, no I/O.
 *
 * similarity_score =
 *   40 * category_match +
 *   25 * title_token_overlap +
 *   15 * price_band_match +
 *   10 * rating_quality +
 *   10 * discount_strength
 *
 * Rules: exclude source; same top-level category for the first 3 results;
 * price band ±40% unless fewer than `limit` matches; prefer rating >= 90
 * (≈4.5/5 on AliExpress evaluate_rate); cap at 6 results.
 */

import { discountPct } from './trending';

export const SIMILAR_ALGO_VERSION = 'weighted-v1';

export interface SimilarCandidate {
  id: string;
  title: string;
  price: number;
  originalPrice?: number | null;
  discount?: string;
  /** 0–100 (AliExpress evaluate_rate) */
  rating: number;
  volume: number;
  category: string;
  imageUrl: string;
  affiliateLink: string;
  currency: string;
}

export type SimilarChip = 'same_category' | 'similar_price' | 'higher_rated' | 'bigger_discount';

export interface SimilarResult {
  product: SimilarCandidate;
  score: number;
  chips: SimilarChip[];
  algorithmVersion: string;
}

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'for', 'with', 'of', 'to', 'in', 'on', 'at',
  'new', 'hot', 'sale', 'free', 'shipping', 'dropshipping', 'wholesale',
]);

export function tokenizeTitle(title: string): string[] {
  const tokens = String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9א-ת\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t) && !/^\d+(\.\d+)?$/.test(t));
  return [...new Set(tokens)];
}

export function titleTokenOverlap(a: string, b: string): number {
  const ta = new Set(tokenizeTitle(a));
  const tb = new Set(tokenizeTitle(b));
  if (ta.size === 0 || tb.size === 0) return 0;
  let intersection = 0;
  for (const t of ta) if (tb.has(t)) intersection++;
  const union = ta.size + tb.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/** 1 inside ±40% of source price, linear decay to 0 at 2x band width. */
export function priceBandMatch(sourcePrice: number, candidatePrice: number): number {
  if (sourcePrice <= 0 || candidatePrice <= 0) return 0;
  const band = sourcePrice * 0.4;
  const dist = Math.abs(candidatePrice - sourcePrice);
  if (dist <= band) return 1;
  if (dist >= band * 2) return 0;
  return 1 - (dist - band) / band;
}

export function similarityScore(
  source: SimilarCandidate,
  candidate: SimilarCandidate
): { score: number; chips: SimilarChip[] } {
  const categoryMatch =
    source.category && candidate.category && source.category === candidate.category ? 1 : 0;
  const tokenOverlap = titleTokenOverlap(source.title, candidate.title);
  const priceMatch = priceBandMatch(source.price, candidate.price);
  // rating 0–100 → 0..1, with a floor so unrated products aren't zeroed
  const ratingQuality = candidate.rating > 0 ? candidate.rating / 100 : 0;
  const discountStrength = Math.min(1, discountPct(candidate) / 60);

  const score =
    40 * categoryMatch +
    25 * tokenOverlap +
    15 * priceMatch +
    10 * ratingQuality +
    10 * discountStrength;

  const chips: SimilarChip[] = [];
  if (categoryMatch === 1) chips.push('same_category');
  if (priceMatch === 1) chips.push('similar_price');
  if (candidate.rating >= 90 && candidate.rating > source.rating) chips.push('higher_rated');
  if (discountPct(candidate) > discountPct(source)) chips.push('bigger_discount');

  return { score: Math.round(score * 10) / 10, chips };
}

export function findSimilar(
  source: SimilarCandidate,
  candidates: SimilarCandidate[],
  opts: { limit?: number } = {}
): SimilarResult[] {
  const limit = Math.min(6, Math.max(1, opts.limit ?? 6));
  const seen = new Set<string>([source.id]);

  const scored = candidates
    .filter((c) => {
      if (!c.id || seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    })
    .map((product) => {
      const { score, chips } = similarityScore(source, product);
      return { product, score, chips, algorithmVersion: SIMILAR_ALGO_VERSION };
    });

  const inBand = scored.filter((r) => priceBandMatch(source.price, r.product.price) === 1);
  const usable = inBand.length >= limit ? inBand : scored;

  const sameCat = usable.filter((r) => r.product.category === source.category);
  const otherCat = usable.filter((r) => r.product.category !== source.category);
  const byScore = (a: SimilarResult, b: SimilarResult) =>
    b.score - a.score || (a.product.id < b.product.id ? -1 : 1);
  sameCat.sort(byScore);
  otherCat.sort(byScore);

  // Same-category fills the first 3 slots; remaining slots by score.
  const head = sameCat.slice(0, Math.min(3, limit));
  const restPool = [...sameCat.slice(head.length), ...otherCat].sort(byScore);
  const results = [...head, ...restPool].slice(0, limit);

  return results;
}

export const SIMILAR_CHIP_LABELS: Record<SimilarChip, { en: string; he: string }> = {
  same_category: { en: 'Same category', he: 'אותה קטגוריה' },
  similar_price: { en: 'Similar price', he: 'מחיר דומה' },
  higher_rated: { en: 'Higher rated', he: 'דירוג גבוה יותר' },
  bigger_discount: { en: 'Bigger discount', he: 'הנחה גדולה יותר' },
};
