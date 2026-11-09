import crypto from 'crypto';
import { rankForFeature } from './quality';
import { getHebrewTitles } from './hebrew-titles';
import { cleanTitle } from './titles';
import { keepLinkable } from './linkable';

const REGION_MAP: Record<string, { language: string; currency: string; shipToCountry: string }> = {
  il: { language: 'HE', currency: 'ILS', shipToCountry: 'IL' },
  eu: { language: 'EN', currency: 'EUR', shipToCountry: 'FR' },
  us: { language: 'EN', currency: 'USD', shipToCountry: 'US' },
  uk: { language: 'EN', currency: 'GBP', shipToCountry: 'GB' },
  fr: { language: 'FR', currency: 'EUR', shipToCountry: 'FR' },
  de: { language: 'DE', currency: 'EUR', shipToCountry: 'DE' },
  es: { language: 'ES', currency: 'EUR', shipToCountry: 'ES' },
  it: { language: 'IT', currency: 'EUR', shipToCountry: 'IT' },
  // Russian-language Israel (regions.ts): ILS, ships to IL. Without this entry it
  // fell through to the EU default and priced every product in EUR under a ₪ header.
  ru: { language: 'RU', currency: 'ILS', shipToCountry: 'IL' },
};

const ALIE_KEY = process.env.ALIEXPRESS_APP_KEY || '';
const ALIE_SECRET = process.env.ALIEXPRESS_APP_SECRET || '';
const TRACKING_ID = process.env.ALIEXPRESS_TRACKING_ID || 'shopli';

function getTimestamp(): string {
  const now = new Date();
  return now.getUTCFullYear().toString()
    + String(now.getUTCMonth() + 1).padStart(2, '0')
    + String(now.getUTCDate()).padStart(2, '0')
    + String(now.getUTCHours()).padStart(2, '0')
    + String(now.getUTCMinutes()).padStart(2, '0')
    + String(now.getUTCSeconds()).padStart(2, '0') + '000';
}

function signParams(params: Record<string, string>, secret: string): string {
  const keys = Object.keys(params).sort();
  return crypto.createHash('md5').update(secret + keys.map(k => k + params[k]).join('') + secret, 'utf8').digest('hex').toUpperCase();
}

const API_URL = 'https://api-sg.aliexpress.com/sync';

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

// The affiliate API rate-limits per app key, not per connection, and it bans on
// burst. A page like /trending fans out one search per category at once, which
// is self-inflicted 429s. Measured 2026-11-09: 14 concurrent searches all
// returned products with no ApiCallLimit, and at 4 in flight a 10-category
// trending render queued into 3 waves of ~3s (13s cold). 10 clears it in one.
const MAX_IN_FLIGHT = 10;
/** Per attempt. The API answers in well under a second when it answers at all. */
const API_TIMEOUT_MS = 3500;
let inFlight = 0;
const waiting: Array<() => void> = [];

async function acquire(): Promise<void> {
  if (inFlight < MAX_IN_FLIGHT) {
    inFlight++;
    return;
  }
  await new Promise<void>(resolve => waiting.push(resolve));
  inFlight++;
}

function release(): void {
  inFlight--;
  waiting.shift()?.();
}

/**
 * One signed call to the affiliate API, retried past the rate limiter.
 *
 * Measured 2026-08-09: ~10% of calls return
 * `{"error_response":{"code":"ApiCallLimit","msg":"...this ban will last 1 seconds"}}`
 * instead of products — sequentially, so it is the app key's own quota, not our
 * concurrency. Every caller read that empty result as "no such product", and the
 * pages then froze it at the CDN for up to an hour, which is what turned live
 * products into "Product not found". The ban is measured in seconds, so waiting
 * it out costs one slow request and keeps the page.
 *
 * The timestamp is part of the signature, so each attempt is re-signed.
 *
 * One retry, not several: the ban the API actually reports is one second, so a
 * single wait covers the evidence. Deeper retries would multiply against the
 * in-flight cap and put seconds of sleep on a page's worst case to chase a
 * failure mode we have never observed.
 */
