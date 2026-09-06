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
} from '../lib/landed-cost';
import {
  parseProductUrl,
  customsStampCopyHe,
  dutyWaiverBandRows,
  classifyDutyWaiverBand,
  type ParsedProductUrl,
} from '../lib/landed-url';

const PAGE_URL = `${SITE_URL}/landed`;
const VAT_PCT = Math.round(IL_VAT_RATE * 100);
const FX_PCT = (BOI_CUSTOMS_FX_UPLIFT * 100).toFixed(1);
const SKILLS_IL = 'v1.4.0';

function sourceLabelHe(source: ParsedProductUrl['source']): string {
  if (source === 'amazon') return 'Amazon';
  if (source === 'aliexpress') return 'AliExpress';
  return 'קישור מוצר';
}

/**
 * /landed — paste Amazon/product URL → IL landed-cost quote.
 * Moat: surfaces $75 ptur + $75–$500 VAT-only duty-waiver bands with
 * 18% + BoI+0.5% stamp (Skills IL v1.4.0 Sep 6; foil iWishBag 17% body vs 18% table).
 * Estimator math is unchanged from #18/#19/#20.
 */
export default function LandedPage() {
  const router = useRouter();
  const [urlInput, setUrlInput] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [shippingIls, setShippingIls] = useState('');
  const [freeShipping, setFreeShipping] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  // Prefill from shareable ?url=&price=&currency=
  useEffect(() => {
    if (!router.isReady || hydrated) return;
    const q = router.query;
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
  const priceNum = Number(price);
  const shipNum = freeShipping ? 0 : Math.max(0, Number(shippingIls) || 0);
  const canQuote = Number.isFinite(priceNum) && priceNum > 0;

  const quoteEst = useMemo(() => {
    if (!canQuote) return null;
    return estimateLandedCost({
      price: priceNum,
      currency,
      freeShipping,
      shippingIls: shipNum,
    });
  }, [canQuote, priceNum, currency, freeShipping, shipNum]);

  const activeBand = quoteEst ? classifyDutyWaiverBand(quoteEst.usdPrice) : null;
  const bands = useMemo(() => dutyWaiverBandRows(), []);

  const syncQuery = useCallback(() => {
    if (!router.isReady) return;
    const next: Record<string, string> = {};
    if (urlInput.trim()) next.url = urlInput.trim();
    if (price.trim()) next.price = price.trim();
    if (currency && currency !== 'USD') next.currency = currency;
    if (!freeShipping && shippingIls.trim()) next.shippingIls = shippingIls.trim();
    router.replace({ pathname: '/landed', query: next }, undefined, { shallow: true });
  }, [router, urlInput, price, currency, freeShipping, shippingIls]);

  const stamp = customsStampCopyHe();

  return (
    <>
      <SeoHead
        region="il"
        path="/landed"
        canonical={PAGE_URL}
        hreflang={false}
        title={`מחשבון עלות לישראל — פטור $${DUTY_FREE_THRESHOLD_USD} · מע״ם ${VAT_PCT}% · BoI+${FX_PCT}% | Shopli`}
        description={`הדביקו קישור Amazon / מוצר וקבלו הצעת מחיר לארץ: פטור $${DUTY_FREE_THRESHOLD_USD}, פס $${DUTY_FREE_THRESHOLD_USD}–$${DUTY_WAIVER_CEILING_USD} מע״ם בלבד (ויתור מכס), חותמת Skills IL ${SKILLS_IL} (מע״ם ${VAT_PCT}% · שער יציג בנק ישראל + ${FX_PCT}%). לא 17%.`}
      />
      <Header currentRegion="il" dir="rtl" />

      <main
        dir="rtl"
        className="min-h-screen"
        style={{ fontFamily: 'var(--font-assistant), system-ui, sans-serif' }}
        data-page="landed"
        data-skills-il={SKILLS_IL}
        data-duty-bands="ptur-vat-waiver"
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
            הדביקו קישור → הצעת מחיר לישראל
          </h1>
          <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--shopli-warm-gray)' }}>
            מחשבון עלות כוללת ליבוא אישי: תקרת פטור ${DUTY_FREE_THRESHOLD_USD}, פס ויתור מכס $
            {DUTY_FREE_THRESHOLD_USD}–${DUTY_WAIVER_CEILING_USD} (מע״ם {VAT_PCT}% בלבד), וחותמת שער מכס
            (שער יציג בנק ישראל + {FX_PCT}% לרשומון) לפי Skills IL {SKILLS_IL} — בלי סקרייפ חי מ־Amazon.
          </p>

          {/* Customs stamp callout */}
          <aside
            className="rounded-xl border p-3 sm:p-4 mb-6"
            style={{
              borderColor: 'rgba(249,115,22,0.35)',
              background: 'rgba(249,115,22,0.07)',
            }}
            data-customs-stamp="boi-plus-0.5"
            data-vat-rate={String(VAT_PCT)}
            data-skills-il={SKILLS_IL}
          >
            <div
              className="flex items-start gap-2 text-sm font-bold mb-1"
              style={{ color: 'var(--shopli-navy)' }}
            >
              <Icon name="shield" size={16} className="shrink-0 mt-0.5" />
              <span>
                חותמת מכס · מע״ם {VAT_PCT}% · BoI + {FX_PCT}% · Skills IL {SKILLS_IL}
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--shopli-warm-gray)' }}>
              {stamp}
            </p>
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

          <form
            className="space-y-4 mb-8"
            onSubmit={(e) => {
              e.preventDefault();
              syncQuery();
            }}
          >
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
                  עלות משלוח (₪)
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
              חשבו עלות לארץ
            </button>
          </form>

          {canQuote ? (
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
                נקבע ברשות המסים ביום השחרור — לא פיד חי.
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
            לפי Skills IL {SKILLS_IL}. מכס מעל ${DUTY_WAIVER_CEILING_USD} / מס קנייה לפי HS לא ממודל כאן.
          </p>
        </section>
      </main>

      <Footer currentRegion="il" />
    </>
  );
}
