/**
 * Product-URL parser + duty-waiver band copy for /landed
 * (paste Amazon / AliExpress / any URL → IL quote).
 * Provenance only — no live scraping. Quote math stays in lib/landed-cost.ts (#14/#18/#19/#20).
 * Kit paste (2–5 URLs) + single-SKU miss tipping: Moat after #21.
 * ITA Shaar Olami calculator foil (#23): deep-link honesty strip — presentation only.
 * #24: explicit 18% not 17% foil. #25: side-by-side iWishBag 「17% body still wrong」
 * (verified Sep 7 night). #26: Etsy/eBay/Walmart→IL how-tos. #27: AliExpress +
 * Amazon JP→IL how-tos. #28: compare above-fold (kept). #29: Shein + Temu→IL
 * how-tos (kept). #30: Flipkart→IL (kept). #34: Amazon US→IL (kept).
 * #36: Amazon India→IL how-to (kept). #38: DutyDecoder /israel stale 17%
 * foil (kept). #39: Gateway Lines tariff 「מע״מ(17%)」 foil (kept).
 * Noon moat 2026-09-15 #2: durable VAT-truth moat — Tax Authority 18% cite
 * + last-checked stamp + live 「competitors still 17%」 proof row
 * (Gateway Lines still wrong post-#39) (kept as #40). Moat 2026-09-15 14:15 #3:
 * iWishBag Flipkart+Etsy→IL body 「17% VAT」 vs own duties table Standard
 * VAT/GST 18% self-contradiction strip on /landed (Last updated 2026-04-29
 * still live) (kept as #41). Moat 2026-09-15 16:35 #2: iWishBag
 * AliExpress+Walmart+eBay→IL body 「17% VAT」 vs own duties table Standard
 * VAT/GST 18% self-contradiction strip on /landed (Last updated 2026-04-29
 * still live). Distinct from Flipkart+Etsy #41 / Tax Authority #40 / Gateway #39 /
 * Amazon US/India (kept as #42). Moat 2026-09-21 16:30 #7: personal-import
 * threshold-churn honesty strip — official $75 ptur + documented 2026
 * $75↔$130 flip-flops (Skills IL / OpenAccountants) + last-checked stamp.
 * 「17% body still wrong」 is secondary cite only — do not redo #41/#42 as primary.
 * Presentation only; estimator math unchanged. Keep #19–#42;
 * Skills IL Sep 7 still v1.4.0 + BoI+0.5% (context only).
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
export type MarketplaceHowToId = 'etsy' | 'ebay' | 'walmart' | 'aliexpress' | 'amazonjp' | 'shein' | 'temu' | 'flipkart' | 'amazonus' | 'amazonindia';

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

/** iWishBag Shein → Israel guide (same 17% body / 18% table foil template). */
export const IWISHBAG_SHEIN_IL_URL =
  'https://www.iwishbag.com/how-to-buy-from/shein/israel';

/** iWishBag Temu → Israel guide (same 17% body / 18% table foil template). */
export const IWISHBAG_TEMU_IL_URL =
  'https://www.iwishbag.com/how-to-buy-from/temu/israel';

/** iWishBag Flipkart → Israel guide (same 17% body / 18% table foil template). */
export const IWISHBAG_FLIPKART_IL_URL =
  'https://www.iwishbag.com/how-to-buy-from/flipkart/israel';

/** iWishBag Amazon India → Israel guide (same 17% body / 18% table foil as Amazon US). */
export const IWISHBAG_AMAZONINDIA_IL_URL =
  'https://www.iwishbag.com/how-to-buy-from/amazon-india/israel';

