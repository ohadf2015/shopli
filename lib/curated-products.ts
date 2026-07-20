import { Product } from './types';
import curatedProducts from './data/curated-products.json';

export interface CuratedProduct {
  /** Unique slug/id for this product */
  id: string;
  /** Product title */
  name: string;
  /** Price in the target currency */
  price: number;
  /** Optional original price (for showing discounts) */
  originalPrice?: number;
  /** Short description */
  description: string;
  /** URL to product image */
  imageUrl: string;
  /** Category slug (matches Product.category) */
  category: string;
  /** Comma-separated or array of tags */
  tags: string[];
  /** Affiliate/deep link (optional — auto-generated from title if missing) */
  affiliateLink?: string;
  /** Currency code (default: USD) */
  currency?: string;
  /** Shop/vendor name (default: 'AliExpress') */
  shopName?: string;
  /** Free shipping flag */
  freeShipping?: boolean;
  /** Star rating 0-100 */
  rating?: number;
  /** Review count */
  reviewCount?: number;
  /** Volume/sold count */
  volume?: number;
}

/**
 * Validate a single curated product row.
 * Returns an array of error messages (empty = valid).
 */
export function validateCuratedProduct(row: Partial<CuratedProduct>, index: number): string[] {
  const errors: string[] = [];

  if (!row.name || !row.name.trim()) {
    errors.push(`Row ${index}: "name" is required`);
  }
  if (row.price === undefined || row.price === null || isNaN(Number(row.price)) || Number(row.price) < 0) {
    errors.push(`Row ${index}: "price" must be a valid positive number`);
  }
  if (!row.category || !row.category.trim()) {
    errors.push(`Row ${index}: "category" is required`);
  }

  return errors;
}

/**
 * Parse a CSV row object into a CuratedProduct.
 * Maps flexible column names to the canonical fields.
 */
export function parseCsvRow(raw: Record<string, string>, index: number): { product?: CuratedProduct; errors: string[] } {
  const errors: string[] = [];
  const get = (keys: string[]): string => {
    for (const k of keys) {
      const found = Object.keys(raw).find(
        key => key.toLowerCase().trim() === k.toLowerCase().trim()
      );
      if (found !== undefined && raw[found] !== undefined && raw[found].trim() !== '') {
        return raw[found].trim();
      }
    }
    return '';
  };

  const name = get(['name', 'title', 'product name', 'product_name', 'product']);
  const priceRaw = get(['price', 'sale price', 'sale_price', 'unit price', 'unit_price']);
  const originalPriceRaw = get(['original price', 'original_price', 'list price', 'list_price', 'rrp']);
  const description = get(['description', 'desc', 'short description', 'short_description']);
  const imageUrl = get(['image url', 'image_url', 'image', 'img url', 'img_url', 'photo url', 'photo_url']);
  const category = get(['category', 'cat', 'collection', 'type']);
  const tagsRaw = get(['tags', 'tag', 'keywords', 'labels']);
  const affiliateLink = get(['affiliate link', 'affiliate_link', 'url', 'link', 'buy url', 'buy_url']);
  const shopName = get(['shop', 'shop name', 'shop_name', 'vendor', 'store', 'brand']);
  const currency = get(['currency', 'cur']);
  const freeShippingRaw = get(['free shipping', 'free_shipping', 'free shipping?', 'shipping']);

  const price = parseFloat(priceRaw.replace(/[^0-9.-]/g, ''));
  if (isNaN(price) || price < 0) {
    errors.push(`Row ${index}: "price" must be a valid positive number (got "${priceRaw}")`);
  }

  let originalPrice: number | undefined;
  if (originalPriceRaw) {
    const parsed = parseFloat(originalPriceRaw.replace(/[^0-9.-]/g, ''));
    if (!isNaN(parsed) && parsed >= 0) {
      originalPrice = parsed;
    }
  }

  const freeShipping = freeShippingRaw
    ? ['yes', 'true', '1', 'free', 'y'].includes(freeShippingRaw.toLowerCase())
    : false;

  const tags = tagsRaw
    ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  if (!name) {
    errors.push(`Row ${index}: "name" is required`);
  }
  if (!category) {
    errors.push(`Row ${index}: "category" is required`);
  }

  if (errors.length > 0) {
    return { errors };
  }

  const id = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) + '-' + Date.now().toString(36).slice(-4);

  return {
    product: {
      id,
      name,
      price,
      originalPrice: originalPrice && originalPrice > price ? originalPrice : undefined,
      description,
      imageUrl,
      category,
      tags,
      affiliateLink: affiliateLink || undefined,
      currency: currency || undefined,
      shopName: shopName || 'AliExpress',
      freeShipping,
      rating: 0,
      reviewCount: 0,
      volume: 0,
    },
    errors: [],
  };
}

/**
 * Convert a CuratedProduct to the Product type used by the app.
 */
export function curatedToProduct(cp: CuratedProduct, region: string = 'il'): Product {
  return {
    id: cp.id,
    productId: cp.id,
    title: cp.name,
    description: cp.description,
    price: cp.price,
    currency: cp.currency || 'ILS',
    currencySymbol: '₪',
    originalPrice: cp.originalPrice,
    imageUrl: cp.imageUrl,
    affiliateLink: cp.affiliateLink || '#',
    commissionRate: 0,
    rating: cp.rating || 0,
    reviewCount: cp.reviewCount || 0,
    volume: cp.volume || 0,
    tags: cp.tags,
    category: cp.category,
    region,
    isHot: true,
    discount: cp.originalPrice && cp.originalPrice > cp.price
      ? `${Math.round((1 - cp.price / cp.originalPrice) * 100)}%`
      : undefined,
    shopName: cp.shopName || 'AliExpress',
    freeShipping: cp.freeShipping || false,
  };
}

/**
 * Load all curated products.
 */
export function getCuratedProducts(): CuratedProduct[] {
  return curatedProducts as CuratedProduct[];
}