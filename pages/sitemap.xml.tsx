import { GetServerSideProps } from 'next';
import { REGIONS } from '../lib/regions';
import { SITE_URL, getCollectionOgImage } from '../lib/seo';

function xmlEncode(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
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
    .filter((img) => img)
    .map(
      (img) =>
        `    <image:image><image:loc>${xmlEncode(img)}</image:loc></image:image>`
    )
    .join('\n');

  return `  <url>
    <loc>${xmlEncode(u.loc)}</loc>
    <lastmod>${u.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority.toFixed(1)}</priority>${imageTags ? '\n' + imageTags : ''}
  </url>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const { getAllCollections } = await import('../lib/collections').catch(() => ({
    getAllCollections: () => [] as Array<{ slug: string; name?: Record<string, string>; image?: string }>,
  }));
  const { getAllMoodboardSlugs } = await import('../lib/moodboards').catch(() => ({
    getAllMoodboardSlugs: () => [] as string[],
  }));
  const { getAllComparisonSlugs } = await import('../lib/comparisons').catch(() => ({
    getAllComparisonSlugs: () => [] as string[],
  }));
  const { getAllBlogSlugs } = await import('../lib/blog').catch(() => ({
    getAllBlogSlugs: () => [] as string[],
  }));

  // Fresh lastmod on every generation (hourly revalidation via Cache-Control)
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const regionCodes = Object.keys(REGIONS);

  const collections = getAllCollections();
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
    // Search landing (noindex when empty; still useful for discovery of path)
    urls.push({
      loc: `${SITE_URL}/${region}/search`,
      changefreq: 'weekly',
      priority: 0.4,
      lastmod: today,
    });
    urls.push({
      loc: `${SITE_URL}/${region}/compare`,
      changefreq: 'weekly',
      priority: 0.5,
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

  // Collection pages — include per-category OG image
  for (const region of regionCodes) {
    const lang = REGIONS[region]?.lang || 'en';
    for (const coll of collections) {
      const name =
        coll.name?.[lang] ||
        coll.name?.en ||
        (coll as any).tag?.[lang] ||
        (coll as any).tag?.en ||
        coll.slug;
      const og = getCollectionOgImage(coll.slug, name, lang);
      const staticImg =
        coll.image && !coll.image.startsWith('http')
          ? `${SITE_URL}${coll.image}`
          : coll.image;
      urls.push({
        loc: `${SITE_URL}/${region}/collection/${coll.slug}`,
        changefreq: 'daily',
        priority: 0.8,
        lastmod: today,
        images: [og, staticImg].filter(Boolean) as string[],
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
  // Fresh sitemap: revalidate hourly, serve stale for a day
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.setHeader('X-Robots-Tag', 'noindex');
  res.write(xml);
  res.end();

  return { props: {} };
};

export default function SitemapPage() {
  return null;
}
