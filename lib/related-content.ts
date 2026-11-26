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
  'best-power-bank-guide-2026': ['phone-accessories', 'travel'],
  'mini-projector-buying-guide-hy300': ['dorm-room', 'smart-home'],
  'best-dash-cam-70mai-guide': ['car'],
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

/**
 * Mood board slug -> collection slugs that sell the same kind of thing.
 * Guides and comparisons for a board are the ones that share a collection
 * with it, so a new guide only needs its line in BLOG_COLLECTIONS above.
 */
export const MOOD_COLLECTIONS: Record<string, string[]> = {
  'jack-sparrow': ['halloween'],
  'sushi-night': ['kitchen'],
  'mechanical-keyboard': ['gaming-gear', 'home-office'],
  'study-corner': ['back-to-school', 'dorm-room', 'home-office'],
  'beach-day': ['summer-essentials', 'travel', 'sun-care'],
  'home-bar': ['home-bar'],
  'morning-routine': ['coffee-ritual', 'sleep-sanctuary', 'aromatherapy'],
  'camping-coffee': ['camping', 'coffee-ritual'],
  'queen-esther': ['halloween'],
  pikachu: ['halloween'],
  'japandi-office': ['home-office', 'desk-wellness'],
  'gamer-den': ['gaming-gear', 'lighting'],
  'boho-bedroom': ['sleep-sanctuary', 'lighting'],
  'scandinavian-reading-nook': ['lighting', 'sleep-sanctuary'],
  'indoor-jungle': ['balcony-garden', 'microgreens'],
  spiderman: ['halloween'],
  'wonder-woman': ['halloween'],
  'ninja-turtle': ['halloween'],
  superman: ['halloween'],
  'digital-nomad': ['travel', 'phone-accessories', 'home-office'],
  'streaming-setup': ['content-creator', 'lighting'],
  'dessert-baking': ['kitchen'],
  'jewelry-making': ['jewelry-making', 'maker-lab'],
  'home-gym-pro': ['home-gym'],
  'kitchen-makeover': ['kitchen', 'zero-waste'],
  'nursery-room': ['sleep-sanctuary', 'lighting'],
  'craft-room': ['maker-lab', 'jewelry-making'],
  'back-to-school': ['back-to-school', 'dorm-room'],
  'wireless-audio': ['wireless-audio'],
  'phone-accessories': ['phone-accessories', 'gadgets-under-10'],
  'summer-essentials': ['summer-essentials', 'sun-care'],
  'budget-gaming-setup': ['gaming-gear'],
  'minimalist-desk': ['home-office', 'desk-wellness'],
  'pet-corner': ['pet'],
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

const overlaps = (map: Record<string, string[]>, collections: string[]): string[] =>
  Object.keys(map).filter((k) => map[k].some((c) => collections.includes(c)));

/** Collections, guides and comparisons that belong on a mood board page. */
export function relatedForMood(moodSlug: string): { collections: string[]; blog: string[]; compare: string[] } {
  const collections = MOOD_COLLECTIONS[moodSlug] || [];
  return {
    collections,
    blog: overlaps(BLOG_COLLECTIONS, collections),
    compare: overlaps(COMPARISON_COLLECTIONS, collections),
  };
}

/** Mood boards to link from a collection page. */
export function moodsForCollection(collectionSlug: string): string[] {
  return invert(MOOD_COLLECTIONS, collectionSlug);
}
