import { GetServerSideProps } from 'next';
import { REGIONS } from '../lib/regions';
import { SITE_URL } from '../lib/seo';

function xmlEncode(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

interface SitemapUrl {
  loc: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  lastmod?: string;
  images?: string[];
}

function buildUrlEntry(u: SitemapUrl): string {
  const imageTags = (u.images || [])
    .filter(img => img)
    .map(img => `    <image:image><image:loc>${xmlEncode(img)}</image:loc></image:image>`)
    .join('\n');

  return `  <url>
    <loc>${xmlEncode(u.loc)}</loc>
    <lastmod>${u.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority.toFixed(1)}</priority>${imageTags ? '\n' + imageTags : ''}
  </url>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const { getAllCollections } = await import('../lib/collections').catch(() => ({ getAllCollections: () => [] }));
  const { getAllMoodboardSlugs } = await import('../lib/moodboards').catch(() => ({ getAllMoodboardSlugs: () => [] }));
  const { getAllComparisonSlugs } = await import('../lib/comparisons').catch(() => ({ getAllComparisonSlugs: () => [] }));
  const { getAllBlogSlugs } = await import('../lib/blog').catch(() => ({ getAllBlogSlugs: () => [] }));

  const today = new Date().toISOString().split('T')[0];
  const regionCodes = Object.keys(REGIONS);

  const collectionSlugs = getAllCollections().map(c => ({ slug: c.slug, image: c.image }));
  const moodSlugs = getAllMoodboardSlugs();
  const compareSlugs = getAllComparisonSlugs();
  const blogSlugs = getAllBlogSlugs();

  const urls: SitemapUrl[] = [];

  // Regional homepages
  for (const region of regionCodes) {
    urls.push({
      loc: `${SITE_URL}/${region}`,
      changefreq: 'daily',
      priority: 1.0,
      lastmod: today,
    });
  }

  // Blog index pages
  for (const region of regionCodes) {
    urls.push({
      loc: `${SITE_URL}/${region}/blog`,
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: today,
    });
  }

  // Collection pages
  for (const region of regionCodes) {
    for (const coll of collectionSlugs) {
      const images = coll.image ? [`${SITE_URL}${coll.image}`] : undefined;
      urls.push({
        loc: `${SITE_URL}/${region}/collection/${coll.slug}`,
        changefreq: 'daily',
        priority: 0.8,
        lastmod: today,
        images,
      });
    }
  }

  // Mood board pages
  for (const region of regionCodes) {
    for (const slug of moodSlugs) {
      urls.push({
        loc: `${SITE_URL}/${region}/mood/${slug}`,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: today,
      });
    }
  }

  // Comparison pages
  for (const region of regionCodes) {
    for (const slug of compareSlugs) {
      urls.push({
        loc: `${SITE_URL}/${region}/compare/${slug}`,
        changefreq: 'weekly',
        priority: 0.6,
        lastmod: today,
      });
    }
  }

  // Blog posts
  for (const region of regionCodes) {
    for (const slug of blogSlugs) {
      urls.push({
        loc: `${SITE_URL}/${region}/blog/${slug}`,
        changefreq: 'monthly',
        priority: 0.6,
        lastmod: today,
      });
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(buildUrlEntry).join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.write(xml);
  res.end();

  return { props: {} };
};

export default function SitemapPage() { return null; }
