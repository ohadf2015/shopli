import Link from 'next/link';
import Icon from './icons';
import { productImage } from '../lib/img';
import type { Pick } from '../lib/picks';

/**
 * "Moving right now" — the homepage rail built from our own history.
 *
 * Every other product section on this site ranks by lifetime volume, which is
 * a fact about the past: the same bestsellers sit at the top week after week.
 * These come from lib/picks.ts, which compares each product against ITS OWN
 * recent rate and its own median price, so the rail changes when the market
 * changes rather than when we redeploy.
 *
 * Each card says why it is here, with the number behind it. That is the whole
 * point of computing this instead of curating a list — and it is the one claim
 * on the page a shopper can check.
 */

export interface MoverItem {
  productId: string;
  title: string;
  imageUrl: string;
  price: number;
  reason: Pick['reason'];
  recentPerDay: number;
  perDay: number;
  surge: number;
  dropPct: number;
  spanDays: number;
  rating: number;
  /** 1-5 average from real buyer ratings; 0 when the store has none yet. */
  stars: number;
  /** Written buyer reviews (feedback endpoint's writtenCount); 0 = unknown, render nothing. */
  reviewCount: number;
}

const COPY = {
  en: {
    heading: 'Moving right now',
    lead: 'Ranked against each product’s own recent sales and its own price history — not against a list we wrote.',
    surging: 'Surging',
    price_drop: 'Real price drop',
    bestseller: 'Best seller',
    perDay: (n: string) => `${n} a day right now`,
    surge: (x: string) => `${x}× its usual rate`,
    drop: (p: number, d: number) => `${p}% below its own ${d}-day median`,
    reviews: (n: string) => `${n} reviews`,
    asOf: (d: string) => `as of ${d}`,
    all: 'Play Guess the Price',
  },
  he: {
    heading: 'מה זז עכשיו',
    lead: 'הדירוג מול קצב המכירות של המוצר עצמו ומול היסטוריית המחירים שלו — לא מול רשימה שכתבנו.',
    surging: 'מזנק',
    price_drop: 'ירידת מחיר אמיתית',
    bestseller: 'רב מכר',
    perDay: (n: string) => `${n} ביום עכשיו`,
    surge: (x: string) => `פי ${x} מהקצב הרגיל שלו`,
    drop: (p: number, d: number) => `${p}% מתחת לחציון של ${d} ימים`,
    reviews: (n: string) => `${n} ביקורות`,
    asOf: (d: string) => `נכון ל-${d}`,
    all: 'למשחק נחשו את המחיר',
  },
};

const BADGE: Record<Pick['reason'], { icon: string; bg: string }> = {
  surging: { icon: '🚀', bg: 'oklch(94% 0.06 45)' },
  price_drop: { icon: '💸', bg: 'oklch(94% 0.06 150)' },
  bestseller: { icon: '🏆', bg: 'oklch(95% 0.03 90)' },
};

export default function MoversRail({
  items,
  region,
  rtl,
  lang,
  currencySymbol,
  asOf,
}: {
  items: MoverItem[];
  region: string;
  rtl: boolean;
  lang: string;
  currencySymbol: string;
  /** YYYY-MM-DD of the newest snapshot behind the rail; empty hides the date. */
  asOf?: string;
}) {
  if (!items.length) return null;
  const c = rtl ? COPY.he : COPY.en;
  const locale = lang === 'he' ? 'he-IL' : 'en-US';
  const num = (n: number) => Math.round(n).toLocaleString(locale);
  // "Moving right now" is only honest with its date attached: the numbers come
  // from the daily snapshot sweep, so the rail says which day they describe.
  const asOfLabel = asOf
    ? c.asOf(new Date(`${asOf}T00:00:00`).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }))
    : '';

  const fact = (m: MoverItem) => {
    if (m.reason === 'price_drop') return c.drop(m.dropPct, m.spanDays);
    if (m.reason === 'surging') return `${c.perDay(num(m.recentPerDay))} · ${c.surge(m.surge.toFixed(1))}`;
    return c.perDay(num(m.perDay));
  };

  // Prefer the real buyer average; fall back to the seller's positive-feedback
  // rate (0-100) mapped onto the same 1-5 scale. 0 means render nothing.
  const starsOf = (m: MoverItem) => m.stars > 0 ? m.stars : m.rating > 0 ? m.rating / 20 : 0;

  return (
    <section className="py-10 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4 mb-5 flex-wrap">
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: 'var(--shopli-navy)' }}>
              {c.heading}
            </h2>
            <p className="text-sm max-w-2xl" style={{ color: 'var(--shopli-warm-gray)' }}>
              {c.lead}
            </p>
            {asOfLabel && (
              <p className="text-[11px] mt-1 font-medium" style={{ color: 'var(--shopli-warm-gray)' }}>
                {asOfLabel}
              </p>
            )}
          </div>
          <Link
            href={`/${region}/game`}
            className="text-sm font-semibold flex items-center gap-1 hover:underline whitespace-nowrap"
            style={{ color: 'var(--shopli-orange)' }}
          >
            {c.all}
            <Icon name={rtl ? 'chevron-left' : 'chevron-right'} size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {items.slice(0, 8).map((m, i) => (
            <Link
              key={m.productId}
              href={`/${region}/product/${m.productId}`}
              className="group rounded-2xl border border-gray-100 overflow-hidden hover:border-orange-200 hover:shadow-sm transition-all"
            >
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  {...productImage(m.imageUrl, 300, '(max-width: 768px) 50vw, 300px')}
                  alt={m.title}
                  className="w-full aspect-square object-cover bg-gray-50"
                  // Lowercase: React 18 drops the camelCase fetchPriority prop.
                  loading={i < 2 ? 'eager' : 'lazy'}
                  fetchpriority={i === 0 ? 'high' : undefined}
                />
                <span
                  className="absolute top-2 start-2 text-[11px] font-bold px-2 py-1 rounded-full"
                  style={{ background: BADGE[m.reason].bg, color: 'var(--shopli-navy)' }}
                >
                  {BADGE[m.reason].icon} {c[m.reason]}
                </span>
                {m.dropPct > 0 && (
                  <span
                    className="absolute top-2 end-2 text-[11px] font-bold px-2 py-1 rounded-full bg-white/95 backdrop-blur-sm shadow-sm"
                    style={{ color: 'var(--shopli-orange)' }}
                  >
                    -{m.dropPct}%
                  </span>
                )}
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold line-clamp-2 mb-1" style={{ color: 'var(--shopli-navy)' }}>
                  {m.title}
                </h3>
                <div className="text-base font-bold mb-1" style={{ color: 'var(--shopli-orange)' }}>
                  {currencySymbol}{m.price.toFixed(2)}
                </div>
                {(starsOf(m) > 0 || m.reviewCount > 0) && (
                  <div className="flex items-center gap-1 flex-wrap mb-1" style={{ color: 'var(--shopli-warm-gray)' }}>
                    {starsOf(m) > 0 && (
                      <>
                        <Icon name="star" size={11} className="text-yellow-500 shrink-0" />
                        <span className="text-[11px] font-medium tabular-nums">
                          {starsOf(m).toFixed(1)}
                        </span>
                      </>
                    )}
                    {m.reviewCount > 0 && (
                      <span className="text-[11px]">
                        ({m.reviewCount > 999 ? `${(m.reviewCount / 1000).toFixed(1)}k` : num(m.reviewCount)})
                      </span>
                    )}
                  </div>
                )}
                <p className="text-[11px] leading-snug" style={{ color: 'var(--shopli-warm-gray)' }}>
                  {fact(m)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
