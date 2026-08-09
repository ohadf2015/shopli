import type { NextApiRequest, NextApiResponse } from 'next';
import { searchCollection } from '../../../lib/aliexpress';
import { getTrendCategories } from '../../../lib/trend-calendar';
import { getAllCollections } from '../../../lib/collections';
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

  // Categories run concurrently: sequentially this was ~90 AliExpress searches
  // back to back and the whole sweep measured 343s, past the function limit.
  const results: Record<string, number> = {};
  await Promise.all(
    ALL_REGIONS.map(async ({ code }) => {
      const seen = new Map<string, { id: string; volume?: number; price?: number }>();

      // The trend categories are not what the site puts in front of anyone. Its
      // product pages, sitemap and homepage sections are all generated from the
      // collection keywords, and measured 2026-08-09 the two sets did not
      // overlap at all: 0 of the 32 products on the live IL homepage had ever
      // been snapshotted. So the history we were building described a catalogue
      // no visitor could reach. Sweep both.
      //
      // ponytail: collections for `il` only — 78 more searches, and this cron
      // has a 300s ceiling. Widen to every region once one run's duration is
      // known to have room.
      const collectionKeywords =
        code === 'il' ? getAllCollections().map((c) => [c.keywords[0]]) : [];

      const batches = await Promise.all([
        ...getTrendCategories(code).map((cat) =>
          // One dead category must not lose the whole region's snapshot.
          searchCollection(code, cat.keywords, 20).catch(() => [])
        ),
        ...collectionKeywords.map((kw) => searchCollection(code, kw, 8).catch(() => [])),
      ]);
      for (const products of batches) {
        for (const p of products) {
          if (p.id && !seen.has(p.id)) seen.set(p.id, { id: p.id, volume: p.volume, price: p.price });
        }
      }
      results[code] = await recordVolumes(code, Array.from(seen.values()));
    })
  );

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ ok: true, recorded: results });
}
