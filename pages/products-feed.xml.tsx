import { GetServerSideProps } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://shopli-neon.vercel.app';

function xmlEncode(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function cleanDescription(desc: string): string {
  // Strip HTML tags, truncate to 5000 chars (Google limit)
  return desc.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 5000);
}

// Google product category mapping for our collection categories
// https://support.google.com/merchants/answer/6324436
const GOOGLE_CATEGORY_MAP: Record<string, string> = {
  'halloween': '209',          // Costumes
  'home-gym': '1581',          // Exercise & Fitness
  'home-office': '206',        // Office Supplies
  'smart-home': '478',         // Home Automation
  'kitchen': '488',            // Kitchen & Dining
  'travel': '357',             // Luggage & Bags
  'camping': '731',            // Camping & Hiking
  'wireless-audio': '233',     // Portable Audio & Video
  'phone-accessories': '233',  // Portable Audio & Video -> Cell Phone Accessories
  'summer-essentials': '167',  // Swimwear & Beach
  'back-to-school': '206',     // Office Supplies
  'pet': '1',                  // Animals & Pet Supplies
  'car': '888',                // Automotive
  'lighting': '269',           // Lighting
  'coffee-ritual': '488',      // Kitchen & Dining
  'content-creator': '233',    // Portable Audio & Video
  'balcony-garden': '536',     // Gardening & Lawn Care
  'sleep-sanctuary': '284',    // Bedding & Bath
  'gaming-gear': '235',        // Computer & Video Games
  'gadgets-under-10': '488',   // Kitchen & Dining -> Gadgets
};

const ITEMS_PER_COLLECTION = 10;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const { getAllCollections, getCollection } = await import('../lib/collections').catch(() => ({
    getAllCollections: () => [],
    getCollection: () => null,
  }));
  const { searchCollection } = await import('../lib/aliexpress').catch(() => ({
    searchCollection: async () => [],
  }));

  const collections = getAllCollections().filter(c => c.keywords && c.keywords.length > 0);
  const allProducts: Array<{
    id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    imageUrl: string;
    affiliateLink: string;
    brand: string;
    collectionSlug: string;
    collectionName: string;
  }> = [];

  // Fetch products from all collections
  for (const coll of collections) {
    try {
      const products = await searchCollection('il', coll.keywords, ITEMS_PER_COLLECTION);
      const name = coll.name?.en || coll.slug;
      for (const p of products) {
        allProducts.push({
          id: `shopli-${coll.slug}-${p.id}`,
          title: p.title,
          description: p.title, // AliExpress API doesn't return full descriptions
          price: p.price,
          currency: 'ILS',
          imageUrl: p.imageUrl,
          affiliateLink: p.affiliateLink,
          brand: p.shopName || 'AliExpress',
          collectionSlug: coll.slug,
          collectionName: name,
        });
      }
    } catch {
      // Skip failed collections
    }
  }

  // Build XML feed
  const items = allProducts.map(p => {
    const googleCategory = GOOGLE_CATEGORY_MAP[p.collectionSlug] || '488';
    const productUrl = `${SITE_URL}/il/collection/${p.collectionSlug}`;

    return `  <item>
    <g:id>${xmlEncode(p.id)}</g:id>
    <g:title>${xmlEncode(p.title)}</g:title>
    <g:description>${xmlEncode(cleanDescription(p.description))}</g:description>
    <g:link>${xmlEncode(p.affiliateLink || productUrl)}</g:link>
    <g:image_link>${xmlEncode(p.imageUrl)}</g:image_link>
    <g:price>${p.price.toFixed(2)} ILS</g:price>
    <g:availability>in_stock</g:availability>
    <g:brand>${xmlEncode(p.brand)}</g:brand>
    <g:condition>new</g:condition>
    <g:google_product_category>${googleCategory}</g:google_product_category>
    <g:product_type>${xmlEncode(p.collectionName)}</g:product_type>
    <g:custom_label_0>shopli</g:custom_label_0>
  </item>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Shopli - Products Feed</title>
    <link>${xmlEncode(SITE_URL)}</link>
    <description>Shopli Google Shopping product feed — AI-curated AliExpress deals</description>
${items}
  </channel>
</rss>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.write(xml);
  res.end();

  return { props: {} };
};

export default function ProductsFeedPage() { return null; }