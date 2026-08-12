import type { NextApiRequest, NextApiResponse } from 'next';
import { searchCollection } from '../../../lib/aliexpress';
import { getTrendCategories } from '../../../lib/trend-calendar';
import { getAllCollections } from '../../../lib/collections';
import { recordVolumes } from '../../../lib/trend-velocity';
import { recordFeedProducts, pruneFeedProducts } from '../../../lib/feed-store';
import { collectionGoogleCategory, DEFAULT_GOOGLE_CATEGORY, GmcFeedItem } from '../../../lib/gmc-feed';
import { ALL_REGIONS, getRegion } from '../../../lib/regions';

/**
 * Daily order-count snapshot. Velocity is a difference between two readings,
 * so without a scheduled writer the only history that exists is for pages a
 * visitor happened to load — and this site does not get enough visitors for
 * that to cover the catalogue.
 *
 * The sweep also fills the feed_products cache behind the Google Merchant
 * Center feed (lib/feed-store.ts): the products are already in hand here, so
 * persisting them costs a few INSERTs and saves the feed route from ever
 * fanning out live searches of its own.
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
  const feedResults: Record<string, number> = {};
  await Promise.all(
    ALL_REGIONS.map(async ({ code }) => {
      const seen = new Map<string, { id: string; volume?: number; price?: number }>();
      const feedItems = new Map<string, GmcFeedItem>();
      const lang = getRegion(code).lang;

      const collect = (products: Awaited<ReturnType<typeof searchCollection>>, productType: string, googleCategory: string) => {
        for (const p of products) {
          if (!p.id) continue;
          if (!seen.has(p.id)) seen.set(p.id, { id: p.id, volume: p.volume, price: p.price });
          if (!feedItems.has(p.id) && p.title && p.price > 0 && p.imageUrl) {
            feedItems.set(p.id, {
              id: p.id,
              title: p.title,
              description: p.title, // the affiliate API returns no description field
              price: p.price,
              currency: p.currency,
              imageUrl: p.imageUrl,
              brand: p.shopName || 'AliExpress',
              productType,
              googleCategory,
              volume: p.volume,
            });
          }
        }
      };

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
      const collections = code === 'il' ? getAllCollections() : [];

      const trendResults = await Promise.all(
        getTrendCategories(code).map(async (cat) => {
          // One dead category must not lose the whole region's snapshot.
          const products = await searchCollection(code, cat.keywords, 20).catch(() => []);
          return { products, label: cat.label[lang] || cat.label.en || cat.key };
        })
      );
      for (const { products, label } of trendResults) {
        collect(products, label, DEFAULT_GOOGLE_CATEGORY);
      }

      const collectionResults = await Promise.all(
        collections
          .filter((c) => c.keywords && c.keywords.length > 0)
          .map(async (coll) => {
            const products = await searchCollection(code, [coll.keywords![0]], 8).catch(() => []);
            return { coll, products };
          })
      );
      for (const { coll, products } of collectionResults) {
        collect(
          products,
          coll.name?.[lang] || coll.name?.en || coll.slug,
          collectionGoogleCategory(coll.slug, coll.googleCategory)
        );
      }

      results[code] = await recordVolumes(code, Array.from(seen.values()));
      feedResults[code] = await recordFeedProducts(code, Array.from(feedItems.values()));
      await pruneFeedProducts(code);
    })
  );

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ ok: true, recorded: results, feed: feedResults });
}
