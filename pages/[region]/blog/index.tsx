import { GetServerSideProps } from 'next';
import Header from '../../../components/Header';
import SeoHead from '../../../components/SeoHead';
import { getRegion, RegionCode } from '../../../lib/regions';
import { blogPosts } from '../../../lib/blog';
import Link from 'next/link';
import { breadcrumbJsonLd, SITE_URL } from '../../../lib/seo';

export default function BlogIndexPage({ region, config, posts, rtl }: any) {
  const lang = config?.lang || 'en';

  const title = rtl ? 'בלוג שופלי — מדריכי קנייה והשוואות' : 'Shopli Blog — Buying Guides & Comparisons';
  const description = rtl
    ? 'מדריכי קנייה מומחים, השוואות מוצרים, וטיפים לחיסכון בקניות מאליאקספרס'
    : 'Expert buying guides, product comparisons, and money-saving tips for AliExpress shopping';

  const pageUrl = `${SITE_URL}/${region}/blog`;
  const structuredData = breadcrumbJsonLd([
    { name: rtl ? 'דף הבית' : 'Home', url: `${SITE_URL}/${region}` },
    { name: rtl ? 'בלוג' : 'Blog', url: pageUrl },
  ]);

  return (
    <>
      <SeoHead
        region={region as RegionCode}
        path="/blog"
        title={title}
        description={description}
        ogType="website"
        jsonLd={structuredData}
      />
      <Header currentRegion={region} dir={config?.direction} />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4" style={{ color: 'var(--shopli-navy)' }}>
            {rtl ? 'בלוג שופלי' : 'Shopli Blog'}
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: 'var(--shopli-warm-gray)' }}>
            {rtl ? 'מדריכי קנייה מומחים, השוואות מעמיקות, וטיפים לחיסכון — הכל כדי שתקנו חכם יותר' : 'Expert buying guides, deep-dive comparisons, and money-saving tips — so you shop smarter'}
          </p>
        </div>

        <div className="grid gap-6">
          {posts.map((post: any) => (
            <article key={post.slug} className="bg-white rounded-2xl border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                      {post.category === 'buying-guide' ? (rtl ? 'מדריך קנייה' : 'Buying Guide') :
                       post.category === 'comparison' ? (rtl ? 'השוואה' : 'Comparison') :
                       post.category === 'seasonal' ? (rtl ? 'עונתי' : 'Seasonal') :
                       (rtl ? 'טיפים' : 'Tips')}
                    </span>
                    <time className="text-xs" style={{ color: 'var(--shopli-warm-gray)' }} dateTime={post.publishDate}>
                      {new Date(post.publishDate).toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </time>
                  </div>
                  <Link href={`/${region}/blog/${post.slug}`}>
                    <h2 className="text-xl md:text-2xl font-bold mb-3 hover:text-orange-600 transition-colors" style={{ color: 'var(--shopli-navy)' }}>
                      {post.title?.[lang] || post.title?.en || ''}
                    </h2>
                  </Link>
                  <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--shopli-warm-gray)' }}>
                    {(post.intro?.[lang] || post.intro?.en || '').substring(0, 180)}...
                  </p>
                  <Link href={`/${region}/blog/${post.slug}`} className="text-sm font-semibold text-orange-600 hover:underline inline-flex items-center gap-1">
                    {rtl ? 'קראו עוד' : 'Read more'}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12" style={{ color: 'var(--shopli-warm-gray)' }}>
            {rtl ? 'אין כתבות עדיין' : 'No posts yet'}
          </div>
        )}
      </main>

      <footer className="border-t border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
          <div className="font-semibold" style={{ color: 'var(--shopli-navy)' }}>shopli</div>
          <div>&copy; {new Date().getFullYear()} {rtl ? 'כל הזכויות שמורות' : 'All rights reserved.'}</div>
        </div>
      </footer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const region = (params?.region as string) || 'eu';
  const config = getRegion(region);
  const rtl = config.direction === 'rtl';

  const posts = blogPosts
    .filter(p => p.category !== 'draft' as any)
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  return {
    props: { region, config, posts, rtl },
  };
};
