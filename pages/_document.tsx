import Document, { Html, Head, Main, NextScript } from 'next/document';
import { getRegion, RegionCode } from '../lib/regions';

export default class ShopliDocument extends Document {
  render() {
    const regionCode = (this.props.__NEXT_DATA__.query?.region as string) || 'eu';
    const region = getRegion(regionCode);
    const lang = region.lang;
    const dir = region.direction;

    return (
      <Html lang={lang} dir={dir}>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}