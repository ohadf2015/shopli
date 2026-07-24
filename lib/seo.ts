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

export function websiteJsonLd(searchTargetUrl?: string, region: RegionCode = 'eu') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: REGIONS[region]?.locale || 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate:
          searchTargetUrl ||
          `${SITE_URL}/${region}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** Absolute OG image URL for a collection/category (dynamic 1200×630). */
export function getCollectionOgImage(
  slug: string,
  title?: string,
  lang?: string
): string {
  const params = new URLSearchParams();
  if (title) params.set('title', title);
  if (lang) params.set('lang', lang);
  const qs = params.toString();
  return `${SITE_URL}/api/og/${encodeURIComponent(slug)}${qs ? `?${qs}` : ''}`;
}

/** ItemList schema for product grids (collection / home sections). */
export function itemListJsonLd(
  name: string,
  url: string,
  items: Array<{ name: string; url: string; image?: string; position?: number }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    url,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: item.position ?? i + 1,
      name: item.name,
      url: item.url,
      ...(item.image ? { image: item.image } : {}),
    })),
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
  sku,
  region,
  priceValidUntil,
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
  sku?: string;
  /** Region code for localized shipping/seller hints (e.g. 'il') */
  region?: string;
  /** ISO date YYYY-MM-DD; defaults to +30 days for deal freshness */
  priceValidUntil?: string;
}) {
  const validUntil =
    priceValidUntil ||
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const shipCountry =
    region && REGIONS[region as RegionCode]
      ? REGIONS[region as RegionCode].defaultShipTo
      : undefined;

  const offer =
    price !== undefined && currency
      ? {
          '@type': 'Offer',
          url,
          priceCurrency: currency,
          price: Number(price).toFixed(2),
          availability,
          priceValidUntil: validUntil,
          itemCondition: 'https://schema.org/NewCondition',
          seller: { '@type': 'Organization', name: brand || 'AliExpress' },
          ...(shipCountry
            ? {
                shippingDetails: {
                  '@type': 'OfferShippingDetails',
                  shippingDestination: {
                    '@type': 'DefinedRegion',
                    addressCountry: shipCountry,
                  },
                },
              }
            : {}),
        }
      : undefined;

  const aggregateRating =
    ratingValue !== undefined &&
    reviewCount !== undefined &&
    reviewCount > 0 &&
    ratingValue > 0
      ? {
          '@type': 'AggregateRating',
          ratingValue: Number(ratingValue).toFixed(1),
          reviewCount,
          bestRating: '5',
          worstRating: '1',
        }
      : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description: description || title,
    image: image || OG_IMAGE_URL,
    brand: brand ? { '@type': 'Brand', name: brand } : undefined,
    sku: sku || undefined,
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
  const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const hasVariant = products.map((p) => {
    const offer =
      p.price !== undefined && p.currency
        ? {
            '@type': 'Offer',
            url: p.url,
            priceCurrency: p.currency,
            price: Number(p.price).toFixed(2),
            availability: 'https://schema.org/InStock',
            priceValidUntil: validUntil,
            itemCondition: 'https://schema.org/NewCondition',
            seller: { '@type': 'Organization', name: p.brand || 'AliExpress' },
          }
        : undefined;

    const aggregateRating =
      p.ratingValue !== undefined &&
      p.reviewCount !== undefined &&
      p.reviewCount > 0 &&
      p.ratingValue > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: Number(p.ratingValue).toFixed(1),
            reviewCount: p.reviewCount,
            bestRating: '5',
            worstRating: '1',
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
