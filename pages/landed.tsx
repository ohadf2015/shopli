import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SeoHead from '../components/SeoHead';
import LandedCostBadge from '../components/LandedCostBadge';
import Icon from '../components/icons';
import { SITE_URL } from '../lib/seo';
import {
  IL_VAT_RATE,
  USD_TO_ILS_RATE,
  BOI_CUSTOMS_FX_UPLIFT,
  DUTY_FREE_THRESHOLD_USD,
  DUTY_WAIVER_CEILING_USD,
  estimateLandedCost,
  estimateKitLandedCost,
  type LandedCostInput,
} from '../lib/landed-cost';
import {
  parseProductUrl,
  parseKitUrls,
  customsStampCopyHe,
  dutyWaiverBandRows,
  classifyDutyWaiverBand,
  kitTippingHint,
  kitTippingCopyHe,
  ITA_SHAAR_OLAMI_CALC_URL,
  itaShaarOlamiFoilStripHe,
  itaShaarOlamiLinkLabelHe,
  israelVat18Not17FoilEn,
  SKILLS_IL_CUSTOMS,
  SKILLS_IL_SHEKEL,
  SKILLS_IL_STAMP_DATE,
  type ParsedProductUrl,
} from '../lib/landed-url';

const PAGE_URL = `${SITE_URL}/landed`;
const VAT_PCT = Math.round(IL_VAT_RATE * 100);
const FX_PCT = (BOI_CUSTOMS_FX_UPLIFT * 100).toFixed(1);
const SKILLS_IL = SKILLS_IL_CUSTOMS;
const SKILLS_SHEKEL = SKILLS_IL_SHEKEL;
const SKILLS_STAMP = SKILLS_IL_STAMP_DATE;
const KIT_MAX = 5;

type QuoteMode = 'single' | 'kit';

function sourceLabelHe(source: ParsedProductUrl['source']): string {
  if (source === 'amazon') return 'Amazon';
  if (source === 'aliexpress') return 'AliExpress';
  return 'קישור מוצר';
}

function emptyKitPrices(n = KIT_MAX): string[] {
  return Array.from({ length: n }, () => '');
}

/**
 * /landed — paste Amazon/product URL(s) → IL landed-cost quote.
 * Moat: multi-SKU kit rollup (2–5 URLs) vs $75 ptur + $75–$500 VAT-only
 * bands after #21; Skills IL customs v1.4.0 + shekel v2.2.0 Sep 7 stamp;
 * explicit "Israel VAT is 18% not 17%" foil vs iWishBag Apr 29 body bug;
 * ITA Shaar Olami calculator foil (#23) kept. Presentation only.
 * Estimator math unchanged (#18–#23).
 */
