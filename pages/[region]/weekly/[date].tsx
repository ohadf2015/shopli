import type { GetServerSideProps } from 'next';
import WeeklyIssueView, { type WeeklyPageProps } from '../../../components/WeeklyIssueView';
import { getRegion, type RegionCode } from '../../../lib/regions';
import { isIssueDate, isWeeklyRegion, issueDates, todayUtc } from '../../../lib/weekly';
import { loadWeeklyIssue } from '../../../lib/weekly-store';

/**
 * A past Shopli Weekly. Rebuilt from the same snapshots it was first built
 * from, so it reads the same as it did that Sunday. The current week lives at
 * /weekly, and its dated URL redirects there so one issue never has two pages.
 */
export default function WeeklyArchivePage(props: WeeklyPageProps) {
  return <WeeklyIssueView {...props} />;
}

export const getServerSideProps: GetServerSideProps<WeeklyPageProps> = async ({ params, res }) => {
  const region = String(params?.region || '');
  const date = String(params?.date || '');
  if (!isWeeklyRegion(region)) return { notFound: true };

  const today = todayUtc();
  if (!isIssueDate(date, today)) return { notFound: true };

  const archive = issueDates(today);
  const latest = archive[0];
  if (date === latest) {
    return { redirect: { destination: `/${region}/weekly`, permanent: false } };
  }

  const issue = await loadWeeklyIssue(region, date);
  // A finished week's data does not change.
  res.setHeader(
    'Cache-Control',
    issue ? 'public, s-maxage=604800, stale-while-revalidate=2592000' : 'public, s-maxage=600'
  );

  return {
    props: {
      region: region as RegionCode,
      config: getRegion(region),
      issue,
      archive,
      latest,
      isLatest: false,
    },
  };
};
