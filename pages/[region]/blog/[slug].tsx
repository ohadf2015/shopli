import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../../components/Header';
import { getRegion } from '../../../lib/regions';
import { getBlogPost } from '../../../lib/blog';

export default function BlogPostPage({ region, config, post, rtl, error }: any) {
  if (error) {
    return <div className="p-20 text-center" style={{ color: 'var(--shopli-warm-gray)' }}>Error: {error}</div>;
  }

  const lang = config?.lang || 'en';
  const t = (obj: any) => obj?.[lang] || obj?.en || '';

  const p = post;
  if (!p) return null;

  return (
    <>
      <Head>
        <title>{t(p.title)} | Shopli Blog</title>
        <meta name="description" content={t(p.metaDesc)} />
        <meta property="article:published_time" content={p.publishDate} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: t(p.title),
            description: t(p.metaDesc),
            datePublished: p.publishDate,
            author: { '@type': 'Organization', name: 'Shopli' },
            mainEntityOfPage: { '@type': 'WebPage', '@id': `https://shopli-neon.vercel.app/${region}/blog/${p.slug}` }
          })
        }} />
      </Head>
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

                  {/* Related products inline */}
                  {p.relatedProducts && i === 0 && (
                    <div className="mt-6 p-4 bg-orange-50/50 rounded-xl">
                      <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--shopli-navy)' }}>
                        {rtl ? 'מוצרים קשורים' : 'Related Products'}
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {p.relatedProducts.slice(0, 4).map((rp: any, ri: number) => (
                          <a key={ri} href={`/${region}/compare/${rp.keyword.replace(/\s+/g, '-').toLowerCase()}`} 
                            className="text-xs font-medium text-orange-600 hover:underline">
                            {rp.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
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
          </div>
        </article>
      </main>

      <footer className="border-t border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
          <div className="font-semibold" style={{ color: 'var(--shopli-navy)' }}>shopli</div>
          <div>&copy; {new Date().getFullYear()} {rtl ? 'כל הזכויות שמורות' : 'All rights reserved.'}</div>
        </div>
      </footer>
    </>
  );
}


export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug as string;
  const region = (params?.region as string) || 'eu';
  const config = getRegion(region);
  const rtl = config.direction === 'rtl';

  const post = getBlogPost(slug);
  if (!post) return { notFound: true };

  return {
    props: { region, config, post, rtl },
  };
};