/**
 * Lean marketplace→IL how-to catalog (Etsy / eBay / Walmart / AliExpress /
 * Amazon JP / Shein / Temu / Flipkart / Amazon US / Amazon India). Presentation /
 * SEO foil only — estimator math unchanged (#18–#34). Moat: dedicated Amazon
 * India (same Apr-29 body bug as Amazon US #34; JP was #27 only).
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
  {
    id: 'shein',
    nameEn: 'Shein',
    path: '/how-to-shein-israel',
    iwishbagUrl: IWISHBAG_SHEIN_IL_URL,
  },
  {
    id: 'temu',
    nameEn: 'Temu',
    path: '/how-to-temu-israel',
    iwishbagUrl: IWISHBAG_TEMU_IL_URL,
  },
  {
    id: 'flipkart',
    nameEn: 'Flipkart',
    path: '/how-to-flipkart-israel',
    iwishbagUrl: IWISHBAG_FLIPKART_IL_URL,
  },
  {
    id: 'amazonus',
    nameEn: 'Amazon US',
    path: '/how-to-amazonus-israel',
    iwishbagUrl: IWISHBAG_AMAZON_IL_URL,
  },
  {
    id: 'amazonindia',
    nameEn: 'Amazon India',
    path: '/how-to-amazonindia-israel',
    iwishbagUrl: IWISHBAG_AMAZONINDIA_IL_URL,
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

/** DutyDecoder Israel guide used as honesty foil target (stale 17% VAT). */
export const DUTYDECODER_IL_URL = 'https://dutydecoder.com/israel';

/**
 * Re-check stamp: DutyDecoder /israel still shows VAT Rate 17% in the hero
 * badge + body/FAQ ("standard VAT rate is 17%") while Israel reality /
 * gov.il is 18% (raised 2025-01-01). Verified Sep 15 (moat 2026-09-15 #6).
 * Presentation only — does not change estimator math.
 */
export const DUTYDECODER_STALE_17_VERIFIED = 'Sep 15';

export interface DutyDecoderSideBySideRow {
  id: string;
  labelEn: string;
  shopliEn: string;
  dutyDecoderEn: string;
  /** When true, DutyDecoder cell is the honesty callout (still 17%). */
  dutyDecoderWrong?: boolean;
}

/**
 * Side-by-side honesty rows: Shopli /landed vs DutyDecoder /israel.
 * Foil: rival still claims 17% VAT everywhere (badge + body + FAQ) while
 * reality is 18% (verified {@link DUTYDECODER_STALE_17_VERIFIED}). Does not
 * change estimator / kit / band math (#18–#36).
 */
export function dutyDecoderSideBySideRows(): DutyDecoderSideBySideRow[] {
  return [
    {
      id: 'badge-vat',
      labelEn: 'VAT Rate badge / claim',
      shopliEn: '18% (correct)',
      dutyDecoderEn: '17% — still wrong',
      dutyDecoderWrong: true,
    },
    {
      id: 'body-vat',
      labelEn: 'Body / FAQ VAT',
      shopliEn: '18%',
      dutyDecoderEn: '17% — "standard VAT rate is 17%"',
      dutyDecoderWrong: true,
    },
    {
      id: 'reality',
      labelEn: 'Israel reality / gov.il',
      shopliEn: '18% (since 2025-01-01)',
      dutyDecoderEn: '18% (they still publish 17%)',
    },
    {
      id: 'paste-url',
      labelEn: 'Paste Amazon/product URL → IL quote',
      shopliEn: '/landed (free estimator)',
      dutyDecoderEn: 'HS / duty calculator (stale VAT)',
    },
    {
      id: 'last-verified',
      labelEn: 'Last verified',
      shopliEn: `Skills IL · ${SKILLS_IL_STAMP_DATE}`,
      dutyDecoderEn: `Still 17% as of ${DUTYDECODER_STALE_17_VERIFIED}`,
      dutyDecoderWrong: true,
    },
  ];
}

/**
 * English headline for the DutyDecoder foil — stale 17% vs real 18%.
 * Keeps #24 "Israel VAT is 18% not 17%." as a sibling string.
 */
export function dutyDecoderStale17HeadlineEn(): string {
  return (
    `DutyDecoder still wrong: "17% VAT" on dutydecoder.com/israel ` +
    `(reality 18%) · verified ${DUTYDECODER_STALE_17_VERIFIED}`
  );
}

/** Short Hebrew intro above the DutyDecoder side-by-side panel. */
export function dutyDecoderSideBySideIntroHe(): string {
  return (
    `השוואה ליריב (DutyDecoder /israel): עדיין מציגים "17% VAT" בתג ובגוף/FAQ ` +
    `בעוד שבמציאות / gov.il המע״ם הוא 18% — אומת ${DUTYDECODER_STALE_17_VERIFIED}. ` +
    `שופלי מציגה מע״ם 18% + BoI+0.5%.`
  );
}

