import { GetServerSideProps } from 'next';
import Header from '../../components/Header';
import Icon from '../../components/icons';
import ProductCard from '../../components/ProductCard';
import SeoHead from '../../components/SeoHead';
import { getRegion, isValidRegion, RegionCode } from '../../lib/regions';
import { searchCollection, SearchProduct } from '../../lib/aliexpress';
import {
  breadcrumbJsonLd,
  itemListJsonLd,
  productJsonLd,
  getCollectionOgImage,
  SITE_URL,
} from '../../lib/seo';
import { listingAggregateFields } from '../../lib/pdp';
import { getTrendCategories } from '../../lib/trend-calendar';
import { computeVolumeVelocity, getVolumeBaselines } from '../../lib/trend-velocity';
import { dedupeByTitle } from '../../lib/trending';
import type { RegionConfig } from '../../lib/regions';

interface TrendingProduct extends SearchProduct {
  trendReason: string;
  trendScore: number;
  categoryLabel: string;
  /** Measured units/day, when we have two snapshots to compare. */
  soldPerDay?: number;
}

interface TrendingPageProps {
  region: RegionCode;
  config: RegionConfig;
  products: TrendingProduct[];
  rtl: boolean;
  generatedAt: string;
}

// Categories come from lib/trend-calendar.ts, derived from today's date and
// the region — this used to be a frozen array, which is how an Israeli page
// ended up leading with Halloween in August.

function getTrendReason(p: SearchProduct, lang: string): string {
  const volume = p.volume || 0;
  const recent = p.reviewCount || 0;
  const rating = (p.rating || 0) / 20;
  const discount = p.discount ? parseInt(p.discount.replace(/[^0-9]/g, ''), 10) || 0 : 0;

  const soldLabel = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(n);
  };

  // Hebrew / RTL blurbs
  if (lang === 'he') {
    if (discount >= 30) return `הנחה ענקית ${discount}% — מוביל במכירות`;
    if (volume >= 10000) return `נמכר ${soldLabel(volume)} פעמים`;
    if (rating >= 4.7 && volume >= 1000) return `דירוג מעולה ${rating.toFixed(1)} · ${soldLabel(volume)} נמכרו`;
    if (recent >= 100) return `מכירות חמות — ${soldLabel(recent)} בשבוע האחרון`;
    if (rating >= 4.5) return `דירוג גבוה ${rating.toFixed(1)}`;
    return `טרנד חם עכשיו`;
  }

  // Default English, also used for other Latin locales
  if (discount >= 30) return `Up to ${discount}% off — top seller`;
  if (volume >= 10000) return `${soldLabel(volume)} sold`;
  if (rating >= 4.7 && volume >= 1000) return `Rated ${rating.toFixed(1)} · ${soldLabel(volume)} sold`;
  if (recent >= 100) return `Hot this week — ${soldLabel(recent)} sold`;
  if (rating >= 4.5) return `Top rated ${rating.toFixed(1)}`;
  return `Trending now`;
}

/**
 * Reason text for an item we have actually measured selling. Distinct from
 * getTrendReason, which infers from lifetime figures — this one is a claim we
 * can stand behind because we counted it.
 */
function risingReason(perDay: number, lang: string): string {
  const n = perDay >= 10 ? Math.round(perDay) : Math.round(perDay * 10) / 10;
  if (lang === 'he') return `נמכרות ~${n} יחידות ביום כרגע`;
  if (lang === 'ru') return `~${n} шт. в день сейчас`;
  if (lang === 'fr') return `~${n} vendus par jour en ce moment`;
  if (lang === 'de') return `~${n} Verkäufe pro Tag`;
  if (lang === 'es') return `~${n} vendidos al día ahora`;
  if (lang === 'it') return `~${n} venduti al giorno ora`;
  return `Selling ~${n}/day right now`;
}

