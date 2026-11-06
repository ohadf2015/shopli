import { GetServerSideProps } from 'next';
import Header from '../../components/Header';
import SeoHead from '../../components/SeoHead';
import DealAlertsForm from '../../components/DealAlertsForm';
import { getRegion, isValidRegion, RegionCode } from '../../lib/regions';
import type { RegionConfig } from '../../lib/regions';
import { getFeaturedCollections } from '../../lib/collections';
import { getPicks, type Pick } from '../../lib/picks';
import { getReviewsBatch } from '../../lib/review-store';
import { productImage } from '../../lib/img';
import { breadcrumbJsonLd, websiteJsonLd, SITE_URL } from '../../lib/seo';
import { cacheIfNotEmpty } from '../../lib/cache';

/**
 * Home: "Is that AliExpress deal actually good?"
 *
 * Built only from our own tables — the daily price/order snapshots behind
 * lib/picks.ts (already quality-gated by lib/quality.ts) and the review store.
 * No live AliExpress call on the render path, which is what made this page take
 * seconds: a cold visitor used to wait on three API searches with retries.
 *
 * Picks come from every product the daily sweep tracks, not from three
 * featured collections, so the best sellers show whatever category they sit in.
 */

interface HomeCard {
  productId: string;
  title: string;
  imageUrl: string;
  price: number;
  /** Short, factual reason line: "Usually ~€9.99" / "290 sold a day". */
  why: string;
  badge: string;
  tone: 'drop' | 'hot';
  stars: number;
}

interface HomePageProps {
  region: RegionCode;
  config: RegionConfig;
  rtl: boolean;
  drops: HomeCard[];
  sellers: HomeCard[];
  chips: Array<{ slug: string; name: string }>;
  asOf: string;
}

const COPY = {
  en: {
    h1: 'Is that AliExpress deal actually good?',
    sub: 'We record prices and orders on thousands of products every day, so you can tell a real price drop from a made-up one.',
    label: 'Paste an AliExpress link or search',
    placeholder: 'aliexpress.com/item/… or wireless earbuds',
    check: 'Check it',
    drops: 'Real price drops today',
    dropsSub: "Cheaper than the product's own price over recent weeks, not a list price the seller made up.",
    sellers: 'Selling fast, rated well',
    sellersSub: 'What buyers are actually ordering right now, from well-rated sellers.',
    finds: "Today's best finds",
    findsSub: "Real price drops first, then what's selling fastest from well-rated sellers. All from our own daily records.",
    preview: 'Example verdict',
    browse: 'Browse',
    seeAll: 'See all',
    howTitle: 'How we judge a deal',
    how: 'Every day we record each product’s price and order count. A deal is good when the price is under its own recent level and buyers rate it well. We earn a small commission if you buy, and it never changes the verdict.',
    asOf: 'Data as of',
    empty: "Today's numbers are still being collected. Search above, or browse a category.",
  },
  he: {
    h1: 'הדיל הזה מאליאקספרס באמת שווה?',
    sub: 'אנחנו מתעדים מחירים והזמנות של אלפי מוצרים כל יום, כדי שתדעו להבדיל בין ירידת מחיר אמיתית למזויפת.',
    label: 'הדביקו קישור מאליאקספרס או חפשו',
    placeholder: 'aliexpress.com/item/… או אוזניות אלחוטיות',
    check: 'בדיקה',
    drops: 'ירידות מחיר אמיתיות היום',
    dropsSub: 'זול יותר מהמחיר של אותו מוצר בשבועות האחרונים, לא ממחיר מחירון שהמוכר המציא.',
    sellers: 'נמכרים מהר, עם דירוג טוב',
    sellersSub: 'מה שקונים מזמינים עכשיו, ממוכרים עם דירוג גבוה.',
    finds: 'המציאות של היום',
    findsSub: 'קודם ירידות מחיר אמיתיות, אחר כך מה שנמכר הכי מהר ממוכרים עם דירוג גבוה. הכול מהתיעוד היומי שלנו.',
    preview: 'דוגמה לבדיקה',
    browse: 'קטגוריות',
    seeAll: 'לכל המוצרים',
    howTitle: 'איך אנחנו שופטים דיל',
    how: 'כל יום אנחנו מתעדים את המחיר ומספר ההזמנות של כל מוצר. דיל טוב הוא כשהמחיר מתחת לרמה הרגילה שלו והקונים מדרגים אותו גבוה. אנחנו מרוויחים עמלה קטנה אם קונים, והיא אף פעם לא משנה את ההמלצה.',
    asOf: 'נתונים נכון ל־',
    empty: 'המספרים של היום עוד נאספים. חפשו למעלה או בחרו קטגוריה.',
  },
};