/** Gateway Lines Israel tariff calculator used as honesty foil (stale 17% VAT). */
export const GATEWAYLINES_TARIFF_URL =
  'https://tariff.gatewaylines.co.il/tariff-calculator';

/**
 * Re-check stamp: Gateway Lines tariff calculator still shows breakdown
 * label 「מע״מ(17%)」 and methodology 「מע״מ 17% על הערך הכולל」 while Israel
 * reality / gov.il is 18% (raised 2025-01-01). Live quote verified Sep 15
 * (moat 2026-09-15 10:25 #2). Presentation only — does not change estimator math.
 */
export const GATEWAYLINES_STALE_17_VERIFIED = 'Sep 15';

/** Exact live breakdown label quoted from the rival calculator. */
export const GATEWAYLINES_VAT_LABEL_QUOTE = 'מע״מ(17%)';

export interface GatewayLinesSideBySideRow {
  id: string;
  labelEn: string;
  shopliEn: string;
  gatewayLinesEn: string;
  /** When true, Gateway Lines cell is the honesty callout (still 17%). */
  gatewayLinesWrong?: boolean;
}

/**
 * Side-by-side honesty rows: Shopli /landed vs Gateway Lines tariff calculator.
 * Foil: rival still claims מע״מ(17%) on the live calculator + methodology
 * while reality is 18% (verified {@link GATEWAYLINES_STALE_17_VERIFIED}).
 * Does not change estimator / kit / band math (#18–#38). iWishBag lanes
 * already covered — Gateway Lines specifically.
 */
export function gatewayLinesSideBySideRows(): GatewayLinesSideBySideRow[] {
  return [
    {
      id: 'breakdown-vat',
      labelEn: 'Calculator VAT breakdown label',
      shopliEn: '18% (correct)',
      gatewayLinesEn: 'מע״מ(17%) — still wrong',
      gatewayLinesWrong: true,
    },
    {
      id: 'methodology-vat',
      labelEn: 'Methodology / how-we-calculate',
      shopliEn: '18% + BoI+0.5%',
      gatewayLinesEn: 'מע״מ 17% על הערך הכולל',
      gatewayLinesWrong: true,
    },
    {
      id: 'reality',
      labelEn: 'Israel reality / gov.il',
      shopliEn: '18% (since 2025-01-01)',
      gatewayLinesEn: '18% (they still publish 17%)',
    },
    {
      id: 'paste-url',
      labelEn: 'Paste Amazon/product URL → IL quote',
      shopliEn: '/landed (free estimator)',
      gatewayLinesEn: 'HS / tariff calculator (stale VAT)',
    },
    {
      id: 'last-verified',
      labelEn: 'Last verified',
      shopliEn: `Skills IL · ${SKILLS_IL_STAMP_DATE}`,
      gatewayLinesEn: `Still מע״מ(17%) as of ${GATEWAYLINES_STALE_17_VERIFIED}`,
      gatewayLinesWrong: true,
    },
  ];
}

/**
 * English headline for the Gateway Lines foil — stale מע״מ(17%) vs real 18%.
 * Keeps #24 "Israel VAT is 18% not 17%." as a sibling string.
 */
export function gatewayLinesStale17HeadlineEn(): string {
  return (
    `Gateway Lines still wrong: "מע״מ(17%)" on tariff.gatewaylines.co.il ` +
    `(reality 18% · Shopli 18% + BoI+0.5%) · verified ${GATEWAYLINES_STALE_17_VERIFIED}`
  );
}

/** Short Hebrew intro above the Gateway Lines side-by-side panel. */
export function gatewayLinesSideBySideIntroHe(): string {
  return (
    `השוואה ליריב (Gateway Lines מחשבון תעריף): עדיין מציגים "מע״מ(17%)" בפירוט ` +
    `ו־"מע״מ 17% על הערך הכולל" במתודולוגיה בעוד שבמציאות / gov.il המע״ם הוא 18% — ` +
    `אומת ${GATEWAYLINES_STALE_17_VERIFIED}. שופלי מציגה מע״ם 18% + BoI+0.5%.`
  );
}

