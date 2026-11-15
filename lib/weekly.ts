/**
 * The Shopli Weekly — one issue a week of what is actually selling and what
 * actually got cheaper, computed from our own daily snapshots.
 *
 * Every number on the page comes from product_volume_snapshots (the price and
 * lifetime order count we record per product per day, lib/trend-velocity.ts)
 * and feed_products (title, image, rating). Nothing is quoted against a seller's
 * list price: a "price drop" here means cheaper than the product's OWN usual
 * price over the last 60 days, the same yardstick the PDP verdict uses
 * (lib/verdict.ts) and the picks use (lib/picks.ts).
 *
 * An issue is a pure function of the snapshots up to its Sunday, so any past
 * issue can be rebuilt exactly from history. That is why there is no content
 * file to commit each week: the page publishes itself every Sunday, and the
 * archive is every Sunday since FIRST_ISSUE.
 *
 * Measured 2026-11-15 (region il): 618 products priced that day, 9 of them 8%+
 * under their 60-day median and 5 at 10%+. Real drops are rare, which is the
 * point of publishing them: the sticker "-60%" on most listings is not one.
 */

import { titleTokenOverlap } from './similar';

/** Regions the weekly is written for: the two languages it has copy in. */
export const WEEKLY_REGIONS = ['il', 'eu', 'us', 'uk'] as const;
export type WeeklyRegion = (typeof WEEKLY_REGIONS)[number];

export function isWeeklyRegion(r: string): r is WeeklyRegion {
  return (WEEKLY_REGIONS as readonly string[]).includes(r);
}

/** The first Sunday this page existed. Older Sundays are not offered as issues. */
export const FIRST_ISSUE = '2026-11-15';

/** Price history the "usual price" is measured over. */
export const PRICE_WINDOW_DAYS = 60;
/** Fewer priced days than this and a product's "usual price" is not trustworthy. */
export const MIN_PRICE_READINGS = 10;
/** A real drop: at least this far under its own median. Matches lib/picks.ts. */
export const DROP_MIN_PCT = 10;
/** Within this of the lowest price we recorded counts as "its lowest". Matches lib/verdict.ts. */
export const LOWEST_TOLERANCE = 0.01;
/** Sellers list: the bar the weekly routine was briefed with (94%+ positive, 1,000+ orders). */
export const SELLER_MIN_RATING = 94;
export const SELLER_MIN_ORDERS = 1000;
/** Drops list: the catalogue quality floor (lib/quality.ts) and some actual buying. */
export const DROP_MIN_RATING = 90;
export const DROP_MIN_PER_DAY = 1;
/** Category movers need enough products behind them to mean anything. */
export const CATEGORY_MIN_PRODUCTS = 3;
export const CATEGORY_MIN_ORDERS = 200;

export interface Reading {
  /** YYYY-MM-DD */
  day: string;
  volume: number;
  price: number | null;
}

export interface ProductMeta {
  title: string;
  currency: string;
  imageUrl: string;
  rating: number;
  category: string;
}

export interface WeeklySeller {
  id: string;
  title: string;
  imageUrl: string;
  currency: string;
  category: string;
  rating: number;
  volume: number;
  price: number;
  /** Orders per day across the issue's week. */
  perDay: number;
  /** Orders added during the week. */
  weekOrders: number;
  spanDays: number;
}

export interface WeeklyDrop {
  id: string;
  title: string;
  imageUrl: string;
  currency: string;
  category: string;
  rating: number;
  volume: number;
  price: number;
  usual: number;
  dropPct: number;
  low: number;
  lowDay: string;
  isLowest: boolean;
  readings: number;
  perDay: number;
}

export interface WeeklyCategory {
  category: string;
  products: number;
  weekOrders: number;
  prevWeekOrders: number;
  /** Week-over-week change in orders, percent. */
  changePct: number;
}

