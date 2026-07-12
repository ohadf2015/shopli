import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

function signParams(params: Record<string, string>, secret: string): string {
  const sortedKeys = Object.keys(params).sort();
  const signString = secret + sortedKeys.map(k => k + params[k]).join('') + secret;
  return crypto.createHash('md5').update(signString, 'utf8').digest('hex').toUpperCase();
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

function getRegion(region: string) {
  return REGION_MAP[region] || REGION_MAP.eu;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { region = 'eu', page = '1', limit = '12', sort = 'LAST_VOLUME_DESC' } = req.query;
  const config = getRegion(region as string);

  const ALIE_KEY = process.env.ALIEXPRESS_APP_KEY;
  const ALIE_SECRET = process.env.ALIEXPRESS_APP_SECRET;
  const TRACKING_ID = process.env.ALIEXPRESS_TRACKING_ID;

  if (!ALIE_KEY || !ALIE_SECRET) {
    return res.status(200).json({ success: false, error: 'API not configured', products: [] });
  }

  const now = new Date();
  const ts = now.getUTCFullYear().toString()
    + String(now.getUTCMonth() + 1).padStart(2, '0')
    + String(now.getUTCDate()).padStart(2, '0')
    + String(now.getUTCHours()).padStart(2, '0')
    + String(now.getUTCMinutes()).padStart(2, '0')
    + String(now.getUTCSeconds()).padStart(2, '0') + '000';

  const params: Record<string, string> = {
    app_key: ALIE_KEY,
    timestamp: ts,
    format: 'json',
    v: '2.0',
    sign_method: 'md5',
    method: 'aliexpress.affiliate.hotproduct.query',
    tracking_id: TRACKING_ID || 'shopli',
    target_language: config.language,
    target_currency: config.currency,
    ship_to_country: config.shipToCountry,
    page_size: String(Math.min(parseInt(limit as string, 10) || 12, 50)),
    page_no: String(parseInt(page as string, 10) || 1),
    sort: sort as string,
    category_ids: (req.query.category as string) || '',
  };

  try {
    params.sign = signParams(params, ALIE_SECRET);
    const url = 'https://api-sg.aliexpress.com/sync?' + new URLSearchParams(params);
    const response = await fetch(url);
    const data = await response.json();

    const result = data?.aliexpress_affiliate_hotproduct_query_response?.resp_result?.result;
    if (!result) {
      return res.status(200).json({ success: false, error: 'No results', products: [], total: 0 });
    }

    const rawProducts = result?.products?.product || [];
    const products = rawProducts.map((p: any) => ({
      id: String(p.product_id),
      productId: p.product_id,
      title: p.product_title || 'Product',
      price: parseFloat(p.target_sale_price || '0'),
      currency: p.target_sale_price_currency || config.currency,
      originalPrice: parseFloat(p.target_original_price || '0'),
      imageUrl: p.product_main_image_url || '',
      images: p.product_small_image_urls?.string || [],
      affiliateLink: p.promotion_link || p.product_detail_url || '',
      rating: parseFloat(p.evaluate_rate || '0'),
      reviewCount: p.last_5_days_trade_count || 0,
      orders: p.last_5_days_trade_count || 0,
      category: p.first_level_category_name || '',
      shopName: p.shop_name || '',
      discount: p.discount || '',
      freeShipping: p.free_shipping === 'true',
      tags: [],
    }));

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).json({
      success: true,
      products,
      total: parseInt(result.total_record_count || '0', 10),
      page: parseInt(page as string, 10),
    });
  } catch (error: any) {
    console.error('AliExpress API error:', error.message);
    res.status(200).json({ success: false, error: error.message, products: [] });
  }
}