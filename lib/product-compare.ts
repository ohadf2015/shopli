import { Product } from './types';
import { getRegion, RegionCode } from './regions';
import { SITE_URL } from './seo';

/**
 * Product comparison spec — derived fields from a Product that are
 * meaningful to compare side-by-side.
 */
export interface ProductSpec {
  label: string;
  key: string;
  type: 'price' | 'rating' | 'number' | 'boolean' | 'tags' | 'text';
  value: string | number | boolean | string[];
  formatted: string;
}

/**
 * A product with its extracted specs, ready for comparison.
 */
export interface ComparableProduct {
  product: Product;
  specs: ProductSpec[];
}

/**
 * Extract comparison specs from a Product.
 */
export function extractSpecs(product: Product, currencySymbol: string): ProductSpec[] {
  const specs: ProductSpec[] = [];

  specs.push({
    label: 'Price',
    key: 'price',
    type: 'price',
    value: product.price,
    formatted: `${currencySymbol}${product.price.toFixed(2)}`,
  });

  if (product.originalPrice && product.originalPrice > product.price) {
    specs.push({
      label: 'Original Price',
      key: 'originalPrice',
      type: 'price',
      value: product.originalPrice,
      formatted: `${currencySymbol}${product.originalPrice.toFixed(2)}`,
    });
  }

  if (product.discount) {
    specs.push({
      label: 'Discount',
      key: 'discount',
      type: 'text',
      value: product.discount,
      formatted: `-${product.discount}`,
    });
  }

  specs.push({
    label: 'Rating',
    key: 'rating',
    type: 'rating',
    value: product.rating,
    formatted: product.rating > 0 ? `${product.rating.toFixed(1)}%` : 'N/A',
  });

  specs.push({
    label: 'Reviews',
    key: 'reviewCount',
    type: 'number',
    value: product.reviewCount,
    formatted: product.reviewCount > 0
      ? product.reviewCount > 999
        ? `${(product.reviewCount / 1000).toFixed(1)}k`
        : String(product.reviewCount)
      : 'N/A',
  });

  specs.push({
    label: 'Sold',
    key: 'volume',
    type: 'number',
    value: product.volume,
    formatted: product.volume > 0
      ? product.volume > 999
        ? `${(product.volume / 1000).toFixed(1)}k`
        : String(product.volume)
      : 'N/A',
  });

  specs.push({
    label: 'Free Shipping',
    key: 'freeShipping',
    type: 'boolean',
    value: product.freeShipping,
    formatted: product.freeShipping ? '✓ Yes' : '✗ No',
  });

  if (product.shopName) {
    specs.push({
      label: 'Shop',
      key: 'shopName',
      type: 'text',
      value: product.shopName,
      formatted: product.shopName,
    });
  }

  specs.push({
    label: 'Category',
    key: 'category',
    type: 'text',
    value: product.category,
    formatted: product.category || 'General',
  });

  if (product.tags && product.tags.length > 0) {
    specs.push({
      label: 'Tags',
      key: 'tags',
      type: 'tags',
      value: product.tags,
      formatted: product.tags.slice(0, 6).join(', '),
    });
  }

  return specs;
}

/**
 * Find which spec keys differ across the products.
 * Returns a Set of keys that are NOT identical across all products.
 */
export function getDifferences(comparableProducts: ComparableProduct[]): Set<string> {
  if (comparableProducts.length <= 1) return new Set();

  const diffKeys = new Set<string>();
  const keys = comparableProducts[0].specs.map(s => s.key);

  for (const key of keys) {
    const values = comparableProducts.map(cp => {
      const spec = cp.specs.find(s => s.key === key);
      return spec ? JSON.stringify(spec.value) : 'undefined';
    });
    const unique = new Set(values);
    if (unique.size > 1) {
      diffKeys.add(key);
    }
  }

  return diffKeys;
}

/**
 * Find the "best" product index for a given spec key.
 * Returns the index of the product with the best value.
 */
export function findBestIndex(products: ComparableProduct[], key: string): number {
  let bestIdx = 0;
  let bestVal = -Infinity;

  for (let i = 0; i < products.length; i++) {
    const spec = products[i].specs.find(s => s.key === key);
    if (!spec) continue;

    let val = -Infinity;
    switch (key) {
      case 'price':
        // Lowest price = best
        val = -1 * (typeof spec.value === 'number' ? spec.value : 0);
        break;
      case 'rating':
      case 'reviewCount':
      case 'volume':
        val = typeof spec.value === 'number' ? spec.value : 0;
        break;
      case 'freeShipping':
        val = spec.value === true ? 1 : 0;
        break;
      default:
        val = 0;
    }

    if (val > bestVal) {
      bestVal = val;
      bestIdx = i;
    }
  }

  return bestIdx;
}

