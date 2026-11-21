import Link from 'next/link';
import Header from './Header';
import SeoHead from './SeoHead';
import { SITE_URL, faqJsonLd } from '../lib/seo';
import {
  IL_VAT_RATE,
  DUTY_FREE_THRESHOLD_USD,
  DUTY_WAIVER_CEILING_USD,
  IL_IMPORT_RULES_CHECKED,
  KOL_ZCHUT_IMPORT_URL,
  TAX_AUTHORITY_CALC_URL,
  USD_TO_ILS_RATE,
} from '../lib/landed-cost';
import {
  MARKETPLACE_HOW_TOS,
  getMarketplaceHowTo,
  howToExamples,
  howToFaqEn,
  type ImportBand,
  type MarketplaceHowToId,
} from '../lib/landed-guide';

const VAT_PCT = Math.round(IL_VAT_RATE * 100);
const FREE = DUTY_FREE_THRESHOLD_USD;
const CEILING = DUTY_WAIVER_CEILING_USD;

const INK = 'var(--shopli-navy)';
const GRAY = 'var(--shopli-warm-gray)';

const ils = (n: number) => `₪${Math.round(n).toLocaleString('en-US')}`;

const BAND_NOTE: Record<ImportBand, string> = {
  exempt: 'No VAT, no customs',
  'vat-only': `${VAT_PCT}% VAT, no customs`,
  full: `${VAT_PCT}% VAT, customs may be added`,
};

const checkedOn = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
}).format(new Date(`${IL_IMPORT_RULES_CHECKED}T00:00:00Z`));

/** English guide to what an order from one store costs once it reaches Israel. */
export default function MarketplaceHowTo({ marketplace }: { marketplace: MarketplaceHowToId }) {
  const spec = getMarketplaceHowTo(marketplace);
  const store = spec.nameEn;
  const faq = howToFaqEn(store);
  const examples = howToExamples();
  const others = MARKETPLACE_HOW_TOS.filter((m) => m.id !== spec.id);

  return (
    <>
      <SeoHead
        region="il"
        path={spec.path}
        canonical={`${SITE_URL}${spec.path}`}
        hreflang={false}
        title={`${store} to Israel: taxes and the real cost | Shopli`}
        description={`A ${store} order under $${FREE} reaches Israel with no VAT or customs. From $${FREE} to $${CEILING} you pay ${VAT_PCT}% VAT. See worked examples in shekels.`}
        jsonLd={faqJsonLd(faq)}
      />
      <Header currentRegion="il" dir="rtl" />

      <main dir="ltr" lang="en" className="min-h-screen" data-marketplace-how-to={spec.id}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-16">
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-700 mb-2">
            Shopping from abroad to Israel
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3" style={{ color: INK }}>
            Ordering from {store} to Israel: what you&apos;ll actually pay
          </h1>
          <p className="text-base leading-relaxed mb-8" style={{ color: GRAY }}>
            Israel taxes a parcel by its value, not by the store it came from. A {store} order with goods worth
            less than ${FREE} arrives with no VAT and no customs. From ${FREE} up to ${CEILING} you pay {VAT_PCT}%
            VAT on the goods plus shipping, and above ${CEILING} some products also owe customs or purchase tax.
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-1" style={{ color: INK }}>
              Three orders, worked out
            </h2>
            <p className="text-sm mb-4" style={{ color: GRAY }}>
              Free shipping assumed, converted at {USD_TO_ILS_RATE.toFixed(2)} shekels to the dollar, which is the
              Bank of Israel rate plus the 0.5% customs adds.
            </p>
            <div className="overflow-x-auto relative rounded-2xl border border-[#141414] bg-white">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-gray-200" style={{ color: GRAY }}>
                    <th className="px-4 py-3 font-semibold">Goods</th>
                    <th className="px-4 py-3 font-semibold">What applies</th>
                    <th className="px-4 py-3 font-semibold">VAT</th>
                    <th className="px-4 py-3 font-semibold">You pay</th>
                  </tr>
                </thead>
                <tbody style={{ color: INK }}>
                  {examples.map((ex) => (
                    <tr key={ex.goodsUsd} className="border-b border-gray-100 last:border-0">
                      <td className="px-4 py-3 font-semibold tabular-nums">
                        ${ex.goodsUsd} <span style={{ color: GRAY }}>({ils(ex.goodsIls)})</span>
                      </td>
                      <td className="px-4 py-3">{BAND_NOTE[ex.band]}</td>
                      <td className="px-4 py-3 tabular-nums">{ex.vatIls > 0 ? ils(ex.vatIls) : 'None'}</td>
                      <td className="px-4 py-3 font-bold tabular-nums">
                        {ils(ex.totalIls)}
                        {ex.band === 'full' ? ' or more' : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm mt-4" style={{ color: GRAY }}>
              For your own order, with shipping and several items, use the{' '}
              <Link href="/landed" className="font-semibold text-orange-700 hover:underline">
                import cost calculator
              </Link>{' '}
              (in Hebrew).
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ color: INK }}>
              What catches people out
            </h2>
            <ul className="space-y-3 text-[15px] leading-relaxed list-disc ps-5" style={{ color: INK }}>
              <li>
                Crossing ${FREE} taxes the whole order. A ${FREE - 1} order pays nothing, while an ${FREE + 5} order
                pays {VAT_PCT}% on all ${FREE + 5}, not only on the part above the line.
              </li>
              <li>
                The post office or courier usually adds a handling fee when there is tax to collect. The amount
                depends on the carrier, so it is not in the numbers above.
              </li>
              <li>
                Some goods are taxed differently. Televisions and car parts can carry purchase tax, and alcohol and
                tobacco get no exemption at any value.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ color: INK }}>
              Common questions
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

          <nav className="mb-10" aria-label="Guides for other stores">
            <h2 className="text-lg font-bold mb-3" style={{ color: INK }}>
              Guides for other stores
            </h2>
            <ul className="flex flex-wrap gap-2">
              {others.map((m) => (
                <li key={m.id}>
                  <Link
                    href={m.path}
                    className="inline-block px-3 py-1.5 rounded-full border border-gray-300 bg-white text-sm font-semibold hover:border-[#141414]"
                    style={{ color: INK }}
                  >
                    {m.nameEn}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p className="text-xs leading-relaxed" style={{ color: GRAY }}>
            Rules last checked on {checkedOn} against{' '}
            <a href={KOL_ZCHUT_IMPORT_URL} target="_blank" rel="noopener noreferrer" className="underline">
              Kol Zchut&apos;s personal import guide
            </a>{' '}
            and the{' '}
            <a href={TAX_AUTHORITY_CALC_URL} target="_blank" rel="noopener noreferrer" className="underline">
              Israel Tax Authority calculator
            </a>
            . Shopli is not the Tax Authority and these figures are estimates. The final amount is set by customs
            when the parcel is released.
          </p>
        </div>
      </main>
    </>
  );
}
