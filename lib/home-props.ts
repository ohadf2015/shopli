import { getRegion, type RegionCode } from './regions';
import { getFeaturedCollections } from './collections';
import { getPicks, type Pick } from './picks';
import { getReviewsBatch } from './review-store';
import type { HomeCard, HomePageProps } from './home-markdown';

function toCard(p: Pick, rtl: boolean, sym: string, reviews: Record<string, any>): HomeCard {
  const nf = (n: number) => Math.round(n).toLocaleString(rtl ? 'he-IL' : 'en-US');
  const drop = p.reason === 'price_drop' && p.dropPct > 0;
  const usual = (p.priceMedian ?? p.price).toFixed(2);
  const why = drop
    ? rtl
      ? `בדרך כלל ~${sym}${usual}`
      : `Usually ~${sym}${usual}`
    : rtl
      ? `${nf(p.recentPerDay)} נמכרים ביום`
      : `${nf(p.recentPerDay)} sold a day`;
  const badge = drop
    ? `−${p.dropPct}%`
    : p.reason === 'surging'
      ? rtl
        ? `פי ${p.surge.toFixed(1)} מהרגיל`
        : `${p.surge.toFixed(1)}× usual`
      : rtl
        ? 'רב מכר'
        : 'Best seller';
  return {
    productId: p.productId,
    title: p.title,
    imageUrl: p.imageUrl || '',
    price: p.price,
    why,
    badge,
    tone: drop ? 'drop' : 'hot',
    stars: reviews[p.productId]?.averageStars ?? 0,
  };
}

export async function loadHomeProps(region: RegionCode): Promise<HomePageProps> {
  const config = getRegion(region);
  const rtl = config.direction === 'rtl';
  const lang = config.lang || 'en';

  const [dropPicks, allPicks] = await Promise.all([
    getPicks(region, { limit: 8, reason: 'price_drop' }).catch(() => [] as Pick[]),
    getPicks(region, { limit: 16 }).catch(() => [] as Pick[]),
  ]);
  const dropIds = new Set(dropPicks.map((p) => p.productId));
  const sellerPicks = allPicks.filter((p) => !dropIds.has(p.productId)).slice(0, 8);
  const ids = [...dropPicks, ...sellerPicks].map((p) => p.productId);
  const reviews: Record<string, any> = ids.length ? await getReviewsBatch(region, ids).catch(() => ({})) : {};

  const sym = config.currencySymbol;
  const drops = dropPicks.map((p) => toCard(p, rtl, sym, reviews));
  const sellers = sellerPicks.map((p) => toCard(p, rtl, sym, reviews));
  const chips = getFeaturedCollections(region, 10).map((c) => ({
    slug: c.slug,
    name: c.name?.[lang] || c.name?.en || c.slug,
  }));
  const asOf = [...dropPicks, ...sellerPicks].map((p) => p.asOf).sort().pop() ?? '';
  return { region, config, rtl, drops, sellers, chips, asOf };
}
