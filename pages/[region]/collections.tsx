import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Header from '../../components/Header';
import SeoHead from '../../components/SeoHead';
import Icon from '../../components/icons';
import { getRegion, isValidRegion, RegionCode, RegionConfig } from '../../lib/regions';
import { getThemeGroups, type ThemeGroup } from '../../lib/collection-themes';
import { breadcrumbJsonLd, SITE_URL } from '../../lib/seo';

/**
 * The collections hub.
 *
 * Grouping the menu into themes only helps if the 78 collections still have a
 * home: this is it. One page, seven anchored sections, every collection linked —
 * so the menu got smaller without the site losing a single internal link, and
 * crawlers get a real hub page instead of a homepage anchor.
 */
interface CollectionsPageProps {
  region: RegionCode;
  config: RegionConfig;
  rtl: boolean;
  themes: ThemeGroup[];
}

const COPY = {
  en: { title: 'All Collections', lead: 'Every Shopli collection, grouped. Pick a theme, then a collection.', count: (n: number) => `${n} collections` },
  he: { title: 'כל הקטגוריות', lead: 'כל הקולקציות של שופלי, מסודרות לפי נושא. בחרו נושא ואז קולקציה.', count: (n: number) => `${n} קולקציות` },
};

export default function CollectionsPage({ region, config, rtl, themes }: CollectionsPageProps) {
  const lang = config.lang || 'en';
  const c = (rtl ? COPY.he : COPY.en);
  const total = themes.reduce((n, t) => n + t.collections.length, 0);

  return (
    <>
      <SeoHead
        region={region}
        path="/collections"
        title={`${c.title} | Shopli`}
        description={c.lead}
        jsonLd={[
          breadcrumbJsonLd([
            { name: rtl ? 'דף הבית' : 'Home', url: `${SITE_URL}/${region}` },
            { name: c.title, url: `${SITE_URL}/${region}/collections` },
          ]),
        ]}
      />
      <Header currentRegion={region} dir={config.direction} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--shopli-navy)' }}>
          {c.title}
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--shopli-warm-gray)' }}>
          {c.lead} · {c.count(total)}
        </p>

        {/* Jump bar — seven choices, the whole point of the page */}
        <nav className="flex flex-wrap gap-2 mb-10">
          {themes.map((t) => (
            <a
              key={t.key}
              href={`#${t.key}`}
              className="px-3 py-1.5 rounded-full text-sm font-medium border border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 transition-colors"
              style={{ color: 'var(--shopli-navy)' }}
            >
              {t.name[lang] || t.name.en}
            </a>
          ))}
        </nav>

        {themes.map((t) => (
          <section key={t.key} id={t.key} className="mb-12 scroll-mt-24">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'oklch(90% 0.06 45)', color: 'var(--shopli-orange)' }}
              >
                <Icon name={t.icon as any} size={16} />
              </div>
              <h2 className="text-lg md:text-xl font-bold" style={{ color: 'var(--shopli-navy)' }}>
                {t.name[lang] || t.name.en}
              </h2>
              <span className="text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
                {t.collections.length}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {t.collections.map((coll) => (
                <Link
                  key={coll.slug}
                  href={`/${region}/collection/${coll.slug}`}
                  className="flex items-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all"
                >
                  <Icon name={(coll.icon || 'package') as any} size={16} />
                  <span className="text-sm font-medium" style={{ color: 'var(--shopli-navy)' }}>
                    {coll.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
  const region = ((params?.region as string) || 'eu') as RegionCode;
  if (!isValidRegion(region)) return { notFound: true };
  const config = getRegion(region);

  // Static content — no API call can empty it, so a long cache is safe here.
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');

  return {
    props: {
      region,
      config,
      rtl: config.direction === 'rtl',
      themes: getThemeGroups(config.lang || 'en'),
    },
  };
};
