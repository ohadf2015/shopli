import { SITE_URL } from './seo';
import type { RegionCode, RegionConfig } from './regions';

export interface HomeCard {
  productId: string;
  title: string;
  imageUrl: string;
  price: number;
  /** Short, factual reason line: "Usually ~€9.99" / "290 sold a day". */
  why: string;
  badge: string;
  tone: 'drop' | 'hot';
  stars: number;
}

export interface HomePageProps {
  region: RegionCode;
  config: RegionConfig;
  rtl: boolean;
  drops: HomeCard[];
  sellers: HomeCard[];
  chips: Array<{ slug: string; name: string }>;
  asOf: string;
}

export type HomeCopy = {
  h1: string;
  sub: string;
  drops: string;
  dropsSub: string;
  sellers: string;
  sellersSub: string;
  finds: string;
  findsSub: string;
  browse: string;
  howTitle: string;
  how: string;
  asOf: string;
  empty: string;
};

/** True when the client asks for markdown at least as strongly as HTML. */
export function wantsMarkdown(accept: string | undefined): boolean {
  if (!accept) return false;
  const q = (type: string): number => {
    let best = -1;
    for (const part of accept.split(',')) {
      const [mime, ...params] = part.trim().split(';');
      if (mime.trim().toLowerCase() !== type) continue;
      const qp = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
      best = Math.max(best, qp ? Number(qp.slice(2)) : 1);
    }
    return best;
  };
  const md = q('text/markdown');
  return md > 0 && md >= q('text/html');
}

export function homeMarkdown(props: HomePageProps, t: HomeCopy): string {
  const { region, config, drops, sellers, chips, asOf } = props;
  const sym = config.currencySymbol;
  const line = (c: HomeCard) =>
    `- [${c.title}](${SITE_URL}/${region}/product/${c.productId}) - ${sym}${c.price.toFixed(2)}, ${c.badge}, ${c.why}`;
  const out: string[] = [`# ${t.h1}`, '', t.sub, ''];

  if (drops.length + sellers.length === 0) out.push(t.empty, '');
  else if (drops.length >= 3) {
    out.push(`## ${t.drops}`, '', t.dropsSub, '', ...drops.map(line), '');
    if (sellers.length) out.push(`## ${t.sellers}`, '', t.sellersSub, '', ...sellers.map(line), '');
  } else {
    out.push(`## ${t.finds}`, '', t.findsSub, '', ...[...drops, ...sellers].slice(0, 8).map(line), '');
  }
  if (asOf) out.push(`${t.asOf} ${asOf}`, '');

  if (chips.length) {
    out.push(`## ${t.browse}`, '', ...chips.map((c) => `- [${c.name}](${SITE_URL}/${region}/collection/${c.slug})`), '');
  }
  out.push(`## ${t.howTitle}`, '', t.how, '');
  return out.join('\n');
}