/**
 * Official Israel Tax Authority (רשות המיסים) VAT topic on gov.il —
 * durable cite that standard VAT is 18% (since 2025-01-01). Presentation
 * only; does not change estimator / kit / band math (#18–#39).
 */
export const TAX_AUTHORITY_VAT_CITE_URL =
  'https://www.gov.il/he/departments/topics/vat/govil-landing-page';

/** Standard VAT rate percent per Tax Authority / law (raised 2025-01-01). */
export const TAX_AUTHORITY_VAT_RATE_PCT = 18;

/**
 * Durable VAT-truth last-checked stamp (noon moat 2026-09-15 #2, after #39
 * Gateway Lines foil). Live re-check: rivals still publish 17%.
 */
export const VAT_TRUTH_LAST_CHECKED = '2026-09-15 noon';

export interface VatTruthCompetitorProofRow {
  id: string;
  competitorEn: string;
  /** Live stale claim (still 17%). */
  claimEn: string;
  liveUrl: string;
  /** When true, competitor cell is the honesty callout. */
  stillWrong: boolean;
}

/**
 * Live 「competitors still 17%」 proof rows for the durable VAT-truth moat.
 * Gateway Lines re-checked post-#39 still wrong; DutyDecoder + iWishBag
 * kept. Does not change estimator math.
 */
export function vatTruthCompetitorsStill17ProofRows(): VatTruthCompetitorProofRow[] {
  return [
    {
      id: 'gatewaylines',
      competitorEn: 'Gateway Lines tariff calculator',
      claimEn: 'מע״מ(17%) — still wrong post-#39',
      liveUrl: GATEWAYLINES_TARIFF_URL,
      stillWrong: true,
    },
    {
      id: 'dutydecoder',
      competitorEn: 'DutyDecoder /israel',
      claimEn: '17% VAT — still wrong',
      liveUrl: DUTYDECODER_IL_URL,
      stillWrong: true,
    },
    {
      id: 'iwishbag',
      competitorEn: 'iWishBag Amazon→IL body',
      claimEn: '17% VAT body — still wrong',
      liveUrl: IWISHBAG_AMAZON_IL_URL,
      stillWrong: true,
    },
  ];
}

/** English Tax Authority 18% cite line for /landed VAT-truth panel. */
export function taxAuthorityVat18CiteEn(): string {
  return (
    `Tax Authority (רשות המיסים) cite: standard VAT is ${TAX_AUTHORITY_VAT_RATE_PCT}% ` +
    `since 2025-01-01.`
  );
}

/** English last-checked stamp for the durable VAT-truth moat. */
export function vatTruthLastCheckedStampEn(): string {
  return `Last checked: ${VAT_TRUTH_LAST_CHECKED}`;
}

/**
 * English headline for the durable VAT-truth moat — Tax Authority 18% cite
 * + competitors still 17% (Gateway Lines still wrong post-#39).
 */
export function vatTruthHeadlineEn(): string {
  return (
    `VAT truth: Tax Authority ${TAX_AUTHORITY_VAT_RATE_PCT}% cite · ` +
    `competitors still 17% (Gateway Lines still wrong post-#39) · ` +
    `last checked ${VAT_TRUTH_LAST_CHECKED}`
  );
}

/** Short Hebrew intro above the VAT-truth proof panel. */
export function vatTruthIntroHe(): string {
  return (
    `אמת מע״ם: רשות המיסים / gov.il — ${TAX_AUTHORITY_VAT_RATE_PCT}% מאז 2025-01-01. ` +
    `יריבים עדיין מפרסמים 17% (Gateway Lines עדיין שגוי אחרי #39). ` +
    `נבדק לאחרונה ${VAT_TRUTH_LAST_CHECKED}. שופלי: מע״ם 18% + BoI+0.5%.`
  );
}

/**
 * Moat 2026-09-15 14:15 #3: iWishBag Flipkart+Etsy→IL still self-contradict —
 * body 「17% VAT」 (customs blurb + FAQ citing gov.il) vs own duties table
 * 「Standard VAT/GST 18%」, Last updated 2026-04-29 still live. Distinct from
 * Tax Authority cite #40 / Gateway Lines #39 / Amazon US side-by-side #25.
 * Presentation only — does not change estimator / kit / band math (#18–#41).
 */
