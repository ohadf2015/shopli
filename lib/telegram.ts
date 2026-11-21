import type { Pick } from './picks';
import { SITE_URL } from './seo';
import { estimateLandedCost } from './landed-cost';
import { isPromotionLink } from './aliexpress';

/**
 * The daily channel posts, fed by lib/picks.ts (the same data the site uses)
 * and sent by /api/cron/telegram-daily. Each product is its own photo post with
 * a tracked AliExpress button and a button to its Shopli page.
 */

const LANG: Record<string, string> = {
  il: 'he', ru: 'ru', us: 'en', uk: 'en', eu: 'en', fr: 'fr', de: 'de', es: 'es', it: 'it',
};

const COPY: Record<string, {
  reason: Record<Pick['reason'], string>;
  perDay: (n: string) => string;
  surge: (x: string) => string;
  drop: (p: number, d: number) => string;
  usually: (price: string) => string;
  rating: (r: number) => string;
  reviews: (n: string) => string;
  dutyFree: string;
  buy: string;
  see: string;
}> = {
  he: {
    reason: { surging: 'מזנק עכשיו', price_drop: 'ירידת מחיר אמיתית', bestseller: 'רב מכר' },
    perDay: (n) => `${n} נמכרים ביום`,
    surge: (x) => `פי ${x} מהקצב הרגיל`,
    drop: (p, d) => `${p}% מתחת למחיר הרגיל שלו ב-${d} הימים האחרונים`,
    usually: (price) => `בדרך כלל ${price}`,
    rating: (r) => `${r}% משוב חיובי`,
    reviews: (n) => `${n} ביקורות`,
    dutyFree: 'מתחת ל-$75, בלי מע״מ ומכס',
    buy: '🛒 לקנייה באליאקספרס',
    see: '📊 מחיר וביקורות בשופלי',
  },
  en: {
    reason: { surging: 'Selling fast', price_drop: 'Real price drop', bestseller: 'Best seller' },
    perDay: (n) => `${n} sold a day`,
    surge: (x) => `${x}x its usual pace`,
    drop: (p, d) => `${p}% below its usual price over the last ${d} days`,
    usually: (price) => `usually ${price}`,
    rating: (r) => `${r}% positive`,
    reviews: (n) => `${n} reviews`,
    dutyFree: '',
    buy: '🛒 Buy on AliExpress',
    see: '📊 Price and reviews on Shopli',
  },
};

const ICON: Record<Pick['reason'], string> = { surging: '🚀', price_drop: '📉', bestseller: '🏆' };

/** Telegram HTML mode only needs these three escaped. */
export function escapeHtml(text: string): string {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** AliExpress titles are keyword soup; cut at a word so the post stays readable. */
export function shortTitle(title: string, max = 70): string {
  const t = String(title).trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const space = cut.lastIndexOf(' ');
  return (space > max * 0.6 ? cut.slice(0, space) : cut).trim() + '…';
}

export interface PickPost {
  photo: string;
  caption: string;
  buttons: Array<{ text: string; url: string }>;
}

/**
 * One photo post per product, the way deal channels people actually follow
 * look: picture, a few lines of facts, and buttons instead of raw links.
 */
export function buildPickPost(
  region: string,
  p: Pick,
  { currencySymbol = '', reviews, buyLink, title }: {
    currencySymbol?: string;
    /** Written-review count from lib/review-store.ts; omitted rather than printed as 0. */
    reviews?: number;
    /** A tracked s.click promotion link; without one the post has only the Shopli button. */
    buyLink?: string;
    /** Localised title (Hebrew for il) when we have one. */
    title?: string;
  } = {}
): PickPost {
  const lang = LANG[region] === 'he' ? 'he' : 'en';
  const c = COPY[lang];
  const locale = lang === 'he' ? 'he-IL' : 'en-US';
  const money = (n: number) => `${currencySymbol}${n.toFixed(2)}`;

  const lines = [
    `${ICON[p.reason]} <b>${escapeHtml(c.reason[p.reason])}</b>`,
    `<b>${escapeHtml(shortTitle(title || p.title, 75))}</b>`,
    '',
  ];

  let priceLine = `💰 <b>${escapeHtml(money(p.price))}</b>`;
  if (p.reason === 'price_drop' && p.priceMedian && p.priceMedian > p.price) {
    priceLine += ` · ${escapeHtml(c.usually(money(p.priceMedian)))}`;
  }
  lines.push(priceLine);

  if (p.reason === 'surging') {
    lines.push(`🔥 ${escapeHtml(`${c.perDay(Math.round(p.recentPerDay).toLocaleString(locale))}, ${c.surge(p.surge.toFixed(1))}`)}`);
  } else if (p.reason === 'price_drop') {
    lines.push(`📉 ${escapeHtml(c.drop(p.dropPct, p.spanDays))}`);
  } else if (p.perDay >= 1) {
    lines.push(`🔥 ${escapeHtml(c.perDay(Math.round(p.perDay).toLocaleString(locale)))}`);
  }

  const social: string[] = [];
  if (p.rating > 0) social.push(c.rating(Math.round(p.rating)));
  if (reviews && reviews > 0) social.push(c.reviews(reviews.toLocaleString(locale)));
  if (social.length) lines.push(`⭐ ${escapeHtml(social.join(' · '))}`);

  if (region === 'il' && c.dutyFree) {
    const landed = estimateLandedCost({ price: p.price, currency: p.currency });
    if (landed?.dutyFree) lines.push(`🇮🇱 ${escapeHtml(c.dutyFree)}`);
  }

  const buttons: PickPost['buttons'] = [];
  if (buyLink && isPromotionLink(buyLink)) buttons.push({ text: c.buy, url: buyLink });
  buttons.push({ text: c.see, url: `${SITE_URL}/${region}/product/${p.productId}` });

  return { photo: p.imageUrl, caption: lines.join('\n'), buttons };
}

/**
 * `chatId` is required rather than defaulting to TELEGRAM_CHANNEL_ID: the
 * caller loops regions, and a default would have posted every region's message
 * into the same channel — nine posts in eight languages, once a day, on a live
 * public channel.
 */
async function callTelegram(method: string, body: Record<string, unknown>): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || !body.chat_id) return { ok: false, error: 'TELEGRAM_BOT_TOKEN or chat id not set' };
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    return json?.ok ? { ok: true } : { ok: false, error: json?.description || 'telegram rejected the message' };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'telegram request failed' };
  }
}

/** Sends the photo post; if Telegram can't fetch the image, the same post goes out as text. */
export async function sendPickPost(post: PickPost, chatId: string): Promise<{ ok: boolean; error?: string }> {
  const reply_markup = { inline_keyboard: post.buttons.map((b) => [b]) };
  const photo = post.photo
    ? await callTelegram('sendPhoto', { chat_id: chatId, photo: post.photo, caption: post.caption, parse_mode: 'HTML', reply_markup })
    : { ok: false, error: 'no image' };
  if (photo.ok) return photo;
  const text = await callTelegram('sendMessage', {
    chat_id: chatId,
    text: post.caption,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    reply_markup,
  });
  return text.ok ? text : { ok: false, error: `${photo.error}; text: ${text.error}` };
}
