import { Product } from './types';
import { getRegion, RegionCode } from './regions';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function fetchProducts(region: RegionCode, options?: {
  category?: string;
  query?: string;
  page?: number;
  limit?: number;
}): Promise<Product[]> {
  const config = getRegion(region);
  const params = new URLSearchParams();

  if (options?.query) params.set('q', options.query);
  if (options?.category) params.set('category', options.category);
  if (options?.page) params.set('page', String(options.page));
  if (options?.limit) params.set('limit', String(options.limit));

  params.set('language', config.lang.toUpperCase());
  params.set('currency', config.currency);
  params.set('shipToCountry', config.defaultShipTo);

  try {
    const res = await fetch(`${API_BASE}/products/hot?${params}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return mapProducts(data.data || [], region);
  } catch {
    return getFallbackProducts(region);
  }
}

export async function searchProducts(region: RegionCode, query: string): Promise<Product[]> {
  const config = getRegion(region);
  const params = new URLSearchParams({ q: query });

  params.set('language', config.lang.toUpperCase());
  params.set('currency', config.currency);
  params.set('shipToCountry', config.defaultShipTo);

  try {
    const res = await fetch(`${API_BASE}/products/search?${params}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return mapProducts(data.data || [], region);
  } catch {
    return [];
  }
}

function mapProducts(products: any[], region: RegionCode): Product[] {
  const regionConfig = getRegion(region);
  return products.map((p: any) => ({
    id: p.productId || String(Math.random()),
    productId: p.productId,
    title: p.title || 'Product',
    description: p.description || '',
    price: p.promotionalPrice?.amount || p.price?.amount || 0,
    currency: p.promotionalPrice?.currency || p.price?.currency || regionConfig.currency,
    currencySymbol: regionConfig.currencySymbol,
    originalPrice: p.price?.amount,
    imageUrl: p.imageUrl || '',
    affiliateLink: p.affiliateLink || generateAffiliateLink(p.productId, region),
    commissionRate: p.commissionRate || 0,
    rating: p.rating || 0,
    reviewCount: p.reviewCount || 0,
    tags: p.tags || [],
    category: p.category || 'general',
    region,
    isHot: true,
    discount: p.discount,
    shopName: p.shopName,
    freeShipping: true,
  }));
}

function generateAffiliateLink(productId: string, region: RegionCode): string {
  const trackingId = process.env.NEXT_PUBLIC_ALIEXPRESS_TRACKING_ID || 'shopli';
  const tid = process.env.NEXT_PUBLIC_ALIEXPRESS_TRACKING_ID || 'shopli';
  return `https://www.aliexpress.com/item/${productId}.html?aff_fcid=${tid}`;
}

// Fallback products when API is down — realistic examples
function getFallbackProducts(region: RegionCode): Product[] {
  const regionConfig = getRegion(region);
  const s = regionConfig.currencySymbol;

  const fallbacks: Record<string, Product[]> = {
    il: [
      { id: 'f1', productId: '1005007001', title: 'מטען אלחוטי מהיר 15W', description: 'מטען מגנטי אוניברסלי לאייפון ואנדרואיד', price: 39.90, currency: 'ILS', currencySymbol: s, imageUrl: '', affiliateLink: '#', commissionRate: 0.08, rating: 4.7, reviewCount: 2341, tags: ['טכנולוגיה', 'מבצע'], category: 'gadgets', region, isHot: true, freeShipping: true },
      { id: 'f2', productId: '1005007002', title: 'אוזניות BT Sport Pro', description: 'אוזניות אלחוטיות עם ביטול רעשים וספורט IPX5', price: 69.90, currency: 'ILS', currencySymbol: s, imageUrl: '', affiliateLink: '#', commissionRate: 0.08, rating: 4.6, reviewCount: 5872, tags: ['אלקטרוניקה', 'ספורט'], category: 'electronics', region, isHot: true, freeShipping: true },
      { id: 'f3', productId: '1005007003', title: 'ערכת מברגים מדויקת 48in1', description: 'ערכת תיקון מקצועית מגנטית עם 48 ראשים', price: 45.00, currency: 'ILS', currencySymbol: s, imageUrl: '', affiliateLink: '#', commissionRate: 0.06, rating: 4.9, reviewCount: 3204, tags: ['כלי עבודה', 'בית'], category: 'home', region, isHot: true, freeShipping: true },
      { id: 'f4', productId: '1005007004', title: 'מנורת לד חכמה עם אפליקציה', description: 'שלט רחוק + אפליקציה, 16 מליון צבעים', price: 28.50, currency: 'ILS', currencySymbol: s, imageUrl: '', affiliateLink: '#', commissionRate: 0.08, rating: 4.5, reviewCount: 1876, tags: ['בית חכם', 'תאורה'], category: 'home', region, isHot: false, freeShipping: true },
      { id: 'f5', productId: '1005007005', title: 'שעון חכם ספורט IP68', description: 'מד דופק, לחץ דם, חמצן בדם, 20 מצבי ספורט', price: 89.90, currency: 'ILS', currencySymbol: s, imageUrl: '', affiliateLink: '#', commissionRate: 0.10, rating: 4.4, reviewCount: 8901, tags: ['ספורט', 'טכנולוגיה'], category: 'sports', region, isHot: true, freeShipping: true },
      { id: 'f6', productId: '1005007006', title: 'פנס לד חזק 2000LM', description: 'פנס טקטי נטען USB-C, עמיד למים', price: 34.90, currency: 'ILS', currencySymbol: s, imageUrl: '', affiliateLink: '#', commissionRate: 0.06, rating: 4.8, reviewCount: 2341, tags: ['כלי עבודה', 'חוץ'], category: 'outdoor', region, isHot: true, freeShipping: true },
    ],
    eu: [
      { id: 'e1', productId: '1005007001', title: '15W Fast Wireless Charger', description: 'Magnetic universal charger for iPhone & Android', price: 9.90, currency: 'EUR', currencySymbol: s, imageUrl: '', affiliateLink: '#', commissionRate: 0.08, rating: 4.7, reviewCount: 2341, tags: ['Tech', 'Deal'], category: 'gadgets', region, isHot: true, freeShipping: true },
      { id: 'e2', productId: '1005007002', title: 'Sport Bluetooth Earbuds Pro', description: 'Wireless noise-cancelling earbuds IPX5 waterproof', price: 18.90, currency: 'EUR', currencySymbol: s, imageUrl: '', affiliateLink: '#', commissionRate: 0.08, rating: 4.6, reviewCount: 5872, tags: ['Electronics', 'Sports'], category: 'electronics', region, isHot: true, freeShipping: true },
      { id: 'e3', productId: '1005007003', title: 'Precision Screwdriver Set 48in1', description: 'Professional magnetic repair kit with 48 bits', price: 11.50, currency: 'EUR', currencySymbol: s, imageUrl: '', affiliateLink: '#', commissionRate: 0.06, rating: 4.9, reviewCount: 3204, tags: ['Tools', 'Home'], category: 'home', region, isHot: true, freeShipping: true },
      { id: 'e4', productId: '1005007004', title: 'Smart LED Lamp WiFi+App', description: 'Remote + app control, 16 million colors', price: 7.50, currency: 'EUR', currencySymbol: s, imageUrl: '', affiliateLink: '#', commissionRate: 0.08, rating: 4.5, reviewCount: 1876, tags: ['Smart Home', 'Lighting'], category: 'home', region, isHot: false, freeShipping: true },
      { id: 'e5', productId: '1005007005', title: 'IP68 Smart Sports Watch', description: 'Heart rate, blood pressure, SPO2, GPS, 20 sports modes', price: 22.90, currency: 'EUR', currencySymbol: s, imageUrl: '', affiliateLink: '#', commissionRate: 0.10, rating: 4.4, reviewCount: 8901, tags: ['Sports', 'Tech'], category: 'sports', region, isHot: true, freeShipping: true },
      { id: 'e6', productId: '1005007006', title: '2000LM LED Tactical Flashlight', description: 'USB-C rechargeable, waterproof, zoomable', price: 8.90, currency: 'EUR', currencySymbol: s, imageUrl: '', affiliateLink: '#', commissionRate: 0.06, rating: 4.8, reviewCount: 2341, tags: ['Outdoor', 'Tools'], category: 'outdoor', region, isHot: true, freeShipping: true },
    ],
  };

  return fallbacks[region] || fallbacks.eu;
}

export const CATEGORIES = [
  { id: 'gadgets', slug: 'gadgets', name: { he: 'גאדג\'טים', en: 'Gadgets', fr: 'Gadgets', de: 'Gadgets', es: 'Gadgets', it: 'Gadget' }, icon: 'tech' },
  { id: 'electronics', slug: 'electronics', name: { he: 'אלקטרוניקה', en: 'Electronics', fr: 'Électronique', de: 'Elektronik', es: 'Electrónica', it: 'Elettronica' }, icon: 'electronics' },
  { id: 'home', slug: 'home', name: { he: 'בית וגינה', en: 'Home & Garden', fr: 'Maison & Jardin', de: 'Haus & Garten', es: 'Hogar & Jardín', it: 'Casa & Giardino' }, icon: 'home' },
  { id: 'sports', slug: 'sports', name: { he: 'ספורט', en: 'Sports', fr: 'Sports', de: 'Sport', es: 'Deportes', it: 'Sport' }, icon: 'sports' },
  { id: 'fashion', slug: 'fashion', name: { he: 'אופנה', en: 'Fashion', fr: 'Mode', de: 'Mode', es: 'Moda', it: 'Moda' }, icon: 'fashion' },
  { id: 'auto', slug: 'auto', name: { he: 'רכב', en: 'Auto', fr: 'Auto', de: 'Auto', es: 'Auto', it: 'Auto' }, icon: 'auto' },
  { id: 'outdoor', slug: 'outdoor', name: { he: 'חוץ וטיולים', en: 'Outdoor', fr: 'Plein air', de: 'Outdoor', es: 'Aire libre', it: 'Outdoor' }, icon: 'outdoor' },
  { id: 'kids', slug: 'kids', name: { he: 'ילדים', en: 'Kids', fr: 'Enfants', de: 'Kinder', es: 'Niños', it: 'Bambini' }, icon: 'kids' },
];