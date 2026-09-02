import Icon from './icons';
import { trackCompareNextAction } from '../lib/analytics';

interface BrowseNextProps {
  region: string;
  rtl: boolean;
  /** Which compare surface is rendering the strip, for analytics. */
  surface: 'compare_tool' | 'compare_article';
}

/**
 * "Keep browsing" next-action strip for compare pages. Compare visitors bounce
 * at 97-99% because every CTA on the page leaves the site (affiliate links) —
 * this gives them an obvious on-site next step (trending / search / deals).
 */
export default function BrowseNext({ region, rtl, surface }: BrowseNextProps) {
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
      title: rtl ? 'טרנדים עכשיו' : 'Trending now',
      sub: rtl ? 'מה שכולם קונים השבוע' : 'What everyone is buying this week',
    },
    {
      href: `/${region}/search`,
      target: 'search',
      icon: 'search',
      title: rtl ? 'חיפוש מוצרים' : 'Search products',
      sub: rtl ? 'מצאו כל מוצר מ-AliExpress' : 'Find any AliExpress product',
    },
    {
      href: '/deals',
      target: 'deals',
      icon: 'tag',
      title: rtl ? 'דילים של היום' : "Today's deals",
      sub: rtl ? 'הנחות שנאספו ביד' : 'Hand-picked discounts',
    },
  ];

  return (
    <section
      className="mt-10 rounded-xl border border-gray-100 bg-white shadow-sm p-5 sm:p-6"
      aria-label={rtl ? 'המשך גלילה' : 'Keep browsing'}
    >
      <h2
        className="text-base font-bold mb-1"
        style={{ color: 'var(--shopli-navy)' }}
      >
        {rtl ? 'עוד לא החלטתם?' : 'Not decided yet?'}
      </h2>
      <p className="text-xs mb-4" style={{ color: 'var(--shopli-warm-gray)' }}>
        {rtl
          ? 'המשיכו לגלות מוצרים — בלי לצאת מהאתר.'
          : 'Keep discovering products — without leaving the site.'}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {links.map((l) => (
          <a
            key={l.target}
            href={l.href}
            onClick={() =>
              trackCompareNextAction({ region, surface, target: l.target })
            }
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-orange-200 hover:shadow-sm transition-all group"
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
