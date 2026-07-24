import { useState, useCallback, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Header from '../../../components/Header';
import Icon from '../../../components/icons';
import WhatsAppShare from '../../../components/WhatsAppShare';
import SeoHead from '../../../components/SeoHead';
import { getRegion, RegionCode, RegionConfig } from '../../../lib/regions';
import type { SearchProduct } from '../../../lib/aliexpress';
import {
  buildCompareRows,
  buildCompareShareUrl,
  comparePageDescription,
  comparePageTitle,
  MAX_COMPARE_PRODUCTS,
  MIN_COMPARE_PRODUCTS,
  parseCompareIds,
  type CompareSpecRow,
} from '../../../lib/product-compare';
import {
  breadcrumbJsonLd,
  productGroupJsonLd,
  productJsonLd,
  SITE_URL,
} from '../../../lib/seo';

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
  const [products] = useState(initialProducts);
  const [rows] = useState(initialRows);
  const [productIds, setProductIds] = useState(initialIds);
  const [shareUrl, setShareUrl] = useState(initialShareUrl);
  const [copied, setCopied] = useState(false);
  const [idInput, setIdInput] = useState(initialIds.join(', '));
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    setShareUrl(buildCompareShareUrl(SITE_URL, region, productIds));
  }, [productIds, region]);

  const title = comparePageTitle(products, lang);
  const description = comparePageDescription(products, config.currencySymbol, lang);

  const structuredData: Record<string, unknown>[] = [
    breadcrumbJsonLd([
      { name: rtl ? 'דף הבית' : 'Home', url: `${SITE_URL}/${region}` },
      {
        name: rtl ? 'השוואת מוצרים' : 'Compare products',
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
          url: p.affiliateLink || shareUrl,
          brand: p.shopName,
          price: p.price,
          currency: p.currency || config.currency,
          // evaluate_rate is 0–100; schema expects ~1–5
          ratingValue: p.rating > 0 ? p.rating / 20 : undefined,
          reviewCount: p.reviewCount || p.volume || undefined,
        })),
      })
    );

    for (const p of products) {
      structuredData.push(
        productJsonLd({
          title: p.title,
          description: p.title,
          image: p.imageUrl,
          url: p.affiliateLink || shareUrl,
          brand: p.shopName,
          price: p.price,
          currency: p.currency || config.currency,
          ratingValue: p.rating > 0 ? p.rating / 20 : undefined,
          reviewCount: p.reviewCount || undefined,
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

  const applyIds = useCallback(() => {
    const ids = parseCompareIds(idInput);
    if (ids.length === 0) {
      router.push(`/${region}/compare`);
      return;
    }
    router.push(`/${region}/compare?ids=${encodeURIComponent(ids.join(','))}`);
  }, [idInput, region, router]);

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
        noindex={emptyState}
        jsonLd={structuredData}
      />
      <Header currentRegion={region} dir={config.direction} />

      <main
        className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16"
        style={{ fontFamily: rtl ? "'Assistant', system-ui, sans-serif" : undefined }}
      >
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-2 text-xs mb-4 flex-wrap"
          style={{ color: 'var(--shopli-warm-gray)' }}
          aria-label="Breadcrumb"
        >
          <a href={`/${region}`} className="hover:underline">
            {rtl ? 'דף הבית' : 'Home'}
          </a>
          <span>/</span>
          <span style={{ color: 'var(--shopli-navy)' }}>
            {rtl ? 'השוואת מוצרים' : 'Compare products'}
          </span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="min-w-0">
            <h1
              className="text-2xl md:text-3xl font-extrabold mb-2"
              style={{ color: 'var(--shopli-navy)' }}
            >
              {rtl ? 'השוואת מוצרים' : 'Compare products'}
            </h1>
            <p
              className="text-sm md:text-base leading-relaxed max-w-2xl"
              style={{ color: 'var(--shopli-warm-gray)' }}
            >
              {rtl
                ? 'השוו עד 4 מוצרים זה לצד זה. הבדלים במפרט מודגשים — קבלו החלטת קנייה בביטחון.'
                : 'Compare up to 4 products side by side. Spec differences are highlighted so you can buy with confidence.'}
            </p>
          </div>

          {products.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={copyShareLink}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                style={{ color: 'var(--shopli-navy)' }}
              >
                <Icon name="share" size={14} />
                {copied
                  ? rtl
                    ? 'הועתק!'
                    : 'Copied!'
                  : rtl
                    ? 'העתק קישור'
                    : 'Copy link'}
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

        {/* ID input + keyword search shortcut */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5 mb-8">
          <label
            htmlFor="compare-ids"
            className="block text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: 'var(--shopli-warm-gray)' }}
          >
            {rtl
              ? `מזהי מוצר AliExpress (2–${MAX_COMPARE_PRODUCTS}, מופרדים בפסיק)`
              : `AliExpress product IDs (2–${MAX_COMPARE_PRODUCTS}, comma-separated)`}
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="compare-ids"
              type="text"
              value={idInput}
              onChange={(e) => setIdInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyIds()}
              placeholder="1005007001, 1005007002, 1005007003"
              className="flex-1 min-w-0 px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
              style={{ color: 'var(--shopli-navy)' }}
              dir="ltr"
            />
            <button
              type="button"
              onClick={applyIds}
              className="btn-primary whitespace-nowrap min-h-[44px]"
            >
              <Icon name="search" size={16} />
              {rtl ? 'השווה' : 'Compare'}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <p className="mt-2 text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
            {rtl
              ? 'טיפ: חפשו מוצר בעמוד החיפוש, לחצו «השווה» על כרטיס, והוסיפו מזהים נוספים כאן.'
              : 'Tip: search a product, hit Compare on a card, then add more IDs here.'}{' '}
            <a
              href={`/${region}/search`}
              className="font-semibold underline"
              style={{ color: 'var(--shopli-orange)' }}
            >
              {rtl ? 'לחיפוש מוצרים' : 'Search products'}
            </a>
          </p>
        </div>

        {emptyState ? (
          <div className="text-center py-12 sm:py-16 px-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
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
              {rtl ? 'אין מוצרים להשוואה עדיין' : 'No products to compare yet'}
            </h2>
            <p
              className="text-sm max-w-md mx-auto mb-6"
              style={{ color: 'var(--shopli-warm-gray)' }}
            >
              {rtl
                ? `הזינו לפחות ${MIN_COMPARE_PRODUCTS} מזהי מוצר למעלה, או נסו דוגמה:`
                : `Enter at least ${MIN_COMPARE_PRODUCTS} product IDs above, or try a sample:`}
            </p>
            <a
              href={`/${region}/compare?ids=1005007001,1005007002,1005007005`}
              className="btn-secondary text-sm"
            >
              {rtl ? 'השוואת דוגמה' : 'Load sample comparison'}
            </a>
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
                    className={`snap-start shrink-0 w-[70vw] max-w-[220px] sm:w-auto sm:max-w-none bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col ${
                      removing === p.id ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="aspect-square bg-gray-50 relative">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.title}
                          className="w-full h-full object-contain p-2"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ color: 'var(--shopli-warm-gray)' }}
                        >
                          <Icon name="package" size={36} />
                        </div>
                      )}
                      {p.discount && (
                        <span
                          className="absolute top-2 end-2 text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-white/95 shadow-sm"
                          style={{ color: 'var(--shopli-orange)' }}
                        >
                          -{p.discount}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeProduct(p.id)}
                        className="absolute top-2 start-2 w-7 h-7 rounded-full bg-white/95 shadow-sm flex items-center justify-center hover:bg-red-50 transition-colors"
                        style={{ color: 'var(--shopli-warm-gray)' }}
                        aria-label={rtl ? 'הסר מהשוואה' : 'Remove from comparison'}
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
                          href={p.affiliateLink || '#'}
                          target="_blank"
                          rel="nofollow sponsored noopener noreferrer"
                          className="btn-primary w-full text-xs py-2"
                        >
                          <Icon name="external" size={12} />
                          {rtl ? 'קנו עכשיו' : 'Buy now'}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparison table */}
            <section
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
              aria-label={rtl ? 'טבלת השוואה' : 'Comparison table'}
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th
                        className="sticky start-0 z-10 bg-gray-50 text-start text-xs font-semibold uppercase tracking-wider px-3 sm:px-4 py-3 min-w-[7rem] sm:min-w-[10rem]"
                        style={{ color: 'var(--shopli-warm-gray)' }}
                      >
                        {rtl ? 'מפרט' : 'Spec'}
                      </th>
                      {products.map((p) => (
                        <th
                          key={p.id}
                          className="bg-gray-50 text-start px-3 sm:px-4 py-3 font-semibold text-xs line-clamp-2 max-w-[10rem]"
                          style={{ color: 'var(--shopli-navy)' }}
                        >
                          <span className="line-clamp-2">
                            {p.title.length > 36
                              ? p.title.slice(0, 33) + '…'
                              : p.title}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
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
                                title={rtl ? 'יש הבדל' : 'Values differ'}
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
                              } ${isBest ? 'text-teal-700' : ''}`}
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
                className="px-4 py-3 border-t border-gray-100 text-xs flex flex-wrap items-center gap-3"
                style={{ color: 'var(--shopli-warm-gray)' }}
              >
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded bg-amber-50 border border-amber-200"
                    aria-hidden
                  />
                  {rtl ? 'שורות כתומות = הבדל בין מוצרים' : 'Amber rows = specs that differ'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="check" size={12} className="text-teal-600" />
                  {rtl ? 'סימון = הערך הטוב יותר' : 'Check = better value'}
                </span>
              </div>
            </section>

            {/* CTA row */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {products.map((p) => (
                <a
                  key={`cta-${p.id}`}
                  href={p.affiliateLink || '#'}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-orange-200 hover:shadow-sm transition-all"
                >
                  {p.imageUrl && (
                    <img
                      src={p.imageUrl}
                      alt=""
                      className="w-12 h-12 object-contain rounded-lg bg-gray-50 shrink-0"
                      loading="lazy"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-xs font-semibold line-clamp-2"
                      style={{ color: 'var(--shopli-navy)' }}
                    >
                      {p.title}
                    </p>
                    <p
                      className="text-sm font-bold mt-0.5"
                      style={{ color: 'var(--shopli-teal)' }}
                    >
                      {config.currencySymbol}
                      {p.price.toFixed(2)}
                    </p>
                  </div>
                  <span style={{ color: 'var(--shopli-orange)' }}>
                    <Icon name={rtl ? 'chevron-left' : 'chevron-right'} size={16} />
                  </span>
                </a>
              ))}
            </div>

            {/* Share again at bottom for mobile */}
            <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl bg-orange-50/60 border border-orange-100">
              <div>
                <p
                  className="text-sm font-semibold mb-0.5"
                  style={{ color: 'var(--shopli-navy)' }}
                >
                  {rtl ? 'שתפו את ההשוואה' : 'Share this comparison'}
                </p>
                <p className="text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
                  {rtl
                    ? 'הקישור שומר את המוצרים שבחרתם — מושלם לחברים או לעצמכם.'
                    : 'The link keeps your selected products — perfect for friends or later.'}
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
                    ? rtl
                      ? 'הועתק!'
                      : 'Copied!'
                    : rtl
                      ? 'העתק URL'
                      : 'Copy URL'}
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
          </>
        )}
      </main>

      <footer className="border-t border-gray-100 py-6">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs"
          style={{ color: 'var(--shopli-warm-gray)' }}
        >
          <div className="font-semibold" style={{ color: 'var(--shopli-navy)' }}>
            shopli
          </div>
          <div>
            &copy; {new Date().getFullYear()}{' '}
            {rtl ? 'כל הזכויות שמורות' : 'All rights reserved.'}
          </div>
        </div>
      </footer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, query }) => {
  const region = ((params?.region as string) || 'eu') as RegionCode;
  const config = getRegion(region);
  const rtl = config.direction === 'rtl';
  const productIds = parseCompareIds(query.ids as string | undefined);

  let products: SearchProduct[] = [];
  let error: string | null = null;

  if (productIds.length > 0) {
    try {
      const { getProductsByIds } = await import('../../../lib/aliexpress');
      products = await getProductsByIds(productIds, region);

      // Demo/fallback when API has no keys or returns empty
      if (products.length === 0) {
        const samples = getDemoProducts(region, config.currency);
        products = productIds
          .map((id) => samples.find((p) => p.id === id))
          .filter(Boolean) as SearchProduct[];

        if (products.length === 0 && samples.length >= 2) {
          // Map requested IDs onto demo catalog by order for sample links
          products = productIds
            .map((id, i) => {
              const base = samples[i % samples.length];
              return base ? { ...base, id } : null;
            })
            .filter(Boolean) as SearchProduct[];
        }
      }

      if (products.length < MIN_COMPARE_PRODUCTS && productIds.length >= MIN_COMPARE_PRODUCTS) {
        error =
          config.lang === 'he'
            ? 'לא נמצאו מספיק מוצרים. בדקו את מזהי המוצר ונסו שוב.'
            : 'Could not load enough products. Check the IDs and try again.';
      }
    } catch (e: any) {
      error = e?.message || 'Failed to load products';
      const samples = getDemoProducts(region, config.currency);
      products = productIds
        .map((id, i) => {
          const base = samples[i % samples.length];
          return base ? { ...base, id } : null;
        })
        .filter(Boolean) as SearchProduct[];
    }
  }

  const rows = buildCompareRows(products, config.currencySymbol);
  const shareUrl = buildCompareShareUrl(SITE_URL, region, products.map((p) => p.id));

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

/** Offline demo catalog aligned with api.ts fallback product IDs */
function getDemoProducts(region: string, currency: string): SearchProduct[] {
  const isHe = region === 'il';
  return [
    {
      id: '1005007001',
      sku: '',
      title: isHe ? 'מטען אלחוטי מהיר 15W' : '15W Fast Wireless Charger',
      price: region === 'il' ? 39.9 : 9.9,
      originalPrice: region === 'il' ? 59.9 : 14.9,
      currency,
      imageUrl: '',
      images: [],
      affiliateLink: `https://www.aliexpress.com/item/1005007001.html`,
      rating: 94,
      reviewCount: 2341,
      volume: 15000,
      category: isHe ? 'גאדג\'טים' : 'Gadgets',
      categoryPath: isHe ? 'אלקטרוניקה > מטענים' : 'Electronics > Chargers',
      shopName: 'TechHome Store',
      shopId: '1',
      discount: '33%',
      commissionRate: 8,
      freeShipping: true,
    },
    {
      id: '1005007002',
      sku: '',
      title: isHe ? 'אוזניות BT Sport Pro' : 'Sport Bluetooth Earbuds Pro',
      price: region === 'il' ? 69.9 : 18.9,
      originalPrice: region === 'il' ? 99.9 : 29.9,
      currency,
      imageUrl: '',
      images: [],
      affiliateLink: `https://www.aliexpress.com/item/1005007002.html`,
      rating: 92,
      reviewCount: 5872,
      volume: 34000,
      category: isHe ? 'אלקטרוניקה' : 'Electronics',
      categoryPath: isHe ? 'אלקטרוניקה > אודיו' : 'Electronics > Audio',
      shopName: 'AudioMax',
      shopId: '2',
      discount: '30%',
      commissionRate: 8,
      freeShipping: true,
    },
    {
      id: '1005007003',
      sku: '',
      title: isHe ? 'ערכת מברגים מדויקת 48in1' : 'Precision Screwdriver Set 48in1',
      price: region === 'il' ? 45 : 11.5,
      originalPrice: region === 'il' ? 65 : 16.9,
      currency,
      imageUrl: '',
      images: [],
      affiliateLink: `https://www.aliexpress.com/item/1005007003.html`,
      rating: 98,
      reviewCount: 3204,
      volume: 8900,
      category: isHe ? 'כלים' : 'Tools',
      categoryPath: isHe ? 'בית > כלי עבודה' : 'Home > Tools',
      shopName: 'ProTools',
      shopId: '3',
      discount: '31%',
      commissionRate: 6,
      freeShipping: false,
    },
    {
      id: '1005007005',
      sku: '',
      title: isHe ? 'שעון חכם ספורט IP68' : 'IP68 Smart Sports Watch',
      price: region === 'il' ? 89.9 : 22.9,
      originalPrice: region === 'il' ? 149.9 : 39.9,
      currency,
      imageUrl: '',
      images: [],
      affiliateLink: `https://www.aliexpress.com/item/1005007005.html`,
      rating: 88,
      reviewCount: 8901,
      volume: 42000,
      category: isHe ? 'ספורט' : 'Sports',
      categoryPath: isHe ? 'ספורט > לביש' : 'Sports > Wearables',
      shopName: 'FitGear',
      shopId: '5',
      discount: '40%',
      commissionRate: 10,
      freeShipping: true,
    },
  ];
}
