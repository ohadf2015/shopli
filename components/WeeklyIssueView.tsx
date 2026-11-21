import Link from 'next/link';
import Header from './Header';
import SeoHead from './SeoHead';
import ShareBar from './ShareBar';
import ProductCard from './ProductCard';
import DealAlertsForm from './DealAlertsForm';
import type { RegionCode, RegionConfig } from '../lib/regions';
import { articleJsonLd, breadcrumbJsonLd, itemListJsonLd, SITE_URL } from '../lib/seo';
import {
  fmtInt,
  fmtMoney,
  formatDay,
  weeklyDescription,
  weeklyInsights,
  weeklyLang,
  weeklyTitle,
  type WeeklyIssue,
} from '../lib/weekly';

export interface WeeklyPageProps {
  region: RegionCode;
  config: RegionConfig;
  issue: WeeklyIssue | null;
  /** Every issue date, newest first, for the archive list. */
  archive: string[];
  /** The latest issue date; the latest issue lives at /weekly, not at its dated URL. */
  latest: string;
  isLatest: boolean;
}

function issueHref(region: string, date: string, latest: string) {
  return date === latest ? `/${region}/weekly` : `/${region}/weekly/${date}`;
}

export default function WeeklyIssueView({ region, config, issue, archive, latest, isLatest }: WeeklyPageProps) {
  const lang = weeklyLang(region);
  const he = lang === 'he';
  const rtl = config.direction === 'rtl';
  const date = issue?.issueDate || latest;
  const path = isLatest ? '/weekly' : `/weekly/${date}`;
  const pageUrl = `${SITE_URL}/${region}${path}`;

  const hasContent = !!issue && (issue.sellers.length > 0 || issue.drops.length > 0);
  const title = issue ? weeklyTitle(issue, lang) : he ? 'שופלי השבועי' : 'The Shopli Weekly';
  const description = issue
    ? weeklyDescription(issue, lang)
    : he
      ? 'מה נמכר ומה באמת ירד במחיר באליאקספרס השבוע, מנתוני המחיר שאנחנו רושמים כל יום.'
      : "What's selling and what really got cheaper on AliExpress this week, from the prices we record every day.";
  const insights = issue ? weeklyInsights(issue, lang) : [];

  const jsonLd: Record<string, unknown>[] = [
    breadcrumbJsonLd([
      { name: he ? 'דף הבית' : 'Home', url: `${SITE_URL}/${region}` },
      { name: he ? 'שופלי השבועי' : 'The Shopli Weekly', url: `${SITE_URL}/${region}/weekly` },
      ...(isLatest ? [] : [{ name: formatDay(date, lang), url: pageUrl }]),
    ]),
  ];
  if (issue && hasContent) {
    jsonLd.push(
      articleJsonLd({
        headline: title,
        description,
        url: pageUrl,
        datePublished: issue.issueDate,
        dateModified: issue.asOf,
      })
    );
    jsonLd.push(
      itemListJsonLd(
        he ? 'נמכרים הכי מהר השבוע' : 'Selling fastest this week',
        pageUrl,
        issue.sellers.map((p) => ({ name: p.title, url: `${SITE_URL}/${region}/product/${p.id}`, image: p.imageUrl }))
      )
    );
  }

  const sym = config.currencySymbol;

  return (
    <>
      <SeoHead
        region={region}
        path={path}
        title={title}
        description={description}
        ogType="article"
        articlePublishedTime={issue?.issueDate}
        articleModifiedTime={issue?.asOf}
        noindex={!hasContent}
        jsonLd={jsonLd}
      />
      <Header currentRegion={region} dir={config.direction} />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-16" dir={rtl ? 'rtl' : 'ltr'}>
        <nav className="text-xs mb-4" style={{ color: 'var(--shopli-warm-gray)' }}>
          <Link href={`/${region}/blog`} className="hover:underline">
            {he ? 'בלוג' : 'Blog'}
          </Link>
          {' / '}
          <Link href={`/${region}/weekly`} className="hover:underline">
            {he ? 'שופלי השבועי' : 'The Shopli Weekly'}
          </Link>
        </nav>

        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-700 mb-2">
            {he ? 'גיליון שבועי' : 'Weekly issue'} · <time dateTime={date}>{formatDay(date, lang)}</time>
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: 'var(--shopli-navy)' }}>
            {he ? 'מה נמכר, ומה באמת ירד במחיר' : "What's selling, and what really got cheaper"}
          </h1>
          <p className="text-base max-w-3xl" style={{ color: 'var(--shopli-warm-gray)' }}>
            {he
              ? 'כל יום אנחנו רושמים את המחיר ומספר ההזמנות של כל מוצר שאנחנו עוקבים אחריו. הגיליון הזה הוא מה שהמספרים האלה אומרים על השבוע, בלי מחירי מחירון ובלי מדבקות הנחה.'
              : 'Every day we record the price and order count of every product we track. This issue is what those numbers say about the week: no list prices, no discount stickers.'}
          </p>
          {issue && issue.asOf !== issue.issueDate && (
            <p className="text-xs mt-2" style={{ color: 'var(--shopli-warm-gray)' }}>
              {he
                ? `הנתונים העדכניים ביותר בגיליון הם מ-${formatDay(issue.asOf, lang)}.`
                : `The latest data in this issue is from ${formatDay(issue.asOf, lang)}.`}
            </p>
          )}
        </header>

        {!hasContent && (
          <div className="rounded-2xl border border-[#141414] bg-white p-6 mb-10" style={{ color: 'var(--shopli-warm-gray)' }}>
            {he
              ? 'אין לנו מספיק נתונים לשבוע הזה כדי לכתוב עליו משהו אמיתי. נסו את הגיליון הקודם או את דף הטרנדים.'
              : "We don't have enough data for this week to say anything real about it. Try the previous issue or the trending page."}{' '}
            <Link href={`/${region}/trending`} className="text-orange-700 font-semibold hover:underline">
              {he ? 'לטרנדים' : 'Trending'}
            </Link>
          </div>
        )}

        {insights.length > 0 && (
          <section className="rounded-2xl border border-[#141414] bg-orange-50/60 p-5 sm:p-6 mb-10">
            <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--shopli-navy)' }}>
              {he ? 'השבוע בקצרה' : 'The week in short'}
            </h2>
            <ul className="space-y-2 text-[15px] leading-relaxed" style={{ color: 'var(--shopli-navy)' }}>
              {insights.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </section>
        )}

        {issue && issue.sellers.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--shopli-navy)' }}>
              {he ? 'נמכרים הכי מהר השבוע' : 'Selling fastest this week'}
            </h2>
            <p className="text-sm mb-5" style={{ color: 'var(--shopli-warm-gray)' }}>
              {he
                ? `הזמנות ביום בין ${formatDay(issue.weekFrom, lang)} ל-${formatDay(issue.asOf, lang)}. רק מוצרים עם 94% משוב חיובי ומעלה ויותר מ-1,000 הזמנות.`
                : `Orders per day between ${formatDay(issue.weekFrom, lang)} and ${formatDay(issue.asOf, lang)}. Only products with 94%+ positive feedback and 1,000+ orders.`}
            </p>
            <ol className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {issue.sellers.map((p, i) => (
                <li key={p.id} className="relative">
                  <span className="absolute z-10 top-2 start-2 text-xs font-bold bg-[#141414] text-white rounded-full w-6 h-6 flex items-center justify-center">
                    {i + 1}
                  </span>
                  <ProductCard
                    product={{
                      id: p.id,
                      title: p.title,
                      price: p.price,
                      currency: p.currency,
                      imageUrl: p.imageUrl,
                      rating: p.rating,
                      volume: p.volume,
                    }}
                    currencySymbol={sym}
                    rtl={rtl}
                    locale={config.locale}
                    region={region}
                    category="weekly-sellers"
                    compact
                  />
                  <p className="text-xs mt-1 font-semibold text-emerald-700">
                    {he ? `כ-${fmtInt(p.perDay, lang)} הזמנות ביום` : `~${fmtInt(p.perDay, lang)} orders/day`}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {issue && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--shopli-navy)' }}>
              {he ? 'ירידות מחיר אמיתיות' : 'Real price drops'}
            </h2>
            <p className="text-sm mb-5" style={{ color: 'var(--shopli-warm-gray)' }}>
              {he
                ? 'זול ב-10% ומעלה מהמחיר הרגיל של המוצר עצמו (החציון של 60 הימים האחרונים, לפחות 10 ימי מחיר), עם 90% משוב חיובי ומעלה ואנשים שבאמת קונים אותו.'
                : "10% or more under the product's own usual price (its median over the last 60 days, at least 10 priced days), with 90%+ positive feedback and people actually buying it."}
            </p>
            {issue.drops.length === 0 ? (
              <p className="text-sm rounded-xl border border-dashed border-gray-300 p-4" style={{ color: 'var(--shopli-warm-gray)' }}>
                {he
                  ? 'השבוע אף מוצר לא עבר את הרף. זה קורה: רוב ה"מבצעים" הם המחיר הרגיל.'
                  : 'Nothing cleared the bar this week. That happens: most "deals" are the usual price.'}
              </p>
            ) : (
              <ul className="grid gap-3">
                {issue.drops.map((d) => (
                  <li key={d.id}>
                    <Link
                      href={`/${region}/product/${encodeURIComponent(d.id)}`}
                      className="flex gap-4 items-center bg-white rounded-xl border border-[#141414] p-3 hover:shadow-md transition-shadow"
                      data-track="weekly-drop"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={d.imageUrl} alt="" width={72} height={72} loading="lazy" className="w-[72px] h-[72px] object-cover rounded-lg flex-none" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold line-clamp-2" style={{ color: 'var(--shopli-navy)' }}>
                          {d.title}
                        </p>
                        <p className="text-sm mt-1">
                          <b className="text-emerald-700">{fmtMoney(d.price, d.currency, lang)}</b>{' '}
                          <span style={{ color: 'var(--shopli-warm-gray)' }}>
                            {he ? `במקום ${fmtMoney(d.usual, d.currency, lang)} בדרך כלל` : `vs usual ${fmtMoney(d.usual, d.currency, lang)}`}
                          </span>{' '}
                          <span className="font-semibold text-emerald-700">−{d.dropPct}%</span>
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--shopli-warm-gray)' }}>
                          {d.isLowest
                            ? he
                              ? `המחיר הנמוך ביותר שרשמנו ב-${d.readings} ימי מעקב.`
                              : `The lowest we've recorded in ${d.readings} tracked days.`
                            : he
                              ? `לא השפל: ב-${formatDay(d.lowDay, lang)} המחיר היה ${fmtMoney(d.low, d.currency, lang)}.`
                              : `Not its low: it was ${fmtMoney(d.low, d.currency, lang)} on ${formatDay(d.lowDay, lang)}.`}
                          {' · '}
                          {he ? `כ-${fmtInt(d.perDay, lang)} הזמנות ביום` : `~${fmtInt(d.perDay, lang)} orders/day`}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {issue && issue.categories.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--shopli-navy)' }}>
              {he ? 'קטגוריות בתנועה' : 'Categories on the move'}
            </h2>
            <p className="text-sm mb-4" style={{ color: 'var(--shopli-warm-gray)' }}>
              {he
                ? 'הזמנות השבוע מול השבוע הקודם, על אותם מוצרים שעוקבים אחריהם בשני השבועות.'
                : 'Orders this week against the week before, across the same products tracked in both weeks.'}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm bg-white rounded-xl border border-[#141414]">
                <thead>
                  <tr className="text-start" style={{ color: 'var(--shopli-warm-gray)' }}>
                    <th className="p-3 text-start font-semibold">{he ? 'קטגוריה' : 'Category'}</th>
                    <th className="p-3 text-end font-semibold">{he ? 'השבוע' : 'This week'}</th>
                    <th className="p-3 text-end font-semibold">{he ? 'שבוע קודם' : 'Week before'}</th>
                    <th className="p-3 text-end font-semibold">{he ? 'שינוי' : 'Change'}</th>
                  </tr>
                </thead>
                <tbody>
                  {issue.categories.map((c) => (
                    <tr key={c.category} className="border-t border-gray-100">
                      <td className="p-3" style={{ color: 'var(--shopli-navy)' }}>
                        {c.category}{' '}
                        <span className="text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
                          ({fmtInt(c.products, lang)} {he ? 'מוצרים' : 'products'})
                        </span>
                      </td>
                      <td className="p-3 text-end">{fmtInt(c.weekOrders, lang)}</td>
                      <td className="p-3 text-end">{fmtInt(c.prevWeekOrders, lang)}</td>
                      <td className={`p-3 text-end font-semibold ${c.changePct >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                        {c.changePct >= 0 ? '+' : ''}
                        {c.changePct}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="mb-12 text-sm rounded-2xl border border-gray-200 p-5" style={{ color: 'var(--shopli-warm-gray)' }}>
          <h2 className="text-base font-bold mb-2" style={{ color: 'var(--shopli-navy)' }}>
            {he ? 'איך הגיליון נבנה' : 'How this issue is made'}
          </h2>
          <p>
            {he
              ? 'הכל מחושב מהמחיר ומספר ההזמנות שאנחנו רושמים לכל מוצר פעם ביום. "הזמנות ביום" הוא ההפרש במונה ההזמנות של אליאקספרס בין תחילת השבוע לסופו, חלקי מספר הימים. "המחיר הרגיל" הוא החציון של המחירים שרשמנו ב-60 הימים האחרונים. מוצרים שמופיעים כמה פעמים עם אותו מונה הזמנות נספרים פעם אחת. המחירים משתנים כל הזמן: בדקו את המחיר בעמוד המוצר לפני שקונים. הקישורים לאליאקספרס הם קישורי שותפים, ואנחנו עשויים לקבל עמלה בלי שתשלמו יותר.'
              : 'Everything is computed from the price and order count we record for each product once a day. "Orders per day" is the change in AliExpress\'s order counter from the start of the week to the end, divided by the days between. "Usual price" is the median of the prices we recorded over the last 60 days. Listings that share one order counter are counted once. Prices move all the time, so check the product page before you buy. Links to AliExpress are affiliate links: we may earn a commission at no extra cost to you.'}
          </p>
        </section>

        <div className="mb-12">
          <ShareBar url={pageUrl} title={title} description={description} pageType="blog" region={region} locale={lang} rtl={rtl} />
        </div>

        <section className="mb-12">
          <DealAlertsForm source="weekly" rtl={rtl} />
        </section>

        {archive.length > 1 && (
          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--shopli-navy)' }}>
              {he ? 'גיליונות קודמים' : 'Past issues'}
            </h2>
            <ul className="flex flex-wrap gap-2">
              {archive
                .filter((d) => d !== date)
                .map((d) => (
                  <li key={d}>
                    <Link
                      href={issueHref(region, d, latest)}
                      className="inline-block text-sm px-3 py-1.5 rounded-full border border-[#141414] hover:bg-orange-50"
                    >
                      {formatDay(d, lang)}
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}
