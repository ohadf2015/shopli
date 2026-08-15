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
}: {
  items: MoverItem[];
  region: string;
  rtl: boolean;
  lang: string;
  currencySymbol: string;
}) {
  if (!items.length) return null;
  const c = rtl ? COPY.he : COPY.en;
  const locale = lang === 'he' ? 'he-IL' : 'en-US';
  const num = (n: number) => Math.round(n).toLocaleString(locale);

  const fact = (m: MoverItem) => {
    if (m.reason === 'price_drop') return c.drop(m.dropPct, m.spanDays);
    if (m.reason === 'surging') return `${c.perDay(num(m.recentPerDay))} · ${c.surge(m.surge.toFixed(1))}`;
    return c.perDay(num(m.perDay));
  };

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
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold line-clamp-2 mb-1" style={{ color: 'var(--shopli-navy)' }}>
                  {m.title}
                </h3>
                <div className="text-base font-bold mb-1" style={{ color: 'var(--shopli-orange)' }}>
                  {currencySymbol}{m.price.toFixed(2)}
                </div>
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