function Card({ c, region, sym, rtl }: { c: HomeCard; region: string; sym: string; rtl: boolean }) {
  return (
    <a
      href={`/${region}/product/${c.productId}`}
      className="product-card group flex flex-col"
      style={{ textDecoration: 'none', color: 'var(--shopli-ink)' }}
    >
      <div
        className="relative aspect-square overflow-hidden"
        style={{ background: '#F1ECE4', borderBottom: '2.5px solid var(--shopli-ink)' }}
      >
        {c.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            {...productImage(c.imageUrl, 320, '(max-width: 640px) 50vw, 25vw')}
            alt={c.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        )}
        <span
          className="absolute top-2 start-2 text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: c.tone === 'drop' ? '#B8F2C9' : '#FFE08A', border: '2px solid var(--shopli-ink)' }}
        >
          {c.badge}
        </span>
      </div>
      <div className="p-3 flex flex-col gap-1 flex-1">
        <span className="text-sm leading-snug line-clamp-2">{c.title}</span>
        <span className="font-extrabold text-lg tabular-nums" dir="ltr" style={{ textAlign: rtl ? 'right' : 'left' }}>
          {sym}
          {c.price.toFixed(2)}
        </span>
        <span className="text-xs mt-auto" style={{ color: '#5C554C' }}>
          {c.stars > 0 ? `★ ${c.stars.toFixed(1)} · ` : ''}
          {c.why}
        </span>
      </div>
    </a>
  );
}

