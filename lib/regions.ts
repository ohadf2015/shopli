export interface RegionConfig {
  code: string;
  label: string;
  locale: string;
  currency: string;
  currencySymbol: string;
  flag: string;
  lang: 'he' | 'en' | 'fr' | 'de' | 'es' | 'it';
  defaultShipTo: string;
  direction: 'rtl' | 'ltr';
  meta: {
    title: string;
    description: string;
  };
  tgChannel?: string;
}

export const REGIONS: Record<string, RegionConfig> = {
  il: {
    code: 'il',
    label: 'ישראל',
    locale: 'he-IL',
    currency: 'ILS',
    currencySymbol: '₪',
    flag: 'il-flag',
    lang: 'he',
    defaultShipTo: 'IL',
    direction: 'rtl',
    meta: {
      title: 'שופלי — המוצרים הכי שווים מאליאקספרס',
      description: 'AI בוחר את המוצרים הכי שווים מאליאקספרס במיוחד בשבילך. מחירים מטורפים, משלוח חינם, איכות מובטחת.',
    },
    tgChannel: 'shopli_il',
  },
  eu: {
    code: 'eu',
    label: 'Europe',
    locale: 'en-EU',
    currency: 'EUR',
    currencySymbol: '€',
    flag: 'eu-flag',
    lang: 'en',
    defaultShipTo: 'FR',
    direction: 'ltr',
    meta: {
      title: 'Shopli — Best AliExpress Deals Picked by AI',
      description: 'AI-powered product recommendations from AliExpress. Curated deals, free shipping, quality guaranteed.',
    },
    tgChannel: 'shopli_eu',
  },
  us: {
    code: 'us',
    label: 'USA',
    locale: 'en-US',
    currency: 'USD',
    currencySymbol: '$',
    flag: 'us-flag',
    lang: 'en',
    defaultShipTo: 'US',
    direction: 'ltr',
    meta: {
      title: 'Shopli — Best AliExpress Deals Picked by AI',
      description: 'AI-powered product recommendations from AliExpress. Curated deals, free shipping, quality guaranteed.',
    },
    tgChannel: 'shopli_us',
  },
  uk: {
    code: 'uk',
    label: 'UK',
    locale: 'en-GB',
    currency: 'GBP',
    currencySymbol: '£',
    flag: 'uk-flag',
    lang: 'en',
    defaultShipTo: 'GB',
    direction: 'ltr',
    meta: {
      title: 'Shopli — Best AliExpress Deals Picked by AI',
      description: 'AI-powered product recommendations from AliExpress. Curated deals, free shipping, quality guaranteed.',
    },
  },
  fr: {
    code: 'fr',
    label: 'France',
    locale: 'fr-FR',
    currency: 'EUR',
    currencySymbol: '€',
    flag: 'fr-flag',
    lang: 'fr',
    defaultShipTo: 'FR',
    direction: 'ltr',
    meta: {
      title: 'Shopli — Les meilleures offres AliExpress sélectionnées par IA',
      description: 'Recommandations de produits IA depuis AliExpress. Offres curated, livraison gratuite, qualité garantie.',
    },
  },
  de: {
    code: 'de',
    label: 'Deutschland',
    locale: 'de-DE',
    currency: 'EUR',
    currencySymbol: '€',
    flag: 'de-flag',
    lang: 'de',
    defaultShipTo: 'DE',
    direction: 'ltr',
    meta: {
      title: 'Shopli — Die besten AliExpress-Angebote von KI ausgewählt',
      description: 'KI-gestützte Produktempfehlungen von AliExpress. Kuratierte Angebote, kostenloser Versand, Qualitätsgarantie.',
    },
  },
  it: {
    code: 'it',
    label: 'Italia',
    locale: 'it-IT',
    currency: 'EUR',
    currencySymbol: '€',
    flag: 'it-flag',
    lang: 'it',
    defaultShipTo: 'IT',
    direction: 'ltr',
    meta: {
      title: 'Shopli — Le migliori offerte AliExpress selezionate dall\'IA',
      description: 'Raccomandazioni di prodotti IA da AliExpress. Offerte curate, spedizione gratuita, qualità garantita.',
    },
  },
  es: {
    code: 'es',
    label: 'España',
    locale: 'es-ES',
    currency: 'EUR',
    currencySymbol: '€',
    flag: 'es-flag',
    lang: 'es',
    defaultShipTo: 'ES',
    direction: 'ltr',
    meta: {
      title: 'Shopli — Las mejores ofertas de AliExpress seleccionadas por IA',
      description: 'Recomendaciones de productos con IA desde AliExpress. Ofertas seleccionadas, envío gratis, calidad garantizada.',
    },
  },
} as const;

export type RegionCode = keyof typeof REGIONS;

export function getRegion(code: string): RegionConfig {
  return REGIONS[code as RegionCode] || REGIONS.eu;
}

export const LOCALE_LABELS: Record<string, string> = {
  'he': 'עברית',
  'en': 'English',
  'fr': 'Français',
  'de': 'Deutsch',
  'es': 'Español',
  'it': 'Italiano',
};

export const ALL_REGIONS = Object.entries(REGIONS).map(([code, config]) => ({
  code,
  label: config.label,
  lang: config.lang,
  direction: config.direction,
  localeLabel: LOCALE_LABELS[config.lang] || config.lang.toUpperCase(),
}));