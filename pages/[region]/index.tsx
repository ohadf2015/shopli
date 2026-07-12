import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Header from '../../components/Header';
import Icon from '../../components/icons';
import { getRegion, RegionCode } from '../../lib/regions';
import { getAllCollections } from '../../lib/collections';
import type { RegionConfig } from '../../lib/regions';
import type { Product } from '../../lib/types';

interface FlatProduct extends Product { collectionSlug?: string; collectionName?: string; }

interface CollectionGroup {
  slug: string;
  name: string;
  desc: string;
  icon: string;
  products: FlatProduct[];
}

interface HomePageProps {
  region: RegionCode;
  config: RegionConfig;
  groups: CollectionGroup[];
  rtl: boolean;
}

async function fetchCollectionProducts(region: string, keywords: string[], limit = 4): Promise<FlatProduct[]> {
  const { searchCollection } = await import('../../lib/aliexpress');
  try {
    return (await searchCollection(region, keywords, limit)) as any;
  } catch { return []; }
}

export default function HomePage({ region, config, groups, rtl }: HomePageProps) {
  const t = (text: Record<string, string>) => text[config.lang] || text.en || '';

  const heroTitle = rtl ? 'מצאו את הדילים הכי שווים מאליאקספרס' : 'The Best AliExpress Deals, Curated for You';
  const heroDesc = rtl
    ? 'אנחנו בוחרים מוצרים לפי טרנדים, עונה ואיכות. אתם קונים במחירים הכי נמוכים עם קישור שותפים ישיר.'
    : 'We pick products by trends, season & quality. You buy at the lowest price with direct affiliate links.';

  return (
    <>
      <Head>
        <title>{config.meta.title}</title>
        <meta name="description" content={config.meta.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header currentRegion={region} dir={config.direction} />

      <main style={{ fontFamily: rtl ? "'Assistant', system-ui, sans-serif" : undefined }}>

        {/* HERO */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-12 md:pt-32 md:pb-16">
          <div className="max-w-3xl">
            <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--shopli-orange)' }}>
              {rtl ? 'שופלי — המלצות חכמות' : 'SHOPLI — SMART PICKS'}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4" style={{ color: 'var(--shopli-navy)' }}>
              {heroTitle}
            </h1>
            <p className="text-base md:text-lg mb-6 leading-relaxed" style={{ color: 'var(--shopli-warm-gray)' }}>
              {heroDesc}
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={`/${region}/deals`} className="btn-primary">
                <Icon name="tag" size={16} />
                {rtl ? 'כל המבצעים' : 'Browse All Deals'}
              </a>
              {config.tgChannel && (
                <a href={`https://t.me/${config.tgChannel}`} target="_blank" rel="noopener" className="btn-secondary">
                  <Icon name="telegram" size={16} />
                  {rtl ? 'ערוץ טלגרם' : 'Telegram Channel'}
                </a>
              )}
            </div>
          </div>
        </section>

        {/* COLLECTIONS GRID */}
        {groups.filter(g => g.products.length > 0).slice(0, 6).map((group, gi) => (
          <section key={group.slug} className={`py-10 md:py-14 ${gi % 2 === 1 ? 'bg-white' : 'bg-gray-50/50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'oklch(90% 0.06 45)', color: 'var(--shopli-orange)' }}>
                      <Icon name={group.icon as any} size={16} />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--shopli-navy)' }}>{group.name}</h2>
                  </div>
                  <p className="text-sm mt-1" style={{ color: 'var(--shopli-warm-gray)' }}>{group.desc}</p>
                </div>
                <a href={`/${region}/collection/${group.slug}`} className="text-sm font-semibold flex items-center gap-1 hover:underline whitespace-nowrap" style={{ color: 'var(--shopli-orange)' }}>
                  {rtl ? 'לכל המוצרים' : 'View All'}
                  <Icon name={rtl ? 'chevron-left' : 'chevron-right'} size={14} />
                </a>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {group.products.map((product) => (
                  <a key={product.id} href={product.affiliateLink} target="_blank" rel="noopener noreferrer sponsored"
                    className="bg-white rounded-xl border border-gray-100 overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 group">
                    <div className="aspect-square bg-gray-100 overflow-hidden relative">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--shopli-warm-gray)' }}>
                          <Icon name="package" size={32} />
                        </div>
                      )}
                      {product.discount && (
                        <span className="absolute top-2 right-2 text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm"
                          style={{ color: 'var(--shopli-orange)' }}>-{product.discount}</span>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-xs font-semibold leading-tight mb-1 line-clamp-2" style={{ color: 'var(--shopli-navy)' }}>
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="font-bold text-sm" style={{ color: 'var(--shopli-teal)' }}>
                          {config.currencySymbol}{product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs line-through" style={{ color: 'var(--shopli-warm-gray)' }}>
                            {config.currencySymbol}{product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="star" size={11} className="text-yellow-500" />
                        <span className="text-[0.65rem] font-medium" style={{ color: 'var(--shopli-warm-gray)' }}>
                          {product.rating}
                        </span>
                        {product.reviewCount > 0 && (
                          <span className="text-[0.6rem]" style={{ color: 'var(--shopli-warm-gray)' }}>
                            ({product.reviewCount > 999 ? `${(product.reviewCount / 1000).toFixed(1)}k` : product.reviewCount})
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* FULL COLLECTIONS LIST */}
        <section className="py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ color: 'var(--shopli-navy)' }}>
              {rtl ? 'כל הקטגוריות' : 'All Collections'}
            </h2>
            <p className="text-sm mb-8" style={{ color: 'var(--shopli-warm-gray)' }}>
              {rtl ? 'מוצרים מקובצים לפי נושא — בחרו מה שמעניין אתכם' : 'Products grouped by theme — pick what interests you'}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {getAllCollections().map(coll => {
                const name = t(coll.name);
                const desc = t(coll.desc);
                return (
                  <a key={coll.slug} href={`/${region}/collection/${coll.slug}`}
                    className="p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: 'oklch(90% 0.06 45)', color: 'var(--shopli-orange)' }}>
                      <Icon name={coll.icon as any} size={16} />
                    </div>
                    <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--shopli-navy)' }}>{name}</h3>
                    <p className="text-xs leading-snug" style={{ color: 'var(--shopli-warm-gray)' }}>{desc}</p>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="rounded-2xl p-8 md:p-12 text-center" style={{ background: 'var(--shopli-navy)', color: 'white' }}>
            <h2 className="text-xl md:text-2xl font-bold mb-3">
              {rtl ? 'רוצים לקבל עדכונים שווים?' : 'Want the Best Deals First?'}
            </h2>
            <p className="mb-6 max-w-md mx-auto text-sm" style={{ color: 'oklch(70% 0.02 80)' }}>
              {rtl ? 'הצטרפו לערוץ הטלגרם וקבלו המלצות חמות ישירות לנייד' : 'Join our Telegram channel for hot deals straight to your phone'}
            </p>
            {config.tgChannel && (
              <a href={`https://t.me/${config.tgChannel}`} target="_blank" rel="noopener"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm"
                style={{ background: 'var(--shopli-orange)', color: 'white' }}>
                <Icon name="telegram" size={18} />
                {rtl ? 'הצטרפו לטלגרם' : 'Join Telegram'}
              </a>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
          <div className="flex items-center gap-2 font-semibold" style={{ color: 'var(--shopli-navy)' }}>
            <svg width="18" height="18" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="var(--shopli-orange)"/><path d="M9 12h14l-2 12H11L9 12z" fill="white" opacity="0.9"/></svg>
            shopli
          </div>
          <div>&copy; {new Date().getFullYear()} Shopli. {rtl ? 'כל הזכויות שמורות' : 'All rights reserved.'}</div>
          <div className="flex gap-4">
            <a href={`/${region}/about`} className="hover:underline">{rtl ? 'אודות' : 'About'}</a>
            <a href={`/${region}/contact`} className="hover:underline">{rtl ? 'צור קשר' : 'Contact'}</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, query }) => {
  const region = (query?.region as string) || (params?.region as string) || 'eu';
  const config = getRegion(region);
  const rtl = config.direction === 'rtl';

  const t = (text: Record<string, string>) => text[config.lang] || text.en || '';

  const collections = getAllCollections();
  const groups: CollectionGroup[] = [];

  for (const coll of collections) {
    const products = await fetchCollectionProducts(region, coll.keywords, 4);
    if (products.length > 0) {
      groups.push({
        slug: coll.slug,
        name: t(coll.name),
        desc: t(coll.desc),
        icon: coll.icon,
        products,
      });
    }
  }

  return {
    props: {
      region,
      config,
      groups: groups || [],
      rtl,
    },
  };
};