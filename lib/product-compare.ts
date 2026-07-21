import type { SearchProduct } from './aliexpress';

export const MAX_COMPARE_PRODUCTS = 4;
export const MIN_COMPARE_PRODUCTS = 2;

export type CompareSpecKey =
  | 'price'
  | 'originalPrice'
  | 'discount'
  | 'rating'
  | 'volume'
  | 'reviewCount'
  | 'category'
  | 'shopName'
  | 'freeShipping';

export interface CompareSpecRow {
  key: CompareSpecKey;
  label: { en: string; he: string; fr: string; de: string; es: string; it: string };
  /** Raw values per product (for difference detection) */
  values: (string | number | boolean | null)[];
  /** Display strings per product */
  display: string[];
  /** True when at least two products differ on this row */
  differs: boolean;
  /** Index of the "best" value when applicable (lower price, higher rating, etc.) */
  bestIndex: number | null;
}

export function parseCompareIds(idsParam: string | string[] | undefined): string[] {
  if (!idsParam) return [];
  const raw = Array.isArray(idsParam) ? idsParam.join(',') : idsParam;
  return [
    ...new Set(
      raw
        .split(/[,|+\s]+/)
        .map((s) => s.trim())
        .filter((s) => /^\d{5,20}$/.test(s))
    ),
  ].slice(0, MAX_COMPARE_PRODUCTS);
}

export function buildCompareShareUrl(
  siteUrl: string,
  region: string,
  productIds: string[]
): string {
  const ids = productIds.filter(Boolean).slice(0, MAX_COMPARE_PRODUCTS).join(',');
  if (!ids) return `${siteUrl}/${region}/compare`;
  return `${siteUrl}/${region}/compare?ids=${encodeURIComponent(ids)}`;
}

function differsValues(values: (string | number | boolean | null)[]): boolean {
  if (values.length < 2) return false;
  const normalized = values.map((v) =>
    v === null || v === undefined || v === '' ? '__empty__' : String(v)
  );
  return new Set(normalized).size > 1;
}

function bestNumericIndex(
  values: (string | number | boolean | null)[],
  prefer: 'min' | 'max'
): number | null {
  let best: number | null = null;
  let bestVal: number | null = null;
  for (let i = 0; i < values.length; i++) {
    const n = typeof values[i] === 'number' ? (values[i] as number) : Number(values[i]);
    if (!Number.isFinite(n) || n <= 0) continue;
    if (
      bestVal === null ||
      (prefer === 'min' && n < bestVal) ||
      (prefer === 'max' && n > bestVal)
    ) {
      bestVal = n;
      best = i;
    }
  }
  return best;
}

function formatPrice(price: number, currency: string, symbol: string): string {
  if (!price || price <= 0) return '—';
  return `${symbol}${price.toFixed(2)}`;
}

/**
 * Build comparison rows with difference highlighting metadata.
 */
