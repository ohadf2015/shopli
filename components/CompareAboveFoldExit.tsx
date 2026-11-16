import Icon from './icons';
import { compareT, makeTr } from '../lib/compare-i18n';
import { trackCompareNextAction } from '../lib/analytics';

type Side = { name: string; keyword: string };

interface CompareAboveFoldExitProps {
  region: string;
  rtl: boolean;
  lang?: string;
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
  lang,
  surface,
  sides,
  valueLine,
  deadLanding = false,
}: CompareAboveFoldExitProps) {
  const tr = makeTr(lang ?? (rtl ? 'he' : 'en'));
  return (
    <section
      className="mb-6 sm:mb-8 rounded-xl border border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 p-4 sm:p-5"
      aria-label={tr('Next step', 'הצעד הבא')}
      data-compare-above-fold="1"
    >
      <p
        className="text-xs font-semibold uppercase tracking-wider mb-1 inline-flex items-center gap-1"
        style={{ color: 'var(--shopli-orange)' }}
      >
        <Icon name="check" size={12} />
        {deadLanding
          ? tr('Live deals unavailable right now', 'דילים חיים לא זמינים כרגע')
          : tr('Decide above the fold', 'החלטה מהירה — בלי לגלול')}
      </p>
      <p
        className="text-sm font-medium mb-3 leading-snug"
        style={{ color: 'var(--shopli-navy)' }}
      >
        {valueLine ||
          (tr('Skip the essay — jump to live deals or keep browsing on-site.', 'דלגו על האנליזה — עברו לדילים חיים או לטרנדים באתר.'))}
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
              {tr.t(compareT.browse, side.name)}
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
          {tr('Trending now', 'טרנדים עכשיו')}
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
          {tr("Today's deals", 'דילים של היום')}
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
            {tr('Search products', 'חיפוש מוצרים')}
          </a>
        )}
      </div>
    </section>
  );
}
