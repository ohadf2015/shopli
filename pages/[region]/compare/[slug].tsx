import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getRegionConfig, RegionConfig, getFlag } from '../../../lib/regions';
import { getComparison, getAllComparisonSlugs, ComparisonArticle } from '../../../lib/comparisons';
import { searchAliExpress } from '../../../lib/aliexpress';

interface Props {
  comparison: ComparisonArticle;
  region: RegionConfig;
  langData: Record<string, string>;
  product1Items: any[];
  product2Items: any[];
}

export default function ComparisonPage({ comparison, region, langData, product1Items, product2Items }: Props) {
  const router = useRouter();
  const isRtl = region.dir === 'rtl';
  const lang = region.lang;
  const t = langData;

  const title = comparison.title[lang] || comparison.title.en;
  const desc = comparison.metaDesc[lang] || comparison.metaDesc.en;
  const introText = comparison.intro[lang] || comparison.intro.en;
  const verdict = comparison.verdict[lang] || comparison.verdict.en;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shopli-neon.vercel.app';

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className={isRtl ? 'font-hebrew' : ''}>
      <Head>
        <title>{title} | Shopli</title>
        <meta name="description" content={desc} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${siteUrl}/${region.slug}/compare/${comparison.slug}`} />
        <meta property="og:site_name" content="Shopli" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={`${siteUrl}/${region.slug}/compare/${comparison.slug}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: title,
              description: desc,
              author: { '@type': 'Organization', name: 'Shopli' },
              about: {
                '@type': 'Thing',
                name: comparison.product1.name + ' vs ' + comparison.product2.name,
              },
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `${siteUrl}/${region.slug}/compare/${comparison.slug}`,
              },
            }),
          }}
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href={`/${region.slug}`} className="text-xl font-bold text-orange-600">
              {getFlag(region.slug)} Shopli
            </Link>
            <nav className="flex gap-4 text-sm text-gray-600">
              <Link href={`/${region.slug}`} className="hover:text-orange-600">{t.home}</Link>
              <Link href={`/${region.slug}#comparisons`} className="hover:text-orange-600">{t.comparisons}</Link>
            </nav>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <Link href={`/${region.slug}`} className="text-orange-600 hover:underline text-sm mb-6 inline-block">
            &larr; {t.backToHome}
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-gray-600 leading-relaxed mb-8">{introText}</p>

          {/* Side-by-side comparison */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {/* Product 1 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">{comparison.product1.name}</h2>
              <div className="space-y-3 text-sm">
                <h3 className="font-semibold text-green-700">{t.pros}</h3>
                <ul className="space-y-1">
                  {comparison.product1.pros.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="text-green-500 mt-0.5">+</span> {p}
                    </li>
                  ))}
                </ul>
                <h3 className="font-semibold text-red-700 mt-3">{t.cons}</h3>
                <ul className="space-y-1">
                  {comparison.product1.cons.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="text-red-500 mt-0.5">−</span> {c}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Product 1 items */}
              {product1Items.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">{t.shopProducts} {comparison.product1.name}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {product1Items.slice(0, 4).map((item: any, i: number) => (
                      <a key={i} href={item.affiliateLink} target="_blank" rel="nofollow sponsored"
                        className="block bg-gray-50 rounded-lg p-2 hover:shadow transition">
                        <img src={item.image} alt={item.title} className="w-full h-24 object-contain mb-2"
                          loading="lazy" />
                        <p className="text-xs text-gray-800 line-clamp-2">{item.title}</p>
                        <p className="text-xs font-bold text-orange-600 mt-1">{item.price}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product 2 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">{comparison.product2.name}</h2>
              <div className="space-y-3 text-sm">
                <h3 className="font-semibold text-green-700">{t.pros}</h3>
                <ul className="space-y-1">
                  {comparison.product2.pros.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="text-green-500 mt-0.5">+</span> {p}
                    </li>
                  ))}
                </ul>
                <h3 className="font-semibold text-red-700 mt-3">{t.cons}</h3>
                <ul className="space-y-1">
                  {comparison.product2.cons.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="text-red-500 mt-0.5">−</span> {c}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Product 2 items */}
              {product2Items.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">{t.shopProducts} {comparison.product2.name}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {product2Items.slice(0, 4).map((item: any, i: number) => (
                      <a key={i} href={item.affiliateLink} target="_blank" rel="nofollow sponsored"
                        className="block bg-gray-50 rounded-lg p-2 hover:shadow transition">
                        <img src={item.image} alt={item.title} className="w-full h-24 object-contain mb-2"
                          loading="lazy" />
                        <p className="text-xs text-gray-800 line-clamp-2">{item.title}</p>
                        <p className="text-xs font-bold text-orange-600 mt-1">{item.price}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Verdict */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 mb-10 border border-orange-100">
            <h2 className="text-xl font-bold text-gray-900 mb-3">{t.verdict}</h2>
            <p className="text-gray-700 leading-relaxed">{verdict}</p>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t.faq}</h2>
            <div className="space-y-4">
              {comparison.faq.map((item, i) => {
                const q = item.q[lang] || item.q.en;
                const a = item.a[lang] || item.a.en;
                return (
                  <div key={i} className="pb-4 border-b last:border-0">
                    <h3 className="font-semibold text-gray-800 mb-2">{q}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Related comparisons */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t.moreComparisons}</h2>
            <p className="text-gray-500">{t.browseMore}</p>
          </div>
        </main>

        <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
          <div className="max-w-6xl mx-auto px-4 text-center text-sm">
            <p>{new Date().getFullYear()} Shopli. {t.footerAffiliate}</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { regions } = await import('../../../lib/regions');
  const slugs = getAllComparisonSlugs();
  const paths = regions.flatMap(r => slugs.map(s => ({ params: { region: r.slug, slug: s } })));
  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const regionSlug = params?.region as string;
  const comparison = getComparison(slug);
  if (!comparison) return { notFound: true };

  const { getRegionConfig, defaultLangData } = await import('../../../lib/regions');
  const region = getRegionConfig(regionSlug);
  if (!region) return { notFound: true };

  const lang = region.lang;

  const langData: Record<string, string> = {
    home: defaultLangData(region)['home'] || 'Home',
    comparisons: lang === 'he' ? 'השוואות' : 'Comparisons',
    backToHome: lang === 'he' ? 'חזרה לדף הבית' : `← Back to ${region.currency} Shopli`,
    pros: lang === 'he' ? 'יתרונות' : 'Pros',
    cons: lang === 'he' ? 'חסרונות' : 'Cons',
    verdict: lang === 'he' ? 'פסק הדין' : 'The Verdict',
    faq: lang === 'he' ? 'שאלות נפוצות' : 'FAQ',
    shopProducts: lang === 'he' ? 'קנו מוצרי' : 'Shop',
    moreComparisons: lang === 'he' ? 'עוד השוואות' : 'More Comparisons',
    browseMore: lang === 'he' ? 'עיינו במדורי ההשוואות שלנו לעוד תוכן מועיל.' : 'Browse our comparison section for more helpful content.',
    footerAffiliate: lang === 'he' ? 'אתר שותפים. חלק מהקישורים הם קישורי שותפים.' : 'Affiliate site. Some links are affiliate links.',
  };

  const { searchAliExpress } = await import('../../../lib/aliexpress');

  let product1Items: any[] = [];
  let product2Items: any[] = [];

  try {
    const [p1, p2] = await Promise.all([
      searchAliExpress(comparison.product1.keyword, regionSlug, 4),
      searchAliExpress(comparison.product2.keyword, regionSlug, 4),
    ]);
    product1Items = p1 || [];
    product2Items = p2 || [];
  } catch (e) {
    // Products are optional — page still renders without them
  }

  return {
    props: { comparison, region, langData, product1Items, product2Items },
    revalidate: 3600,
  };
};