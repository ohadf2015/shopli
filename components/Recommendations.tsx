import { useState, useEffect } from 'react';
import { Product } from '../lib/types';
import ProductCard from './ProductCard';

interface RecommendationsProps {
  product: Product;
  region: string;
  currencySymbol: string;
  rtl: boolean;
  lang: string;
}

export default function Recommendations({ product, region, currencySymbol, rtl, lang }: RecommendationsProps) {
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!product.category) {
      setLoading(false);
      return;
    }
    // Fetch products from the same category
    fetch(`/api/products/hot?region=${region}&limit=6`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products) {
          // Filter by same category, exclude current product
          const filtered = data.products
            .filter((p: any) => p.productId !== product.productId && p.category === product.category)
            .slice(0, 6);
          setRelated(filtered);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [product.category, product.productId, region]);

  if (loading || related.length === 0) return null;

  return (
    <section className="py-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--shopli-navy)' }}>
          {rtl ? 'אולי תאהבו גם' : 'You Might Also Like'}
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
          {related.map((p: any) => (
            <div key={p.productId || p.id} className="flex-shrink-0 w-40 sm:w-44" style={{ scrollSnapAlign: 'start' }}>
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