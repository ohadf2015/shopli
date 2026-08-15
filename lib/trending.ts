/**
 * Trend scoring — pure functions, no I/O (unit-testable via node --test).
 *
 * Full formula (when click/view velocity exists):
 *   35 * price_drop + 30 * click_velocity + 15 * view_velocity
 *   + 10 * order_momentum + 10 * freshness
 *
 * Cold-start fallback (no velocity data yet):
 *   50% discount + 30% order momentum + 20% freshness
 *
 * All components are normalized 0..1 against the candidate pool max,
 * so scores are deterministic for a given pool.
 */

export const TREND_SCORE_VERSION = 'weighted-v1';

export interface TrendCandidate {
  id: string;
  title: string;
  price: number;
  originalPrice?: number | null;
  /** AliExpress discount string, e.g. "53%" */
  discount?: string;
  /** 0–100 (AliExpress evaluate_rate) */
  rating: number;
  /** Lifetime units sold (lastest_volume) */
  volume: number;
  /** Trades in the last 5 days — proxy for freshness/recent momentum */
  recentTrades: number;
  category: string;
  imageUrl: string;
  affiliateLink: string;
  currency: string;
}

export interface TrendVelocity {
  clicks24h?: number;
  clicks7d?: number;
  views24h?: number;
  views7d?: number;
}

export type VelocityMap = Record<string, TrendVelocity | undefined>;

export type TrendReason =
  | 'price_drop'
  | 'click_velocity'
  | 'view_velocity'
  | 'order_momentum'
  | 'freshness'
  | 'popular';

export interface TrendComponents {
  priceDrop: number;
  clickVelocity: number;
  viewVelocity: number;
  orderMomentum: number;
  freshness: number;
}

export interface TrendScoreResult {
  score: number;
  reason: TrendReason;
  components: TrendComponents;
  coldStart: boolean;
}

export interface RankedTrend {
  product: TrendCandidate;
  rank: number;
  score: number;
  reason: TrendReason;
  components: TrendComponents;
  scoreVersion: string;
}

export function discountPct(p: Pick<TrendCandidate, 'discount' | 'price' | 'originalPrice'>): number {
  if (p.discount) {
    const n = parseFloat(String(p.discount).replace('%', '').trim());
    if (Number.isFinite(n) && n > 0) return Math.min(100, n);
  }
  if (p.originalPrice != null && p.originalPrice > p.price && p.originalPrice > 0) {
    return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
  }
  return 0;
}

interface PoolStats {
  maxDiscount: number;
  maxMomentum: number;
  maxFreshness: number;
  maxClicks: number;
  maxViews: number;
}

function poolStats(pool: TrendCandidate[], velocity?: VelocityMap): PoolStats {
  let maxDiscount = 0;
  let maxMomentum = 0;
  let maxFreshness = 0;
  let maxClicks = 0;
  let maxViews = 0;
  for (const p of pool) {
    maxDiscount = Math.max(maxDiscount, discountPct(p));
    // log1p compresses AliExpress volume outliers (10 vs 100k sold)
    maxMomentum = Math.max(maxMomentum, Math.log1p(p.volume || 0));
    maxFreshness = Math.max(maxFreshness, Math.log1p(p.recentTrades || 0));
    const v = velocity?.[p.id];
    if (v) {
      maxClicks = Math.max(maxClicks, Math.log1p((v.clicks7d || 0) + 3 * (v.clicks24h || 0)));
      maxViews = Math.max(maxViews, Math.log1p((v.views7d || 0) + 3 * (v.views24h || 0)));
    }
  }
  return { maxDiscount, maxMomentum, maxFreshness, maxClicks, maxViews };
}

const REASON_PRIORITY: TrendReason[] = [
  'price_drop',
  'click_velocity',
  'view_velocity',
  'order_momentum',
  'freshness',
];

