/**
 * Product-URL parser + duty-waiver band copy for /landed
 * (paste Amazon / AliExpress / any URL → IL quote).
 * Provenance only — no live scraping. Quote math stays in lib/landed-cost.ts (#14/#18/#19/#20).
 * Kit paste (2–5 URLs) + single-SKU miss tipping: Moat after #21.
 * ITA Shaar Olami calculator foil (#23): deep-link honesty strip — presentation only.
 * #24: explicit 18% not 17% foil. #25: side-by-side iWishBag 「17% body still wrong」
 * (verified Sep 7 night). #26: Etsy/eBay/Walmart→IL how-tos. #27 layer: AliExpress +
 * Amazon JP→IL how-tos — presentation only; math unchanged.
 */

import {
  DUTY_FREE_THRESHOLD_USD,
  DUTY_WAIVER_CEILING_USD,
  IL_VAT_RATE,
  BOI_CUSTOMS_FX_UPLIFT,
  estimateLandedCost,
  estimateKitLandedCost,
  type LandedCostInput,
} from './landed-cost';

export type LandedUrlSource = 'amazon' | 'aliexpress' | 'other';

export interface ParsedProductUrl {
  host: string;
  source: LandedUrlSource;
  productId?: string;
  canonicalUrl?: string;
}

/** Personal-import band for goods value (USD). Matches estimator: under $75 = ptur. */
export type DutyWaiverBand = 'ptur' | 'vat-only' | 'full';

export interface DutyWaiverBandRow {
  id: DutyWaiverBand;
  /** Inclusive lower bound (USD goods). null = open floor. */
  fromUsd: number | null;
  /** Exclusive upper bound (USD goods). null = open ceiling. */
  toUsd: number | null;
  titleHe: string;
  detailHe: string;
}

const AMAZON_HOST =
  /(?:^|\.)amazon\.(?:com|co\.uk|de|fr|it|es|ca|com\.au|co\.jp|in|com\.mx|com\.br|nl|se|pl|com\.be|ae|sa|sg|com\.tr)(?:$|:)/i;
const ALIEXPRESS_HOST = /(?:^|\.)aliexpress\.(?:com|us|ru)(?:$|:)/i;

/** Amazon ASIN: 10 chars, starts with B0… or alphanumeric ISBN-like. */
const ASIN_RE = /(?:\/(?:dp|gp\/product|gp\/aw\/d|product)\/)([A-Z0-9]{10})(?:[/?]|$)/i;
/** AliExpress item id in /item/{id}.html or /i/{id}.html */
const AE_ITEM_RE = /\/(?:item|i)\/(\d{6,})(?:\.html)?/i;

const KIT_URL_MAX = 5;

function normalizeUrl(raw: string): URL | null {
  const trimmed = (raw || '').trim();
  if (!trimmed) return null;
  try {
    let candidate = trimmed;
    if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
      // Explicit scheme — only http(s); never rewrite ftp/etc into https://ftp://…
      if (!/^https?:\/\//i.test(trimmed)) return null;
    } else {
      candidate = `https://${trimmed}`;
    }
    const u = new URL(candidate);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    if (!u.hostname || !u.hostname.includes('.')) return null;
    return u;
  } catch {
    return null;
  }
}

function classifyHost(host: string): LandedUrlSource {
  const h = host.toLowerCase();
  if (AMAZON_HOST.test(h)) return 'amazon';
  if (ALIEXPRESS_HOST.test(h)) return 'aliexpress';
  return 'other';
}

/**
 * Parse a pasted product URL for /landed provenance.
 * Returns null for empty / unparseable input (never invents a quote).
 */
