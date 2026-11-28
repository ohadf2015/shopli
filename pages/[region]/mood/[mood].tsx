import { GetServerSideProps } from 'next';
import Header from '../../../components/Header';
import Icon from '../../../components/icons';
import SeoHead from '../../../components/SeoHead';
import ShareBar from '../../../components/ShareBar';
import DealAlertsForm from '../../../components/DealAlertsForm';
import KitAddBar from '../../../components/KitAddBar';
import ProductCard from '../../../components/ProductCard';
import RelatedReads, { type RelatedLink } from '../../../components/RelatedReads';
import { getRegion, isValidRegion, RegionCode } from '../../../lib/regions';
import { getMoodBoard, getMoodBoardsByTag } from '../../../lib/moodboards';
import { kitFacts, kitSummary, moodTitle, pickReason, reasonLine } from '../../../lib/mood-facts';
import { relatedForMood } from '../../../lib/related-content';
import { collectionLinks } from '../../../lib/related-links';
import { getBlogPost, isBlogPostInRegion } from '../../../lib/blog';
import { getComparison } from '../../../lib/comparisons';
import { listingAggregateFields } from '../../../lib/pdp';
import { articleJsonLd, breadcrumbJsonLd, itemListJsonLd, productJsonLd, SITE_URL } from '../../../lib/seo';
import { cacheIfNotEmpty, offersChecked } from '../../../lib/cache';

interface Product { id: string; title: string; price: number; originalPrice: number | null; currency: string; imageUrl: string; affiliateLink: string; rating: number; reviewCount: number; volume: number; shopName: string; discount: string; category?: string; }
interface ItemGroup { caption: string; note: string; products: Product[]; }

const METHOD: Record<'en' | 'he', string> = {
  en: 'How we picked: for each piece we search live AliExpress listings, rank them on rating and order volume, and drop items under 90% positive feedback or 100 orders whenever better ones are available. Prices are refreshed about every hour and can change on AliExpress.',
  he: 'איך בחרנו: לכל פריט אנחנו מחפשים מוצרים חיים באליאקספרס, ממיינים לפי דירוג וכמות הזמנות, ומורידים פריטים עם פחות מ-90% משוב חיובי או פחות מ-100 הזמנות כשיש חלופות טובות יותר. המחירים מתעדכנים בערך כל שעה ועשויים להשתנות באליאקספרס.',
};

