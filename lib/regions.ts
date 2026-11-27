export interface RegionConfig {
  code: string;
  label: string;
  locale: string;
  /** ISO 639-1 (+ optional ISO 3166-1 alpha-2) code used in hreflang annotations. */
  hreflang: string;
  currency: string;
  currencySymbol: string;
  flag: string;
  lang: 'he' | 'en' | 'fr' | 'de' | 'es' | 'it' | 'ru';
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
    hreflang: 'he',
    currency: 'ILS',
    currencySymbol: '₪',
    flag: 'il-flag',
    lang: 'he',
    defaultShipTo: 'IL',
    direction: 'rtl',
    meta: {
      title: 'שופלי — המוצרים הכי שווים מאליאקספרס',
      description: 'שופלי רושמת כל יום את המחירים וההזמנות של אלפי מוצרים באליאקספרס, כדי שתדעו אם ירידת המחיר אמיתית. מחירים בשקלים, בלי הרשמה.',
    },
    tgChannel: 'shoppingisraelnew',
  },
  eu: {
    code: 'eu',
    label: 'Europe',
    locale: 'en-EU',
    hreflang: 'en',
    currency: 'EUR',
    currencySymbol: '€',
    flag: 'eu-flag',
    lang: 'en',
    defaultShipTo: 'FR',
    direction: 'ltr',
    meta: {
      title: 'Shopli — Save on EU AliExpress Deals (EUR, Free Shipping)',
      description: 'EUR-priced AliExpress deals that ship to Europe. Free-shipping picks, quality-filtered, updated today. Shop today\'s EU deals — no signup.',
    },
  },
  us: {
    code: 'us',
    label: 'USA',
    locale: 'en-US',
    hreflang: 'en-US',
    currency: 'USD',
    currencySymbol: '$',
    flag: 'us-flag',
    lang: 'en',
    defaultShipTo: 'US',
    direction: 'ltr',
    meta: {
      title: 'Shopli — Best AliExpress Deals Picked by AI',
      description: 'Shopli records AliExpress prices and orders every day, so you can tell a real price drop from a made-up one. Prices in USD, no signup.',
    },
  },
  uk: {
    code: 'uk',
    label: 'UK',
    locale: 'en-GB',
    hreflang: 'en-GB',
    currency: 'GBP',
    currencySymbol: '£',
    flag: 'uk-flag',
    lang: 'en',
    defaultShipTo: 'GB',
    direction: 'ltr',
    meta: {
      title: 'Shopli — Best AliExpress Deals Picked by AI',
      description: 'Shopli records AliExpress prices and orders every day, so you can tell a real price drop from a made-up one. Prices in GBP, no signup.',
    },
  },
  fr: {
    code: 'fr',
    label: 'France',
    locale: 'fr-FR',
    hreflang: 'fr',
    currency: 'EUR',
    currencySymbol: '€',
    flag: 'fr-flag',
    lang: 'fr',
    defaultShipTo: 'FR',
    direction: 'ltr',
    meta: {
      title: 'Shopli — Les meilleures offres AliExpress sélectionnées par IA',
      description: 'Shopli relève chaque jour les prix et les commandes sur AliExpress, pour distinguer une vraie baisse de prix d\'une fausse promo. Prix en euros, sans inscription.',
    },
  },
  de: {
    code: 'de',
    label: 'Deutschland',
    locale: 'de-DE',
    hreflang: 'de',
    currency: 'EUR',
    currencySymbol: '€',
    flag: 'de-flag',
    lang: 'de',
    defaultShipTo: 'DE',
    direction: 'ltr',
    meta: {
      title: 'Shopli — Die besten AliExpress-Angebote von KI ausgewählt',
      description: 'Shopli erfasst täglich Preise und Bestellungen auf AliExpress, damit Sie echte Preissenkungen von Scheinrabatten unterscheiden können. Preise in Euro, ohne Anmeldung.',
    },
  },
  it: {
    code: 'it',
    label: 'Italia',
    locale: 'it-IT',
    hreflang: 'it',
    currency: 'EUR',
    currencySymbol: '€',
    flag: 'it-flag',
    lang: 'it',
    defaultShipTo: 'IT',
    direction: 'ltr',
    meta: {
      title: 'Shopli — Le migliori offerte AliExpress selezionate dall\'IA',
      description: 'Shopli registra ogni giorno prezzi e ordini su AliExpress, così puoi distinguere un vero ribasso da uno sconto finto. Prezzi in euro, senza registrazione.',
    },
  },
  es: {
    code: 'es',
    label: 'España',
    locale: 'es-ES',
    hreflang: 'es',
    currency: 'EUR',
    currencySymbol: '€',
    flag: 'es-flag',
    lang: 'es',
    defaultShipTo: 'ES',
    direction: 'ltr',
    meta: {
      title: 'Shopli — Las mejores ofertas de AliExpress seleccionadas por IA',
      description: 'Shopli registra cada día los precios y pedidos de AliExpress, para que distingas una rebaja real de un descuento inventado. Precios en euros, sin registro.',
    },
  },
  ru: {
    code: 'ru',
    label: 'Русский (Israel)',
    locale: 'ru-IL',
    hreflang: 'ru',
    currency: 'ILS',
    currencySymbol: '₪',
    flag: 'ru-flag',
    lang: 'ru',
    defaultShipTo: 'IL',
    direction: 'ltr',
    meta: {
      title: 'Shopli — Лучшие предложения AliExpress, подобранные ИИ',
      description: 'Shopli каждый день записывает цены и заказы на AliExpress, чтобы вы отличали настоящую скидку от выдуманной. Без регистрации.',
    },
    tgChannel: 'shoppingisraelnew',
  },
} as const;

export type RegionCode = keyof typeof REGIONS;

export function getRegion(code: string): RegionConfig {
  return REGIONS[code as RegionCode] || REGIONS.eu;
}

export function isValidRegion(code: string): code is RegionCode {
  return Object.prototype.hasOwnProperty.call(REGIONS, code);
}

export const LOCALE_LABELS: Record<string, string> = {
  'he': 'עברית',
  'en': 'English',
  'fr': 'Français',
  'de': 'Deutsch',
  'es': 'Español',
  'it': 'Italiano',
  'ru': 'Русский',
};

export const ALL_REGIONS = Object.entries(REGIONS).map(([code, config]) => ({
  code,
  label: config.label,
  lang: config.lang,
  direction: config.direction,
  localeLabel: LOCALE_LABELS[config.lang] || config.lang.toUpperCase(),
}));
/** English copy is written in euros; US and UK readers see their own symbol on the same round thresholds. */
export function localCurrency(text: string, region: string): string {
  const sym = getRegion(region).currencySymbol;
  if (!text || sym === '€' || sym === '₪') return text;
  return text.replace(/€\s?(\d)/g, `${sym}$1`).replace(/(\d+(?:[.,]\d+)?)\s?€/g, `${sym}$1`);
}