export const IWISHBAG_FLIPKART_ETSY_SELF_CONTRADICTION_VERIFIED = '2026-09-15 14:15';

/** Live body quote still wrong on Flipkart+Etsy→IL how-tos. */
export const IWISHBAG_BODY_17_VAT_QUOTE =
  'Israel applies customs duty plus 17% VAT';

/** Own duties-table claim that contradicts the body (same pages). */
export const IWISHBAG_OWN_TABLE_18_VAT_QUOTE = 'Standard VAT/GST 18%';

export interface IwishbagFlipkartEtsySelfContradictionRow {
  id: string;
  labelEn: string;
  shopliEn: string;
  iwishbagEn: string;
  /** When true, iWishBag cell is the honesty callout (self-contradiction). */
  iwishbagWrong?: boolean;
  /** Optional live proof URL (Flipkart or Etsy lane). */
  liveUrl?: string;
}

/**
 * Side-by-side honesty rows: Shopli /landed vs iWishBag Flipkart+Etsy→IL.
 * Foil: same pages claim body 「17% VAT」 and table 「Standard VAT/GST 18%」
 * while Last updated {@link IWISHBAG_PAGE_LAST_UPDATED} is still live
 * (verified {@link IWISHBAG_FLIPKART_ETSY_SELF_CONTRADICTION_VERIFIED}).
 * Does not change estimator math.
 */
export function iwishbagFlipkartEtsySelfContradictionRows(): IwishbagFlipkartEtsySelfContradictionRow[] {
  return [
    {
      id: 'body-vat',
      labelEn: 'Body / customs blurb + FAQ',
      shopliEn: '18% (correct)',
      iwishbagEn: `${IWISHBAG_BODY_17_VAT_QUOTE} — still wrong`,
      iwishbagWrong: true,
    },
    {
      id: 'own-table-vat',
      labelEn: 'Own duties table (same page)',
      shopliEn: '18%',
      iwishbagEn: IWISHBAG_OWN_TABLE_18_VAT_QUOTE,
    },
    {
      id: 'self-contradiction',
      labelEn: 'Self-contradiction',
      shopliEn: 'None — single 18% story',
      iwishbagEn: 'Body 17% vs own table 18%',
      iwishbagWrong: true,
    },
    {
      id: 'flipkart-lane',
      labelEn: 'Flipkart→IL how-to',
      shopliEn: '/how-to-flipkart-israel · paste → /landed',
      iwishbagEn: 'Body 17% + table 18% · Last updated still Apr 29',
      iwishbagWrong: true,
      liveUrl: IWISHBAG_FLIPKART_IL_URL,
    },
    {
      id: 'etsy-lane',
      labelEn: 'Etsy→IL how-to',
      shopliEn: '/how-to-etsy-israel · paste → /landed',
      iwishbagEn: 'Body 17% + table 18% · Last updated still Apr 29',
      iwishbagWrong: true,
      liveUrl: IWISHBAG_ETSY_IL_URL,
    },
    {
      id: 'last-updated',
      labelEn: 'Last updated / verified',
      shopliEn: `Skills IL · ${SKILLS_IL_STAMP_DATE}`,
      iwishbagEn: `${IWISHBAG_PAGE_LAST_UPDATED} (page) · self-contradiction live as of ${IWISHBAG_FLIPKART_ETSY_SELF_CONTRADICTION_VERIFIED}`,
      iwishbagWrong: true,
    },
  ];
}

/**
 * English headline for the Flipkart+Etsy self-contradiction strip —
 * body 「17% VAT」 vs own table 18% (Last updated 2026-04-29 still live).
 */
export function iwishbagFlipkartEtsySelfContradictionHeadlineEn(): string {
  return (
    `iWishBag Flipkart+Etsy→IL self-contradiction: body 「17% VAT」 vs own ` +
    `table 「${IWISHBAG_OWN_TABLE_18_VAT_QUOTE}」 · Last updated ${IWISHBAG_PAGE_LAST_UPDATED} ` +
    `still live · verified ${IWISHBAG_FLIPKART_ETSY_SELF_CONTRADICTION_VERIFIED}`
  );
}