export function computeTrendScore(
  p: TrendCandidate,
  pool: TrendCandidate[],
  velocity?: VelocityMap
): TrendScoreResult {
  const stats = poolStats(pool, velocity);
  const v = velocity?.[p.id];

  const components: TrendComponents = {
    priceDrop: stats.maxDiscount > 0 ? discountPct(p) / stats.maxDiscount : 0,
    clickVelocity:
      v && stats.maxClicks > 0
        ? Math.log1p((v.clicks7d || 0) + 3 * (v.clicks24h || 0)) / stats.maxClicks
        : 0,
    viewVelocity:
      v && stats.maxViews > 0
        ? Math.log1p((v.views7d || 0) + 3 * (v.views24h || 0)) / stats.maxViews
        : 0,
    orderMomentum: stats.maxMomentum > 0 ? Math.log1p(p.volume || 0) / stats.maxMomentum : 0,
    freshness: stats.maxFreshness > 0 ? Math.log1p(p.recentTrades || 0) / stats.maxFreshness : 0,
  };

  const coldStart = !velocity || Object.keys(velocity).length === 0;

  const score = coldStart
    ? 50 * components.priceDrop + 30 * components.orderMomentum + 20 * components.freshness
    : 35 * components.priceDrop +
      30 * components.clickVelocity +
      15 * components.viewVelocity +
      10 * components.orderMomentum +
      10 * components.freshness;

  // Reason = highest weighted contribution.
  const weighted: Array<[TrendReason, number]> = coldStart
    ? [
        ['price_drop', 50 * components.priceDrop],
        ['order_momentum', 30 * components.orderMomentum],
        ['freshness', 20 * components.freshness],
      ]
    : [
        ['price_drop', 35 * components.priceDrop],
        ['click_velocity', 30 * components.clickVelocity],
        ['view_velocity', 15 * components.viewVelocity],
        ['order_momentum', 10 * components.orderMomentum],
        ['freshness', 10 * components.freshness],
      ];

  let reason: TrendReason = 'popular';
  let best = 0;
  for (const [r, w] of weighted) {
    if (w > best || (w === best && w > 0 && REASON_PRIORITY.indexOf(r) < REASON_PRIORITY.indexOf(reason))) {
      best = w;
      reason = r;
    }
  }

  return { score: Math.round(score * 10) / 10, reason, components, coldStart };
}

const TITLE_NOISE = new Set([
  'cm', 'mm', 'm', 'km', 'kg', 'g', 'mg', 'ml', 'l', 'w', 'kw', 'v', 'a',
  'mah', 'hz', 'inch', 'in', 'ft', 'pcs', 'pc', 'pack', 'size', 'new',
]);

/**
 * Normalize a product title for near-duplicate detection across supplier
 * relistings of the same item: lowercase, strip punctuation, fold
 * number+unit tokens ("80cm" -> "80"), drop standalone units, then sort
 * unique tokens so reordered re-listings collapse to one key. Numbers are
 * kept so genuinely different models ("iPhone 14 case" vs "iPhone 15
 * case") stay distinct.
 */
export function normalizeTitleKey(title: string): string {
  const tokens = title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => t.replace(/^(\d+(?:\.\d+)?)(cm|mm|km|kg|mg|ml|kw|mah|hz|inch|in|ft|pcs|pc|pack|g|m|l|w|v|a)$/, '$1'))
    .filter((t) => !TITLE_NOISE.has(t));
  return Array.from(new Set(tokens)).sort().join(' ');
}

/**
 * Drop near-duplicate items by normalized title. Two items are dupes when
 * their title token sets are equal, or when one is a subset of the other
 * and the smaller set has >= 4 tokens (catches relistings with a tacked-on
 * "UV400"/"Hot" suffix without collapsing genuinely different short-titled
 * products). Items are assumed pre-sorted best-first: the first occurrence
 * wins. Items with an empty normalized title are always kept (can't judge).
 */
export function dedupeByTitle<T>(items: T[], getTitle: (item: T) => string): T[] {
  const keptKeys: Array<Set<string>> = [];
  const result: T[] = [];
  for (const item of items) {
    const key = normalizeTitleKey(getTitle(item));
    if (!key) {
      result.push(item);
      continue;
    }
    const tokens = new Set(key.split(' '));
    const isDup = keptKeys.some((prev) => {
      const [small, big] = prev.size <= tokens.size ? [prev, tokens] : [tokens, prev];
      if (small.size < 4 && prev.size !== tokens.size) return false;
      for (const t of small) {
        if (!big.has(t)) return false;
      }
      return true;
    });
    if (!isDup) {
      keptKeys.push(tokens);
      result.push(item);
    }
  }
  return result;
}

