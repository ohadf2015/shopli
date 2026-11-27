import type { NextApiRequest, NextApiResponse } from 'next';
import { searchAliExpress, withProductPageOffers } from '../../../lib/aliexpress';
import { offersChecked } from '../../../lib/cache';
import { filterQuality } from '../../../lib/quality';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q = '', region = 'eu', limit = '8' } = req.query;
  const pageSize = Math.min(parseInt(limit as string, 10) || 8, 10);

  if (!q) {
    return res.status(200).json({ success: false, error: 'Need q param', products: [] });
  }

  try {
    const found = filterQuality(await searchAliExpress(q as string, region as string, pageSize));
    const products = await withProductPageOffers(found, region as string, 3000);
    res.setHeader('Cache-Control', offersChecked(products) ? 's-maxage=300, stale-while-revalidate=600' : 's-maxage=30, must-revalidate');
    res.status(200).json({ success: true, query: q, products, total: products.length });
  } catch (error: any) {
    res.status(200).json({ success: false, error: error.message, products: [] });
  }
}