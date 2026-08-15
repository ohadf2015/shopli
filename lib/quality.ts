/**
 * Product quality gate.
 *
 * "Don't show bad products" needs a definition of bad that we can compute for
 * every product without a second network call. Two fields already ride along on
 * every affiliate search response and neither costs anything extra:
 *
 *   - `rating`   — AliExpress `evaluate_rate`, the seller's positive-feedback
 *                  percentage for this item, 0-100.
 *   - `volume`   — `lastest_volume`, lifetime orders.
 *
 * Deliberately NOT built on the review endpoint (lib/reviews.ts): that is a
 * second, undocumented upstream, and a gate that depends on it turns one bad
 * afternoon at feedback.aliexpress.com into empty collection pages sitewide.
 * Reviews enrich what we show; these two fields decide what we show.
 *
 * Thresholds measured 2026-08-15 over 395 live products from 20 collection
 * keywords (region il):
 *
 *   rate >= 85  keeps 96%    rate >= 94  keeps 65%
 *   rate >= 90  keeps 87%    rate >= 96  keeps 54%
 *   vol >= 100  keeps 98%    vol >= 500  keeps 94%
 *
 * Every threshold still covered all 20 keywords, so nothing here empties a
 * category. 90/100 was chosen as the floor because it drops the visible tail
 * (~13%) without thinning the catalogue enough to hurt; 94+ is used as a badge
 * tier instead of a floor, because dropping a third of the catalogue to reach
 * it would cost more traffic than it saves face.
 */

export const QUALITY_MIN_RATE = 90;
export const QUALITY_MIN_VOLUME = 100;

/** Anything with the fields the gate reads. */
export interface QualityInput {
  rating?: number;
  volume?: number;
}

export type QualityTier = 'top' | 'good' | 'weak';

/**
 * The floor. Below this a product does not get shown in a ranked list.
 *
 * A product with no rating at all is NOT rejected: measured, 0% of live
 * products came back with `evaluate_rate` 0, so a zero here means "the API
 * didn't tell us" far more often than it means "buyers hated it", and rejecting
 * on it would silently drop whole responses during a bad API patch.
 */
export function passesQualityGate(p: QualityInput): boolean {
  const rating = p.rating ?? 0;
  const volume = p.volume ?? 0;
  if (rating > 0 && rating < QUALITY_MIN_RATE) return false;
  if (volume > 0 && volume < QUALITY_MIN_VOLUME) return false;
  return true;
}

/**
 * 0-100, for ranking within the survivors. Rating dominates, volume is a
 * log-scaled confidence bonus — the difference between 200 and 2,000 orders
 * matters, the difference between 20,000 and 40,000 does not.
 *
 * Rating is rescaled over 80-100 rather than 0-100. Measured, live products
 * sit between 85% and 100%, so on the raw scale every product scores in the
 * same narrow band and volume ends up doing the ranking — a 92%-rated item
 * with 90k orders outranked a 98%-rated one. Stretching the band that actually
 * occurs is what makes the rating the ranking and popularity the tiebreaker.
 */
export function qualityScore(p: QualityInput): number {
  const rating = Math.max(0, Math.min(100, p.rating ?? 0));
  const volume = Math.max(0, p.volume ?? 0);
  const quality = Math.max(0, Math.min(1, (rating - 80) / 20));
  const confidence = Math.min(1, Math.log10(volume + 1) / 4); // 10k orders ≈ full marks
  return Math.round(quality * 85 + confidence * 15);
}

/** What the badge on the card says. */
export function qualityTier(p: QualityInput): QualityTier {
  const rating = p.rating ?? 0;
  const volume = p.volume ?? 0;
  if (rating >= 96 && volume >= 500) return 'top';
  if (passesQualityGate(p)) return 'good';
  return 'weak';
}

/**
 * Drop the products that fail the floor, best first.
 *
 * Fails open on purpose: if the gate would empty a non-empty list, the list is
 * returned ranked instead. An empty category page is a worse outcome than a
 * mediocre product on it, and this repo has already been burned once by a
 * transient upstream turning into hours of blank pages (see lib/cache.ts).
 */
export function filterQuality<T extends QualityInput>(items: T[]): T[] {
  const kept = items.filter(passesQualityGate);
  const out = kept.length > 0 ? kept : items.slice();
  return out.sort((a, b) => qualityScore(b) - qualityScore(a));
}
