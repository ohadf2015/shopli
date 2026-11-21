/**
 * Israel personal-import rules and the estimator built on them. Every page,
 * card and guide reads the rules from here, so a rule change is one edit.
 *
 * As modeled:
 *  - goods under $75                -> no VAT, no customs
 *  - $75 up to $500                 -> VAT on goods + shipping, no customs
 *  - $500 and above                 -> VAT, and some goods also owe customs or
 *                                      purchase tax (not modeled: it depends on
 *                                      the product's customs classification)
 * The $75 test is on the goods value alone when shipping is listed separately.
 * Customs converts foreign prices at the Bank of Israel representative rate
 * plus 0.5%.
 */

/** When the rules below were last read against IL_IMPORT_SOURCES. */
export const IL_IMPORT_RULES_CHECKED = '2026-11-21';

export const TAX_AUTHORITY_CALC_URL =
  'https://shaarolami-query.customs.mof.gov.il/CustomspilotWeb/he/PersonalImportTax/Home/Calc';
export const KOL_ZCHUT_IMPORT_URL =
  'https://www.kolzchut.org.il/he/%D7%96%D7%9B%D7%95%D7%AA%D7%95%D7%9F_%D7%91%D7%A0%D7%95%D7%A9%D7%90_%D7%99%D7%91%D7%95%D7%90_%D7%90%D7%99%D7%A9%D7%99_(%D7%97%D7%91%D7%99%D7%9C%D7%95%D7%AA_%D7%9E%D7%97%D7%95%22%D7%9C)';

export const DUTY_FREE_THRESHOLD_USD = 75;
export const DUTY_WAIVER_CEILING_USD = 500;
export const IL_VAT_RATE = 0.18;
export const BOI_CUSTOMS_FX_UPLIFT = 0.005;

/** Bank of Israel representative USD rate, used when no fresher one is supplied. */
export const FALLBACK_BOI_USD_ILS = 3.326;
export const FALLBACK_BOI_DATE = '2026-11-20';

/** Shekels per dollar the way customs counts them: representative rate + 0.5%. */
export function customsRate(boiUsdIls: number): number {
  return boiUsdIls * (1 + BOI_CUSTOMS_FX_UPLIFT);
}

/** True for a plausible USD/ILS representative rate; guards env and API input. */
export function isPlausibleUsdIls(n: unknown): n is number {
  return typeof n === 'number' && Number.isFinite(n) && n > 2 && n < 6;
}

const buildTimeBoi = Number(process.env.NEXT_PUBLIC_BOI_USD_ILS);

/**
 * Customs shekels per dollar for the whole site. next.config.js reads the
 * Bank of Israel rate at build time; without it (tests, a failed lookup) the
 * dated fallback above applies.
 */
export const USD_TO_ILS_RATE = customsRate(
  isPlausibleUsdIls(buildTimeBoi) ? buildTimeBoi : FALLBACK_BOI_USD_ILS
);

export function customsFxTooltipHe(rate: number = USD_TO_ILS_RATE): string {
  const pct = (BOI_CUSTOMS_FX_UPLIFT * 100).toFixed(1);
  return (
    `המכס ממיר דולרים לפי השער היציג של בנק ישראל בתוספת ${pct}%. ` +
    `החישוב כאן לפי ${rate.toFixed(2)} ₪ לדולר, והחיוב בפועל נקבע ביום שהחבילה משתחררת.`
  );
}

export interface LandedCostInput {
  price: number;
  /** ISO code or symbol. Missing/unknown -> defaults to ILS (IL feed currency). */
  currency?: string | null;
  freeShipping?: boolean;
  /** Explicit shipping in ILS when known and not free. */
  shippingIls?: number;
}

export interface LandedCostEstimate {
  usdPrice: number;
  priceIls: number;
  shippingIls: number;
  dutyFree: boolean;
  vatIls: number;
  totalIls: number;
}

/** Symbol forms included because some feed rows carry the glyph, not the ISO code. */
function ilsPerUnit(currency: string, usdIls: number): number | null {
  if (currency === 'ILS' || currency === '₪') return 1;
  if (currency === 'USD' || currency === '$') return usdIls;
  return null;
}

function assess(priceIls: number, shippingIls: number, usdIls: number): LandedCostEstimate {
  const usdPrice = priceIls / usdIls;
  const dutyFree = usdPrice < DUTY_FREE_THRESHOLD_USD;
  const vatIls = dutyFree ? 0 : IL_VAT_RATE * (priceIls + shippingIls);
  return { usdPrice, priceIls, shippingIls, dutyFree, vatIls, totalIls: priceIls + shippingIls + vatIls };
}

export function estimateLandedCost(
  input: LandedCostInput,
  usdIls: number = USD_TO_ILS_RATE
): LandedCostEstimate | null {
  const price = Number(input.price);
  if (!Number.isFinite(price) || price <= 0) return null;

  const rate = ilsPerUnit((input.currency || 'ILS').trim().toUpperCase(), usdIls);
  if (rate == null) return null;

  const shippingIls = input.freeShipping ? 0 : Math.max(0, Number(input.shippingIls) || 0);
  return assess(price * rate, shippingIls, usdIls);
}

/**
 * Several items in one parcel: tax is assessed on the parcel, so the items are
 * summed before the $75 test. Each one can be exempt alone while the order is not.
 */
export function estimateKitLandedCost(
  skus: LandedCostInput[],
  usdIls: number = USD_TO_ILS_RATE
): LandedCostEstimate | null {
  const parts = (skus || [])
    .map((sku) => estimateLandedCost(sku, usdIls))
    .filter((est): est is LandedCostEstimate => est != null);
  if (parts.length === 0) return null;

  return assess(
    parts.reduce((sum, est) => sum + est.priceIls, 0),
    parts.reduce((sum, est) => sum + est.shippingIls, 0),
    usdIls
  );
}
