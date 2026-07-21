import { GetServerSideProps } from 'next';
import Header from '../../../components/Header';
import Icon from '../../../components/icons';
import SeoHead from '../../../components/SeoHead';
import { getRegion, RegionCode } from '../../../lib/regions';
import { getMoodBoard, getMoodBoardsByTag } from '../../../lib/moodboards';
import { articleJsonLd, breadcrumbJsonLd, productJsonLd, SITE_URL } from '../../../lib/seo';

interface Product { id: string; title: string; price: number; originalPrice: number | null; currency: string; imageUrl: string; affiliateLink: string; rating: number; reviewCount: number; volume: number; shopName: string; discount: string; }
interface ItemGroup { caption: string; note: string; products: Product[]; }

function Stars({ rating, size = 10 }: { rating: number; size?: number }) {
  const full = Math.round(rating / 20);
  return <span style={{ color: 'oklch(70% 0.15 70)' }}>{'★'.repeat(Math.max(0, full))}{'☆'.repeat(Math.max(0, 5 - full))}</span>;
}

export default function MoodPage({ region, config, board, itemGroups, related, rtl, error }: any) {
  if (error) return <div className="p-20 text-center" style={{ color: 'var(--shopli-warm-gray)' }}>Error: {error}</div>;
  const lang = config?.lang || 'en';
  const get = (o: any) => o?.[lang] || o?.en || '';

  const relatedBoards = related?.filter((r: any) => r.slug !== board?.slug)?.slice(0, 3) || [];
  const pageUrl = `${SITE_URL}/${region}/mood/${board.slug}`;

  const structuredData: Record<string, unknown>[] = [
    breadcrumbJsonLd([
      { name: rtl ? 'דף הבית' : 'Home', url: `${SITE_URL}/${region}` },
      { name: rtl ? 'ערכות' : 'Mood Boards', url: `${SITE_URL}/${region}/mood/jack-sparrow` },
      { name: get(board.h1), url: pageUrl },
    ]),
    articleJsonLd({
      headline: get(board.h1),
      description: get(board.metaDesc),
      url: pageUrl,
    }),
  ];

  // Product schema for the first product in each group (avoids bloating the page)
  for (const group of itemGroups || []) {
    const p = group.products?.[0];
    if (p?.title) {
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

  return (
    <>
      <SeoHead
        region={region as RegionCode}
        path={`/mood/${board.slug}`}
        title={`${get(board.metaTitle)} | Shopli`}
        description={get(board.metaDesc)}
        ogType="article"
        jsonLd={structuredData}
      />
      <Header currentRegion={region} dir={config?.direction} />

      <main className="pb-16" style={{ fontFamily: rtl ? "'Assistant', system-ui, sans-serif" : undefined }}>
        {/* HERO */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-8 md:pt-32">
          <div className="flex items-center gap-2 text-xs mb-4" style={{ color: 'var(--shopli-warm-gray)' }}>
            <a href={`/${region}`}>{rtl ? 'דף הבית' : 'Home'}</a>
            <span>/</span>
            <span style={{ color: 'var(--shopli-navy)' }}>{rtl ? 'ערכות' : 'Mood Boards'}</span>
            <span>/</span>
            <span style={{ color: 'var(--shopli-navy)' }}>{get(board.h1)}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold leading-tight mb-3" style={{ color: 'var(--shopli-navy)' }}>
            {get(board.h1)}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed" style={{ color: 'var(--shopli-warm-gray)' }}>
            {get(board.intro)}
          </p>
          {board.totalEstimate && (
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg text-sm font-bold"
              style={{ background: 'oklch(95% 0.05 45)', color: 'var(--shopli-orange)' }}>
              <Icon name="tag" size={16} />
              {get(board.totalEstimate)}
            </div>
          )}
        </section>

        {/* TAG INDICATOR */}
        {board.tags?.includes('purim') && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
            <div className="rounded-xl p-4 text-sm" style={{ background: 'oklch(90% 0.08 25)', color: 'oklch(30% 0.1 25)' }}>
              <strong>{rtl ? '🎭 לפורים' : '🎭 Purim Special'}</strong>
              {' — '}
              {rtl
                ? 'כל הפריטים בערכה זו יוצרים תחפושת שלמה ומושלמת לחג הפורים'
                : 'Every item in this board combines into a complete Purim costume'}
            </div>
          </div>
        )}

        {/* THE ITEMS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {itemGroups.map((group: ItemGroup, i: number) => (
            <div key={i} className="mb-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
                  style={{ background: 'oklch(90% 0.06 45)', color: 'var(--shopli-orange)' }}>
                  {i + 1}
                </span>
                <h2 className="text-lg font-bold" style={{ color: 'var(--shopli-navy)' }}>{group.caption}</h2>
              </div>
              {group.note && (
                <p className="text-xs mb-3" style={{ color: 'var(--shopli-warm-gray)' }}>
                  <Icon name="info" size={12} /> {group.note}
                </p>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {group.products.slice(0, 4).map((p: Product) => (
                  <a key={p.id} href={p.affiliateLink} target="_blank" rel="noopener noreferrer sponsored"
                    className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all">
                    <div className="aspect-square bg-gray-100 overflow-hidden relative">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover hover:scale-105 transition-transform" loading="lazy" decoding="async" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--shopli-warm-gray)' }}>
                          <Icon name="package" size={24} />
                        </div>
                      )}
                      {p.discount && (
                        <span className="absolute top-1 right-1 text-[9px] font-bold px-1.5 py-0.5 rounded"
                          style={{ background: 'oklch(65% 0.2 45)', color: 'white' }}
                        >-{p.discount.replace('%', '')}%</span>
                      )}
                    </div>
                    <div className="p-2">
                      <div className="text-[0.6rem] font-semibold leading-tight line-clamp-2 mb-1" style={{ color: 'var(--shopli-navy)' }}>
                        {p.title}
                      </div>
                      <div className="flex items-baseline gap-1 mb-0.5">
                        <span className="font-bold text-xs" style={{ color: 'var(--shopli-teal)' }}>
                          {config?.currencySymbol || '€'}{p.price?.toFixed(2)}
                        </span>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="text-[9px] line-through" style={{ color: 'var(--shopli-warm-gray)' }}>
                            {config?.currencySymbol || '€'}{p.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Stars rating={p.rating} size={8} />
                        <span className="text-[9px]" style={{ color: 'var(--shopli-warm-gray)' }}>
                          {p.volume > 0 ? (p.volume > 1000 ? `${(p.volume/1000).toFixed(1)}k` : p.volume) + (rtl ? ' נמכרו' : ' sold') : ''}
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        {board.faq?.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-t border-gray-100">
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--shopli-navy)' }}>
              {rtl ? 'שאלות נפוצות' : 'FAQ'}
            </h2>
            {board.faq.map((item: any, i: number) => (
              <details key={i} className="mb-2 border border-gray-200 rounded-lg overflow-hidden">
                <summary className="p-3 cursor-pointer font-semibold text-sm" style={{ color: 'var(--shopli-navy)' }}>{get(item.q)}</summary>
                <p className="p-3 pt-0 text-sm" style={{ color: 'var(--shopli-warm-gray)' }}>{get(item.a)}</p>
              </details>
            ))}
          </section>
        )}

        {/* RELATED BOARDS */}
        {relatedBoards.length > 0 && (
          <section className="border-t border-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <h3 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--shopli-orange)' }}>
                {rtl ? 'ערכות דומות' : 'More Looks'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {relatedBoards.map((b: any) => (
                  <a key={b.slug} href={`/${region}/mood/${b.slug}`}
                    className="p-3 rounded-lg border border-gray-100 hover:border-orange-200 transition-all">
                    <div className="font-semibold text-sm mb-1" style={{ color: 'var(--shopli-navy)' }}>{get(b.h1)}</div>
                    <p className="text-[0.6rem] leading-snug" style={{ color: 'var(--shopli-warm-gray)' }}>{get(b.metaDesc)}</p>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, query }) => {
  try {
    const region = (query?.region as string) || (params?.region as string) || 'eu';
    const slug = params?.mood as string;
    const config = getRegion(region);
    const rtl = config?.direction === 'rtl';
    const board = getMoodBoard(slug);
    if (!board) return { notFound: true };

    const { searchCollection: sc } = await import('../../../lib/aliexpress');
    const itemGroups: ItemGroup[] = [];

    for (const item of board.items) {
      const products = await sc(region, item.keywords, 4);
      itemGroups.push({
        caption: item.caption?.[config.lang] || item.caption?.en || '',
        note: item.note?.[config.lang] || item.note?.en || '',
        products: products.map((p: any) => ({
          id: p.id, title: p.title, price: p.price, originalPrice: p.originalPrice,
          currency: p.currency, imageUrl: p.imageUrl, affiliateLink: p.affiliateLink,
          rating: p.rating, reviewCount: p.reviewCount, volume: p.volume,
          shopName: p.shopName, discount: p.discount,
        })),
      });
    }

    const tag = board.tags[0];
    const relatedBoards = tag ? getMoodBoardsByTag(tag) : [];

    return {
      props: {
        region, config,
        board: JSON.parse(JSON.stringify(board)),
        itemGroups, related: JSON.parse(JSON.stringify(relatedBoards)),
        rtl, error: null,
      },
    };
  } catch (e: any) {
    return { props: { error: e?.message || String(e), region: 'eu', config: null, board: { slug: 'error', h1: { en: 'Error' }, metaTitle: { en: 'Error' }, metaDesc: { en: '' }, intro: { en: '' }, items: [], tags: [] }, itemGroups: [], related: [], rtl: false } };
  }
};
