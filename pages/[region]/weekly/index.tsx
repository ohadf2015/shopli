import type { GetServerSideProps } from 'next';
import WeeklyIssueView, { type WeeklyPageProps } from '../../../components/WeeklyIssueView';
import { getRegion, type RegionCode } from '../../../lib/regions';
import { isWeeklyRegion, issueDates, todayUtc } from '../../../lib/weekly';
import { loadWeeklyIssue } from '../../../lib/weekly-store';

/**
 * The latest Shopli Weekly. It publishes itself: on a Sunday the newest issue
 * is that Sunday, rebuilt from the snapshots the trend-snapshot cron writes
 * each night. Past issues live at /weekly/<date>.
 */
export default function WeeklyLatestPage(props: WeeklyPageProps) {
  return <WeeklyIssueView {...props} />;
}

export const getServerSideProps: GetServerSideProps<WeeklyPageProps> = async ({ params, res }) => {
  const region = String(params?.region || '');
  if (!isWeeklyRegion(region)) return { notFound: true };

  const archive = issueDates(todayUtc());
  const latest = archive[0];
  const issue = latest ? await loadWeeklyIssue(region, latest) : null;

  // The issue for a Sunday keeps filling in during that day as the cron runs,
  // then stays fixed until next Sunday.
  res.setHeader(
    'Cache-Control',
    issue ? 'public, s-maxage=21600, stale-while-revalidate=86400' : 'public, s-maxage=600'
  );

  return {
    props: {
      region: region as RegionCode,
      config: getRegion(region),
      issue,
      archive,
      latest,
      isLatest: true,
    },
  };
};
