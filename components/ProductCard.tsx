import { useState, useEffect } from 'react';
import Icon from './icons';
import WhatsAppShare from './WhatsAppShare';
import { isInWishlist, syncAdd, syncRemove } from '../lib/useWishlist';
import { productImage } from '../lib/img';

export interface ProductCardProduct {
  id: string;
  title: string;
  /** Full source title, shown as the h3 tooltip when `title` is a short override. */
  originalTitle?: string;
  price: number;
  originalPrice?: number | null;
  imageUrl?: string;
  affiliateLink?: string;
  rating?: number; // 0–100 (AliExpress evaluate_rate)
  reviewCount?: number;
  volume?: number;
  discount?: string;
  freeShipping?: boolean;
  shopName?: string;
}

interface ProductCardProps {
  product: ProductCardProduct;
  currencySymbol: string;
  rtl?: boolean;
  locale?: string;
  /** Share page URL when affiliate link missing */
  fallbackUrl?: string;
  compact?: boolean;
  showShare?: boolean;
  showCompareLink?: boolean;
  region?: string;
  /** Category/collection name — attached to affiliate_click analytics events */
  category?: string;
  className?: string;
  /** Marks this card as part of the trending hub for analytics */
  trendingHub?: boolean;
  /** When true, link the whole card directly to the affiliate URL (outbound) instead of the on-site PDP */
  directAffiliate?: boolean;
}

function formatSold(n: number, rtl: boolean): string {
  if (n <= 0) return '';
  const label = n > 999 ? `${(n / 1000).toFixed(1)}k` : String(n);
  return rtl ? `${label} נמכרו` : `${label} sold`;
}

function ratingStars(rating: number): number {
  if (!rating || rating <= 0) return 0;
  // evaluate_rate is 0–100; map to 1–5 stars
  return Math.max(1, Math.min(5, Math.round(rating / 20)));
}

function ratingDisplay(rating: number): string {
  if (!rating || rating <= 0) return '';
  return (rating / 20).toFixed(1);
}

