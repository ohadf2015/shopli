import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Header from '../../../components/Header';
import SeoHead from '../../../components/SeoHead';
import ShareBar from '../../../components/ShareBar';
import { getRegion, isValidRegion, RegionCode } from '../../../lib/regions';
import { getBlogPost, isBlogPostInRegion } from '../../../lib/blog';
import { blogPostingJsonLd, breadcrumbJsonLd, faqJsonLd, SITE_URL } from '../../../lib/seo';

/**
 * The one route from a guide to something buyable.
 *
 * This used to link `/compare/<slugified keyword>`, but /compare/[slug] only
 * resolves the 15 curated comparison slugs — "adjustable dumbbells set" is a
 * search phrase, not one of them, so every link in every post 404'd. Search
 * takes the keyword directly and returns live listings with affiliate links.
 */
function ShopThePicks({
  region,
  rtl,
  items,
}: {
  region: string;
  rtl: boolean;
  items?: Array<{ name: string; keyword: string }>;
}) {
  if (!items?.length) return null;
  return (
    <div className="mt-6 p-4 sm:p-5 rounded-xl border border-orange-100 bg-orange-50/50">
      <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--shopli-navy)' }}>
        {rtl ? 'לראות את הפריטים מהמדריך' : 'See the picks from this guide'}
      </h3>
      <p className="text-xs mb-3" style={{ color: 'var(--shopli-warm-gray)' }}>
        {rtl ? 'מחירים חיים מאליאקספרס — נפתח בחיפוש באתר.' : 'Live AliExpress prices — opens a search on Shopli.'}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((rp) => (
          <a
            key={rp.keyword}
            href={`/${region}/search?q=${encodeURIComponent(rp.keyword)}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-white border border-orange-200 hover:border-orange-400 hover:shadow-sm transition-all"
            style={{ color: 'var(--shopli-orange)' }}
          >
            {rp.name}
            <span aria-hidden="true">{rtl ? '←' : '→'}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function BlogPostPage({ region, config, post, rtl, regionOnly, error }: any) {
  if (error) {
    return <div className="p-20 text-center" style={{ color: 'var(--shopli-warm-gray)' }}>Error: {error}</div>;
  }

  const lang = config?.lang || 'en';
  const t = (obj: any) => obj?.[lang] || obj?.en || '';

  const p = post;
  if (!p) return null;

  const pageUrl = `${SITE_URL}/${region}/blog/${p.slug}`;
  const title = `${t(p.title)} | Shopli Blog`;
  const description = t(p.metaDesc);

  const structuredData = [
    breadcrumbJsonLd([
      { name: rtl ? 'דף הבית' : 'Home', url: `${SITE_URL}/${region}` },
      { name: rtl ? 'בלוג' : 'Blog', url: `${SITE_URL}/${region}/blog` },
      { name: t(p.title), url: pageUrl },
    ]),
    blogPostingJsonLd({
      headline: t(p.title),
      description,
      url: pageUrl,
      datePublished: p.publishDate,
      dateModified: p.publishDate,
    }),
    // The guide already renders this Q&A; marking it up is what makes it
    // quotable by AI Overviews and assistants.
    faqJsonLd((p.faq || []).map((f: any) => ({ question: t(f.q), answer: t(f.a) }))),
  ].filter(Boolean);

  return (
    <>
      <SeoHead
        region={region as RegionCode}
        path={`/blog/${p.slug}`}
        title={title}
        description={description}
        ogType="article"
        articlePublishedTime={p.publishDate}
        articleModifiedTime={p.publishDate}
        hreflang={!regionOnly}
        jsonLd={structuredData}
      />
      <Header currentRegion={region} dir={config?.direction} />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <Link href={`/${region}/blog`} className="text-orange-600 hover:underline text-sm mb-6 inline-block">
          &larr; {rtl ? 'כל הכתבות' : 'All Articles'}
        </Link>

        <article>
          <header className="mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-600">
              {rtl ? 'מדריך קנייה' : 'Buying Guide'}
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold mt-2 mb-4" style={{ color: 'var(--shopli-navy)' }}>
              {t(p.title)}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed" style={{ color: 'var(--shopli-warm-gray)' }}>
              {t(p.intro)}
            </p>
            <time className="text-xs mt-3 block" style={{ color: 'var(--shopli-warm-gray)' }} dateTime={p.publishDate}>
              {new Date(p.publishDate).toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
            <div className="mt-4">
              <ShareBar
                title={t(p.title)}
                url={pageUrl}
                description={description}
                pageType="blog"
                region={region}
                locale={lang}
                rtl={rtl}
              />
            </div>
          </header>

          <div className="prose prose-gray max-w-none" style={{ color: 'var(--shopli-navy)' }}>
            {p.sections.map((section: any, i: number) => (
              <section key={i} className={`py-8 ${i % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'} -mx-4 sm:-mx-6 px-4 sm:px-6`}>
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--shopli-navy)' }}>
                    {t(section.heading)}
                  </h2>
                  <p className="text-base leading-relaxed" style={{ color: 'var(--shopli-warm-gray)' }}>
                    {t(section.body)}
                  </p>

                  {i === 0 && <ShopThePicks region={region} rtl={rtl} items={p.relatedProducts} />}
                </div>
              </section>
            ))}

            {/* FAQ */}
            {p.faq?.length > 0 && (
              <section className="py-8 bg-white -mx-4 sm:-mx-6 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--shopli-navy)' }}>
                    {rtl ? 'שאלות נפוצות' : 'FAQ'}
                  </h2>
                  <div className="space-y-4">
                    {p.faq.map((item: any, i: number) => (
                      <div key={i} className="pb-4 border-b last:border-0">
                        <h3 className="font-semibold text-sm text-gray-800 mb-2">{t(item.q)}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{t(item.a)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Readers who reach the end of a buying guide are the ones ready
                to buy, so repeat the route out rather than ending on the FAQ. */}
            <section className="pt-4">
              <ShopThePicks region={region} rtl={rtl} items={p.relatedProducts} />
            </section>
          </div>
        </article>
      </main>

    </>
  );
}


export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
  const slug = params?.slug as string;
  const region = (params?.region as string) || 'eu';
  if (!isValidRegion(region)) return { notFound: true };
  const config = getRegion(region);
  const rtl = config.direction === 'rtl';

  // 404 rather than render: a country-specific post (import tax rules, say) is
  // wrong in the other locales, not merely untranslated.
  if (!isBlogPostInRegion(slug, region)) return { notFound: true };
  const post = getBlogPost(slug);
  if (!post) return { notFound: true };

  // Editorial content only — it changes when we deploy, not per request.
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');

  return {
    // regionOnly suppresses hreflang: the alternates would point at the eight
    // locales where this post 404s.
    props: { region, config, post, rtl, regionOnly: !!post.regions },
  };
};
