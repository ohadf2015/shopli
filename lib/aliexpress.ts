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
  const params: Record<string, string> = {
    app_key: ALIE_KEY,
    timestamp: getTimestamp(),
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
  };
  params.sign = signParams(params, ALIE_SECRET);
  const url = 'https://api-sg.aliexpress.com/sync?' + new URLSearchParams(params);
  const res = await fetch(url);
  const data = await res.json();
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
    discount: p.discount || '',
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

export { REGION_MAP };