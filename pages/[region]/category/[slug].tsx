import { GetStaticPaths, GetStaticProps } from 'next';
import Header from '../../../components/Header';
import Icon from '../../../components/icons';
import ProductCard from '../../../components/ProductCard';
import WhatsAppShare from '../../../components/WhatsAppShare';
import SeoHead from '../../../components/SeoHead';
import { getRegion, RegionCode, REGIONS } from '../../../lib/regions';
import { getAllCategories, getCategory, Category, getCategoryNavItems } from '../../../lib/categories';
import {
  breadcrumbJsonLd,
  getCollectionOgImage,
  itemListJsonLd,
  SITE_URL,
} from '../../../lib/seo';

interface CategoryPageProps {
  region: RegionCode;
  config: ReturnType<typeof getRegion>;
  category: Category;
  products: any[];
  rtl: boolean;
  categoryNavItems: Array<{ slug: string; name: string }>;
}

export default function CategoryPage({
  region,
  config,
  category,
  products,
  rtl,
  categoryNavItems,
}: CategoryPageProps) {
  const lang = config?.lang || 'en';
  const pageUrl = `${SITE_URL}/${region}/category/${category.slug}`;
  const categoryName = category.name[lang] || category.name.en || category.slug;
  const categoryDesc = category.desc[lang] || category.desc.en || '';
  const title = `${categoryName} | ${rtl ? 'שופלי' : 'Shopli'}`;
  const ogImage = getCollectionOgImage(category.slug, categoryName, lang);

  const structuredData: Record<string, unknown>[] = [];

  // BreadcrumbList: Home > Categories > Category
  structuredData.push(
    breadcrumbJsonLd([
      { name: rtl ? 'דף הבית' : 'Home', url: `${SITE_URL}/${region}` },
      {
        name: rtl ? 'קטגוריות' : 'Categories',
        url: `${SITE_URL}/${region}#categories`,
      },
      { name: categoryName, url: pageUrl },
    ])
  );

  // ItemList schema for the product grid
  if (products.length > 0) {
    structuredData.push(
      itemListJsonLd(
        categoryName,
        pageUrl,
        products.slice(0, 16).map((p: any, i: number) => ({
          name: p.title,
          url: p.affiliateLink || pageUrl,
          image: p.imageUrl,
          position: i + 1,
        }))
      )
    );
  }

  return (
    <>
      <SeoHead
        region={region as RegionCode}
        path={`/category/${category.slug}`}
        title={title}
        description={categoryDesc}
        image={ogImage}
        noindex={products.length === 0}
        jsonLd={structuredData}
      />
      <Header currentRegion={region} dir={config?.direction} categoryNavItems={categoryNavItems} />
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
          <span style={{ color: 'var(--shopli-navy)' }}>{categoryName}</span>
        </nav>

        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'oklch(90% 0.06 45)', color: 'var(--shopli-orange)' }}
          >
            <Icon name={category.icon as any} size={20} />
          </div>
          <h1
            className="text-2xl md:text-4xl font-extrabold"
            style={{ color: 'var(--shopli-navy)' }}
          >
            {categoryName}
          </h1>
        </div>

        {categoryDesc && (
          <p
            className="max-w-2xl text-base leading-relaxed mb-8"
            style={{ color: 'var(--shopli-warm-gray)' }}
          >
            {categoryDesc}
          </p>
        )}

        {products.length > 0 ? (
          <section className="py-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {products.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currencySymbol={config?.currencySymbol || '€'}
                  rtl={rtl}
                  locale={lang}
                  fallbackUrl={pageUrl}
                  region={region}
                  showCompareLink
                />
              ))}
            </div>
          </section>
        ) : (
          <section
            className="py-12 text-center rounded-2xl border border-gray-100 bg-gray-50/50"
          >
            <p className="text-sm" style={{ color: 'var(--shopli-warm-gray)' }}>
              {rtl
                ? 'לא נמצאו מוצרים בקטגוריה זו כרגע. בקרו שוב בקרוב.'
                : 'No products found in this category right now. Check back soon.'}
            </p>
          </section>
        )}

        <section className="py-6 border-t border-gray-100 mt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm font-medium" style={{ color: 'var(--shopli-warm-gray)' }}>
              {rtl
                ? `אהבתם את ${categoryName}? שתפו עם חברים`
                : `Like ${categoryName}? Share it with friends`}
            </p>
            <WhatsAppShare
              title={rtl ? `${categoryName} — שופלי` : `${categoryName} — Shopli`}
              url={pageUrl}
              description={categoryDesc}
              locale={lang}
              size="md"
            />
          </div>
        </section>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = getAllCategories();
  const regions = Object.keys(REGIONS);
  const paths = [];

  for (const region of regions) {
    for (const category of categories) {
      paths.push({ params: { region, slug: category.slug } });
    }
  }

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const region = (params?.region as string) || 'eu';
    const slug = params?.slug as string;
    const config = getRegion(region);
    const category = getCategory(slug);

    if (!category) {
      return { notFound: true };
    }

    const lang = config?.lang || 'en';
    const rtl = config?.direction === 'rtl';

    let products: any[] = [];
    try {
      const { searchCollection } = await import('../../../lib/aliexpress');
      products = await searchCollection(region, category.keywords, 12);
    } catch {
      products = [];
    }

    return {
      props: {
        region,
        config,
        category,
        products: JSON.parse(JSON.stringify(products)),
        rtl,
        categoryNavItems: getCategoryNavItems(config?.lang || 'en'),
      },
      revalidate: 3600,
    };
  } catch (e: any) {
    return { notFound: true };
  }
};
