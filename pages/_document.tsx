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
          {/* Performance: preconnect to external origins */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://www.googletagmanager.com" />
          <link rel="preconnect" href="https://ae01.alicdn.com" />
          <link rel="dns-prefetch" href="https://api-sg.aliexpress.com" />
          <link rel="dns-prefetch" href="https://www.aliexpress.com" />

          {/* Fonts with display=swap for Core Web Vitals */}
          <link
            href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap"
            rel="stylesheet"
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
