import { REGIONS, RegionCode } from './regions';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://shopli-neon.vercel.app';
export const SITE_NAME = 'Shopli';
export const SITE_TAGLINE = 'AI-curated AliExpress deals';
export const OG_IMAGE_URL = process.env.NEXT_PUBLIC_OG_IMAGE_URL || 'https://placehold.co/1200x630/F97316/FFFFFF/png?text=Shopli+-+AI+AliExpress+Deals';

export function getPageUrl(region: RegionCode, path = '') {
  return `${SITE_URL}/${region}${path}`;
}

export function getCanonical(region: RegionCode, path = '') {
  return getPageUrl(region, path);
}

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
  ogType?: 'website' | 'article' | 'product';
  canonical?: string;
  noindex?: boolean;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
}

export function getSeoHead(props: SeoProps) {
  const {
    region,
    path = '',
    title,
    description,
    image,
    ogType = 'website',
    canonical,
    noindex = false,
    articlePublishedTime,
    articleModifiedTime,
  } = props;

  const config = REGIONS[region];
  const url = canonical || getCanonical(region, path);
  const finalTitle = title || config?.meta?.title || SITE_NAME;
  const finalDesc = description || config?.meta?.description || SITE_TAGLINE;
  const finalImage = image || OG_IMAGE_URL;

  const meta: Array<{
    tag: 'meta' | 'link';
    name?: string;
    property?: string;
    rel?: string;
    hrefLang?: string;
    href?: string;
    content?: string;
  }> = [
    { tag: 'meta', name: 'description', content: finalDesc },
    { tag: 'meta', property: 'og:site_name', content: SITE_NAME },
    { tag: 'meta', property: 'og:title', content: finalTitle },
    { tag: 'meta', property: 'og:description', content: finalDesc },
    { tag: 'meta', property: 'og:url', content: url },
    { tag: 'meta', property: 'og:type', content: ogType },
    { tag: 'meta', property: 'og:image', content: finalImage },
    { tag: 'meta', property: 'og:locale', content: config?.locale || 'en' },
    { tag: 'meta', name: 'twitter:card', content: 'summary_large_image' },
    { tag: 'meta', name: 'twitter:title', content: finalTitle },
    { tag: 'meta', name: 'twitter:description', content: finalDesc },
    { tag: 'meta', name: 'twitter:image', content: finalImage },
  ];

  if (noindex) {
    meta.push({ tag: 'meta', name: 'robots', content: 'noindex, follow' });
  }

  if (articlePublishedTime) {
    meta.push({ tag: 'meta', property: 'article:published_time', content: articlePublishedTime });
  }
  if (articleModifiedTime) {
    meta.push({ tag: 'meta', property: 'article:modified_time', content: articleModifiedTime });
  }

  // hreflang + canonical (prefer explicit canonical when provided, e.g. share URLs with query params)
  for (const t of getHreflangTags(region, path)) {
    if (t.rel === 'canonical') {
      meta.push({ tag: 'link', rel: 'canonical', href: canonical || t.href });
    } else {
      meta.push({ tag: 'link', rel: t.rel, hrefLang: t.hrefLang, href: t.href });
    }
  }

  return {
    title: finalTitle,
    meta,
  };
}

// ------------------------------------------------------------------
// Structured data (JSON-LD) helpers
// ------------------------------------------------------------------

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    sameAs: [
      'https://t.me/shoppingisraelnew',
      'https://t.me/shopli_eu',
    ],
  };
}

export function websiteJsonLd(searchTargetUrl?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: searchTargetUrl || `${SITE_URL}/eu/collection/{{search_term_string}}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function articleJsonLd({
  headline,
  description,
  url,
  image,
  datePublished,
  dateModified,
}: {
  headline: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    image: image || OG_IMAGE_URL,
    datePublished,
    dateModified: dateModified || datePublished,
    author: { '@type': 'Organization', name: SITE_NAME },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
}

export function blogPostingJsonLd({
  headline,
  description,
  url,
  image,
  datePublished,
  dateModified,
}: {
  headline: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description,
    image: image || OG_IMAGE_URL,
    datePublished,
    dateModified: dateModified || datePublished,
    author: { '@type': 'Organization', name: SITE_NAME },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
}

export function productJsonLd({
  title,
  description,
  image,
  url,
  brand,
  price,
  currency,
  availability = 'https://schema.org/InStock',
  ratingValue,
  reviewCount,
}: {
  title: string;
  description?: string;
  image?: string;
  url: string;
  brand?: string;
  price?: number;
  currency?: string;
  availability?: string;
  ratingValue?: number;
  reviewCount?: number;
}) {
  const offer = price !== undefined && currency
    ? {
        '@type': 'Offer',
        url,
        priceCurrency: currency,
        price: price.toFixed(2),
        availability,
        seller: { '@type': 'Organization', name: brand || 'AliExpress' },
      }
    : undefined;

  const aggregateRating =
    ratingValue !== undefined && reviewCount !== undefined && reviewCount > 0
      ? {
          '@type': 'AggregateRating',
          ratingValue: ratingValue.toFixed(1),
          reviewCount,
        }
      : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description: description || title,
    image: image || OG_IMAGE_URL,
    brand: brand ? { '@type': 'Brand', name: brand } : undefined,
    offers: offer,
    aggregateRating,
    url,
  };
}

export function productListJsonLd(products: ReturnType<typeof productJsonLd>[]) {
  return products;
}

/**
 * ProductGroup schema for multi-product comparison pages.
 * @see https://schema.org/ProductGroup
 */
export function productGroupJsonLd({
  name,
  description,
  url,
  products,
}: {
  name: string;
  description: string;
  url: string;
  products: Array<{
    title: string;
    description?: string;
    image?: string;
    url: string;
    brand?: string;
    price?: number;
    currency?: string;
    ratingValue?: number;
    reviewCount?: number;
  }>;
}) {
  const hasVariant = products.map((p) => {
    const offer =
      p.price !== undefined && p.currency
        ? {
            '@type': 'Offer',
            url: p.url,
            priceCurrency: p.currency,
            price: p.price.toFixed(2),
            availability: 'https://schema.org/InStock',
            seller: { '@type': 'Organization', name: p.brand || 'AliExpress' },
          }
        : undefined;

    const aggregateRating =
      p.ratingValue !== undefined && p.reviewCount !== undefined && p.reviewCount > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: p.ratingValue.toFixed(1),
            reviewCount: p.reviewCount,
          }
        : undefined;

    return {
      '@type': 'Product',
      name: p.title,
      description: p.description || p.title,
      image: p.image || OG_IMAGE_URL,
      brand: p.brand ? { '@type': 'Brand', name: p.brand } : undefined,
      offers: offer,
      aggregateRating,
      url: p.url,
    };
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'ProductGroup',
    name,
    description,
    url,
    productGroupID: `compare-${products.length}`,
    variesBy: ['https://schema.org/price', 'https://schema.org/aggregateRating'],
    hasVariant,
  };
}
