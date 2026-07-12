#!/usr/bin/env node
// Shopli Telegram Auto-Post Script
// Posts curated product roundups to Telegram channel
// Usage: node scripts/telegram-post.js <theme> <region>

const fs = require('fs');
const path = require('path');

// Load environment
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID; // e.g., @shopli or -100xxxxxxxxx
const SHOPLI_BASE_URL = process.env.SHOPLI_BASE_URL || 'https://shopli-neon.vercel.app';

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHANNEL_ID) {
  console.error('❌ Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHANNEL_ID in .env.local');
  process.exit(1);
}

// Collection data (matches lib/collections.ts)
const COLLECTIONS = {
  'home-gym': { name: { en: 'Home Gym', he: 'חדר כושר ביתי' }, keywords: ['adjustable dumbbells', 'resistance bands', 'pull up bar', 'weight bench', 'kettlebell', 'yoga mat'] },
  'coffee-ritual': { name: { en: 'Coffee Ritual', he: 'טקס קפה' }, keywords: ['french press', 'burr grinder', 'gooseneck kettle', 'coffee scale', 'ceramic dripper', 'milk frother'] },
  'content-creator': { name: { en: 'Content Creator Kit', he: 'ערכת יוצר תוכן' }, keywords: ['ring light', 'usb microphone', 'phone tripod', 'capture card', 'stream deck', 'led panel'] },
  'balcony-garden': { name: { en: 'Balcony Garden', he: 'גינת מרפסת' }, keywords: ['plant pots', 'vertical garden', 'solar lights', 'watering can', 'grow bags', 'plant stand'] },
  'sleep-sanctuary': { name: { en: 'Sleep Sanctuary', he: 'מקדש שינה' }, keywords: ['weighted blanket', 'silk pillowcase', 'white noise machine', 'blackout curtains', 'aroma diffuser', 'sleep mask'] },
  'home-office': { name: { en: 'Home Office', he: 'משרד ביתי' }, keywords: ['monitor arm', 'mechanical keyboard', 'ergonomic chair', 'desk lamp', 'cable organizer', 'laptop stand'] },
  'smart-home': { name: { en: 'Smart Home', he: 'בית חכם' }, keywords: ['smart plug', 'motion sensor', 'smart bulb', 'video doorbell', 'smart lock', 'hub'] },
  'kitchen-gadgets': { name: { en: 'Kitchen Gadgets', he: 'גאדג\'טים למטבח' }, keywords: ['mandoline', 'instant read thermometer', 'silicone mat', 'kitchen shears', 'fish spatula', 'microplane'] },
  'travel-gear': { name: { en: 'Travel Gear', he: 'ציוד נסיעות' }, keywords: ['packing cubes', 'travel adapter', 'power bank', 'luggage scale', 'neck pillow', 'toiletry bag'] },
  'camping': { name: { en: 'Camping', he: 'קמפינג' }, keywords: ['portable stove', 'camping lantern', 'sleeping bag', 'camp chair', 'cooler box', 'water filter'] },
  'pet-essentials': { name: { en: 'Pet Essentials', he: 'מוצרים לחיות מחמד' }, keywords: ['pet bed', 'slow feeder', 'water fountain', 'grooming brush', 'nail grinder', 'toy ball'] },
  'car-accessories': { name: { en: 'Car Accessories', he: 'אביזרים לרכב' }, keywords: ['phone mount', 'dash cam', 'seat organizer', 'trash can', 'charger adapter', 'sun shade'] },
  'lighting': { name: { en: 'Lighting', he: 'תאורה' }, keywords: ['led strip', 'floor lamp', 'desk lamp', 'smart bulb', 'night light', 'cabinet light'] },
};

const REGIONS = {
  il: { currency: 'ILS', symbol: '₪', lang: 'he', flag: '🇮🇱' },
  eu: { currency: 'EUR', symbol: '€', lang: 'en', flag: '🇪🇺' },
  us: { currency: 'USD', symbol: '$', lang: 'en', flag: '🇺🇸' },
  uk: { currency: 'GBP', symbol: '£', lang: 'en', flag: '🇬🇧' },
  fr: { currency: 'EUR', symbol: '€', lang: 'fr', flag: '🇫🇷' },
  de: { currency: 'EUR', symbol: '€', lang: 'de', flag: '🇩🇪' },
  es: { currency: 'EUR', symbol: '€', lang: 'es', flag: '🇪🇸' },
  it: { currency: 'EUR', symbol: '€', lang: 'it', flag: '🇮🇹' },
};