export default function ProductCard({
  product,
  currencySymbol,
  rtl = false,
  locale = 'en',
  fallbackUrl,
  compact = false,
  showShare = false,
  showCompareLink = false,
  region,
  category,
  className = '',
  trendingHub = false,
  directAffiliate = false,
}: ProductCardProps) {
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setSaved(isInWishlist(product.id));
  }, [product.id]);

  const stars = ratingStars(product.rating || 0);
  const sold = formatSold(product.volume || 0, rtl);
  const price = Number(product.price) || 0;
  const original =
    product.originalPrice != null && product.originalPrice > price
      ? product.originalPrice
      : null;

  const productPageUrl = region && product.id && !directAffiliate
    ? `/${region}/product/${encodeURIComponent(product.id)}`
    : undefined;
  const externalHref = product.affiliateLink || fallbackUrl || '#';
  const isExternal = !productPageUrl;
  const cardHref = productPageUrl || externalHref;

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      syncRemove(product.id);
      setSaved(false);
    } else {
      syncAdd({
        id: product.id,
        title: product.title,
        price,
        originalPrice: product.originalPrice,
        imageUrl: product.imageUrl,
        affiliateLink: product.affiliateLink,
        rating: product.rating,
        reviewCount: product.reviewCount,
        volume: product.volume,
        discount: product.discount,
        freeShipping: product.freeShipping,
        shopName: product.shopName,
      });
      setSaved(true);
    }
  };

  return (
    <article
      className={`product-card group bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col h-full relative ${className}`}
      data-product-id={product.id}
      data-product-title={product.title}
      data-price={price.toFixed(2)}
      data-currency={currencySymbol}
      data-category={category}
      data-trending-hub={trendingHub || undefined}
    >
      {/* Main link covering the entire card */}
      <a
        href={cardHref}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer sponsored' : undefined}
        className="absolute inset-0 z-0"
        aria-label={product.title}
      />

      <div className={`aspect-square bg-gray-50 overflow-hidden relative ${compact ? '' : ''}`}>
        {product.imageUrl ? (
          <img
            {...productImage(product.imageUrl, compact ? 200 : 400, '(max-width: 640px) 50vw, 400px')}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ color: 'var(--shopli-warm-gray)' }}
          >
            <Icon name="package" size={compact ? 24 : 32} />
          </div>
        )}

        {product.discount && (
          <span
            className="absolute top-2 end-2 text-[0.6rem] sm:text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-sm shadow-sm"
            style={{ color: 'var(--shopli-orange)' }}
          >
            -{product.discount}
          </span>
        )}

        {product.freeShipping && (
          <span className="badge-shipping absolute bottom-2 start-2 flex items-center gap-0.5">
            <Icon name="truck" size={10} />
            {rtl ? 'משלוח חינם' : 'Free ship'}
          </span>
        )}

        {/* Wishlist heart toggle */}
        <button
          type="button"
          onClick={toggleWishlist}
          className={`absolute top-2 start-2 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-200 ${
            saved
              ? 'bg-white shadow-md scale-110'
              : 'bg-white/80 hover:bg-white hover:shadow-sm'
          }`}
          aria-label={saved ? (rtl ? 'הסר מהמועדפים' : 'Remove from wishlist') : (rtl ? 'הוסף למועדפים' : 'Add to wishlist')}
        >
          {saved ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--shopli-orange)" stroke="var(--shopli-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--shopli-warm-gray)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
          )}
        </button>
      </div>

      <div className={`flex flex-col flex-1 ${compact ? 'p-2' : 'p-3'}`}>
        <h3
          className={`font-semibold leading-tight line-clamp-2 mb-1.5 ${
            compact ? 'text-[0.7rem]' : 'text-xs sm:text-sm'
          }`}
          style={{ color: 'var(--shopli-navy)' }}
          title={product.originalTitle || undefined}
        >
          {product.title}
        </h3>

        <div className="flex items-baseline gap-1.5 flex-wrap mb-1">
          <span
            className={`font-bold tabular-nums ${compact ? 'text-xs' : 'text-sm sm:text-base'}`}
            style={{ color: 'var(--shopli-teal)' }}
            dir="ltr"
          >
            {currencySymbol}
            {price.toFixed(2)}
          </span>
          {original != null && (
            <span
              className="text-[0.65rem] sm:text-xs line-through tabular-nums"
              style={{ color: 'var(--shopli-warm-gray)' }}
              dir="ltr"
            >
              {currencySymbol}
              {original.toFixed(2)}
            </span>
          )}
        </div>

        <div
          className="flex items-center gap-1 flex-wrap mt-auto"
          style={{ color: 'var(--shopli-warm-gray)' }}
        >
          {stars > 0 && (
            <>
              <Icon name="star" size={11} className="text-yellow-500 shrink-0" />
              <span className="text-[0.65rem] font-medium tabular-nums">
                {ratingDisplay(product.rating || 0)}
              </span>
            </>
          )}
          {sold && (
            <span className="text-[0.6rem] sm:text-[0.65rem]">{sold}</span>
          )}
          {(product.reviewCount || 0) > 0 && (
            <span className="text-[0.6rem]">
              (
              {(product.reviewCount || 0) > 999
                ? `${((product.reviewCount || 0) / 1000).toFixed(1)}k`
                : product.reviewCount}
              )
            </span>
          )}
        </div>
      </div>

      {(showShare || showCompareLink) && (
        <div className="px-2 pb-2 pt-0 flex items-center gap-1.5 relative z-10">
          {showShare && (
            <WhatsAppShare
              title={product.title}
              url={externalHref}
              locale={(locale as 'he' | 'en' | 'fr' | 'de' | 'es' | 'it' | 'ru') || 'en'}
              size="sm"
            />
          )}
          {showCompareLink && region && product.id && (
            <a
              href={`/${region}/compare?ids=${encodeURIComponent(product.id)}`}
              className="text-[0.65rem] font-semibold px-2 py-1 rounded-lg border border-gray-100 hover:border-orange-200 hover:bg-orange-50/40 transition-colors bg-white"
              style={{ color: 'var(--shopli-navy)' }}
            >
              {rtl ? 'השווה' : 'Compare'}
            </a>
          )}
        </div>
      )}
    </article>
  );
}
