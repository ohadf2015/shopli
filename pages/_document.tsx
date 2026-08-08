import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document';
import { getRegion } from '../lib/regions';

interface ShopliDocumentProps extends DocumentInitialProps {
  lang: string;
  dir: string;
}

export default class ShopliDocument extends Document<ShopliDocumentProps> {
  static async getInitialProps(ctx: DocumentContext): Promise<ShopliDocumentProps> {
    const initialProps = await Document.getInitialProps(ctx);

    // Determine region from the URL so the initial HTML has the correct lang/dir.
    const { query, asPath, req } = ctx;
    let regionCode = (query?.region as string) || '';
    if (!regionCode && asPath) {
      const match = asPath.match(/^\/([a-z]{2})(?:\/|$)/);
      regionCode = match?.[1] || '';
    }
    if (!regionCode && req?.headers?.host) {
      // Fallback: no region prefix means default to English/Europe
      regionCode = 'eu';
    }

    const config = getRegion(regionCode);
    const lang = config?.lang || 'en';
    const dir = config?.direction || 'ltr';

    return { ...initialProps, lang, dir };
  }

  render() {
    const { lang, dir } = this.props;
    const gaId = process.env.NEXT_PUBLIC_GA4_ID || process.env.NEXT_PUBLIC_GA_ID;

    return (
      <Html lang={lang} dir={dir}>
        <Head>
          {/* Google Search Console verification */}
          <meta
            name="google-site-verification"
            content="ZuLzbvi5lsxoWY0XMCM5UfKF7dEgVvkTgN3_xFlVd8E"
          />

          {/* Performance: preconnect to external origins.
              Fonts are self-hosted via next/font (see _app.tsx), so no
              fonts.googleapis.com / fonts.gstatic.com hop to warm up. */}
          <link rel="preconnect" href="https://www.googletagmanager.com" />
          {/* Every product photo is served from here — this is the LCP origin.
              (It used to preconnect ae01.alicdn.com, which the site never hits.) */}
          <link rel="preconnect" href="https://ae-pic-a1.aliexpress-media.com" />
          <link rel="dns-prefetch" href="https://api-sg.aliexpress.com" />
          <link rel="dns-prefetch" href="https://www.aliexpress.com" />
          <link rel="preconnect" href="https://eu-assets.i.posthog.com" />

          {/* PostHog analytics (EU project 151059, shared across products, split by $host) */}
          <script
            dangerouslySetInnerHTML={{
              __html: `!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]);t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group identify setPersonProperties resetPersonProperties".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
posthog.init("phc_m3X2YeaZ89r7m8yQYXfc6afyrygXmJG7TegJco5H9skD",{api_host:"https://eu.i.posthog.com",person_profiles:"identified_only"});`,
            }}
          />

          {/* Google Analytics */}
          {gaId && (
            <>
              <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${gaId}', {
                      page_path: window.location.pathname,
                    });
                  `,
                }}
              />
            </>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
