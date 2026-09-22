import Icon from './icons';
import WhatsAppShare from './WhatsAppShare';
import { productImage } from '../lib/img';
import {
  HOME_PRIMARY_CTA_CLASS,
  homeHeroCopy,
  homeHeroSectionClass,
  homePrimaryCtaHref,
} from '../lib/home-hero';
import type { TrendingItem } from './TrendingRail';
import { SITE_URL } from '../lib/seo';

type HomeLang = 'he' | 'en' | 'fr' | 'de' | 'es' | 'it' | 'ru';

interface HomeAboveFoldProps {
  region: string;
  lang: HomeLang;
  rtl: boolean;
  currencySymbol: string;
  tgChannel?: string;
  /** Live trending picks — first four render as the above-fold conversion surface. */
  trending: TrendingItem[];
}

/**
 * Region-home above-fold: sharper outcome/CTA + deal preview inside first viewport.
 * t_90541a24 — after #37, /eu bounce still 52.2% and 0% reach halfway; tighten
 * the fold and make Shop the only loud action. Do not reopen t_2ecfa746 / t_bc8dc5f7.
 */
export default function HomeAboveFold({
  region,
  lang,
  rtl,
  currencySymbol,
  tgChannel,
  trending,
}: HomeAboveFoldProps) {
  const copy = homeHeroCopy({ region, lang, rtl, currencySymbol });
  const browseHref = homePrimaryCtaHref(region);
  const preview = trending.slice(0, 4);
  const pageUrl = `${SITE_URL}/${region}`;

  return (
    <section
      className={homeHeroSectionClass()}
      aria-label={rtl ? 'פתיח' : 'Hero'}
      data-home-above-fold="1"
    >
      <div className="max-w-3xl">
        <div
          className="text-xs font-bold tracking-widest uppercase mb-2"
          style={{ color: 'var(--shopli-orange)' }}
        >
          {copy.eyebrow}
        </div>
        <h1
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight mb-2"
          style={{ color: 'var(--shopli-navy)' }}
        >
          {copy.title}
        </h1>
        <p
          className="text-sm sm:text-base mb-3 leading-relaxed"
          style={{ color: 'var(--shopli-warm-gray)' }}
        >
          {copy.description}
        </p>

        {/* Value chips — concrete reasons to stay, above the fold */}
        <ul
          className="flex flex-wrap gap-2 mb-4"
          aria-label={rtl ? 'למה שופלי' : 'Why Shopli'}
        >
          {copy.chips.map((chip) => (
            <li
              key={chip.label}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full border border-orange-100"
              style={{
                background: 'oklch(97% 0.02 55)',
                color: 'var(--shopli-navy)',
              }}
            >
              <span style={{ color: 'var(--shopli-orange)' }}>
                <Icon name={chip.icon} size={12} />
              </span>
              {chip.label}
            </li>
          ))}
        </ul>

        {/* Sole primary CTA row */}
        <div className="flex flex-wrap items-center gap-3 mb-1">
          <a
            href={browseHref}
            className={HOME_PRIMARY_CTA_CLASS}
            data-home-cta="browse"
          >
            <Icon name="tag" size={16} />
            {copy.ctaLabel}
          </a>
          {tgChannel && (
            <a
              href={`https://t.me/${tgChannel}`}
              target="_blank"
              rel="noopener"
              className="btn-secondary"
              data-home-cta="telegram"
            >
              <Icon name="telegram" size={16} />
              {rtl ? 'ערוץ טלגרם' : 'Telegram'}
            </a>
          )}
        </div>
        <p
          className="text-xs mb-3"
          style={{ color: 'var(--shopli-warm-gray)' }}
          data-home-cta-hint="1"
        >
          {copy.ctaHint}
        </p>

        {/* Demoted diversions — text only, never rival Browse */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-4">
          <a href={`/${region}/game`} className="btn-text" data-home-cta="game">
            <Icon name="star" size={14} />
            {rtl ? 'נחשו את המחיר' : 'Guess the Price'}
          </a>
          <WhatsAppShare
            title={
              rtl
                ? 'שופלי — הדילים הכי שווים מאליאקספרס'
                : 'Shopli — The Best AliExpress Deals'
            }
            url={pageUrl}
            description={copy.description}
            locale={lang}
            size="md"
            variant="text"
            className="btn-text"
          />
        </div>
      </div>

      {/* Above-fold conversion surface — live picks without scrolling */}
      {preview.length > 0 && (
        <div
          className="rounded-xl border border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 p-3 sm:p-4"
          data-home-deal-preview="1"
        >
          <div className="flex items-end justify-between gap-3 mb-2.5">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-0.5 inline-flex items-center gap-1"
                style={{ color: 'var(--shopli-orange)' }}
              >
                <Icon name="check" size={12} />
                {copy.previewHeading}
              </p>
              <p className="text-sm font-medium" style={{ color: 'var(--shopli-navy)' }}>
                {copy.previewSub}
              </p>
            </div>
            <a
              href={browseHref}
              className="text-xs font-bold hover:underline whitespace-nowrap hidden sm:inline-flex items-center gap-1"
              style={{ color: 'var(--shopli-orange)' }}
              data-home-cta="preview-all"
            >
              {rtl ? 'הכל' : 'See all'}
              <Icon name={rtl ? 'chevron-left' : 'chevron-right'} size={12} />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
            {preview.map((item, i) => {
              const p = item.product;
              const href = `/${region}/product/${encodeURIComponent(p.id)}`;
              const original =
                p.originalPrice != null && p.originalPrice > p.price
                  ? p.originalPrice
                  : null;
              return (
                <a
                  key={p.id}
                  href={href}
                  className="group rounded-lg bg-white border border-gray-100 overflow-hidden hover:border-orange-200 hover:shadow-sm transition-all"
                  aria-label={p.title}
                  data-home-preview-product={p.id}
                >
                  <div className="aspect-square overflow-hidden bg-gray-50">
                    {p.imageUrl ? (
                      <img
                        {...productImage(
                          p.imageUrl,
                          240,
                          '(max-width: 640px) 45vw, 240px'
                        )}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform"
                        loading={i === 0 ? 'eager' : 'lazy'}
                        fetchPriority={i === 0 ? 'high' : 'auto'}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ color: 'var(--shopli-warm-gray)' }}
                      >
                        <Icon name="package" size={28} />
                      </div>
                    )}
                  </div>
                  <div className="p-2 sm:p-2.5">
                    <p
                      className="text-[0.7rem] sm:text-xs font-medium leading-snug line-clamp-2 mb-1"
                      style={{ color: 'var(--shopli-navy)' }}
                    >
                      {p.title}
                    </p>
                    <div className="flex items-baseline gap-1.5 mb-1" dir="ltr">
                      <span
                        className="text-sm font-extrabold tabular-nums"
                        style={{ color: 'var(--shopli-orange)' }}
                      >
                        {currencySymbol}
                        {p.price.toFixed(2)}
                      </span>
                      {original != null && (
                        <span
                          className="text-[0.65rem] line-through tabular-nums"
                          style={{ color: 'var(--shopli-warm-gray)' }}
                        >
                          {currencySymbol}
                          {original.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <span
                      className="text-[0.65rem] font-bold uppercase tracking-wide"
                      style={{ color: 'var(--shopli-orange)' }}
                      data-home-deal-cta="1"
                    >
                      {copy.dealCtaLabel}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