export interface WeeklyIssue {
  region: string;
  /** The Sunday this issue is for. */
  issueDate: string;
  /** The latest snapshot day the issue uses (normally the Sunday itself). */
  asOf: string;
  /** The snapshot day the week is measured from. */
  weekFrom: string;
  sellers: WeeklySeller[];
  drops: WeeklyDrop[];
  categories: WeeklyCategory[];
  stats: {
    /** Products with a price on the issue's day. */
    priced: number;
    /** Of those, products with enough history to judge "usual". */
    judged: number;
    /** Of those, products at least DROP_MIN_PCT under usual (before quality gates). */
    realDrops: number;
    /** Of those, products dearer than usual by DROP_MIN_PCT or more. */
    dearer: number;
  };
}

const DAY = 86400000;

export function addDays(day: string, n: number): string {
  return new Date(Date.parse(`${day}T00:00:00Z`) + n * DAY).toISOString().slice(0, 10);
}

export function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / DAY);
}

export function isSunday(day: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(day) && new Date(`${day}T00:00:00Z`).getUTCDay() === 0;
}

/** The latest Sunday on or before `day`. */
export function sundayOnOrBefore(day: string): string {
  const d = new Date(`${day}T00:00:00Z`);
  return addDays(day, -d.getUTCDay());
}

/** Every issue date from FIRST_ISSUE to the Sunday on or before `today`, newest first. */
export function issueDates(today: string): string[] {
  const last = sundayOnOrBefore(today);
  const out: string[] = [];
  for (let d = last; d >= FIRST_ISSUE; d = addDays(d, -7)) out.push(d);
  return out;
}

/** A valid archive date: a Sunday, not before FIRST_ISSUE, not after the latest issue. */
export function isIssueDate(day: string, today: string): boolean {
  return isSunday(day) && day >= FIRST_ISSUE && day <= sundayOnOrBefore(today);
}

function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/** The reading on `day`, or the nearest one before it within `slack` days. */
function readingAtOrBefore(sorted: Reading[], day: string, slack: number): Reading | null {
  for (let i = sorted.length - 1; i >= 0; i--) {
    const r = sorted[i];
    if (r.day > day) continue;
    return daysBetween(r.day, day) <= slack ? r : null;
  }
  return null;
}

const round1 = (n: number) => Math.round(n * 10) / 10;
const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Collapse near-duplicate listings. AliExpress lists one product many times,
 * and the copies often share one order counter: the IL sellers list for
 * 2026-11-15 had the same 240W cable twice at 171k orders, and the same
 * Toocki cable twice with identical counts. Same week's orders, or titles that
 * overlap like lib/ranking.ts's dedupe, count as one product; the first (best)
 * one is kept.
 */
export function dedupeListings<T extends { title: string; volume: number; weekOrders?: number }>(ranked: T[]): T[] {
  const out: T[] = [];
  for (const p of ranked) {
    const dup = out.some(
      (k) =>
        (k.volume === p.volume && (k.weekOrders ?? -1) === (p.weekOrders ?? -2)) ||
        titleTokenOverlap(k.title, p.title) >= 0.45
    );
    if (!dup) out.push(p);
  }
  return out;
}

export interface BuildOptions {
  sellerLimit?: number;
  dropLimit?: number;
  categoryLimit?: number;
}

/**
 * Build one issue from raw readings. Pure and deterministic: same readings in,
 * same issue out, ties broken by product id.
 */
