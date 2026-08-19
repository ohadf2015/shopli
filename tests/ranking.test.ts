import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  RANKING_SPEC,
  rankPicks,
  scoreTerms,
  verifyRanking,
  type PickReason,
  type RankItem,
  type ScoreInput,
} from '../lib/ranking';
import { scorePick } from '../lib/picks';

type Candidate = RankItem & ScoreInput;

/** A candidate whose score is, by construction, the one the scorer produces. */
function cand(productId: string, title: string, over: Partial<Candidate> = {}): Candidate {
  const c: Candidate = {
    productId,
    title,
    category: title.split(' ')[0],
    reason: 'surging' as PickReason,
    recentPerDay: 12,
    surge: 2.5,
    dropPct: 0,
    rating: 96,
    volume: 4000,
    score: 0,
    ...over,
  };
  return { ...c, score: scoreTerms(c).total };
}

const CANDIDATES: Candidate[] = [
  cand('p1', 'stainless steel french press', { recentPerDay: 40, surge: 3 }),
  cand('p2', 'usb desk fan quiet', { recentPerDay: 20, surge: 2.2 }),
  cand('p3', 'blackout curtain thermal', { reason: 'price_drop', recentPerDay: 6, surge: 1, dropPct: 32 }),
  cand('p4', 'silicone baking mat set', { reason: 'bestseller', recentPerDay: 15, surge: 1.1 }),
  cand('p5', 'usb desk fan silent', { recentPerDay: 30, surge: 2.8 }), // same idea as p2
  cand('p6', 'magnetic phone mount car', { reason: 'bestseller', recentPerDay: 25, surge: 1 }),
];

/** What a browser actually gets to work with: JSON, not our objects. */
function overTheWire(limit: number) {
  const picks = rankPicks(CANDIDATES, { limit });
  return JSON.parse(
    JSON.stringify({
      candidates: CANDIDATES,
      picks: picks.map((p) => ({ productId: p.productId, score: p.score, terms: scoreTerms(p) })),
    })
  ) as { candidates: Candidate[]; picks: Array<{ productId: string; score: number; terms: ReturnType<typeof scoreTerms> }> };
}

test('the published score is the terms summed, then rounded once', () => {
  const t = scoreTerms({ recentPerDay: 17, surge: 2.4, dropPct: 13, rating: 96, volume: 4000 });
  // Pinned, because RANKING_SPEC publishes these formulas as strings: changing
  // a multiplier without changing the disclosure would make the published
  // algorithm a lie that still verifies.
  const round3 = (n: number) => Math.round(n * 1000) / 1000;
  assert.deepEqual(
    { momentum: round3(t.momentum), surge: round3(t.surge), discount: t.discount, quality: round3(t.quality) },
    { momentum: 37.658, surge: 16.8, discount: 13, quality: 12.3 }
  );
  assert.equal(t.total, Math.round((t.momentum + t.surge + t.discount + t.quality) * 10) / 10);
  // Terms ride full precision: rounding them first would give a client that
  // sums them a different number than the one it was served.
  assert.notEqual(t.momentum, Math.round(t.momentum * 10) / 10);
});

test('scorePick is the same function, not a second copy', () => {
  const m = { recentPerDay: 17, surge: 2.4, dropPct: 13 };
  assert.equal(scorePick(m as any, 96, 4000), scoreTerms({ ...m, rating: 96, volume: 4000 }).total);
});

test('a client recomputes the served order from the disclosed inputs', () => {
  const wire = overTheWire(4);
  const verdict = verifyRanking(wire.candidates, wire.picks, { limit: 4 });
  assert.deepEqual(verdict.badScores, []);
  assert.ok(verdict.ok, `expected ${verdict.expectedOrder} got ${verdict.servedOrder}`);
  // And the order is a real one, not score order: the round-robin puts one of
  // each reason first, and dedupe dropped the lower-scoring of the two usb fans
  // (p2, same idea as p5).
  assert.deepEqual(verdict.servedOrder, ['p1', 'p3', 'p6', 'p5']);
});

test('a response served out of order fails verification', () => {
  const wire = overTheWire(4);
  const swapped = [wire.picks[1], wire.picks[0], ...wire.picks.slice(2)];
  assert.equal(verifyRanking(wire.candidates, swapped, { limit: 4 }).ok, false);
});

test('a doctored score is caught, not just a doctored order', () => {
  const wire = overTheWire(4);
  const tampered = wire.candidates.map((c) => (c.productId === 'p3' ? { ...c, score: c.score + 40 } : c));
  const verdict = verifyRanking(tampered, wire.picks, { limit: 4 });
  assert.deepEqual(verdict.badScores, ['p3']);
  assert.equal(verdict.ok, false);
});

test('the disclosed inputs are the whole input', () => {
  const full = CANDIDATES[0];
  // Only the fields RANKING_SPEC names, and the score still comes out.
  const disclosed = Object.fromEntries(RANKING_SPEC.inputs.map((k) => [k, full[k]])) as unknown as ScoreInput;
  assert.equal(scoreTerms(disclosed).total, full.score);
  // Nothing a seller pays for can move it: there is no term to weight.
  const paid = { ...disclosed, commissionRate: 30, sponsored: true } as ScoreInput;
  assert.equal(scoreTerms(paid).total, full.score);
});