function scoreTrending(p: SearchProduct, soldPerDay?: number): number {
  const volume = p.volume || 0;
  const recent = p.reviewCount || 0;
  const rating = p.rating || 0;
  const discount = p.discount ? parseInt(p.discount.replace(/[^0-9]/g, ''), 10) || 0 : 0;
  const commission = p.commissionRate || 0;
  const base = volume * 15 + recent * 25 + rating * 5 + discount * 50 + commission * 2;
  // Measured momentum, where we have it. Lifetime volume tells you what sold
  // well once; units-sold-per-day tells you what is selling now, which is the
  // question this page asks — so it dominates when a reading exists.
  return base + (soldPerDay ?? 0) * 5000;
}

async function fetchTrendingProducts(region: string, limit = 30): Promise<TrendingProduct[]> {
  const all: TrendingProduct[] = [];
  const seen = new Set<string>();
  const cfg = getRegion(region);
  const lang = cfg.lang || 'en';

  const categories = getTrendCategories(region);
  const perCategory = Math.ceil((limit * 2) / categories.length);

  await Promise.allSettled(
    categories.map(async (cat) => {
      try {
        const products = await searchCollection(region, cat.keywords, perCategory);
        for (const p of products) {
          if (!p.id || seen.has(p.id)) continue;
          seen.add(p.id);
          all.push({
            ...p,
            trendReason: getTrendReason(p, lang),
            trendScore: 0, // set below, once measured velocity is available
            categoryLabel: cat.label[lang] || cat.label.en,
          });
        }
      } catch {
        /* ignore per-category failures */
      }
    })
  );

  // Real momentum: how many units each item has sold since we first saw it.
  // Fails open to an empty map with no DB, in which case scoring is unchanged.
  // Time-boxed because Neon compute auto-suspends and a cold wake would land
  // on the TTFB of the page this whole change set exists to make fast.
  const baselines = await Promise.race([
    getVolumeBaselines(region, all.map((p) => p.id!).filter(Boolean)),
    new Promise<{}>((resolve) => setTimeout(() => resolve({}), 2000)),
  ]);
  const velocity = computeVolumeVelocity(baselines, all);

  for (const p of all) {
    const perDay = p.id ? velocity[p.id]?.perDay : undefined;
    p.trendScore = scoreTrending(p, perDay);
    p.soldPerDay = perDay;
    if (perDay && perDay >= 1) p.trendReason = risingReason(perDay, lang);
  }

  // No write here. A fire-and-forget promise in a serverless function is not
  // guaranteed to run — the instance can freeze once the response is sent — so
  // it would be a write that works sometimes. The daily cron is the writer.

  // Score desc, id asc for determinism, then drop near-identical titles
  // (same item relisted under a new supplier ID) keeping the best-scored.
  all.sort((a, b) => b.trendScore - a.trendScore || (a.id < b.id ? -1 : 1));
  return dedupeByTitle(all, (p) => p.title || '').slice(0, limit);
}

