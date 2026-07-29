/**
 * Copy + config for the top-level /deals page.
 *
 * /deals exists to absorb the legacy smart-shopping-il.com equity that is
 * 301-redirected to tryshopli.com/deals (old /category/* URLs are 308'd there
 * by the registrar). It is a content-negotiated page (Accept-Language) rather
 * than a regional /{region}/deals page, so it must NOT emit hreflang tags.
 */

export type DealsLang = 'he' | 'en';

export const DEALS_COLLECTIONS_COUNT = 8;
export const DEALS_PRODUCTS_PER_COLLECTION = 4;

export function detectDealsLang(acceptLanguage: string | undefined | null): DealsLang {
  if (!acceptLanguage) return 'en';
  const primary = acceptLanguage.split(',')[0].trim().toLowerCase();
  return primary === 'he' || primary.startsWith('he-') ? 'he' : 'en';
}

export function dealsLangToRegion(lang: DealsLang): 'il' | 'eu' {
  return lang === 'he' ? 'il' : 'eu';
}

export interface DealsCopy {
  title: string;
  description: string;
  h1: string;
  subtitle: string;
  freshnessLabel: string;
  viewAll: string;
  emptyLabel: string;
  fullSiteCta: string;
  dateLocale: string;
}

const COPY: Record<DealsLang, DealsCopy> = {
  he: {
    title: 'דילים חמים מאליאקספרס — מתעדכן מדי יום | שופלי',
    description:
      'הדילים הכי שווים מאליאקספרס במקום אחד: מחירים שקופים, משלוח לישראל, מבחר מתעדכן מדי יום. חסכו זמן וכסף עם שופלי.',
    h1: 'הדילים החמים של היום מאליאקספרס',
    subtitle: 'מבחר מוצרים נבחרים במחירים משתלמים — מתעדכן מדי יום',
    freshnessLabel: 'עודכן לאחרונה',
    viewAll: 'לכל הדילים בקטגוריה',
    emptyLabel: 'הדילים מתעדכנים כרגע — כדאי לבדוק שוב בעוד כמה דקות.',
    fullSiteCta: 'לכל הקטגוריות באתר',
    dateLocale: 'he-IL',
  },
  en: {
    title: "Today's Best AliExpress Deals — Updated Daily | Shopli",
    description:
      'Hand-picked AliExpress deals in one place: transparent prices, worldwide shipping, refreshed daily. Save time and money with Shopli.',
    h1: "Today's Hottest AliExpress Deals",
    subtitle: 'A curated selection of products at great prices — updated daily',
    freshnessLabel: 'Last updated',
    viewAll: 'View all deals in this category',
    emptyLabel: 'Deals are refreshing right now — check back in a few minutes.',
    fullSiteCta: 'Browse all categories',
    dateLocale: 'en-GB',
  },
};

export function getDealsCopy(lang: DealsLang): DealsCopy {
  return COPY[lang];
}