export default function HomePage({ region, config, rtl, drops, sellers, chips, asOf }: HomePageProps) {
  const t = rtl ? COPY.he : COPY.en;
  const pageUrl = `${SITE_URL}/${region}`;
  const structuredData = [
    breadcrumbJsonLd([{ name: rtl ? 'דף הבית' : 'Home', url: pageUrl }]),
    websiteJsonLd(`${SITE_URL}/${region}/search?q={search_term_string}`, region as RegionCode),
  ];
  const sym = config.currencySymbol;

  const section = (id: string, title: string, sub: string, cards: HomeCard[]) =>
    cards.length ? (
      <section aria-labelledby={id} className="flex flex-col gap-3">
        <div className="flex items-end justify-between gap-4">
          <h2 id={id} className="text-xl sm:text-2xl font-bold m-0">
            {title}
          </h2>
          <a href={`/${region}/trending`} className="text-sm font-semibold shrink-0" style={{ color: 'var(--shopli-ink)' }}>
            {t.seeAll} {rtl ? '←' : '→'}
          </a>
        </div>
        <p className="text-sm m-0" style={{ color: '#5C554C' }}>
          {sub}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {cards.map((c) => (
            <Card key={c.productId} c={c} region={region} sym={sym} rtl={rtl} />
          ))}
        </div>
      </section>
    ) : null;

  return (
    <>
      <SeoHead
        region={region}
        path=""
        title={config.meta.title}
        description={config.meta.description}
        jsonLd={structuredData}
      />
      <Header currentRegion={region} dir={config.direction} />

      <main
        dir={config.direction}
        className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-10 flex flex-col gap-10 sm:gap-14"
        style={{ fontFamily: rtl ? 'var(--font-assistant), system-ui, sans-serif' : undefined }}
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-center">
        <section className="flex flex-col gap-4 max-w-2xl">
          <h1 className="text-4xl sm:text-6xl font-bold leading-[1.03] m-0">{t.h1}</h1>
          <p className="text-base sm:text-lg leading-relaxed m-0" style={{ color: '#4A443C' }}>
            {t.sub}
          </p>
          <form action={`/${region}/search`} method="get" role="search" className="flex flex-col gap-2">
            <label htmlFor="home-q" className="text-sm font-semibold">
              {t.label}
            </label>
            <div className="flex gap-2">
              <input
                id="home-q"
                name="q"
                placeholder={t.placeholder}
                className="flex-1 min-w-0 h-14 px-4 text-base bg-white rounded-xl"
                style={{ border: '2.5px solid var(--shopli-ink)' }}
              />
              <button type="submit" className="btn-primary h-14 px-5 text-base">
                {t.check}
              </button>
            </div>
          </form>
        </section>
        {(drops[0] || sellers[0]) && (() => {
          const ex = drops[0] || sellers[0];
          return (
            <a
              href={`/${region}/product/${ex.productId}`}
              className="hidden lg:flex flex-col gap-3 rounded-2xl bg-white p-5"
              style={{ border: '2.5px solid var(--shopli-ink)', boxShadow: '8px 8px 0 var(--shopli-ink)', color: 'var(--shopli-ink)', textDecoration: 'none' }}
            >
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#5C554C' }}>{t.preview}</span>
              <div className="flex gap-4 items-center">
                {ex.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img {...productImage(ex.imageUrl, 120)} alt="" className="w-24 h-24 rounded-xl object-cover" style={{ border: '2px solid var(--shopli-ink)' }} />
                )}
                <div className="flex flex-col gap-1.5 min-w-0">
                  <span className="text-sm leading-snug line-clamp-2">{ex.title}</span>
                  <span
                    className="self-start px-2.5 py-1 rounded-lg font-bold text-sm"
                    style={{ background: ex.tone === 'drop' ? '#B8F2C9' : '#FFE08A', border: '2px solid var(--shopli-ink)' }}
                  >
                    {ex.tone === 'drop' ? (rtl ? 'זמן טוב לקנות' : 'Good time to buy') : ex.badge} · {sym}{ex.price.toFixed(2)}
                  </span>
                </div>
              </div>
              <span className="text-sm" style={{ color: '#4A443C' }}>{ex.why}</span>
            </a>
          );
        })()}
        </div>

        {drops.length === 0 && sellers.length === 0 && (
          <p className="m-0" style={{ color: '#5C554C' }}>
            {t.empty}
          </p>
        )}
        {drops.length >= 3 ? (
          <>
            {section('drops', t.drops, t.dropsSub, drops)}
            {section('sellers', t.sellers, t.sellersSub, sellers)}
          </>
        ) : (
          // One or two drops make a lonely row: show them first in a single grid.
          section('finds', t.finds, t.findsSub, [...drops, ...sellers].slice(0, 8))
        )}
        {asOf && (
          <p className="text-xs -mt-6 m-0" style={{ color: '#5C554C' }}>
            {t.asOf} {asOf}
          </p>
        )}

        {chips.length > 0 && (
          <section aria-labelledby="browse" className="flex flex-col gap-3">
            <h2 id="browse" className="text-xl sm:text-2xl font-bold m-0">
              {t.browse}
            </h2>
            <div className="flex flex-wrap gap-2">
              {chips.map((c) => (
                <a
                  key={c.slug}
                  href={`/${region}/collection/${c.slug}`}
                  className="px-4 py-2.5 rounded-full bg-white text-sm font-semibold"
                  style={{ border: '2.5px solid var(--shopli-ink)', color: 'var(--shopli-ink)', textDecoration: 'none' }}
                >
                  {c.name}
                </a>
              ))}
              <a
                href={`/${region}/collections`}
                className="px-4 py-2.5 rounded-full text-sm font-semibold"
                style={{
                  border: '2.5px solid var(--shopli-ink)',
                  background: 'var(--shopli-ink)',
                  color: 'var(--shopli-cream)',
                  textDecoration: 'none',
                }}
              >
                {t.seeAll}
              </a>
            </div>
          </section>
        )}

        <section
          className="rounded-2xl p-5 sm:p-6 flex flex-col gap-2"
          style={{ background: 'var(--shopli-ink)', color: 'var(--shopli-cream)', border: '2.5px solid var(--shopli-ink)' }}
        >
          <h2 className="text-lg sm:text-xl font-bold m-0">{t.howTitle}</h2>
          <p className="text-sm sm:text-base leading-relaxed m-0">{t.how}</p>
        </section>
      </main>

      <DealAlertsForm source="home" rtl={rtl} />
    </>
  );
}