/**
 * Dedupe products across page sections so a normalized title appears at
 * most once on the whole page. `rail` items always win (they are the
 * highest-scored representative of their title), then each section in
 * order is filtered against the rail plus every earlier section. The rail
 * is assumed already title-deduped (rankTrending does this).
 */
export function dedupeAcrossSections<T>(
  rail: T[],
  sections: T[][],
  getTitle: (item: T) => string
): T[][] {
  const kept: T[] = [...rail];
  return sections.map((products) => {
    // Prepending `kept` means any section product that dup-matches a rail
    // or earlier-section item loses to the first occurrence and is dropped.
    const combined = dedupeByTitle([...kept, ...products], getTitle);
    const fresh = combined.slice(kept.length);
    kept.push(...fresh);
    return fresh;
  });
}

export function rankTrending(
  pool: TrendCandidate[],
  opts: { limit: number; velocity?: VelocityMap }
): RankedTrend[] {
  const seen = new Set<string>();
  const unique = pool.filter((p) => {
    if (!p.id || seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });

  const scored = unique.map((product) => {
    const { score, reason, components } = computeTrendScore(product, unique, opts.velocity);
    return { product, score, reason, components, scoreVersion: TREND_SCORE_VERSION };
  });

  // Stable, deterministic ordering: score desc, then id asc.
  scored.sort((a, b) => b.score - a.score || (a.product.id < b.product.id ? -1 : 1));

  // Dedupe near-identical titles (same item relisted under a new ID).
  // Sorted desc, so the first occurrence kept is the highest-scored dupe.
  const deduped = dedupeByTitle(scored, (entry) => entry.product.title);

  return deduped.slice(0, Math.max(0, opts.limit)).map((entry, i) => ({
    ...entry,
    rank: i + 1,
  }));
}

const REASON_LABELS: Record<TrendReason, { en: string; he: string }> = {
  price_drop: { en: 'Price dropped', he: 'המחיר ירד' },
  click_velocity: { en: 'Shoppers are clicking it', he: 'קונים לוחצים עליו' },
  view_velocity: { en: 'Getting lots of views', he: 'צובר צפיות' },
  order_momentum: { en: 'Popular this week', he: 'פופולרי השבוע' },
  freshness: { en: 'New pick', he: 'בחירה חדשה' },
  popular: { en: 'Popular pick', he: 'בחירה פופולרית' },
};

export function trendReasonLabel(reason: TrendReason, rtl: boolean): string {
  return rtl ? REASON_LABELS[reason].he : REASON_LABELS[reason].en;
}

/** Map a SearchProduct-ish catalog record to the scoring input shape. */
export function toTrendCandidate(p: any): TrendCandidate {
  return {
    id: String(p.id),
    title: p.title || 'Product',
    price: Number(p.price) || 0,
    originalPrice: p.originalPrice ?? null,
    discount: p.discount || '',
    rating: Number(p.rating) || 0,
    volume: Number(p.volume) || 0,
    // Was Number(p.reviewCount), described as a recent-momentum proxy. The
    // affiliate API never returns that field, so it was a constant 0 dressed
    // up as a signal. Real momentum comes from our own volume snapshots
    // (lib/trend-velocity.ts), which this page already applies.
    recentTrades: 0,
    category: p.category || 'general',
    imageUrl: p.imageUrl || '',
    affiliateLink: p.affiliateLink || '',
    currency: p.currency || 'EUR',
  };
}

/** Serializable ranked list for passing from getServerSideProps to components. */
export function buildTrending(products: any[], limit: number) {
  const pool = products.map(toTrendCandidate);
  return rankTrending(pool, { limit }).map((r) => ({
    rank: r.rank,
    score: r.score,
    reason: r.reason,
    product: r.product,
  }));
}