export default function LandedPage() {
  const router = useRouter();
  const [mode, setMode] = useState<QuoteMode>('single');
  const [urlInput, setUrlInput] = useState('');
  const [price, setPrice] = useState('');
  const [kitUrlsRaw, setKitUrlsRaw] = useState('');
  const [kitPrices, setKitPrices] = useState<string[]>(() => emptyKitPrices());
  const [currency, setCurrency] = useState('USD');
  const [shippingIls, setShippingIls] = useState('');
  const [freeShipping, setFreeShipping] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  // Prefill from shareable ?url=&price=&currency= or ?kit=1&urls=&prices=
  useEffect(() => {
    if (!router.isReady || hydrated) return;
    const q = router.query;
    if (q.kit === '1' || (typeof q.urls === 'string' && q.urls)) {
      setMode('kit');
      if (typeof q.urls === 'string' && q.urls) setKitUrlsRaw(q.urls.replace(/\|/g, '\n'));
      if (typeof q.prices === 'string' && q.prices) {
        const parts = q.prices.split('|').slice(0, KIT_MAX);
        const next = emptyKitPrices();
        parts.forEach((p, i) => {
          next[i] = p;
        });
        setKitPrices(next);
      }
    }
    if (typeof q.url === 'string' && q.url) setUrlInput(q.url);
    if (typeof q.price === 'string' && q.price) setPrice(q.price);
    if (typeof q.currency === 'string' && q.currency) {
      const c = q.currency.trim().toUpperCase();
      if (c === 'USD' || c === 'ILS' || c === '$' || c === '₪') setCurrency(c === '$' ? 'USD' : c === '₪' ? 'ILS' : c);
    }
    if (q.ship === '1' || q.freeShipping === '0') setFreeShipping(false);
    if (typeof q.shippingIls === 'string' && q.shippingIls) {
      setShippingIls(q.shippingIls);
      setFreeShipping(false);
    }
    setHydrated(true);
  }, [router.isReady, router.query, hydrated]);

  const parsed = useMemo(() => parseProductUrl(urlInput), [urlInput]);
  const kitParsed = useMemo(() => parseKitUrls(kitUrlsRaw), [kitUrlsRaw]);
  const priceNum = Number(price);
  const shipNum = freeShipping ? 0 : Math.max(0, Number(shippingIls) || 0);

  const kitSkus: LandedCostInput[] = useMemo(() => {
    return kitParsed
      .map((_, i) => {
        const n = Number(kitPrices[i]);
        if (!Number.isFinite(n) || n <= 0) return null;
        return {
          price: n,
          currency,
          freeShipping: true, // per-SKU goods; shared ship applied once below
          shippingIls: 0,
        } as LandedCostInput;
      })
      .filter((s): s is LandedCostInput => s != null);
  }, [kitParsed, kitPrices, currency]);

  // Shared shipping on kit: attach to first SKU only so threshold stays goods-only
  const kitSkusWithShip: LandedCostInput[] = useMemo(() => {
    if (kitSkus.length === 0) return [];
    if (shipNum <= 0) return kitSkus;
    return kitSkus.map((s, i) =>
      i === 0 ? { ...s, freeShipping: false, shippingIls: shipNum } : s
    );
  }, [kitSkus, shipNum]);

  const canQuoteSingle = Number.isFinite(priceNum) && priceNum > 0;
  const canQuoteKit = kitSkusWithShip.length >= 2;

  const quoteEst = useMemo(() => {
    if (!canQuoteSingle) return null;
    return estimateLandedCost({
      price: priceNum,
      currency,
      freeShipping,
      shippingIls: shipNum,
    });
  }, [canQuoteSingle, priceNum, currency, freeShipping, shipNum]);

  const kitEst = useMemo(() => {
    if (!canQuoteKit) return null;
    return estimateKitLandedCost(kitSkusWithShip);
  }, [canQuoteKit, kitSkusWithShip]);

  const tipping = useMemo(() => kitTippingHint(kitSkusWithShip), [kitSkusWithShip]);

  const activeBand =
    mode === 'kit'
      ? kitEst
        ? classifyDutyWaiverBand(kitEst.usdPrice)
        : null
      : quoteEst
        ? classifyDutyWaiverBand(quoteEst.usdPrice)
        : null;
  const bands = useMemo(() => dutyWaiverBandRows(), []);

  const syncQuery = useCallback(() => {
    if (!router.isReady) return;
    const next: Record<string, string> = {};
    if (mode === 'kit') {
      next.kit = '1';
      if (kitUrlsRaw.trim()) next.urls = kitParsed.map((p) => p.canonicalUrl || `https://${p.host}`).join('|');
      const priced = kitParsed
        .map((_, i) => kitPrices[i]?.trim() || '')
        .filter(Boolean);
      if (priced.length) next.prices = kitParsed.map((_, i) => kitPrices[i]?.trim() || '').join('|');
    } else {
      if (urlInput.trim()) next.url = urlInput.trim();
      if (price.trim()) next.price = price.trim();
    }
    if (currency && currency !== 'USD') next.currency = currency;
    if (!freeShipping && shippingIls.trim()) next.shippingIls = shippingIls.trim();
    router.replace({ pathname: '/landed', query: next }, undefined, { shallow: true });
  }, [
    router,
    mode,
    kitUrlsRaw,
    kitParsed,
    kitPrices,
    urlInput,
    price,
    currency,
    freeShipping,
    shippingIls,
  ]);

  const stamp = customsStampCopyHe();
  const vatFoilEn = israelVat18Not17FoilEn();
  const tipCopy = kitTippingCopyHe();
  const itaFoil = itaShaarOlamiFoilStripHe();
  const itaLinkLabel = itaShaarOlamiLinkLabelHe();

  const setKitPriceAt = (idx: number, value: string) => {
    setKitPrices((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  };

  return (
    <>
      <SeoHead
        region="il"
        path="/landed"
        canonical={PAGE_URL}
        hreflang={false}
        title={`מחשבון עלות לישראל — פטור $${DUTY_FREE_THRESHOLD_USD} · ערכה 2–5 · מע״ם ${VAT_PCT}% · BoI+${FX_PCT}% | Shopli`}
        description={`הדביקו קישור Amazon / ערכה של 2–5 קישורים וקבלו הצעת מחיר לארץ: פטור $${DUTY_FREE_THRESHOLD_USD}, פס $${DUTY_FREE_THRESHOLD_USD}–$${DUTY_WAIVER_CEILING_USD} מע״ם בלבד (ויתור מכס), חותמת Skills IL customs ${SKILLS_IL} + shekel ${SKILLS_SHEKEL} · ${SKILLS_STAMP} (מע״ם ${VAT_PCT}% · שער יציג בנק ישראל + ${FX_PCT}%). Israel VAT is 18% not 17%.`}
      />
      <Header currentRegion="il" dir="rtl" />

      <main
        dir="rtl"
        className="min-h-screen"
        style={{ fontFamily: 'var(--font-assistant), system-ui, sans-serif' }}
        data-page="landed"
        data-skills-il={SKILLS_IL}
        data-skills-shekel={SKILLS_SHEKEL}
        data-skills-stamp={SKILLS_STAMP}
        data-vat-honesty-foil="18-not-17"
        data-duty-bands="ptur-vat-waiver"
        data-ita-shaar-olami-foil="1"
        data-landed-mode={mode}
        {...(mode === 'kit'
          ? {
              'data-landed-kit': '1',
              'data-kit-sku-count': String(kitSkusWithShip.length),
            }
          : {})}
      >
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-10">
          <div
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: 'var(--shopli-orange)' }}
          >
            שופלי · עלות לארץ
          </div>
          <h1
            className="text-3xl md:text-4xl font-extrabold leading-tight mb-3"
            style={{ color: 'var(--shopli-navy)' }}
          >
            הדביקו קישור או ערכה → הצעת מחיר לישראל
          </h1>
          <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--shopli-warm-gray)' }}>
            מחשבון עלות כוללת ליבוא אישי: תקרת פטור ${DUTY_FREE_THRESHOLD_USD}, פס ויתור מכס $
            {DUTY_FREE_THRESHOLD_USD}–${DUTY_WAIVER_CEILING_USD} (מע״ם {VAT_PCT}% בלבד — לא 17%), וחותמת שער
            מכס (שער יציג בנק ישראל + {FX_PCT}% לרשומון) לפי Skills IL customs {SKILLS_IL} + shekel{' '}
            {SKILLS_SHEKEL} · {SKILLS_STAMP} — בלי סקרייפ חי מ־Amazon. ערכה של 2–5 קישורים מגלגלת מול אותה
            תקרה (פריט בודד יכול להיראות פטור).
          </p>

          {/* Customs stamp callout — 18% not 17% + BoI+0.5% · Sep 7 restamp */}
          <aside
            className="rounded-xl border p-3 sm:p-4 mb-6"
            style={{
              borderColor: 'rgba(249,115,22,0.35)',
              background: 'rgba(249,115,22,0.07)',
            }}
            data-customs-stamp="boi-plus-0.5"
            data-vat-rate={String(VAT_PCT)}
            data-vat-not="17"
            data-skills-il={SKILLS_IL}
            data-skills-shekel={SKILLS_SHEKEL}
            data-skills-stamp={SKILLS_STAMP}
            data-vat-honesty-foil="18-not-17"
          >
            <div
              className="flex items-start gap-2 text-sm font-bold mb-1"
              style={{ color: 'var(--shopli-navy)' }}
            >
              <Icon name="shield" size={16} className="shrink-0 mt-0.5" />
              <span>
                חותמת מכס · מע״ם {VAT_PCT}% (לא 17%) · BoI + {FX_PCT}% · Skills IL {SKILLS_IL} +{' '}
                {SKILLS_SHEKEL} · {SKILLS_STAMP}
              </span>
            </div>
            <p
              className="text-xs font-bold mb-1"
              style={{ color: 'var(--shopli-navy)' }}
              dir="ltr"
              data-vat-foil-en="18-not-17"
            >
              {vatFoilEn}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--shopli-warm-gray)' }}>
              {stamp}
            </p>
          </aside>

          {/* ITA Shaar Olami calculator foil — deep-link honesty strip */}
          <aside
            className="rounded-xl border p-3 sm:p-4 mb-6"
            style={{
              borderColor: 'rgba(15,23,42,0.14)',
              background: 'rgba(15,23,42,0.03)',
            }}
            data-ita-shaar-olami-foil="1"
            data-ita-calc-href={ITA_SHAAR_OLAMI_CALC_URL}
            data-ptur-usd={String(DUTY_FREE_THRESHOLD_USD)}
            data-duty-waiver-ceiling-usd={String(DUTY_WAIVER_CEILING_USD)}
          >
            <div
              className="flex items-start gap-2 text-sm font-bold mb-1"
              style={{ color: 'var(--shopli-navy)' }}
            >
              <Icon name="info" size={16} className="shrink-0 mt-0.5" />
              <span>שקיפות · אותם פסים כמו רשות המיסים (שער עולמי)</span>
            </div>
            <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--shopli-warm-gray)' }}>
              {itaFoil}
            </p>
            <a
              href={ITA_SHAAR_OLAMI_CALC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold underline-offset-2 hover:underline"
              style={{ color: 'var(--shopli-orange)' }}
              data-ita-shaar-olami-link="1"
            >
              {itaLinkLabel}
              <Icon name="external" size={12} className="shrink-0" />
            </a>
          </aside>

          {/* Duty-waiver bands (ptur + VAT-only) */}
          <div
            className="mb-8"
            data-duty-waiver-bands="1"
            data-ptur-usd={String(DUTY_FREE_THRESHOLD_USD)}
            data-duty-waiver-ceiling-usd={String(DUTY_WAIVER_CEILING_USD)}
          >
            <h2 className="text-sm font-bold mb-2" style={{ color: 'var(--shopli-navy)' }}>
              פסי יבוא אישי · פטור ${DUTY_FREE_THRESHOLD_USD} + ויתור מכס עד ${DUTY_WAIVER_CEILING_USD}
            </h2>
            <ul className="space-y-2">
              {bands.map((row) => {
                const active = activeBand === row.id;
                return (
                  <li
                    key={row.id}
                    className="rounded-xl border px-3 py-2.5"
                    style={{
                      borderColor: active
                        ? 'rgba(249,115,22,0.45)'
                        : 'rgba(15,23,42,0.1)',
                      background: active
                        ? 'rgba(249,115,22,0.08)'
                        : 'rgba(15,23,42,0.02)',
                    }}
                    data-duty-band={row.id}
                    data-duty-band-active={active ? '1' : '0'}
                  >
                    <div
                      className="text-sm font-bold mb-0.5"
                      style={{ color: 'var(--shopli-navy)' }}
                    >
                      {row.titleHe}
                      {active && (
                        <span
                          className="ms-2 text-[0.65rem] font-semibold px-1.5 py-0.5 rounded-full"
                          style={{
                            background: 'rgba(249,115,22,0.15)',
                            color: '#c2410c',
                          }}
                        >
                          הפס של ההצעה
                        </span>
                      )}
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--shopli-warm-gray)' }}>
                      {row.detailHe}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Mode toggle: single vs kit */}
          <div
            className="flex flex-wrap gap-2 mb-4"
            role="tablist"
            aria-label="מצב הצעת מחיר"
            data-landed-mode-toggle="1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'single'}
              className="px-3 py-2 rounded-xl text-sm font-semibold border"
              style={{
                borderColor: mode === 'single' ? 'rgba(249,115,22,0.45)' : 'rgba(15,23,42,0.12)',
                background: mode === 'single' ? 'rgba(249,115,22,0.1)' : 'transparent',
                color: 'var(--shopli-navy)',
              }}
              onClick={() => setMode('single')}
              data-landed-mode-btn="single"
            >
              קישור בודד
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'kit'}
              className="px-3 py-2 rounded-xl text-sm font-semibold border"
              style={{
                borderColor: mode === 'kit' ? 'rgba(249,115,22,0.45)' : 'rgba(15,23,42,0.12)',
                background: mode === 'kit' ? 'rgba(249,115,22,0.1)' : 'transparent',
                color: 'var(--shopli-navy)',
              }}
              onClick={() => setMode('kit')}
              data-landed-mode-btn="kit"
            >
              ערכה (2–5 קישורים)
            </button>
          </div>

          <form
            className="space-y-4 mb-8"
            onSubmit={(e) => {
              e.preventDefault();
              syncQuery();
            }}
          >
            {mode === 'single' ? (
              <>
                <label className="block">
                  <span className="text-sm font-semibold mb-1.5 block" style={{ color: 'var(--shopli-navy)' }}>
                    קישור מוצר (Amazon / AliExpress / אחר)
                  </span>
                  <input
                    type="url"
                    inputMode="url"
                    dir="ltr"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://www.amazon.com/dp/B0XXXXXXXX"
                    className="w-full px-4 py-3 rounded-xl border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    style={{ borderColor: 'rgba(15,23,42,0.12)' }}
                    data-landed-url-input="1"
                  />
                </label>

                {parsed && (
                  <div
                    className="text-xs px-3 py-2 rounded-lg flex flex-wrap gap-x-3 gap-y-1"
                    style={{ background: 'rgba(15,23,42,0.04)', color: 'var(--shopli-warm-gray)' }}
                    data-landed-url-parsed={parsed.source}
                    data-landed-product-id={parsed.productId || ''}
                  >
                    <span>
                      מקור: <strong style={{ color: 'var(--shopli-navy)' }}>{sourceLabelHe(parsed.source)}</strong>
                    </span>
                    <span dir="ltr">{parsed.host}</span>
                    {parsed.productId && (
                      <span dir="ltr">
                        ID: <strong>{parsed.productId}</strong>
                      </span>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-sm font-semibold mb-1.5 block" style={{ color: 'var(--shopli-navy)' }}>
                      מחיר מוצר (ללא משלוח)
                    </span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      dir="ltr"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="89.99"
                      className="w-full px-4 py-3 rounded-xl border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      style={{ borderColor: 'rgba(15,23,42,0.12)' }}
                      data-landed-price-input="1"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold mb-1.5 block" style={{ color: 'var(--shopli-navy)' }}>
                      מטבע
                    </span>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      style={{ borderColor: 'rgba(15,23,42,0.12)' }}
                      data-landed-currency-input="1"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="ILS">ILS (₪)</option>
                    </select>
                  </label>
                </div>
              </>
            ) : (
              <>
                <label className="block">
                  <span className="text-sm font-semibold mb-1.5 block" style={{ color: 'var(--shopli-navy)' }}>
                    קישורים לערכה (2–5, שורה או פסיק לכל קישור)
                  </span>
                  <textarea
                    dir="ltr"
                    rows={4}
                    value={kitUrlsRaw}
                    onChange={(e) => setKitUrlsRaw(e.target.value)}
                    placeholder={'https://www.amazon.com/dp/B0AAA11111\nhttps://www.amazon.com/dp/B0BBB22222'}
                    className="w-full px-4 py-3 rounded-xl border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 font-mono"
                    style={{ borderColor: 'rgba(15,23,42,0.12)' }}
                    data-landed-kit-urls="1"
                  />
                </label>

                {kitParsed.length > 0 && (
                  <div
                    className="space-y-2"
                    data-landed-kit-lines={String(kitParsed.length)}
                  >
                    <div className="text-xs font-semibold" style={{ color: 'var(--shopli-navy)' }}>
                      מחיר לכל פריט בערכה ({kitParsed.length} קישורים שנקלטו
                      {kitParsed.length >= KIT_MAX ? ' · מקס׳ 5' : ''})
                    </div>
                    {kitParsed.map((p, i) => (
                      <div
                        key={`${p.canonicalUrl || p.host}-${i}`}
                        className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-2 items-center rounded-xl border px-3 py-2"
                        style={{ borderColor: 'rgba(15,23,42,0.1)' }}
                        data-kit-line={String(i)}
                        data-landed-url-parsed={p.source}
                        data-landed-product-id={p.productId || ''}
                      >
                        <div className="text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
                          <strong style={{ color: 'var(--shopli-navy)' }}>{sourceLabelHe(p.source)}</strong>
                          {' · '}
                          <span dir="ltr">{p.productId || p.host}</span>
                        </div>
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="0.01"
                          dir="ltr"
                          value={kitPrices[i] || ''}
                          onChange={(e) => setKitPriceAt(i, e.target.value)}
                          placeholder="40.00"
                          className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                          style={{ borderColor: 'rgba(15,23,42,0.12)' }}
                          data-kit-price-input={String(i)}
                          required={i < 2}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <label className="block">
                  <span className="text-sm font-semibold mb-1.5 block" style={{ color: 'var(--shopli-navy)' }}>
                    מטבע (לכל פריטי הערכה)
                  </span>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full sm:w-48 px-4 py-3 rounded-xl border text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    style={{ borderColor: 'rgba(15,23,42,0.12)' }}
                    data-landed-currency-input="1"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="ILS">ILS (₪)</option>
                  </select>
                </label>
              </>
            )}

            <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--shopli-navy)' }}>
              <input
                type="checkbox"
                checked={freeShipping}
                onChange={(e) => setFreeShipping(e.target.checked)}
                className="rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                data-landed-free-shipping="1"
              />
              משלוח חינם
            </label>

            {!freeShipping && (
              <label className="block">
                <span className="text-sm font-semibold mb-1.5 block" style={{ color: 'var(--shopli-navy)' }}>
                  עלות משלוח (₪){mode === 'kit' ? ' · לערכה כולה' : ''}
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  dir="ltr"
                  value={shippingIls}
                  onChange={(e) => setShippingIls(e.target.value)}
                  placeholder="35"
                  className="w-full px-4 py-3 rounded-xl border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  style={{ borderColor: 'rgba(15,23,42,0.12)' }}
                  data-landed-shipping-input="1"
                />
              </label>
            )}

            <button type="submit" className="btn-primary w-full sm:w-auto">
              <Icon name="tag" size={16} />
              {mode === 'kit' ? 'חשבו עלות ערכה לארץ' : 'חשבו עלות לארץ'}
            </button>
          </form>

          {mode === 'kit' ? (
            canQuoteKit ? (
              <div
                data-landed-quote="1"
                data-landed-kit="1"
                data-kit-sku-count={String(kitSkusWithShip.length)}
                data-active-duty-band={activeBand || ''}
                data-kit-tipping={tipping.tipped ? '1' : '0'}
              >
                <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--shopli-navy)' }}>
                  הצעת מחיר לערכה ({kitSkusWithShip.length} פריטים)
                </h2>
                {tipping.tipped && (
                  <aside
                    className="rounded-xl border p-3 mb-4"
                    style={{
                      borderColor: 'rgba(245,158,11,0.45)',
                      background: 'rgba(245,158,11,0.08)',
                    }}
                    data-kit-tipping="1"
                    data-kit-tipping-foil="single-sku-miss"
                  >
                    <div className="text-sm font-bold mb-1" style={{ color: '#b45309' }}>
                      זהירות · פריט בודד מפספס את הטיפ של הערכה
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--shopli-warm-gray)' }}>
                      {tipCopy}
                    </p>
                  </aside>
                )}
                <LandedCostBadge
                  variant="full"
                  scope="kit"
                  skus={kitSkusWithShip}
                />
                <p className="text-xs mt-2" style={{ color: 'var(--shopli-warm-gray)' }}>
                  שער הערכה מתועד: {USD_TO_ILS_RATE.toFixed(2)} ₪/$ (≈ BoI יציג + {FX_PCT}%). החיוב בפועל
                  נקבע ברשות המסים ביום השחרור — לא פיד חי. מע״ם בישראל {VAT_PCT}% — לא 17%.
                </p>
                <p className="text-xs font-semibold mt-1" dir="ltr" data-vat-foil-en="18-not-17">
                  {vatFoilEn}
                </p>
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'var(--shopli-warm-gray)' }} data-landed-quote="empty-kit">
                הדביקו לפחות 2 קישורים תקינים והזינו מחיר לכל פריט כדי לגלגל מול תקרת ה-$
                {DUTY_FREE_THRESHOLD_USD}.
              </p>
            )
          ) : canQuoteSingle ? (
            <div data-landed-quote="1" data-active-duty-band={activeBand || ''}>
              <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--shopli-navy)' }}>
                הצעת מחיר משוערת לדלת
              </h2>
              <LandedCostBadge
                variant="full"
                price={priceNum}
                currency={currency}
                freeShipping={freeShipping}
                shippingIls={shipNum}
              />
              <p className="text-xs mt-2" style={{ color: 'var(--shopli-warm-gray)' }}>
                שער הערכה מתועד: {USD_TO_ILS_RATE.toFixed(2)} ₪/$ (≈ BoI יציג + {FX_PCT}%). החיוב בפועל
                נקבע ברשות המסים ביום השחרור — לא פיד חי. מע״ם בישראל {VAT_PCT}% — לא 17%.
              </p>
              <p className="text-xs font-semibold mt-1" dir="ltr" data-vat-foil-en="18-not-17">
                {vatFoilEn}
              </p>
            </div>
          ) : (
            <p className="text-sm" style={{ color: 'var(--shopli-warm-gray)' }} data-landed-quote="empty">
              הזינו מחיר מוצר כדי לראות את פירוט המע״ם והסה״כ לארץ.
            </p>
          )}

          <p className="text-xs mt-10 leading-relaxed" style={{ color: 'var(--shopli-warm-gray)' }}>
            הערה: שופלי אינה רשות המסים. המחשבון משקף כללי יבוא אישי נפוצים (פטור מתחת ל-$
            {DUTY_FREE_THRESHOLD_USD} על ערך הסחורה בלבד; מע״ם {VAT_PCT}% על סחורה+משלוח בפס $
            {DUTY_FREE_THRESHOLD_USD}–${DUTY_WAIVER_CEILING_USD} עם ויתור מכס) ואת חותמת שער המכס לרשומון
            לפי Skills IL customs {SKILLS_IL} + shekel {SKILLS_SHEKEL} · {SKILLS_STAMP}. מכס מעל $
            {DUTY_WAIVER_CEILING_USD} / מס קנייה לפי HS לא ממודל כאן. מע״ם בישראל {VAT_PCT}% — לא 17%.
            בערכה — הסף על סכום ה־SKU, לא על כל שורה בנפרד.
          </p>
        </section>
      </main>

      <Footer currentRegion="il" />
    </>
  );
}
