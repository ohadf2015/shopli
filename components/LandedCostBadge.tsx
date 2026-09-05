import React from 'react';
import Icon from './icons';
import {
  estimateLandedCost,
  estimateKitLandedCost,
  USD_TO_ILS_RATE,
  IL_VAT_RATE,
  customsFxTooltipHe,
  type LandedCostInput,
} from '../lib/landed-cost';

interface LandedCostBadgeProps {
  price?: number;
  currency?: string | null;
  freeShipping?: boolean;
  shippingIls?: number;
  /** 'chip' = one-line badge (ProductCard), 'full' = breakdown block (PDP / kit). */
  variant?: 'chip' | 'full';
  /** 'kit' uses the SKU-sum rollup copy; product chip/full stay as in #14. */
  scope?: 'product' | 'kit';
  /** When set, roll up these SKUs vs $75 instead of a single price. */
  skus?: LandedCostInput[];
}

const ils = (n: number) => `₪${Math.round(n).toLocaleString('he-IL')}`;

/**
 * IL landed-cost badge — Hebrew only by design: it renders exclusively on the
 * /il region (Hebrew, RTL) and encodes Israeli import rules that are
 * meaningless elsewhere.
 */
export default function LandedCostBadge({
  price,
  currency,
  freeShipping,
  shippingIls,
  variant = 'chip',
  scope = 'product',
  skus,
}: LandedCostBadgeProps) {
  const kit = scope === 'kit' || (skus != null && skus.length > 0);
  const est =
    skus && skus.length > 0
      ? estimateKitLandedCost(skus)
      : estimateLandedCost({ price: price ?? 0, currency, freeShipping, shippingIls });
  if (!est) return null;

  const vatPct = Math.round(IL_VAT_RATE * 100);
  const skuCount = skus && skus.length > 0 ? skus.length : 1;

  const fxTip = customsFxTooltipHe(USD_TO_ILS_RATE);

  if (variant === 'chip') {
    return (
      <span
        className="inline-flex items-center gap-1 text-[0.6rem] sm:text-[0.65rem] font-semibold px-2 py-0.5 rounded-full mt-1 self-start"
        style={
          est.dutyFree
            ? { background: 'rgba(16,185,129,0.1)', color: '#047857' }
            : { background: 'rgba(245,158,11,0.12)', color: '#b45309' }
        }
        data-landed-cost={est.dutyFree ? 'duty-free' : 'vat'}
        data-landed-total-ils={est.totalIls.toFixed(2)}
        data-fx-source="boi-plus-0.5"
        title={fxTip}
        {...(kit ? { 'data-landed-scope': 'kit', 'data-landed-sku-count': skuCount } : {})}
        dir="rtl"
      >
        <Icon name="shield" size={10} className="shrink-0" />
        {est.dutyFree ? (
          <span>{kit ? 'פטור ממכס ומע״ם לערכה · מתחת ל-$75' : 'פטור ממכס ומע״ם · מתחת ל-$75'}</span>
        ) : (
          <span>
            {kit ? 'ערכה כולל מע״ם' : 'כולל מע״ם'} {vatPct}% ≈ {ils(est.totalIls)}
          </span>
        )}
        <span
          className="inline-flex shrink-0 opacity-70"
          aria-label={fxTip}
          data-fx-tooltip="boi-plus-0.5"
        >
          <Icon name="info" size={10} />
        </span>
      </span>
    );
  }

  return (
    <div
      className="rounded-xl border p-3 sm:p-4 mb-6"
      style={
        est.dutyFree
          ? { borderColor: 'rgba(16,185,129,0.35)', background: 'rgba(16,185,129,0.06)' }
          : { borderColor: 'rgba(245,158,11,0.35)', background: 'rgba(245,158,11,0.07)' }
      }
      data-landed-cost={est.dutyFree ? 'duty-free' : 'vat'}
      data-landed-total-ils={est.totalIls.toFixed(2)}
      data-fx-source="boi-plus-0.5"
      title={fxTip}
      {...(kit ? { 'data-landed-scope': 'kit', 'data-landed-sku-count': skuCount } : {})}
      dir="rtl"
    >
      <div
        className="flex items-center gap-1.5 text-sm font-bold mb-2"
        style={{ color: est.dutyFree ? '#047857' : '#b45309' }}
      >
        <Icon name="shield" size={14} className="shrink-0" />
        {est.dutyFree
          ? kit
            ? 'פטור ממכס וממע״ם לערכה — מתחת לתקרת ה-$75'
            : 'פטור ממכס וממע״ם — מתחת לתקרת ה-$75'
          : kit
            ? `מעבר לתקרת ה-$75 לערכה — מתווסף מע״ם ${vatPct}%`
            : `מעבר לתקרת ה-$75 — מתווסף מע״ם ${vatPct}%`}
      </div>
      <dl className="text-xs sm:text-sm space-y-1" style={{ color: 'var(--shopli-navy)' }}>
        <div className="flex justify-between gap-4">
          <dt style={{ color: 'var(--shopli-warm-gray)' }}>
            {kit ? 'מחיר הערכה (סה״כ SKU)' : 'מחיר המוצר'}
          </dt>
          <dd className="tabular-nums font-medium" dir="ltr">{ils(est.priceIls)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt style={{ color: 'var(--shopli-warm-gray)' }}>משלוח</dt>
          <dd className="tabular-nums font-medium" dir="ltr">
            {est.shippingIls > 0 ? ils(est.shippingIls) : 'חינם'}
          </dd>
        </div>
        {!est.dutyFree && (
          <div className="flex justify-between gap-4">
            <dt style={{ color: 'var(--shopli-warm-gray)' }}>מע״ם {vatPct}%</dt>
            <dd className="tabular-nums font-medium" dir="ltr">{ils(est.vatIls)}</dd>
          </div>
        )}
        <div
          className="flex justify-between gap-4 pt-1.5 mt-1.5 border-t font-bold"
          style={{ borderColor: est.dutyFree ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)' }}
        >
          <dt>סה״כ משוער לארץ</dt>
          <dd className="tabular-nums" dir="ltr">{ils(est.totalIls)}</dd>
        </div>
      </dl>
      <p
        className="text-[0.65rem] mt-2 inline-flex items-start gap-1"
        style={{ color: 'var(--shopli-warm-gray)' }}
        data-fx-tooltip="boi-plus-0.5"
      >
        <Icon name="info" size={11} className="shrink-0 mt-0.5 opacity-70" />
        <span>{fxTip}</span>
      </p>
    </div>
  );
}
