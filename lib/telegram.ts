import type { Pick } from './picks';
import { SITE_URL } from './seo';

/**
 * The daily channel post.
 *
 * There were three copies of this before: two scripts with their own hardcoded
 * 13-collection lists (the site has 78), their own weekday rotation, and links
 * that went straight to AliExpress. Neither was scheduled anywhere, so the
 * channel only posted when someone ran a script by hand.
 *
 * One copy now, fed by lib/picks.ts — the same data the site's own surfaces
 * use — and posted by /api/cron/telegram-daily on a schedule.
 *
 * Every link goes to a Shopli product page: the reviews, the momentum and the
 * quality signals are there, and Telegram renders that page's OG card as the
 * preview for free.
 */

const LANG: Record<string, string> = {
  il: 'he', ru: 'ru', us: 'en', uk: 'en', eu: 'en', fr: 'fr', de: 'de', es: 'es', it: 'it',
};
const FLAG: Record<string, string> = {
  il: '🇮🇱', ru: '🇮🇱', us: '🇺🇸', uk: '🇬🇧', eu: '🇪🇺', fr: '🇫🇷', de: '🇩🇪', es: '🇪🇸', it: '🇮🇹',
};

const COPY: Record<string, {
  header: string;
  reason: Record<Pick['reason'], string>;
  perDay: (n: number) => string;
  surge: (x: string) => string;
  drop: (p: number, d: number) => string;
  rating: (r: number) => string;
  footer: string;
  see: string;
}> = {
  he: {
    header: 'מה זז היום בשופלי',
    reason: { surging: 'מזנק', price_drop: 'ירידת מחיר אמיתית', bestseller: 'רב מכר' },
    perDay: (n) => `${n} נמכרו היום`,
    surge: (x) => `פי ${x} מהקצב הרגיל שלו`,
    drop: (p, d) => `${p}% מתחת למחיר החציוני שלו ב-${d} הימים האחרונים`,
    rating: (r) => `${r}% משוב חיובי`,
    footer: 'כל מוצר נבדק מול דירוג המוכר וכמות ההזמנות — מה שלא עובר, לא נכנס.',
    see: 'לצפייה בשופלי',
  },
  en: {
    header: "What's actually moving on Shopli",
    reason: { surging: 'Surging', price_drop: 'Real price drop', bestseller: 'Best seller' },
    perDay: (n) => `${n} sold today`,
    surge: (x) => `${x}x its usual rate`,
    drop: (p, d) => `${p}% below its own median price over ${d} days`,
    rating: (r) => `${r}% positive feedback`,
    footer: 'Every pick is checked against seller rating and order count — what fails is not shown.',
    see: 'See it on Shopli',
  },
};

const ICON: Record<Pick['reason'], string> = { surging: '🚀', price_drop: '💸', bestseller: '🏆' };

/** MarkdownV2 reserves these; an unescaped one makes Telegram reject the whole message. */
export function escapeMarkdown(text: string): string {
  return String(text).replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&');
}

/** AliExpress titles are keyword soup; cut at a word so the post stays readable. */
export function shortTitle(title: string, max = 70): string {
  const t = String(title).trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const space = cut.lastIndexOf(' ');
  return (space > max * 0.6 ? cut.slice(0, space) : cut).trim() + '…';
}

/**
 * Returns null when there is nothing worth sending. Posting a filler roundup
 * every day regardless is what made the old channel ignorable.
 */
export function buildPicksMessage(
  region: string,
  picks: Pick[],
  { currencySymbol = '', count = 5 }: { currencySymbol?: string; count?: number } = {}
): string | null {
  const chosen = picks.slice(0, count);
  if (!chosen.length) return null;

  const c = COPY[LANG[region] || 'en'] || COPY.en;
  let msg = `${FLAG[region] || '🛍'} *${escapeMarkdown(c.header)}*\n\n`;

  chosen.forEach((p, i) => {
    const facts: string[] = [];
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
    msg += `${escapeMarkdown(`${currencySymbol}${p.price.toFixed(2)}`)} · _${escapeMarkdown(c.reason[p.reason])}_\n`;
    msg += `${escapeMarkdown(facts.join(' · '))}\n`;
    // An inline link, not a bare URL: in MarkdownV2 every reserved character
    // has to be escaped everywhere EXCEPT inside a link's parentheses, and a
    // product URL is full of dots and dashes. One unescaped dot and Telegram
    // rejects the entire message.
    msg += `[${escapeMarkdown(c.see)}](${SITE_URL}/${region}/product/${p.productId})\n\n`;
  });

  return msg + `_${escapeMarkdown(c.footer)}_`;
}

export async function sendTelegramMessage(text: string): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHANNEL_ID;
  if (!token || !chat) return { ok: false, error: 'TELEGRAM_BOT_TOKEN or TELEGRAM_CHANNEL_ID not set' };

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chat,
        text,
        parse_mode: 'MarkdownV2',
        // The first link's preview is the product page's own OG card.
        disable_web_page_preview: false,
      }),
    });
    const json = await res.json();
    return json?.ok ? { ok: true } : { ok: false, error: json?.description || 'telegram rejected the message' };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'telegram request failed' };
  }
}
