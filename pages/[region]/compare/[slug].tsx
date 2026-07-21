import { GetServerSideProps } from 'next';
import Header from '../../../components/Header';
import Icon from '../../../components/icons';
import SeoHead from '../../../components/SeoHead';
import { getRegion, RegionCode } from '../../../lib/regions';
import { getComparison } from '../../../lib/comparisons';
import { articleJsonLd, breadcrumbJsonLd, productJsonLd, SITE_URL } from '../../../lib/seo';

export default function ComparisonPage({ region, config, comparison, prod1Items, prod2Items, rtl, error }: any) {
  if (error) {
    return <div className="p-20 text-center" style={{ color: 'var(--shopli-warm-gray)' }}>Error: {error}</div>;
  }

  const lang = config?.lang || 'en';
  const t = (obj: any) => obj?.[lang] || obj?.en || '';

  const c = comparison;
  if (!c) return null;

  const pageUrl = `${SITE_URL}/${region}/compare/${c.slug}`;
  const title = `${t(c.title)} | Shopli`;
  const description = t(c.metaDesc);

  const structuredData: Record<string, unknown>[] = [
    breadcrumbJsonLd([
      { name: rtl ? 'דף הבית' : 'Home', url: `${SITE_URL}/${region}` },
      { name: rtl ? 'השוואות' : 'Comparisons', url: `${SITE_URL}/${region}/compare/french-press-vs-drip` },
      { name: t(c.title), url: pageUrl },
    ]),
    articleJsonLd({
      headline: t(c.title),
      description,
      url: pageUrl,
    }),
  ];

  // Product schema for the first item of each comparison side
  for (const item of [prod1Items?.[0], prod2Items?.[0]]) {
    if (item?.title) {
      structuredData.push(
        productJsonLd({
          title: item.title,
          description: item.title,
          image: item.image,
          url: item.affiliateLink || pageUrl,
          brand: item.shopName,
          price: item.price,
          currency: config?.currency,
          ratingValue: item.rating ? item.rating / 20 : undefined,
          reviewCount: item.reviewCount,
        })
      );
    }
  }

  return (
    <>
      <SeoHead
        region={region as RegionCode}
        path={`/compare/${c.slug}`}
        title={title}
        description={description}
        ogType="article"
        jsonLd={structuredData}
      />
      <Header currentRegion={region} dir={config?.direction} />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="flex items-center gap-2 text-xs mb-4" style={{ color: 'var(--shopli-warm-gray)' }}>
          <a href={`/${region}`}>{rtl ? 'דף הבית' : 'Home'}</a> <span>/</span>
          <span style={{ color: 'var(--shopli-navy)' }}>{t(c.title)}</span>
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--shopli-navy)' }}>{t(c.title)}</h1>
        <p className="max-w-3xl text-base leading-relaxed mb-8" style={{ color: 'var(--shopli-warm-gray)' }}>{t(c.intro)}</p>

        {/* Side-by-side comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {[c.product1, c.product2].map((prod: any, pi: number) => {
            const items = pi === 0 ? prod1Items : prod2Items;
            return (
              <div key={pi} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--shopli-navy)' }}>{prod.name}</h2>

                <div className="mb-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-green-700 mb-2">
                    {rtl ? 'יתרונות' : 'Pros'}
                  </h3>
                  <ul className="space-y-1">
                    {prod.pros.map((p: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-green-500 shrink-0">+</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-red-700 mb-2">
                    {rtl ? 'חסרונות' : 'Cons'}
                  </h3>
                  <ul className="space-y-1">
                    {prod.cons.map((c: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-red-500 shrink-0">−</span> {c}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Product items from AliExpress */}
                {items?.length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="text-xs font-semibold mb-3" style={{ color: 'var(--shopli-warm-gray)' }}>
                      {rtl ? `מוצרים מ-AliExpress` : `Shop ${prod.name} on AliExpress`}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {items.slice(0, 4).map((item: any, i: number) => (
                        <a key={i} href={item.affiliateLink} target="_blank" rel="nofollow sponsored"
                          className="block bg-gray-50 rounded-lg p-2 hover:shadow transition">
                          <img src={item.image} alt={item.title} className="w-full h-20 object-contain mb-1" loading="lazy" decoding="async" />
                          <p className="text-xs text-gray-700 line-clamp-2">{item.title}</p>
                          <p className="text-xs font-bold mt-1" style={{ color: 'var(--shopli-orange)' }}>{item.price}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Verdict */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 mb-10 border border-orange-100">
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--shopli-navy)' }}>
            {rtl ? 'פסק הדין' : 'The Verdict'}
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm">{t(c.verdict)}</p>
        </div>

        {/* FAQ */}
        {c.faq?.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--shopli-navy)' }}>
              {rtl ? 'שאלות נפוצות' : 'FAQ'}
            </h2>
            <div className="space-y-4">
              {c.faq.map((item: any, i: number) => (
                <div key={i} className="pb-4 border-b last:border-0">
                  <h3 className="font-semibold text-sm text-gray-800 mb-2">{t(item.q)}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{t(item.a)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
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

  const comparison = getComparison(slug);
  if (!comparison) return { notFound: true };

  let prod1Items: any[] = [];
  let prod2Items: any[] = [];
  try {
    const { searchAliExpress } = await import('../../../lib/aliexpress');
    const [p1, p2] = await Promise.all([
      searchAliExpress(comparison.product1.keyword, region, 4),
      searchAliExpress(comparison.product2.keyword, region, 4),
    ]);
    prod1Items = p1 || [];
    prod2Items = p2 || [];
  } catch {}

  return {
    props: { region, config, comparison, prod1Items, prod2Items, rtl },
  };
};