async function callApi(params: Record<string, string>, attempts = 2): Promise<any> {
  await acquire();
  try {
    let last: any = null;
    for (let attempt = 0; attempt < attempts; attempt++) {
      const signed: Record<string, string> = { ...params, timestamp: getTimestamp() };
      signed.sign = signParams(signed, ALIE_SECRET);
      try {
        // Bounded: an API call that hangs used to hold the whole page render
        // (and an in-flight slot) for as long as the socket stayed open.
        const res = await fetch(API_URL + '?' + new URLSearchParams(signed), {
          signal: AbortSignal.timeout(API_TIMEOUT_MS),
        });
        const data = await res.json();
        if (!data?.error_response) return data;
        last = data;
      } catch {
        last = null;
      }
      if (attempt < attempts - 1) {
        release();
        await sleep(1200 * (attempt + 1));
        await acquire();
      }
    }
    return last ?? {};
  } finally {
    release();
  }
}

/**
 * Last-resort exit URL for a product we could not get a promotion link for.
 *
 * Only an `s.click.aliexpress.com` promotion link, issued by the API for our
 * tracking id, is attributed to us. `aff_fcid` is a parameter that redirect
 * adds on its own way out, so writing it onto a bare item URL by hand does not
 * credit the visit to anyone. It stays here as a marker that the link is
 * untracked (and for the demo catalog, which has no API behind it), while
 * withPromotionLinks below converts every real product to a proper link.
 */
export function ensureAffiliateTracking(url: string, productId?: string | number): string {
  const id = String(productId ?? '').trim();
  if (!url) {
    return id ? `https://www.aliexpress.com/item/${id}.html?aff_fcid=${TRACKING_ID}` : url;
  }
  // Already tagged: s.click deep links or any aff_* param — leave untouched.
  if (url.includes('s.click.aliexpress.com') || /[?&]aff[_%]/i.test(url)) return url;
  if (!/(^|\.)aliexpress\.com/i.test(new URL(url, 'https://www.aliexpress.com').hostname)) return url;
  return url + (url.includes('?') ? '&' : '?') + `aff_fcid=${TRACKING_ID}`;
}

/** True only for a link AliExpress will credit to our tracking id. */
export function isPromotionLink(url: string | undefined | null): boolean {
  return /^https:\/\/s\.click\.aliexpress\.com\//i.test(url || '');
}

/** AliExpress item id from an item URL, or '' when there is none. */
export function itemIdFromUrl(url: string): string {
  return url.match(/\/item\/(\d+)\.html/)?.[1] || '';
}

/**
 * Item id -> promotion link, from an `aliexpress.affiliate.link.generate`
 * response. Keyed by item id rather than by the echoed source URL, because the
 * API may normalise the URL it echoes back.
 */
export function parsePromotionLinks(data: any): Map<string, string> {
  const out = new Map<string, string>();
  const raw = data?.aliexpress_affiliate_link_generate_response?.resp_result?.result?.promotion_links?.promotion_link;
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
  for (const entry of list) {
    const link = String(entry?.promotion_link || '');
    const id = itemIdFromUrl(String(entry?.source_value || ''));
    if (id && isPromotionLink(link)) out.set(id, link);
  }
  return out;
}

/** link.generate takes a comma-separated list; 50 per call is the documented cap. */
const LINK_BATCH = 50;

/**
 * Promotion links for item ids, one signed call per 50. Fails open to an
 * empty map, so a failure leaves the fallback link in place rather than
 * breaking the page.
 */
export async function generatePromotionLinks(ids: string[]): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  const unique = [...new Set(ids.filter((id) => /^\d+$/.test(id)))];
  if (!ALIE_KEY || !ALIE_SECRET || unique.length === 0) return out;
  for (let i = 0; i < unique.length; i += LINK_BATCH) {
    const batch = unique.slice(i, i + LINK_BATCH);
    try {
      const data = await callApi({
        app_key: ALIE_KEY,
        format: 'json',
        v: '2.0',
        sign_method: 'md5',
        method: 'aliexpress.affiliate.link.generate',
        tracking_id: TRACKING_ID,
        promotion_link_type: '0',
        source_values: batch.map((id) => `https://www.aliexpress.com/item/${id}.html`).join(','),
      });
      for (const [id, link] of parsePromotionLinks(data)) out.set(id, link);
    } catch { /* keep the fallback links */ }
  }
  return out;
}

