import type { SearchProduct } from './aliexpress';
import { generateAffiliateLink } from './aliexpress';

/**
 * Single source of truth for the static demo catalog.
 * Used by: PDP page, compare/index demo data, and the sitemap PDP URLs.
 * Ids must stay aligned with the fallback ids in lib/api.ts.
 */
export const DEMO_PRODUCT_IDS = [
  '1005007001',
  '1005007002',
  '1005007003',
  '1005007005',
] as const;

interface DemoDef {
  id: string;
  title: { he: string; en: string };
  price: { il: number; other: number };
  originalPrice: { il: number; other: number };
  rating: number;
  reviewCount: number;
  volume: number;
  category: { he: string; en: string };
  categoryPath: { he: string; en: string };
  shopName: string;
  shopId: string;
  discount: string;
  commissionRate: number;
  freeShipping: boolean;
}

const DEMO_DEFS: DemoDef[] = [
  {
    id: '1005007001',
    title: { he: 'מטען אלחוטי מהיר 15W', en: '15W Fast Wireless Charger' },
    price: { il: 39.9, other: 9.9 },
    originalPrice: { il: 59.9, other: 14.9 },
    rating: 94,
    reviewCount: 2341,
    volume: 15000,
    category: { he: "גאדג'טים", en: 'Gadgets' },
    categoryPath: { he: 'אלקטרוניקה > מטענים', en: 'Electronics > Chargers' },
    shopName: 'TechHome Store',
    shopId: '1',
    discount: '33%',
    commissionRate: 8,
    freeShipping: true,
  },
  {
    id: '1005007002',
    title: { he: 'אוזניות BT Sport Pro', en: 'Sport Bluetooth Earbuds Pro' },
    price: { il: 69.9, other: 18.9 },
    originalPrice: { il: 99.9, other: 29.9 },
    rating: 92,
    reviewCount: 5872,
    volume: 34000,
    category: { he: 'אלקטרוניקה', en: 'Electronics' },
    categoryPath: { he: 'אלקטרוניקה > אודיו', en: 'Electronics > Audio' },
    shopName: 'AudioMax',
    shopId: '2',
    discount: '30%',
    commissionRate: 8,
    freeShipping: true,
  },
  {
    id: '1005007003',
    title: { he: 'ערכת מברגים מדויקת 48in1', en: 'Precision Screwdriver Set 48in1' },
    price: { il: 45, other: 11.5 },
    originalPrice: { il: 65, other: 16.9 },
    rating: 98,
    reviewCount: 3204,
    volume: 8900,
    category: { he: 'כלים', en: 'Tools' },
    categoryPath: { he: 'בית > כלי עבודה', en: 'Home > Tools' },
    shopName: 'ProTools',
    shopId: '3',
    discount: '31%',
    commissionRate: 6,
    freeShipping: false,
  },
  {
    id: '1005007005',
    title: { he: 'שעון חכם ספורט IP68', en: 'IP68 Smart Sports Watch' },
    price: { il: 89.9, other: 22.9 },
    originalPrice: { il: 149.9, other: 39.9 },
    rating: 88,
    reviewCount: 8901,
    volume: 42000,
    category: { he: 'ספורט', en: 'Sports' },
    categoryPath: { he: 'ספורט > לביש', en: 'Sports > Wearables' },
    shopName: 'FitGear',
    shopId: '5',
    discount: '40%',
    commissionRate: 10,
    freeShipping: true,
  },
];

function toSearchProduct(def: DemoDef, region: string, currency: string): SearchProduct {
  const isHe = region === 'il';
  return {
    id: def.id,
    sku: '',
    title: isHe ? def.title.he : def.title.en,
    price: isHe ? def.price.il : def.price.other,
    originalPrice: isHe ? def.originalPrice.il : def.originalPrice.other,
    currency,
    imageUrl: '',
    images: [],
    affiliateLink: generateAffiliateLink(def.id),
    rating: def.rating,
    reviewCount: def.reviewCount,
    volume: def.volume,
    category: isHe ? def.category.he : def.category.en,
    categoryPath: isHe ? def.categoryPath.he : def.categoryPath.en,
    shopName: def.shopName,
    shopId: def.shopId,
    discount: def.discount,
    commissionRate: def.commissionRate,
    freeShipping: def.freeShipping,
  };
}

/** Offline demo catalog aligned with api.ts fallback product IDs */
export function getDemoProducts(region: string, currency: string): SearchProduct[] {
  return DEMO_DEFS.map((d) => toSearchProduct(d, region, currency));
}

export function getDemoProductById(
  id: string,
  region: string,
  currency: string
): SearchProduct | null {
  const def = DEMO_DEFS.find((d) => d.id === id);
  return def ? toSearchProduct(def, region, currency) : null;
}
