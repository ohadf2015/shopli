import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

function signParams(params: Record<string, string>, secret: string): string {
  const keys = Object.keys(params).sort();
  return crypto.createHash('md5').update(secret + keys.map(k => k + params[k]).join('') + secret, 'utf8').digest('hex').toUpperCase();
}

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

async function searchProducts(keywords: string, opts: {
  language: string;
  currency: string;
  shipToCountry: string;
  pageSize?: number;
}): Promise<any[]> {
  const params: Record<string, string> = {
    app_key: ALIE_KEY,
    timestamp: getTimestamp(),
    format: 'json',
    v: '2.0',
    sign_method: 'md5',
    method: 'aliexpress.affiliate.product.query',
    tracking_id: TRACKING_ID,
    keywords,
    target_language: opts.language,
    target_currency: opts.currency,
    ship_to_country: opts.shipToCountry,
    page_size: String(opts.pageSize || 10),
    sort: 'LAST_VOLUME_DESC',
  };
  params.sign = signParams(params, ALIE_SECRET);
  const url = 'https://api-sg.aliexpress.com/sync?' + new URLSearchParams(params);
  const res = await fetch(url);
  const data = await res.json();
  const result = data?.aliexpress_affiliate_product_query_response?.resp_result?.result;
  return result?.products?.product || [];
}

function mapProduct(p: any, currency: string): any {
  return {
    id: String(p.product_id),
    title: p.product_title || 'Product',
    price: parseFloat(p.target_sale_price || '0'),
    originalPrice: p.target_original_price ? parseFloat(p.target_original_price) : null,
    currency,
    imageUrl: p.product_main_image_url || '',
    images: p.product_small_image_urls?.string || [],
    affiliateLink: p.promotion_link || p.product_detail_url || '',
    rating: parseFloat(p.evaluate_rate || '0'),
    reviewCount: p.last_5_days_trade_count || 0,
    category: p.first_level_category_name || '',
    shopName: p.shop_name || '',
    discount: p.discount || '',
    freeShipping: false,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { collection, region = 'eu', limit = '5' } = req.query;
  const config = REGION_MAP[region as string] || REGION_MAP.eu;
  const pageSize = Math.min(parseInt(limit as string, 10) || 5, 10);

  const { getCollection } = await import('../../../lib/collections');
  const collectionDef = getCollection(collection as string);

  if (!collectionDef || !collectionDef.searches.length) {
    return res.status(200).json({ success: false, error: 'Unknown collection', products: [], groups: [] });
  }

  try {
    // Search each keyword and group results
    const groups: { keyword: string; products: any[] }[] = [];

    for (const keyword of collectionDef.searches.slice(0, 6)) {
      const rawProducts = await searchProducts(keyword, {
        language: config.language,
        currency: config.currency,
        shipToCountry: config.shipToCountry,
        pageSize,
      });
      const products = rawProducts.map((p: any) => ({
        id: String(p.product_id),
        title: p.product_title || 'Product',
        price: parseFloat(p.target_sale_price || '0'),
        originalPrice: p.target_original_price ? parseFloat(p.target_original_price) : null,
        currency: p.target_sale_price_currency || config.currency,
        imageUrl: p.product_main_image_url || '',
        images: p.product_small_image_urls?.string || [],
        affiliateLink: p.promotion_link || p.product_detail_url || '',
        rating: parseFloat(p.evaluate_rate || '0'),
        reviewCount: p.last_5_days_trade_count || 0,
        category: p.first_level_category_name || '',
        shopName: p.shop_name || '',
        discount: p.discount || '',
        freeShipping: false,
      }));
      if (products.length > 0) {
        groups.push({ keyword, products });
      }
    }

    const allProducts = groups.flatMap(g => g.products);

    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1200');
    res.status(200).json({
      success: true,
      collection: collectionDef.id,
      groups,
      products: allProducts,
      total: allProducts.length,
    });
  } catch (error: any) {
    console.error('Collection API error:', error.message);
    res.status(200).json({ success: false, error: error.message, products: [], groups: [] });
  }
}