import type { NextApiRequest, NextApiResponse } from 'next';
import { goTarget, isBotUserAgent } from '../../lib/out-link';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  const target = goTarget(req.query.u);
  if (!target) return res.status(400).send('Bad link');
  if (isBotUserAgent(req.headers['user-agent'])) return res.status(403).send('Not for crawlers');
  res.redirect(302, target);
}
