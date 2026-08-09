import { useEffect, useRef } from 'react';
import Icon from './icons';
import { productImage } from '../lib/img';
import {
  trackTrendingView,
  trackTrendingClick,
  type TrendingSurface,
} from '../lib/analytics';
import { TREND_SCORE_VERSION, trendReasonLabel, type TrendReason } from '../lib/trending';

/** Serializable trending item passed from SSR (see lib/trending.rankTrending). */
export interface TrendingItem {
  rank: number;
  score: number;
  reason: TrendReason;
  product: {
    id: string;
    title: string;
    price: number;
    originalPrice?: number | null;
    discount?: string;
    rating: number;
    volume: number;
    recentTrades: number;
    category: string;
    imageUrl: string;
    affiliateLink: string;
    currency: string;
  };
}

interface TrendCardProps {
  item: TrendingItem;
  region: string;
  currencySymbol: string;
  rtl: boolean;
  surface: TrendingSurface;
  /** stagger entrance animation */
  index: number;
  /** only the very first card of a page gets eager image loading (LCP) */
  eagerImage?: boolean;
  showReasonLine?: boolean;
}

function formatCount(n: number): string {
  if (n > 999) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function momentumLine(item: TrendingItem, rtl: boolean): string {
  const p = item.product;
  if (item.reason === 'price_drop' && p.discount) {
    return rtl ? `המחיר ירד ב-${p.discount}` : `Price dropped ${p.discount}`;
  }
  if (p.recentTrades > 0) {
    return rtl
      ? `${formatCount(p.recentTrades)} עסקאות השבוע`
      : `${formatCount(p.recentTrades)} recent orders`;
  }
  if (p.volume > 0) {
    return rtl ? `${formatCount(p.volume)} נמכרו` : `${formatCount(p.volume)} sold`;
  }
  return rtl ? 'בחירה חדשה' : 'New pick';
}

function badgeFor(reason: TrendReason, rtl: boolean): { label: string; shimmer: boolean } {
  if (reason === 'price_drop') return { label: rtl ? 'ירידת מחיר' : 'Price drop', shimmer: true };
  if (reason === 'freshness') return { label: rtl ? 'חדש' : 'Just dropped', shimmer: false };
  return { label: rtl ? 'טרנדי' : 'Trending', shimmer: false };
}

export function TrendCard({
  item,
  region,
  currencySymbol,
  rtl,
  surface,
  index,
  eagerImage = false,
  showReasonLine = false,
}: TrendCardProps) {
  const p = item.product;
  const badge = badgeFor(item.reason, rtl);
  const href = `/${region}/product/${encodeURIComponent(p.id)}`;
  const original =
    p.originalPrice != null && p.originalPrice > p.price ? p.originalPrice : null;
  const discountPct = p.discount ? parseFloat(String(p.discount)) || 0 : 0;

  const onClick = () => {
    trackTrendingClick({
      region,
      surface,
      product_id: p.id,
      rank: item.rank,
      trend_score: item.score,
      trend_reason: item.reason,
      click_target: 'pdp',
      price: p.price,
      currency: p.currency,
      discount_pct: discountPct,
      score_version: TREND_SCORE_VERSION,
    });
  };

  return (
    <article className="trend-card" style={{ animationDelay: `${Math.min(index, 7) * 90}ms` }}>
      <a
        href={href}
        onClick={onClick}
        className="flex flex-col h-full"
        aria-label={p.title}
        data-product-id={p.id}
        data-product-title={p.title}
        data-price={p.price.toFixed(2)}
        data-currency={p.currency}
        data-category={p.category}
      >
        <div className="relative aspect-square overflow-hidden" style={{ background: '#0b1222' }}>
          {p.imageUrl ? (
            <img
              {...productImage(p.imageUrl, 400, '(max-width: 640px) 60vw, 400px')}
              alt={p.title}
              className="w-full h-full object-cover"
              loading={eagerImage ? 'eager' : 'lazy'}
              // lowercase: React 18 drops the camelCase `fetchPriority` prop with a
              // warning (it only landed in React 19), so the LCP hint never reached the DOM.
              fetchpriority={eagerImage ? 'high' : 'auto'}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--t-muted)' }}>
              <Icon name="package" size={32} />
            </div>
          )}

          {/* rank */}
          <span
            className="absolute top-2 start-2 text-[0.7rem] font-extrabold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(7,11,22,0.82)', color: 'var(--t-teal)', border: '1px solid var(--t-border)' }}
          >
            #{item.rank}
          </span>

          {/* badge */}
          <span
            className={`absolute top-2 end-2 text-[0.65rem] font-extrabold px-2.5 py-1 rounded-full ${badge.shimmer ? 'trend-badge-shimmer' : ''}`}
            style={
              badge.shimmer
                ? undefined
                : { background: 'rgba(20,184,166,0.16)', color: 'var(--t-teal)', border: '1px solid rgba(20,184,166,0.35)' }
            }
          >
            {badge.label}
          </span>
        </div>

        <div className="flex flex-col flex-1 p-3 gap-1.5">
          <h3 className="text-sm font-semibold leading-snug line-clamp-2" style={{ color: 'var(--t-text)' }}>
            {p.title}
          </h3>

          <div className="flex items-baseline gap-2" dir="ltr">
            <span className="text-lg font-extrabold tabular-nums" style={{ color: 'var(--t-teal)' }}>
              {currencySymbol}
              {p.price.toFixed(2)}
            </span>
            {original != null && (
              <span className="text-xs line-through tabular-nums" style={{ color: 'var(--t-muted)' }}>
                {currencySymbol}
                {original.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[0.7rem] font-semibold mt-auto" style={{ color: 'var(--t-orange)' }}>
            <span className="trend-live-dot" aria-hidden="true" />
            {momentumLine(item, rtl)}
          </div>

          {showReasonLine && (
            <p className="text-[0.7rem] leading-snug" style={{ color: 'var(--t-muted)' }}>
              {rtl ? 'בטרנד בגלל: ' : 'Trending because: '}
              {trendReasonLabel(item.reason, rtl).toLowerCase()}
            </p>
          )}
        </div>
      </a>
    </article>
  );
}

interface TrendingRailProps {
  items: TrendingItem[];
  region: string;
  locale: string;
  currencySymbol: string;
  rtl: boolean;
}

export default function TrendingRail({ items, region, locale, currencySymbol, rtl }: TrendingRailProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  // trending_view — once per session when ≥50% visible
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || items.length === 0 || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.intersectionRatio >= 0.5)) {
          trackTrendingView({
            region,
            locale,
            surface: 'home_rail',
            product_ids: items.map((i) => i.product.id),
            result_count: items.length,
            score_version: TREND_SCORE_VERSION,
          });
          observer.disconnect();
        }
      },
      { threshold: [0.5] }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region, locale, items.length]);

  if (items.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="trend-surface py-10 md:py-12"
      aria-labelledby="trending-now-heading"
      style={{
        background:
          'radial-gradient(circle at 50% -10%, rgba(249,115,22,0.14), transparent 26rem), var(--t-bg)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-5 gap-3">
          <div className="flex items-center gap-2.5">
            <span className="trend-live-dot" aria-hidden="true" />
            <div>
              <div
                className="text-[0.65rem] font-extrabold uppercase tracking-widest"
                style={{ color: 'var(--t-teal)' }}
              >
                {rtl ? 'חי עכשיו' : 'LIVE NOW'}
              </div>
              <h2 id="trending-now-heading" className="text-xl md:text-2xl font-extrabold" style={{ color: 'var(--t-text)' }}>
                {rtl ? 'טרנדי עכשיו' : 'Trending now'}
              </h2>
            </div>
          </div>
          <a
            href={`/${region}/trending`}
            className="text-sm font-bold flex items-center gap-1 hover:underline whitespace-nowrap"
            style={{ color: 'var(--t-orange)' }}
          >
            {rtl ? 'צפו בהכל' : 'View all'}
            <Icon name={rtl ? 'chevron-left' : 'chevron-right'} size={14} />
          </a>
        </div>

        <div className="trend-rail">
          {items.slice(0, 8).map((item, i) => (
            <TrendCard
              key={item.product.id}
              item={item}
              region={region}
              currencySymbol={currencySymbol}
              rtl={rtl}
              surface="home_rail"
              index={i}
              eagerImage={i === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