export function parseProductUrl(raw: string): ParsedProductUrl | null {
  const u = normalizeUrl(raw);
  if (!u) return null;

  const host = u.hostname.replace(/^www\./i, '').toLowerCase();
  const source = classifyHost(host);
  const pathAndQuery = `${u.pathname}${u.search}`;

  let productId: string | undefined;
  if (source === 'amazon') {
    const m = pathAndQuery.match(ASIN_RE);
    if (m) productId = m[1].toUpperCase();
  } else if (source === 'aliexpress') {
    const m = pathAndQuery.match(AE_ITEM_RE);
    if (m) productId = m[1];
  }

  let canonicalUrl: string | undefined;
  if (source === 'amazon' && productId) {
    canonicalUrl = `https://${host}/dp/${productId}`;
  } else if (source === 'aliexpress' && productId) {
    canonicalUrl = `https://${host}/item/${productId}.html`;
  } else {
    canonicalUrl = `${u.protocol}//${u.host}${u.pathname}`.replace(/\/$/, '') || undefined;
  }

  return { host, source, productId, canonicalUrl };
}

/**
 * Parse a multi-line / comma / whitespace paste of product URLs for /landed kit mode.
 * Returns up to 5 valid parses (Moat: 2–5 Amazon URLs). Blanks and garbage skipped.
 */
