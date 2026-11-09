import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Header from '../../../components/Header';
import SeoHead from '../../../components/SeoHead';
import Icon from '../../../components/icons';
import ShareBar from '../../../components/ShareBar';
import FindSimilar from '../../../components/FindSimilar';
import BuyerReviews from '../../../components/BuyerReviews';
import LandedCostBadge from '../../../components/LandedCostBadge';
import VerdictCard from '../../../components/VerdictCard';
import { computeVerdict, sparklineSegments, type Verdict } from '../../../lib/verdict';
import { getPriceHistory } from '../../../lib/trend-velocity';
import { cacheIfNotEmpty } from '../../../lib/cache';
import { trendingEnabled } from '../../../lib/flags';
import { productImage } from '../../../lib/img';
import { getRegion, RegionCode, RegionConfig } from '../../../lib/regions';
import { getProductsByIds, ensureAffiliateTracking, isPromotionLink, SearchProduct } from '../../../lib/aliexpress';
import { getFeedProduct } from '../../../lib/feed-store';
import { getDemoProductById } from '../../../lib/demo-products';
import { getProductReviews } from '../../../lib/review-store';
import type { ProductReviews } from '../../../lib/reviews';
import {
  buildPdpAbout,
  buildPdpDescription,
  buildPdpSpecs,
  buildPdpProsCons,
  buildPdpFaq,
  relatedCollections,
  resolvePdpProduct,
  pdpGsspWhenMissing,
  SpecRow,
  FaqItem,
} from '../../../lib/pdp';
import { breadcrumbJsonLd, productJsonLd, getProductOgImage, SITE_URL, productPageTitle } from '../../../lib/seo';
import type { CollectionDef } from '../../../lib/collections';

interface ProductPageProps {
  region: RegionCode;
  config: RegionConfig;
  product: SearchProduct | null;
  productId: string;
  rtl: boolean;
  description: string;
  specs: SpecRow[];
  pros: string[];
  cons: string[];
  faq: FaqItem[];
  related: Array<{ slug: string; name: string }>;
  similarEnabled: boolean;
  reviews: ProductReviews | null;
  verdict: Verdict;
  sparkline: { solid: string[]; gaps: string[] };
}

function ratingStars(rating: number): number {
  if (!rating || rating <= 0) return 0;
  return Math.max(1, Math.min(5, Math.round(rating / 20)));
}

function ratingDisplay(rating: number): string {
  if (!rating || rating <= 0) return '';
  return (rating / 20).toFixed(1);
}