/**
 * Give every product an exit link that earns. The search API usually returns
 * `promotion_link` already; when it does not (PDPs fetched by id are where
 * this was seen), the item gets one from link.generate instead of leaving the
 * visit untracked.
 */
export async function withPromotionLinks<T extends { id: string; affiliateLink: string }>(products: T[]): Promise<T[]> {
  const missing = products.filter((p) => !isPromotionLink(p.affiliateLink)).map((p) => p.id);
  if (missing.length === 0) return products;
  const links = await generatePromotionLinks(missing);
  if (links.size === 0) return products;
  return products.map((p) => {
    const link = isPromotionLink(p.affiliateLink) ? null : links.get(p.id);
    return link ? { ...p, affiliateLink: link } : p;
  });
}

export interface SearchProduct {
  id: string;
  sku: string;
  title: string;
  /** Full API title, kept when `title` carries a generated Hebrew override. */
  originalTitle?: string;
  price: number;
  originalPrice: number | null;
  currency: string;
  imageUrl: string;
  images: string[];
  affiliateLink: string;
  rating: number;           // 0-100 (evaluate_rate %)
  /**
   * Always 0. It used to be read from `last_5_days_trade_count`, a field the
   * affiliate API does not return — verified 2026-08-15 against a live
   * response, whose key list has no such entry. So every product on the site
   * claimed 0 reviews, and anything scoring on it was scoring on a constant.
   *
   * Kept on the type because the compare table and wishlist entries still carry
   * the shape. Real counts come from lib/reviews.ts, which reads AliExpress'
   * own review endpoint, and are surfaced per page rather than smuggled in
   * here.
   */
  reviewCount: number;
  volume: number;            // lastest_volume (total sold)
  category: string;
  categoryPath: string;      // first > second level
  shopName: string;
  shopId: string;
  discount: string;
  commissionRate: number;    // 0-100%
  freeShipping: boolean;
}

export async function searchAliExpress(keywords: string, region: string, pageSize = 10): Promise<SearchProduct[]> {
  const cfg = REGION_MAP[region] || REGION_MAP.eu;
  const data = await callApi({
    app_key: ALIE_KEY,
    format: 'json',
    v: '2.0',
    sign_method: 'md5',
    method: 'aliexpress.affiliate.product.query',
    tracking_id: TRACKING_ID,
    keywords,
    target_language: cfg.language,
    target_currency: cfg.currency,
    ship_to_country: cfg.shipToCountry,
    page_size: String(pageSize),
    sort: 'LAST_VOLUME_DESC',
  });
  const result = data?.aliexpress_affiliate_product_query_response?.resp_result?.result;
  const products = result?.products?.product || [];
  const mapped = products.map((p: any) => {
    const rawTitle: string = p.product_title || 'Product';
    return {
    id: String(p.product_id),
    sku: p.sku_id || '',
    title: cfg.language === 'HE' ? sanitizeHebrewTitle(rawTitle) : cleanTitle(rawTitle),
    price: parseFloat(p.target_sale_price || '0'),
    originalPrice: p.target_original_price ? parseFloat(p.target_original_price) : null,
    currency: p.target_sale_price_currency || cfg.currency,
    imageUrl: p.product_main_image_url || '',
    images: p.product_small_image_urls?.string || [],
    affiliateLink: ensureAffiliateTracking(p.promotion_link || p.product_detail_url || '', p.product_id),
    rating: parseFloat(String(p.evaluate_rate || '0').replace('%', '')),
    reviewCount: 0, // see the field docs on SearchProduct
    volume: parseInt(p.lastest_volume || '0'),
    category: p.first_level_category_name || '',
    categoryPath: (p.first_level_category_name || '') + ' > ' + (p.second_level_category_name || ''),
    shopName: p.shop_name || '',
    shopId: String(p.shop_id || ''),
    discount: p.discount && !p.discount.startsWith('0') ? p.discount : '',
    commissionRate: parseFloat(String(p.commission_rate || '0').replace('%', '')),
    freeShipping: false,
    };
  });
  const tracked = await withPromotionLinks(mapped as SearchProduct[]);
  return cfg.language === 'HE' ? applyHebrewOverrides(tracked) : tracked;
}

