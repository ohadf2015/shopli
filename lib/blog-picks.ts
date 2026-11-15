/**
 * Turning a buying guide's picks into listings.
 *
 * A guide names a pick ("70mai M310 Plus", "20,000 mAh power bank") and a
 * search keyword. The affiliate search returns results by order volume, and
 * for anything with an accessory market the best sellers are the accessories:
 * measured 2026-11-15, "Xiaomi Smart Band 10" returned 19 straps, chargers and
 * cases and not one band; "power bank 20000mAh 22.5W" put an empty 18650
 * battery shell (₪24) third. Under the old "best of the top three" rule either
 * one could become the card under a pick that recommends something else.
 *
 * `minPriceUsd` is the guard: a pick that sets it is resolved from a wider
 * result page with everything below the floor dropped first. The floor is
 * coarse on purpose (a $3 strap against a $40 watch), so the exchange rates
 * here are round numbers, not quotes.
 */
import { USD_TO_ILS_RATE } from './landed-cost';

export interface BlogPick {
  /** Stable id for the pick; also the caption when `label` has no entry. */
  name: string;
  /** Caption by language, e.g. { en: '20,000 mAh', he: '20,000 מיליאמפר' }. */
  label?: Record<string, string>;
  keyword: string;
  /** Drop results cheaper than this (in USD) before choosing the listing. */
  minPriceUsd?: number;
}

/** USD per one unit of each currency. Rough: only used for a price floor. */
const USD_PER_UNIT: Record<string, number> = {
  USD: 1,
  EUR: 1.16,
  GBP: 1.32,
  ILS: 1 / USD_TO_ILS_RATE,
};

export function priceInUsd(price: number, currency?: string): number | null {
  const rate = USD_PER_UNIT[(currency || '').trim().toUpperCase()];
  if (rate == null || !Number.isFinite(price)) return null;
  return price * rate;
}

/** Result page size to ask for: wider when a floor will thin the results. */
export function pickPageSize(pick: BlogPick): number {
  return pick.minPriceUsd ? 20 : 6;
}

/**
 * The results a pick may be resolved to, in the order the API returned them.
 * A result in a currency we cannot convert is kept: the floor exists to drop
 * accessories, and failing closed on an unknown currency would empty the pick.
 */
export function pickCandidates<T extends { price: number; currency?: string }>(
  products: T[],
  minPriceUsd?: number
): T[] {
  if (!minPriceUsd) return products;
  return products.filter((p) => {
    const usd = priceInUsd(p.price, p.currency);
    return usd == null || usd >= minPriceUsd;
  });
}
