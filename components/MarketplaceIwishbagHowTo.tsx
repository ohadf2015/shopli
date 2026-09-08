import Link from 'next/link';
import Header from './Header';
import Footer from './Footer';
import SeoHead from './SeoHead';
import Icon from './icons';
import { SITE_URL } from '../lib/seo';
import { IL_VAT_RATE, BOI_CUSTOMS_FX_UPLIFT, DUTY_FREE_THRESHOLD_USD } from '../lib/landed-cost';
import {
  customsStampCopyHe,
  israelVat18Not17FoilEn,
  iwishbagBodyStillWrongHeadlineEn,
  iwishbagMarketplaceSideBySideRows,
  iwishbagMarketplaceFoilIntroEn,
  getMarketplaceHowTo,
  MARKETPLACE_HOW_TOS,
  IWISHBAG_PAGE_LAST_UPDATED,
  IWISHBAG_BODY_STILL_WRONG_VERIFIED,
  SKILLS_IL_CUSTOMS,
  SKILLS_IL_SHEKEL,
  SKILLS_IL_STAMP_DATE,
  type MarketplaceHowToId,
} from '../lib/landed-url';

const VAT_PCT = Math.round(IL_VAT_RATE * 100);
const FX_PCT = (BOI_CUSTOMS_FX_UPLIFT * 100).toFixed(1);

/**
 * Lean marketplace→IL how-to: paste/landed CTA + 18% not 17% foil +
 * iWishBag body-still-wrong side-by-side + Skills stamp. Presentation only.
 */
