import { NextApiRequest, NextApiResponse } from 'next';
import { handleNewsletterSignup } from '../../lib/newsletter';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  const { email, region, wishlist, items } = req.body || {};
  const result = await handleNewsletterSignup(email, region || 'eu', {
    wishlist: wishlist === true,
    items,
  });
  res.status(result.ok ? 200 : 400).json(result);
}