async function searchProducts(keyword, region, limit = 3) {
  try {
    const url = `${SHOPLI_BASE_URL}/api/products/search?q=${encodeURIComponent(keyword)}&region=${region}&limit=${limit}`;
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    return data.products || [];
  } catch (e) {
    console.error(`Search failed for ${keyword}:`, e.message);
    return [];
  }
}

function formatPrice(price, region) {
  const r = REGIONS[region];
  if (!r) return price;
  return `${r.symbol}${price.toLocaleString(r.lang === 'he' ? 'he-IL' : 'en-US', { minimumFractionDigits: 2 })}`;
}

function escapeMarkdown(text) {
  return text.replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&');
}

async function generatePost(collectionSlug, region) {
  const collection = COLLECTIONS[collectionSlug];
  const r = REGIONS[region];
  
  if (!collection || !r) {
    throw new Error(`Unknown collection ${collectionSlug} or region ${region}`);
  }

  const name = collection.name[r.lang] || collection.name.en;
  const keyword = collection.keywords[0]; // Use first keyword for search
  
  // Search for products
  const products = await searchProducts(keyword, region, 4);
  
  if (products.length === 0) {
    throw new Error(`No products found for ${keyword} in ${region}`);
  }

  const lang = r.lang;
  const isHebrew = lang === 'he';
  
  // Build message
  let message = '';
  
  if (isHebrew) {
    message += `🛍 *${escapeMarkdown(name)}* — ${r.flag} שופלי\n\n`;
    message += `מצאנו לכם את המוצרים הכי טובים ב‑AliExpress:\n\n`;
  } else {
    message += `🛍 *${escapeMarkdown(name)}* — ${r.flag} Shopli\n\n`;
    message += `We found the best AliExpress picks for you:\n\n`;
  }

  // Product cards
  for (let i = 0; i < Math.min(products.length, 4); i++) {
    const p = products[i];
    const price = formatPrice(p.salePrice || p.originalPrice || 0, region);
    const origPrice = p.originalPrice && p.originalPrice > p.salePrice 
      ? formatPrice(p.originalPrice, region) 
      : null;
    const discount = p.discount && p.discount > 0 ? ` −${p.discount}%` : '';
    const rating = p.rating ? ` ⭐ ${p.rating.toFixed(1)}` : '';
    const sold = p.volume ? ` 📦 ${(p.volume/1000).toFixed(1)}k sold` : '';
    
    const title = escapeMarkdown(p.title || 'Product');
    const link = p.promotionLink || p.productDetailUrl || `${SHOPLI_BASE_URL}/${region}`;
    
    message += `*${i+1}. ${title}*${discount}${rating}${sold}\n`;
    message += `💰 ${price}${origPrice ? ` ~~${origPrice}~~` : ''}\n`;
    message += `[${isHebrew ? 'לרכישה' : 'Buy'}](${link})\n\n`;
  }

  // CTA
  const collectionUrl = `${SHOPLI_BASE_URL}/${region}/collection/${collectionSlug}`;
  if (isHebrew) {
    message += `👉 *${escapeMarkdown('לכל הקולקציה')}*\n`;
    message += `${collectionUrl}\n\n`;
    message += `#Shopli #${escapeMarkdown(name)} #AliExpress`;
  } else {
    message += `👉 *${escapeMarkdown('Full Collection')}*\n`;
    message += `${collectionUrl}\n\n`;
    message += `#Shopli #${escapeMarkdown(name)} #AliExpress`;
  }

  return message;
}

async function sendTelegramMessage(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHANNEL_ID,
      text: message,
      parse_mode: 'MarkdownV2',
      disable_web_page_preview: false,
    }),
  });
  
  const result = await response.json();
  if (!result.ok) {
    throw new Error(`Telegram API error: ${result.description}`);
  }
  return result;
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node scripts/telegram-post.js <collection-slug> <region>');
    console.log('Collections:', Object.keys(COLLECTIONS).join(', '));
    console.log('Regions:', Object.keys(REGIONS).join(', '));
    console.log('\nExample: node scripts/telegram-post.js home-gym eu');
    console.log('Example: node scripts/telegram-post.js coffee-ritual il');
    process.exit(1);
  }

  const [collectionSlug, region] = args;
  
  try {
    console.log(`📝 Generating post for ${collectionSlug} in ${region}...`);
    const message = await generatePost(collectionSlug, region);
    
    console.log('📤 Sending to Telegram...');
    const result = await sendTelegramMessage(message);
    
    console.log('✅ Post sent successfully!');
    console.log(`Message ID: ${result.result.message_id}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();