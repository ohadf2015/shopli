import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import '../styles/globals.css';
import { organizationJsonLd, websiteJsonLd } from '../lib/seo';
import { installClickTracking } from '../lib/analytics';
import { getRegion } from '../lib/regions';

export default function ShopliApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Revenue analytics: one delegated listener fires affiliate_click for every
  // AliExpress CTA (and outbound_click for Telegram/WhatsApp) on every page.
  useEffect(() => installClickTracking(), []);

  // Keep the html lang/dir in sync after hydration and on client-side
  // navigations. Derive the region from the URL (not pageProps) so pages that
  // don't forward their region config can't silently flip /il back to LTR.
  useEffect(() => {
    const q = router.query?.region;
    let code = Array.isArray(q) ? q[0] : q;
    if (!code) {
      const m = router.asPath?.match(/^\/([a-z]{2})(?:\/|$)/);
      code = m?.[1];
    }
    // getRegion falls back to the EU (en/ltr) config for unknown/absent codes.
    const config = getRegion(code || 'eu');
    document.documentElement.dir = config.direction;
    document.documentElement.lang = config.lang;
  }, [router.asPath, router.query]);

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