export function buildCompareRows(
  products: SearchProduct[],
  currencySymbol: string
): CompareSpecRow[] {
  if (products.length === 0) return [];

  const rows: Omit<CompareSpecRow, 'differs' | 'bestIndex'>[] = [
    {
      key: 'price',
      label: {
        en: 'Price',
        he: 'מחיר',
        fr: 'Prix',
        de: 'Preis',
        es: 'Precio',
        it: 'Prezzo',
      },
      values: products.map((p) => p.price),
      display: products.map((p) => formatPrice(p.price, p.currency, currencySymbol)),
    },
    {
      key: 'originalPrice',
      label: {
        en: 'Original price',
        he: 'מחיר מקורי',
        fr: 'Prix d\'origine',
        de: 'Originalpreis',
        es: 'Precio original',
        it: 'Prezzo originale',
      },
      values: products.map((p) => p.originalPrice),
      display: products.map((p) =>
        p.originalPrice
          ? formatPrice(p.originalPrice, p.currency, currencySymbol)
          : '—'
      ),
    },
    {
      key: 'discount',
      label: {
        en: 'Discount',
        he: 'הנחה',
        fr: 'Réduction',
        de: 'Rabatt',
        es: 'Descuento',
        it: 'Sconto',
      },
      values: products.map((p) => p.discount || null),
      display: products.map((p) => (p.discount ? `-${p.discount}` : '—')),
    },
    {
      key: 'rating',
      label: {
        en: 'Rating',
        he: 'דירוג',
        fr: 'Note',
        de: 'Bewertung',
        es: 'Valoración',
        it: 'Valutazione',
      },
      values: products.map((p) => p.rating),
      display: products.map((p) =>
        p.rating > 0 ? `${(p.rating / 20).toFixed(1)} / 5` : '—'
      ),
    },
    {
      key: 'volume',
      label: {
        en: 'Orders (sold)',
        he: 'הזמנות (נמכר)',
        fr: 'Commandes',
        de: 'Verkäufe',
        es: 'Pedidos',
        it: 'Ordini',
      },
      values: products.map((p) => p.volume),
      display: products.map((p) =>
        p.volume > 0
          ? p.volume > 999
            ? `${(p.volume / 1000).toFixed(1)}k`
            : String(p.volume)
          : '—'
      ),
    },
    {
      key: 'reviewCount',
      label: {
        en: 'Recent trades',
        he: 'עסקאות אחרונות',
        fr: 'Ventes récentes',
        de: 'Kürzliche Käufe',
        es: 'Ventas recientes',
        it: 'Vendite recenti',
      },
      values: products.map((p) => p.reviewCount),
      display: products.map((p) =>
        p.reviewCount > 0
          ? p.reviewCount > 999
            ? `${(p.reviewCount / 1000).toFixed(1)}k`
            : String(p.reviewCount)
          : '—'
      ),
    },
    {
      key: 'category',
      label: {
        en: 'Category',
        he: 'קטגוריה',
        fr: 'Catégorie',
        de: 'Kategorie',
        es: 'Categoría',
        it: 'Categoria',
      },
      values: products.map((p) => p.categoryPath || p.category || null),
      display: products.map((p) => p.categoryPath || p.category || '—'),
    },
    {
      key: 'shopName',
      label: {
        en: 'Shop',
        he: 'חנות',
        fr: 'Boutique',
        de: 'Shop',
        es: 'Tienda',
        it: 'Negozio',
      },
      values: products.map((p) => p.shopName || null),
      display: products.map((p) => p.shopName || '—'),
    },
    {
      key: 'freeShipping',
      label: {
        en: 'Free shipping',
        he: 'משלוח חינם',
        fr: 'Livraison gratuite',
        de: 'Kostenloser Versand',
        es: 'Envío gratis',
        it: 'Spedizione gratuita',
      },
      values: products.map((p) => p.freeShipping),
      display: products.map((p) => (p.freeShipping ? '✓' : '—')),
    },
  ];

  return rows.map((row) => {
    let bestIndex: number | null = null;
    if (row.key === 'price') bestIndex = bestNumericIndex(row.values, 'min');
    else if (row.key === 'rating' || row.key === 'volume' || row.key === 'reviewCount') {
      bestIndex = bestNumericIndex(row.values, 'max');
    } else if (row.key === 'discount') {
      // Higher discount percentage is better
      const nums = row.values.map((v) => {
        if (v == null) return null;
        const n = parseFloat(String(v).replace('%', ''));
        return Number.isFinite(n) ? n : null;
      });
      bestIndex = bestNumericIndex(nums, 'max');
    }

    return {
      ...row,
      differs: differsValues(row.values),
      bestIndex,
    };
  });
}

export function comparePageTitle(
  products: SearchProduct[],
  lang: string
): string {
  if (products.length === 0) {
    return lang === 'he' ? 'השוואת מוצרים | Shopli' : 'Compare Products | Shopli';
  }
  const names = products.map((p) => {
    const t = p.title;
    return t.length > 40 ? t.slice(0, 37) + '…' : t;
  });
  if (lang === 'he') {
    return `השוואה: ${names.join(' vs ')} | Shopli`;
  }
  return `Compare: ${names.join(' vs ')} | Shopli`;
}

export function comparePageDescription(
  products: SearchProduct[],
  currencySymbol: string,
  lang: string
): string {
  if (products.length === 0) {
    return lang === 'he'
      ? 'השוו מוצרים מאליאקספרס זה לצד זה — מחיר, דירוג, הנחות ועוד. קבלו החלטת קנייה חכמה.'
      : 'Compare AliExpress products side by side — price, rating, discounts and more. Make a smarter purchase decision.';
  }
  const prices = products
    .map((p) => `${currencySymbol}${p.price.toFixed(2)}`)
    .join(', ');
  if (lang === 'he') {
    return `השוואת ${products.length} מוצרים: ${prices}. מחיר, דירוג, מכירות וחנות — הבדלים מודגשים.`;
  }
  return `Side-by-side comparison of ${products.length} products (${prices}). Price, rating, sales volume and shop — differences highlighted.`;
}
