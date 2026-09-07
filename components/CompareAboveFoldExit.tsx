import Icon from './icons';
import { trackCompareNextAction } from '../lib/analytics';

type Side = { name: string; keyword: string };

interface CompareAboveFoldExitProps {
  region: string;
  rtl: boolean;
  surface: 'compare_tool' | 'compare_article';
  /** SEO article sides — drives the dual search CTAs. */
  sides?: [Side, Side];
  /** Optional one-line value copy (verdict teaser / pick summary). */
  valueLine?: string;
  /** When live AliExpress cards failed to load — push trending harder. */
  deadLanding?: boolean;
}

/**
 * Above-fold primary exit for /xx/compare. #16 put next-actions below the
 * table/verdict; bounce stayed 97-99% because visitors never scrolled.
 * This strip ships the value + CTA into the first viewport.
 */
export default function CompareAboveFoldExit({
  region,
  rtl,
  surface,
  sides,
  valueLine,
  deadLanding = false,
}: CompareAboveFoldExitProps) {
  return (
    <section
      className="mb-6 sm:mb-8 rounded-xl border border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 p-4 sm:p-5"
      aria-label={rtl ? 'הצעד הבא' : 'Next step'}
      data-compare-above-fold="1"
    >
      <p
        className="text-xs font-semibold uppercase tracking-wider mb-1 inline-flex items-center gap-1"
        style={{ color: 'var(--shopli-orange)' }}
      >
        <Icon name="check" size={12} />
        {deadLanding
          ? rtl
            ? 'דילים חיים לא זמינים כרגע'
            : 'Live deals unavailable right now'
          : rtl
            ? 'החלטה מהירה — בלי לגלול'
            : 'Decide above the fold'}
      </p>
      <p
        className="text-sm font-medium mb-3 leading-snug"
        style={{ color: 'var(--shopli-navy)' }}
      >
        {valueLine ||
          (rtl
            ? 'דלגו על האנליזה — עברו לדילים חיים או לטרנדים באתר.'
            : 'Skip the essay — jump to live deals or keep browsing on-site.')}
      </p>

      {sides && (
        <div className="grid sm:grid-cols-2 gap-2 mb-2">
          {sides.map((side) => (
            <a
              key={side.keyword}
              href={`/${region}/search?q=${encodeURIComponent(side.keyword)}`}
              onClick={() =>
                trackCompareNextAction({
                  region,
                  surface,
                  target: 'search',
                })
              }
              className="btn-primary justify-center text-sm"
              data-compare-exit="search"
            >
              <Icon name="search" size={16} />
              {rtl ? `דילים על ${side.name}` : `Browse ${side.name} deals`}
            </a>
          ))}
        </div>
      )}

      <div className={`flex flex-wrap gap-2 ${sides ? 'mt-1' : ''}`}>
        <a
          href={`/${region}/trending`}
          onClick={() =>
            trackCompareNextAction({ region, surface, target: 'trending' })
          }
          className={`${
            deadLanding || !sides ? 'btn-primary' : 'btn-secondary'
          } text-xs py-2`}
          data-compare-exit="trending"
        >
          <Icon name="fire" size={14} />
          {rtl ? 'טרנדים עכשיו' : 'Trending now'}
        </a>
        <a
          href="/deals"
          onClick={() =>
            trackCompareNextAction({ region, surface, target: 'deals' })
          }
          className="btn-secondary text-xs py-2"
          data-compare-exit="deals"
        >
          <Icon name="tag" size={14} />
          {rtl ? 'דילים של היום' : "Today's deals"}
        </a>
        {!sides && (
          <a
            href={`/${region}/search`}
            onClick={() =>
              trackCompareNextAction({ region, surface, target: 'search' })
            }
            className="btn-secondary text-xs py-2"
            data-compare-exit="search"
          >
            <Icon name="search" size={14} />
            {rtl ? 'חיפוש מוצרים' : 'Search products'}
          </a>
        )}
      </div>
    </section>
  );
}
