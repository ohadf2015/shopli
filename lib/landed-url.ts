/**
 * Product-URL parser + duty-waiver band copy for /landed
 * (paste Amazon / AliExpress / any URL → IL quote).
 * Provenance only — no live scraping. Quote math stays in lib/landed-cost.ts (#14/#18/#19/#20).
 * Kit paste (2–5 URLs) + single-SKU miss tipping: Moat after #21.
 * ITA Shaar Olami calculator foil (#23): deep-link honesty strip — presentation only.
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
