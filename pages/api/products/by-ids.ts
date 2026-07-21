import type { NextApiRequest, NextApiResponse } from 'next';
import { getProductsByIds } from '../../../lib/aliexpress';
import { parseCompareIds } from '../../../lib/product-compare';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed', products: [] });
  }

  const { ids = '', region = 'eu' } = req.query;
  const productIds = parseCompareIds(ids as string);

  if (productIds.length === 0) {
    return res.status(200).json({
      success: false,
      error: 'Need ids query param (comma-separated product IDs, 2–4 products)',
      products: [],
    });
  }

  try {
    const products = await getProductsByIds(productIds, region as string);
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).json({
      success: true,
      ids: productIds,
      products,
      total: products.length,
    });
  } catch (error: any) {
    res.status(200).json({
      success: false,
      error: error?.message || 'Failed to fetch products',
      products: [],
    });
  }
}
