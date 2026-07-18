import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Header from '../../components/Header';
import { getRegion } from '../../lib/regions';
import type { RegionConfig } from '../../lib/regions';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://shopli-neon.vercel.app';

export default function GoogleShoppingFeedPage({ region, config, rtl }: { region: string; config: RegionConfig; rtl: boolean }) {
  const feedUrl = `${SITE_URL}/products-feed.xml`;

  return (
    <>
      <Head>
        <title>Google Shopping Feed | Shopli</title>
        <meta name="description" content="Shopli Google Shopping product feed — submit to Google Merchant Center for free product listing ads." />
        <meta name="robots" content="noindex, follow" />
      </Head>
      <Header currentRegion={region} dir={config?.direction} />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="flex items-center gap-2 text-xs mb-4" style={{ color: 'var(--shopli-warm-gray)' }}>
          <a href={`/${region}`}>Home</a> <span>/</span> <span style={{ color: 'var(--shopli-navy)' }}>Google Shopping Feed</span>
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold mb-6" style={{ color: 'var(--shopli-navy)' }}>
          {rtl ? 'פיד Google Shopping' : 'Google Shopping Product Feed'}
        </h1>

        <div className="prose prose-sm max-w-none" style={{ color: 'var(--shopli-warm-gray)' }}>
          <p className="text-base leading-relaxed mb-6">
            {rtl
              ? 'Shopli מייצרת פיד מוצרים תקין ל-Google Merchant Center. אפשר להגיש אותו ל-Google Shopping ולקבל מודעות מוצר חינמיות (Free Product Listings).'
              : 'Shopli generates a Google Merchant Center-compliant product feed. Submit it to Google Shopping to get free product listing ads for all our curated products.'}
          </p>

          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: 'var(--shopli-navy)' }}>
            {rtl ? 'פרמטרים של הפיד' : 'Feed Details'}
          </h2>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-4 font-semibold" style={{ color: 'var(--shopli-navy)' }}>{rtl ? 'פרמטר' : 'Parameter'}</th>
                  <th className="text-left py-2 font-semibold" style={{ color: 'var(--shopli-navy)' }}>{rtl ? 'ערך' : 'Value'}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-mono text-xs">Feed URL</td>
                  <td className="py-2"><a href={feedUrl} className="text-blue-600 hover:underline font-mono text-xs">{feedUrl}</a></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-mono text-xs">{rtl ? 'פורמט' : 'Format'}</td>
                  <td className="py-2">XML (RSS 2.0 + g: namespace)</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-mono text-xs">{rtl ? 'מטבע' : 'Currency'}</td>
                  <td className="py-2">ILS (₪)</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-mono text-xs">{rtl ? 'תדירות עדכון' : 'Update Frequency'}</td>
                  <td className="py-2">{rtl ? 'פעם בשעה (3600 שניות מטמון)' : 'Hourly (3600s cache)'}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono text-xs">{rtl ? 'מדינת יעד' : 'Target Country'}</td>
                  <td className="py-2">IL (Israel)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: 'var(--shopli-navy)' }}>
            {rtl ? 'איך להגיש ל-Google Merchant Center' : 'How to Submit to Google Merchant Center'}
          </h2>

          <ol className="list-decimal pl-5 space-y-2 mb-6">
            <li>{rtl ? 'היכנסו ל-Google Merchant Center' : 'Go to <a href="https://merchants.google.com" className="text-blue-600 hover:underline">Google Merchant Center</a>'}</li>
            <li>{rtl ? 'הוסיפו פיד חדש: Products → Feeds → Add feed' : 'Add a new feed: Products → Feeds → Add feed'}</li>
            <li>{rtl ? 'בחרו "Scheduled fetch" והזינו את כתובת הפיד:' : 'Choose "Scheduled fetch" and enter the feed URL:'}<br />
              <code className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">{feedUrl}</code>
            </li>
            <li>{rtl ? 'קבעו תדירות: כל יום' : 'Set frequency: Daily'}</li>
            <li>{rtl ? 'הפיד יכיל את כל המוצרים מהאוספים שלנו עם מידע מלא (מחיר, תמונה, תיאור, מותג)' : 'The feed includes all products from our collections with full info (price, image, description, brand)'}</li>
          </ol>

          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: 'var(--shopli-navy)' }}>
            {rtl ? 'שדות בפיד' : 'Feed Fields Included'}
          </h2>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <ul className="space-y-1 text-sm">
              <li><code className="bg-gray-100 px-1 rounded text-xs">g:id</code> — {rtl ? 'מזהה ייחודי' : 'Unique product ID'}</li>
              <li><code className="bg-gray-100 px-1 rounded text-xs">g:title</code> — {rtl ? 'כותרת המוצר' : 'Product title'}</li>
              <li><code className="bg-gray-100 px-1 rounded text-xs">g:description</code> — {rtl ? 'תיאור המוצר' : 'Product description'}</li>
              <li><code className="bg-gray-100 px-1 rounded text-xs">g:link</code> — {rtl ? 'קישור שותפים לאליאקספרס' : 'Affiliate link to AliExpress'}</li>
              <li><code className="bg-gray-100 px-1 rounded text-xs">g:image_link</code> — {rtl ? 'תמונת המוצר' : 'Product image'}</li>
              <li><code className="bg-gray-100 px-1 rounded text-xs">g:price</code> — {rtl ? 'מחיר בשקלים (ILS)' : 'Price in ILS'}</li>
              <li><code className="bg-gray-100 px-1 rounded text-xs">g:availability</code> — {rtl ? 'זמינות (in_stock)' : 'Availability (in_stock)'}</li>
              <li><code className="bg-gray-100 px-1 rounded text-xs">g:brand</code> — {rtl ? 'שם החנות/מותג' : 'Store/brand name'}</li>
              <li><code className="bg-gray-100 px-1 rounded text-xs">g:condition</code> — {rtl ? 'מצב (new)' : 'Condition (new)'}</li>
              <li><code className="bg-gray-100 px-1 rounded text-xs">g:google_product_category</code> — {rtl ? 'קטגוריית Google Shopping' : 'Google Shopping category ID'}</li>
              <li><code className="bg-gray-100 px-1 rounded text-xs">g:product_type</code> — {rtl ? 'שם האוסף' : 'Collection name'}</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
            <p className="font-semibold mb-1" style={{ color: 'var(--shopli-navy)' }}>
              {rtl ? '💡 טיפ: פיד מוצרים = מודעות חינמיות' : '💡 Tip: Product feed = free listings'}
            </p>
            <p>
              {rtl
                ? 'הגשת הפיד ל-Google Merchant Center מאפשרת למוצרים שלכם להופיע בחיפוש Google Shopping ללא עלות. המשתמשים לוחצים, נכנסים לאליאקספרס דרך קישור השותפים שלכם, ואתם מרוויחים עמלה.'
                : 'Submitting this feed to Google Merchant Center lets your products appear in Google Shopping search results for free. Users click through to AliExpress via your affiliate links, and you earn commission.'}
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, query }) => {
  const region = (query?.region as string) || (params?.region as string) || 'eu';
  const config = getRegion(region);
  return {
    props: {
      region,
      config,
      rtl: config?.direction === 'rtl',
    },
  };
};