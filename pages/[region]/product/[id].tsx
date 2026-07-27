import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import type { IncomingMessage } from 'http';
import Header from '../../../components/Header';
import SeoHead from '../../../components/SeoHead';
import Icon from '../../../components/icons';
import WhatsAppShare from '../../../components/WhatsAppShare';
import Reviews from '../../../components/Reviews';
import { getRegion, RegionCode, RegionConfig } from '../../../lib/regions';
import { getProductsByIds, SearchProduct } from '../../../lib/aliexpress';
import { addReview, getReviewsByProductId, ReviewsSummary } from '../../../lib/reviews';
import { breadcrumbJsonLd, productJsonLd, SITE_URL } from '../../../lib/seo';

interface ProductPageProps {
  region: RegionCode;
  config: RegionConfig;
  product: SearchProduct | null;
  productId: string;
  reviews: ReviewsSummary;
  rtl: boolean;
  thanks?: boolean;
  error?: string;
}

function parseUrlEncodedBody(req: IncomingMessage): Promise<Record<string, string>> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const params = new URLSearchParams(body);
        const result: Record<string, string> = {};
        params.forEach((value, key) => {
          result[key] = value;
        });
        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function getDemoProductById(id: string, region: string, currency: string): SearchProduct | null {
  const isHe = region === 'il';
  const catalog: Record<string, SearchProduct> = {
    '1005007001': {
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
    '1005007002': {
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
    '1005007003': {
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
    '1005007005': {
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
  };
  return catalog[id] || null;
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
  reviews,
  rtl,
  thanks,
  error,
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
  const description = product.title;
  const stars = ratingStars(product.rating);
  const originalPrice = product.originalPrice != null && product.originalPrice > product.price ? product.originalPrice : null;

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
      ratingValue: reviews.count > 0 ? reviews.average : undefined,
      reviewCount: reviews.count > 0 ? reviews.count : undefined,
    }),
  ];

  return (
    <>
      <SeoHead
        region={region}
        path={`/product/${productId}`}
        title={title}
        description={description}
        image={product.imageUrl}
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

        {thanks && (
          <div className="mb-6 p-3 rounded-lg bg-green-50 border border-green-100 text-sm text-green-800 fade-in">
            {rtl ? 'תודה! הביקורת שלך נשלחה לאישור.' : 'Thanks! Your review has been submitted.'}
          </div>
        )}
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-800 fade-in">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          {/* Image */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="aspect-square bg-gray-50 flex items-center justify-center relative">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-contain p-4 sm:p-8"
                  loading="eager"
                  decoding="async"
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
          </div>
        </div>

        <Reviews productId={productId} summary={reviews} rtl={rtl} />
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

  // Handle review submissions server-side to avoid relying on API route rewrites.
  if (context.req.method === 'POST') {
    try {
      const body = await parseUrlEncodedBody(context.req);
      if (body.productId === productId) {
        await addReview(productId, {
          name: body.name,
          rating: Number(body.rating),
          text: body.text,
        });
        return {
          redirect: {
            destination: `/${region}/product/${encodeURIComponent(productId)}?thanks=1#reviews`,
            permanent: false,
          },
        };
      }
    } catch (e: any) {
      return {
        redirect: {
          destination: `/${region}/product/${encodeURIComponent(productId)}?error=${encodeURIComponent(e?.message || 'Failed to submit review')}#reviews`,
          permanent: false,
        },
      };
    }
  }

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

  const reviews = await getReviewsByProductId(productId);

  return {
    props: {
      region,
      config,
      product,
      productId,
      reviews,
      rtl,
      thanks: context.query.thanks === '1',
      error: context.query.error ? String(context.query.error) : undefined,
    },
  };
};
