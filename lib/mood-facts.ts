/**
 * Facts for a mood board page, computed from the live picks the page shows.
 *
 * A board's hand-written copy used to carry its prices too ("Under €30",
 * "Complete look: ~€25-40"), typed once in euros and shown in every region,
 * so the US page priced a costume in euros and none of it moved with the
 * listings. Here the name stays hand-written and every number comes from the
 * products on the page.
 */

export interface KitProduct {
  id: string;
  title: string;
  price: number;
  rating?: number; // 0-100, AliExpress positive-feedback rate
  reviewCount?: number;
  volume?: number; // lifetime orders
}

export interface KitSlot {
  caption: string;
  products: KitProduct[];
}

export interface KitFacts {
  /** Slots that have at least one priced listing. */
  pieces: number;
  /** Sum of each slot's first listing, the one the page leads with. */
  pickTotal: number;
  /** Sum of each slot's cheapest listing. */
  cheapestTotal: number;
  /** Orders across every listing shown. */
  totalOrders: number;
}

const priced = (p: KitProduct) => !!p?.id && Number.isFinite(p.price) && p.price > 0;

export function kitFacts(slots: KitSlot[]): KitFacts | null {
  const filled = slots.map((s) => (s.products || []).filter(priced)).filter((list) => list.length > 0);
  // Fewer than three pieces is not a kit worth summing up.
  if (filled.length < 3) return null;
  const seen = new Set<string>();
  let totalOrders = 0;
  for (const list of filled) {
    for (const p of list) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      totalOrders += p.volume || 0;
    }
  }
  return {
    pieces: filled.length,
    pickTotal: round2(filled.reduce((s, list) => s + list[0].price, 0)),
    cheapestTotal: round2(filled.reduce((s, list) => s + Math.min(...list.map((p) => p.price)), 0)),
    totalOrders,
  };
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export type PickReasonKind = 'most-ordered' | 'top-rated' | 'cheapest';

export interface PickReason {
  /** Every superlative that is literally true of the first listing among those shown. */
  kinds: PickReasonKind[];
  stars: string | null;
  orders: number;
  /** How many listings the claim is measured against. */
  of: number;
}

/** Why the slot's first listing leads: only claims the shown listings back up. */
export function pickReason(products: KitProduct[]): PickReason | null {
  const list = (products || []).filter(priced);
  if (list.length === 0) return null;
  const [lead] = list;
  const kinds: PickReasonKind[] = [];
  if (list.length > 1) {
    if (list.every((p) => (lead.volume || 0) >= (p.volume || 0)) && (lead.volume || 0) > 0) kinds.push('most-ordered');
    if (list.every((p) => (lead.rating || 0) >= (p.rating || 0)) && (lead.rating || 0) > 0) kinds.push('top-rated');
    if (list.every((p) => lead.price <= p.price)) kinds.push('cheapest');
  }
  return {
    kinds,
    stars: (lead.rating || 0) > 0 ? ((lead.rating || 0) / 20).toFixed(1) : null,
    orders: lead.volume || 0,
    of: list.length,
  };
}

type Lang = 'he' | 'en';
const langOf = (lang: string): Lang => (lang === 'he' ? 'he' : 'en');

/** Search title for a board, built from its live picks. */
export function moodTitle(name: string, lang: string, facts: KitFacts | null, money: (n: number) => string): string {
  if (!facts) return name;
  return langOf(lang) === 'he'
    ? `${name}: ${facts.pieces} פריטים, הסט החל מ-${money(facts.cheapestTotal)}`
    : `${name}: ${facts.pieces}-Piece Set From ${money(facts.cheapestTotal)}`;
}

export function formatOrders(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(n);
}

/** Two sentences summing up the kit, in the board's language. */
export function kitSummary(lang: string, facts: KitFacts, money: (n: number) => string): string {
  const orders = facts.totalOrders.toLocaleString('en-US');
  const same = facts.pickTotal === facts.cheapestTotal;
  if (langOf(lang) === 'he') {
    const cost = same
      ? `${facts.pieces} פריטים. הבחירה הראשונה בכל פריט היא גם הזולה, והסט עולה היום ${money(facts.pickTotal)}.`
      : `${facts.pieces} פריטים. עם הבחירה הראשונה בכל פריט הסט עולה היום ${money(facts.pickTotal)}, ועם האפשרות הזולה בכל פריט ${money(facts.cheapestTotal)}.`;
    return facts.totalOrders > 0 ? `${cost} למוצרים בעמוד יש יחד ${orders} הזמנות באליאקספרס.` : cost;
  }
  const cost = same
    ? `${facts.pieces} pieces. Our first pick in each slot is also the cheapest, and the set costs ${money(facts.pickTotal)} today.`
    : `${facts.pieces} pieces. With our first pick in each slot the set costs ${money(facts.pickTotal)} today, or ${money(facts.cheapestTotal)} if you take the cheapest option in every slot.`;
  return facts.totalOrders > 0 ? `${cost} The listings on this page have ${orders} orders between them on AliExpress.` : cost;
}

/** Short reason line shown under a slot's heading. */
export function reasonLine(lang: string, r: PickReason): string {
  if (langOf(lang) === 'he') {
    const stats = [
      r.stars && `דירוג ${r.stars} מתוך 5`,
      r.orders > 0 && `${r.orders.toLocaleString('en-US')} הזמנות`,
    ].filter(Boolean).join(', ');
    const claims = r.kinds.map((k) => ({ 'most-ordered': 'הכי נמכר', 'top-rated': 'עם הדירוג הכי גבוה', cheapest: 'הכי זול' })[k]);
    const lead = stats ? `הבחירה הראשונה: ${stats}.` : '';
    const tail = claims.length ? ` זה המוצר ${claims.join(' ו')} מבין ${r.of} האפשרויות כאן.` : '';
    return `${lead}${tail}`.trim();
  }
  const stats =
    r.stars && r.orders > 0
      ? `is rated ${r.stars} out of 5 with ${formatOrders(r.orders)} orders`
      : r.stars
        ? `is rated ${r.stars} out of 5`
        : r.orders > 0
          ? `has ${formatOrders(r.orders)} orders`
          : '';
  const claims = r.kinds.map((k) => ({ 'most-ordered': 'the most ordered', 'top-rated': 'the highest rated', cheapest: 'the cheapest' })[k]);
  const list = claims.length > 1 ? `${claims.slice(0, -1).join(', ')} and ${claims[claims.length - 1]}` : claims[0];
  if (!stats) return list ? `Our first pick is ${list} of the ${r.of} options here.` : '';
  return list ? `Our first pick ${stats}, ${list} of the ${r.of} options here.` : `Our first pick ${stats}.`;
}