export function buildWeeklyIssue(
  region: string,
  issueDate: string,
  series: Map<string, Reading[]>,
  meta: Map<string, ProductMeta>,
  { sellerLimit = 10, dropLimit = 8, categoryLimit = 5 }: BuildOptions = {}
): WeeklyIssue {
  // The issue's day is the latest snapshot on or before the Sunday. A missed
  // cron (it happens: 2026-11-08 has no rows) should not blank the issue.
  let asOf = '';
  for (const rs of series.values()) {
    for (const r of rs) if (r.day <= issueDate && r.day > asOf) asOf = r.day;
  }
  const empty: WeeklyIssue = {
    region,
    issueDate,
    asOf: asOf || issueDate,
    weekFrom: addDays(asOf || issueDate, -7),
    sellers: [],
    drops: [],
    categories: [],
    stats: { priced: 0, judged: 0, realDrops: 0, dearer: 0 },
  };
  if (!asOf || daysBetween(asOf, issueDate) > 3) return empty;

  const weekTarget = addDays(asOf, -7);
  const prevTarget = addDays(asOf, -14);
  const windowStart = addDays(asOf, -PRICE_WINDOW_DAYS);

  const sellers: WeeklySeller[] = [];
  const drops: WeeklyDrop[] = [];
  const cats = new Map<string, { products: number; week: number; prev: number }>();
  const stats = { priced: 0, judged: 0, realDrops: 0, dearer: 0 };
  let weekFrom = '';

  const ids = [...series.keys()].sort();
  for (const id of ids) {
    const m = meta.get(id);
    const sorted = series
      .get(id)!
      .filter((r) => /^\d{4}-\d{2}-\d{2}$/.test(r.day) && r.day <= asOf && r.day >= windowStart)
      .sort((a, b) => a.day.localeCompare(b.day));
    const now = sorted.length ? sorted[sorted.length - 1] : null;
    if (!now || now.day !== asOf) continue;

    // --- this week's orders -------------------------------------------------
    // Baseline: the reading 7 days back, or up to 2 days earlier if that day
    // is missing. Never later — a shorter span would inflate "per day" less
    // honestly than a slightly longer one deflates it.
    const base = readingAtOrBefore(sorted, weekTarget, 2);
    let perDay = 0;
    let weekOrders = 0;
    let spanDays = 0;
    if (base && now.volume >= base.volume) {
      spanDays = daysBetween(base.day, now.day);
      weekOrders = now.volume - base.volume;
      perDay = spanDays > 0 ? weekOrders / spanDays : 0;
      if (!weekFrom || base.day < weekFrom) weekFrom = base.day;

      const prev = readingAtOrBefore(sorted, prevTarget, 2);
      if (m && m.category && prev && base.volume >= prev.volume) {
        const prevSpan = daysBetween(prev.day, base.day);
        if (prevSpan > 0) {
          const c = cats.get(m.category) || { products: 0, week: 0, prev: 0 };
          c.products++;
          // Normalised to 7 days so a 9-day baseline does not read as growth.
          c.week += (weekOrders / spanDays) * 7;
          c.prev += ((base.volume - prev.volume) / prevSpan) * 7;
          cats.set(m.category, c);
        }
      }
    }

    // --- price against its own usual ---------------------------------------
    if (now.price && now.price > 0) {
      stats.priced++;
      const priced = sorted.filter((r) => r.price && r.price > 0) as Array<Reading & { price: number }>;
      if (priced.length >= MIN_PRICE_READINGS) {
        stats.judged++;
        const usual = median(priced.map((r) => r.price));
        const dropPct = Math.round((1 - now.price / usual) * 100);
        if (dropPct >= DROP_MIN_PCT) stats.realDrops++;
        if (dropPct <= -DROP_MIN_PCT) stats.dearer++;
        const before = priced.filter((r) => r.day < asOf);
        let low = now.price;
        let lowDay = now.day;
        for (const r of before) {
          if (r.price < low) {
            low = r.price;
            lowDay = r.day;
          }
        }
        const priorLow = before.length ? Math.min(...before.map((r) => r.price)) : now.price;
        if (
          m &&
          dropPct >= DROP_MIN_PCT &&
          (m.rating === 0 || m.rating >= DROP_MIN_RATING) &&
          perDay >= DROP_MIN_PER_DAY
        ) {
          drops.push({
            id,
            title: m.title,
            imageUrl: m.imageUrl,
            currency: m.currency,
            category: m.category,
            rating: m.rating,
            volume: now.volume,
            price: now.price,
            usual: round2(usual),
            dropPct,
            low,
            lowDay,
            isLowest: now.price <= priorLow * (1 + LOWEST_TOLERANCE),
            readings: priced.length,
            perDay: round1(perDay),
          });
        }
      }
    }

    if (m && spanDays > 0 && m.rating >= SELLER_MIN_RATING && now.volume >= SELLER_MIN_ORDERS && now.price) {
      sellers.push({
        id,
        title: m.title,
        imageUrl: m.imageUrl,
        currency: m.currency,
        category: m.category,
        rating: m.rating,
        volume: now.volume,
        price: now.price,
        perDay: round1(perDay),
        weekOrders,
        spanDays,
      });
    }
  }

  const usable = <T extends { title: string; imageUrl: string }>(p: T) => !!p.title && !!p.imageUrl;

  const topSellers = dedupeListings(
    sellers.filter(usable).sort((a, b) => b.perDay - a.perDay || a.id.localeCompare(b.id))
  ).slice(0, sellerLimit);

  const topDrops = dedupeListings(
    drops.filter(usable).sort((a, b) => b.dropPct - a.dropPct || b.perDay - a.perDay || a.id.localeCompare(b.id))
  ).slice(0, dropLimit);

  const categories: WeeklyCategory[] = [...cats.entries()]
    .filter(([, c]) => c.products >= CATEGORY_MIN_PRODUCTS && c.week + c.prev >= CATEGORY_MIN_ORDERS && c.prev > 0)
    .map(([category, c]) => ({
      category,
      products: c.products,
      weekOrders: Math.round(c.week),
      prevWeekOrders: Math.round(c.prev),
      changePct: Math.round((c.week / c.prev - 1) * 100),
    }))
    .sort((a, b) => b.changePct - a.changePct || a.category.localeCompare(b.category))
    .slice(0, categoryLimit);

  return {
    region,
    issueDate,
    asOf,
    weekFrom: weekFrom || weekTarget,
    sellers: topSellers,
    drops: topDrops,
    categories,
    stats,
  };
}

