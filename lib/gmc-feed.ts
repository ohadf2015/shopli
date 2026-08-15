import { SITE_URL } from './seo';
import { getRegion } from './regions';

/**
 * Google Merchant Center feed (RSS 2.0 + g: namespace).
 * Spec: https://support.google.com/merchants/answer/7052112
 *
 * The feed is what unlocks GMC free product listings — the one major free
 * discovery channel a catalog site has. Two hard rules baked in here:
 *
 * - `g:link` points at OUR product page, never the AliExpress affiliate URL.
 *   GMC disapproves items whose landing page is not on the claimed domain,
 *   and free listings require a landing page that shows price + availability
 *   (the PDP does). Monetization still happens on the PDP click-through.
 * - `g:identifier_exists=no`. AliExpress exposes no GTIN/barcode, and
 *   inventing one gets the feed disapproved.
 */

export interface GmcFeedItem {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  brand: string;
  /** Collection or trend-category label, localized for the region. */
  productType: string;
  googleCategory: string;
  /** Lifetime units sold — used only to order the feed, best sellers first. */
  volume?: number;
  /**
   * AliExpress positive-feedback percentage, 0-100. Not part of the GMC feed —
   * it rides along so the daily sweep persists it, which is what lets
   * lib/picks.ts quality-gate its picks without a live API call.
   */
  rating?: number;
}

// Google product category mapping for our collection categories
// https://support.google.com/merchants/answer/6324436
export const GOOGLE_CATEGORY_MAP: Record<string, string> = {
  'halloween': '209',          // Costumes
  'home-gym': '1581',          // Exercise & Fitness
  'home-office': '206',        // Office Supplies
  'smart-home': '478',         // Home Automation
  'kitchen': '488',            // Kitchen & Dining
  'travel': '357',             // Luggage & Bags
  'camping': '731',            // Camping & Hiking
  'wireless-audio': '233',     // Portable Audio & Video
  'phone-accessories': '233',  // Portable Audio & Video -> Cell Phone Accessories
  'summer-essentials': '167',  // Swimwear & Beach
  'back-to-school': '206',     // Office Supplies
  'pet': '1',                  // Animals & Pet Supplies
  'car': '888',                // Automotive
  'lighting': '269',           // Lighting
  'coffee-ritual': '488',      // Kitchen & Dining
  'content-creator': '233',    // Portable Audio & Video
  'balcony-garden': '536',     // Gardening & Lawn Care
  'sleep-sanctuary': '284',    // Bedding & Bath
  'gaming-gear': '235',        // Computer & Video Games
  'gadgets-under-10': '488',   // Kitchen & Dining -> Gadgets
};

export const DEFAULT_GOOGLE_CATEGORY = '488'; // Kitchen & Dining

export function xmlEncode(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function cleanDescription(desc: string): string {
  // Strip HTML tags, truncate to 5000 chars (Google limit)
  return desc.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 5000);
}

/** GMC caps titles at 150 chars; anything longer is truncated, not rejected. */
function cleanTitle(title: string): string {
  return title.replace(/\s+/g, ' ').trim().slice(0, 150);
}

export function collectionGoogleCategory(slug: string, explicit?: string): string {
  return explicit || GOOGLE_CATEGORY_MAP[slug] || DEFAULT_GOOGLE_CATEGORY;
}

/**
 * Render the RSS 2.0 feed. Items missing a title, a positive price or an
 * image are dropped — GMC disapproves them anyway, and a disapproved-heavy
 * feed drags down the whole account's item quality.
 */
export function buildGmcFeedXml(region: string, items: GmcFeedItem[]): string {
  const config = getRegion(region);
  const valid = items.filter((p) => p.id && p.title && p.price > 0 && p.imageUrl);

  const itemsXml = valid.map((p) => {
    const productUrl = `${SITE_URL}/${region}/product/${encodeURIComponent(p.id)}`;
    return `  <item>
    <g:id>${xmlEncode(`${region}-${p.id}`)}</g:id>
    <g:title>${xmlEncode(cleanTitle(p.title))}</g:title>
    <g:description>${xmlEncode(cleanDescription(p.description || p.title))}</g:description>
    <g:link>${xmlEncode(productUrl)}</g:link>
    <g:image_link>${xmlEncode(p.imageUrl)}</g:image_link>
    <g:price>${p.price.toFixed(2)} ${xmlEncode(p.currency || config.currency)}</g:price>
    <g:availability>in_stock</g:availability>
    <g:brand>${xmlEncode(p.brand || 'AliExpress')}</g:brand>
    <g:condition>new</g:condition>
    <g:identifier_exists>no</g:identifier_exists>
    <g:google_product_category>${xmlEncode(p.googleCategory || DEFAULT_GOOGLE_CATEGORY)}</g:google_product_category>
    <g:product_type>${xmlEncode(p.productType)}</g:product_type>
    <g:custom_label_0>shopli</g:custom_label_0>
  </item>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Shopli - Products Feed (${xmlEncode(region)})</title>
    <link>${xmlEncode(`${SITE_URL}/${region}`)}</link>
    <description>Shopli Google Shopping product feed — AI-curated AliExpress deals</description>
${itemsXml}
  </channel>
</rss>`;
}

/**
 * Cold-start fallback: the Neon feed store is empty until the first
 * trend-snapshot cron writes it, and an empty feed is useless. Fetch a
 * BOUNDED live sample — one search per collection for a handful of
 * collections, through the shared signed-call helper that already retries
 * past the AliExpress 1-second rate-limit ban. This is ~12 API calls, not
 * the 1,500-call fan-out the old products-feed.xml did per request.
 *
 * What this returns is also written back into the store by the caller, so
 * the fallback runs at most once per region before the cron takes over.
 */
export async function fetchLiveFeedSample(region: string, maxCollections = 12, perCollection = 8): Promise<GmcFeedItem[]> {
  const { getAllCollections } = await import('./collections').catch(() => ({ getAllCollections: () => [] as any[] }));
  const { searchAliExpress } = await import('./aliexpress').catch(() => ({ searchAliExpress: async () => [] as any[] }));
  const config = getRegion(region);

  const collections = getAllCollections()
    .filter((c: any) => c.keywords && c.keywords.length > 0)
    .slice(0, maxCollections);

  const seen = new Set<string>();
  const out: GmcFeedItem[] = [];
  for (const coll of collections) {
    try {
      const products = await searchAliExpress(coll.keywords[0], region, perCollection);
      for (const p of products) {
        if (!p.id || seen.has(p.id)) continue;
        seen.add(p.id);
        out.push({
          id: p.id,
          title: p.title,
          description: p.title, // the affiliate API returns no description field
          price: p.price,
          currency: p.currency || config.currency,
          imageUrl: p.imageUrl,
          brand: p.shopName || 'AliExpress',
          productType: coll.name?.[config.lang] || coll.name?.en || coll.slug,
          googleCategory: collectionGoogleCategory(coll.slug, coll.googleCategory),
          volume: p.volume,
        });
      }
    } catch { /* one failed collection must not sink the feed */ }
  }
  return out;
}
