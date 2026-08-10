import { GetServerSideProps } from 'next';
import { cacheIfNotEmpty } from '../lib/cache';
import { getFeedProducts, recordFeedProducts } from '../lib/feed-store';
import { buildGmcFeedXml, fetchLiveFeedSample } from '../lib/gmc-feed';

/**
 * Legacy feed URL (referenced from llms.txt and older docs). The canonical
 * per-region feed is /[region]/google-shopping-feed; this serves the IL
 * catalog from the same Neon-backed store. It previously fanned out a live
 * AliExpress search per collection on every uncached request (~1,500 signed
 * calls against a key that rate-limits ~10% of calls) — that is gone.
 */
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  let items = await getFeedProducts('il');
  const fromStore = items.length > 0;

  if (!fromStore) {
    items = await fetchLiveFeedSample('il');
    if (items.length > 0) {
      recordFeedProducts('il', items).catch(() => {});
    }
  }

  const xml = buildGmcFeedXml('il', items);

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  // An empty merchant feed reads as "every item delisted". Don't cache one.
  cacheIfNotEmpty(
    res,
    items.length > 0,
    fromStore
      ? 'public, s-maxage=3600, stale-while-revalidate=86400'
      : 'public, s-maxage=300, must-revalidate'
  );
  res.setHeader('Vercel-CDN-Cache-Control', 'public, s-maxage=3600');
  res.write(xml);
  res.end();

  return { props: {} };
};

export default function ProductsFeedPage() { return null; }