export async function searchCollection(region: string, keywords: string[], limit = 4): Promise<SearchProduct[]> {
  const all: SearchProduct[] = [];
  const seen = new Set<string>();
  const batches = await Promise.all(
    keywords.slice(0, 3).map((kw) =>
      searchAliExpress(kw, region, Math.ceil(limit * 1.5)).catch(() => [] as SearchProduct[])
    )
  );
  for (const products of batches) {
    for (const p of products) {
      if (!seen.has(p.id) && !seen.has(p.sku)) {
        seen.add(p.id);
        if (p.sku) seen.add(p.sku);
        all.push(p);
      }
    }
  }
  // Drop the products we would not stand behind before ranking what is left.
  // Measured over 395 live products, the floor removes ~13% and still leaves
  // every keyword with results (lib/quality.ts). This is the one place every
  // collection, mood and trending surface funnels through, so gating here
  // covers all of them; PDPs fetch by id and are deliberately not affected, so
  // an already-indexed product page never starts 404ing because of this.
  //
  // Fails open: if the floor would empty a non-empty result, the unfiltered
  // list is ranked instead. An empty section is worse than a mediocre product.
  //
  // Ranking used to be volume * 10 + rating * 3, which let order count decide
  // everything: a 91%-rated item with 9k orders beat a 98% one with 5k. Now
  // products that clear the featured bar (94%+, 1,000+ orders) come first,
  // ordered by rating with orders as the tiebreak (lib/quality.ts), and the
  // rest of the floor only tops the list up.
  //
  // Every card links to /product/<id>, which resolves by id. Search returns
  // some items the by-id lookup never does, and those cards were dead 404 links.
  return keepLinkable(rankForFeature(all).slice(0, limit), (ids) => getProductsByIds(ids, region));
}

/**
 * Clean up common machine-translation artifacts in Hebrew product titles
 * returned by the AliExpress API (broken geresh spacing like "גאדג 'טים",
 * Latin words fused into Hebrew ones like "Nonלהחליק", doubled spaces).
 * Applied only when the request language is HE.
 */