function toCard(p: Pick, rtl: boolean, sym: string, reviews: Record<string, any>): HomeCard {
  const nf = (n: number) => Math.round(n).toLocaleString(rtl ? 'he-IL' : 'en-US');
  const drop = p.reason === 'price_drop' && p.dropPct > 0;
  const usual = (p.priceMedian ?? p.price).toFixed(2);
  const why = drop
    ? rtl
      ? `בדרך כלל ~${sym}${usual}`
      : `Usually ~${sym}${usual}`
    : rtl
      ? `${nf(p.recentPerDay)} נמכרים ביום`
      : `${nf(p.recentPerDay)} sold a day`;
  const badge = drop
    ? `−${p.dropPct}%`
    : p.reason === 'surging'
      ? rtl
        ? `פי ${p.surge.toFixed(1)} מהרגיל`
        : `${p.surge.toFixed(1)}× usual`
      : rtl
        ? 'רב מכר'
        : 'Best seller';
  return {
    productId: p.productId,
    title: p.title,
    imageUrl: p.imageUrl || '',
    price: p.price,
    why,
    badge,
    tone: drop ? 'drop' : 'hot',
    stars: reviews[p.productId]?.averageStars ?? 0,
  };
}

export const getServerSideProps: GetServerSideProps = async ({ params, query, res }) => {
  const region = (query?.region as string) || (params?.region as string) || 'eu';
  // Unknown region slugs must 404, not render the EU homepage as a duplicate.
  if (!isValidRegion(region)) return { notFound: true };
  const config = getRegion(region);
  const rtl = config.direction === 'rtl';
  const lang = config.lang || 'en';

  const [dropPicks, allPicks] = await Promise.all([
    getPicks(region, { limit: 8, reason: 'price_drop' }).catch(() => [] as Pick[]),
    getPicks(region, { limit: 16 }).catch(() => [] as Pick[]),
  ]);
  const dropIds = new Set(dropPicks.map((p) => p.productId));
  const sellerPicks = allPicks.filter((p) => !dropIds.has(p.productId)).slice(0, 8);
  const ids = [...dropPicks, ...sellerPicks].map((p) => p.productId);
  const reviews: Record<string, any> = ids.length ? await getReviewsBatch(region, ids).catch(() => ({})) : {};

  const sym = config.currencySymbol;
  const drops = dropPicks.map((p) => toCard(p, rtl, sym, reviews));
  const sellers = sellerPicks.map((p) => toCard(p, rtl, sym, reviews));
  const chips = getFeaturedCollections(region, 10).map((c) => ({
    slug: c.slug,
    name: c.name?.[lang] || c.name?.en || c.slug,
  }));
  const asOf = [...dropPicks, ...sellerPicks].map((p) => p.asOf).sort().pop() ?? '';

  cacheIfNotEmpty(res, drops.length + sellers.length > 0, 'public, s-maxage=600, stale-while-revalidate=86400');

  return { props: { region, config, rtl, drops, sellers, chips, asOf } };
};
