import { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Header from '../../../components/Header';
import Icon from '../../../components/icons';
import Recommendations from '../../../components/Recommendations';
import RecentlyViewed from '../../../components/RecentlyViewed';
import { getRegion, RegionCode } from '../../../lib/regions';
import type { RegionConfig } from '../../../lib/regions';
import type { Product } from '../../../lib/types';
import { useRecentlyViewed } from '../../../hooks/useRecentlyViewed';

interface ProductPageProps {
  region: RegionCode;
  config: RegionConfig;
  rtl: boolean;
  lang: string;
  product: Product | null;
  error?: string;
}

export default function ProductPage({ region, config, rtl, lang, product, error }: ProductPageProps) {
  const { addToRecentlyViewed } = useRecentlyViewed();

  // Track this product as recently viewed
  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
    }
  }, [product?.productId]);

  if (error || !product) {
    return (
      <div className="p-20 text-center" style={{ color: 'var(--shopli-warm-gray)' }}>
        <Icon name="package" size={48} />
        <p className="mt-4 text-lg font-semibold" style={{ color: 'var(--shopli-navy)' }}>
          {rtl ? 'מוצר לא נמצא' : 'Product not found'}
        </p>
        <p className="mt-2 text-sm">{error || (rtl ? 'המוצר שחיפשת לא קיים' : 'The product you are looking for does not exist.')}</p>
        <a href={`/${region}`} className="btn-primary mt-6 inline-flex">
          {rtl ? 'חזרה לדף הבית' : 'Back to Home'}
        </a>
      </div>
    );
  }

  const productUrl = `https://shopli-neon.vercel.app/${region}/product/${product.productId}`;
  const stars = Math.round(product.rating / 20);

  return (
    <>
      <Head>
        <title>{product.title} | Shopli</title>
        <meta name="description" content={product.description || `${product.title} — ${config.currencySymbol}${product.price.toFixed(2)}`} />
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={product.description || `${product.title} at ${config.currencySymbol}${product.price.toFixed(2)}`} />
        {product.imageUrl && <meta property="og:image" content={product.imageUrl} />}
        <meta property="og:type" content="product" />
        <meta property="og:url" content={productUrl} />
        <link rel="canonical" href={productUrl} />
      </Head>
      <Header currentRegion={region} dir={config.direction} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16" style={{ fontFamily: rtl ? "'Assistant', system-ui, sans-serif" : undefined }}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs mb-6" style={{ color: 'var(--shopli-warm-gray)' }}>
          <a href={`/${region}`} className="hover:underline">{rtl ? 'דף הבית' : 'Home'}</a>
          <span>/</span>
          {product.category && (
            <>
              <a href={`/${region}/collection/${product.category}`} className="hover:underline">
                {product.category}
              </a>
              <span>/</span>
            </>
          )}
          <span className="truncate max-w-[200px]" style={{ color: 'var(--shopli-navy)' }}>{product.title}</span>
        </div>

        {/* Product Detail */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Image */}
          <div className="bg-gray-100 rounded-2xl overflow-hidden relative aspect-square">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--shopli-warm-gray)' }}>
                <Icon name="package" size={64} />
              </div>
            )}
            {product.discount && (
              <span className="absolute top-4 right-4 text-sm font-bold px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm"
                style={{ color: 'var(--shopli-orange)' }}>
                -{product.discount}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-extrabold leading-tight mb-3" style={{ color: 'var(--shopli-navy)' }}>
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold" style={{ color: 'var(--shopli-teal)' }}>
                {config.currencySymbol}{product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg line-through" style={{ color: 'var(--shopli-warm-gray)' }}>
                  {config.currencySymbol}{product.originalPrice.toFixed(2)}
                </span>
              )}
              {product.discount && (
                <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ background: 'oklch(90% 0.06 45)', color: 'var(--shopli-orange)' }}>
                  {rtl ? 'חיסכון של' : 'Save'} {product.discount}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex" style={{ color: 'oklch(70% 0.15 70)' }}>
                {'★'.repeat(Math.max(0, stars))}{'☆'.repeat(Math.max(0, 5 - stars))}
              </div>
              <span className="text-sm font-medium" style={{ color: 'var(--shopli-navy)' }}>
                {product.rating}%
              </span>
              {product.reviewCount > 0 && (
                <span className="text-sm" style={{ color: 'var(--shopli-warm-gray)' }}>
                  ({product.reviewCount > 999 ? `${(product.reviewCount / 1000).toFixed(1)}k` : product.reviewCount} {rtl ? 'ביקורות' : 'reviews'})
                </span>
              )}
            </div>

            {/* Volume / Sold */}
            {product.volume > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <Icon name="fire" size={16} className="text-red-500" />
                <span className="text-sm font-medium" style={{ color: 'var(--shopli-warm-gray)' }}>
                  {product.volume > 999 ? `${(product.volume / 1000).toFixed(1)}k` : product.volume} {rtl ? 'נמכרו' : 'sold'}
                </span>
              </div>
            )}

            {/* Shop */}
            {product.shopName && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-semibold" style={{ color: 'var(--shopli-warm-gray)' }}>
                  {rtl ? 'חנות' : 'Shop'}: {product.shopName}
                </span>
              </div>
            )}

            {/* Free Shipping */}
            {product.freeShipping && (
              <div className="flex items-center gap-2 mb-4">
                <Icon name="truck" size={16} />
                <span className="text-sm font-medium" style={{ color: 'var(--shopli-teal)' }}>
                  {rtl ? 'משלוח חינם' : 'Free Shipping'}
                </span>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--shopli-warm-gray)' }}>
                {product.description}
              </p>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map((tag, i) => (
                  <span key={i} className="text-[0.6rem] font-medium px-2 py-1 rounded-full"
                    style={{ background: 'oklch(95% 0.005 80)', color: 'var(--shopli-warm-gray)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Buy Button */}
            <div className="mt-auto space-y-3">
              <a
                href={product.affiliateLink}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="w-full btn-primary text-base py-4 inline-flex items-center justify-center gap-2"
              >
                <Icon name="external" size={18} />
                {rtl ? 'קנה ב-AliExpress' : 'Buy on AliExpress'}
              </a>
              <div className="flex gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${product.title} — ${config.currencySymbol}${product.price.toFixed(2)} ${productUrl}`)}`}
                  target="_blank"
                  rel="noopener"
                  className="flex-1 btn-secondary text-sm py-3 inline-flex items-center justify-center gap-2"
                >
                  <Icon name="share" size={16} />
                  {rtl ? 'שתף בוואטסאפ' : 'Share on WhatsApp'}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* You Might Also Like */}
        <Recommendations
          product={product}
          region={region}
          currencySymbol={config.currencySymbol}
          rtl={rtl}
          lang={lang}
        />

        {/* Recently Viewed */}
        <RecentlyViewed
          region={region}
          currencySymbol={config.currencySymbol}
          rtl={rtl}
          lang={lang}
          currentProductId={product.productId}
        />
      </main>

      <footer className="border-t border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
          <div className="flex items-center gap-2 font-semibold" style={{ color: 'var(--shopli-navy)' }}>
            <svg width="18" height="18" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="var(--shopli-orange)"/><path d="M9 12h14l-2 12H11L9 12z" fill="white" opacity="0.9"/></svg>
            shopli
          </div>
          <div>&copy; {new Date().getFullYear()} Shopli. {rtl ? 'כל הזכויות שמורות' : 'All rights reserved.'}</div>
        </div>
      </footer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, query }) => {
  const region = (query?.region as string) || (params?.region as string) || 'eu';
  const config = getRegion(region);
  const rtl = config.direction === 'rtl';
  const lang = config.lang || 'en';

  // Parse product data from query params
  const id = (params?.id as string) || (query?.id as string) || '';
  const title = (query?.title as string) || '';
  const price = parseFloat((query?.price as string)) || 0;
  const currency = (query?.currency as string) || config.currency;
  const imageUrl = (query?.image as string) || '';
  const affiliateLink = (query?.affiliate as string) || '';
  const rating = parseFloat((query?.rating as string)) || 0;
  const reviewCount = parseInt((query?.reviews as string)) || 0;
  const volume = parseInt((query?.volume as string)) || 0;
  const category = (query?.category as string) || '';
  const tags = ((query?.tags as string) || '').split(',').filter(Boolean);
  const description = (query?.description as string) || '';
  const discount = (query?.discount as string) || '';
  const shopName = (query?.shop as string) || '';
  const freeShipping = (query?.freeShipping as string) === '1';
  const originalPrice = query?.originalPrice ? parseFloat(query?.originalPrice as string) : undefined;

  if (!id) {
    return { props: { region, config, rtl, lang, product: null, error: 'No product ID provided' } };
  }

  const product: Product = {
    id,
    productId: id,
    title,
    description,
    price,
    currency,
    currencySymbol: config.currencySymbol,
    originalPrice: originalPrice || undefined,
    imageUrl,
    affiliateLink,
    commissionRate: 0,
    rating,
    reviewCount,
    volume,
    tags,
    category,
    region,
    isHot: false,
    discount,
    shopName,
    freeShipping,
  };

  return {
    props: { region, config, rtl, lang, product, error: null },
  };
};