/** Short Hebrew intro above the Flipkart+Etsy self-contradiction strip. */
export function iwishbagFlipkartEtsySelfContradictionIntroHe(): string {
  return (
    `סתירה פנימית אצל iWishBag (Flipkart+Etsy→IL): בגוף העמוד/מכס/FAQ עדיין ` +
    `"17% VAT" בעוד שטבלת המכסים באותו עמוד מציינת Standard VAT/GST 18% — ` +
    `עדכון אחרון אצלם ${IWISHBAG_PAGE_LAST_UPDATED} עדיין חי. ` +
    `אומת ${IWISHBAG_FLIPKART_ETSY_SELF_CONTRADICTION_VERIFIED}. שופלי: מע״ם 18% + BoI+0.5%.`
  );
}

/**
 * Moat 2026-09-15 16:35 #2: iWishBag AliExpress+Walmart+eBay→IL still
 * self-contradict — body 「17% VAT」 (customs blurb + FAQ citing gov.il) vs own
 * duties table 「Standard VAT/GST 18%」, Last updated 2026-04-29 still live.
 * Distinct from Flipkart+Etsy #41 / Tax Authority cite #40 / Gateway Lines #39 /
 * Amazon US side-by-side #25 / Amazon India #36.
 * Presentation only — does not change estimator / kit / band math (#18–#41).
 */
export const IWISHBAG_ALIEXPRESS_WALMART_EBAY_SELF_CONTRADICTION_VERIFIED =
  '2026-09-15 16:35';

export interface IwishbagAliexpressWalmartEbaySelfContradictionRow {
  id: string;
  labelEn: string;
  shopliEn: string;
  iwishbagEn: string;
  /** When true, iWishBag cell is the honesty callout (self-contradiction). */
  iwishbagWrong?: boolean;
  /** Optional live proof URL (AliExpress / Walmart / eBay lane). */
  liveUrl?: string;
}

/**
 * Side-by-side honesty rows: Shopli /landed vs iWishBag AliExpress+Walmart+eBay→IL.
 * Foil: same pages claim body 「17% VAT」 and table 「Standard VAT/GST 18%」
 * while Last updated {@link IWISHBAG_PAGE_LAST_UPDATED} is still live
 * (verified {@link IWISHBAG_ALIEXPRESS_WALMART_EBAY_SELF_CONTRADICTION_VERIFIED}).
 * Does not change estimator math. Distinct from Flipkart+Etsy #41.
 */
export function iwishbagAliexpressWalmartEbaySelfContradictionRows(): IwishbagAliexpressWalmartEbaySelfContradictionRow[] {
  return [
    {
      id: 'body-vat',
      labelEn: 'Body / customs blurb + FAQ',
      shopliEn: '18% (correct)',
      iwishbagEn: `${IWISHBAG_BODY_17_VAT_QUOTE} — still wrong`,
      iwishbagWrong: true,
    },
    {
      id: 'own-table-vat',
      labelEn: 'Own duties table (same page)',
      shopliEn: '18%',
      iwishbagEn: IWISHBAG_OWN_TABLE_18_VAT_QUOTE,
    },
    {
      id: 'self-contradiction',
      labelEn: 'Self-contradiction',
      shopliEn: 'None — single 18% story',
      iwishbagEn: 'Body 17% vs own table 18%',
      iwishbagWrong: true,
    },
    {
      id: 'aliexpress-lane',
      labelEn: 'AliExpress→IL how-to',
      shopliEn: '/how-to-aliexpress-israel · paste → /landed',
      iwishbagEn: 'Body 17% + table 18% · Last updated still Apr 29',
      iwishbagWrong: true,
      liveUrl: IWISHBAG_ALIEXPRESS_IL_URL,
    },
    {
      id: 'walmart-lane',
      labelEn: 'Walmart→IL how-to',
      shopliEn: '/how-to-walmart-israel · paste → /landed',
      iwishbagEn: 'Body 17% + table 18% · Last updated still Apr 29',
      iwishbagWrong: true,
      liveUrl: IWISHBAG_WALMART_IL_URL,
    },
    {
      id: 'ebay-lane',
      labelEn: 'eBay→IL how-to',
      shopliEn: '/how-to-ebay-israel · paste → /landed',
      iwishbagEn: 'Body 17% + table 18% · Last updated still Apr 29',
      iwishbagWrong: true,
      liveUrl: IWISHBAG_EBAY_IL_URL,
    },
    {
      id: 'last-updated',
      labelEn: 'Last updated / verified',
      shopliEn: `Skills IL · ${SKILLS_IL_STAMP_DATE}`,
      iwishbagEn: `${IWISHBAG_PAGE_LAST_UPDATED} (page) · self-contradiction live as of ${IWISHBAG_ALIEXPRESS_WALMART_EBAY_SELF_CONTRADICTION_VERIFIED}`,
      iwishbagWrong: true,
    },
  ];
}

