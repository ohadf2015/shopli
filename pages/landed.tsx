import { useEffect, useMemo, useState } from 'react';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '../components/Header';
import SeoHead from '../components/SeoHead';
import LandedCostBadge from '../components/LandedCostBadge';
import { SITE_URL, faqJsonLd } from '../lib/seo';
import { fetchBoiUsdIls } from '../lib/boi-rate';
import {
  IL_VAT_RATE,
  BOI_CUSTOMS_FX_UPLIFT,
  DUTY_FREE_THRESHOLD_USD,
  FALLBACK_BOI_USD_ILS,
  FALLBACK_BOI_DATE,
  IL_IMPORT_RULES_CHECKED,
  KOL_ZCHUT_IMPORT_URL,
  TAX_AUTHORITY_CALC_URL,
  customsRate,
  estimateLandedCost,
  estimateKitLandedCost,
  type LandedCostInput,
} from '../lib/landed-cost';
import {
  MARKETPLACE_HOW_TOS,
  classifyImportBand,
  importBandRowsHe,
  landedFaqHe,
  orderLosesExemption,
} from '../lib/landed-guide';

const VAT_PCT = Math.round(IL_VAT_RATE * 100);
const FX_PCT = (BOI_CUSTOMS_FX_UPLIFT * 100).toFixed(1);
const MIN_ITEMS = 2;
const MAX_ITEMS = 5;

const INK = 'var(--shopli-navy)';
const GRAY = 'var(--shopli-warm-gray)';
const INPUT =
  'w-full px-4 py-3 rounded-xl border border-gray-300 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400';

