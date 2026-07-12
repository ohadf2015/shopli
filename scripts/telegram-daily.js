#!/usr/bin/env node
/**
 * Daily Telegram batch post for Shopli
 * Posts 2-3 curated collections per day with rotation
 * Usage: node scripts/telegram-daily.js [region] [count]
 */

require('dotenv').config({ path: '.env.local' });

const SHOPLI_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://shopli-neon.vercel.app';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHANNEL_ID) {
  console.error('❌ Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHANNEL_ID in env');
  process.exit(1);
}

// Import collections from lib (using dynamic require for TS files)
// For now, inline the collection list
const COLLECTIONS = {
  'home-gym': { name: { en: 'Home Gym Essentials', he: 'ציוד חדר כושר ביתי' }, keywords: ['adjustable dumbbells', 'resistance bands', 'pull up bar', 'yoga mat', 'kettlebell'] },
  'coffee-ritual': { name: { en: 'Coffee Ritual', he: 'טקס קפה' }, keywords: ['burr grinder', 'french press', 'gooseneck kettle', 'coffee scale', 'pour over dripper'] },
  'content-creator': { name: { en: 'Content Creator Kit', he: 'ערכת יוצר תוכן' }, keywords: ['ring light', 'usb microphone', 'phone tripod', 'capture card', 'stream deck'] },
  'balcony-garden': { name: { en: 'Balcony Garden', he: 'גינת מרפסת' }, keywords: ['plant pots', 'vertical planter', 'solar lights', 'watering can', 'grow bags'] },
  'sleep-sanctuary': { name: { en: 'Sleep Sanctuary', he: 'מקדש שינה' }, keywords: ['weighted blanket', 'silk pillowcase', 'white noise machine', 'blackout curtains', 'aroma diffuser'] },
  'home-office': { name: { en: 'Home Office Setup', he: 'משרד ביתי' }, keywords: ['monitor arm', 'mechanical keyboard', 'ergonomic chair', 'desk lamp', 'cable organizer'] },
  'smart-home': { name: { en: 'Smart Home', he: 'בית חכם' }, keywords: ['smart plug', 'motion sensor', 'smart bulb', 'video doorbell', 'smart lock'] },
  'kitchen-gadgets': { name: { en: 'Pro Kitchen Tools', he: 'כלי מטבח מקצועיים' }, keywords: ['mandoline', 'instant read thermometer', 'silicone mat', 'kitchen shears', 'fish spatula'] },
  'travel-gear': { name: { en: 'Travel Essentials', he: 'ציוד נסיעות' }, keywords: ['packing cubes', 'travel adapter', 'power bank', 'luggage scale', 'neck pillow'] },
  'camping': { name: { en: 'Camping Gear', he: 'ציוד קמפינג' }, keywords: ['portable stove', 'camping lantern', 'sleeping bag', 'camp chair', 'cooler box'] },
  'pet-essentials': { name: { en: 'Pet Essentials', he: 'מוצרים לחיות מחמד' }, keywords: ['pet bed', 'slow feeder', 'water fountain', 'grooming brush', 'nail grinder'] },
  'car-accessories': { name: { en: 'Car Accessories', he: 'אביזרים לרכב' }, keywords: ['phone mount', 'dash cam', 'seat organizer', 'trash can', 'charger adapter'] },
  'lighting': { name: { en: 'Lighting', he: 'תאורה' }, keywords: ['led strip', 'floor lamp', 'desk lamp', 'smart bulb', 'night light'] },
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

// Rotating schedule: each day picks different collections
const DAILY_ROTATION = {
  0: ['home-gym', 'coffee-ritual', 'sleep-sanctuary'], // Sunday
  1: ['content-creator', 'home-office', 'smart-home'], // Monday
  2: ['balcony-garden', 'kitchen-gadgets', 'lighting'], // Tuesday
  3: ['travel-gear', 'camping', 'car-accessories'], // Wednesday
  4: ['pet-essentials', 'home-gym', 'coffee-ritual'], // Thursday
  5: ['content-creator', 'balcony-garden', 'sleep-sanctuary'], // Friday
  6: ['home-office', 'kitchen-gadgets', 'travel-gear'], // Saturday
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
  return String(text).replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&');
}

async function generatePost(collectionSlug, region) {
  const collection = COLLECTIONS[collectionSlug];
  const r = REGIONS[region];
  
  if (!collection || !r) {
    throw new Error(`Unknown collection ${collectionSlug} or region ${region}`);
  }

  const name = collection.name[r.lang] || collection.name.en;
  const keyword = collection.keywords[0];
  
  const products = await searchProducts(keyword, region, 4);
  
  if (products.length === 0) {
    throw new Error(`No products found for ${keyword} in ${region}`);
  }

  const lang = r.lang;
  const isHebrew = lang === 'he';
  
  let message = '';
  
  if (isHebrew) {
    message += `🛍 *${escapeMarkdown(name)}* — ${r.flag} שופלי\n\n`;
    message += `מצאנו לכם את המוצרים הכי טובים ב‑AliExpress:\n\n`;
  } else {
    message += `🛍 *${escapeMarkdown(name)}* — ${r.flag} Shopli\n\n`;
    message += `We found the best AliExpress picks for you:\n\n`;
  }

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
  const region = args[0] || 'eu';
  const count = parseInt(args[1]) || 3;
  
  if (!REGIONS[region]) {
    console.error(`❌ Unknown region: ${region}`);
    process.exit(1);
  }

  const today = new Date().getDay(); // 0 = Sunday
  const collections = DAILY_ROTATION[today] || DAILY_ROTATION[0];
  const selected = collections.slice(0, count);

  console.log(`📅 Daily post for ${region} (${selected.length} collections)`);
  console.log(`Collections: ${selected.join(', ')}`);

  for (const slug of selected) {
    try {
      console.log(`📝 Generating: ${slug}...`);
      const message = await generatePost(slug, region);
      
      console.log(`📤 Sending...`);
      const result = await sendTelegramMessage(message);
      
      console.log(`✅ Sent: ${slug} (msg_id: ${result.result.message_id})`);
      
      // Rate limit: 1 msg/sec
      await new Promise(r => setTimeout(r, 1100));
    } catch (error) {
      console.error(`❌ Failed ${slug}:`, error.message);
    }
  }

  console.log('🎉 Daily batch complete!');
}

main();