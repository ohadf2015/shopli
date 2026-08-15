import { useState } from 'react';
import type { ProductReviews } from '../lib/reviews';

/**
 * What people who actually bought it think.
 *
 * Attribution is explicit and repeated: these are AliExpress buyers' reviews,
 * republished, not Shopli reviews. That is also why the page does not emit
 * aggregateRating structured data for them — third-party review content marked
 * up as first-party is a manual-action pattern, and this site is an affiliate.
 *
 * The two counts are labelled separately on purpose. The endpoint reports 6,814
 * ratings and 1,186 written reviews for the same product; showing one number
 * over the other's histogram is the kind of thing a shopper notices.
 */

interface Props {
  reviews: ProductReviews;
  rtl: boolean;
  lang: string;
}

const COPY = {
  en: {
    heading: 'What buyers say',
    source: 'From verified AliExpress buyers',
    ratings: (n: string) => `${n} ratings`,
    written: (n: string) => `${n} written reviews`,
    photos: 'Buyer photos',
    bought: 'Bought',
    from: 'from',
    more: 'Show more reviews',
    stars: (n: number) => `${n} stars`,
    countries: 'Buyers in',
  },
  he: {
    heading: 'מה הקונים אומרים',
    source: 'מקונים מאומתים באליאקספרס',
    ratings: (n: string) => `${n} דירוגים`,
    written: (n: string) => `${n} ביקורות כתובות`,
    photos: 'תמונות מקונים',
    bought: 'נרכש',
    from: 'מ',
    more: 'עוד ביקורות',
    stars: (n: number) => `${n} כוכבים`,
    countries: 'קונים מ',
  },
};

const FLAGS: Record<string, string> = {
  US: '🇺🇸', IL: '🇮🇱', RU: '🇷🇺', BR: '🇧🇷', FR: '🇫🇷', DE: '🇩🇪', ES: '🇪🇸', IT: '🇮🇹',
  GB: '🇬🇧', PL: '🇵🇱', NL: '🇳🇱', UA: '🇺🇦', CA: '🇨🇦', AU: '🇦🇺', MX: '🇲🇽', KR: '🇰🇷',
  JP: '🇯🇵', TR: '🇹🇷', SA: '🇸🇦', PT: '🇵🇹', SE: '🇸🇪', CL: '🇨🇱', CO: '🇨🇴', AR: '🇦🇷',
};

function Stars({ n }: { n: number }) {
  return (
    <span aria-hidden className="tracking-tight" style={{ color: 'var(--shopli-orange)' }}>
      {'★'.repeat(n)}
      <span style={{ color: 'oklch(85% 0.02 60)' }}>{'★'.repeat(5 - n)}</span>
    </span>
  );
}

export default function BuyerReviews({ reviews, rtl, lang }: Props) {
  const [expanded, setExpanded] = useState(false);
  const c = rtl ? COPY.he : COPY.en;
  const locale = lang === 'he' ? 'he-IL' : 'en-US';
  const num = (n: number) => n.toLocaleString(locale);

  const shown = expanded ? reviews.reviews : reviews.reviews.slice(0, 4);
  const photos = reviews.reviews.flatMap((r) => r.photos).slice(0, 8);
  const maxBar = Math.max(1, ...([5, 4, 3, 2, 1] as const).map((s) => reviews.histogram[s]));

  return (
    <section className="mt-10 fade-in" aria-label={c.heading}>
      <div className="flex items-baseline justify-between gap-3 mb-4 flex-wrap">
        <h2 className="text-lg font-bold" style={{ color: 'var(--shopli-navy)' }}>
          {c.heading}
        </h2>
        <span className="text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
          {c.source}
        </span>
      </div>

      <div className="rounded-2xl border border-gray-100 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row gap-5">
          {/* Score + the two counts, each labelled with what it counts */}
          <div className="sm:w-44 shrink-0">
            <div className="text-4xl font-extrabold leading-none" style={{ color: 'var(--shopli-navy)' }}>
              {reviews.averageStars.toFixed(1)}
            </div>
            <div className="mt-1 text-lg">
              <Stars n={Math.round(reviews.averageStars)} />
            </div>
            <div className="mt-1 text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
              {c.ratings(num(reviews.ratingCount))}
              <br />
              {c.written(num(reviews.writtenCount))}
            </div>
          </div>

          {/* Histogram */}
          <div className="flex-1 min-w-0 space-y-1.5">
            {([5, 4, 3, 2, 1] as const).map((s) => (
              <div key={s} className="flex items-center gap-2">
                <span className="text-xs w-10 shrink-0" style={{ color: 'var(--shopli-warm-gray)' }}>
                  {s} ★
                </span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'oklch(94% 0.01 60)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(reviews.histogram[s] / maxBar) * 100}%`,
                      background: 'var(--shopli-orange)',
                    }}
                    aria-label={c.stars(s)}
                  />
                </div>
                <span className="text-xs w-12 text-end shrink-0" style={{ color: 'var(--shopli-warm-gray)' }}>
                  {num(reviews.histogram[s])}
                </span>
              </div>
            ))}
          </div>
        </div>

        {reviews.countries.length > 0 && (
          <div className="mt-4 flex items-center gap-1.5 flex-wrap text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
            <span>{c.countries}</span>
            {reviews.countries.slice(0, 8).map((cc) => (
              <span key={cc} className="px-1.5 py-0.5 rounded-md" style={{ background: 'oklch(96% 0.01 60)' }}>
                {FLAGS[cc] || ''} {cc}
              </span>
            ))}
          </div>
        )}
      </div>

      {photos.length > 0 && (
        <div className="mt-4">
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--shopli-navy)' }}>
            {c.photos}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {photos.map((src) => (
              // Buyer photos come straight from AliExpress' CDN; next/image would
              // need every one of their hosts allowlisted for no benefit here.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
                width={96}
                height={96}
                className="w-24 h-24 object-cover rounded-xl shrink-0 border border-gray-100"
              />
            ))}
          </div>
        </div>
      )}

      <ul className="mt-4 space-y-3">
        {shown.map((r) => (
          <li key={r.id} className="rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 text-xs mb-1.5" style={{ color: 'var(--shopli-warm-gray)' }}>
              <Stars n={r.stars} />
              {r.country && <span>{FLAGS[r.country] || ''} {r.country}</span>}
              {r.date && <span>· {r.date}</span>}
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--shopli-navy)' }}>
              {r.text}
            </p>
            {r.variant && (
              <div className="mt-2 text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
                {c.bought}: {r.variant}
              </div>
            )}
            {r.photos.length > 0 && (
              <div className="mt-2 flex gap-2">
                {r.photos.map((src) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={src}
                    src={src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-100"
                  />
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>

      {!expanded && reviews.reviews.length > 4 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-3 text-sm font-semibold hover:underline"
          style={{ color: 'var(--shopli-orange)' }}
        >
          {c.more} ({reviews.reviews.length - 4})
        </button>
      )}
    </section>
  );
}
