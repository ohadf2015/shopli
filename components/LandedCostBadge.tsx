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
  variant?: 'chip' | 'full';
  scope?: 'product' | 'kit';
  /** When set, the items are summed and tested against $75 as one parcel. */
  skus?: LandedCostInput[];
  /** Customs shekels per dollar; defaults to the site-wide rate. */
  usdIls?: number;
}

const ils = (n: number) => `₪${Math.round(n).toLocaleString('he-IL')}`;

/** Hebrew only: it renders on the Israel region alone and encodes Israeli import rules. */
export default function LandedCostBadge({
  price,
  currency,
  freeShipping,
  shippingIls,
  variant = 'chip',
  scope = 'product',
  skus,
  usdIls = USD_TO_ILS_RATE,
}: LandedCostBadgeProps) {
  const kit = scope === 'kit' || (skus != null && skus.length > 0);
  const est =
    skus && skus.length > 0
      ? estimateKitLandedCost(skus, usdIls)
      : estimateLandedCost({ price: price ?? 0, currency, freeShipping, shippingIls }, usdIls);
  if (!est) return null;

  const vatPct = Math.round(IL_VAT_RATE * 100);
  const skuCount = skus && skus.length > 0 ? skus.length : 1;

  const fxTip = customsFxTooltipHe(usdIls);

  if (variant === 'chip') {
    return (
      <span
        dir="rtl"
        className="inline-flex items-center gap-1 mt-1 self-start text-[0.6rem] sm:text-[0.65rem] font-semibold px-2 py-0.5 rounded-full"
        style={
          est.dutyFree
            ? { background: 'rgba(16,185,129,0.1)', color: '#047857' }
            : { background: 'rgba(245,158,11,0.12)', color: '#b45309' }
        }
        data-landed-cost={est.dutyFree ? 'duty-free' : 'vat'}
        data-landed-total-ils={est.totalIls.toFixed(2)}
        data-fx-source="boi-plus-0.5"
        data-vat-rate={String(vatPct)}
        title={fxTip}
        {...(kit ? { 'data-landed-scope': 'kit', 'data-landed-sku-count': skuCount } : {})}
      >
        <Icon name="shield" size={10} className="shrink-0" />
        {est.dutyFree ? (
          <span>{kit ? 'ההזמנה פטורה ממע״מ וממכס · מתחת ל-$75' : 'פטור ממע״מ וממכס · מתחת ל-$75'}</span>
        ) : (
          <span>
            {kit ? 'ההזמנה כולל מע״מ' : 'כולל מע״מ'} {vatPct}% ≈ {ils(est.totalIls)}
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
      data-vat-rate={String(vatPct)}
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
            ? 'ההזמנה כולה מתחת ל-$75, ולכן פטורה ממע״מ וממכס'
            : 'מתחת ל-$75, ולכן פטור ממע״מ וממכס'
          : kit
            ? `ההזמנה כולה מעל $75, ולכן מתווסף מע״מ של ${vatPct}%`
            : `מעל $75, ולכן מתווסף מע״מ של ${vatPct}%`}
      </div>
      <dl className="text-xs sm:text-sm space-y-1" style={{ color: 'var(--shopli-navy)' }}>
        <div className="flex justify-between gap-4">
          <dt style={{ color: 'var(--shopli-warm-gray)' }}>
            {kit ? 'מחיר המוצרים' : 'מחיר המוצר'}
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
            <dt style={{ color: 'var(--shopli-warm-gray)' }}>מע״מ {vatPct}%</dt>
            <dd className="tabular-nums font-medium" dir="ltr">{ils(est.vatIls)}</dd>
          </div>
        )}
        <div
          className="flex justify-between gap-4 pt-1.5 mt-1.5 border-t font-bold"
          style={{ borderColor: est.dutyFree ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)' }}
        >
          <dt>סה״כ משוער עד הבית</dt>
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
