import { GetServerSideProps } from 'next';
import Header from '../components/Header';
import Icon from '../components/icons';
import ProductCard from '../components/ProductCard';
import WhatsAppShare from '../components/WhatsAppShare';
import SeoHead from '../components/SeoHead';
import { getRegion, RegionCode } from '../lib/regions';
import { getAllCollections } from '../lib/collections';
import { itemListJsonLd, SITE_URL } from '../lib/seo';
import type { RegionConfig } from '../lib/regions';
import type { Product } from '../lib/types';
import {
  DEALS_COLLECTIONS_COUNT,
  DEALS_PRODUCTS_PER_COLLECTION,
  DealsLang,
  detectDealsLang,
  dealsLangToRegion,
  getDealsCopy,
} from '../lib/deals';

interface FlatProduct extends Product { collectionSlug?: string; collectionName?: string; }

interface DealsGroup {
  slug: string;
  name: string;
  desc: string;
  icon?: string;
  products: FlatProduct[];
}

interface DealsPageProps {
  region: RegionCode;
  config: RegionConfig;
  lang: DealsLang;
  groups: DealsGroup[];
  updatedIso: string;
  updatedLabel: string;
  rtl: boolean;
}

async function fetchCollectionProducts(region: string, keywords: string[], limit = DEALS_PRODUCTS_PER_COLLECTION): Promise<FlatProduct[]> {
  try {
    const { searchCollection: sc } = await import('../lib/aliexpress');
    return (await sc(region, keywords, limit)) as any;
  } catch { return []; }
}

/**
 * Top-level /deals — aggregated "today's deals" landing page.
 *
 * Why it exists: the legacy smart-shopping-il.com domain is 301-redirected
 * (registrar-level) to tryshopli.com/deals, and its old /category/* URLs are
 * 308'd to /deals as well. Until this page existed, /deals fell through to the
 * [region] catch-all and served the EU homepage under a self-canonical — a
 * soft-404 duplicate that wasted the redirected equity.
 *
 * The page is content-negotiated (Accept-Language -> he/il or en/eu) on a
 * single canonical URL, so it deliberately emits no hreflang alternates.
 * Products come from the live AliExpress API at request time, so "updated
 * daily" is backed by hourly ISR-style caching, not a cron job.
 */