export default function TrendingPage({ region, config, products, rtl, generatedAt }: TrendingPageProps) {
  const lang = config.lang || 'en';
  const pageUrl = `${SITE_URL}/${region}/trending`;
  const ogImage = getCollectionOgImage('trending', rtl ? 'מוצרים טרנדיים 2026' : 'Trending Products 2026', lang);

  const copy = {
    title: {
      en: 'Trending Products 2026 — Top AliExpress Deals Right Now',
      he: 'מוצרים טרנדיים 2026 — הדילים הכי שווים באליאקספרס',
      fr: 'Produits Tendance 2026 — Meilleures Offres AliExpress',
      de: 'Trendprodukte 2026 — Top AliExpress Angebote',
      es: 'Productos Tendencia 2026 — Mejores Ofertas AliExpress',
      it: 'Prodotti Trend 2026 — Migliori Offerte AliExpress',
      ru: 'Трендовые товары 2026 — Лучшие предложения AliExpress',
    },
    h1: {
      en: 'Trending Products 2026',
      he: 'מוצרים טרנדיים 2026',
      fr: 'Produits Tendance 2026',
      de: 'Trendprodukte 2026',
      es: 'Productos Tendencia 2026',
      it: 'Prodotti Trend 2026',
      ru: 'Трендовые товары 2026',
    },
    intro: {
      en: 'Hand-picked AliExpress bestsellers updated daily. We rank by real sales volume, recent orders, rating and discount so you see what is actually trending right now.',
      he: 'רשימה יומית של המוצרים הנמכרים ביותר באליאקספרס. אנחנו מדרגים לפי מכירות אמיתיות, הזמנות אחרונות, דירוג והנחות.',
      fr: 'Sélection quotidienne des best-sellers AliExpress. Classement par ventes réelles, commandes récentes, notes et remises.',
      de: 'Täglich aktualisierte AliExpress-Bestseller. Sortiert nach echten Verkäufen, aktuellen Bestellungen, Bewertungen und Rabatten.',
      es: 'Bestsellers de AliExpress actualizados a diario. Ordenados por ventas reales, pedidos recientes, valoraciones y descuentos.',
      it: 'Bestseller AliExpress aggiornati giornalmente. Classificati per vendite reali, ordini recenti, recensioni e sconti.',
      ru: 'Ежедневно обновляемые бестселлеры AliExpress. Сортировка по реальным продажам, недавним заказам, рейтингу и скидкам.',
    },
    metaDesc: {
      en: 'Discover trending AliExpress products 2026: top-selling gadgets, home gear, smart home, phone accessories and more with direct affiliate links and daily updates.',
      he: 'גלו מוצרים טרנדיים באליאקספרס לשנת 2026: גאדג\'טים, ציוד ביתי, בית חכם, אביזרי טלפון ועוד עם קישורי שותפים ישירים ועדכונים יומיים.',
      fr: 'Découvrez les produits tendance AliExpress 2026 : gadgets, maison, objets connectés, accessoires téléphone avec liens affiliés et mises à jour quotidiennes.',
      de: 'Entdecken Sie Trendprodukte AliExpress 2026: Gadgets, Haushalt, Smart Home, Handy-Zubehör mit Affiliate-Links und täglichen Updates.',
      es: 'Descubre productos tendencia AliExpress 2026: gadgets, hogar, hogar inteligente, accesorios móvil con enlaces de afiliados y actualizaciones diarias.',
      it: 'Scopri i prodotti trend AliExpress 2026: gadget, casa, smart home, accessori telefono con link affiliati e aggiornamenti giornalieri.',
      ru: 'Откройте трендовые товары AliExpress 2026: гаджеты, товары для дома, умный дом, аксессуары для телефона с партнёрскими ссылками и ежедневными обновлениями.',
    },
    updated: {
      en: 'Updated daily ·',
      he: 'מתעדכן יומיומית ·',
      fr: 'Mis à jour quotidiennement ·',
      de: 'Täglich aktualisiert ·',
      es: 'Actualizado diariamente ·',
      it: 'Aggiornato giornalmente ·',
      ru: 'Обновляется ежедневно ·',
    },
  };

  const t = (obj: Record<string, string>) => obj[lang] || obj.en;

  const structuredData: Record<string, unknown>[] = [];
  structuredData.push(
    breadcrumbJsonLd([
      { name: rtl ? 'דף הבית' : 'Home', url: `${SITE_URL}/${region}` },
      { name: rtl ? 'מוצרים טרנדיים' : 'Trending', url: pageUrl },
    ])
  );

  if (products.length > 0) {
    structuredData.push(
      itemListJsonLd(
        t(copy.title),
        pageUrl,
        products.slice(0, 30).map((p, i) => ({
          name: p.title,
          url: p.id ? `${SITE_URL}/${region}/product/${encodeURIComponent(p.id)}` : pageUrl,
          image: p.imageUrl,
          position: i + 1,
        }))
      )
    );

    for (const p of products.slice(0, 12)) {
      structuredData.push(
        productJsonLd({
          title: p.title,
          description: `${p.trendReason} — ${p.categoryLabel}`,
          image: p.imageUrl,
          url: p.id ? `${SITE_URL}/${region}/product/${encodeURIComponent(p.id)}` : pageUrl,
          brand: p.shopName,
          price: p.price,
          currency: config.currency,
          ...listingAggregateFields(p, {
            ratingValue: p.rating > 0 ? p.rating / 20 : undefined,
            reviewCount: p.reviewCount || undefined,
          }),
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
        path="/trending"
        title={t(copy.title)}
        description={t(copy.metaDesc)}
        image={ogImage}
        ogType="website"
        jsonLd={structuredData}
      />
      <Header currentRegion={region} dir={config.direction} />
      <main
        className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-16"
        style={{ fontFamily: rtl ? "var(--font-assistant), system-ui, sans-serif" : undefined }}
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
          <span style={{ color: 'var(--shopli-navy)' }}>{rtl ? 'מוצרים טרנדיים' : 'Trending'}</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'oklch(90% 0.06 45)', color: 'var(--shopli-orange)' }}
            >
              <Icon name="trending-up" size={20} />
            </div>
            <h1
              className="text-2xl md:text-4xl font-extrabold"
              style={{ color: 'var(--shopli-navy)' }}
            >
              {t(copy.h1)}
            </h1>
          </div>
          <p className="max-w-2xl text-base leading-relaxed" style={{ color: 'var(--shopli-warm-gray)' }}>
            {t(copy.intro)}
          </p>
          <p className="text-xs mt-2" style={{ color: 'var(--shopli-warm-gray)' }}>
            {t(copy.updated)} {generatedAt}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="py-20 text-center" style={{ color: 'var(--shopli-warm-gray)' }}>
            {rtl ? 'לא נמצאו מוצרים טרנדיים כרגע — נסו שוב בעוד כמה דקות.' : 'No trending products found right now — please check back in a few minutes.'}
          </div>
        ) : (
          <section
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
            data-trending-hub="true"
            aria-label={rtl ? 'מוצרים טרנדיים' : 'Trending products'}
          >
            {products.map((p) => (
              <div key={p.id} className="relative">
                <div
                  className="absolute -top-2 start-2 z-10 text-[0.65rem] font-bold px-2.5 py-1 rounded-full shadow-sm"
                  style={{ background: 'var(--shopli-orange)', color: 'white' }}
                >
                  {p.trendReason}
                </div>
                <ProductCard
                  product={p}
                  currencySymbol={config.currencySymbol}
                  rtl={rtl}
                  locale={lang}
                  region={region}
                  category={p.categoryLabel}
                  showCompareLink
                  showShare
                  className="h-full"
                  trendingHub={true}
                  directAffiliate={true}
                />
              </div>
            ))}
          </section>
        )}

        <section className="mt-12 py-8 border-t border-gray-100">
          <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--shopli-navy)' }}>
            {rtl ? 'מה זה מוצרים טרנדיים?' : 'What makes these products trending?'}
          </h2>
          <p className="text-sm leading-relaxed max-w-3xl" style={{ color: 'var(--shopli-warm-gray)' }}>
            {rtl
              ? 'הרשימה מתעדכנת כל יום ומבוססת על נתוני מכירות אמיתיים מאליאקספרס: כמות מכירות, הזמנות בשבוע האחרון, דירוג קונים והנחות נוכחיות.'
              : 'This list is refreshed daily and ranked using real AliExpress signals: total sales, recent orders, buyer ratings and current discounts.'}
          </p>
        </section>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, query, res }) => {
  const region = (query?.region as string) || (params?.region as string) || 'eu';
  if (!isValidRegion(region)) return { notFound: true };
  const config = getRegion(region);
  const rtl = config.direction === 'rtl';

  const products = await fetchTrendingProducts(region, 30);
  const generatedAt = new Date().toISOString().split('T')[0];

  // SEO landing page updated daily — let the edge cache absorb renders (1h, SWR 24h).
  // Short SWR: this page emits Product offers.price, and a long stale window
  // would serve stale prices in structured data.
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=3600');

  return {
    props: {
      region,
      config,
      products: JSON.parse(JSON.stringify(products)),
      rtl,
      generatedAt,
    },
  };
};
