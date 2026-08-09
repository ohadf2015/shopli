import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Assistant } from 'next/font/google';
import '../styles/globals.css';
import { organizationJsonLd } from '../lib/seo';
import { installClickTracking } from '../lib/analytics';
import { getRegion } from '../lib/regions';
import Footer from '../components/Footer';

// Self-hosted so there is no render-blocking round trip to fonts.googleapis.com,
// and so Next can emit size-adjusted fallback metrics (swap without the shift).
// Only Assistant: globals.css sets body to system-ui and uses Assistant for
// Hebrew, so the Inter that used to load alongside it was never applied.
const assistant = Assistant({
  subsets: ['hebrew', 'latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-assistant',
  display: 'swap',
});

/** Region from the URL — same rule the lang/dir effect below uses. */
function regionFromPath(asPath?: string, query?: unknown): string {
  const q = Array.isArray(query) ? query[0] : query;
  if (typeof q === 'string' && q) return q;
  return asPath?.match(/^\/([a-z]{2})(?:\/|$)/)?.[1] || 'eu';
}

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

  return (
    <>
      <Head>
        {/* Organization only. WebSite (with the SearchAction) is emitted by the
            region homepage, which is where Google reads it from — emitting a
            second, region-less copy here put two WebSite nodes on every page. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
        />
      </Head>
      <style jsx global>{`
        :root {
          --font-assistant: ${assistant.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
      {/* One footer for every page: FTC affiliate disclosure (legally required
          on a site where every outbound CTA is sponsored) plus the internal
          links that give the long-tail collection/guide pages a crawl path. */}
      <Footer currentRegion={regionFromPath(router.asPath, router.query?.region)} />
    </>
  );
}
