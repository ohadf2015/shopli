/**
 * "Is this a good buy?" — the one question a Shopli product page answers.
 *
 * Built only from facts we hold ourselves: the price we recorded for this
 * product every day (product_volume_snapshots), its order count over the same
 * days, and the buyer rating AliExpress reports. No list price, no seller
 * "discount", which a seller can set to anything.
 *
 * Pure and deterministic so it can be unit-tested and so the same inputs always
 * give the same verdict.
 */

export interface PricePoint {
  /** YYYY-MM-DD */
  day: string;
  price: number;
  volume: number;
}

export type VerdictKind = 'good' | 'fair' | 'wait' | 'mixed' | 'new';

export interface Verdict {
  kind: VerdictKind;
  /** Today's price compared with its own median over the window, in percent (negative = cheaper). */
  vsMedianPct: number | null;
  median: number | null;
  low: number | null;
  high: number | null;
  /** True when today's price is the lowest we have recorded in the window (within 1%). */
  isLowest: boolean;
  /** Orders per day over the most recent stretch of readings, when we can tell. */
  perDay: number | null;
  readings: number;
  spanDays: number;
}

/** Fewer readings than this and the price story is too thin to judge. */
export const MIN_READINGS = 5;
/** Buyer rating (0–100 positive feedback) under which we warn rather than recommend. */
export const MIXED_RATING = 88;
/** A real move, not rounding noise. */
export const GOOD_BELOW_PCT = -10;
export const WAIT_ABOVE_PCT = 10;

function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
}

export function computeVerdict(input: {
  priceNow: number;
  rating: number;
  history: PricePoint[];
}): Verdict {
  const history = [...input.history]
    .filter((p) => p.price > 0 && /^\d{4}-\d{2}-\d{2}$/.test(p.day))
    .sort((a, b) => a.day.localeCompare(b.day));
  const prices = history.map((p) => p.price);
  const readings = history.length;
  const spanDays = readings > 1 ? daysBetween(history[0].day, history[readings - 1].day) : 0;

  // Orders/day from the last ~7 days of readings: what is selling now, not in August.
  let perDay: number | null = null;
  if (readings > 1) {
    const last = history[readings - 1];
    const from = [...history].reverse().find((p) => daysBetween(p.day, last.day) >= 3 && daysBetween(p.day, last.day) <= 10)
      || history[0];
    const d = daysBetween(from.day, last.day);
    if (d > 0 && last.volume >= from.volume) perDay = Math.round((last.volume - from.volume) / d);
  }

  if (readings < MIN_READINGS) {
    return { kind: 'new', vsMedianPct: null, median: null, low: null, high: null, isLowest: false, perDay, readings, spanDays };
  }

  const med = median(prices);
  const low = Math.min(...prices, input.priceNow);
  const high = Math.max(...prices, input.priceNow);
  const vsMedianPct = Math.round(((input.priceNow - med) / med) * 100);
  const isLowest = input.priceNow <= Math.min(...prices) * 1.01;

  let kind: VerdictKind;
  if (input.rating > 0 && input.rating < MIXED_RATING) kind = 'mixed';
  else if (vsMedianPct <= GOOD_BELOW_PCT || isLowest) kind = 'good';
  else if (vsMedianPct >= WAIT_ABOVE_PCT) kind = 'wait';
  else kind = 'fair';

  return { kind, vsMedianPct, median: med, low, high, isLowest, perDay, readings, spanDays };
}

/**
 * Sparkline points for a fixed-size SVG, oldest left. Gaps in the record stay
 * gaps in time (x is by day, not by reading), so a month without data is not
 * drawn as a cliff in a single step.
 */
export function sparklinePoints(history: PricePoint[], priceNow: number, w: number, h: number, pad = 4): string {
  const pts = [...history].filter((p) => p.price > 0).sort((a, b) => a.day.localeCompare(b.day));
  if (pts.length < 2) return '';
  const first = Date.parse(pts[0].day);
  const lastDay = Date.parse(pts[pts.length - 1].day);
  const span = Math.max(1, lastDay - first);
  const all = [...pts.map((p) => p.price), priceNow];
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const range = hi - lo || 1;
  const x = (t: number) => pad + ((t - first) / span) * (w - pad * 2);
  const y = (p: number) => pad + (1 - (p - lo) / range) * (h - pad * 2);
  return pts.map((p) => `${x(Date.parse(p.day)).toFixed(1)},${y(p.price).toFixed(1)}`).join(' ');
}

type Lang = 'en' | 'he';

const LABELS: Record<VerdictKind, Record<Lang, string>> = {
  good: { en: 'Good time to buy', he: 'זמן טוב לקנות' },
  fair: { en: 'Fair price', he: 'מחיר הוגן' },
  wait: { en: 'Pricier than usual', he: 'יקר מהרגיל' },
  mixed: { en: 'Buyers are mixed', he: 'הקונים חלוקים' },
  new: { en: 'New to our tracking', he: 'חדש במעקב שלנו' },
};

export function verdictLabel(kind: VerdictKind, lang: Lang): string {
  return LABELS[kind][lang];
}

/** One plain sentence on why. `fmt` formats a price in the page's currency. */
export function verdictReason(v: Verdict, lang: Lang, fmt: (n: number) => string): string {
  const he = lang === 'he';
  const days = v.spanDays;
  switch (v.kind) {
    case 'new':
      return he
        ? 'עוד אין לנו מספיק ימים של מחירים כדי לשפוט. בדקו את הדירוג והביקורות.'
        : "We haven't tracked its price long enough to judge yet. Lean on the rating and reviews.";
    case 'mixed':
      return he
        ? 'הדירוג נמוך מהרגיל למוצרים שאנחנו ממליצים עליהם. קראו את הביקורות לפני שקונים.'
        : 'Its buyer rating is lower than the products we usually point to. Read the reviews first.';
    case 'good':
      if (v.isLowest) {
        return he
          ? `המחיר הנמוך ביותר שראינו ב-${days} הימים האחרונים. בדרך כלל ${fmt(v.median!)}.`
          : `The lowest price we've seen in ${days} days. It's usually around ${fmt(v.median!)}.`;
      }
      return he
        ? `${Math.abs(v.vsMedianPct!)}% מתחת למחיר הרגיל שלו (${fmt(v.median!)}) ב-${days} הימים האחרונים.`
        : `${Math.abs(v.vsMedianPct!)}% under its usual ${fmt(v.median!)} over the last ${days} days.`;
    case 'wait':
      return he
        ? `${v.vsMedianPct}% מעל המחיר הרגיל שלו (${fmt(v.median!)}). הוא כבר היה ב-${fmt(v.low!)}.`
        : `${v.vsMedianPct}% above its usual ${fmt(v.median!)}. We've seen it at ${fmt(v.low!)}.`;
    case 'fair':
    default:
      return he
        ? `קרוב למחיר הרגיל שלו (${fmt(v.median!)}). נע בין ${fmt(v.low!)} ל-${fmt(v.high!)}.`
        : `Close to its usual ${fmt(v.median!)}. It has ranged from ${fmt(v.low!)} to ${fmt(v.high!)}.`;
  }
}
