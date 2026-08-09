import crypto from 'crypto';

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
// is self-inflicted 429s. Four in flight is enough to keep those pages fast.
const MAX_IN_FLIGHT = 4;
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
        const res = await fetch(API_URL + '?' + new URLSearchParams(signed));
        const data = await res.json();
        if (!data?.error_response) return data;
        last = data;
      } catch {
        last = null;
      }
      if (attempt < attempts - 1) await sleep(1200 * (attempt + 1));
    }
    return last ?? {};
  } finally {
    release();
  }
}

export interface SearchProduct {
  id: string;
  sku: string;
  title: string;
  price: number;
  originalPrice: number | null;
  currency: string;
  imageUrl: string;
  images: string[];
  affiliateLink: string;
  rating: number;           // 0-100 (evaluate_rate %)
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
  return products.map((p: any) => ({
    id: String(p.product_id),
    sku: p.sku_id || '',
    title: p.product_title || 'Product',
    price: parseFloat(p.target_sale_price || '0'),
    originalPrice: p.target_original_price ? parseFloat(p.target_original_price) : null,
    currency: p.target_sale_price_currency || cfg.currency,
    imageUrl: p.product_main_image_url || '',
    images: p.product_small_image_urls?.string || [],
    affiliateLink: p.promotion_link || p.product_detail_url || '',
    rating: parseFloat(String(p.evaluate_rate || '0').replace('%', '')),
    reviewCount: typeof p.last_5_days_trade_count === 'string' ? parseInt(p.last_5_days_trade_count) : (p.last_5_days_trade_count || 0),
    volume: parseInt(p.lastest_volume || '0'),
    category: p.first_level_category_name || '',
    categoryPath: (p.first_level_category_name || '') + ' > ' + (p.second_level_category_name || ''),
    shopName: p.shop_name || '',
    shopId: String(p.shop_id || ''),
    discount: p.discount && !p.discount.startsWith('0') ? p.discount : '',
    commissionRate: parseFloat(String(p.commission_rate || '0').replace('%', '')),
    freeShipping: false,
  }));
}

export async function searchCollection(region: string, keywords: string[], limit = 4): Promise<SearchProduct[]> {
  const all: SearchProduct[] = [];
  const seen = new Set<string>();
  for (const kw of keywords.slice(0, 3)) {
    try {
      const products = await searchAliExpress(kw, region, Math.ceil(limit * 1.5));
      for (const p of products) {
        if (!seen.has(p.id) && !seen.has(p.sku)) {
          seen.add(p.id);
          if (p.sku) seen.add(p.sku);
          all.push(p);
        }
      }
    } catch { /* ignore */ }
  }
  // Sort by volume (most sold), then rating, then commission
  all.sort((a, b) => (b.volume * 10 + b.rating * 3 + b.commissionRate) - (a.volume * 10 + a.rating * 3 + a.commissionRate));
  return all.slice(0, limit);
}

/**
 * Clean up common machine-translation artifacts in Hebrew product titles
 * returned by the AliExpress API (broken geresh spacing like "גאדג 'טים",
 * doubled spaces). Applied only when the request language is HE.
 */
function sanitizeHebrewTitle(title: string): string {
  return title
    .replace(/([א-ת])\s*['`]\s*([א-ת])/g, '$1׳$2')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function mapRawProduct(p: any, cfg: { language: string; currency: string; shipToCountry: string }): SearchProduct {
  const rawTitle: string = p.product_title || 'Product';
  return {
    id: String(p.product_id),
    sku: p.sku_id || '',
    title: cfg.language === 'HE' ? sanitizeHebrewTitle(rawTitle) : rawTitle,
    price: parseFloat(p.target_sale_price || p.sale_price || '0'),
    originalPrice: (p.target_original_price || p.original_price)
      ? parseFloat(p.target_original_price || p.original_price)
      : null,
    currency: p.target_sale_price_currency || p.sale_price_currency || cfg.currency,
    imageUrl: p.product_main_image_url || '',
    images: p.product_small_image_urls?.string || [],
    affiliateLink: p.promotion_link || p.product_detail_url || '',
    rating: parseFloat(String(p.evaluate_rate || '0').replace('%', '')),
    reviewCount: typeof p.last_5_days_trade_count === 'string'
      ? parseInt(p.last_5_days_trade_count, 10)
      : (p.last_5_days_trade_count || 0),
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
      return cleanIds
        .map(id => mapped.find((p: SearchProduct) => p.id === id))
        .filter(Boolean) as SearchProduct[];
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
      return cleanIds
        .map(id => mapped.find((p: SearchProduct) => p.id === id))
        .filter(Boolean) as SearchProduct[];
    }
  } catch { /* ignore */ }

  return [];
}

export { REGION_MAP };