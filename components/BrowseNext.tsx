import Icon from './icons';
import { makeTr } from '../lib/compare-i18n';
import { trackCompareNextAction } from '../lib/analytics';

interface BrowseNextProps {
  region: string;
  rtl: boolean;
  lang?: string;
  /** Which compare surface is rendering the strip, for analytics. */
  surface: 'compare_tool' | 'compare_article';
}

/**
 * "Keep browsing" next-action strip for compare pages. Compare visitors bounce
 * at 97-99% because every CTA on the page leaves the site (affiliate links) —
 * this gives them an obvious on-site next step (trending / search / deals).
 */
export default function BrowseNext({ region, rtl, lang, surface }: BrowseNextProps) {
  const tr = makeTr(lang ?? (rtl ? 'he' : 'en'));
  const links: {
    href: string;
    target: 'trending' | 'search' | 'deals';
    icon: 'fire' | 'search' | 'tag';
    title: string;
    sub: string;
  }[] = [
    {
      href: `/${region}/trending`,
      target: 'trending',
      icon: 'fire',
      title: tr('Trending now', 'טרנדים עכשיו'),
      sub: tr('What everyone is buying this week', 'מה שכולם קונים השבוע'),
    },
    {
      href: `/${region}/search`,
      target: 'search',
      icon: 'search',
      title: tr('Search products', 'חיפוש מוצרים'),
      sub: tr('Find any AliExpress product', 'מצאו כל מוצר מ-AliExpress'),
    },
    {
      href: '/deals',
      target: 'deals',
      icon: 'tag',
      title: tr("Today's deals", 'דילים של היום'),
      sub: tr('Hand-picked discounts', 'הנחות שנאספו ביד'),
    },
  ];

  return (
    <section
      className="mt-10 rounded-xl border border-[#141414] bg-white  p-5 sm:p-6"
      aria-label={tr('Keep browsing', 'המשך גלילה')}
    >
      <h2
        className="text-base font-bold mb-1"
        style={{ color: 'var(--shopli-navy)' }}
      >
        {tr('Not decided yet?', 'עוד לא החלטתם?')}
      </h2>
      <p className="text-xs mb-4" style={{ color: 'var(--shopli-warm-gray)' }}>
        {tr('Keep discovering products — without leaving the site.', 'המשיכו לגלות מוצרים — בלי לצאת מהאתר.')}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {links.map((l) => (
          <a
            key={l.target}
            href={l.href}
            onClick={() =>
              trackCompareNextAction({ region, surface, target: l.target })
            }
            className="flex items-center gap-3 p-3 rounded-lg border border-[#141414] hover:border-orange-200 hover:shadow-sm transition-all group"
          >
            <span
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'oklch(94% 0.05 55)', color: 'var(--shopli-orange)' }}
            >
              <Icon name={l.icon} size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span
                className="block text-sm font-semibold"
                style={{ color: 'var(--shopli-navy)' }}
              >
                {l.title}
              </span>
              <span
                className="block text-xs truncate"
                style={{ color: 'var(--shopli-warm-gray)' }}
              >
                {l.sub}
              </span>
            </span>
            <span
              className="shrink-0 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform"
              style={{ color: 'var(--shopli-orange)' }}
            >
              <Icon name={rtl ? 'chevron-left' : 'chevron-right'} size={16} />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