export default function MoodPage({ region, config, board, itemGroups, related, links, rtl, error }: any) {
  if (error) return <div className="p-20 text-center" style={{ color: 'var(--shopli-warm-gray)' }}>Error: {error}</div>;
  const lang = config?.lang || 'en';
  const get = (o: any) => o?.[lang] || o?.en || '';
  // Board copy exists in English and Hebrew; numbers are worded in the language of the copy around them.
  const textLang: 'en' | 'he' = lang === 'he' && board?.h1?.he ? 'he' : 'en';
  const sym = config?.currencySymbol || '€';
  const money = (n: number) => `${sym}${n.toFixed(2)}`;

  const relatedBoards = related?.filter((r: any) => r.slug !== board?.slug)?.slice(0, 3) || [];
  const pageUrl = `${SITE_URL}/${region}/mood/${board.slug}`;
  const name = get(board.h1);
  const facts = kitFacts(itemGroups || []);
  const title = `${facts ? moodTitle(name, textLang, facts, money) : get(board.metaTitle)} | ${rtl ? 'שופלי' : 'Shopli'}`;
  const pdpUrl = (p: Product) => `${SITE_URL}/${region}/product/${encodeURIComponent(p.id)}`;
  // Default kit = first SKU in each slot, the same set the summary prices.
  const kitSkus = (itemGroups || [])
    .map((group: ItemGroup) => group.products?.[0])
    .filter((p: Product | undefined): p is Product => {
      if (!p || !p.id) return false;
      const price = Number(p.price);
      return Number.isFinite(price) && price > 0;
    })
    .map((p: Product) => ({ ...p, currency: p.currency || config?.currency || 'ILS' }));

  const leads: Product[] = (itemGroups || []).map((g: ItemGroup) => g.products?.[0]).filter((p: Product | undefined) => p?.id && p?.title);
  const structuredData: Record<string, unknown>[] = [
    breadcrumbJsonLd([
      { name: rtl ? 'דף הבית' : 'Home', url: `${SITE_URL}/${region}` },
      { name, url: pageUrl },
    ]),
    articleJsonLd({ headline: name, description: get(board.metaDesc), url: pageUrl }),
  ];
  if (leads.length > 0) {
    structuredData.push(
      itemListJsonLd(
        name,
        pageUrl,
        leads.map((p, i) => ({ name: p.title, url: pdpUrl(p), image: p.imageUrl, position: i + 1 }))
      )
    );
  }
  for (const p of leads) {
    structuredData.push(
      productJsonLd({
        title: p.title,
        description: p.title,
        image: p.imageUrl,
        url: pdpUrl(p),
        brand: p.shopName,
        price: p.price,
        currency: config?.currency,
        ...listingAggregateFields(p, { ratingValue: p.rating ? p.rating / 20 : undefined, reviewCount: p.reviewCount }),
        sku: p.id,
        region,
      })
    );
  }

  return (
    <>
      <SeoHead
        region={region as RegionCode}
        path={`/mood/${board.slug}`}
        title={title}
        description={get(board.metaDesc)}
        ogType="article"
        jsonLd={structuredData}
      />
      <Header currentRegion={region} dir={config?.direction} />

      <main className="pb-16" style={{ fontFamily: rtl ? "var(--font-assistant), system-ui, sans-serif" : undefined }}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-6 md:pt-12">
          <nav className="flex items-center gap-2 text-xs mb-4" style={{ color: 'var(--shopli-warm-gray)' }} aria-label="Breadcrumb">
            <a href={`/${region}`}>{rtl ? 'דף הבית' : 'Home'}</a>
            <span>/</span>
            <span style={{ color: 'var(--shopli-navy)' }}>{name}</span>
          </nav>
          <h1 className="text-2xl md:text-4xl font-extrabold leading-tight mb-3" style={{ color: 'var(--shopli-navy)' }}>
            {name}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed" style={{ color: 'var(--shopli-warm-gray)' }}>
            {get(board.intro)}
          </p>
          {facts && (
            <p className="max-w-2xl text-sm leading-relaxed mt-3 font-semibold" style={{ color: 'var(--shopli-navy)' }} data-mood-glance>
              {kitSummary(textLang, facts, money)}
            </p>
          )}
          <KitAddBar
            region={region}
            rtl={rtl}
            currency={config?.currency || 'ILS'}
            skus={kitSkus}
          />
        </section>

        {board.tags?.includes('purim') && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
            <div className="rounded-xl p-4 text-sm" style={{ background: 'oklch(90% 0.08 25)', color: 'oklch(30% 0.1 25)' }}>
              <strong>{rtl ? 'לפורים:' : 'For Purim:'}</strong>{' '}
              {rtl
                ? 'כל הפריטים בערכה הזו יחד יוצרים תחפושת שלמה.'
                : 'Every item in this board combines into one complete costume.'}
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {itemGroups.map((group: ItemGroup, i: number) => {
            const reason = pickReason(group.products);
            const why = reason ? reasonLine(textLang, reason) : '';
            return (
              <section key={i} className="mb-10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
                    style={{ background: 'oklch(90% 0.06 45)', color: 'var(--shopli-orange)' }}>
                    {i + 1}
                  </span>
                  <h2 className="text-lg font-bold" style={{ color: 'var(--shopli-navy)' }}>{group.caption}</h2>
                </div>
                {(group.note || why) && (
                  <p className="text-sm mb-3" style={{ color: 'var(--shopli-warm-gray)' }}>
                    {[group.note && `${group.note}.`.replace(/\.\.$/, '.'), why].filter(Boolean).join(' ')}
                  </p>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {group.products.slice(0, 4).map((p: Product) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      currencySymbol={sym}
                      rtl={rtl}
                      locale={lang}
                      fallbackUrl={pageUrl}
                      region={region}
                      category={group.caption}
                      compact
                      dealButton
                    />
                  ))}
                </div>
              </section>
            );
          })}
          {facts && (
            <p className="text-xs max-w-3xl" style={{ color: 'var(--shopli-warm-gray)' }}>
              {METHOD[textLang]}
            </p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold" style={{ color: 'var(--shopli-warm-gray)' }}>
              {rtl ? 'אהבתם את הערכה? שתפו:' : 'Like this look? Share it:'}
            </span>
            <ShareBar
              title={name}
              url={pageUrl}
              description={get(board.metaDesc)}
              pageType="mood"
              region={region}
              locale={lang}
              rtl={rtl}
              size="md"
            />
          </div>
        </div>

        {board.faq?.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 mt-8 border-t border-[#141414]">
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--shopli-navy)' }}>
              {rtl ? 'שאלות נפוצות' : 'FAQ'}
            </h2>
            {board.faq.map((item: any, i: number) => (
              <details key={i} className="mb-2 border border-[#141414] rounded-lg overflow-hidden">
                <summary className="p-3 cursor-pointer font-semibold text-sm" style={{ color: 'var(--shopli-navy)' }}>{get(item.q)}</summary>
                <p className="p-3 pt-0 text-sm" style={{ color: 'var(--shopli-warm-gray)' }}>{get(item.a)}</p>
              </details>
            ))}
          </section>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <RelatedReads links={links || []} region={region} lang={lang} />
        </div>

        {relatedBoards.length > 0 && (
          <section className="border-t border-[#141414] py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <h2 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--shopli-orange)' }}>
                {rtl ? 'ערכות דומות' : 'More looks'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {relatedBoards.map((b: any) => (
                  <a key={b.slug} href={`/${region}/mood/${b.slug}`}
                    className="p-3 rounded-lg border border-[#141414] hover:border-orange-200 transition-all">
                    <div className="font-semibold text-sm mb-1" style={{ color: 'var(--shopli-navy)' }}>{get(b.h1)}</div>
                    <p className="text-xs leading-snug" style={{ color: 'var(--shopli-warm-gray)' }}>{get(b.metaDesc)}</p>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        <DealAlertsForm source="mood" rtl={rtl} />
      </main>
    </>
  );
}

/** Collections, guides and comparisons on the same subject as a board. */
function buildMoodLinks(slug: string, region: string, lang: string): RelatedLink[] {
  const pick = (obj: any) => obj?.[lang] || obj?.en || '';
  const { collections, blog, compare } = relatedForMood(slug);
  const links: RelatedLink[] = [];
  for (const b of blog) {
    const post = getBlogPost(b);
    if (post && isBlogPostInRegion(b, region)) links.push({ href: `/${region}/blog/${b}`, title: pick(post.title), kind: 'guide' });
  }
  for (const c of compare) {
    const cmp = getComparison(c);
    if (cmp) links.push({ href: `/${region}/compare/${c}`, title: pick(cmp.title), kind: 'compare' });
  }
  // Collections first: they sell the same kind of thing as the board.
  return [...collectionLinks(collections, region, lang), ...links].slice(0, 6);
}

export const getServerSideProps: GetServerSideProps = async ({ params, query, res }) => {
  try {
    const region = (query?.region as string) || (params?.region as string) || 'eu';
    if (!isValidRegion(region)) return { notFound: true };
    const slug = params?.mood as string;
    const config = getRegion(region);
    const rtl = config?.direction === 'rtl';
    const board = getMoodBoard(slug);
    if (!board) return { notFound: true };

    const { searchMoodSlots } = await import('../../../lib/aliexpress');
    const itemGroups: ItemGroup[] = [];

    // Every slot searches at once; each keeps only listings its rule allows.
    const results = await searchMoodSlots(region, board.items, 4).catch(() => board.items.map(() => []));

    board.items.forEach((item, i) => {
      const products = results[i] || [];
      // A slot with nothing that fits is left out rather than filled with something else.
      if (products.length === 0) return;
      itemGroups.push({
        caption: item.caption?.[config.lang] || item.caption?.en || '',
        note: item.note?.[config.lang] || item.note?.en || '',
        products: products.map((p: any) => ({
          id: p.id, title: p.title, originalTitle: p.originalTitle ?? null, price: p.price, originalPrice: p.originalPrice,
          currency: p.currency, imageUrl: p.imageUrl, affiliateLink: p.affiliateLink,
          rating: p.rating, reviewCount: p.reviewCount, volume: p.volume,
          shopName: p.shopName, discount: p.discount,
        })),
      });
    });

    const tag = board.tags[0];
    const relatedBoards = tag ? getMoodBoardsByTag(tag) : [];

    // Mood boards are curated + slow to build (several AliExpress searches each).
    // Without this every crawl and every visitor pays a 5-8s uncached SSR.
    cacheIfNotEmpty(res, itemGroups.length > 0 && offersChecked(results.flat()), 'public, s-maxage=3600, stale-while-revalidate=21600'); // stale window keeps crawler visits off the cold 2-9 s path

    return {
      props: {
        region, config,
        board: JSON.parse(JSON.stringify(board)),
        itemGroups, related: JSON.parse(JSON.stringify(relatedBoards)),
        links: buildMoodLinks(slug, region, config.lang),
        rtl, error: null,
      },
    };
  } catch (e: any) {
    return { props: { error: e?.message || String(e), region: 'eu', config: null, board: { slug: 'error', h1: { en: 'Error' }, metaTitle: { en: 'Error' }, metaDesc: { en: '' }, intro: { en: '' }, items: [], tags: [] }, itemGroups: [], related: [], links: [], rtl: false } };
  }
};
