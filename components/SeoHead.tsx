import Head from 'next/head';
import { RegionCode } from '../lib/regions';
import { getSeoHead } from '../lib/seo';

interface SeoHeadProps {
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
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  children?: React.ReactNode;
}

export default function SeoHead({
  region,
  path = '',
  title,
  description,
  image,
  ogType = 'website',
  canonical,
  noindex,
  articlePublishedTime,
  articleModifiedTime,
  jsonLd,
  children,
}: SeoHeadProps) {
  const seo = getSeoHead({
    region,
    path,
    title,
    description,
    image,
    ogType,
    canonical,
    noindex,
    articlePublishedTime,
    articleModifiedTime,
  });

  const jsonLdScripts = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  return (
    <Head>
      <title>{seo.title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#F97316" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" sizes="any" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
      {seo.meta.map((m, i) =>
        m.tag === 'link' ? (
          <link
            key={`${m.rel}-${m.href}-${i}`}
            rel={m.rel}
            hrefLang={m.hrefLang}
            href={m.href}
          />
        ) : m.property ? (
          <meta
            key={`${m.property}-${i}`}
            property={m.property}
            content={m.content}
          />
        ) : (
          <meta
            key={`${m.name}-${i}`}
            name={m.name}
            content={m.content}
          />
        )
      )}
      {jsonLdScripts.map((data, i) => (
        <script
          key={`ld-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      {children}
    </Head>
  );
}
