import { SITE_URL, SITE_NAME, SITE_TAGLINE } from './seo';
import { getAllCollections } from './collections';
import { blogPosts } from './blog';
import { comparisons } from './comparisons';

const en = (obj: any): string => obj?.en || Object.values(obj || {})[0] || '';

/**
 * llms-full.txt: the text of every guide, comparison and collection in one
 * Markdown file, built from the same data as /llms.txt and the pages so it
 * cannot drift from them. English only; the other locales are translations.
 */
export function buildLlmsFullTxt(): string {
  const out: string[] = [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_TAGLINE}. ${SITE_NAME} ranks live AliExpress listings by current price, rating, review count and order volume. This file holds the full text of its buying guides, comparisons and collections. The page index is at ${SITE_URL}/llms.txt.`,
    '',
  ];

  out.push('## Buying guides', '');
  for (const p of blogPosts.filter((p) => (p.category as string) !== 'draft')) {
    out.push(`### ${en(p.title)}`, '', `URL: ${SITE_URL}/${p.regions?.[0] || 'eu'}/blog/${p.slug}`, '', en(p.intro), '');
    for (const s of p.sections) out.push(`#### ${en(s.heading)}`, '', en(s.body), '');
    if (p.faq.length) {
      out.push('#### FAQ', '');
      for (const f of p.faq) out.push(`**${en(f.q)}**`, '', en(f.a), '');
    }
  }

  out.push('## Comparisons', '');
  for (const c of comparisons) {
    out.push(`### ${en(c.title)}`, '', `URL: ${SITE_URL}/eu/compare/${c.slug}`, '', en(c.intro), '');
    for (const side of [c.product1, c.product2]) {
      out.push(`#### ${side.name}`, '');
      out.push(...side.pros.map((x) => `- Pro: ${x}`), ...side.cons.map((x) => `- Con: ${x}`), '');
    }
    out.push('#### Verdict', '', en(c.verdict), '');
    for (const f of c.faq) out.push(`**${en(f.q)}**`, '', en(f.a), '');
  }

  out.push('## Collections', '');
  for (const c of getAllCollections()) {
    out.push(`### ${en(c.name)}`, '', `URL: ${SITE_URL}/eu/collection/${c.slug}`, '', en(c.desc), '');
  }

  return out.join('\n');
}
