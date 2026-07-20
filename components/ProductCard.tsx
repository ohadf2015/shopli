import { Product } from '../lib/types';
import Icon from './icons';

interface ProductCardProps {
  product: Product;
  region: string;
  currencySymbol: string;
  rtl: boolean;
  lang: string;
  showShare?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function ProductCard({
  product,
  region,
  currencySymbol,
  rtl,
  lang,
  showShare = false,
  size = 'md',
}: ProductCardProps) {
  // Encode product data for the detail page
  const detailParams = new URLSearchParams();
  detailParams.set('id', product.productId || product.id);
  detailParams.set('title', product.title);
  detailParams.set('price', String(product.price));
  detailParams.set('currency', product.currency);
  detailParams.set('symbol', currencySymbol);
  detailParams.set('image', product.imageUrl);
  detailParams.set('rating', String(product.rating));
  detailParams.set('reviews', String(product.reviewCount));
  detailParams.set('volume', String(product.volume));
  detailParams.set('category', product.category || '');
  detailParams.set('tags', (product.tags || []).join(','));
  detailParams.set('affiliate', product.affiliateLink);
  detailParams.set('description', product.description || '');
  detailParams.set('discount', product.discount || '');
  detailParams.set('shop', product.shopName || '');
  detailParams.set('freeShipping', product.freeShipping ? '1' : '0');
  if (product.originalPrice && product.originalPrice > product.price) {
    detailParams.set('originalPrice', String(product.originalPrice));
  }

  const detailHref = `/${region}/product/${encodeURIComponent(product.productId || product.id)}?${detailParams.toString()}`;

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <a
      href={detailHref}
      className={`bg-white rounded-xl border border-gray-100 overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 group ${isLarge ? 'col-span-2 md:col-span-1' : ''}`}
    >
      {/* Image */}
      <div className={`bg-gray-100 overflow-hidden relative ${isSmall ? 'aspect-[4/3]' : 'aspect-square'}`}>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--shopli-warm-gray)' }}>
            <Icon name="package" size={isSmall ? 24 : 32} />
          </div>
        )}
        {product.discount && (
          <span className="absolute top-2 right-2 text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm"
            style={{ color: 'var(--shopli-orange)' }}>
            -{product.discount}
          </span>
        )}
        {product.freeShipping && (
          <span className="absolute top-2 left-2 text-[0.55rem] font-bold px-1.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm"
            style={{ color: 'var(--shopli-teal)' }}>
            {rtl ? 'משלוח חינם' : 'Free Shipping'}
          </span>
        )}
      </div>

      {/* Info */}
      <div className={`${isSmall ? 'p-2' : 'p-3'}`}>
        <h3 className={`font-semibold leading-tight mb-1 line-clamp-2 ${isSmall ? 'text-[0.65rem]' : 'text-xs'}`}
          style={{ color: 'var(--shopli-navy)' }}>
          {product.title}
        </h3>

        <div className="flex items-center gap-1.5 mb-1">
          <span className="font-bold text-sm" style={{ color: 'var(--shopli-teal)' }}>
            {currencySymbol}{product.price.toFixed(2)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs line-through" style={{ color: 'var(--shopli-warm-gray)' }}>
              {currencySymbol}{product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          <Icon name="star" size={11} className="text-yellow-500" />
          <span className="text-[0.65rem] font-medium" style={{ color: 'var(--shopli-warm-gray)' }}>
            {product.rating}
          </span>
          {product.volume > 0 && (
            <span className="text-[0.6rem]" style={{ color: 'var(--shopli-warm-gray)' }}>
              {product.volume > 999 ? `${(product.volume / 1000).toFixed(1)}k` : product.volume}{rtl ? ' נמכרו' : ' sold'}
            </span>
          )}
          {product.reviewCount > 0 && (
            <span className="text-[0.6rem]" style={{ color: 'var(--shopli-warm-gray)' }}>
              ({product.reviewCount > 999 ? `${(product.reviewCount / 1000).toFixed(1)}k` : product.reviewCount})
            </span>
          )}
        </div>

        {showShare && (
          <div className="mt-1.5" onClick={(e) => e.stopPropagation()}>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${product.title} — ${currencySymbol}${product.price.toFixed(2)}`)}`}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1 text-[0.6rem] font-semibold px-2 py-1 rounded-lg"
              style={{ background: 'oklch(90% 0.05 145)', color: 'oklch(30% 0.1 145)' }}
            >
              <Icon name="share" size={10} />
              {rtl ? 'שתף' : 'Share'}
            </a>
          </div>
        )}
      </div>
    </a>
  );
}