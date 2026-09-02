/**
 * Israel landed-cost estimator — answers "what will this AliExpress order
 * actually cost at my door?" for IL shoppers.
 *
 * Israeli import rules for personal purchases (as modeled here):
 *  - goods value UNDER $75   -> exempt from customs duty AND VAT
 *  - $75 and above           -> VAT 18% on (goods + shipping); customs duty
 *                               only above $500, which is rare for AliExpress
 *                               carts and deliberately not modeled.
 * The $75 threshold is on the goods value alone (shipping excluded); the VAT
 * base includes shipping. Rate is a documented estimate, not a live FX feed.
 */

export const USD_TO_ILS_RATE = 3.6;
export const DUTY_FREE_THRESHOLD_USD = 75;
export const IL_VAT_RATE = 0.18;

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

/** Multiplier from the given currency to ILS. Symbol forms included because
 *  some feed rows carry the glyph rather than the ISO code. */
const ILS_PER_UNIT: Record<string, number> = {
  ILS: 1,
  USD: USD_TO_ILS_RATE,
  '₪': 1,
  $: USD_TO_ILS_RATE,
};

export function estimateLandedCost(input: LandedCostInput): LandedCostEstimate | null {
  const price = Number(input.price);
  if (!Number.isFinite(price) || price <= 0) return null;

  const currency = (input.currency || 'ILS').trim().toUpperCase();
  const rate = ILS_PER_UNIT[currency];
  if (rate == null) return null;

  const priceIls = price * rate;
  const usdPrice = priceIls / USD_TO_ILS_RATE;
  const shippingIls = input.freeShipping
    ? 0
    : Math.max(0, Number(input.shippingIls) || 0);

  const dutyFree = usdPrice < DUTY_FREE_THRESHOLD_USD;
  const vatIls = dutyFree ? 0 : IL_VAT_RATE * (priceIls + shippingIls);

  return {
    usdPrice,
    priceIls,
    shippingIls,
    dutyFree,
    vatIls,
    totalIls: priceIls + shippingIls + vatIls,
  };
}


/**
 * Kit / cart rollup: sum SKU goods vs the same $75 ptur. Each SKU can look
 * duty-free on a ProductCard while the combined order crosses the threshold —
 * VAT is assessed on the shipment, not the line item.
 */
export function estimateKitLandedCost(skus: LandedCostInput[]): LandedCostEstimate | null {
  const parts = (skus || [])
    .map((sku) => estimateLandedCost(sku))
    .filter((est): est is LandedCostEstimate => est != null);
  if (parts.length === 0) return null;

  const priceIls = parts.reduce((sum, est) => sum + est.priceIls, 0);
  const shippingIls = parts.reduce((sum, est) => sum + est.shippingIls, 0);
  const usdPrice = priceIls / USD_TO_ILS_RATE;
  const dutyFree = usdPrice < DUTY_FREE_THRESHOLD_USD;
  const vatIls = dutyFree ? 0 : IL_VAT_RATE * (priceIls + shippingIls);

  return {
    usdPrice,
    priceIls,
    shippingIls,
    dutyFree,
    vatIls,
    totalIls: priceIls + shippingIls + vatIls,
  };
}