// ---------------------------------------------------------------------------
// Copy. Every sentence is built from the issue's own numbers; nothing here
// may claim more than the data shows.
// ---------------------------------------------------------------------------

type Lang = 'en' | 'he';

export function weeklyLang(region: string): Lang {
  return region === 'il' ? 'he' : 'en';
}

export function formatDay(day: string, lang: Lang): string {
  return new Date(`${day}T12:00:00Z`).toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function shortDay(day: string, lang: Lang): string {
  return new Date(`${day}T12:00:00Z`).toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });
}

export function weeklyTitle(issue: WeeklyIssue, lang: Lang): string {
  return lang === 'he'
    ? `שופלי השבועי: מה נמכר ומה באמת ירד במחיר (${formatDay(issue.issueDate, lang)})`
    : `The Shopli Weekly: what's selling and what really got cheaper (${formatDay(issue.issueDate, lang)})`;
}

export function weeklyDescription(issue: WeeklyIssue, lang: Lang): string {
  const top = issue.sellers[0];
  const n = issue.drops.length;
  if (lang === 'he') {
    return [
      top ? `הנמכר ביותר השבוע: ${shortTitle(top.title, 50)}, כ-${fmtInt(top.perDay, lang)} הזמנות ביום.` : '',
      n ? `${n} מוצרים זולים השבוע ב-10% ומעלה מהמחיר הרגיל שלהם.` : 'השבוע אין ירידות מחיר אמיתיות של 10% ומעלה.',
      'הכל מנתוני המחיר וההזמנות שאנחנו רושמים כל יום.',
    ]
      .filter(Boolean)
      .join(' ');
  }
  return [
    top ? `Top seller this week: ${shortTitle(top.title, 50)}, about ${fmtInt(top.perDay, lang)} orders a day.` : '',
    n ? `${n} products are 10%+ under their own usual price.` : 'No real 10%+ price drops this week.',
    'All from the prices and orders we record every day.',
  ]
    .filter(Boolean)
    .join(' ');
}

export function shortTitle(t: string, max = 60): string {
  const s = String(t || '').replace(/\s+/g, ' ').trim();
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const sp = cut.lastIndexOf(' ');
  return `${(sp > max * 0.6 ? cut.slice(0, sp) : cut).replace(/[,.;:\-–\s]+$/, '')}…`;
}

export function fmtInt(n: number, lang: Lang): string {
  return Math.round(n).toLocaleString(lang === 'he' ? 'he-IL' : 'en-GB');
}

