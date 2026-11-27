import { getCollection } from './collections';
import { localCurrency } from './regions';

export interface RelatedLink {
  href: string;
  title: string;
  kind: 'guide' | 'compare' | 'collection' | 'mood';
}

/** Collection slugs -> localized "Shop the picks" links for RelatedReads. */
export function collectionLinks(slugs: string[], region: string, lang: string): RelatedLink[] {
  const pick = (obj: any) => localCurrency(obj?.[lang] || obj?.en || '', region);
  return slugs
    .map((s) => getCollection(s))
    .filter(Boolean)
    .map((c: any) => ({
      href: `/${region}/collection/${c.slug}`,
      title: pick(c.name) || pick(c.tag) || c.slug,
      kind: 'collection' as const,
    }));
}
