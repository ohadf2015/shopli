import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
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
  IWISHBAG_AMAZON_IL_URL,
  IWISHBAG_PAGE_LAST_UPDATED,
  IWISHBAG_BODY_STILL_WRONG_VERIFIED,
  iwishbagSideBySideRows,
  iwishbagBodyStillWrongHeadlineEn,
  iwishbagSideBySideIntroHe,
  DUTYDECODER_IL_URL,
  DUTYDECODER_STALE_17_VERIFIED,
  dutyDecoderSideBySideRows,
  dutyDecoderStale17HeadlineEn,
  dutyDecoderSideBySideIntroHe,
  GATEWAYLINES_TARIFF_URL,
  GATEWAYLINES_STALE_17_VERIFIED,
  gatewayLinesSideBySideRows,
  gatewayLinesStale17HeadlineEn,
  gatewayLinesSideBySideIntroHe,
  TAX_AUTHORITY_VAT_CITE_URL,
  TAX_AUTHORITY_VAT_RATE_PCT,
  VAT_TRUTH_LAST_CHECKED,
  vatTruthCompetitorsStill17ProofRows,
  taxAuthorityVat18CiteEn,
  vatTruthLastCheckedStampEn,
  vatTruthHeadlineEn,
  vatTruthIntroHe,
  IWISHBAG_ETSY_IL_URL,
  IWISHBAG_FLIPKART_IL_URL,
  IWISHBAG_ALIEXPRESS_IL_URL,
  IWISHBAG_WALMART_IL_URL,
  IWISHBAG_EBAY_IL_URL,
  IWISHBAG_FLIPKART_ETSY_SELF_CONTRADICTION_VERIFIED,
  iwishbagFlipkartEtsySelfContradictionRows,
  iwishbagFlipkartEtsySelfContradictionHeadlineEn,
  iwishbagFlipkartEtsySelfContradictionIntroHe,
  IWISHBAG_ALIEXPRESS_WALMART_EBAY_SELF_CONTRADICTION_VERIFIED,
  iwishbagAliexpressWalmartEbaySelfContradictionRows,
  iwishbagAliexpressWalmartEbaySelfContradictionHeadlineEn,
  iwishbagAliexpressWalmartEbaySelfContradictionIntroHe,
  IWISHBAG_TARGET_IL_URL,
  IWISHBAG_TARGET_SELF_CONTRADICTION_VERIFIED,
  iwishbagTargetSelfContradictionRows,
  iwishbagTargetSelfContradictionHeadlineEn,
  iwishbagTargetSelfContradictionIntroHe,
  IWISHBAG_AMAZONUS_SELF_CONTRADICTION_VERIFIED,
  iwishbagAmazonUsSelfContradictionRows,
  iwishbagAmazonUsSelfContradictionHeadlineEn,
  iwishbagAmazonUsSelfContradictionIntroHe,
  RATESHIPS_IL_URL,
  RATESHIPS_STALE_17_VERIFIED,
  rateShipsSideBySideRows,
  rateShipsStale17HeadlineEn,
  rateShipsSideBySideIntroHe,
  PTUR_THRESHOLD_CHURN_LAST_CHECKED,
  PTUR_OFFICIAL_USD,
  PTUR_CHURN_130_USD,
  SKILLS_IL_CUSTOMS_CALC_URL,
  OPENACCOUNTANTS_IL_CUSTOMS_URL,
  GOV_IL_PERSONAL_IMPORT_CALC_URL,
  pturThresholdChurnRows,
  pturThresholdChurnHeadlineEn,
  pturThresholdChurnLastCheckedStampEn,
  pturOfficial75CiteEn,
  pturThresholdChurnIntroHe,
  MARKETPLACE_HOW_TOS,
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
 * bands after #21; Skills IL customs v1.4.0 + shekel v2.2.0 Sep 22 stamp;
 * explicit "Israel VAT is 18% not 17%" foil vs iWishBag Apr 29 body bug (#24);
 * side-by-side iWishBag 「17% body still wrong」 foil (verified Sep 7 night);
 * DutyDecoder /israel stale 17% foil (#38, verified Sep 15);
 * Gateway Lines tariff 「מע״מ(17%)」 foil (#39, kept);
 * durable VAT-truth moat: Tax Authority 18% cite + last-checked stamp +
 * live 「competitors still 17%」 proof row (#40, kept);
 * iWishBag Flipkart+Etsy→IL body 「17% VAT」 vs own table 18% self-contradiction
 * strip (#41, kept; moat 2026-09-15 14:15 #3; Last updated 2026-04-29 still live);
 * iWishBag AliExpress+Walmart+eBay→IL body 「17% VAT」 vs own table 18%
 * self-contradiction strip (#42, kept; moat 2026-09-15 16:35 #2);
 * personal-import threshold-churn honesty strip — official $75 ptur +
 * documented 2026 $75↔$130 flip-flops (Skills IL / OpenAccountants) +
 * last-checked stamp (#43, kept; moat 2026-09-21 16:30 #7); 「17% body still wrong」
 * secondary cite only — do not redo #41/#42 as primary;
 * iWishBag Target→IL body 「17% VAT」 vs own table 18% self-contradiction
 * strip (#44, kept; moat 2026-09-21 18:45 #2; Last updated 2026-04-29 still live);
 * RateShips /en/customs/israel whole-page 「VAT 17%」 foil (title + Quick Facts +
 * FAQ + estimate-table 17% math; #46, kept; moat 2026-09-22) — distinct from DutyDecoder
 * #38 / Gateway #39 / Target #44 / marketplace how-tos;
 * iWishBag Amazon US→IL body 「17% VAT」 vs own table 18% self-contradiction
 * strip (moat 2026-09-23 08:15 #2; Last updated 2026-04-29 still live) — distinct
 * from Target #44 / RateShips #46 / Gateway #47 bump / Amazon US how-to #34;
 * ITA Shaar Olami calculator foil (#23) kept. Presentation only.
 * Marketplace Etsy/eBay/Walmart/AliExpress/Amazon JP/Shein/Temu/Flipkart/
 * Amazon US/Amazon India→IL how-tos reuse iWishBag foil (#26–#36).
 * Estimator math unchanged (#18–#47, still 18%). Keep #19–#47; Skills IL
 * Sep 22 still v1.4.0 + BoI+0.5% (context only).
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
  const iwishbagRows = iwishbagSideBySideRows();
  const iwishbagHeadline = iwishbagBodyStillWrongHeadlineEn();
  const iwishbagIntro = iwishbagSideBySideIntroHe();
  const dutyDecoderRows = dutyDecoderSideBySideRows();
  const dutyDecoderHeadline = dutyDecoderStale17HeadlineEn();
  const dutyDecoderIntro = dutyDecoderSideBySideIntroHe();
  const gatewayLinesRows = gatewayLinesSideBySideRows();
  const gatewayLinesHeadline = gatewayLinesStale17HeadlineEn();
  const gatewayLinesIntro = gatewayLinesSideBySideIntroHe();
  const vatTruthRows = vatTruthCompetitorsStill17ProofRows();
  const vatTruthHeadline = vatTruthHeadlineEn();
  const vatTruthIntro = vatTruthIntroHe();
  const taxAuthCite = taxAuthorityVat18CiteEn();
  const vatTruthStamp = vatTruthLastCheckedStampEn();
  const flipkartEtsyRows = iwishbagFlipkartEtsySelfContradictionRows();
  const flipkartEtsyHeadline = iwishbagFlipkartEtsySelfContradictionHeadlineEn();
  const flipkartEtsyIntro = iwishbagFlipkartEtsySelfContradictionIntroHe();
  const aliexpressWalmartEbayRows = iwishbagAliexpressWalmartEbaySelfContradictionRows();
  const aliexpressWalmartEbayHeadline = iwishbagAliexpressWalmartEbaySelfContradictionHeadlineEn();
  const aliexpressWalmartEbayIntro = iwishbagAliexpressWalmartEbaySelfContradictionIntroHe();
  const targetRows = iwishbagTargetSelfContradictionRows();
  const targetHeadline = iwishbagTargetSelfContradictionHeadlineEn();
  const targetIntro = iwishbagTargetSelfContradictionIntroHe();
  const amazonUsRows = iwishbagAmazonUsSelfContradictionRows();
  const amazonUsHeadline = iwishbagAmazonUsSelfContradictionHeadlineEn();
  const amazonUsIntro = iwishbagAmazonUsSelfContradictionIntroHe();
  const rateShipsRows = rateShipsSideBySideRows();
  const rateShipsHeadline = rateShipsStale17HeadlineEn();
  const rateShipsIntro = rateShipsSideBySideIntroHe();
  const pturChurnRows = pturThresholdChurnRows();
  const pturChurnHeadline = pturThresholdChurnHeadlineEn();
  const pturChurnIntro = pturThresholdChurnIntroHe();
  const pturOfficialCite = pturOfficial75CiteEn();
  const pturChurnStamp = pturThresholdChurnLastCheckedStampEn();
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
        data-iwishbag-side-by-side-foil="1"
        data-iwishbag-body-still-wrong={IWISHBAG_BODY_STILL_WRONG_VERIFIED}
        data-dutydecoder-side-by-side-foil="1"
        data-dutydecoder-stale-17={DUTYDECODER_STALE_17_VERIFIED}
        data-gatewaylines-side-by-side-foil="1"
        data-gatewaylines-stale-17={GATEWAYLINES_STALE_17_VERIFIED}
        data-vat-truth-moat="1"
        data-tax-authority-vat-cite={String(TAX_AUTHORITY_VAT_RATE_PCT)}
        data-vat-truth-last-checked={VAT_TRUTH_LAST_CHECKED}
        data-iwishbag-flipkart-etsy-self-contradiction="1"
        data-iwishbag-flipkart-etsy-verified={IWISHBAG_FLIPKART_ETSY_SELF_CONTRADICTION_VERIFIED}
        data-iwishbag-aliexpress-walmart-ebay-self-contradiction="1"
        data-iwishbag-aliexpress-walmart-ebay-verified={IWISHBAG_ALIEXPRESS_WALMART_EBAY_SELF_CONTRADICTION_VERIFIED}
        data-iwishbag-target-self-contradiction="1"
        data-iwishbag-target-verified={IWISHBAG_TARGET_SELF_CONTRADICTION_VERIFIED}
        data-iwishbag-amazonus-self-contradiction="1"
        data-iwishbag-amazonus-verified={IWISHBAG_AMAZONUS_SELF_CONTRADICTION_VERIFIED}
        data-rateships-side-by-side-foil="1"
        data-rateships-stale-17={RATESHIPS_STALE_17_VERIFIED}
        data-ptur-threshold-churn="1"
        data-ptur-official-usd={String(PTUR_OFFICIAL_USD)}
        data-ptur-threshold-churn-last-checked={PTUR_THRESHOLD_CHURN_LAST_CHECKED}
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

          {/* Customs stamp callout — 18% not 17% + BoI+0.5% · Sep 22 restamp */}
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

          {/* Side-by-side iWishBag honesty foil — 17% body still wrong (Sep 7 night) */}
          <aside
            className="rounded-xl border p-3 sm:p-4 mb-6"
            style={{
              borderColor: 'rgba(220,38,38,0.28)',
              background: 'rgba(254,242,242,0.65)',
            }}
            data-iwishbag-side-by-side-foil="1"
            data-iwishbag-url={IWISHBAG_AMAZON_IL_URL}
            data-iwishbag-last-updated={IWISHBAG_PAGE_LAST_UPDATED}
            data-iwishbag-body-still-wrong={IWISHBAG_BODY_STILL_WRONG_VERIFIED}
            data-vat-honesty-foil="18-not-17"
          >
            <div
              className="flex items-start gap-2 text-sm font-bold mb-1"
              style={{ color: 'var(--shopli-navy)' }}
            >
              <Icon name="shield" size={16} className="shrink-0 mt-0.5" />
              <span>Side-by-side · iWishBag 「17% body still wrong」</span>
            </div>
            <p
              className="text-xs font-bold mb-2"
              style={{ color: '#b91c1c' }}
              dir="ltr"
              data-iwishbag-headline="body-still-wrong"
            >
              {iwishbagHeadline}
            </p>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--shopli-warm-gray)' }}>
              {iwishbagIntro}{' '}
              <a
                href={IWISHBAG_AMAZON_IL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline-offset-2 hover:underline"
                style={{ color: 'var(--shopli-orange)' }}
                data-iwishbag-foil-link="1"
              >
                iWishBag Amazon→IL
                <Icon name="external" size={11} className="inline-block ms-1 align-middle" />
              </a>
            </p>
            <div className="overflow-x-auto" dir="ltr">
              <table
                className="w-full text-left text-xs border-collapse"
                data-iwishbag-side-by-side-table="1"
              >
                <thead>
                  <tr style={{ color: 'var(--shopli-navy)' }}>
                    <th className="py-1.5 pe-2 font-bold border-b" style={{ borderColor: 'rgba(15,23,42,0.12)' }}>
                      Claim
                    </th>
                    <th className="py-1.5 px-2 font-bold border-b" style={{ borderColor: 'rgba(15,23,42,0.12)' }}>
                      Shopli /landed
                    </th>
                    <th className="py-1.5 ps-2 font-bold border-b" style={{ borderColor: 'rgba(15,23,42,0.12)' }}>
                      iWishBag
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {iwishbagRows.map((row) => (
                    <tr
                      key={row.id}
                      data-iwishbag-row={row.id}
                      {...(row.iwishbagWrong ? { 'data-iwishbag-wrong': '1' } : {})}
                    >
                      <td
                        className="py-1.5 pe-2 align-top font-semibold"
                        style={{ color: 'var(--shopli-navy)' }}
                      >
                        {row.labelEn}
                      </td>
                      <td
                        className="py-1.5 px-2 align-top"
                        style={{ color: 'var(--shopli-warm-gray)' }}
                        data-shopli-cell={row.id}
                      >
                        {row.shopliEn}
                      </td>
                      <td
                        className="py-1.5 ps-2 align-top font-semibold"
                        style={{
                          color: row.iwishbagWrong ? '#b91c1c' : 'var(--shopli-warm-gray)',
                        }}
                        data-iwishbag-cell={row.id}
                      >
                        {row.iwishbagEn}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p
              className="text-[11px] mt-2 font-semibold"
              dir="ltr"
              style={{ color: 'var(--shopli-navy)' }}
              data-vat-foil-en="18-not-17"
            >
              {vatFoilEn} Keep #19 / #23 / #24.
            </p>
          </aside>

          {/* Side-by-side DutyDecoder honesty foil — stale 17% vs real 18% (Sep 15) */}
          <aside
            className="rounded-xl border p-3 sm:p-4 mb-6"
            style={{
              borderColor: 'rgba(220,38,38,0.28)',
              background: 'rgba(254,242,242,0.65)',
            }}
            data-dutydecoder-side-by-side-foil="1"
            data-dutydecoder-url={DUTYDECODER_IL_URL}
            data-dutydecoder-stale-17={DUTYDECODER_STALE_17_VERIFIED}
            data-vat-honesty-foil="18-not-17"
          >
            <div
              className="flex items-start gap-2 text-sm font-bold mb-1"
              style={{ color: 'var(--shopli-navy)' }}
            >
              <Icon name="shield" size={16} className="shrink-0 mt-0.5" />
              <span>Side-by-side · DutyDecoder 「still 17%」</span>
            </div>
            <p
              className="text-xs font-bold mb-2"
              style={{ color: '#b91c1c' }}
              dir="ltr"
              data-dutydecoder-headline="stale-17"
            >
              {dutyDecoderHeadline}
            </p>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--shopli-warm-gray)' }}>
              {dutyDecoderIntro}{' '}
              <a
                href={DUTYDECODER_IL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline-offset-2 hover:underline"
                style={{ color: 'var(--shopli-orange)' }}
                data-dutydecoder-foil-link="1"
              >
                dutydecoder.com/israel
                <Icon name="external" size={11} className="inline-block ms-1 align-middle" />
              </a>
            </p>
            <div className="overflow-x-auto" dir="ltr">
              <table
                className="w-full text-left text-xs border-collapse"
                data-dutydecoder-side-by-side-table="1"
              >
                <thead>
                  <tr style={{ color: 'var(--shopli-navy)' }}>
                    <th className="py-1.5 pe-2 font-bold border-b" style={{ borderColor: 'rgba(15,23,42,0.12)' }}>
                      Claim
                    </th>
                    <th className="py-1.5 px-2 font-bold border-b" style={{ borderColor: 'rgba(15,23,42,0.12)' }}>
                      Shopli /landed
                    </th>
                    <th className="py-1.5 ps-2 font-bold border-b" style={{ borderColor: 'rgba(15,23,42,0.12)' }}>
                      DutyDecoder
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dutyDecoderRows.map((row) => (
                    <tr
                      key={row.id}
                      data-dutydecoder-row={row.id}
                      {...(row.dutyDecoderWrong ? { 'data-dutydecoder-wrong': '1' } : {})}
                    >
                      <td
                        className="py-1.5 pe-2 align-top font-semibold"
                        style={{ color: 'var(--shopli-navy)' }}
                      >
                        {row.labelEn}
                      </td>
                      <td
                        className="py-1.5 px-2 align-top"
                        style={{ color: 'var(--shopli-warm-gray)' }}
                        data-shopli-cell={row.id}
                      >
                        {row.shopliEn}
                      </td>
                      <td
                        className="py-1.5 ps-2 align-top font-semibold"
                        style={{
                          color: row.dutyDecoderWrong ? '#b91c1c' : 'var(--shopli-warm-gray)',
                        }}
                        data-dutydecoder-cell={row.id}
                      >
                        {row.dutyDecoderEn}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p
              className="text-[11px] mt-2 font-semibold"
              dir="ltr"
              style={{ color: 'var(--shopli-navy)' }}
              data-vat-foil-en="18-not-17"
            >
              {vatFoilEn} Foil dutydecoder.com/israel stale 17%. Keep #19 / #23–#25 / #36.
            </p>
          </aside>

          {/* Side-by-side Gateway Lines honesty foil — מע״מ(17%) vs real 18% (Sep 22 lastChecked) */}
          <aside
            className="rounded-xl border p-3 sm:p-4 mb-6"
            style={{
              borderColor: 'rgba(220,38,38,0.28)',
              background: 'rgba(254,242,242,0.65)',
            }}
            data-gatewaylines-side-by-side-foil="1"
            data-gatewaylines-url={GATEWAYLINES_TARIFF_URL}
            data-gatewaylines-stale-17={GATEWAYLINES_STALE_17_VERIFIED}
            data-vat-honesty-foil="18-not-17"
          >
            <div
              className="flex items-start gap-2 text-sm font-bold mb-1"
              style={{ color: 'var(--shopli-navy)' }}
            >
              <Icon name="shield" size={16} className="shrink-0 mt-0.5" />
              <span>Side-by-side · Gateway Lines 「מע״מ(17%)」</span>
            </div>
            <p
              className="text-xs font-bold mb-2"
              style={{ color: '#b91c1c' }}
              dir="ltr"
              data-gatewaylines-headline="stale-17"
            >
              {gatewayLinesHeadline}
            </p>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--shopli-warm-gray)' }}>
              {gatewayLinesIntro}{' '}
              <a
                href={GATEWAYLINES_TARIFF_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline-offset-2 hover:underline"
                style={{ color: 'var(--shopli-orange)' }}
                data-gatewaylines-foil-link="1"
              >
                tariff.gatewaylines.co.il
                <Icon name="external" size={11} className="inline-block ms-1 align-middle" />
              </a>
            </p>
            <div className="overflow-x-auto" dir="ltr">
              <table
                className="w-full text-left text-xs border-collapse"
                data-gatewaylines-side-by-side-table="1"
              >
                <thead>
                  <tr style={{ color: 'var(--shopli-navy)' }}>
                    <th className="py-1.5 pe-2 font-bold border-b" style={{ borderColor: 'rgba(15,23,42,0.12)' }}>
                      Claim
                    </th>
                    <th className="py-1.5 px-2 font-bold border-b" style={{ borderColor: 'rgba(15,23,42,0.12)' }}>
                      Shopli /landed
                    </th>
                    <th className="py-1.5 ps-2 font-bold border-b" style={{ borderColor: 'rgba(15,23,42,0.12)' }}>
                      Gateway Lines
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {gatewayLinesRows.map((row) => (
                    <tr
                      key={row.id}
                      data-gatewaylines-row={row.id}
                      {...(row.gatewayLinesWrong ? { 'data-gatewaylines-wrong': '1' } : {})}
                    >
                      <td
                        className="py-1.5 pe-2 align-top font-semibold"
                        style={{ color: 'var(--shopli-navy)' }}
                      >
                        {row.labelEn}
                      </td>
                      <td
                        className="py-1.5 px-2 align-top"
                        style={{ color: 'var(--shopli-warm-gray)' }}
                        data-shopli-cell={row.id}
                      >
                        {row.shopliEn}
                      </td>
                      <td
                        className="py-1.5 ps-2 align-top font-semibold"
                        style={{
                          color: row.gatewayLinesWrong ? '#b91c1c' : 'var(--shopli-warm-gray)',
                        }}
                        data-gatewaylines-cell={row.id}
                      >
                        {row.gatewayLinesEn}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p
              className="text-[11px] mt-2 font-semibold"
              dir="ltr"
              style={{ color: 'var(--shopli-navy)' }}
              data-vat-foil-en="18-not-17"
            >
              {vatFoilEn} Foil tariff.gatewaylines.co.il 「מע״מ(17%)」. Keep #19 / #23–#25 / #36 / #38.
            </p>
          </aside>

          {/* Durable VAT-truth moat — Tax Authority 18% cite + last-checked + competitors still 17% */}
          <aside
            className="rounded-xl border p-3 sm:p-4 mb-6"
            style={{
              borderColor: 'rgba(22,163,74,0.35)',
              background: 'rgba(240,253,244,0.75)',
            }}
            data-vat-truth-moat="1"
            data-tax-authority-vat-cite-url={TAX_AUTHORITY_VAT_CITE_URL}
            data-tax-authority-vat-rate={String(TAX_AUTHORITY_VAT_RATE_PCT)}
            data-vat-truth-last-checked={VAT_TRUTH_LAST_CHECKED}
            data-vat-honesty-foil="18-not-17"
          >
            <div
              className="flex items-start gap-2 text-sm font-bold mb-1"
              style={{ color: 'var(--shopli-navy)' }}
            >
              <Icon name="shield" size={16} className="shrink-0 mt-0.5" />
              <span>VAT truth · Tax Authority {TAX_AUTHORITY_VAT_RATE_PCT}% cite</span>
            </div>
            <p
              className="text-xs font-bold mb-2"
              style={{ color: 'var(--shopli-navy)' }}
              dir="ltr"
              data-vat-truth-headline="1"
            >
              {vatTruthHeadline}
            </p>
            <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--shopli-warm-gray)' }}>
              {vatTruthIntro}
            </p>
            <p
              className="text-xs font-semibold mb-1"
              dir="ltr"
              style={{ color: 'var(--shopli-navy)' }}
              data-tax-authority-vat-cite="1"
            >
              {taxAuthCite}{' '}
              <a
                href={TAX_AUTHORITY_VAT_CITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline-offset-2 hover:underline"
                style={{ color: 'var(--shopli-orange)' }}
                data-tax-authority-cite-link="1"
              >
                gov.il · מע״מ
                <Icon name="external" size={11} className="inline-block ms-1 align-middle" />
              </a>
            </p>
            <p
              className="text-[11px] font-semibold mb-3"
              dir="ltr"
              style={{ color: 'var(--shopli-warm-gray)' }}
              data-vat-truth-last-checked-stamp="1"
            >
              {vatTruthStamp}
            </p>
            <div className="overflow-x-auto" dir="ltr">
              <table
                className="w-full text-left text-xs border-collapse"
                data-vat-truth-competitors-still-17-table="1"
              >
                <thead>
                  <tr style={{ color: 'var(--shopli-navy)' }}>
                    <th className="py-1.5 pe-2 font-bold border-b" style={{ borderColor: 'rgba(15,23,42,0.12)' }}>
                      Competitor
                    </th>
                    <th className="py-1.5 px-2 font-bold border-b" style={{ borderColor: 'rgba(15,23,42,0.12)' }}>
                      Live claim
                    </th>
                    <th className="py-1.5 ps-2 font-bold border-b" style={{ borderColor: 'rgba(15,23,42,0.12)' }}>
                      Proof
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vatTruthRows.map((row) => (
                    <tr
                      key={row.id}
                      data-vat-truth-proof-row={row.id}
                      {...(row.stillWrong ? { 'data-competitors-still-17': '1' } : {})}
                    >
                      <td
                        className="py-1.5 pe-2 align-top font-semibold"
                        style={{ color: 'var(--shopli-navy)' }}
                      >
                        {row.competitorEn}
                      </td>
                      <td
                        className="py-1.5 px-2 align-top font-semibold"
                        style={{
                          color: row.stillWrong ? '#b91c1c' : 'var(--shopli-warm-gray)',
                        }}
                        data-vat-truth-claim={row.id}
                      >
                        {row.claimEn}
                      </td>
                      <td className="py-1.5 ps-2 align-top">
                        <a
                          href={row.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold underline-offset-2 hover:underline"
                          style={{ color: 'var(--shopli-orange)' }}
                          data-vat-truth-proof-link={row.id}
                        >
                          live
                          <Icon name="external" size={11} className="inline-block ms-1 align-middle" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p
              className="text-[11px] mt-2 font-semibold"
              dir="ltr"
              style={{ color: 'var(--shopli-navy)' }}
              data-vat-foil-en="18-not-17"
            >
              {vatFoilEn} Durable VAT-truth moat. Gateway Lines still wrong post-#39. Keep #19 / #23–#39.
            </p>
          </aside>

          {/* iWishBag Flipkart+Etsy→IL self-contradiction strip — body 17% vs own table 18% (moat 14:15 #3) */}
          <aside
            className="rounded-xl border p-3 sm:p-4 mb-6"
            style={{
              borderColor: 'rgba(220,38,38,0.28)',
              background: 'rgba(254,242,242,0.65)',
            }}
            data-iwishbag-flipkart-etsy-self-contradiction="1"
            data-iwishbag-flipkart-url={IWISHBAG_FLIPKART_IL_URL}
            data-iwishbag-etsy-url={IWISHBAG_ETSY_IL_URL}
            data-iwishbag-last-updated={IWISHBAG_PAGE_LAST_UPDATED}
            data-iwishbag-flipkart-etsy-verified={IWISHBAG_FLIPKART_ETSY_SELF_CONTRADICTION_VERIFIED}
            data-vat-honesty-foil="18-not-17"
          >
            <div
              className="flex items-start gap-2 text-sm font-bold mb-1"
              style={{ color: 'var(--shopli-navy)' }}
            >
              <Icon name="shield" size={16} className="shrink-0 mt-0.5" />
              <span>Self-contradiction · iWishBag Flipkart+Etsy→IL</span>
            </div>
            <p
              className="text-xs font-bold mb-2"
              style={{ color: '#b91c1c' }}
              dir="ltr"
              data-iwishbag-flipkart-etsy-headline="self-contradiction"
            >
              {flipkartEtsyHeadline}
            </p>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--shopli-warm-gray)' }}>
              {flipkartEtsyIntro}{' '}
              <a
                href={IWISHBAG_FLIPKART_IL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline-offset-2 hover:underline"
                style={{ color: 'var(--shopli-orange)' }}
                data-iwishbag-flipkart-foil-link="1"
              >
                Flipkart→IL
                <Icon name="external" size={11} className="inline-block ms-1 align-middle" />
              </a>
              {' · '}
              <a
                href={IWISHBAG_ETSY_IL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline-offset-2 hover:underline"
                style={{ color: 'var(--shopli-orange)' }}
                data-iwishbag-etsy-foil-link="1"
              >
                Etsy→IL
                <Icon name="external" size={11} className="inline-block ms-1 align-middle" />
              </a>
            </p>
            <div className="overflow-x-auto" dir="ltr">
              <table
                className="w-full text-left text-xs border-collapse"
                data-iwishbag-flipkart-etsy-self-contradiction-table="1"
              >
                <thead>
                  <tr style={{ color: 'var(--shopli-navy)' }}>
                    <th className="py-1.5 pe-2 font-bold border-b" style={{ borderColor: 'rgba(15,23,42,0.12)' }}>
                      Claim
                    </th>
                    <th className="py-1.5 px-2 font-bold border-b" style={{ borderColor: 'rgba(15,23,42,0.12)' }}>
                      Shopli /landed
                    </th>
                    <th className="py-1.5 ps-2 font-bold border-b" style={{ borderColor: 'rgba(15,23,42,0.12)' }}>
                      iWishBag Flipkart+Etsy
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {flipkartEtsyRows.map((row) => (
                    <tr
                      key={row.id}
                      data-iwishbag-flipkart-etsy-row={row.id}
                      {...(row.iwishbagWrong ? { 'data-iwishbag-wrong': '1' } : {})}
                    >
                      <td
                        className="py-1.5 pe-2 align-top font-semibold"
                        style={{ color: 'var(--shopli-navy)' }}
                      >
                        {row.labelEn}
                      </td>
                      <td
                        className="py-1.5 px-2 align-top"
                        style={{ color: 'var(--shopli-warm-gray)' }}
                        data-shopli-cell={row.id}
                      >
                        {row.shopliEn}
                      </td>
                      <td
                        className="py-1.5 ps-2 align-top font-semibold"
                        style={{
                          color: row.iwishbagWrong ? '#b91c1c' : 'var(--shopli-warm-gray)',
                        }}
                        data-iwishbag-cell={row.id}
                      >
                        {row.iwishbagEn}
                        {row.liveUrl ? (
                          <>
                            {' '}
                            <a
                              href={row.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline-offset-2 hover:underline"
                              style={{ color: 'var(--shopli-orange)' }}
                              data-iwishbag-lane-link={row.id}
                            >
                              live
                              <Icon name="external" size={11} className="inline-block ms-1 align-middle" />
                            </a>
                          </>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p
              className="text-[11px] mt-2 font-semibold"
              dir="ltr"
              style={{ color: 'var(--shopli-navy)' }}
              data-vat-foil-en="18-not-17"
            >
              {vatFoilEn} Flipkart+Etsy body 「17% VAT」 vs own table 18% · Last updated{' '}
              {IWISHBAG_PAGE_LAST_UPDATED} still live. Distinct from #40 / #39. Keep #19 / #23–#41.
            </p>
          </aside>

          {/* iWishBag AliExpress+Walmart+eBay→IL self-contradiction strip — body 17% vs own table 18% (moat 16:35 #2) */}
          <aside
            className="rounded-xl border p-3 sm:p-4 mb-6"
            style={{
              borderColor: 'rgba(220,38,38,0.28)',
              background: 'rgba(254,242,242,0.65)',
            }}
            data-iwishbag-aliexpress-walmart-ebay-self-contradiction="1"
            data-iwishbag-aliexpress-url={IWISHBAG_ALIEXPRESS_IL_URL}
            data-iwishbag-walmart-url={IWISHBAG_WALMART_IL_URL}
            data-iwishbag-ebay-url={IWISHBAG_EBAY_IL_URL}
            data-iwishbag-last-updated={IWISHBAG_PAGE_LAST_UPDATED}
            data-iwishbag-aliexpress-walmart-ebay-verified={IWISHBAG_ALIEXPRESS_WALMART_EBAY_SELF_CONTRADICTION_VERIFIED}
            data-vat-honesty-foil="18-not-17"
          >
            <div
              className="flex items-start gap-2 text-sm font-bold mb-1"
              style={{ color: 'var(--shopli-navy)' }}
            >
              <Icon name="shield" size={16} className="shrink-0 mt-0.5" />
              <span>Self-contradiction · iWishBag AliExpress+Walmart+eBay→IL</span>
            </div>
            <p
              className="text-xs font-bold mb-2"
              style={{ color: '#b91c1c' }}
              dir="ltr"
              data-iwishbag-aliexpress-walmart-ebay-headline="self-contradiction"
            >
              {aliexpressWalmartEbayHeadline}
            </p>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--shopli-warm-gray)' }}>
              {aliexpressWalmartEbayIntro}{' '}
              <a
                href={IWISHBAG_ALIEXPRESS_IL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline-offset-2 hover:underline"
                style={{ color: 'var(--shopli-orange)' }}
                data-iwishbag-aliexpress-foil-link="1"
              >
                AliExpress→IL
                <Icon name="external" size={11} className="inline-block ms-1 align-middle" />
              </a>
              {' · '}
              <a
                href={IWISHBAG_WALMART_IL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline-offset-2 hover:underline"
                style={{ color: 'var(--shopli-orange)' }}
                data-iwishbag-walmart-foil-link="1"
              >
                Walmart→IL
                <Icon name="external" size={11} className="inline-block ms-1 align-middle" />
              </a>
              {' · '}
              <a
                href={IWISHBAG_EBAY_IL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline-offset-2 hover:underline"
                style={{ color: 'var(--shopli-orange)' }}
                data-iwishbag-ebay-foil-link="1"
              >
                eBay→IL
                <Icon name="external" size={11} className="inline-block ms-1 align-middle" />
              </a>
            </p>
            <div className="overflow-x-auto" dir="ltr">
              <table
                className="w-full text-left text-xs border-collapse"
                data-iwishbag-aliexpress-walmart-ebay-self-contradiction-table="1"
              >
                <thead>
                  <tr style={{ color: 'var(--shopli-navy)' }}>
                    <th className="py-1.5 pe-2 font-bold border-b" style={{ borderColor: 'rgba(15,23,42,0.12)' }}>
                      Claim
                    </th>
                    <th className="py-1.5 px-2 font-bold border-b" style={{ borderColor: 'rgba(15,23,42,0.12)' }}>
                      Shopli /landed
                    </th>
                    <th className="py-1.5 ps-2 font-bold border-b" style={{ borderColor: 'rgba(15,23,42,0.12)' }}>
                      iWishBag AliExpress+Walmart+eBay
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {aliexpressWalmartEbayRows.map((row) => (
                    <tr
                      key={row.id}
                      data-iwishbag-aliexpress-walmart-ebay-row={row.id}
                      {...(row.iwishbagWrong ? { 'data-iwishbag-wrong': '1' } : {})}
                    >
                      <td
                        className="py-1.5 pe-2 align-top font-semibold"
                        style={{ color: 'var(--shopli-navy)' }}
                      >
                        {row.labelEn}
                      </td>
                      <td
                        className="py-1.5 px-2 align-top"
                        style={{ color: 'var(--shopli-warm-gray)' }}
                        data-shopli-cell={row.id}
                      >
                        {row.shopliEn}
                      </td>
                      <td
                        className="py-1.5 ps-2 align-top font-semibold"
                        style={{
                          color: row.iwishbagWrong ? '#b91c1c' : 'var(--shopli-warm-gray)',
                        }}
                        data-iwishbag-cell={row.id}
                      >
                        {row.iwishbagEn}
                        {row.liveUrl ? (
                          <>
                            {' '}
                            <a
                              href={row.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline-offset-2 hover:underline"
                              style={{ color: 'var(--shopli-orange)' }}
                              data-iwishbag-lane-link={row.id}
                            >
                              live
                              <Icon name="external" size={11} className="inline-block ms-1 align-middle" />
                            </a>
                          </>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p
              className="text-[11px] mt-2 font-semibold"
              dir="ltr"
              style={{ color: 'var(--shopli-navy)' }}
              data-vat-foil-en="18-not-17"
            >
              {vatFoilEn} AliExpress+Walmart+eBay body 「17% VAT」 vs own table 18% · Last updated{' '}
              {IWISHBAG_PAGE_LAST_UPDATED} still live. Distinct from #41 / #40 / #39. Keep #19 / #23–#41.
            </p>
          </aside>

          {/* Personal-import threshold-churn honesty strip — official $75 + $75↔$130 flip-flops (moat 2026-09-21 16:30 #7) */}
          <aside
            className="rounded-xl border p-3 sm:p-4 mb-6"
            style={{
              borderColor: 'rgba(22,163,74,0.35)',
              background: 'rgba(240,253,244,0.75)',
            }}
            data-ptur-threshold-churn="1"
            data-ptur-official-usd={String(PTUR_OFFICIAL_USD)}
            data-ptur-churn-130-usd={String(PTUR_CHURN_130_USD)}
            data-ptur-threshold-churn-last-checked={PTUR_THRESHOLD_CHURN_LAST_CHECKED}
            data-skills-il-customs-calc-url={SKILLS_IL_CUSTOMS_CALC_URL}
            data-openaccountants-il-customs-url={OPENACCOUNTANTS_IL_CUSTOMS_URL}
            data-gov-il-personal-import-calc-url={GOV_IL_PERSONAL_IMPORT_CALC_URL}
            data-body-still-17-secondary="1"
          >
            <div
              className="flex items-start gap-2 text-sm font-bold mb-1"
              style={{ color: 'var(--shopli-navy)' }}
            >
              <Icon name="shield" size={16} className="shrink-0 mt-0.5" />
              <span>Threshold churn · official ${PTUR_OFFICIAL_USD} ptur</span>
            </div>
            <p
              className="text-xs font-bold mb-2"
              style={{ color: 'var(--shopli-navy)' }}
              dir="ltr"
              data-ptur-threshold-churn-headline="1"
            >
              {pturChurnHeadline}
            </p>
            <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--shopli-warm-gray)' }}>
              {pturChurnIntro}
            </p>
            <p
              className="text-xs font-semibold mb-1"
              dir="ltr"
              style={{ color: 'var(--shopli-navy)' }}
              data-ptur-official-cite="1"
            >
              {pturOfficialCite}{' '}
              <a
                href={GOV_IL_PERSONAL_IMPORT_CALC_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline-offset-2 hover:underline"
                style={{ color: 'var(--shopli-orange)' }}
                data-gov-il-ptur-cite-link="1"
              >
                gov.il · personal import calc
                <Icon name="external" size={11} className="inline-block ms-1 align-middle" />
              </a>
            </p>
            <p
              className="text-[11px] font-semibold mb-3"
              dir="ltr"
              style={{ color: 'var(--shopli-warm-gray)' }}
              data-ptur-threshold-churn-last-checked-stamp="1"
            >
              {pturChurnStamp}
            </p>
            <div className="overflow-x-auto" dir="ltr">
              <table
                className="w-full text-left text-xs border-collapse"
                data-ptur-threshold-churn-table="1"
              >
                <thead>
                  <tr style={{ color: 'var(--shopli-navy)' }}>
                    <th className="py-1.5 pe-2 font-bold border-b" style={{ borderColor: 'rgba(15,23,42,0.12)' }}>
                      Fact
                    </th>
                    <th className="py-1.5 px-2 font-bold border-b" style={{ borderColor: 'rgba(15,23,42,0.12)' }}>
                      Detail
                    </th>
                    <th className="py-1.5 ps-2 font-bold border-b" style={{ borderColor: 'rgba(15,23,42,0.12)' }}>
                      Source
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pturChurnRows.map((row) => (
                    <tr
                      key={row.id}
                      data-ptur-threshold-churn-row={row.id}
                      {...(row.churnCallout ? { 'data-ptur-churn-callout': '1' } : {})}
                      {...(row.id === 'body-still-17-secondary'
                        ? { 'data-body-still-17-secondary': '1' }
                        : {})}
                    >
                      <td
                        className="py-1.5 pe-2 align-top font-semibold"
                        style={{ color: 'var(--shopli-navy)' }}
                      >
                        {row.labelEn}
                      </td>
                      <td
                        className="py-1.5 px-2 align-top font-semibold"
                        style={{
                          color: row.churnCallout ? '#b91c1c' : 'var(--shopli-warm-gray)',
                        }}
                        data-ptur-churn-detail={row.id}
                      >
                        {row.detailEn}
                      </td>
                      <td className="py-1.5 ps-2 align-top">
                        {row.liveUrl ? (
                          <a
                            href={row.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold underline-offset-2 hover:underline"
                            style={{ color: 'var(--shopli-orange)' }}
                            data-ptur-churn-proof-link={row.id}
                          >
                            live
                            <Icon name="external" size={11} className="inline-block ms-1 align-middle" />
                          </a>
                        ) : (
                          <span style={{ color: 'var(--shopli-warm-gray)' }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] mt-2" dir="ltr" style={{ color: 'var(--shopli-warm-gray)' }}>
              Documented churn:{' '}
              <a
                href={SKILLS_IL_CUSTOMS_CALC_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline-offset-2 hover:underline"
                style={{ color: 'var(--shopli-orange)' }}
                data-skills-il-churn-link="1"
              >
                Skills IL
                <Icon name="external" size={11} className="inline-block ms-1 align-middle" />
              </a>
              {' · '}
              <a
                href={OPENACCOUNTANTS_IL_CUSTOMS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline-offset-2 hover:underline"
                style={{ color: 'var(--shopli-orange)' }}
                data-openaccountants-churn-link="1"
              >
                OpenAccountants
                <Icon name="external" size={11} className="inline-block ms-1 align-middle" />
              </a>
              . Body-still-17% (#24/#41/#42) secondary only.
            </p>
            <p
              className="text-[11px] mt-1 font-semibold"
              dir="ltr"
              style={{ color: 'var(--shopli-navy)' }}
              data-vat-foil-en="18-not-17"
            >
              {vatFoilEn} Official ${PTUR_OFFICIAL_USD} ptur · ${PTUR_OFFICIAL_USD}↔$
              {PTUR_CHURN_130_USD} churn documented · last checked{' '}
              {PTUR_THRESHOLD_CHURN_LAST_CHECKED}. Distinct from #42 / #41 / #40. Keep #19 / #23–#42.
            </p>
          </aside>

          {/* iWishBag Target→IL self-contradiction strip — body 17% vs own table 18% (moat 2026-09-21 18:45 #2) */}
          <aside
            className="rounded-xl border p-3 sm:p-4 mb-6"
            style={{
              borderColor: 'rgba(220,38,38,0.28)',
              background: 'rgba(254,242,242,0.65)',
            }}
            data-iwishbag-target-self-contradiction="1"
            data-iwishbag-target-url={IWISHBAG_TARGET_IL_URL}
            data-iwishbag-last-updated={IWISHBAG_PAGE_LAST_UPDATED}
            data-iwishbag-target-verified={IWISHBAG_TARGET_SELF_CONTRADICTION_VERIFIED}
            data-vat-honesty-foil="18-not-17"
          >
            <div
              className="flex items-start gap-2 text-sm font-bold mb-1"
              style={{ color: 'var(--shopli-navy)' }}
            >
              <Icon name="shield" size={16} className="shrink-0 mt-0.5" />
              <span>Self-contradiction · iWishBag Target→IL</span>
            </div>
            <p
              className="text-xs font-bold mb-2"
              style={{ color: '#b91c1c' }}
              dir="ltr"
              data-iwishbag-target-headline="self-contradiction"
            >
              {targetHeadline}
            </p>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--shopli-warm-gray)' }}>
              {targetIntro}{' '}
              <a
                href={IWISHBAG_TARGET_IL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline-offset-2 hover:underline"
                style={{ color: 'var(--shopli-orange)' }}
                data-iwishbag-target-foil-link="1"
              >
                Target→IL
                <Icon name="external" size={11} className="inline-block ms-1 align-middle" />
              </a>
            </p>
            <div className="overflow-x-auto" dir="ltr">
              <table
                className="w-full text-left text-xs border-collapse"
                data-iwishbag-target-self-contradiction-table="1"
              >
                <thead>
                  <tr style={{ color: 'var(--shopli-navy)' }}>
                    <th className="py-1.5 pe-2 font-bold border-b" style={{ borderColor: 'rgba(15,23,42,0.12)' }}>
                      Claim
                    </th>
                    <th className="py-1.5 px-2 font-bold border-b" style={{ borderColor: 'rgba(15,23,42,0.12)' }}>
                      Shopli /landed
                    </th>
                    <th className="py-1.5 ps-2 font-bold border-b" style={{ borderColor: 'rgba(15,23,42,0.12)' }}>
                      iWishBag Target→IL
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {targetRows.map((row) => (
                    <tr
                      key={row.id}
                      data-iwishbag-target-row={row.id}
                      {...(row.iwishbagWrong ? { 'data-iwishbag-wrong': '1' } : {})}
                    >
                      <td
                        className="py-1.5 pe-2 align-top font-semibold"
                        style={{ color: 'var(--shopli-navy)' }}
                      >
                        {row.labelEn}
                      </td>
                      <td
                        className="py-1.5 px-2 align-top"
                        style={{ color: 'var(--shopli-warm-gray)' }}
                        data-shopli-cell={row.id}
                      >
                        {row.shopliEn}
                      </td>
                      <td
                        className="py-1.5 ps-2 align-top font-semibold"
                        style={{
                          color: row.iwishbagWrong ? '#b91c1c' : 'var(--shopli-warm-gray)',
                        }}
                        data-iwishbag-cell={row.id}
                      >
                        {row.iwishbagEn}
                        {row.liveUrl ? (
                          <>
                            {' '}
                            <a
                              href={row.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline-offset-2 hover:underline"
                              style={{ color: 'var(--shopli-orange)' }}
                              data-iwishbag-lane-link={row.id}
                            >
                              live
                              <Icon name="external" size={11} className="inline-block ms-1 align-middle" />
                            </a>
                          </>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p
              className="text-[11px] mt-2 font-semibold"
              dir="ltr"
              style={{ color: 'var(--shopli-navy)' }}
              data-vat-foil-en="18-not-17"
            >
              {vatFoilEn} Target→IL body 「17% VAT」 vs own table 18% · Last updated{' '}
              {IWISHBAG_PAGE_LAST_UPDATED} still live. Distinct from #43 / #42 / #41 / #40. Keep #19 / #23–#44.
            </p>
          </aside>

          {/* Side-by-side RateShips honesty foil — whole-page VAT 17% vs real 18% (Sep 22) */}
          <aside
            className="rounded-xl border p-3 sm:p-4 mb-6"
            style={{
              borderColor: 'rgba(220,38,38,0.28)',
              background: 'rgba(254,242,242,0.65)',
            }}
            data-rateships-side-by-side-foil="1"
            data-rateships-url={RATESHIPS_IL_URL}
            data-rateships-stale-17={RATESHIPS_STALE_17_VERIFIED}
            data-vat-honesty-foil="18-not-17"
          >
            <div
              className="flex items-start gap-2 text-sm font-bold mb-1"
              style={{ color: 'var(--shopli-navy)' }}
            >
              <Icon name="shield" size={16} className="shrink-0 mt-0.5" />
              <span>Side-by-side · RateShips 「VAT 17%」 whole page</span>
            </div>
            <p
              className="text-xs font-bold mb-2"
              style={{ color: '#b91c1c' }}
              dir="ltr"
              data-rateships-headline="stale-17"
            >
              {rateShipsHeadline}
            </p>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--shopli-warm-gray)' }}>
              {rateShipsIntro}{' '}
              <a
                href={RATESHIPS_IL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline-offset-2 hover:underline"
                style={{ color: 'var(--shopli-orange)' }}
                data-rateships-foil-link="1"
              >
                rateships.com/en/customs/israel
                <Icon name="external" size={11} className="inline-block ms-1 align-middle" />
              </a>
            </p>
            <div className="overflow-x-auto" dir="ltr">
              <table
                className="w-full text-left text-xs border-collapse"
                data-rateships-side-by-side-table="1"
              >
                <thead>
                  <tr style={{ color: 'var(--shopli-navy)' }}>
                    <th className="py-1.5 pe-2 font-bold border-b" style={{ borderColor: 'rgba(15,23,42,0.12)' }}>
                      Claim
                    </th>
                    <th className="py-1.5 px-2 font-bold border-b" style={{ borderColor: 'rgba(15,23,42,0.12)' }}>
                      Shopli /landed
                    </th>
                    <th className="py-1.5 ps-2 font-bold border-b" style={{ borderColor: 'rgba(15,23,42,0.12)' }}>
                      RateShips
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rateShipsRows.map((row) => (
                    <tr
                      key={row.id}
                      data-rateships-row={row.id}
                      {...(row.rateshipsWrong ? { 'data-rateships-wrong': '1' } : {})}
                    >
                      <td
                        className="py-1.5 pe-2 align-top font-semibold"
                        style={{ color: 'var(--shopli-navy)' }}
                      >
                        {row.labelEn}
                      </td>
                      <td
                        className="py-1.5 px-2 align-top"
                        style={{ color: 'var(--shopli-warm-gray)' }}
                        data-shopli-cell={row.id}
                      >
                        {row.shopliEn}
                      </td>
                      <td
                        className="py-1.5 ps-2 align-top font-semibold"
                        style={{
                          color: row.rateshipsWrong ? '#b91c1c' : 'var(--shopli-warm-gray)',
                        }}
                        data-rateships-cell={row.id}
                      >
                        {row.rateshipsEn}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p
              className="text-[11px] mt-2 font-semibold"
              dir="ltr"
              style={{ color: 'var(--shopli-navy)' }}
              data-vat-foil-en="18-not-17"
            >
              {vatFoilEn} Foil rateships.com/en/customs/israel whole-page 17%. Distinct from
              DutyDecoder #38 / Target #44 / marketplace how-tos. Keep #19 / #23–#44.
              Estimator math unchanged (18%).
            </p>
          </aside>

          {/* iWishBag Amazon US→IL self-contradiction strip — body 17% vs own table 18% (moat 2026-09-23 08:15 #2) */}
          <aside
            className="rounded-xl border p-3 sm:p-4 mb-6"
            style={{
              borderColor: 'rgba(220,38,38,0.28)',
              background: 'rgba(254,242,242,0.65)',
            }}
            data-iwishbag-amazonus-self-contradiction="1"
            data-iwishbag-amazonus-url={IWISHBAG_AMAZON_IL_URL}
            data-iwishbag-last-updated={IWISHBAG_PAGE_LAST_UPDATED}
            data-iwishbag-amazonus-verified={IWISHBAG_AMAZONUS_SELF_CONTRADICTION_VERIFIED}
            data-vat-honesty-foil="18-not-17"
          >
            <div
              className="flex items-start gap-2 text-sm font-bold mb-1"
              style={{ color: 'var(--shopli-navy)' }}
            >
              <Icon name="shield" size={16} className="shrink-0 mt-0.5" />
              <span>Self-contradiction · iWishBag Amazon US→IL</span>
            </div>
            <p
              className="text-xs font-bold mb-2"
              style={{ color: '#b91c1c' }}
              dir="ltr"
              data-iwishbag-amazonus-headline="self-contradiction"
            >
              {amazonUsHeadline}
            </p>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--shopli-warm-gray)' }}>
              {amazonUsIntro}{' '}
              <a
                href={IWISHBAG_AMAZON_IL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline-offset-2 hover:underline"
                style={{ color: 'var(--shopli-orange)' }}
                data-iwishbag-amazonus-foil-link="1"
              >
                Amazon US→IL
                <Icon name="external" size={11} className="inline-block ms-1 align-middle" />
              </a>
            </p>
            <div className="overflow-x-auto" dir="ltr">
              <table
                className="w-full text-left text-xs border-collapse"
                data-iwishbag-amazonus-self-contradiction-table="1"
              >
                <thead>
                  <tr style={{ color: 'var(--shopli-navy)' }}>
                    <th className="py-1.5 pe-2 font-bold border-b" style={{ borderColor: 'rgba(15,23,42,0.12)' }}>
                      Claim
                    </th>
                    <th className="py-1.5 px-2 font-bold border-b" style={{ borderColor: 'rgba(15,23,42,0.12)' }}>
                      Shopli /landed
                    </th>
                    <th className="py-1.5 ps-2 font-bold border-b" style={{ borderColor: 'rgba(15,23,42,0.12)' }}>
                      iWishBag Amazon US→IL
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {amazonUsRows.map((row) => (
                    <tr
                      key={row.id}
                      data-iwishbag-amazonus-row={row.id}
                      {...(row.iwishbagWrong ? { 'data-iwishbag-wrong': '1' } : {})}
                    >
                      <td
                        className="py-1.5 pe-2 align-top font-semibold"
                        style={{ color: 'var(--shopli-navy)' }}
                      >
                        {row.labelEn}
                      </td>
                      <td
                        className="py-1.5 px-2 align-top"
                        style={{ color: 'var(--shopli-warm-gray)' }}
                        data-shopli-cell={row.id}
                      >
                        {row.shopliEn}
                      </td>
                      <td
                        className="py-1.5 ps-2 align-top font-semibold"
                        style={{
                          color: row.iwishbagWrong ? '#b91c1c' : 'var(--shopli-warm-gray)',
                        }}
                        data-iwishbag-cell={row.id}
                      >
                        {row.iwishbagEn}
                        {row.liveUrl ? (
                          <>
                            {' '}
                            <a
                              href={row.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline-offset-2 hover:underline"
                              style={{ color: 'var(--shopli-orange)' }}
                              data-iwishbag-lane-link={row.id}
                            >
                              live
                              <Icon name="external" size={11} className="inline-block ms-1 align-middle" />
                            </a>
                          </>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p
              className="text-[11px] mt-2 font-semibold"
              dir="ltr"
              style={{ color: 'var(--shopli-navy)' }}
              data-vat-foil-en="18-not-17"
            >
              {vatFoilEn} Amazon US→IL body 「17% VAT」 vs own table 18% · Last updated{' '}
              {IWISHBAG_PAGE_LAST_UPDATED} still live. Distinct from #46 / #44 / #43 / #42 / #34.
              Keep #19 / #23–#47.
            </p>
          </aside>

          {/* Marketplace→IL how-tos — same iWishBag 17% body foil */}
          <nav
            className="rounded-xl border p-3 sm:p-4 mb-6"
            style={{
              borderColor: 'rgba(15,23,42,0.12)',
              background: 'rgba(15,23,42,0.02)',
            }}
            data-marketplace-how-to-nav="1"
            aria-label="Marketplace to Israel how-tos"
          >
            <div className="text-sm font-bold mb-1" style={{ color: 'var(--shopli-navy)' }}>
              How-tos · {MARKETPLACE_HOW_TOS.map((m) => m.nameEn).join(' / ')} → IL
            </div>
            <p className="text-xs mb-2" style={{ color: 'var(--shopli-warm-gray)' }}>
              Same 「17% body still wrong」 foil on marketplace pages — paste URL back here on /landed.
            </p>
            <ul className="flex flex-wrap gap-2" dir="ltr">
              {MARKETPLACE_HOW_TOS.map((m) => (
                <li key={m.id}>
                  <Link
                    href={m.path}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border"
                    style={{
                      borderColor: 'rgba(249,115,22,0.35)',
                      color: 'var(--shopli-orange)',
                      background: 'rgba(249,115,22,0.06)',
                    }}
                    data-marketplace-how-to-link={m.id}
                  >
                    {m.nameEn}→IL
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

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
