import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import '../styles/globals.css';
import { organizationJsonLd, websiteJsonLd } from '../lib/seo';

export default function ShopliApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const config = (pageProps as any)?.regionConfig;

  // Keep the html lang/dir in sync on client-side navigations.
  useEffect(() => {
    if (config?.direction === 'rtl') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'he';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = config?.lang || 'en';
    }
  }, [config]);

  const orgLd = organizationJsonLd();
  const webLd = websiteJsonLd();

  return (
    <>
      <Head>
        {/* Global structured data: Organization + WebSite with SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webLd) }}
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
