import { REGIONS, RegionCode } from './regions';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://shopli-neon.vercel.app';

export function getHreflangTags(region: RegionCode, path: string) {
  const tags: Array<{ rel: string; hrefLang: string; href: string }> = [];

  for (const [code, config] of Object.entries(REGIONS)) {
    tags.push({
      rel: 'alternate',
      hrefLang: config.locale,
      href: `${SITE_URL}/${code}${path}`,
    });
  }

  // x-default = English (Europe)
  tags.push({
    rel: 'alternate',
    hrefLang: 'x-default',
    href: `${SITE_URL}/eu${path}`,
  });

  tags.push({ rel: 'canonical', hrefLang: '', href: `${SITE_URL}/${region}${path}` });

  return tags;
}

export function renderHreflangLinks(region: RegionCode, path: string): string {
  return getHreflangTags(region, path)
    .map(t => t.rel === 'canonical'
      ? `<link rel="canonical" href="${t.href}" />`
      : `<link rel="${t.rel}" hrefLang="${t.hrefLang}" href="${t.href}" />`
    )
    .join('\n');
}

interface SeoProps {
  region: RegionCode;
  path?: string;
  title?: string;
  description?: string;
  image?: string;
  ogType?: string;
}

export function getSeoHead(props: SeoProps) {
  const { region, path = '', title, description, image, ogType = 'website' } = props;
  const config = REGIONS[region];
  const url = `${SITE_URL}/${region}${path}`;
  const finalTitle = title || config.meta.title;
  const finalDesc = description || config.meta.description;
  const finalImage = image || `${SITE_URL}/og-image.jpg`;

  return {
    title: finalTitle,
    meta: [
      { name: 'description', content: finalDesc },
      { property: 'og:title', content: finalTitle },
      { property: 'og:description', content: finalDesc },
      { property: 'og:url', content: url },
      { property: 'og:type', content: ogType },
      { property: 'og:image', content: finalImage },
      { property: 'og:locale', content: config.locale },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: finalTitle },
      { name: 'twitter:description', content: finalDesc },
      { name: 'twitter:image', content: finalImage },
      // hreflang
      ...getHreflangTags(region, path).map(t => t.rel === 'canonical'
        ? { tag: 'link', rel: 'canonical', href: t.href } as any
        : { tag: 'link', rel: t.rel, hrefLang: t.hrefLang, href: t.href } as any
      ),
    ],
  };
}