/**
 * English headline for the AliExpress+Walmart+eBay self-contradiction strip —
 * body 「17% VAT」 vs own table 18% (Last updated 2026-04-29 still live).
 */
export function iwishbagAliexpressWalmartEbaySelfContradictionHeadlineEn(): string {
  return (
    `iWishBag AliExpress+Walmart+eBay→IL self-contradiction: body 「17% VAT」 vs own ` +
    `table 「${IWISHBAG_OWN_TABLE_18_VAT_QUOTE}」 · Last updated ${IWISHBAG_PAGE_LAST_UPDATED} ` +
    `still live · verified ${IWISHBAG_ALIEXPRESS_WALMART_EBAY_SELF_CONTRADICTION_VERIFIED}`
  );
}

/** Short Hebrew intro above the AliExpress+Walmart+eBay self-contradiction strip. */
export function iwishbagAliexpressWalmartEbaySelfContradictionIntroHe(): string {
  return (
    `סתירה פנימית אצל iWishBag (AliExpress+Walmart+eBay→IL): בגוף העמוד/מכס/FAQ עדיין ` +
    `"17% VAT" בעוד שטבלת המכסים באותו עמוד מציינת Standard VAT/GST 18% — ` +
    `עדכון אחרון אצלם ${IWISHBAG_PAGE_LAST_UPDATED} עדיין חי. ` +
    `אומת ${IWISHBAG_ALIEXPRESS_WALMART_EBAY_SELF_CONTRADICTION_VERIFIED}. שופלי: מע״ם 18% + BoI+0.5%.`
  );
}


/**
 * Moat 2026-09-21 16:30 #7: personal-import threshold-churn honesty strip.
 * Official ptur is USD $75 (goods-only). Skills IL + OpenAccountants document
 * the 2026 $75↔$130 flip-flops (Skills IL: four moves in seven months — Dec 2025
 * $75→$150, Knesset revoke 24 Feb 2026 →$75, next-day order →$130, window ran
 * to 1 Jun 2026 →$75 again; OpenAccountants: Smotrich $150 Nov 2025, Knesset
 * revoke 24 Feb 2026 →$75, verify-before-use). Presentation only — estimator
 * still uses {@link DUTY_FREE_THRESHOLD_USD} = 75. Do NOT redo Flipkart+Etsy #41 /
 * AliExpress+Walmart+eBay #42 as primary; 「17% body still wrong」 is a secondary
 * cite only.
 */
export const PTUR_THRESHOLD_CHURN_LAST_CHECKED = '2026-09-21 16:30';

/** Official personal-import full-exemption threshold (USD) — current law / estimator. */
export const PTUR_OFFICIAL_USD = DUTY_FREE_THRESHOLD_USD;

/** Documented temporary $130 window (Skills IL: expired 1 June 2026). */
export const PTUR_CHURN_130_USD = 130;

/** Skills IL israeli-customs-duty-calculator (documents $75↔$130 churn). */
export const SKILLS_IL_CUSTOMS_CALC_URL =
  'https://agentskills.co.il/en/skills/tax-and-finance/israeli-customs-duty-calculator';

/** OpenAccountants IL Customs Duty skill (documents $150↔$75 + verify-before-use). */
export const OPENACCOUNTANTS_IL_CUSTOMS_URL =
  'https://www.openaccountants.com/skills/il-customs-duty';

/** Official gov.il personal-import tax calculator (verify live threshold). */
export const GOV_IL_PERSONAL_IMPORT_CALC_URL =
  'https://www.gov.il/en/service/customs-tax-calculation-import-by-israelis';

export interface PturThresholdChurnRow {
  id: string;
  labelEn: string;
  detailEn: string;
  /** Optional live proof URL. */
  liveUrl?: string;
  /** When true, row is a churn / verify callout. */
  churnCallout?: boolean;
}