export default function DealsPage({ region, config, lang, groups, updatedIso, updatedLabel, rtl }: DealsPageProps) {
  const copy = getDealsCopy(lang);
  const pageUrl = `${SITE_URL}/deals`;
  const allProducts = groups.flatMap((g) => g.products);
  const structuredData = itemListJsonLd(
    copy.h1,
    pageUrl,
    allProducts.slice(0, 20).map((p: any) => ({
      name: p.title,
      url: p.affiliateLink || pageUrl,
      image: p.imageUrl,
    }))
  );

  return (
    <>
      <SeoHead
        region={region}
        path="/deals"
        canonical={pageUrl}
        hreflang={false}
        title={copy.title}
        description={copy.description}
        jsonLd={structuredData}
      />
      <Header currentRegion={region} dir={config.direction} />

      <main style={{ fontFamily: rtl ? "var(--font-assistant), system-ui, sans-serif" : undefined }}>

        {/* HERO */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-12 md:pt-28 md:pb-14">
          <div className="max-w-3xl">
            <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--shopli-orange)' }}>
              {rtl ? 'שופלי — דילים יומיים' : 'SHOPLI — DAILY DEALS'}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4" style={{ color: 'var(--shopli-navy)' }}>
              {copy.h1}
            </h1>
            <p className="text-base md:text-lg mb-4 leading-relaxed" style={{ color: 'var(--shopli-warm-gray)' }}>
              {copy.subtitle}
            </p>
            <div className="inline-flex items-center gap-2 text-sm font-semibold mb-6 px-3 py-1.5 rounded-full bg-green-50 text-green-700">
              <Icon name="check" size={14} />
              {copy.freshnessLabel}: <time dateTime={updatedIso}>{updatedLabel}</time>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={`/${region}`} className="btn-primary">
                <Icon name="tag" size={16} />
                {copy.fullSiteCta}
              </a>
              {config.tgChannel && (
                <a href={`https://t.me/${config.tgChannel}`} target="_blank" rel="noopener" className="btn-secondary">
                  <Icon name="telegram" size={16} />
                  {rtl ? 'ערוץ טלגרם' : 'Telegram Channel'}
                </a>
              )}
              <WhatsAppShare
                title={copy.title}
                url={pageUrl}
                description={copy.subtitle}
                locale={config.lang}
                size="md"
                className="btn-secondary"
              />
            </div>
          </div>
        </section>

        {/* DEALS BY COLLECTION */}
        {groups.length === 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <p className="text-base" style={{ color: 'var(--shopli-warm-gray)' }}>{copy.emptyLabel}</p>
          </section>
        )}
        {groups.map((group, gi) => (
          <section key={group.slug} className={`py-10 md:py-14 ${gi % 2 === 1 ? 'bg-white' : 'bg-gray-50/50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'oklch(90% 0.06 45)', color: 'var(--shopli-orange)' }}>
                      <Icon name={(group.icon || 'tag') as any} size={16} />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--shopli-navy)' }}>{group.name}</h2>
                  </div>
                  <p className="text-sm mt-1" style={{ color: 'var(--shopli-warm-gray)' }}>{group.desc}</p>
                </div>
                <a href={`/${region}/collection/${group.slug}`} className="text-sm font-semibold flex items-center gap-1 hover:underline whitespace-nowrap" style={{ color: 'var(--shopli-orange)' }}>
                  {copy.viewAll}
                  <Icon name={rtl ? 'chevron-left' : 'chevron-right'} size={14} />
                </a>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {group.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    currencySymbol={config.currencySymbol}
                    rtl={rtl}
                    locale={config.lang}
                    region={region}
                    showCompareLink
                    category={group.name}
                  />
                ))}
              </div>
            </div>
          </section>
        ))}

      </main>

      <footer className="border-t border-gray-100 py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm" style={{ color: 'var(--shopli-warm-gray)' }}>
          <div>&copy; {new Date().getFullYear()} Shopli. {rtl ? 'כל הזכויות שמורות' : 'All rights reserved.'}</div>
          <div className="flex gap-4">
            <a href={`/${region}`} className="hover:underline">{rtl ? 'דף הבית' : 'Home'}</a>
            <a href={`/${region}/blog`} className="hover:underline">{rtl ? 'בלוג' : 'Blog'}</a>
            <a href={`/${region}/compare`} className="hover:underline">{rtl ? 'השוואות' : 'Compare'}</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const lang = detectDealsLang(req.headers['accept-language']);
  const region = dealsLangToRegion(lang);
  const config = getRegion(region);
  const rtl = config.direction === 'rtl';
  const copy = getDealsCopy(lang);

  const t = (text?: Record<string, string> | null) => text?.[config.lang] || text?.en || '';

  const collections = getAllCollections()
    .filter((coll) => coll.keywords && coll.keywords.length > 0 && coll.name)
    .slice(0, DEALS_COLLECTIONS_COUNT);

  const fetched = await Promise.all(
    collections.map(async (coll) => ({
      coll,
      products: await fetchCollectionProducts(region, [coll.keywords![0]]),
    }))
  );

  const groups: DealsGroup[] = fetched
    .filter(({ products }) => products.length > 0)
    .map(({ coll, products }) => ({
      slug: coll.slug,
      name: t(coll.name),
      desc: t(coll.desc),
      icon: coll.icon,
      products,
    }));

  const now = new Date();
  const updatedIso = now.toISOString();
  const updatedLabel = now.toLocaleDateString(copy.dateLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Content varies by Accept-Language (he vs en); keep CDN cache correct.
  const existingVary = res.getHeader('Vary');
  const varyParts = new Set(
    (Array.isArray(existingVary) ? existingVary.join(',') : String(existingVary || ''))
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean)
  );
  varyParts.add('Accept-Language');
  res.setHeader('Vary', Array.from(varyParts).join(', '));

  // Fresh deals: revalidate hourly at the CDN, serve stale up to a day.
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

  return {
    props: {
      region,
      config,
      lang,
      groups,
      updatedIso,
      updatedLabel,
      rtl,
    },
  };
};
