/**
 * Which search results may fill a mood board slot.
 *
 * A slot's search words pull in whatever sells best near them: "nori seaweed
 * sheets" returned sushi molds and a nori punch, "pirate dreadlock wig"
 * returned a pirate hat. A slot now names what its products must be called
 * (`match`, and `also` where a word alone is too loose) and what they must not (`not`), checked against the English
 * listing title, and a product shown in one slot is not shown again in a
 * later one. A slot with no match shows nothing rather than the wrong thing.
 */

export interface SlotRule {
  /** The title must contain one of these at the start of a word. */
  match: string[];
  /** The title must also contain one of these, e.g. the character a costume piece is for. */
  also?: string[];
  /** The title must contain none of these at the start of a word. */
  not?: string[];
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function hasWordStart(title: string, needle: string): boolean {
  return new RegExp(`(^|[^a-z0-9])${escape(needle.toLowerCase())}`).test(title);
}

export function slotMatches(title: string | undefined, rule: SlotRule): boolean {
  const t = (title || '').toLowerCase();
  if (!rule.match.some((n) => hasWordStart(t, n))) return false;
  if (rule.also?.length && !rule.also.some((n) => hasWordStart(t, n))) return false;
  return !(rule.not || []).some((n) => hasWordStart(t, n));
}

/**
 * Fill each slot, in board order, with up to `limit` of its own candidates,
 * skipping any product an earlier slot already shows.
 */
export function pickDistinct<T extends { id: string }>(candidates: T[][], limit: number): T[][] {
  const used = new Set<string>();
  return candidates.map((list) => {
    const out: T[] = [];
    for (const p of list) {
      if (out.length >= limit) break;
      if (!p?.id || used.has(p.id)) continue;
      used.add(p.id);
      out.push(p);
    }
    return out;
  });
}
