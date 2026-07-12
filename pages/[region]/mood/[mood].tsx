import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Header from '../../../components/Header';
import Icon from '../../../components/icons';
import { getRegion } from '../../../lib/regions';
import { getMoodBoard, getMoodBoardsByTag } from '../../../lib/moodboards';

interface Product { id: string; title: string; price: number; currency: string; imageUrl: string; affiliateLink: string; rating: number; }
interface ItemGroup { caption: string; note: string; products: Product[]; }

export default function MoodPage({ region, config, board, itemGroups, related, rtl, error }: any) {
  if (error) return <div className="p-20 text-center" style={{ color: 'var(--shopli-warm-gray)' }}>Error: {error}</div>;
  const lang = config?.lang || 'en';
  const get = (o: any) => o?.[lang] || o?.en || '';

  const relatedBoards = related?.filter((r: any) => r.slug !== board?.slug)?.slice(0, 3) || [];

  return (
    <>
      <Head>
        <title>{get(board.metaTitle)} | Shopli</title>
        <meta name="description" content={get(board.metaDesc)} />
        <meta property="og:title" content={get(board.h1)} />
        <meta property="og:description" content={get(board.metaDesc)} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`https://shopli-neon.vercel.app/${region}/mood/${board.slug}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: get(board.h1),
            description: get(board.metaDesc),
            mainEntityOfPage: { '@type': 'WebPage', '@id': `https://shopli-neon.vercel.app/${region}/mood/${board.slug}` }
          })
        }} />
      </Head>
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
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover hover:scale-105 transition-transform" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--shopli-warm-gray)' }}>
                          <Icon name="package" size={24} />
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <div className="text-[0.65rem] font-semibold leading-tight line-clamp-2 mb-1" style={{ color: 'var(--shopli-navy)' }}>
                        {p.title}
                      </div>
                      <div className="font-bold text-xs" style={{ color: 'var(--shopli-teal)' }}>
                        {config?.currencySymbol || '€'}{p.price?.toFixed(2)}
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
          id: p.id, title: p.title, price: p.price, currency: p.currency,
          imageUrl: p.imageUrl, affiliateLink: p.affiliateLink, rating: p.rating,
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