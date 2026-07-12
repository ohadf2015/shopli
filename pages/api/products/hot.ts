import type { NextApiRequest, NextApiResponse } from 'next';
import { searchAliExpress } from '../../../lib/aliexpress';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { region = 'eu', limit = '8' } = req.query;
  const pageSize = Math.min(parseInt(limit as string, 10) || 8, 10);

  try {
    const products = await searchAliExpress('phone screen protector', region as string, pageSize);
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).json({ success: true, products, total: products.length });
  } catch (error: any) {
    res.status(200).json({ success: false, error: error.message, products: [] });
  }
}