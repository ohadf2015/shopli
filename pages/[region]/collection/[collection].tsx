import { GetServerSideProps } from 'next';
import Header from '../../../components/Header';
import Icon from '../../../components/icons';
import WhatsAppShare from '../../../components/WhatsAppShare';
import SeoHead from '../../../components/SeoHead';
import { getRegion, RegionCode } from '../../../lib/regions';
import { getAllCollections, getCollection } from '../../../lib/collections';
import { COLLECTION_CONTENT } from '../../../lib/collection-content';
import {
  articleJsonLd,
  breadcrumbJsonLd,
  productJsonLd,
  SITE_URL,
} from '../../../lib/seo';

export default function CollectionPage({ region, config, collection, content, sections, rtl, error }: any) {
  if (error) {
    return <div className="p-20 text-center" style={{ color: 'var(--shopli-warm-gray)' }}>Error: {error}</div>;
  }
  const lang = config?.lang || 'en';
  const get = (obj: any) => obj?.[lang] || obj?.en || '';

  const pageUrl = `${SITE_URL}/${region}/collection/${collection.slug}`;
  const title = content ? `${get(content.metaTitle)} | Shopli` : `${collection.name} | Shopli`;
  const description = content ? get(content.metaDesc) : collection.desc;
  const headline = content ? get(content.h1) : collection.name;

  const structuredData: Record<string, unknown>[] = [];

  // BreadcrumbList: Home > Collection
  structuredData.push(
    breadcrumbJsonLd([
      { name: rtl ? 'דף הבית' : 'Home', url: `${SITE_URL}/${region}` },
      { name: collection.name, url: pageUrl },
    ])
  );

  // Article schema when editorial content exists
  if (content) {
    structuredData.push(
      articleJsonLd({
        headline,
        description,
        url: pageUrl,
        image: content.image ? `${SITE_URL}${content.image}` : undefined,
      })
    );
  }

  // Product schema for visible AliExpress products
  for (const section of sections || []) {
    for (const p of section.products?.slice(0, 4) || []) {
      if (p.title) {
        structuredData.push(
          productJsonLd({
            title: p.title,
            description: p.title,
            image: p.imageUrl,
            url: p.affiliateLink || pageUrl,
            brand: p.shopName,
            price: p.price,
            currency: config?.currency,
            ratingValue: p.rating ? p.rating / 20 : undefined,
            reviewCount: p.reviewCount,
          })
        );
      }
    }
  }

  return (
    <>
      <SeoHead
        region={region as RegionCode}
        path={`/collection/${collection.slug}`}
        title={title}
        description={description}
        ogType="article"
        jsonLd={structuredData}
      />
      <Header currentRegion={region} dir={config?.direction} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="flex items-center gap-2 text-xs mb-4" style={{ color: 'var(--shopli-warm-gray)' }}>
          <a href={`/${region}`}>Home</a> <span>/</span> <span style={{ color: 'var(--shopli-navy)' }}>{collection.name}</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--shopli-navy)' }}>
          {headline}
        </h1>
        {content && <p className="max-w-2xl text-base leading-relaxed mb-8" style={{ color: 'var(--shopli-warm-gray)' }}>{get(content.intro)}</p>}

        {sections.map((section: any, i: number) => (
          <section key={i} className={`py-8 ${i % 2 === 1 ? 'bg-white' : 'bg-gray-50/50'} -mx-4 sm:-mx-6 px-4 sm:px-6`}>
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6 items-start">
                <div>
                  <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--shopli-navy)' }}>{section.heading}</h2>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--shopli-warm-gray)' }}>{section.body}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {section.products.slice(0, 4).map((p: any) => (
                    <a key={p.id} href={p.affiliateLink} target="_blank" rel="noopener noreferrer sponsored"
                      className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md">
                      <div className="aspect-square bg-gray-100 overflow-hidden relative">
                        {p.imageUrl ? <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" loading="lazy" decoding="async" /> : <div className="w-full h-full flex items-center justify-center"><Icon name="package" size={24} /></div>}
                        {p.discount && (
                          <span className="absolute top-1 right-1 text-[9px] font-bold px-1.5 py-0.5 rounded"
                            style={{ background: 'oklch(65% 0.2 45)', color: 'white' }}
                          >{p.discount}</span>
                        )}
                      </div>
                      <div className="p-2">
                        <div className="text-xs font-semibold leading-tight line-clamp-2 mb-1" style={{ color: 'var(--shopli-navy)' }}>{p.title}</div>
                        <div className="flex items-baseline gap-1 mb-0.5">
                          <span className="font-bold text-xs" style={{ color: 'var(--shopli-teal)' }}>{config?.currencySymbol || '€'}{p.price?.toFixed(2)}</span>
                          {p.originalPrice && p.originalPrice > p.price && (
                            <span className="text-[9px] line-through" style={{ color: 'var(--shopli-warm-gray)' }}>{config?.currencySymbol || '€'}{p.originalPrice.toFixed(2)}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[9px]" style={{ color: 'var(--shopli-warm-gray)' }}>
                            {p.rating >= 90 ? '★' : ''}{p.volume > 0 ? ` ${p.volume > 1000 ? (p.volume/1000).toFixed(1) + 'k' : p.volume} sold` : ''}
                          </span>
                        </div>
                        <div className="mt-1.5">
                          <WhatsAppShare
                            title={p.title}
                            url={p.affiliateLink || pageUrl}
                            locale={lang}
                            size="sm"
                          />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}

        {content?.faq && (
          <section className="py-8">
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--shopli-navy)' }}>FAQ</h2>
            {content.faq.map((item: any, i: number) => (
              <details key={i} className="border border-gray-200 rounded-lg mb-2 overflow-hidden">
                <summary className="p-3 cursor-pointer font-semibold text-sm" style={{ color: 'var(--shopli-navy)' }}>{get(item.q)}</summary>
                <p className="p-3 pt-0 text-sm" style={{ color: 'var(--shopli-warm-gray)' }}>{get(item.a)}</p>
              </details>
            ))}
          </section>
        )}

        {/* Share this collection */}
        <section className="py-6 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm font-medium" style={{ color: 'var(--shopli-warm-gray)' }}>
              {rtl ? 'אהבתם את האוסף? שתפו עם חברים' : 'Like this collection? Share it with friends'}
            </p>
            <WhatsAppShare
              title={rtl ? `אוסף ${collection.name} — שופלי` : `${collection.name} collection — Shopli`}
              url={pageUrl}
              description={get(collection.desc || '')}
              locale={lang}
              size="md"
            />
          </div>
        </section>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, query }) => {
  try {
    const region = (query?.region as string) || (params?.region as string) || 'eu';
    const slug = params?.collection as string;
    const config = getRegion(region);
    const lang = config?.lang || 'en';
    const get = (obj: any) => obj?.[lang] || obj?.en || '';
    const coll = getCollection(slug);
    if (!coll) return { notFound: true };

    const content = COLLECTION_CONTENT[slug] || null;
    const resolvedCollection = { slug: coll.slug, name: get(coll.name), desc: get(coll.desc), icon: coll.icon, keywords: coll.keywords };
    const sections: any[] = [];

    if (content) {
      for (const section of content.sections) {
        const { searchCollection: sc } = await import('../../../lib/aliexpress');
        const products = await sc(region, section.keywords, 4);
        sections.push({ heading: get(section.heading), body: get(section.body), products });
      }
    }

    return { props: { region, config, collection: resolvedCollection, content: content ? JSON.parse(JSON.stringify(content)) : null, sections, rtl: config?.direction === 'rtl', error: null } };
  } catch (e: any) {
    return { props: { region: 'eu', config: null, collection: { slug: 'error', name: 'Error' }, content: null, sections: [], rtl: false, error: e?.message || String(e) } };
  }
};
