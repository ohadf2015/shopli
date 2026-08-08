import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Header from '../../../components/Header';
import SeoHead from '../../../components/SeoHead';
import Icon from '../../../components/icons';
import WhatsAppShare from '../../../components/WhatsAppShare';
import FindSimilar from '../../../components/FindSimilar';
import { trendingEnabled } from '../../../lib/flags';
import { productImage } from '../../../lib/img';
import { getRegion, RegionCode, RegionConfig } from '../../../lib/regions';
import { getProductsByIds, SearchProduct } from '../../../lib/aliexpress';
import { getDemoProductById } from '../../../lib/demo-products';
import {
  buildPdpDescription,
  buildPdpSpecs,
  buildPdpProsCons,
  buildPdpFaq,
  relatedCollections,
  SpecRow,
  FaqItem,
} from '../../../lib/pdp';
import { breadcrumbJsonLd, productJsonLd, getProductOgImage, SITE_URL } from '../../../lib/seo';
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

  const title = `${product.title} | Shopli`;
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
  const originalPrice = product.originalPrice != null && product.originalPrice > product.price ? product.originalPrice : null;

  // v1: no aggregateRating — Shopli has no on-site reviews yet (docs/PDP-V1-SPEC.md).
  const structuredData = [
    breadcrumbJsonLd([
      { name: rtl ? 'דף הבית' : 'Home', url: `${SITE_URL}/${region}` },
      { name: product.title, url: pageUrl },
    ]),
    productJsonLd({
      title: product.title,
      description,
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
          <span className="line-clamp-1" style={{ color: 'var(--shopli-navy)' }}>
            {product.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 fade-in">
          {/* Image */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="aspect-square bg-gray-50 flex items-center justify-center relative">
              {product.imageUrl ? (
                <img
                  {...productImage(product.imageUrl, 800, '(max-width: 768px) 100vw, 640px')}
                  alt={product.title}
                  className="w-full h-full object-contain p-4 sm:p-8"
                  loading="eager"
                  fetchPriority="high"
                />
              ) : (
                <div style={{ color: 'var(--shopli-warm-gray)' }}>
                  <Icon name="package" size={64} />
                </div>
              )}
              {product.discount && (
                <span
                  className="absolute top-3 end-3 text-xs font-bold px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm shadow-sm"
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
              {(product.reviewCount || 0) > 0 && (
                <span className="text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
                  ({product.reviewCount?.toLocaleString()} AliExpress {rtl ? 'ביקורות' : 'reviews'})
                </span>
              )}
              {product.shopName && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100" style={{ color: 'var(--shopli-warm-gray)' }}>
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

            <p className="text-sm sm:text-base leading-relaxed mb-6" style={{ color: 'var(--shopli-warm-gray)' }}>
              {description}
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
                  className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gray-100"
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
              >
                <Icon name="external" size={16} />
                {rtl ? 'קנו עכשיו באליאקספרס' : 'Buy now on AliExpress'}
              </a>
              <WhatsAppShare
                title={product.title}
                url={pageUrl}
                locale={lang}
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

        {/* Specs */}
        <section className="mt-10 fade-in" aria-label={rtl ? 'מפרט' : 'Specifications'}>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--shopli-navy)' }}>
            {rtl ? 'מפרט' : 'Specifications'}
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-6">
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
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-6">
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
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-6">
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
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4"
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
                  className="text-sm px-3 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm hover:shadow transition-shadow"
                  style={{ color: 'var(--shopli-navy)' }}
                >
                  {c.name}
                </a>
              ))}
            </div>
          </section>
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

export const getServerSideProps: GetServerSideProps<ProductPageProps> = async (context) => {
  const region = ((context.params?.region as string) || 'eu') as RegionCode;
  const config = getRegion(region);
  const rtl = config.direction === 'rtl';
  const productId = String(context.params?.id || '');

  if (!productId) {
    return { notFound: true };
  }

  // PDPs were served with the GSSP default no-store — cache at the edge (10m, SWR 1h)
  // so repeat views don't re-hit the AliExpress API. Prices can lag by up to ~10m, acceptable.
  context.res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=3600');

  let product: SearchProduct | null = null;

  try {
    const products = await getProductsByIds([productId], region);
    product = products[0] || null;
  } catch {
    product = null;
  }

  if (!product) {
    product = getDemoProductById(productId, region, config.currency);
  }

  const lang = config.lang || 'en';
  const collName = (c: CollectionDef) =>
    c.name?.[lang] || c.name?.en || c.tag?.[lang] || c.tag?.en || c.slug;

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
      specs: product ? buildPdpSpecs(product, rtl) : [],
      pros,
      cons,
      faq: product ? buildPdpFaq(product, rtl) : [],
      related: product
        ? relatedCollections(product).map((c) => ({ slug: c.slug, name: collName(c) }))
        : [],
      similarEnabled: trendingEnabled(),
    },
  };
};