function sanitizeHebrewTitle(title: string): string {
  return title
    .replace(/([א-ת])\s*['`]\s*([א-ת])/g, '$1׳$2')
    .replace(/([A-Za-z])(?=[א-ת])/g, '$1 ')
    .replace(/([א-ת])(?=[A-Za-z])/g, '$1 ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Swap in LLM-written natural Hebrew titles (lib/hebrew-titles.ts) for the
 * API's literal machine translations. One DB round-trip per page; fail-open,
 * so a store outage changes nothing. The full API title survives on
 * `originalTitle` for tooltips and anywhere the long form is still wanted.
 */
async function applyHebrewOverrides(products: SearchProduct[]): Promise<SearchProduct[]> {
  if (!products.length) return products;
  const overrides = await getHebrewTitles(products.map((p) => p.id));
  if (!overrides.size) return products;
  return products.map((p) => {
    const title = overrides.get(p.id);
    return title ? { ...p, originalTitle: p.title, title } : p;
  });
}

function mapRawProduct(p: any, cfg: { language: string; currency: string; shipToCountry: string }): SearchProduct {
  const rawTitle: string = p.product_title || 'Product';
  return {
    id: String(p.product_id),
    sku: p.sku_id || '',
    title: cfg.language === 'HE' ? sanitizeHebrewTitle(rawTitle) : cleanTitle(rawTitle),
    price: parseFloat(p.target_sale_price || p.sale_price || '0'),
    originalPrice: (p.target_original_price || p.original_price)
      ? parseFloat(p.target_original_price || p.original_price)
      : null,
    currency: p.target_sale_price_currency || p.sale_price_currency || cfg.currency,
    imageUrl: p.product_main_image_url || '',
    images: p.product_small_image_urls?.string || [],
    affiliateLink: ensureAffiliateTracking(p.promotion_link || p.product_detail_url || '', p.product_id),
    rating: parseFloat(String(p.evaluate_rate || '0').replace('%', '')),
    reviewCount: 0, // see the field docs on SearchProduct
    volume: parseInt(p.lastest_volume || '0', 10),
    category: p.first_level_category_name || '',
    categoryPath: (p.first_level_category_name || '') + ' > ' + (p.second_level_category_name || ''),
    shopName: p.shop_name || '',
    shopId: String(p.shop_id || ''),
    discount: p.discount && !String(p.discount).startsWith('0') ? String(p.discount) : '',
    commissionRate: parseFloat(String(p.commission_rate || '0').replace('%', '')),
    freeShipping: false,
  };
}

/**
 * Fetch products by AliExpress product IDs (for comparison pages).
 * Uses affiliate productdetail.get, falls back to product.query with product_ids.
 */
export async function getProductsByIds(ids: string[], region: string): Promise<SearchProduct[]> {
  const cleanIds = [...new Set(ids.map(id => String(id).trim()).filter(Boolean))].slice(0, 4);
  if (cleanIds.length === 0) return [];

  const cfg = REGION_MAP[region] || REGION_MAP.eu;
  const productIds = cleanIds.join(',');

  // Prefer productdetail.get for accurate multi-product fetch
  try {
    const data = await callApi({
      app_key: ALIE_KEY,
      format: 'json',
      v: '2.0',
      sign_method: 'md5',
      method: 'aliexpress.affiliate.productdetail.get',
      tracking_id: TRACKING_ID,
      product_ids: productIds,
      target_language: cfg.language,
      target_currency: cfg.currency,
      ship_to_country: cfg.shipToCountry,
    });
    const result = data?.aliexpress_affiliate_productdetail_get_response?.resp_result?.result;
    const products = result?.products?.product || result?.ae_item_list || [];
    const list = Array.isArray(products) ? products : products ? [products] : [];
    if (list.length > 0) {
      const mapped = list.map((p: any) => mapRawProduct(p, cfg));
      // Preserve requested order
      const ordered = cleanIds
        .map(id => mapped.find((p: SearchProduct) => p.id === id))
        .filter(Boolean) as SearchProduct[];
      const tracked = await withPromotionLinks(ordered);
      return cfg.language === 'HE' ? applyHebrewOverrides(tracked) : tracked;
    }
  } catch { /* fall through */ }

  // Fallback: product.query with product_ids
  try {
    const data = await callApi({
      app_key: ALIE_KEY,
      format: 'json',
      v: '2.0',
      sign_method: 'md5',
      method: 'aliexpress.affiliate.product.query',
      tracking_id: TRACKING_ID,
      product_ids: productIds,
      target_language: cfg.language,
      target_currency: cfg.currency,
      ship_to_country: cfg.shipToCountry,
      page_size: String(cleanIds.length),
    });
    const result = data?.aliexpress_affiliate_product_query_response?.resp_result?.result;
    const products = result?.products?.product || [];
    const list = Array.isArray(products) ? products : [];
    if (list.length > 0) {
      const mapped = list.map((p: any) => mapRawProduct(p, cfg));
      const ordered = cleanIds
        .map(id => mapped.find((p: SearchProduct) => p.id === id))
        .filter(Boolean) as SearchProduct[];
      const tracked = await withPromotionLinks(ordered);
      return cfg.language === 'HE' ? applyHebrewOverrides(tracked) : tracked;
    }
  } catch { /* ignore */ }

  return [];
}

export { REGION_MAP };