export function fmtMoney(n: number, currency: string, lang: Lang): string {
  const c = /^[A-Z]{3}$/.test(currency) ? currency : 'USD';
  try {
    return new Intl.NumberFormat(lang === 'he' ? 'he-IL' : 'en-GB', { style: 'currency', currency: c }).format(n);
  } catch {
    return `${c} ${n.toFixed(2)}`;
  }
}

/**
 * The editor's note: three or four plain sentences, each one a fact the issue
 * itself shows. Returned as separate sentences so the page can lay them out.
 */
export function weeklyInsights(issue: WeeklyIssue, lang: Lang): string[] {
  const he = lang === 'he';
  const out: string[] = [];
  const { stats } = issue;

  if (stats.judged > 0) {
    const pct = Math.round((stats.realDrops / stats.judged) * 100);
    out.push(
      he
        ? `מתוך ${fmtInt(stats.judged, lang)} מוצרים שיש לנו עליהם לפחות ${MIN_PRICE_READINGS} ימי מחיר, רק ${fmtInt(stats.realDrops, lang)} (${pct}%) זולים היום ב-10% ומעלה מהמחיר הרגיל שלהם. מדבקת ה"הנחה" באליאקספרס נמדדת מול מחיר מחירון שהמוכר קובע, לא מול מה שהמוצר באמת עלה.`
        : `Of the ${fmtInt(stats.judged, lang)} products we have at least ${MIN_PRICE_READINGS} days of prices for, only ${fmtInt(stats.realDrops, lang)} (${pct}%) are 10% or more under their own usual price today. AliExpress "discount" stickers are measured against a list price the seller sets, not against what the item actually cost.`
    );
    if (stats.dearer > 0) {
      out.push(
        he
          ? `${fmtInt(stats.dearer, lang)} מוצרים יקרים היום ב-10% ומעלה מהרגיל. אם בעמוד של מוצר שאתם רוצים כתוב "יקר מהרגיל", שווה לחכות.`
          : `${fmtInt(stats.dearer, lang)} are 10% or more above their usual price. If a product page you're looking at says "Pricier than usual", it's worth waiting.`
      );
    }
  }

  const rising = issue.categories.find((c) => c.changePct > 0);
  if (rising) {
    out.push(
      he
        ? `הקטגוריה שעלתה הכי הרבה: ${rising.category}, עם כ-${fmtInt(rising.weekOrders, lang)} הזמנות השבוע מול ${fmtInt(rising.prevWeekOrders, lang)} בשבוע שלפני (${rising.changePct > 0 ? '+' : ''}${rising.changePct}%).`
        : `Fastest-rising category: ${rising.category}, with about ${fmtInt(rising.weekOrders, lang)} orders this week against ${fmtInt(rising.prevWeekOrders, lang)} the week before (+${rising.changePct}%).`
    );
  }

  const deepest = issue.drops[0];
  if (deepest) {
    const lowNote = deepest.isLowest
      ? he
        ? 'וזה המחיר הנמוך ביותר שרשמנו לו'
        : "and it's the lowest we've recorded"
      : he
        ? `אבל ב-${shortDay(deepest.lowDay, lang)} המחיר היה ${fmtMoney(deepest.low, deepest.currency, lang)}`
        : `though it was ${fmtMoney(deepest.low, deepest.currency, lang)} on ${shortDay(deepest.lowDay, lang)}`;
    out.push(
      he
        ? `הירידה הגדולה: ${shortTitle(deepest.title, 50)}, ${fmtMoney(deepest.price, deepest.currency, lang)} במקום ${fmtMoney(deepest.usual, deepest.currency, lang)} בדרך כלל, ${lowNote}.`
        : `Biggest real drop: ${shortTitle(deepest.title, 50)}, ${fmtMoney(deepest.price, deepest.currency, lang)} against its usual ${fmtMoney(deepest.usual, deepest.currency, lang)}, ${lowNote}.`
    );
  }

  return out;
}

/** Today's date as the database sees it (UTC), for picking the latest issue. */
export function todayUtc(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}
