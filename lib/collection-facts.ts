/**
 * "At a glance" facts for a collection page, computed from the products the
 * page is already showing.
 *
 * 70 of the 83 collections have no hand-written guide (lib/collection-content),
 * so their page was a one-line description and four cards: nothing a shopper
 * could not get on AliExpress itself, and nothing for a search engine or an AI
 * answer to quote. These facts are true by construction — every number comes
 * from the live listing on the page — so they add substance without anyone
 * having to write, or invent, copy for 70 niches.
 */

export interface FactProduct {
  id: string;
  title: string;
  price: number;
  rating?: number; // 0-100, AliExpress positive-feedback rate
  volume?: number; // lifetime orders
  affiliateLink?: string;
  imageUrl?: string;
}

export interface CollectionFacts {
  count: number;
  minPrice: number;
  maxPrice: number;
  /** Highest rated pick; ties broken by orders. Null when nothing is rated. */
  topRated: FactProduct | null;
  /** Most ordered pick, unless that is the topRated product. */
  mostOrdered: FactProduct | null;
  /** Cheapest pick, unless that is already shown above. */
  cheapest: FactProduct | null;
  totalOrders: number;
}

const priced = (p: FactProduct) => Number.isFinite(p.price) && p.price > 0;

export function collectionFacts(products: FactProduct[]): CollectionFacts | null {
  const seen = new Set<string>();
  const list = products.filter((p) => {
    if (!p?.id || seen.has(p.id) || !priced(p)) return false;
    seen.add(p.id);
    return true;
  });
  // Three picks out of two products is a table, not an insight.
  if (list.length < 3) return null;

  const prices = list.map((p) => p.price);
  const rated = list.filter((p) => (p.rating || 0) > 0);
  const topRated = rated.length
    ? [...rated].sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.volume || 0) - (a.volume || 0))[0]
    : null;
  // Each label must be literally true across the whole list, so a slot whose
  // winner already holds an earlier slot is dropped rather than handed to the
  // runner-up ("Lowest price" on something that is not the lowest price).
  const byOrders = [...list].sort((a, b) => (b.volume || 0) - (a.volume || 0))[0];
  const mostOrdered = (byOrders.volume || 0) > 0 && byOrders.id !== topRated?.id ? byOrders : null;
  const byPrice = [...list].sort((a, b) => a.price - b.price)[0];
  const cheapest = byPrice.id !== topRated?.id && byPrice.id !== mostOrdered?.id ? byPrice : null;

  return {
    count: list.length,
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
    topRated,
    mostOrdered,
    cheapest,
    totalOrders: list.reduce((s, p) => s + (p.volume || 0), 0),
  };
}

/** AliExpress positive-feedback percent shown as the site's 5-star scale. */
export const stars = (rating?: number) => ((rating || 0) / 20).toFixed(1);

export function formatOrders(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(n);
}
