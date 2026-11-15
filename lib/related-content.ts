/**
 * Hand-placed links between Shopli's three kinds of editorial page: collection
 * pages, buying guides (lib/blog.ts) and comparison articles
 * (lib/comparisons.ts).
 *
 * Until now each kind was an island: a guide never pointed at the collection
 * that sells what it recommends, a collection never pointed at the guide that
 * explains it, and neither linked the head-to-head comparison. Visitors who
 * finished one page had nowhere on-topic to go, and search engines saw 80+
 * collection pages with no editorial links in.
 *
 * Membership is explicit, not keyword-matched, for the same reason as
 * lib/collection-themes.ts: a fuzzy matcher would quietly link a skincare
 * guide to a gaming page. tests/related-content.test.ts asserts every slug here
 * exists, so a renamed page fails the build instead of shipping a dead link.
 * A new guide or comparison only needs one line below.
 */

/** Buying guide slug -> collection slugs it recommends products from. */
export const BLOG_COLLECTIONS: Record<string, string[]> = {
  'best-home-gym-under-500': ['home-gym'],
  'coffee-gear-guide-beginners': ['coffee-ritual', 'kitchen'],
  'standing-desk-setup-ergonomics': ['home-office', 'desk-wellness'],
  'best-wireless-earbuds-2026': ['wireless-audio'],
  'summer-gadgets-beat-heat-2026': ['summer-essentials'],
  'best-wireless-earbuds-under-30': ['wireless-audio'],
  'smart-home-beginners-guide': ['smart-home', 'lighting'],
  'pet-care-essentials-budget': ['pet'],
  'travel-hacks-gadgets-packing': ['travel'],
  'budget-gaming-mouse-keyboard': ['gaming-gear'],
  'best-wireless-earbuds-under-20-compared': ['wireless-audio'],
  'budget-streaming-setup-guide': ['content-creator'],
  'pet-accessories-roundup': ['pet'],
  'desk-wellness-setup-guide': ['desk-wellness', 'home-office'],
  'home-bar-starter-kit': ['home-bar'],
  'zero-waste-kitchen-swaps': ['zero-waste', 'kitchen'],
  'arduino-starter-kit-guide': ['maker-lab'],
};

/** Comparison article slug -> collection slugs that stock both sides. */
export const COMPARISON_COLLECTIONS: Record<string, string[]> = {
  'gaming-chair-vs-office-chair': ['gaming-gear', 'home-office'],
  'french-press-vs-drip': ['coffee-ritual'],
  'resistance-bands-vs-dumbbells': ['home-gym'],
  'ring-light-vs-softbox': ['content-creator', 'lighting'],
  'standing-desk-vs-converter': ['home-office', 'desk-wellness'],
  'mechanical-vs-membrane-keyboard': ['gaming-gear', 'home-office'],
  'portable-monitor-vs-tablet-second-screen': ['home-office', 'travel'],
  'instant-pot-vs-air-fryer': ['kitchen'],
  'air-fryer-vs-oven': ['kitchen'],
  'robot-vacuum-vs-stick-vacuum': ['smart-home'],
  'kindle-vs-tablet': ['travel'],
  'smart-plug-vs-smart-bulb': ['smart-home', 'lighting'],
  'usb-c-hub-vs-docking-station': ['home-office', 'phone-accessories'],
};

const invert = (map: Record<string, string[]>, collectionSlug: string): string[] =>
  Object.keys(map).filter((k) => map[k].includes(collectionSlug));

/** Guides and comparisons that belong on a collection page. */
export function relatedForCollection(collectionSlug: string): { blog: string[]; compare: string[] } {
  return {
    blog: invert(BLOG_COLLECTIONS, collectionSlug),
    compare: invert(COMPARISON_COLLECTIONS, collectionSlug),
  };
}

export function collectionsForBlog(blogSlug: string): string[] {
  return BLOG_COLLECTIONS[blogSlug] || [];
}

export function collectionsForComparison(comparisonSlug: string): string[] {
  return COMPARISON_COLLECTIONS[comparisonSlug] || [];
}
