#!/usr/bin/env node
/**
 * Daily Telegram post for Shopli.
 *
 * This script used to be a second, drifting copy of the site: 13 hardcoded
 * collections (the site has 78), a fixed weekday rotation that said "Tuesday
 * means balcony-garden" no matter what was actually selling, and links that
 * went straight to AliExpress — so the channel sent its audience past the
 * product pages, the reviews and the site entirely.
 *
 * Now it reads /api/products/picks, the same endpoint the site's own rails use.
 * The picks come from our own daily price and order-count snapshots
 * (lib/picks.ts), so a product is in the post because it is selling unusually
 * fast or is genuinely below its own median price — never because of what day
 * of the week it is. Every link goes to the Shopli product page.
 *
 * Usage: node scripts/telegram-daily.js [region] [count]
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://tryshopli.com').replace(/\/$/, '');

const LANG = {
  il: 'he', ru: 'ru', us: 'en', uk: 'en', eu: 'en', fr: 'fr', de: 'de', es: 'es', it: 'it',
};
const FLAG = {
  il: '🇮🇱', ru: '🇮🇱', us: '🇺🇸', uk: '🇬🇧', eu: '🇪🇺', fr: '🇫🇷', de: '🇩🇪', es: '🇪🇸', it: '🇮🇹',
};

const COPY = {
  he: {
    header: 'מה זז היום בשופלי',
    surging: 'מזנק',
    price_drop: 'ירידת מחיר אמיתית',
    bestseller: 'רב מכר',
    perDay: (n) => `${n} נמכרו היום`,
    surge: (x) => `פי ${x} מהקצב הרגיל שלו`,
    drop: (p, d) => `${p}% מתחת למחיר החציוני שלו ב-${d} הימים האחרונים`,
    rating: (r) => `${r}% משוב חיובי`,
    footer: 'כל המוצרים נבדקו מול דירוג המוכר וכמות ההזמנות — מה שלא עובר, לא נכנס.',
  },
  en: {
    header: "What's actually moving on Shopli",
    surging: 'Surging',
    price_drop: 'Real price drop',
    bestseller: 'Best seller',
    perDay: (n) => `${n} sold today`,
    surge: (x) => `${x}x its usual rate`,
    drop: (p, d) => `${p}% below its own median price over ${d} days`,
    rating: (r) => `${r}% positive feedback`,
    footer: 'Every pick is checked against seller rating and order count — what fails is not shown.',
  },
};
const copy = (lang) => COPY[lang] || COPY.en;

const ICON = { surging: '🚀', price_drop: '💸', bestseller: '🏆' };

/** AliExpress titles are keyword soup; cut at a word so the post stays readable. */
function shortTitle(title, max = 70) {
  const t = String(title).trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const space = cut.lastIndexOf(' ');
  return (space > max * 0.6 ? cut.slice(0, space) : cut).trim() + '…';
}

function escapeMarkdown(text) {
  return String(text).replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&');
}

async function fetchPicks(region, limit) {
  const url = `${SITE}/api/products/picks?region=${region}&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`picks endpoint ${res.status}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'picks endpoint failed');
  return data;
}

/**
 * One post. The reason a product is here is stated in the post, with the number
 * behind it — that is the whole point of computing it rather than rotating a
 * list, and it is what makes the channel worth subscribing to.
 */
function buildMessage(region, data, count) {
  const lang = LANG[region] || 'en';
  const c = copy(lang);
  const picks = data.picks.slice(0, count);
  if (!picks.length) return null;

  const sym = data.currencySymbol || '';
  let msg = `${FLAG[region] || '🛍'} *${escapeMarkdown(c.header)}*\n\n`;

  picks.forEach((p, i) => {
    const facts = [];
    if (p.reason === 'surging') {
      facts.push(c.perDay(Math.round(p.recentPerDay)));
      facts.push(c.surge(p.surge.toFixed(1)));
    } else if (p.reason === 'price_drop') {
      facts.push(c.drop(p.dropPct, p.spanDays));
    } else {
      facts.push(c.perDay(Math.round(p.perDay)));
    }
    if (p.rating > 0) facts.push(c.rating(Math.round(p.rating)));

    msg += `${ICON[p.reason]} *${i + 1}\\. ${escapeMarkdown(shortTitle(p.title))}*\n`;
    msg += `${escapeMarkdown(`${sym}${p.price.toFixed(2)}`)} · _${escapeMarkdown(c[p.reason])}_\n`;
    msg += `${escapeMarkdown(facts.join(' · '))}\n`;
    msg += `${p.url}\n\n`;
  });

  msg += `_${escapeMarkdown(c.footer)}_`;
  return msg;
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
      // The first link's preview is the product page's own OG card, which the
      // site already renders with image, title and price.
      disable_web_page_preview: false,
    }),
  });
  const result = await response.json();
  if (!result.ok) throw new Error(`Telegram API error: ${result.description}`);
  return result;
}

async function main() {
  const [region = 'il', countArg] = process.argv.slice(2);
  const count = parseInt(countArg, 10) || 5;
  const dryRun = process.env.DRY_RUN === '1';

  if (!dryRun && (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHANNEL_ID)) {
    console.error('❌ Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHANNEL_ID in env');
    process.exit(1);
  }

  const data = await fetchPicks(region, Math.max(count, 12));
  const message = buildMessage(region, data, count);
  if (!message) {
    // No picks means the snapshot cron has not produced two readings yet.
    // Posting a filler roundup is what made the old channel worthless.
    console.log(`⏭  No picks for ${region} today — nothing worth posting.`);
    return;
  }

  if (dryRun) {
    console.log(message);
    return;
  }
  const result = await sendTelegramMessage(message);
  console.log(`✅ Sent ${data.picks.length ? count : 0} picks for ${region} (msg_id: ${result.result.message_id})`);
}

if (require.main === module) {
  main().catch((e) => {
    console.error('❌', e.message);
    process.exit(1);
  });
}

module.exports = { buildMessage, escapeMarkdown };