export function parseKitUrls(raw: string): ParsedProductUrl[] {
  const parts = String(raw || '')
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const out: ParsedProductUrl[] = [];
  const seen = new Set<string>();
  for (const part of parts) {
    if (out.length >= KIT_URL_MAX) break;
    const p = parseProductUrl(part);
    if (!p) continue;
    const key = (p.canonicalUrl || `${p.host}|${p.productId || ''}`).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}

export interface KitTippingHint {
  /** True when every valid single SKU is under $75 ptur but the kit sum is not. */
  tipped: boolean;
  singleAllPtur: boolean;
  kitDutyFree: boolean | null;
  kitBand: DutyWaiverBand | null;
  skuCount: number;
}

/**
 * Single-SKU miss kit tipping: each line looks ptur on a ProductCard / single quote,
 * but the combined shipment crosses $75 (VAT assessed on the kit, not the line).
 */
export function kitTippingHint(skus: LandedCostInput[]): KitTippingHint {
  const list = skus || [];
  const singles = list
    .map((sku) => estimateLandedCost(sku))
    .filter((est): est is NonNullable<typeof est> => est != null);
  const kit = estimateKitLandedCost(list);
  const skuCount = singles.length;
  if (skuCount < 2 || !kit) {
    return {
      tipped: false,
      singleAllPtur: skuCount > 0 && singles.every((s) => s.dutyFree),
      kitDutyFree: kit ? kit.dutyFree : null,
      kitBand: kit ? classifyDutyWaiverBand(kit.usdPrice) : null,
      skuCount,
    };
  }
  const singleAllPtur = singles.every((s) => s.dutyFree);
  const tipped = singleAllPtur && !kit.dutyFree;
  return {
    tipped,
    singleAllPtur,
    kitDutyFree: kit.dutyFree,
    kitBand: classifyDutyWaiverBand(kit.usdPrice),
    skuCount,
  };
}

export function kitTippingCopyHe(): string {
  return (
    `כל פריט לבד מתחת ל-$${DUTY_FREE_THRESHOLD_USD} (נראה פטור), ` +
    `אבל סכום הערכה חוצה את תקרת הפטור — מע״ם נגבה על המשלוח המשותף, לא על השורה.`
  );
}

/**
 * Classify goods USD value into personal-import bands (Skills IL v1.4.0).
 * Aligns with estimator: under $75 = ptur; $75–<$500 = VAT-only duty waiver.
 * Does not change estimator math (#18/#19/#20).
 */
export function classifyDutyWaiverBand(usdGoods: number): DutyWaiverBand | null {
  const n = Number(usdGoods);
  if (!Number.isFinite(n) || n <= 0) return null;
  if (n < DUTY_FREE_THRESHOLD_USD) return 'ptur';
  if (n < DUTY_WAIVER_CEILING_USD) return 'vat-only';
  return 'full';
}

/**
 * Static band rows for /landed (ptur + VAT-only duty waiver + above-$500 note).
 * Copy only — estimator still omits HS duty / purchase tax above $500.
 */
export function dutyWaiverBandRows(): DutyWaiverBandRow[] {
  const vatPct = Math.round(IL_VAT_RATE * 100);
  const fxPct = (BOI_CUSTOMS_FX_UPLIFT * 100).toFixed(1);
  const ptur = DUTY_FREE_THRESHOLD_USD;
  const ceiling = DUTY_WAIVER_CEILING_USD;
  return [
    {
      id: 'ptur',
      fromUsd: null,
      toUsd: ptur,
      titleHe: `מתחת ל-$${ptur} · פטור מלא (פטור)`,
      detailHe:
        'פטור ממכס וממע״ם על ערך הסחורה בלבד (משלוח לא נספר לתקרה). יבוא אישי רגיל.',
    },
    {
      id: 'vat-only',
      fromUsd: ptur,
      toUsd: ceiling,
      titleHe: `$${ptur}–$${ceiling} · מע״ם בלבד (ויתור מכס)`,
      detailHe:
        `מכס נדחה (duty waiver); משלמים מע״ם ${vatPct}% על סחורה+משלוח. שער רשומון: יציג בנק ישראל + ${fxPct}%.`,
    },
    {
      id: 'full',
      fromUsd: ceiling,
      toUsd: null,
      titleHe: `מעל $${ceiling} · מכס אפשרי לפי HS`,
      detailHe:
        `מע״ם ${vatPct}% חל; מכס / מס קנייה לפי סיווג HS — לא ממודל במחשבון (הערכה שמרנית: מע״ם בלבד).`,
    },
  ];
}

/** Skills IL customs skill version (duty / VAT bands). Still v1.4.0. */
export const SKILLS_IL_CUSTOMS = 'v1.4.0';
/** Skills IL shekel-currency-converter foil version. Still v2.2.0. */
export const SKILLS_IL_SHEKEL = 'v2.2.0';
/** Re-stamp date for customs + shekel honesty foil on /landed. */
export const SKILLS_IL_STAMP_DATE = 'Sep 7';

/**
 * Hebrew customs-stamp copy for /landed
 * (Skills IL customs v1.4.0 + shekel v2.2.0 · Sep 7 foil).
 * Labels 18% VAT + BoI representative +0.5% — explicit "not 17%".
 * Does not change estimator math (#18–#23).
 */
export function customsStampCopyHe(): string {
  return (
    `חותמת מכס (Skills IL customs ${SKILLS_IL_CUSTOMS} + shekel ${SKILLS_IL_SHEKEL} · ${SKILLS_IL_STAMP_DATE}): ` +
    'מע״ם בישראל 18% — לא 17%. שער יציג בנק ישראל + 0.5% לרשומון. ' +
    'פסים: פטור מתחת ל-$75 · $75–$500 מע״ם בלבד (ויתור מכס). ' +
    'יריבים (למשל iWishBag Amazon→IL, עדכון אחרון 2026-04-29) עדיין כותבים "17% VAT" בגוף העמוד בעוד שטבלת המכסים אצלם מציינת 18%.'
  );
}

/**
 * English honesty foil for /landed — explicit vs iWishBag Apr 29 body bug
 * (body "17% VAT" vs duties table 18%). Presentation only; keeps BoI+0.5%
 * FX honesty from #19/#23. Does not change estimator math.
 */
export function israelVat18Not17FoilEn(): string {
  return 'Israel VAT is 18% not 17%.';
}

/**
 * Official Israel Tax Authority (רשות המיסים) Shaar Olami personal-import
 * tax calculator — deep-link for /landed honesty foil. Presentation only;
 * does not change estimator / kit / band math (#18–#22).
 */
export const ITA_SHAAR_OLAMI_CALC_URL =
  'https://shaarolami-query.customs.mof.gov.il/CustomspilotWeb/he/PersonalImportTax/Home/Calc';

/**
 * Hebrew honesty strip: same $75 ptur + $75–$500 VAT-only bands as רשות המיסים
 * (Shaar Olami). Foil for /landed — does not change customs math.
 */
export function itaShaarOlamiFoilStripHe(): string {
  const ptur = DUTY_FREE_THRESHOLD_USD;
  const ceiling = DUTY_WAIVER_CEILING_USD;
  return (
    `אותם פסי יבוא אישי כמו ברשות המיסים (שער עולמי): ` +
    `פטור מתחת ל-$${ptur} · $${ptur}–$${ceiling} מע״ם בלבד (ויתור מכס). ` +
    `אפשר לאמת במחשבון הרשמי של רשות המיסים.`
  );
}

/** Short CTA label for the Shaar Olami deep-link. */
export function itaShaarOlamiLinkLabelHe(): string {
  return 'מחשבון שער עולמי · רשות המיסים';
}

/** iWishBag Amazon US → Israel guide used as honesty foil target. */
export const IWISHBAG_AMAZON_IL_URL =
  'https://www.iwishbag.com/how-to-buy-from/amazon-us/israel';

/** Rival page "Last updated" stamp (still Apr 29 on their live page). */
export const IWISHBAG_PAGE_LAST_UPDATED = '2026-04-29';

/**
 * Re-check stamp: iWishBag body copy still says "17% VAT" while their duties
 * table / reality is 18%. Verified Sep 7 night (after #24). Presentation only.
 */
export const IWISHBAG_BODY_STILL_WRONG_VERIFIED = 'Sep 7 night';

export interface IwishbagSideBySideRow {
  id: string;
  labelEn: string;
  shopliEn: string;
  iwishbagEn: string;
  /** When true, iWishBag cell is the honesty callout (body still wrong). */
  iwishbagWrong?: boolean;
}

/**
 * Side-by-side honesty rows: Shopli /landed vs iWishBag Amazon→IL.
 * Foil: rival body still claims 17% VAT while table/reality is 18%
 * (verified {@link IWISHBAG_BODY_STILL_WRONG_VERIFIED}). Does not change
 * estimator / kit / band math (#18–#24).
 */
export function iwishbagSideBySideRows(): IwishbagSideBySideRow[] {
  return [
    {
      id: 'body-vat',
      labelEn: 'Body VAT claim',
      shopliEn: '18% (correct)',
      iwishbagEn: '17% — body still wrong',
      iwishbagWrong: true,
    },
    {
      id: 'table-vat',
      labelEn: 'Duties table / reality',
      shopliEn: '18%',
      iwishbagEn: '18%',
    },
    {
      id: 'paste-url',
      labelEn: 'Paste Amazon/product URL → IL quote',
      shopliEn: '/landed (free estimator)',
      iwishbagEn: 'Buy & Ship quote form',
    },
    {
      id: 'boi-fx',
      labelEn: 'BoI representative +0.5% FX',
      shopliEn: 'Labeled (rashimon)',
      iwishbagEn: 'Not labeled',
    },
    {
      id: 'last-updated',
      labelEn: 'Last updated / verified',
      shopliEn: `Skills IL · ${SKILLS_IL_STAMP_DATE}`,
      iwishbagEn: `${IWISHBAG_PAGE_LAST_UPDATED} (page) · body still wrong as of ${IWISHBAG_BODY_STILL_WRONG_VERIFIED}`,
      iwishbagWrong: true,
    },
  ];
}

/**
 * English headline for the side-by-side foil — 「17% body still wrong」.
 * Keeps #24 "Israel VAT is 18% not 17%." as a sibling string.
 */
export function iwishbagBodyStillWrongHeadlineEn(): string {
  return (
    `iWishBag body still wrong: "17% VAT" (table/reality 18%) · ` +
    `verified ${IWISHBAG_BODY_STILL_WRONG_VERIFIED}`
  );
}

/** Short Hebrew intro above the side-by-side panel. */
export function iwishbagSideBySideIntroHe(): string {
  return (
    `השוואה ליריב (iWishBag Amazon→IL): בגוף העמוד שלהם עדיין כתוב "17% VAT" ` +
    `בעוד שטבלת המכסים / המציאות הן 18% — אומת ${IWISHBAG_BODY_STILL_WRONG_VERIFIED} ` +
    `(עדכון אחרון אצלם ${IWISHBAG_PAGE_LAST_UPDATED}). שופלי מציגה מע״ם 18% + BoI+0.5%.`
  );
}

/** Marketplace how-to pages that reuse the iWishBag 「17% body still wrong」 foil. */
export type MarketplaceHowToId = 'etsy' | 'ebay' | 'walmart' | 'aliexpress' | 'amazonjp';

export interface MarketplaceHowToSpec {
  id: MarketplaceHowToId;
  nameEn: string;
  /** Shopli path, e.g. /how-to-etsy-israel */
  path: string;
  /** Rival iWishBag how-to-buy-from guide (same Apr-29 body bug). */
  iwishbagUrl: string;
}

/** iWishBag Etsy → Israel guide (same 17% body / 18% table foil as Amazon). */
export const IWISHBAG_ETSY_IL_URL =
  'https://www.iwishbag.com/how-to-buy-from/etsy/israel';

/** iWishBag eBay → Israel guide. */
export const IWISHBAG_EBAY_IL_URL =
  'https://www.iwishbag.com/how-to-buy-from/ebay/israel';

/** iWishBag Walmart → Israel guide. */
export const IWISHBAG_WALMART_IL_URL =
  'https://www.iwishbag.com/how-to-buy-from/walmart/israel';

/** iWishBag AliExpress → Israel guide (same 17% body / 18% table foil). */
export const IWISHBAG_ALIEXPRESS_IL_URL =
  'https://www.iwishbag.com/how-to-buy-from/aliexpress/israel';

/** iWishBag Amazon Japan → Israel guide. */
export const IWISHBAG_AMAZONJP_IL_URL =
  'https://www.iwishbag.com/how-to-buy-from/amazon-japan/israel';

/**
 * Lean marketplace→IL how-to catalog (Etsy / eBay / Walmart / AliExpress / Amazon JP).
 * Presentation / SEO foil only — estimator math unchanged (#18–#26).
 */
export const MARKETPLACE_HOW_TOS: readonly MarketplaceHowToSpec[] = [
  {
    id: 'etsy',
    nameEn: 'Etsy',
    path: '/how-to-etsy-israel',
    iwishbagUrl: IWISHBAG_ETSY_IL_URL,
  },
  {
    id: 'ebay',
    nameEn: 'eBay',
    path: '/how-to-ebay-israel',
    iwishbagUrl: IWISHBAG_EBAY_IL_URL,
  },
  {
    id: 'walmart',
    nameEn: 'Walmart',
    path: '/how-to-walmart-israel',
    iwishbagUrl: IWISHBAG_WALMART_IL_URL,
  },
  {
    id: 'aliexpress',
    nameEn: 'AliExpress',
    path: '/how-to-aliexpress-israel',
    iwishbagUrl: IWISHBAG_ALIEXPRESS_IL_URL,
  },
  {
    id: 'amazonjp',
    nameEn: 'Amazon JP',
    path: '/how-to-amazonjp-israel',
    iwishbagUrl: IWISHBAG_AMAZONJP_IL_URL,
  },
] as const;

export function getMarketplaceHowTo(id: MarketplaceHowToId): MarketplaceHowToSpec {
  const found = MARKETPLACE_HOW_TOS.find((m) => m.id === id);
  if (!found) throw new Error(`unknown marketplace how-to: ${id}`);
  return found;
}

/**
 * Side-by-side rows for a marketplace how-to — same 「17% body still wrong」
 * foil as {@link iwishbagSideBySideRows}, with paste-URL claim scoped to the
 * marketplace. Presentation only.
 */
export function iwishbagMarketplaceSideBySideRows(
  marketplace: MarketplaceHowToId,
): IwishbagSideBySideRow[] {
  const spec = getMarketplaceHowTo(marketplace);
  return iwishbagSideBySideRows().map((row) => {
    if (row.id !== 'paste-url') return row;
    return {
      ...row,
      labelEn: `Paste ${spec.nameEn}/product URL → IL quote`,
      shopliEn: `/landed (free estimator) · ${spec.path}`,
      iwishbagEn: 'Buy & Ship quote form',
    };
  });
}

/** English intro line for marketplace how-to foil panels. */
export function iwishbagMarketplaceFoilIntroEn(marketplace: MarketplaceHowToId): string {
  const spec = getMarketplaceHowTo(marketplace);
  return (
    `Same Apr-29 iWishBag body bug on ${spec.nameEn}→IL: still says "17% VAT" ` +
    `while duties table / reality is 18% (verified ${IWISHBAG_BODY_STILL_WRONG_VERIFIED}). ` +
    `Shopli: ${israelVat18Not17FoilEn()} Paste URL → /landed.`
  );
}
