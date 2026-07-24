import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import Header from '../../components/Header';
import Icon from '../../components/icons';
import ProductCard from '../../components/ProductCard';
import SeoHead from '../../components/SeoHead';
import { getRegion, RegionCode, RegionConfig } from '../../lib/regions';
import { breadcrumbJsonLd, itemListJsonLd, productJsonLd, SITE_URL } from '../../lib/seo';
import type { SearchProduct } from '../../lib/aliexpress';

interface SearchPageProps {
  region: RegionCode;
  config: RegionConfig;
  query: string;
  products: SearchProduct[];
  rtl: boolean;
  error: string | null;
}

export default function SearchPage({
  region,
  config,
  query: initialQuery,
  products,
  rtl,
  error,
}: SearchPageProps) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);
  const lang = config.lang || 'en';

  const pageUrl = `${SITE_URL}/${region}/search${initialQuery ? `?q=${encodeURIComponent(initialQuery)}` : ''}`;
  const title = initialQuery
    ? rtl
      ? `חיפוש: ${initialQuery} | שופלי`
      : `Search: ${initialQuery} | Shopli`
    : rtl
      ? 'חיפוש מוצרים | שופלי'
      : 'Search products | Shopli';
  const description = initialQuery
    ? rtl
      ? `תוצאות חיפוש עבור "${initialQuery}" מאליאקספרס — מחירים, דירוגים ודילים.`
      : `Search results for "${initialQuery}" on AliExpress — prices, ratings and deals.`
    : rtl
      ? 'חפשו מוצרים מאליאקספרס. השוו מחירים ומצאו דילים.'
      : 'Search AliExpress products. Compare prices and find deals.';

  const structuredData: Record<string, unknown>[] = [
    breadcrumbJsonLd([
      { name: rtl ? 'דף הבית' : 'Home', url: `${SITE_URL}/${region}` },
      { name: rtl ? 'חיפוש' : 'Search', url: `${SITE_URL}/${region}/search` },
      ...(initialQuery
        ? [{ name: initialQuery, url: pageUrl }]
        : []),
    ]),
  ];

  if (products.length > 0) {
    structuredData.push(
      itemListJsonLd(
        title.replace(' | Shopli', '').replace(' | שופלי', ''),
        pageUrl,
        products.map((p, i) => ({
          name: p.title,
          url: p.affiliateLink || pageUrl,
          image: p.imageUrl,
          position: i + 1,
        }))
      )
    );
    for (const p of products.slice(0, 8)) {
      structuredData.push(
        productJsonLd({
          title: p.title,
          description: p.title,
          image: p.imageUrl,
          url: p.affiliateLink || pageUrl,
          brand: p.shopName,
          price: p.price,
          currency: p.currency || config.currency,
          ratingValue: p.rating > 0 ? p.rating / 20 : undefined,
          reviewCount: p.reviewCount || undefined,
          sku: p.id,
          region,
        })
      );
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next = q.trim();
    if (!next) return;
    router.push(`/${region}/search?q=${encodeURIComponent(next)}`);
  };

  return (
    <>
      <SeoHead
        region={region}
        path="/search"
        title={title}
        description={description}
        canonical={pageUrl}
        noindex={!initialQuery}
        jsonLd={structuredData}
      />
      <Header currentRegion={region} dir={config.direction} />

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
          <span style={{ color: 'var(--shopli-navy)' }}>
            {rtl ? 'חיפוש' : 'Search'}
          </span>
          {initialQuery && (
            <>
              <span>/</span>
              <span className="truncate max-w-[12rem]" style={{ color: 'var(--shopli-navy)' }}>
                {initialQuery}
              </span>
            </>
          )}
        </nav>

        <h1
          className="text-2xl md:text-3xl font-extrabold mb-4"
          style={{ color: 'var(--shopli-navy)' }}
        >
          {rtl ? 'חיפוש מוצרים' : 'Search products'}
        </h1>

        <form onSubmit={onSubmit} className="flex gap-2 mb-8 max-w-xl" role="search">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={rtl ? 'מה אתם מחפשים?' : 'What are you looking for?'}
            className="flex-1 min-w-0 px-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
            style={{ color: 'var(--shopli-navy)' }}
            autoFocus
          />
          <button type="submit" className="btn-primary shrink-0">
            <Icon name="search" size={16} />
            {rtl ? 'חפש' : 'Search'}
          </button>
        </form>

        {error && (
          <p className="text-sm text-red-600 mb-4" role="alert">
            {error}
          </p>
        )}

        {initialQuery && (
          <p className="text-sm mb-4" style={{ color: 'var(--shopli-warm-gray)' }}>
            {rtl
              ? `${products.length} תוצאות עבור "${initialQuery}"`
              : `${products.length} results for "${initialQuery}"`}
          </p>
        )}

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                currencySymbol={config.currencySymbol}
                rtl={rtl}
                locale={lang}
                region={region}
                showCompareLink
              />
            ))}
          </div>
        ) : initialQuery ? (
          <div className="text-center py-16 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
            <Icon name="search" size={32} className="mx-auto mb-3 opacity-40" />
            <p className="font-semibold mb-1" style={{ color: 'var(--shopli-navy)' }}>
              {rtl ? 'לא נמצאו מוצרים' : 'No products found'}
            </p>
            <p className="text-sm" style={{ color: 'var(--shopli-warm-gray)' }}>
              {rtl ? 'נסו מילת חיפוש אחרת או עברו לקטגוריות' : 'Try another query or browse categories'}
            </p>
            <a
              href={`/${region}#categories`}
              className="inline-block mt-4 text-sm font-semibold"
              style={{ color: 'var(--shopli-orange)' }}
            >
              {rtl ? 'לקטגוריות ←' : 'Browse categories →'}
            </a>
          </div>
        ) : null}
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, query, res }) => {
  const region = ((params?.region as string) || 'eu') as RegionCode;
  const config = getRegion(region);
  const rtl = config.direction === 'rtl';
  const q = typeof query?.q === 'string' ? query.q.trim() : '';

  let products: SearchProduct[] = [];
  let error: string | null = null;

  if (q) {
    try {
      const { searchAliExpress } = await import('../../lib/aliexpress');
      products = await searchAliExpress(q, region, 20);
    } catch (e: any) {
      error = e?.message || String(e);
    }
  }

  res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600');

  return {
    props: {
      region,
      config,
      query: q,
      products: JSON.parse(JSON.stringify(products)),
      rtl,
      error,
    },
  };
};
