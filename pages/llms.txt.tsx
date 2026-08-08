import { GetServerSideProps } from 'next';
import { SITE_URL, SITE_NAME, SITE_TAGLINE } from '../lib/seo';
import { getAllCollections } from '../lib/collections';
import { blogPosts, type BlogPost } from '../lib/blog';
import { comparisons } from '../lib/comparisons';
import { ALL_REGIONS, getRegion } from '../lib/regions';

/**
 * llms.txt — the Markdown index assistants and AI crawlers read to find out
 * what a site covers without crawling 1,500 URLs.
 *
 * Generated from the same data the sitemap uses rather than checked in as a
 * static file, so adding a collection or guide can't silently leave it stale.
 */
function buildLlmsTxt(): string {
  const en = (obj: any) => obj?.en || Object.values(obj || {})[0] || '';
  const collections = getAllCollections();
  const guides = blogPosts.filter((p) => (p.category as string) !== 'draft');
  // A region-restricted post 404s under /eu, so link it where it actually lives.
  const guideUrl = (p: BlogPost) => `${SITE_URL}/${p.regions?.[0] || 'eu'}/blog/${p.slug}`;
  const regionList = ALL_REGIONS.map((r) => {
    const cfg = getRegion(r.code);
    return `${r.code} (${r.label}, ${cfg.currency})`;
  }).join(', ');

  const lines: string[] = [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_TAGLINE}. ${SITE_NAME} ranks live AliExpress listings by current price, rating, review count and order volume, and groups them into curated collections, side-by-side comparisons and buying guides.`,
    '',
    '## About',
    '',
    `- Regions: ${regionList}. Every path is prefixed with a region code, e.g. \`${SITE_URL}/eu\` or \`${SITE_URL}/il\` (Hebrew, RTL).`,
    '- Product data is fetched live from the AliExpress affiliate API. Prices, ratings and availability change frequently — treat any price quoted here as the value at crawl time.',
    `- ${SITE_NAME} is an AliExpress affiliate and earns a commission on purchases made through its outbound links. Commission does not affect which products are shown or how they are ranked.`,
    '- Not affiliated with or endorsed by Alibaba Group beyond its public affiliate programme.',
    '',
    '## Machine-readable endpoints',
    '',
    `- [Sitemap](${SITE_URL}/sitemap.xml): every indexable URL across all regions.`,
    `- [Product feed](${SITE_URL}/products-feed.xml): current products in XML.`,
    `- [Hot products API](${SITE_URL}/api/products/hot): JSON, trending picks.`,
    `- [Product search API](${SITE_URL}/api/products/search?q=QUERY): JSON, keyword search.`,
    `- [Similar products API](${SITE_URL}/api/products/similar?id=PRODUCT_ID): JSON, related items.`,
    '',
    '## Buying guides',
    '',
    ...guides.map((p) => `- [${en(p.title)}](${guideUrl(p)}): ${en(p.metaDesc)}`),
    '',
    '## Comparisons',
    '',
    ...comparisons.map((c: any) => `- [${en(c.title)}](${SITE_URL}/eu/compare/${c.slug})`),
    '',
    '## Collections',
    '',
    ...collections.map((c: any) => `- [${en(c.name)}](${SITE_URL}/eu/collection/${c.slug})`),
    '',
    '## Optional',
    '',
    `- [Trending now](${SITE_URL}/eu/trending): what is selling this week.`,
    `- [Deals](${SITE_URL}/deals): current discounts.`,
    `- [Compare tool](${SITE_URL}/eu/compare): side-by-side comparison of any 2-4 AliExpress product IDs.`,
    '',
  ];

  return lines.join('\n');
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.write(buildLlmsTxt());
  res.end();
  return { props: {} };
};

export default function LlmsTxt() {
  return null;
}
