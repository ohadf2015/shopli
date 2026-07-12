import { GetServerSideProps } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://shopli-neon.vercel.app';
const REGIONS = ['eu', 'il', 'us', 'uk', 'de', 'fr', 'es', 'it'];

function xmlEncode(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const { getAllCollections } = await import('../lib/collections').catch(() => ({ getAllCollections: () => [] }));
  const { getAllMoodboardSlugs } = await import('../lib/moodboards').catch(() => ({ getAllMoodboardSlugs: () => [] }));
  const { getAllComparisonSlugs } = await import('../lib/comparisons').catch(() => ({ getAllComparisonSlugs: () => [] }));
  const { getAllBlogSlugs } = await import('../lib/blog').catch(() => ({ getAllBlogSlugs: () => [] }));

  const collectionSlugs = getAllCollections().map(c => c.slug);
  const moodSlugs = getAllMoodboardSlugs();
  const compareSlugs = getAllComparisonSlugs();
  const blogSlugs = getAllBlogSlugs();

  const urls: string[] = [];

  // Home pages
  for (const region of REGIONS) {
    urls.push(`/${region}`);
  }

  // Collections
  for (const region of REGIONS) {
    for (const slug of collectionSlugs) {
      urls.push(`/${region}/collection/${slug}`);
    }
  }

  // Mood boards
  for (const region of REGIONS) {
    for (const slug of moodSlugs) {
      urls.push(`/${region}/mood/${slug}`);
    }
  }

  // Comparisons
  for (const region of REGIONS) {
    for (const slug of compareSlugs) {
      urls.push(`/${region}/compare/${slug}`);
    }
  }

  // Blog posts
  for (const region of REGIONS) {
    for (const slug of blogSlugs) {
      urls.push(`/${region}/blog/${slug}`);
    }
  }

  // Build XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${xmlEncode(SITE_URL + url)}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url === `/${url.split('/')[1]}` ? '0.9' : url.includes('/collection/') || url.includes('/mood/') ? '0.7' : '0.6'}</priority>
  </url>`).join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.write(xml);
  res.end();

  return { props: {} };
};

export default function SitemapPage() { return null; }