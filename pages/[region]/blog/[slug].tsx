import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Header from '../../../components/Header';
import SeoHead from '../../../components/SeoHead';
import ShareBar from '../../../components/ShareBar';
import { getRegion, isValidRegion, RegionCode } from '../../../lib/regions';
import { getBlogPost, isBlogPostInRegion } from '../../../lib/blog';
import { blogPostingJsonLd, breadcrumbJsonLd, faqJsonLd, SITE_URL } from '../../../lib/seo';
import ProductCard, { ProductCardProduct } from '../../../components/ProductCard';
import { searchAliExpress } from '../../../lib/aliexpress';
import { filterQuality } from '../../../lib/quality';
import { getReviewCounts } from '../../../lib/review-store';
import { cacheIfNotEmpty } from '../../../lib/cache';

interface PickProduct extends ProductCardProduct {
  pickName: string;
}

/**
 * The picks from a guide, as products.
 *
 * This section used to be a row of text chips linking to a search page: the
 * guide named "adjustable dumbbells set", and the reader got a link, a click,
 * a search results page, and only then something to look at. Buying guides are
 * the bottom of the funnel — the products belong in the guide.
 *
 * Each pick is resolved to a real listing at render time, quality-gated the
 * same way every other surface is (lib/quality.ts). A pick that resolves to
 * nothing falls back to its old chip rather than disappearing from the guide.
 */
function ShopThePicks({
  region,
  rtl,
  lang,
  currencySymbol,
  products,
  items,
}: {
  region: string;
  rtl: boolean;
  lang: string;
  currencySymbol: string;
  products?: PickProduct[];
  items?: Array<{ name: string; keyword: string }>;
}) {
  if (!items?.length) return null;
  const resolved = products || [];
  const unresolved = items.filter((it) => !resolved.some((p) => p.pickName === it.name));

  return (
    <div className="mt-6 p-4 sm:p-5 rounded-xl border border-orange-100 bg-orange-50/50">
      <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--shopli-navy)' }}>
        {rtl ? 'הפריטים מהמדריך' : 'The picks from this guide'}
      </h3>
      <p className="text-xs mb-4" style={{ color: 'var(--shopli-warm-gray)' }}>
        {rtl ? 'מחירים חיים מאליאקספרס, אחרי סינון איכות.' : 'Live AliExpress prices, quality-filtered.'}
      </p>

      {resolved.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {resolved.map((product) => (
            <div key={product.id}>
              <div className="text-xs font-semibold mb-1.5 truncate" style={{ color: 'var(--shopli-orange)' }}>
                {product.pickName}
              </div>
              <ProductCard
                product={product}
                currencySymbol={currencySymbol}
                rtl={rtl}
                locale={lang}
                region={region}
              />
            </div>
          ))}
        </div>
      )}

      {unresolved.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {unresolved.map((rp) => (
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
      )}
    </div>
  );
}

export default function BlogPostPage({ region, config, post, rtl, regionOnly, pickProducts, error }: any) {
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

                  {i === 0 && (
                    <ShopThePicks
                      region={region}
                      rtl={rtl}
                      lang={lang}
                      currencySymbol={config?.currencySymbol || ''}
                      products={pickProducts}
                      items={p.relatedProducts}
                    />
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

            {/* Readers who reach the end of a buying guide are the ones ready
                to buy, so repeat the route out rather than ending on the FAQ. */}
            <section className="pt-4">
              <ShopThePicks
                region={region}
                rtl={rtl}
                lang={lang}
                currencySymbol={config?.currencySymbol || ''}
                products={pickProducts}
                items={p.relatedProducts}
              />
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

  // Resolve each pick to a real listing. Bounded to six: these are six
  // independent AliExpress searches, and lib/aliexpress caps real concurrency,
  // so this cannot stampede the rate limiter.
  const picks = (post.relatedProducts || []).slice(0, 6);
  const found = await Promise.all(
    picks.map(async (pick: { name: string; keyword: string }) => {
      const products = await searchAliExpress(pick.keyword, region, 6).catch(() => []);
      const best = filterQuality(products)[0];
      return best ? { pick, best } : null;
    })
  );

  const resolved = found.filter(Boolean) as Array<{ pick: { name: string }; best: any }>;
  // One query for real rating counts, for the products whose reviews we already
  // hold. Cards show nothing rather than a zero for the rest.
  const counts = await getReviewCounts(region, resolved.map((r) => r.best.id)).catch(() => ({}));

  const pickProducts = resolved.map(({ pick, best }) => ({
    id: best.id,
    title: best.title,
    price: best.price,
    originalPrice: best.originalPrice ?? null,
    imageUrl: best.imageUrl || '',
    affiliateLink: best.affiliateLink || '',
    rating: best.rating,
    // null, not undefined: Next refuses to serialize undefined props.
    reviewCount: counts[best.id]?.ratingCount ?? null,
    volume: best.volume,
    discount: best.discount,
    freeShipping: best.freeShipping,
    shopName: best.shopName,
    pickName: pick.name,
  }));

  // Editorial content is stable, but these are live listings — and an empty
  // result must not be frozen at the CDN for a day (lib/cache.ts).
  cacheIfNotEmpty(
    res,
    pickProducts.length > 0 || picks.length === 0,
    'public, s-maxage=3600, stale-while-revalidate=86400'
  );

  return {
    // regionOnly suppresses hreflang: the alternates would point at the eight
    // locales where this post 404s.
    props: { region, config, post, rtl, regionOnly: !!post.regions, pickProducts },
  };
};
