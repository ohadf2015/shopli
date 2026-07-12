import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Header from '../../../components/Header';
import Icon from '../../../components/icons';
import { getRegion, RegionCode } from '../../../lib/regions';
import { getAllCollections, getCollection } from '../../../lib/collections';
import { COLLECTION_CONTENT, CollectionContent } from '../../../lib/collection-content';
import type { RegionConfig } from '../../../lib/regions';
import { searchCollection } from '../../../lib/aliexpress';

interface SectionProducts {
  heading: string;
  body: string;
  icon?: string;
  products: any[];
}

interface PageProps {
  region: string;
  config: { direction: string; lang: string; currencySymbol: string; tgChannel?: string };
  collection: { slug: string; name: string; desc: string; icon: string; keywords: string[] };
  content: any;
  sections: SectionProducts[];
  rtl: boolean;
}

async function searchProducts(region: string, keywords: string[], limit = 4): Promise<any[]> {
  try {
    return await searchCollection(region, keywords, limit);
  } catch { return []; }
}

export default function CollectionPage({ region, config, collection, content, sections, rtl }: PageProps) {
  if (!collection) {
    return <div className="p-20 text-center" style={{ color: 'var(--shopli-warm-gray)' }}>Collection not found</div>;
  }

  const lang = config.lang || 'en';
  const get = (obj: Record<string, string> | undefined) => obj?.[lang] || obj?.en || '';

  return (
    <>
      <Head>
        <title>{content ? get(content.metaTitle) : (collection.name as any)[lang] || (collection.name as any).en} | Shopli</title>
        <meta name="description" content={content ? get(content.metaDesc) : (collection.desc as any)[lang] || (collection.desc as any).en} />
        <meta property="og:title" content={content ? get(content.metaTitle) : collection.name} />
        <meta property="og:description" content={content ? get(content.metaDesc) : (collection.desc as any)[lang] || (collection.desc as any).en} />
        <meta property="og:type" content="article" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://shopli-neon.vercel.app/${region}/collection/${collection.slug}`} />
        {content && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: get(content.h1),
              description: get(content.metaDesc),
              author: { '@type': 'Organization', name: 'Shopli' },
              mainEntityOfPage: { '@type': 'WebPage', '@id': `https://shopli-neon.vercel.app/${region}/collection/${collection.slug}` }
            })
          }} />
        )}
      </Head>

      <Header currentRegion={region} dir={config.direction} />

      <main className="pb-16" style={{ fontFamily: rtl ? "'Assistant', system-ui, sans-serif" : undefined }}>

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-10 md:pt-32">
          <div className="flex items-center gap-2 text-xs mb-4" style={{ color: 'var(--shopli-warm-gray)' }}>
            <a href={`/${region}`} className="hover:underline">{rtl ? 'דף הבית' : 'Home'}</a>
            <span>/</span>
            <span style={{ color: 'var(--shopli-navy)' }}>{collection.name}</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'oklch(90% 0.06 45)', color: 'var(--shopli-orange)' }}>
              <Icon name={collection.icon as any} size={20} />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-extrabold leading-tight" style={{ color: 'var(--shopli-navy)' }}>
                {content ? get(content.h1) : collection.name}
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--shopli-warm-gray)' }}>
                {collection.desc}
              </p>
            </div>
          </div>
          {content && (
            <p className="max-w-2xl text-base leading-relaxed" style={{ color: 'var(--shopli-warm-gray)' }}>
              {get(content.intro)}
            </p>
          )}
        </section>

        {/* Sections with products */}
        {sections.map((section, i) => (
          <section key={i} className={`py-10 ${i % 2 === 1 ? 'bg-white' : 'bg-gray-50/50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {section.icon && (
                      <Icon name={section.icon as any} size={16} className="text-orange-500" />
                    )}
                    <h2 className="text-lg md:text-xl font-bold" style={{ color: 'var(--shopli-navy)' }}>
                      {section.heading}
                    </h2>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--shopli-warm-gray)' }}>
                    {section.body}
                  </p>
                </div>
                <div>
                  {section.products.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {section.products.slice(0, 4).map((p) => (
                        <a key={p.id} href={p.affiliateLink} target="_blank" rel="noopener noreferrer sponsored"
                          className="bg-white rounded-lg border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                          <div className="aspect-square bg-gray-100 overflow-hidden">
                            {p.imageUrl ? (
                              <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" loading="lazy"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--shopli-warm-gray)' }}>
                                <Icon name="package" size={24} />
                              </div>
                            )}
                          </div>
                          <div className="p-2">
                            <div className="text-[0.6rem] font-semibold leading-tight line-clamp-2 mb-1" style={{ color: 'var(--shopli-navy)' }}>
                              {p.title}
                            </div>
                            <div className="font-bold text-xs" style={{ color: 'var(--shopli-teal)' }}>
                              {config.currencySymbol}{p.price.toFixed(2)}
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm p-4 rounded-lg bg-gray-100 text-center" style={{ color: 'var(--shopli-warm-gray)' }}>
                      {rtl ? 'טוען מוצרים...' : 'Loading products...'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Budget tip */}
        {content?.budgetTip && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="rounded-xl p-6 border border-dashed" style={{ borderColor: 'var(--shopli-orange)', background: 'oklch(98% 0.02 45)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span style={{ color: "var(--shopli-orange)", display: "inline-flex" }}><Icon name="tag" size={16} /></span>
                <span className="font-bold text-sm" style={{ color: 'var(--shopli-navy)' }}>
                  {rtl ? 'טיפ חיסכון' : 'Money-Saving Tip'}
                </span>
              </div>
              <p className="text-sm" style={{ color: 'var(--shopli-warm-gray)' }}>{get(content.budgetTip)}</p>
            </div>
          </section>
        )}

        {/* FAQ */}
        {content?.faq && content.faq.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            <h2 className="text-lg md:text-xl font-bold mb-6" style={{ color: 'var(--shopli-navy)' }}>
              {rtl ? 'שאלות נפוצות' : 'Frequently Asked Questions'}
            </h2>
            <div className="space-y-4 max-w-2xl">
              {content.faq.map((item: any, i: number) => (
                <details key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                  <summary className="p-4 cursor-pointer font-semibold text-sm hover:bg-gray-50" style={{ color: 'var(--shopli-navy)' }}>
                    {get(item.q)}
                  </summary>
                  <p className="p-4 pt-0 text-sm leading-relaxed" style={{ color: 'var(--shopli-warm-gray)' }}>
                    {get(item.a)}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* More collections */}
        <section className="border-t border-gray-100 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-widest" style={{ color: 'var(--shopli-orange)' }}>
              {rtl ? 'עוד נושאים' : 'More Collections'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {getAllCollections().filter(c => c.slug !== collection.slug).slice(0, 4).map(c => (
                <a key={c.slug} href={`/${region}/collection/${c.slug}`}
                  className="p-3 rounded-lg border border-gray-100 hover:border-orange-200 transition-all">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon name={c.icon as any} size={14} className="text-orange-500" />
                    <span className="font-semibold text-xs" style={{ color: 'var(--shopli-navy)' }}>{(c as any).name as string}</span>
                  </div>
                  <p className="text-[0.6rem] leading-snug" style={{ color: 'var(--shopli-warm-gray)' }}>{(c as any).desc as string}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, query }) => {
  const region = (query?.region as string) || (params?.region as string) || 'eu';
  const slug = params?.collection as string;
  const config = getRegion(region);
  const rtl = config.direction === 'rtl';

  const coll = getCollection(slug);
  if (!coll) {
    return { notFound: true };
  }

  const lang = config.lang || 'en';
  const get = (obj: Record<string, string>) => obj?.[lang] || obj?.en || '';
  const content = COLLECTION_CONTENT[slug] || null;

  // Resolve localized name/desc into strings for the page
  const resolvedCollection = {
    slug: coll.slug,
    name: get(coll.name),
    desc: get(coll.desc),
    icon: coll.icon,
    keywords: coll.keywords,
  };

  const sections: SectionProducts[] = [];

  if (content) {
    for (const section of content.sections) {
      const products = await searchProducts(region, section.keywords, 4);
      sections.push({
        heading: get(section.heading),
        body: get(section.body),
        icon: section.icon,
        products,
      });
    }
  } else {
    // Fallback: use collection keywords
    const products = await searchProducts(region, coll.keywords, 8);
    sections.push({
      heading: get(coll.name),
      body: get(coll.desc),
      products,
    });
  }

  return {
    props: {
      region,
      config,
      collection: resolvedCollection,
      content: content ? JSON.parse(JSON.stringify(content)) : null,
      sections,
      rtl,
    },
  };
};