/**
 * Build a ProductGroup JSON-LD schema for the compared products.
 */
export function productGroupJsonLd(
  products: Product[],
  region: RegionCode,
  url: string,
  currency: string
): Record<string, unknown> {
  const config = getRegion(region);
  const currencySymbol = config.currencySymbol;

  const variations = products.map((p) => ({
    '@type': 'Product',
    name: p.title,
    description: p.description,
    image: p.imageUrl || undefined,
    url: p.affiliateLink || url,
    sku: p.productId,
    brand: p.shopName ? { '@type': 'Brand', name: p.shopName } : undefined,
    offers: {
      '@type': 'Offer',
      price: p.price.toFixed(2),
      priceCurrency: currency,
      availability: 'https://schema.org/InStock',
      url: p.affiliateLink || url,
    },
    aggregateRating:
      p.rating > 0 && p.reviewCount > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: (p.rating / 20).toFixed(1),
            reviewCount: p.reviewCount,
          }
        : undefined,
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'ProductGroup',
    name: `Compare ${products.length} Products`,
    description: `Side-by-side comparison of ${products.map((p) => p.title).join(', ')}`,
    url,
    productGroupID: 'compare',
    variesBy: products.map((p) => p.title),
    hasVariant: variations,
  };
}

/**
 * Fallback products that are always available for comparison testing.
 * Matches the fallback data in api.ts but also exports it statically.
 */
const FALLBACK_PRODUCTS: Record<string, Product[]> = {
  il: [
    { id: 'f1', productId: '1005007001', title: 'מטען אלחוטי מהיר 15W', description: 'מטען מגנטי אוניברסלי לאייפון ואנדרואיד', price: 39.90, currency: 'ILS', currencySymbol: '₪', imageUrl: '', affiliateLink: '#', commissionRate: 0.08, rating: 94, reviewCount: 2341, volume: 15000, tags: ['טכנולוגיה', 'מבצע'], category: 'gadgets', region: 'il', isHot: true, freeShipping: true },
    { id: 'f2', productId: '1005007002', title: 'אוזניות BT Sport Pro', description: 'אוזניות אלחוטיות עם ביטול רעשים וספורט IPX5', price: 69.90, currency: 'ILS', currencySymbol: '₪', imageUrl: '', affiliateLink: '#', commissionRate: 0.08, rating: 92, reviewCount: 5872, volume: 34000, tags: ['אלקטרוניקה', 'ספורט'], category: 'electronics', region: 'il', isHot: true, freeShipping: true },
    { id: 'f3', productId: '1005007003', title: 'ערכת מברגים מדויקת 48in1', description: 'ערכת תיקון מקצועית מגנטית עם 48 ראשים', price: 45.00, currency: 'ILS', currencySymbol: '₪', imageUrl: '', affiliateLink: '#', commissionRate: 0.06, rating: 98, reviewCount: 3204, volume: 8900, tags: ['כלי עבודה', 'בית'], category: 'home', region: 'il', isHot: true, freeShipping: true },
    { id: 'f4', productId: '1005007004', title: 'מנורת לד חכמה עם אפליקציה', description: 'שלט רחוק + אפליקציה, 16 מליון צבעים', price: 28.50, currency: 'ILS', currencySymbol: '₪', imageUrl: '', affiliateLink: '#', commissionRate: 0.08, rating: 90, reviewCount: 1876, volume: 22000, tags: ['בית חכם', 'תאורה'], category: 'home', region: 'il', isHot: false, freeShipping: true },
    { id: 'f5', productId: '1005007005', title: 'שעון חכם ספורט IP68', description: 'מד דופק, לחץ דם, חמצן בדם, 20 מצבי ספורט', price: 89.90, currency: 'ILS', currencySymbol: '₪', imageUrl: '', affiliateLink: '#', commissionRate: 0.10, rating: 88, reviewCount: 8901, volume: 45000, tags: ['ספורט', 'טכנולוגיה'], category: 'sports', region: 'il', isHot: true, freeShipping: true },
    { id: 'f6', productId: '1005007006', title: 'פנס לד חזק 2000LM', description: 'פנס טקטי נטען USB-C, עמיד למים', price: 34.90, currency: 'ILS', currencySymbol: '₪', imageUrl: '', affiliateLink: '#', commissionRate: 0.06, rating: 96, reviewCount: 2341, volume: 18000, tags: ['כלי עבודה', 'חוץ'], category: 'outdoor', region: 'il', isHot: true, freeShipping: true },
  ],
  eu: [
    { id: 'e1', productId: '1005007001', title: '15W Fast Wireless Charger', description: 'Magnetic universal charger for iPhone & Android', price: 9.90, currency: 'EUR', currencySymbol: '€', imageUrl: '', affiliateLink: '#', commissionRate: 0.08, rating: 94, reviewCount: 2341, volume: 15000, tags: ['Tech', 'Deal'], category: 'gadgets', region: 'eu', isHot: true, freeShipping: true },
    { id: 'e2', productId: '1005007002', title: 'Sport Bluetooth Earbuds Pro', description: 'Wireless noise-cancelling earbuds IPX5 waterproof', price: 18.90, currency: 'EUR', currencySymbol: '€', imageUrl: '', affiliateLink: '#', commissionRate: 0.08, rating: 92, reviewCount: 5872, volume: 34000, tags: ['Electronics', 'Sports'], category: 'electronics', region: 'eu', isHot: true, freeShipping: true },
    { id: 'e3', productId: '1005007003', title: 'Precision Screwdriver Set 48in1', description: 'Professional magnetic repair kit with 48 bits', price: 11.50, currency: 'EUR', currencySymbol: '€', imageUrl: '', affiliateLink: '#', commissionRate: 0.06, rating: 98, reviewCount: 3204, volume: 8900, tags: ['Tools', 'Home'], category: 'home', region: 'eu', isHot: true, freeShipping: true },
    { id: 'e4', productId: '1005007004', title: 'Smart LED Lamp WiFi+App', description: 'Remote + app control, 16 million colors', price: 7.50, currency: 'EUR', currencySymbol: '€', imageUrl: '', affiliateLink: '#', commissionRate: 0.08, rating: 90, reviewCount: 1876, volume: 22000, tags: ['Smart Home', 'Lighting'], category: 'home', region: 'eu', isHot: false, freeShipping: true },
    { id: 'e5', productId: '1005007005', title: 'IP68 Smart Sports Watch', description: 'Heart rate, blood pressure, SPO2, GPS, 20 sports modes', price: 22.90, currency: 'EUR', currencySymbol: '€', imageUrl: '', affiliateLink: '#', commissionRate: 0.10, rating: 88, reviewCount: 8901, volume: 45000, tags: ['Sports', 'Tech'], category: 'sports', region: 'eu', isHot: true, freeShipping: true },
    { id: 'e6', productId: '1005007006', title: '2000LM LED Tactical Flashlight', description: 'USB-C rechargeable, waterproof, zoomable', price: 8.90, currency: 'EUR', currencySymbol: '€', imageUrl: '', affiliateLink: '#', commissionRate: 0.06, rating: 96, reviewCount: 2341, volume: 18000, tags: ['Outdoor', 'Tools'], category: 'outdoor', region: 'eu', isHot: true, freeShipping: true },
  ],
};

/**
 * Fetch products by their IDs.
 * Tries fallback products first, then searches the AliExpress API for unmatched IDs.
 */
export async function fetchProductsByIds(
  region: string,
  ids: string[]
): Promise<Product[]> {
  const fallback = FALLBACK_PRODUCTS[region] || FALLBACK_PRODUCTS.eu;

  // Match IDs against fallback products
  const matchedFallbacks = fallback.filter((p: Product) =>
    ids.includes(p.id) || ids.includes(p.productId)
  );

  // For unmatched IDs, try searching the AliExpress API
  const matchedIds = new Set(matchedFallbacks.map((p: Product) => p.id));
  const unmatchedIds = ids.filter(id => !matchedIds.has(id));

  if (unmatchedIds.length > 0) {
    try {
      const { searchAliExpress } = await import('./aliexpress');
      const searchPromises = unmatchedIds.map(async (id) => {
        try {
          const results = await searchAliExpress(id, region, 3);
          return results.filter(r => ids.includes(r.id) || ids.includes(r.sku));
        } catch {
          return [];
        }
      });

      const searchResults = (await Promise.all(searchPromises)).flat();
      const searched = searchResults.map((r: any) => ({
        id: r.id,
        productId: r.id,
        title: r.title,
        description: r.title || '',
        price: r.price,
        currency: r.currency || 'EUR',
        currencySymbol: getRegion(region).currencySymbol,
        originalPrice: r.originalPrice || undefined,
        imageUrl: r.imageUrl || '',
        affiliateLink: r.affiliateLink || '#',
        commissionRate: r.commissionRate || 0,
        rating: r.rating || 0,
        reviewCount: r.reviewCount || 0,
        volume: r.volume || 0,
        tags: [],
        category: r.category || 'general',
        region,
        isHot: true,
        shopName: r.shopName || 'AliExpress',
        freeShipping: r.freeShipping || false,
      })) as Product[];

      return [...matchedFallbacks, ...searched];
    } catch {
      // Fall back to just matched fallbacks
      return matchedFallbacks;
    }
  }

  return matchedFallbacks;
}