export default function ProductPage({
  region,
  config,
  product,
  productId,
  rtl,
  description,
  specs,
  pros,
  cons,
  faq,
  related,
  similarEnabled,
  reviews,
  verdict,
  sparkline,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const lang = config.lang || 'en';
  const pageUrl = `${SITE_URL}/${region}/product/${productId}`;

  if (!product) {
    return (
      <>
        <SeoHead
          region={region}
          path={`/product/${productId}`}
          title={rtl ? 'מוצר לא נמצא | Shopli' : 'Product not found | Shopli'}
          description={rtl ? 'לא הצלחנו למצוא את המוצר המבוקש.' : 'We could not find the requested product.'}
          noindex
        />
        <Header currentRegion={region} dir={config.direction} />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16 text-center">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
            style={{ background: 'oklch(90% 0.06 45)', color: 'var(--shopli-orange)' }}
          >
            <Icon name="package" size={32} />
          </div>
          <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--shopli-navy)' }}>
            {rtl ? 'מוצר לא נמצא' : 'Product not found'}
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--shopli-warm-gray)' }}>
            {rtl ? 'המוצר שחיפשת אינו קיים או שאינו זמין כרגע.' : 'The product you are looking for does not exist or is currently unavailable.'}
          </p>
          <a href={`/${region}`} className="btn-primary text-sm">
            {rtl ? 'חזרה לדף הבית' : 'Back to home'}
          </a>
        </main>
      </>
    );
  }

  const title = productPageTitle(product.title);
  // og:image: branded card with product image + title + price.
  // Always uses the dynamic card for consistent branding on shares.
  const ogImage = getProductOgImage({
    title: product.title,
    price: product.price,
    currencySymbol: config.currencySymbol,
    originalPrice:
      product.originalPrice != null && product.originalPrice > product.price
        ? product.originalPrice
        : undefined,
    discount: product.discount,
    image: product.imageUrl || undefined,
    lang,
  });
  const stars = ratingStars(product.rating);
  const about = buildPdpAbout(product, rtl);
  const originalPrice = product.originalPrice != null && product.originalPrice > product.price ? product.originalPrice : null;

  // Still no aggregateRating, deliberately, now that the page HAS reviews: they
  // are AliExpress buyers' reviews republished with attribution, and marking up
  // third-party review content as this site's own is a manual-action pattern
  // (docs/PDP-V1-SPEC.md). Displayed, not claimed.
  const structuredData = [
    breadcrumbJsonLd([
      { name: rtl ? 'דף הבית' : 'Home', url: `${SITE_URL}/${region}` },
      { name: product.title, url: pageUrl },
    ]),
    productJsonLd({
      title: product.title,
      description: about,
      image: product.imageUrl,
      url: pageUrl,
      brand: product.shopName,
      price: product.price,
      currency: product.currency || config.currency,
      availability: 'https://schema.org/InStock',
      sku: product.sku || product.id,
      region,
    }),
  ];

  return (
    <>
      <SeoHead
        region={region}
        path={`/product/${productId}`}
        title={title}
        description={description}
        image={ogImage}
        ogType="product"
        canonical={pageUrl}
        jsonLd={structuredData}
      />
      <Header currentRegion={region} dir={config.direction} />

      <main
        className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-32 md:pb-16"
        style={{ fontFamily: rtl ? "var(--font-assistant), system-ui, sans-serif" : undefined }}
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
          <span className="line-clamp-1" style={{ color: 'var(--shopli-navy)' }}>
            {product.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 fade-in">
          {/* Image */}
          <div className="bg-white rounded-xl border border-[#141414]  overflow-hidden">
            <div className="aspect-square bg-[#FFF4E4] flex items-center justify-center relative">
              {product.imageUrl ? (
                <img
                  {...productImage(product.imageUrl, 800, '(max-width: 768px) 100vw, 640px')}
                  alt={product.title}
                  className="w-full h-full object-contain p-4 sm:p-8"
                  loading="eager"
                  // lowercase — React 18 drops the camelCase prop, see TrendingRail.
                  fetchpriority="high"
                />
              ) : (
                <div style={{ color: 'var(--shopli-warm-gray)' }}>
                  <Icon name="package" size={64} />
                </div>
              )}
              {product.discount && (
                <span
                  className="absolute top-3 end-3 text-xs font-bold px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm "
                  style={{ color: 'var(--shopli-orange)' }}
                >
                  -{product.discount}
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <h1
              className="text-2xl sm:text-3xl font-extrabold leading-tight mb-3"
              style={{ color: 'var(--shopli-navy)' }}
              title={product.originalTitle || undefined}
            >
              {product.title}
            </h1>

            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {stars > 0 && (
                <div className="flex items-center gap-1">
                  <Icon name="star" size={16} className="text-yellow-500" />
                  <span className="text-sm font-semibold" style={{ color: 'var(--shopli-navy)' }}>
                    {ratingDisplay(product.rating)}
                  </span>
                </div>
              )}
              {/*
                Was product.reviewCount, which reads last_5_days_trade_count —
                a field the affiliate API does not return, so this said "0" on
                every product and rendered nothing at all. The count now comes
                from the buyer reviews themselves.
              */}
              {reviews && reviews.ratingCount > 0 && (
                <a href="#buyer-reviews" className="text-xs hover:underline" style={{ color: 'var(--shopli-warm-gray)' }}>
                  ({reviews.ratingCount.toLocaleString(lang === 'he' ? 'he-IL' : 'en-US')}{' '}
                  {rtl ? 'דירוגים מקונים' : 'buyer ratings'})
                </a>
              )}
              {product.shopName && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFF4E4]" style={{ color: 'var(--shopli-warm-gray)' }}>
                  {rtl ? 'מוכר: ' : 'Seller: '}{product.shopName}
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-2 mb-5 flex-wrap">
              <span
                className="text-3xl sm:text-4xl font-extrabold tabular-nums"
                style={{ color: 'var(--shopli-teal)' }}
                dir="ltr"
              >
                {config.currencySymbol}
                {product.price.toFixed(2)}
              </span>
              {originalPrice != null && (
                <span
                  className="text-base sm:text-lg line-through tabular-nums"
                  style={{ color: 'var(--shopli-warm-gray)' }}
                  dir="ltr"
                >
                  {config.currencySymbol}
                  {originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* IL landed-cost breakdown: duty-free under $75 vs +18% VAT */}
            {region === 'il' && (
              <LandedCostBadge
                variant="full"
                price={product.price}
                currency={product.currency || config.currency}
                freeShipping={product.freeShipping}
              />
            )}

            <VerdictCard
              verdict={verdict}
              spark={sparkline}
              rating={product.rating}
              ratingCount={reviews && reviews.ratingCount > 0 ? reviews.ratingCount : null}
              currencySymbol={config.currencySymbol}
              rtl={rtl}
            />

            <p className="text-sm sm:text-base leading-relaxed mb-6" style={{ color: 'var(--shopli-warm-gray)' }}>
              {about}
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              {product.freeShipping && (
                <span className="badge-shipping inline-flex items-center gap-1">
                  <Icon name="truck" size={12} />
                  {rtl ? 'משלוח חינם' : 'Free shipping'}
                </span>
              )}
              {product.category && (
                <span
                  className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[#FFF4E4]"
                  style={{ color: 'var(--shopli-warm-gray)' }}
                >
                  <Icon name="tag" size={10} />
                  {product.category}
                </span>
              )}
            </div>

            <div className="mt-auto flex flex-col sm:flex-row gap-3">
              <a
                href={product.affiliateLink}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="btn-primary text-center text-base"
                data-product-id={product.id}
                data-product-title={product.title}
                data-price={product.price.toFixed(2)}
                data-currency={config.currencySymbol}
                data-category={product.category || ''}
                data-region={region}
              >
                <Icon name="external" size={16} />
                {rtl ? 'קנו עכשיו באליאקספרס' : 'Buy now on AliExpress'}
              </a>
              <ShareBar
                title={product.title}
                url={pageUrl}
                pageType="product"
                region={region}
                locale={lang}
                rtl={rtl}
                size="md"
              />
            </div>

            {similarEnabled && (
              <div className="mt-3">
                <FindSimilar
                  region={region}
                  rtl={rtl}
                  currencySymbol={config.currencySymbol}
                  source={{
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    currency: product.currency,
                    category: product.category || 'general',
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* What buyers say — real reviews, clearly attributed to AliExpress */}
        {reviews && (
          <div id="buyer-reviews" className="scroll-mt-24">
            <BuyerReviews reviews={reviews} rtl={rtl} lang={lang} />
          </div>
        )}

        {/* Specs */}
        <section className="mt-10 fade-in" aria-label={rtl ? 'מפרט' : 'Specifications'}>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--shopli-navy)' }}>
            {rtl ? 'מפרט' : 'Specifications'}
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 bg-white rounded-xl border border-[#141414]  p-4 sm:p-6">
            {specs.map((row) => (
              <div key={row.label} className="flex items-baseline justify-between gap-4 text-sm border-b border-gray-50 pb-2">
                <dt style={{ color: 'var(--shopli-warm-gray)' }}>{row.label}</dt>
                <dd className="font-medium text-end" style={{ color: 'var(--shopli-navy)' }}>
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Pros / Cons */}
        <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 fade-in">
          <div className="bg-white rounded-xl border border-[#141414]  p-4 sm:p-6">
            <h2 className="text-base font-bold mb-3" style={{ color: 'var(--shopli-teal)' }}>
              {rtl ? 'יתרונות' : 'Pros'}
            </h2>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--shopli-navy)' }}>
              {pros.map((pro) => (
                <li key={pro} className="flex items-start gap-2">
                  <span style={{ color: 'var(--shopli-teal)' }}>✓</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-xl border border-[#141414]  p-4 sm:p-6">
            <h2 className="text-base font-bold mb-3" style={{ color: 'var(--shopli-orange)' }}>
              {rtl ? 'חסרונות' : 'Cons'}
            </h2>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--shopli-navy)' }}>
              {cons.map((con) => (
                <li key={con} className="flex items-start gap-2">
                  <span style={{ color: 'var(--shopli-orange)' }}>✗</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-8 fade-in" aria-label="FAQ">
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--shopli-navy)' }}>
            {rtl ? 'שאלות נפוצות' : 'Frequently asked questions'}
          </h2>
          <div className="space-y-3">
            {faq.map((item) => (
              <details
                key={item.q}
                className="bg-white rounded-xl border border-[#141414]  p-4"
              >
                <summary className="text-sm font-semibold cursor-pointer" style={{ color: 'var(--shopli-navy)' }}>
                  {item.q}
                </summary>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--shopli-warm-gray)' }}>
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Related collections */}
        {related.length > 0 && (
          <section className="mt-8 fade-in" aria-label={rtl ? 'קולקציות קשורות' : 'Related collections'}>
            <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--shopli-navy)' }}>
              {rtl ? 'קולקציות שאולי יעניינו אותך' : 'Related collections'}
            </h2>
            <div className="flex flex-wrap gap-2">
              {related.map((c) => (
                <a
                  key={c.slug}
                  href={`/${region}/collection/${c.slug}`}
                  className="text-sm px-3 py-1.5 rounded-full bg-white border border-[#141414]  hover:shadow transition-shadow"
                  style={{ color: 'var(--shopli-navy)' }}
                >
                  {c.name}
                </a>
              ))}
            </div>
          </section>
        )}
        {/* Phone: the buy button stays in reach while reading the verdict and reviews. */}
        {/* Keep the footer's last lines clear of the fixed bar on phones. */}
        <style>{'@media (max-width: 767px) { footer { padding-bottom: 96px; } }'}</style>
        <div
          className="md:hidden fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 px-4 pt-3"
          style={{
            background: '#FFF4E4',
            borderTop: '2.5px solid #141414',
            paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
          }}
        >
          <div className="flex flex-col leading-tight">
            <span className="font-extrabold text-lg tabular-nums" dir="ltr" style={{ color: '#141414' }}>
              {config.currencySymbol}
              {product.price.toFixed(2)}
            </span>
            <span className="text-xs" style={{ color: '#5C554C' }}>
              {rtl ? 'באליאקספרס עכשיו' : 'on AliExpress now'}
            </span>
          </div>
          <a
            href={product.affiliateLink}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="flex-1 text-center font-bold rounded-xl py-3"
            style={{ background: 'var(--shopli-orange)', border: '2.5px solid #141414', boxShadow: '3px 3px 0 #141414', color: '#141414' }}
            data-product-id={product.id}
            data-product-title={product.title}
            data-price={product.price.toFixed(2)}
            data-currency={config.currencySymbol}
            data-category={product.category || ''}
            data-region={region}
          >
            {rtl ? 'לקנייה באליאקספרס' : 'Get it on AliExpress'}
          </a>
        </div>
      </main>

    </>
  );
}

/**
 * The daily sweep's copy of a product, shaped like a live one. Used only when
 * the live by-id call comes back empty, so a flaky API call no longer turns a
 * product we featured yesterday into a dead end.
 */
async function storedProduct(id: string, region: string): Promise<SearchProduct | null> {
  const row = await getFeedProduct(id, region);
  if (!row || !(row.price > 0)) return null;
  return {
    id: row.id,
    sku: '',
    title: row.title,
    price: row.price,
    originalPrice: null,
    currency: row.currency,
    imageUrl: row.imageUrl,
    images: row.imageUrl ? [row.imageUrl] : [],
    affiliateLink: ensureAffiliateTracking('', row.id),
    rating: row.rating,
    reviewCount: 0,
    volume: row.volume || 0,
    category: row.productType || '',
    categoryPath: row.productType || '',
    shopName: row.brand || '',
    shopId: '',
    discount: '',
    commissionRate: 0,
    freeShipping: false,
  };
}

export const getServerSideProps: GetServerSideProps<ProductPageProps> = async (context) => {
  const region = ((context.params?.region as string) || 'eu') as RegionCode;
  const config = getRegion(region);
  const rtl = config.direction === 'rtl';
  const productId = String(context.params?.id || '');

  if (!productId) {
    return { notFound: true };
  }

  // Dual-source: AliExpress → demo catalog. Both miss → hard 404 (not soft-404 props).
  const product = await resolvePdpProduct(productId, region, config.currency, {
    getProductsByIds,
    getStoredProduct: storedProduct,
    getDemoProductById,
    // Past this, a tap on a product card shows our stored copy instead of
    // hanging on a slow AliExpress answer.
    liveBudgetMs: 3000,
  });
  if (!product) {
    return pdpGsspWhenMissing();
  }

  // Cache at the edge (10m, SWR 1h) so repeat views don't re-hit the AliExpress
  // API — but only once we actually have a product. This header used to be set
  // before the fetch, so a rate-limited call pinned "Product not found" over a
  // live product for ten minutes.
  // A stored or demo copy carries no tracked buy link, so keep it at the edge
  // only briefly and let the next view pick up the live, tracked product.
  cacheIfNotEmpty(
    context.res,
    !!product,
    isPromotionLink(product.affiliateLink)
      ? 'public, s-maxage=600, stale-while-revalidate=3600'
      : 'public, s-maxage=60, stale-while-revalidate=60'
  );

  const lang = config.lang || 'en';
  const collName = (c: CollectionDef) =>
    c.name?.[lang] || c.name?.en || c.tag?.[lang] || c.tag?.en || c.slug;

  // Buyer reviews, from the read-through store (lib/review-store.ts): a cached
  // row costs one cheap query, and only a product nobody has opened in a week
  // pays a live fetch. Bounded tightly and null on any failure — this section
  // enriches the page, it must never be why the page is slow or blank.
  const [reviews, history] = await Promise.all([
    getProductReviews(productId, region, { timeoutMs: 2500 }),
    // Time-boxed: a cold database must not hold the page; no history just
    // means "new to our tracking".
    Promise.race([
      getPriceHistory(productId, region),
      new Promise<Awaited<ReturnType<typeof getPriceHistory>>>((resolve) => setTimeout(() => resolve([]), 1500)),
    ]),
  ]);
  const verdict = computeVerdict({ priceNow: product.price, rating: product.rating, history });

  const description = product ? buildPdpDescription(product, rtl) : '';
  const { pros, cons } = product
    ? buildPdpProsCons(product, rtl)
    : { pros: [] as string[], cons: [] as string[] };

  return {
    props: {
      region,
      config,
      product,
      productId,
      rtl,
      description,
      specs: buildPdpSpecs(product, rtl),
      pros,
      cons,
      faq: product ? buildPdpFaq(product, rtl) : [],
      related: product
        ? relatedCollections(product).map((c) => ({ slug: c.slug, name: collName(c) }))
        : [],
      similarEnabled: trendingEnabled(),
      reviews,
      verdict,
      sparkline: verdict.kind === 'new' ? { solid: [], gaps: [] } : sparklineSegments(history, product.price, 320, 72),
    },
  };
};
