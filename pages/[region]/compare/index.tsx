import { useState, useCallback, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Header from '../../../components/Header';
import Icon from '../../../components/icons';
import BrowseNext from '../../../components/BrowseNext';
import { compareT, makeTr } from '../../../lib/compare-i18n';
import CompareAddProduct from '../../../components/CompareAddProduct';
import CompareAboveFoldExit from '../../../components/CompareAboveFoldExit';
import WhatsAppShare from '../../../components/WhatsAppShare';
import SeoHead from '../../../components/SeoHead';
import { getRegion, isValidRegion, RegionCode, RegionConfig } from '../../../lib/regions';
import { trackCompareNextAction } from '../../../lib/analytics';
import { comparisons as COMPARISON_ARTICLES } from '../../../lib/comparisons';
import type { SearchProduct } from '../../../lib/aliexpress';
import { productImage } from '../../../lib/img';
import { listingAggregateFields } from '../../../lib/pdp';
import {
  buildCompareRows,
  buildCompareShareUrl,
  comparePageDescription,
  comparePageTitle,
  MAX_COMPARE_PRODUCTS,
  MIN_COMPARE_PRODUCTS,
  compareNoindex,
  parseCompareIds,
  pickBestCompareProduct,
  type CompareSpecRow,
} from '../../../lib/product-compare';
import {
  breadcrumbJsonLd,
  productGroupJsonLd,
  productJsonLd,
  SITE_URL,
} from '../../../lib/seo';
import { outHref } from '../../../lib/out-link';

interface ComparePageProps {
  region: RegionCode;
  config: RegionConfig;
  products: SearchProduct[];
  productIds: string[];
  rows: CompareSpecRow[];
  shareUrl: string;
  rtl: boolean;
  error: string | null;
}

function tLabel(
  label: CompareSpecRow['label'],
  lang: string
): string {
  return (label as Record<string, string>)[lang] || label.en;
}

export default function ProductComparePage({
  region,
  config,
  products: initialProducts,
  productIds: initialIds,
  rows: initialRows,
  shareUrl: initialShareUrl,
  rtl,
  error,
}: ComparePageProps) {
  const router = useRouter();
  const lang = config.lang || 'en';
  const tr = makeTr(lang);
  const [backHref, setBackHref] = useState(`/${region}/search`);
  useEffect(() => {
    try {
      const from = sessionStorage.getItem('shopli:compare-from');
      if (from && from.startsWith(`/${region}/`) && !from.includes('/compare')) setBackHref(from);
    } catch {}
  }, [region]);
  // Products/rows come straight from props: on client-side navigation to this
  // same page, Next.js re-renders with fresh getServerSideProps props but does
  // NOT remount the component — useState(initial*) would keep stale data and
  // the page would look like the fetch never happened.
  const products = initialProducts;
  const rows = initialRows;
  const [productIds, setProductIds] = useState(initialIds);
  const [shareUrl, setShareUrl] = useState(initialShareUrl);
  const [copied, setCopied] = useState(false);
  const [onlyDiffs, setOnlyDiffs] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  const initialIdsKey = initialIds.join(',');
  useEffect(() => {
    setProductIds(initialIds);
    setShareUrl(initialShareUrl);
    setRemoving(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialIdsKey, initialShareUrl]);

  useEffect(() => {
    setShareUrl(buildCompareShareUrl(SITE_URL, region, productIds));
  }, [productIds, region]);

  const title = comparePageTitle(products, lang);
  const description = comparePageDescription(products, config.currencySymbol, lang);

  const structuredData: Record<string, unknown>[] = [
    breadcrumbJsonLd([
      { name: tr('Home', 'דף הבית'), url: `${SITE_URL}/${region}` },
      {
        name: tr('Compare products', 'השוואת מוצרים'),
        url: shareUrl,
      },
    ]),
  ];

  if (products.length >= MIN_COMPARE_PRODUCTS) {
    structuredData.push(
      productGroupJsonLd({
        name: title.replace(' | Shopli', ''),
        description,
        url: shareUrl,
        products: products.map((p) => ({
          title: p.title,
          description: p.title,
          image: p.imageUrl,
          url: p.id ? `${SITE_URL}/${region}/product/${encodeURIComponent(p.id)}` : shareUrl,
          brand: p.shopName,
          price: p.price,
          currency: p.currency || config.currency,
          // v1: no AggregateRating on on-site PDP URLs (docs/PDP-V1-SPEC.md)
          ...listingAggregateFields(p, {
            ratingValue: p.rating > 0 ? p.rating / 20 : undefined,
            reviewCount: p.reviewCount || p.volume || undefined,
          }),
        })),
      })
    );

    for (const p of products) {
      structuredData.push(
        productJsonLd({
          title: p.title,
          description: p.title,
          image: p.imageUrl,
          url: p.id ? `${SITE_URL}/${region}/product/${encodeURIComponent(p.id)}` : shareUrl,
          brand: p.shopName,
          price: p.price,
          currency: p.currency || config.currency,
          // v1: no AggregateRating on on-site PDP URLs (docs/PDP-V1-SPEC.md)
          ...listingAggregateFields(p, {
            ratingValue: p.rating > 0 ? p.rating / 20 : undefined,
            reviewCount: p.reviewCount || undefined,
          }),
        })
      );
    }
  }

  const copyShareLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareUrl]);

  const addIds = useCallback(
    (ids: string[]) => {
      const next = [...new Set([...productIds, ...ids])].slice(0, MAX_COMPARE_PRODUCTS);
      router.push(`/${region}/compare?ids=${encodeURIComponent(next.join(','))}`, undefined, {
        scroll: false,
      });
    },
    [productIds, region, router]
  );

  const removeProduct = useCallback(
    (id: string) => {
      setRemoving(id);
      const next = productIds.filter((pid) => pid !== id);
      setProductIds(next);
      if (next.length === 0) {
        router.push(`/${region}/compare`);
      } else {
        router.push(
          `/${region}/compare?ids=${encodeURIComponent(next.join(','))}`
        );
      }
    },
    [productIds, region, router]
  );

  const emptyState = products.length === 0;
  const visibleRows = onlyDiffs && rows.some((r) => r.differs) ? rows.filter((r) => r.differs) : rows;

  // "Our pick": most differing-spec wins, price tie-break. Shown ABOVE the fold
  // (t_bc8dc5f7) — #16 buried it under the table and bounce stayed 97-99%.
  const bestPick = pickBestCompareProduct(products, rows);

  return (
    <>
      <SeoHead
        region={region}
        path="/compare"
        title={title}
        description={description}
        image={products[0]?.imageUrl || undefined}
        ogType="product"
        canonical={shareUrl}
        noindex={compareNoindex(products)}
        jsonLd={structuredData}
      />
      <Header currentRegion={region} dir={config.direction} />

      <main
        className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-16"
        style={{ fontFamily: rtl ? "var(--font-assistant), system-ui, sans-serif" : undefined }}
      >
        <a
          href={backHref}
          className="inline-flex items-center gap-1 text-sm font-semibold mb-3 hover:underline"
          style={{ color: 'var(--shopli-orange)' }}
          data-compare-back
        >
          <Icon name={rtl ? 'arrow-right' : 'arrow-left'} size={14} />
          {tr('Back to results', 'חזרה לתוצאות')}
        </a>

        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-2 text-xs mb-4 flex-wrap"
          style={{ color: 'var(--shopli-warm-gray)' }}
          aria-label="Breadcrumb"
        >
          <a href={`/${region}`} className="hover:underline">
            {tr('Home', 'דף הבית')}
          </a>
          <span>/</span>
          <span style={{ color: 'var(--shopli-navy)' }}>
            {tr('Compare products', 'השוואת מוצרים')}
          </span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="min-w-0">
            <h1
              className="text-2xl md:text-3xl font-extrabold mb-2"
              style={{ color: 'var(--shopli-navy)' }}
            >
              {tr('Compare products', 'השוואת מוצרים')}
            </h1>
            <p
              className="text-sm md:text-base leading-relaxed max-w-2xl"
              style={{ color: 'var(--shopli-warm-gray)' }}
            >
              {tr('Compare up to 4 products side by side. Spec differences are highlighted so you can buy with confidence.', 'השוו עד 4 מוצרים זה לצד זה. הבדלים במפרט מודגשים — קבלו החלטת קנייה בביטחון.')}
            </p>
          </div>

          {products.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={copyShareLink}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3 py-2 rounded-lg border border-[#141414] bg-white hover:bg-[#FFF4E4] transition-colors"
                style={{ color: 'var(--shopli-navy)' }}
              >
                <Icon name="share" size={14} />
                {copied
                  ? tr('Copied!', 'הועתק!')
                  : tr('Copy link', 'העתק קישור')}
              </button>
              <WhatsAppShare
                title={title.replace(' | Shopli', '')}
                url={shareUrl}
                description={description}
                locale={lang}
                size="sm"
              />
            </div>
          )}
        </div>

        {/* Search-to-add (paste a link or an ID also works) */}
        <div className="mb-8">
          <CompareAddProduct
            region={region}
            lang={lang}
            currencySymbol={config.currencySymbol}
            currentIds={productIds}
            onAdd={addIds}
            error={error}
            autoFocus={emptyState}
          />
        </div>

        {emptyState && (
          <CompareAboveFoldExit
            region={region}
            rtl={rtl}
            lang={lang}
            surface="compare_tool"
            deadLanding={!!error}
            valueLine={
              tr('Search a product above, or skip straight to trending / deals / search — without leaving the site.', 'חפשו מוצר למעלה, או דלגו ישר לטרנדים / דילים / חיפוש — בלי לצאת מהאתר.')
            }
          />
        )}

        {!emptyState && bestPick && (
          <div
            className="mb-6 rounded-xl border border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4"
            data-compare-above-fold="our-pick"
          >
            {bestPick.product.imageUrl && (
              <img
                {...productImage(bestPick.product.imageUrl, 160)}
                alt=""
                className="w-16 h-16 object-contain rounded-lg bg-white shrink-0 self-center"
              />
            )}
            <div className="min-w-0 flex-1 text-center sm:text-start">
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-1 inline-flex items-center gap-1"
                style={{ color: 'var(--shopli-orange)' }}
              >
                <Icon name="check" size={12} />
                {tr('Our pick', 'הבחירה שלנו')}
                {bestPick.wins > 0 &&
                  tr.t(compareT.wins, bestPick.wins)}
              </p>
              <p
                className="text-sm font-bold line-clamp-2"
                style={{ color: 'var(--shopli-navy)' }}
              >
                {bestPick.product.title}
              </p>
              <p
                className="text-base font-bold mt-0.5"
                style={{ color: 'var(--shopli-teal)' }}
              >
                {config.currencySymbol}
                {bestPick.product.price.toFixed(2)}
              </p>
            </div>
            <div className="flex flex-col gap-2 shrink-0 sm:w-48">
              {bestPick.product.affiliateLink && (
                <a
                  href={outHref(bestPick.product.affiliateLink)}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  className="btn-primary text-sm text-center"
                  data-compare-exit="best_pick"
                  data-product-id={bestPick.product.id}
                  data-product-title={bestPick.product.title}
                  data-price={bestPick.product.price.toFixed(2)}
                  data-currency={config.currencySymbol}
                  data-category={bestPick.product.category || ''}
                >
                  <Icon name="external" size={14} />
                  {tr('Buy now', 'קנו עכשיו')}
                </a>
              )}
              <a
                href={`/${region}/product/${encodeURIComponent(bestPick.product.id)}`}
                onClick={() =>
                  trackCompareNextAction({
                    region,
                    surface: 'compare_tool',
                    target: 'best_pick',
                    product_id: bestPick.product.id,
                  })
                }
                className="text-xs text-center font-medium py-1 hover:underline"
                style={{ color: 'var(--shopli-warm-gray)' }}
              >
                {tr('View full details', 'לפרטים המלאים')}
              </a>
            </div>
          </div>
        )}

        {emptyState ? (
          <div className="text-center py-12 sm:py-16 px-4 rounded-xl border border-dashed border-[#141414] bg-[#FFF4E4]/50">
            <div
              className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{ background: 'oklch(90% 0.06 45)', color: 'var(--shopli-orange)' }}
            >
              <Icon name="list" size={28} />
            </div>
            <h2
              className="text-lg font-bold mb-2"
              style={{ color: 'var(--shopli-navy)' }}
            >
              {error
                ? tr('Could not load the comparison', 'הטעינה נכשלה')
                : tr('No products to compare yet', 'אין מוצרים להשוואה עדיין')}
            </h2>
            <p
              className="text-sm max-w-md mx-auto mb-6"
              style={{ color: 'var(--shopli-warm-gray)' }}
            >
              {tr.t(compareT.needMore, MIN_COMPARE_PRODUCTS)}
            </p>
            <a
              href={`/${region}/compare?ids=sample`}
              className="btn-secondary text-sm"
            >
              {tr('Load sample comparison', 'השוואת דוגמה')}
            </a>
            <p className="mt-4 text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
              {tr('or ', 'או ')}
              <a
                href={`/${region}/trending`}
                onClick={() =>
                  trackCompareNextAction({ region, surface: 'compare_tool', target: 'trending' })
                }
                className="font-semibold underline"
                style={{ color: 'var(--shopli-orange)' }}
              >
                {tr('browse what is trending now', 'גלו מה טרנדי עכשיו')}
              </a>
            </p>
            {!error && (
              <div className="mt-10 text-start" data-compare-articles>
                <h2 className="text-base font-bold mb-3" style={{ color: 'var(--shopli-navy)' }}>
                  {tr('Or read a ready-made comparison', 'או קראו השוואה מוכנה')}
                </h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {COMPARISON_ARTICLES.map((a) => (
                    <li key={a.slug}>
                      <a
                        href={`/${region}/compare/${a.slug}`}
                        onClick={() =>
                          trackCompareNextAction({ region, surface: 'compare_tool', target: 'article' })
                        }
                        className="block rounded-lg border border-[#141414] bg-white px-3 py-2 text-sm font-semibold hover:bg-orange-50/40"
                        style={{ color: 'var(--shopli-navy)' }}
                      >
                        {a.title[config?.lang || 'en'] || a.title.en}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Product header cards — horizontal scroll on mobile */}
            <div className="mb-6 -mx-4 sm:mx-0">
              <div className="flex sm:grid sm:grid-cols-[minmax(7rem,10rem)_repeat(auto-fit,minmax(0,1fr))] gap-3 overflow-x-auto px-4 sm:px-0 pb-2 snap-x snap-mandatory">
                {/* Spacer matching spec label column on desktop */}
                <div className="hidden sm:block" aria-hidden />
                {products.map((p) => (
                  <div
                    key={p.id}
                    className={`snap-start shrink-0 w-[70vw] max-w-[220px] sm:w-auto sm:max-w-none bg-white rounded-xl border border-[#141414]  overflow-hidden flex flex-col ${
                      removing === p.id ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="aspect-square bg-[#FFF4E4] relative">
                      {p.imageUrl ? (
                        <img
                          {...productImage(p.imageUrl, 400, '(max-width: 640px) 70vw, 220px')}
                          alt={p.title}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ color: 'var(--shopli-warm-gray)' }}
                        >
                          <Icon name="package" size={36} />
                        </div>
                      )}
                      {bestPick?.product.id === p.id && (
                        <span
                          className="absolute bottom-2 start-2 text-[0.65rem] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: 'var(--shopli-orange)', color: 'var(--shopli-ink)' }}
                        >
                          {tr('Our pick', 'הבחירה שלנו')}
                        </span>
                      )}
                      {p.discount && (
                        <span
                          className="absolute top-2 end-2 text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-white/95 "
                          style={{ color: 'var(--shopli-orange)' }}
                        >
                          -{p.discount}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeProduct(p.id)}
                        className="absolute top-2 start-2 w-7 h-7 rounded-full bg-white/95  flex items-center justify-center hover:bg-red-50 transition-colors"
                        style={{ color: 'var(--shopli-warm-gray)' }}
                        aria-label={tr('Remove from comparison', 'הסר מהשוואה')}
                      >
                        <Icon name="close" size={14} />
                      </button>
                    </div>
                    <div className="p-3 flex flex-col flex-1">
                      <h2
                        className="text-xs sm:text-sm font-semibold leading-snug line-clamp-3 mb-2"
                        style={{ color: 'var(--shopli-navy)' }}
                      >
                        {p.title}
                      </h2>
                      <div className="mt-auto">
                        <div className="flex items-baseline gap-1.5 mb-2">
                          <span
                            className="text-base font-bold"
                            style={{ color: 'var(--shopli-teal)' }}
                          >
                            {config.currencySymbol}
                            {p.price.toFixed(2)}
                          </span>
                          {p.originalPrice != null && p.originalPrice > p.price && (
                            <span
                              className="text-xs line-through"
                              style={{ color: 'var(--shopli-warm-gray)' }}
                            >
                              {config.currencySymbol}
                              {p.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <a
                          href={p.affiliateLink ? outHref(p.affiliateLink) : `/${region}/product/${encodeURIComponent(p.id)}`}
                          target="_blank"
                          rel="nofollow sponsored noopener noreferrer"
                          className="btn-primary w-full text-xs py-2"
                          data-product-id={p.id}
                          data-product-title={p.title}
                          data-price={p.price.toFixed(2)}
                          data-currency={config.currencySymbol}
                          data-category={p.category || ''}
                        >
                          <Icon name="external" size={12} />
                          {tr('Buy now', 'קנו עכשיו')}
                        </a>
                        <a
                          href={`/${region}/product/${encodeURIComponent(p.id)}`}
                          onClick={() =>
                            trackCompareNextAction({
                              region,
                              surface: 'compare_tool',
                              target: 'pdp',
                              product_id: p.id,
                            })
                          }
                          className="mt-1.5 block text-center text-xs font-medium py-1.5 rounded-lg border border-[#141414] hover:border-orange-200 hover:bg-orange-50/50 transition-colors"
                          style={{ color: 'var(--shopli-navy)' }}
                        >
                          {tr('Details & similar', 'פרטים ומוצרים דומים')}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
                {products.length < MAX_COMPARE_PRODUCTS && (
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('compare-add');
                      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      el?.focus();
                    }}
                    className="snap-start shrink-0 w-[40vw] max-w-[160px] sm:w-auto sm:max-w-none min-h-[10rem] rounded-xl border-2 border-dashed border-[#141414] flex flex-col items-center justify-center gap-1 text-sm font-semibold hover:bg-[#FFF4E4]"
                    style={{ color: 'var(--shopli-navy)' }}
                  >
                    <span className="text-2xl leading-none">+</span>
                    {tr('Add product', 'הוסיפו מוצר')}
                  </button>
                )}
              </div>
            </div>

            {/* Comparison table */}
            <section
              className="bg-white rounded-xl border border-[#141414]  overflow-hidden"
              aria-label={tr('Comparison table', 'טבלת השוואה')}
            >
              <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#141414]">
                <h2 className="text-sm font-bold" style={{ color: 'var(--shopli-navy)' }}>
                  {tr('Spec comparison', 'השוואת מפרט')}
                </h2>
                <label
                  className="inline-flex items-center gap-2 text-sm cursor-pointer select-none"
                  style={{ color: 'var(--shopli-navy)' }}
                >
                  <input
                    type="checkbox"
                    checked={onlyDiffs}
                    onChange={(e) => setOnlyDiffs(e.target.checked)}
                    className="w-4 h-4 accent-orange-500"
                  />
                  {tr('Show only differences', 'הצג רק הבדלים')}
                </label>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#141414]">
                      <th
                        className="sticky start-0 z-10 bg-[#FFF4E4] text-start text-xs font-semibold uppercase tracking-wider px-3 sm:px-4 py-3 min-w-[7rem] sm:min-w-[10rem]"
                        style={{ color: 'var(--shopli-warm-gray)' }}
                      >
                        {tr('Spec', 'מפרט')}
                      </th>
                      {products.map((p) => (
                        <th
                          key={p.id}
                          className="bg-[#FFF4E4] text-start px-3 sm:px-4 py-3 font-semibold text-xs align-top min-w-[9rem]"
                          style={{ color: 'var(--shopli-navy)' }}
                        >
                          <span className="flex items-center gap-2">
                            {p.imageUrl && (
                              <img
                                {...productImage(p.imageUrl, 80)}
                                alt=""
                                className="w-9 h-9 object-contain rounded bg-white shrink-0"
                              />
                            )}
                            <span className="line-clamp-2">{p.title}</span>
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRows.map((row) => (
                      <tr
                        key={row.key}
                        className={`border-b border-gray-50 last:border-0 ${
                          row.differs ? 'bg-amber-50/60' : ''
                        }`}
                      >
                        <th
                          scope="row"
                          className={`sticky start-0 z-10 text-start text-xs font-semibold px-3 sm:px-4 py-3 ${
                            row.differs ? 'bg-amber-50' : 'bg-white'
                          }`}
                          style={{ color: 'var(--shopli-navy)' }}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            {tLabel(row.label, lang)}
                            {row.differs && (
                              <span
                                className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ background: 'var(--shopli-orange)' }}
                                title={tr('Values differ', 'יש הבדל')}
                              />
                            )}
                          </span>
                        </th>
                        {row.display.map((cell, i) => {
                          const isBest =
                            row.differs &&
                            row.bestIndex === i &&
                            row.bestIndex !== null;
                          return (
                            <td
                              key={`${row.key}-${i}`}
                              className={`px-3 sm:px-4 py-3 ${
                                row.differs ? 'font-medium' : ''
                              } ${isBest ? 'text-teal-700 font-bold bg-teal-50' : ''}`}
                              style={{
                                color: isBest
                                  ? undefined
                                  : row.differs
                                    ? 'var(--shopli-navy)'
                                    : 'var(--shopli-warm-gray)',
                              }}
                            >
                              <span className="inline-flex items-center gap-1">
                                {isBest && (
                                  <Icon
                                    name="check"
                                    size={12}
                                    className="text-teal-600 shrink-0"
                                  />
                                )}
                                {cell}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div
                className="px-4 py-3 border-t border-[#141414] text-xs flex flex-wrap items-center gap-3"
                style={{ color: 'var(--shopli-warm-gray)' }}
              >
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded bg-amber-50 border border-amber-200"
                    aria-hidden
                  />
                  {tr('Amber rows = specs that differ', 'שורות כתומות = הבדל בין מוצרים')}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="check" size={12} className="text-teal-600" />
                  {tr('Check = better value', 'סימון = הערך הטוב יותר')}
                </span>
              </div>
            </section>

            {/* Share again at bottom for mobile */}
            <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl bg-orange-50/60 border border-orange-100">
              <div>
                <p
                  className="text-sm font-semibold mb-0.5"
                  style={{ color: 'var(--shopli-navy)' }}
                >
                  {tr('Share this comparison', 'שתפו את ההשוואה')}
                </p>
                <p className="text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
                  {tr('The link keeps your selected products — perfect for friends or later.', 'הקישור שומר את המוצרים שבחרתם — מושלם לחברים או לעצמכם.')}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={copyShareLink}
                  className="btn-secondary text-xs py-2"
                >
                  <Icon name="share" size={14} />
                  {copied
                    ? tr('Copied!', 'הועתק!')
                    : tr('Copy URL', 'העתק URL')}
                </button>
                <WhatsAppShare
                  title={title.replace(' | Shopli', '')}
                  url={shareUrl}
                  description={description}
                  locale={lang}
                  size="sm"
                />
              </div>
            </div>

            <BrowseNext region={region} rtl={rtl} lang={lang} surface="compare_tool" />
          </>
        )}
      </main>

    </>
  );
}

// Last-resort IDs for the sample comparison, verified live 2026-08-02.
const SAMPLE_FALLBACK_IDS = ['1005010287294727', '1005007171202355', '1005007244759019'];

export const getServerSideProps: GetServerSideProps = async ({ params, query, res }) => {
  const region = ((params?.region as string) || 'eu') as RegionCode;
  if (!isValidRegion(region)) return { notFound: true };
  const config = getRegion(region);
  const rtl = config.direction === 'rtl';
  const tr = makeTr(config.lang);
  const rawIds = query.ids as string | undefined;
  let productIds: string[];

  if (rawIds === 'sample') {
    // "Load sample comparison": resolve to 3 real, currently-live products so
    // the sample never shows fabricated data or dead affiliate links.
    // AliExpress search is flaky/rate-limited from serverless egress IPs (returns
    // empty without throwing), so retry with a pause; if search stays empty, fall
    // back to curated IDs verified live — productdetail calls are reliable.
    const { searchAliExpress } = await import('../../../lib/aliexpress');
    let found: SearchProduct[] = [];
    for (let attempt = 0; attempt < 3 && found.length < MIN_COMPARE_PRODUCTS; attempt++) {
      if (attempt > 0) await new Promise((r) => setTimeout(r, 800));
      try {
        found = await searchAliExpress('wireless charger', region, 6);
      } catch {
        // retry
      }
    }
    productIds =
      found.length >= MIN_COMPARE_PRODUCTS
        ? found.slice(0, 3).map((p) => p.id)
        : [...SAMPLE_FALLBACK_IDS];
  } else {
    productIds = parseCompareIds(rawIds);
  }

  let products: SearchProduct[] = [];
  let error: string | null = null;

  if (productIds.length > 0) {
    try {
      const { getProductsByIds } = await import('../../../lib/aliexpress');
      products = await getProductsByIds(productIds, region);

      // Never fabricate fallback products: an empty/failed API response must
      // surface as an error, not as fake items with dead affiliate links.
      if (products.length === 0) {
        error =
          tr("We couldn't load those products right now. Check the IDs or try again in a moment.", 'לא הצלחנו לטעון את המוצרים כרגע. בדקו את המזהים או נסו שוב בעוד רגע.');
      } else if (products.length < MIN_COMPARE_PRODUCTS) {
        error =
          tr('Only one product loaded — add another ID to compare.', 'נטען מוצר אחד בלבד — הוסיפו עוד מזהה כדי להשוות.');
      }
    } catch (e: any) {
      error =
        tr('Failed to load products. Please try again in a moment.', 'שגיאה בטעינת המוצרים. נסו שוב בעוד רגע.');
      products = [];
    }
  } else if (rawIds && rawIds !== 'sample') {
    error =
      tr('Those product IDs look invalid. Enter 2–4 numeric IDs separated by commas.', 'מזהי המוצר לא תקינים. הזינו 2–4 מזהים מספריים מופרדים בפסיק.');
  }

  const rows = buildCompareRows(products, config.currencySymbol);
  const shareUrl = buildCompareShareUrl(SITE_URL, region, products.map((p) => p.id));

  // Keyed on ?ids= by the CDN, so a shared comparison link is cheap on repeat hits.
  // Short TTL: prices here are the thing being compared.
  if (!error) res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=3600');

  return {
    props: {
      region,
      config,
      products,
      productIds: products.map((p) => p.id),
      rows,
      shareUrl,
      rtl,
      error,
    },
  };
};


