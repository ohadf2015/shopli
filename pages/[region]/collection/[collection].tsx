import { GetServerSideProps } from 'next';
import Header from '../../../components/Header';
import Icon from '../../../components/icons';
import ProductCard from '../../../components/ProductCard';
import WhatsAppShare from '../../../components/WhatsAppShare';
import SeoHead from '../../../components/SeoHead';
import { getRegion, RegionCode } from '../../../lib/regions';
import { getCollection } from '../../../lib/collections';
import { COLLECTION_CONTENT } from '../../../lib/collection-content';
import {
  articleJsonLd,
  breadcrumbJsonLd,
  getCollectionOgImage,
  itemListJsonLd,
  productJsonLd,
  SITE_URL,
} from '../../../lib/seo';

export default function CollectionPage({ region, config, collection, content, sections, rtl, error }: any) {
  if (error) {
    return (
      <div className="p-20 text-center" style={{ color: 'var(--shopli-warm-gray)' }}>
        Error: {error}
      </div>
    );
  }
  const lang = config?.lang || 'en';
  const get = (obj: any) => obj?.[lang] || obj?.en || '';

  const pageUrl = `${SITE_URL}/${region}/collection/${collection.slug}`;
  // Prefer editorial Hebrew/locale titles; fall back to collection name
  const metaTitleBase = content
    ? get(content.metaTitle)
    : collection.metaTitle
      ? get(collection.metaTitle)
      : collection.name;
  const title = `${metaTitleBase} | ${rtl ? 'שופלי' : 'Shopli'}`;
  const description = content
    ? get(content.metaDesc)
    : collection.metaDesc
      ? get(collection.metaDesc)
      : collection.desc;
  const headline = content ? get(content.h1) : collection.name;
  const ogImage = getCollectionOgImage(collection.slug, metaTitleBase, lang);

  const allProducts = (sections || []).flatMap((s: any) => s.products || []);
  const structuredData: Record<string, unknown>[] = [];

  // BreadcrumbList: Home > Categories > Collection (Hebrew when rtl)
  structuredData.push(
    breadcrumbJsonLd([
      { name: rtl ? 'דף הבית' : 'Home', url: `${SITE_URL}/${region}` },
      {
        name: rtl ? 'קטגוריות' : 'Categories',
        url: `${SITE_URL}/${region}#categories`,
      },
      { name: collection.name, url: pageUrl },
    ])
  );

  if (content) {
    structuredData.push(
      articleJsonLd({
        headline,
        description,
        url: pageUrl,
        image: ogImage,
      })
    );
  }

  if (allProducts.length > 0) {
    structuredData.push(
      itemListJsonLd(
        headline,
        pageUrl,
        allProducts.slice(0, 16).map((p: any, i: number) => ({
          name: p.title,
          url: p.affiliateLink || pageUrl,
          image: p.imageUrl,
          position: i + 1,
        }))
      )
    );
  }

  // Product schema with Offers for visible products
  for (const p of allProducts.slice(0, 12)) {
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
          ratingValue: p.rating > 0 ? p.rating / 20 : undefined,
          reviewCount: p.reviewCount || undefined,
          sku: p.id,
          region,
        })
      );
    }
  }

  return (
    <>
      <SeoHead
        region={region as RegionCode}
        path={`/collection/${collection.slug}`}
        title={title}
        description={description}
        image={ogImage}
        ogType="product"
        jsonLd={structuredData}
      />
      <Header currentRegion={region} dir={config?.direction} />
      <main
        className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-16"
        style={{ fontFamily: rtl ? "'Assistant', system-ui, sans-serif" : undefined }}
      >
        <nav
          className="flex items-center gap-2 text-xs mb-4 flex-wrap"
          style={{ color: 'var(--shopli-warm-gray)' }}
          aria-label="Breadcrumb"
        >
          <a href={`/${region}`} className="hover:underline">
            {rtl ? 'דף הבית' : 'Home'}
          </a>
          <span>/</span>
          <a href={`/${region}#categories`} className="hover:underline">
            {rtl ? 'קטגוריות' : 'Categories'}
          </a>
          <span>/</span>
          <span style={{ color: 'var(--shopli-navy)' }}>{collection.name}</span>
        </nav>

        <h1
          className="text-2xl md:text-4xl font-extrabold mb-4"
          style={{ color: 'var(--shopli-navy)' }}
        >
          {headline}
        </h1>
        {content && (
          <p
            className="max-w-2xl text-base leading-relaxed mb-8"
            style={{ color: 'var(--shopli-warm-gray)' }}
          >
            {get(content.intro)}
          </p>
        )}
        {!content && collection.desc && (
          <p
            className="max-w-2xl text-base leading-relaxed mb-8"
            style={{ color: 'var(--shopli-warm-gray)' }}
          >
            {collection.desc}
          </p>
        )}

        {sections.map((section: any, i: number) => (
          <section
            key={i}
            className={`py-8 ${i % 2 === 1 ? 'bg-white' : 'bg-gray-50/50'} -mx-4 sm:-mx-6 px-4 sm:px-6`}
          >
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6 items-start">
                <div>
                  <h2
                    className="text-xl font-bold mb-2"
                    style={{ color: 'var(--shopli-navy)' }}
                  >
                    {section.heading}
                  </h2>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--shopli-warm-gray)' }}
                  >
                    {section.body}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {section.products.slice(0, 4).map((p: any) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      currencySymbol={config?.currencySymbol || '€'}
                      rtl={rtl}
                      locale={lang}
                      fallbackUrl={pageUrl}
                      region={region}
                      showShare
                      showCompareLink
                      compact
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}

        {content?.faq && (
          <section className="py-8">
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--shopli-navy)' }}>
              {rtl ? 'שאלות נפוצות' : 'FAQ'}
            </h2>
            {content.faq.map((item: any, i: number) => (
              <details
                key={i}
                className="border border-gray-200 rounded-lg mb-2 overflow-hidden"
              >
                <summary
                  className="p-3 cursor-pointer font-semibold text-sm"
                  style={{ color: 'var(--shopli-navy)' }}
                >
                  {get(item.q)}
                </summary>
                <p className="p-3 pt-0 text-sm" style={{ color: 'var(--shopli-warm-gray)' }}>
                  {get(item.a)}
                </p>
              </details>
            ))}
          </section>
        )}

        <section className="py-6 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm font-medium" style={{ color: 'var(--shopli-warm-gray)' }}>
              {rtl ? 'אהבתם את האוסף? שתפו עם חברים' : 'Like this collection? Share it with friends'}
            </p>
            <WhatsAppShare
              title={rtl ? `אוסף ${collection.name} — שופלי` : `${collection.name} collection — Shopli`}
              url={pageUrl}
              description={description}
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
    const resolvedCollection = {
      slug: coll.slug,
      name: get(coll.name) || get(coll.tag) || coll.slug,
      desc: get(coll.desc),
      icon: coll.icon,
      keywords: coll.keywords,
      metaTitle: coll.metaTitle || null,
      metaDesc: coll.metaDesc || null,
    };
    const sections: any[] = [];

    if (content) {
      for (const section of content.sections) {
        const { searchCollection: sc } = await import('../../../lib/aliexpress');
        const products = await sc(region, section.keywords, 4);
        sections.push({
          heading: get(section.heading),
          body: get(section.body),
          products,
        });
      }
    } else if (coll.keywords?.length) {
      // Collections without editorial content still show products
      const { searchCollection: sc } = await import('../../../lib/aliexpress');
      const products = await sc(region, coll.keywords, 8);
      if (products.length > 0) {
        sections.push({
          heading: resolvedCollection.name,
          body: resolvedCollection.desc || '',
          products,
        });
      }
    }

    return {
      props: {
        region,
        config,
        collection: resolvedCollection,
        content: content ? JSON.parse(JSON.stringify(content)) : null,
        sections: JSON.parse(JSON.stringify(sections)),
        rtl: config?.direction === 'rtl',
        error: null,
      },
    };
  } catch (e: any) {
    return {
      props: {
        region: 'eu',
        config: null,
        collection: { slug: 'error', name: 'Error' },
        content: null,
        sections: [],
        rtl: false,
        error: e?.message || String(e),
      },
    };
  }
};
