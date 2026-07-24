import Icon from './icons';
import WhatsAppShare from './WhatsAppShare';

export interface ProductCardProduct {
  id: string;
  title: string;
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
  className?: string;
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
  className = '',
}: ProductCardProps) {
  const href = product.affiliateLink || fallbackUrl || '#';
  const stars = ratingStars(product.rating || 0);
  const sold = formatSold(product.volume || 0, rtl);
  const price = Number(product.price) || 0;
  const original =
    product.originalPrice != null && product.originalPrice > price
      ? product.originalPrice
      : null;

  return (
    <article
      className={`product-card group bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col h-full ${className}`}
    >
      <a
        href={href}
        target={product.affiliateLink ? '_blank' : undefined}
        rel={product.affiliateLink ? 'noopener noreferrer sponsored' : undefined}
        className="flex flex-col flex-1 min-h-0"
      >
        <div className={`aspect-square bg-gray-50 overflow-hidden relative ${compact ? '' : ''}`}>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              decoding="async"
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
        </div>

        <div className={`flex flex-col flex-1 ${compact ? 'p-2' : 'p-3'}`}>
          <h3
            className={`font-semibold leading-tight line-clamp-2 mb-1.5 ${
              compact ? 'text-[0.7rem]' : 'text-xs sm:text-sm'
            }`}
            style={{ color: 'var(--shopli-navy)' }}
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
      </a>

      {(showShare || showCompareLink) && (
        <div className="px-2 pb-2 pt-0 flex items-center gap-1.5">
          {showShare && (
            <WhatsAppShare
              title={product.title}
              url={href}
              locale={(locale as 'he' | 'en' | 'fr' | 'de' | 'es' | 'it' | 'ru') || 'en'}
              size="sm"
            />
          )}
          {showCompareLink && region && product.id && (
            <a
              href={`/${region}/compare?ids=${encodeURIComponent(product.id)}`}
              className="text-[0.65rem] font-semibold px-2 py-1 rounded-lg border border-gray-100 hover:border-orange-200 hover:bg-orange-50/40 transition-colors"
              style={{ color: 'var(--shopli-navy)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {rtl ? 'השווה' : 'Compare'}
            </a>
          )}
        </div>
      )}
    </article>
  );
}
