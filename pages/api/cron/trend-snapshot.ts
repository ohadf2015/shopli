import type { NextApiRequest, NextApiResponse } from 'next';
import { searchCollection } from '../../../lib/aliexpress';
import { getTrendCategories } from '../../../lib/trend-calendar';
import { recordVolumes } from '../../../lib/trend-velocity';
import { ALL_REGIONS } from '../../../lib/regions';

/**
 * Daily order-count snapshot. Velocity is a difference between two readings,
 * so without a scheduled writer the only history that exists is for pages a
 * visitor happened to load — and this site does not get enough visitors for
 * that to cover the catalogue.
 *
 * Wired to Vercel Cron (see vercel.json). Vercel sends CRON_SECRET as a bearer
 * token; when the variable is unset the endpoint refuses rather than allowing
 * anyone to trigger a few hundred AliExpress searches.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return res.status(503).json({ error: 'CRON_SECRET not configured' });
  if (req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const results: Record<string, number> = {};
  for (const { code } of ALL_REGIONS) {
    const seen = new Map<string, { id: string; volume?: number }>();
    for (const cat of getTrendCategories(code)) {
      try {
        for (const p of await searchCollection(code, cat.keywords, 20)) {
          if (p.id && !seen.has(p.id)) seen.set(p.id, { id: p.id, volume: p.volume });
        }
      } catch {
        /* one dead category must not lose the whole region's snapshot */
      }
    }
    results[code] = await recordVolumes(code, Array.from(seen.values()));
  }

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ ok: true, recorded: results });
}