const heDate = (iso: string) =>
  new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${iso}T00:00:00Z`)
  );

interface LandedProps {
  boiRate: number;
  boiDate: string;
}

export const getStaticProps: GetStaticProps<LandedProps> = async () => {
  const boi = await fetchBoiUsdIls();
  return {
    props: boi
      ? { boiRate: boi.rate, boiDate: boi.asOf }
      : { boiRate: FALLBACK_BOI_USD_ILS, boiDate: FALLBACK_BOI_DATE },
    // The representative rate is published once a business day.
    revalidate: boi ? 6 * 60 * 60 : 10 * 60,
  };
};

type Mode = 'single' | 'order';

export default function LandedPage({ boiRate, boiDate }: LandedProps) {
  const router = useRouter();
  const usdIls = customsRate(boiRate);

  const [mode, setMode] = useState<Mode>('single');
  const [price, setPrice] = useState('');
  const [itemPrices, setItemPrices] = useState<string[]>(() => Array(MIN_ITEMS).fill(''));
  const [currency, setCurrency] = useState('USD');
  const [freeShipping, setFreeShipping] = useState(true);
  const [shippingIls, setShippingIls] = useState('');
  const [prefilled, setPrefilled] = useState(false);

  // A shared link carries the inputs: ?price=&currency=&shippingIls= or ?kit=1&prices=a|b
  useEffect(() => {
    if (!router.isReady || prefilled) return;
    const q = router.query;
    if (typeof q.prices === 'string' && q.prices) {
      const parts = q.prices.split('|').slice(0, MAX_ITEMS);
      while (parts.length < MIN_ITEMS) parts.push('');
      setItemPrices(parts);
      setMode('order');
    } else if (q.kit === '1') {
      setMode('order');
    }
    if (typeof q.price === 'string' && q.price) setPrice(q.price);
    if (typeof q.currency === 'string' && /^(ILS|₪)$/i.test(q.currency.trim())) setCurrency('ILS');
    if (typeof q.shippingIls === 'string' && q.shippingIls) {
      setShippingIls(q.shippingIls);
      setFreeShipping(false);
    }
    setPrefilled(true);
  }, [router.isReady, router.query, prefilled]);

  const shipNum = freeShipping ? 0 : Math.max(0, Number(shippingIls) || 0);
  const priceNum = Number(price);

  // Shipping is shared by the parcel, so it rides on the first item only.
  const items: LandedCostInput[] = useMemo(
    () =>
      itemPrices
        .map(Number)
        .filter((n) => Number.isFinite(n) && n > 0)
        .map((n, i) => ({ price: n, currency, freeShipping: i > 0 || shipNum <= 0, shippingIls: i === 0 ? shipNum : 0 })),
    [itemPrices, currency, shipNum]
  );

  const estimate =
    mode === 'order'
      ? items.length >= MIN_ITEMS
        ? estimateKitLandedCost(items, usdIls)
        : null
      : estimateLandedCost({ price: priceNum, currency, freeShipping, shippingIls: shipNum }, usdIls);
  const activeBand = estimate ? classifyImportBand(estimate.usdPrice) : null;
  const losesExemption = mode === 'order' && orderLosesExemption(items, usdIls);

  const saveToUrl = () => {
    const next: Record<string, string> = {};
    if (mode === 'order') {
      next.kit = '1';
      if (itemPrices.some((p) => p.trim())) next.prices = itemPrices.map((p) => p.trim()).join('|');
    } else if (price.trim()) {
      next.price = price.trim();
    }
    if (currency !== 'USD') next.currency = currency;
    if (!freeShipping && shippingIls.trim()) next.shippingIls = shippingIls.trim();
    router.replace({ pathname: '/landed', query: next }, undefined, { shallow: true });
  };

  const faq = landedFaqHe();
  const bands = importBandRowsHe();
  const thresholdIls = Math.round(DUTY_FREE_THRESHOLD_USD * usdIls);

  const tab = (id: Mode, label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={mode === id}
      onClick={() => setMode(id)}
      className={`px-4 py-2 rounded-xl text-sm font-semibold border ${
        mode === id ? 'border-[#141414] bg-orange-100' : 'border-gray-300 bg-white'
      }`}
      style={{ color: INK }}
    >
      {label}
    </button>
  );

  return (
    <>
      <SeoHead
        region="il"
        path="/landed"
        canonical={`${SITE_URL}/landed`}
        hreflang={false}
        title="מחשבון מע״מ ומכס להזמנות מחו״ל: כמה זה יעלה? | Shopli"
        description={`הזינו את מחיר ההזמנה מאליאקספרס, טמו, שיין או אמזון וראו אם יתווסף מע״מ וכמה תשלמו בסך הכול. מתחת ל-$${DUTY_FREE_THRESHOLD_USD} אין מס, ומעליו מע״מ של ${VAT_PCT}%. לפי שער בנק ישראל העדכני.`}
        jsonLd={faqJsonLd(faq)}
      />
      <Header currentRegion="il" dir="rtl" />

      <main dir="rtl" className="min-h-screen" style={{ fontFamily: 'var(--font-assistant), system-ui, sans-serif' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-16">
          <p className="text-xs font-semibold tracking-wider text-orange-700 mb-2">מחשבון יבוא אישי</p>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3" style={{ color: INK }}>
            כמה ההזמנה מחו״ל תעלה לכם עד הבית?
          </h1>
          <p className="text-base leading-relaxed mb-6" style={{ color: GRAY }}>
            מזינים את מחיר המוצרים ורואים מיד אם יתווסף מע״מ, וכמה תשלמו בסך הכול. הכללים זהים לאליאקספרס, לטמו,
            לשיין, לאמזון ולכל אתר אחר בחו״ל.
          </p>

          <section
            className="rounded-2xl border border-[#141414] bg-white p-4 sm:p-6 mb-4"
            aria-label="מחשבון"
            data-landed-calculator
          >
            <div className="flex flex-wrap gap-2 mb-5" role="tablist" aria-label="סוג ההזמנה">
              {tab('single', 'מוצר אחד')}
              {tab('order', 'כמה מוצרים באותה הזמנה')}
            </div>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                saveToUrl();
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_150px] gap-4 items-start">
                {mode === 'single' ? (
                  <label className="block">
                    <span className="text-sm font-semibold mb-1.5 block" style={{ color: INK }}>
                      מחיר המוצר, בלי משלוח
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
                      className={INPUT}
                      data-landed-price-input
                    />
                  </label>
                ) : (
                  <fieldset className="space-y-2">
                    <legend className="text-sm font-semibold mb-1.5" style={{ color: INK }}>
                      מחיר כל מוצר, בלי משלוח
                    </legend>
                    {itemPrices.map((value, i) => (
                      <input
                        key={i}
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="0.01"
                        dir="ltr"
                        value={value}
                        onChange={(e) =>
                          setItemPrices((prev) => prev.map((p, idx) => (idx === i ? e.target.value : p)))
                        }
                        placeholder="40.00"
                        aria-label={`מחיר מוצר ${i + 1}`}
                        className={INPUT}
                        data-landed-item-price={i}
                      />
                    ))}
                    {itemPrices.length < MAX_ITEMS && (
                      <button
                        type="button"
                        className="text-sm font-semibold text-orange-700 hover:underline"
                        onClick={() => setItemPrices((prev) => [...prev, ''])}
                      >
                        + עוד מוצר
                      </button>
                    )}
                  </fieldset>
                )}
                <label className="block">
                  <span className="text-sm font-semibold mb-1.5 block" style={{ color: INK }}>
                    מטבע
                  </span>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={INPUT}>
                    <option value="USD">דולר ($)</option>
                    <option value="ILS">שקל (₪)</option>
                  </select>
                </label>
              </div>

              <label className="flex items-center gap-2 text-sm" style={{ color: INK }}>
                <input
                  type="checkbox"
                  checked={freeShipping}
                  onChange={(e) => setFreeShipping(e.target.checked)}
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                />
                המשלוח חינם
              </label>

              {!freeShipping && (
                <label className="block sm:max-w-xs">
                  <span className="text-sm font-semibold mb-1.5 block" style={{ color: INK }}>
                    דמי משלוח בשקלים{mode === 'order' ? ', לכל ההזמנה' : ''}
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
                    className={INPUT}
                  />
                </label>
              )}

              <button type="submit" className="btn-primary w-full sm:w-auto">
                חשבו
              </button>
            </form>

            <div className="mt-6" aria-live="polite" data-landed-result={estimate ? activeBand : 'empty'}>
              {estimate ? (
                <>
                  {losesExemption && (
                    <p className="rounded-xl border border-amber-400 bg-amber-50 p-3 mb-4 text-sm text-amber-900">
                      כל מוצר לבד היה פטור, אבל יחד ההזמנה עוברת את ${DUTY_FREE_THRESHOLD_USD}, ולכן המע״מ חל על
                      כולה.
                    </p>
                  )}
                  {mode === 'order' ? (
                    <LandedCostBadge variant="full" scope="kit" skus={items} usdIls={usdIls} />
                  ) : (
                    <LandedCostBadge
                      variant="full"
                      price={priceNum}
                      currency={currency}
                      freeShipping={freeShipping}
                      shippingIls={shipNum}
                      usdIls={usdIls}
                    />
                  )}
                </>
              ) : (
                <p className="text-sm" style={{ color: GRAY }}>
                  {mode === 'order'
                    ? 'הזינו מחיר לשני מוצרים לפחות, והפירוט יופיע כאן.'
                    : 'הזינו מחיר, והפירוט יופיע כאן.'}
                </p>
              )}
            </div>
          </section>

          <p className="text-sm leading-relaxed mb-10" style={{ color: GRAY }} data-landed-rate={boiRate}>
            היום הפטור של ${DUTY_FREE_THRESHOLD_USD} שווה בערך ₪{thresholdIls}. החישוב לפי השער היציג של בנק ישראל
            מ-{heDate(boiDate)}, {boiRate.toFixed(3)} ₪ לדולר, בתוספת {FX_PCT}% כמו שהמכס מחשב.
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ color: INK }}>
              איך המס מחושב
            </h2>
            <ul className="space-y-3">
              {bands.map((row) => {
                const active = activeBand === row.id;
                return (
                  <li
                    key={row.id}
                    className={`rounded-xl border p-4 ${
                      active ? 'border-[#141414] bg-orange-50' : 'border-gray-300 bg-white'
                    }`}
                    data-import-band={row.id}
                  >
                    <div className="font-bold mb-1" style={{ color: INK }}>
                      {row.titleHe}
                      {active && (
                        <span className="ms-2 inline-block whitespace-nowrap text-xs font-semibold px-2 py-0.5 rounded-full bg-[#141414] text-white">
                          ההזמנה שלכם
                        </span>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: GRAY }}>
                      {row.detailHe}
                    </p>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ color: INK }}>
              שאלות נפוצות
            </h2>
            <dl className="space-y-5">
              {faq.map((item) => (
                <div key={item.question}>
                  <dt className="font-bold mb-1" style={{ color: INK }}>
                    {item.question}
                  </dt>
                  <dd className="text-[15px] leading-relaxed" style={{ color: GRAY }}>
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-2" style={{ color: INK }}>
              מדריכים לפי חנות
            </h2>
            <p className="text-sm mb-3" style={{ color: GRAY }}>
              מדריך קצר באנגלית לכל חנות, עם דוגמאות מחושבות.
            </p>
            <ul className="flex flex-wrap gap-2">
              {MARKETPLACE_HOW_TOS.map((m) => (
                <li key={m.id}>
                  <Link
                    href={m.path}
                    className="inline-block px-3 py-1.5 rounded-full border border-gray-300 bg-white text-sm font-semibold hover:border-[#141414]"
                    style={{ color: INK }}
                  >
                    <span dir="ltr">{m.nameEn}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <p className="text-xs leading-relaxed" style={{ color: GRAY }}>
            הכללים נבדקו לאחרונה ב-{heDate(IL_IMPORT_RULES_CHECKED)} מול{' '}
            <a href={KOL_ZCHUT_IMPORT_URL} target="_blank" rel="noopener noreferrer" className="underline">
              הזכותון של כל זכות
            </a>{' '}
            ומול{' '}
            <a href={TAX_AUTHORITY_CALC_URL} target="_blank" rel="noopener noreferrer" className="underline">
              מחשבון היבוא האישי של רשות המסים
            </a>
            . שופלי אינה רשות המסים, והתוצאה כאן היא הערכה. הסכום הסופי נקבע במכס כשהחבילה משתחררת.
          </p>
        </div>
      </main>
    </>
  );
}