export default function MarketplaceIwishbagHowTo({
  marketplace,
}: {
  marketplace: MarketplaceHowToId;
}) {
  const spec = getMarketplaceHowTo(marketplace);
  const pageUrl = `${SITE_URL}${spec.path}`;
  const stamp = customsStampCopyHe();
  const vatFoilEn = israelVat18Not17FoilEn();
  const headline = iwishbagBodyStillWrongHeadlineEn();
  const introEn = iwishbagMarketplaceFoilIntroEn(marketplace);
  const rows = iwishbagMarketplaceSideBySideRows(marketplace);
  const siblings = MARKETPLACE_HOW_TOS.filter((m) => m.id !== marketplace);

  return (
    <>
      <SeoHead
        region="il"
        path={spec.path}
        canonical={pageUrl}
        hreflang={false}
        title={`How to buy from ${spec.nameEn} in Israel — ${VAT_PCT}% VAT (not 17%) · /landed | Shopli`}
        description={`Paste a ${spec.nameEn} URL → IL landed quote on /landed. Israel VAT is ${VAT_PCT}% not 17%. Skills IL customs ${SKILLS_IL_CUSTOMS} + shekel ${SKILLS_IL_SHEKEL} · ${SKILLS_IL_STAMP_DATE}. iWishBag ${spec.nameEn}→IL body still wrong (Apr ${IWISHBAG_PAGE_LAST_UPDATED.slice(5)} page / verified ${IWISHBAG_BODY_STILL_WRONG_VERIFIED}).`}
      />
      <Header currentRegion="il" dir="ltr" />

      <main
        dir="ltr"
        className="min-h-screen"
        style={{ fontFamily: 'var(--font-assistant), system-ui, sans-serif' }}
        data-page={`how-to-${marketplace}-israel`}
        data-marketplace-how-to={marketplace}
        data-skills-il={SKILLS_IL_CUSTOMS}
        data-skills-shekel={SKILLS_IL_SHEKEL}
        data-skills-stamp={SKILLS_IL_STAMP_DATE}
        data-vat-honesty-foil="18-not-17"
        data-iwishbag-side-by-side-foil="1"
        data-iwishbag-body-still-wrong={IWISHBAG_BODY_STILL_WRONG_VERIFIED}
        data-iwishbag-url={spec.iwishbagUrl}
      >
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-10">
          <div
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: 'var(--shopli-orange)' }}
          >
            Shopli · {spec.nameEn} → Israel
          </div>
          <h1
            className="text-3xl md:text-4xl font-extrabold leading-tight mb-3"
            style={{ color: 'var(--shopli-navy)' }}
          >
            How to buy from {spec.nameEn} in Israel — paste URL → /landed
          </h1>
          <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--shopli-warm-gray)' }}>
            Free IL landed-cost estimator: paste a {spec.nameEn} (or any) product URL on{' '}
            <Link
              href="/landed"
              className="font-semibold underline-offset-2 hover:underline"
              style={{ color: 'var(--shopli-orange)' }}
              data-landed-cta="hero"
            >
              /landed
            </Link>
            . Personal-import bands: under ${DUTY_FREE_THRESHOLD_USD} ptur · ${DUTY_FREE_THRESHOLD_USD}
            –$500 VAT-only. {vatFoilEn} BoI representative +{FX_PCT}% FX labeled. Skills IL customs{' '}
            {SKILLS_IL_CUSTOMS} + shekel {SKILLS_IL_SHEKEL} · {SKILLS_IL_STAMP_DATE}.
          </p>

          {/* Paste /landed CTA */}
          <div
            className="rounded-xl border p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            style={{
              borderColor: 'rgba(249,115,22,0.4)',
              background: 'rgba(249,115,22,0.08)',
            }}
            data-landed-cta-panel="1"
          >
            <div>
              <div className="text-sm font-bold mb-1" style={{ color: 'var(--shopli-navy)' }}>
                Paste {spec.nameEn} URL → IL quote
              </div>
              <p className="text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
                No scrape. Enter price → see {VAT_PCT}% VAT (not 17%) + BoI+{FX_PCT}% stamp.
              </p>
            </div>
            <Link
              href="/landed"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white shrink-0"
              style={{ background: 'var(--shopli-orange)' }}
              data-landed-cta="button"
            >
              Open /landed
              <Icon name="external" size={12} className="shrink-0" />
            </Link>
          </div>

          {/* 18% not 17% + Skills stamp */}
          <aside
            className="rounded-xl border p-3 sm:p-4 mb-6"
            style={{
              borderColor: 'rgba(249,115,22,0.35)',
              background: 'rgba(249,115,22,0.07)',
            }}
            data-customs-stamp="boi-plus-0.5"
            data-vat-honesty-foil="18-not-17"
            data-skills-il={SKILLS_IL_CUSTOMS}
            data-skills-shekel={SKILLS_IL_SHEKEL}
            data-skills-stamp={SKILLS_IL_STAMP_DATE}
          >
            <div
              className="flex items-start gap-2 text-sm font-bold mb-1"
              style={{ color: 'var(--shopli-navy)' }}
            >
              <Icon name="shield" size={16} className="shrink-0 mt-0.5" />
              <span>
                Customs stamp · VAT {VAT_PCT}% (not 17%) · BoI + {FX_PCT}% · Skills IL{' '}
                {SKILLS_IL_CUSTOMS} + {SKILLS_IL_SHEKEL} · {SKILLS_IL_STAMP_DATE}
              </span>
            </div>
            <p
              className="text-xs font-bold mb-1"
              style={{ color: 'var(--shopli-navy)' }}
              data-vat-foil-en="18-not-17"
            >
              {vatFoilEn}
            </p>
            <p className="text-xs leading-relaxed" dir="rtl" style={{ color: 'var(--shopli-warm-gray)' }}>
              {stamp}
            </p>
          </aside>

          {/* iWishBag side-by-side foil */}
          <aside
            className="rounded-xl border p-3 sm:p-4 mb-6"
            style={{
              borderColor: 'rgba(220,38,38,0.28)',
              background: 'rgba(254,242,242,0.65)',
            }}
            data-iwishbag-side-by-side-foil="1"
            data-iwishbag-url={spec.iwishbagUrl}
            data-iwishbag-last-updated={IWISHBAG_PAGE_LAST_UPDATED}
            data-iwishbag-body-still-wrong={IWISHBAG_BODY_STILL_WRONG_VERIFIED}
            data-vat-honesty-foil="18-not-17"
            data-marketplace={marketplace}
          >
            <div
              className="flex items-start gap-2 text-sm font-bold mb-1"
              style={{ color: 'var(--shopli-navy)' }}
            >
              <Icon name="shield" size={16} className="shrink-0 mt-0.5" />
              <span>
                Side-by-side · iWishBag {spec.nameEn}→IL 「17% body still wrong」
              </span>
            </div>
            <p
              className="text-xs font-bold mb-2"
              style={{ color: '#b91c1c' }}
              data-iwishbag-headline="body-still-wrong"
            >
              {headline}
            </p>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--shopli-warm-gray)' }}>
              {introEn}{' '}
              <a
                href={spec.iwishbagUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline-offset-2 hover:underline"
                style={{ color: 'var(--shopli-orange)' }}
                data-iwishbag-foil-link="1"
              >
                iWishBag {spec.nameEn}→IL
                <Icon name="external" size={11} className="inline-block ms-1 align-middle" />
              </a>
            </p>
            <div className="overflow-x-auto">
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
                  {rows.map((row) => (
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
              style={{ color: 'var(--shopli-navy)' }}
              data-vat-foil-en="18-not-17"
            >
              {vatFoilEn} Keep #19 / #23 / #24 / #25 / #26 / #27 / #28 / #29.
            </p>
          </aside>

          <p className="text-sm mb-4" style={{ color: 'var(--shopli-warm-gray)' }}>
            More marketplace→IL how-tos:{' '}
            {siblings.map((m, i) => (
              <span key={m.id}>
                {i > 0 && ' · '}
                <Link
                  href={m.path}
                  className="font-semibold underline-offset-2 hover:underline"
                  style={{ color: 'var(--shopli-orange)' }}
                  data-marketplace-sibling={m.id}
                >
                  {m.nameEn}
                </Link>
              </span>
            ))}
            {' · '}
            <Link
              href="/landed"
              className="font-semibold underline-offset-2 hover:underline"
              style={{ color: 'var(--shopli-orange)' }}
              data-landed-cta="footer"
            >
              /landed estimator
            </Link>
          </p>

          <p className="text-xs leading-relaxed" style={{ color: 'var(--shopli-warm-gray)' }}>
            Note: Shopli is not the Israel Tax Authority. Estimator reflects common personal-import
            bands and the Skills IL customs {SKILLS_IL_CUSTOMS} + shekel {SKILLS_IL_SHEKEL} ·{' '}
            {SKILLS_IL_STAMP_DATE} stamp. {vatFoilEn} Math unchanged from /landed (#18–#29).
          </p>
        </section>
      </main>

      <Footer currentRegion="il" />
    </>
  );
}
