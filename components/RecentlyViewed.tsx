import { useState, useEffect } from 'react';
import Icon from './icons';
import { Product } from '../lib/types';
import ProductCard from './ProductCard';

interface RecentlyViewedProps {
  region: string;
  currencySymbol: string;
  rtl: boolean;
  lang: string;
  currentProductId?: string;
}

interface RecentItem {
  productId: string;
  title: string;
  price: number;
  currency: string;
  imageUrl: string;
  rating: number;
  volume: number;
  category: string;
  affiliateLink: string;
  discount?: string;
  timestamp: number;
}

export default function RecentlyViewed({ region, currencySymbol, rtl, lang, currentProductId }: RecentlyViewedProps) {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('shopli_recently_viewed');
      if (stored) {
        const parsed = JSON.parse(stored) as RecentItem[];
        // Filter out current product, limit to 6
        const filtered = parsed
          .filter((p) => p.productId !== currentProductId)
          .slice(0, 6);
        setItems(filtered);
      }
    } catch {
      // ignore
    }
  }, [currentProductId]);

  if (items.length === 0) return null;

  // Convert RecentItem to Product for ProductCard
  const asProducts: Product[] = items.map((item) => ({
    id: item.productId,
    productId: item.productId,
    title: item.title,
    description: '',
    price: item.price,
    currency: item.currency || 'EUR',
    currencySymbol: currencySymbol,
    imageUrl: item.imageUrl,
    affiliateLink: item.affiliateLink,
    commissionRate: 0,
    rating: item.rating,
    reviewCount: 0,
    volume: item.volume,
    tags: [],
    category: item.category || '',
    region: region,
    isHot: false,
    discount: item.discount,
    freeShipping: false,
  }));

  return (
    <section className="py-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="clock" size={16} />
          <h2 className="text-lg font-bold" style={{ color: 'var(--shopli-navy)' }}>
            {rtl ? 'מוצרים שצפיתם בהם' : 'Recently Viewed'}
          </h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
          {asProducts.map((p) => (
            <div key={p.productId} className="flex-shrink-0 w-40 sm:w-44" style={{ scrollSnapAlign: 'start' }}>
              <ProductCard
                product={p}
                region={region}
                currencySymbol={currencySymbol}
                rtl={rtl}
                lang={lang}
                size="sm"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}