/**
 * Honesty rows for the personal-import threshold-churn strip: official $75
 * ptur + documented 2026 $75↔$130 flip-flops (Skills IL / OpenAccountants) +
 * last-checked stamp. Secondary: body-still-17% cite only (not Flipkart/Etsy
 * #41 or AliExpress/Walmart/eBay #42 as primary).
 */
export function pturThresholdChurnRows(): PturThresholdChurnRow[] {
  return [
    {
      id: 'official-ptur',
      labelEn: 'Official ptur (current)',
      detailEn: `USD $${PTUR_OFFICIAL_USD} goods-only · Shopli estimator + gov.il`,
    },
    {
      id: 'skills-il-churn',
      labelEn: 'Skills IL documented churn',
      detailEn:
        `$75→$150 (Dec 2025) →$75 (Knesset 24 Feb 2026) →$130 (next-day order) →$75 (window ended 1 Jun 2026)`,
      liveUrl: SKILLS_IL_CUSTOMS_CALC_URL,
      churnCallout: true,
    },
    {
      id: 'openaccountants-churn',
      labelEn: 'OpenAccountants documented churn',
      detailEn:
        `Smotrich $150 (Nov 2025) revoked 24 Feb 2026 →$75 · "verify before use" (as of May 2026)`,
      liveUrl: OPENACCOUNTANTS_IL_CUSTOMS_URL,
      churnCallout: true,
    },
    {
      id: 'shopli-stance',
      labelEn: 'Shopli /landed stance',
      detailEn: `Honest $${PTUR_OFFICIAL_USD} ptur · $${PTUR_OFFICIAL_USD}–$${DUTY_WAIVER_CEILING_USD} VAT-only · last-checked stamp`,
    },
    {
      id: 'body-still-17-secondary',
      labelEn: 'Secondary cite only',
      detailEn: `「17% body still wrong」 (#24 / #41 / #42) — secondary; this strip is ptur threshold churn, not VAT body foil`,
      churnCallout: false,
    },
    {
      id: 'last-checked',
      labelEn: 'Last checked',
      detailEn: PTUR_THRESHOLD_CHURN_LAST_CHECKED,
      liveUrl: GOV_IL_PERSONAL_IMPORT_CALC_URL,
      churnCallout: true,
    },
  ];
}

/** English headline for the ptur threshold-churn honesty strip. */
export function pturThresholdChurnHeadlineEn(): string {
  return (
    `Personal-import threshold churn: official $${PTUR_OFFICIAL_USD} ptur · ` +
    `documented 2026 $${PTUR_OFFICIAL_USD}↔$${PTUR_CHURN_130_USD} flip-flops ` +
    `(Skills IL / OpenAccountants) · last checked ${PTUR_THRESHOLD_CHURN_LAST_CHECKED}`
  );
}

/** English last-checked stamp for the ptur threshold-churn moat. */
export function pturThresholdChurnLastCheckedStampEn(): string {
  return `Last checked: ${PTUR_THRESHOLD_CHURN_LAST_CHECKED}`;
}

/** Official $75 ptur cite line. */
export function pturOfficial75CiteEn(): string {
  return (
    `Official personal-import ptur: USD $${PTUR_OFFICIAL_USD} (goods value alone; ` +
    `shipping excluded from the threshold test).`
  );
}

/** Short Hebrew intro above the ptur threshold-churn panel. */
export function pturThresholdChurnIntroHe(): string {
  return (
    `יושרת סף יבוא אישי: הפטור הרשמי $${PTUR_OFFICIAL_USD} (על ערך הסחורה בלבד). ` +
    `Skills IL ו־OpenAccountants מתעדים את התנודות $${PTUR_OFFICIAL_USD}↔$${PTUR_CHURN_130_USD} ב־2026 ` +
    `(חלון $130 עד 1 ביוני 2026; חזרה ל-$${PTUR_OFFICIAL_USD}). ` +
    `נבדק לאחרונה ${PTUR_THRESHOLD_CHURN_LAST_CHECKED}. שופלי: פטור $${PTUR_OFFICIAL_USD} קבוע במחשבון.`
  );
}
