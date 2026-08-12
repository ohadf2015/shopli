import { GetServerSideProps } from 'next';
import { cacheIfNotEmpty } from '../../lib/cache';
import { getFeedProducts, recordFeedProducts } from '../../lib/feed-store';
import { buildGmcFeedXml, fetchLiveFeedSample } from '../../lib/gmc-feed';
import { isValidRegion } from '../../lib/regions';

/**
 * The Google Merchant Center feed. This route used to be an HTML page that
 * DESCRIBED the feed ("submit to Google Merchant Center for free product
 * listing ads") while no XML existed anywhere — the feature's landing copy
 * shipped without the feature. GMC free listings are the highest-leverage
 * free discovery channel for a catalog site, so the route now serves the
 * feed itself.
 *
 * Data comes from the feed_products cache (lib/feed-store.ts), filled by the
 * daily trend-snapshot cron — never a live per-collection fan-out against
 * the rate-limited AliExpress key. The one exception is a cold store (first
 * deploy, DB down): a bounded ~12-search live sample so the feed is never an
 * empty shell, written back into the store and cached for only 5 minutes so
 * the cron-filled catalog takes over quickly.
 */
export const getServerSideProps: GetServerSideProps = async ({ params, query, res }) => {
  const region = (query?.region as string) || (params?.region as string) || '';
  if (!isValidRegion(region)) return { notFound: true };

  let items = await getFeedProducts(region);
  const fromStore = items.length > 0;

  if (!fromStore) {
    items = await fetchLiveFeedSample(region);
    if (items.length > 0) {
      // Warm the store so the next request is cache-served. Fire-and-forget:
      // the response must not wait on housekeeping.
      recordFeedProducts(region, items).catch(() => {});
    }
  }

  const xml = buildGmcFeedXml(region, items);

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  // An empty merchant feed reads as "every item delisted". Don't cache one.
  // The live fallback is a partial catalog, so it gets a short cache; the
  // store-backed feed is the steady state and gets the hourly cache the
  // other AliExpress-backed routes use.
  cacheIfNotEmpty(
    res,
    items.length > 0,
    fromStore
      ? 'public, s-maxage=3600, stale-while-revalidate=86400'
      : 'public, s-maxage=300, must-revalidate'
  );
  res.write(xml);
  res.end();

  return { props: {} };
};

export default function GoogleShoppingFeedPage() { return null; }
