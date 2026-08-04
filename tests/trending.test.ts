import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  TREND_SCORE_VERSION,
  discountPct,
  computeTrendScore,
  rankTrending,
  normalizeTitleKey,
  trendReasonLabel,
  type TrendCandidate,
} from '../lib/trending';

function cand(overrides: Partial<TrendCandidate>): TrendCandidate {
  return {
    id: '1',
    title: 'Wireless Earbuds Pro',
    price: 10,
    originalPrice: null,
    discount: '',
    rating: 90,
    volume: 1000,
    recentTrades: 50,
    category: 'Electronics',
    imageUrl: '',
    affiliateLink: 'https://example.com/aff',
    currency: 'EUR',
    ...overrides,
  };
}

test('score version is weighted-v1', () => {
  assert.equal(TREND_SCORE_VERSION, 'weighted-v1');
});

test('discountPct parses string discounts and falls back to price delta', () => {
  assert.equal(discountPct(cand({ discount: '53%' })), 53);
  assert.equal(discountPct(cand({ discount: '53' })), 53);
  assert.equal(discountPct(cand({ discount: '' })), 0);
  assert.equal(discountPct(cand({ price: 5, originalPrice: 10 })), 50);
  assert.equal(discountPct(cand({ price: 12, originalPrice: 10 })), 0);
});

test('cold-start score uses 50% discount + 30% momentum + 20% freshness', () => {
  const pool = [
    cand({ id: 'a', discount: '60%', volume: 10000, recentTrades: 500 }),
    cand({ id: 'b', discount: '0%', volume: 0, recentTrades: 0 }),
  ];
  const top = computeTrendScore(pool[0], pool);
  const bottom = computeTrendScore(pool[1], pool);
  // top is max on every component => 50 + 30 + 20 = 100
  assert.equal(Math.round(top.score), 100);
  assert.equal(bottom.score, 0);
  assert.ok(top.score > bottom.score);
});

test('cold-start weights: discount dominates momentum which dominates freshness', () => {
  const pool = [
    cand({ id: 'disc', discount: '80%', volume: 0, recentTrades: 0 }),
    cand({ id: 'mom', discount: '0%', volume: 50000, recentTrades: 0 }),
    cand({ id: 'fresh', discount: '0%', volume: 0, recentTrades: 5000 }),
  ];
  const byId = Object.fromEntries(pool.map((p) => [p.id, computeTrendScore(p, pool).score]));
  assert.equal(Math.round(byId.disc), 50);
  assert.equal(Math.round(byId.mom), 30);
  assert.equal(Math.round(byId.fresh), 20);
});

test('dominant component drives the reason', () => {
  const pool = [
    cand({ id: 'a', discount: '70%', volume: 10, recentTrades: 0 }),
    cand({ id: 'b', discount: '0%', volume: 99999, recentTrades: 9000 }),
  ];
  assert.equal(computeTrendScore(pool[0], pool).reason, 'price_drop');
  assert.equal(computeTrendScore(pool[1], pool).reason, 'order_momentum');
});

test('velocity data switches to the full weighted formula', () => {
  const pool = [
    cand({ id: 'viral', discount: '0%', volume: 0, recentTrades: 0 }),
    cand({ id: 'plain', discount: '0%', volume: 0, recentTrades: 0 }),
  ];
  const velocity = { viral: { clicks7d: 500, views7d: 900 } };
  const viral = computeTrendScore(pool[0], pool, velocity);
  const plain = computeTrendScore(pool[1], pool, velocity);
  assert.ok(viral.score > plain.score, 'click/view velocity lifts score');
  assert.equal(viral.reason, 'click_velocity');
});

test('rankTrending sorts by score desc, dedupes, assigns rank, caps limit', () => {
  const pool = [
    cand({ id: 'low', title: 'Wireless Earbuds Pro', discount: '5%', volume: 10, recentTrades: 0 }),
    cand({ id: 'high', title: 'Smart LED Strip Lights', discount: '80%', volume: 9000, recentTrades: 800 }),
    cand({ id: 'mid', title: 'Magnetic Phone Mount', discount: '40%', volume: 100, recentTrades: 10 }),
    cand({ id: 'high', title: 'Smart LED Strip Lights', discount: '80%', volume: 9000, recentTrades: 800 }), // dupe
  ];
  const ranked = rankTrending(pool, { limit: 10 });
  assert.equal(ranked.length, 3);
  assert.equal(ranked[0].product.id, 'high');
  assert.equal(ranked[0].rank, 1);
  assert.equal(ranked[1].product.id, 'mid');
  assert.equal(ranked[2].rank, 3);
  const capped = rankTrending(pool, { limit: 2 });
  assert.equal(capped.length, 2);
});

test('rankTrending flags products with an empty pool gracefully', () => {
  assert.deepEqual(rankTrending([], { limit: 8 }), []);
});

test('normalizeTitleKey folds case, punctuation, units, and token order', () => {
  const a = 'Soowee 80cm Long Synthetic Hair White Purple Cosplay Wigs';
  const b = 'Soowee 80 CM Long Synthetic Hair, White Purple Cosplay Wigs!';
  assert.equal(normalizeTitleKey(a), normalizeTitleKey(b));
  // numbers survive so different models stay distinct
  assert.notEqual(normalizeTitleKey('iPhone 14 case'), normalizeTitleKey('iPhone 15 case'));
  assert.equal(normalizeTitleKey('!!!'), '');
});

test('rankTrending dedupes same-title products with different IDs, keeps best score', () => {
  const title = 'Earphone Clip Wireless Bluetooth Headphone Bone Conduction';
  const pool = [
    cand({ id: '1005006888776365', title, discount: '10%', volume: 35100, recentTrades: 100 }),
    cand({ id: '1005007345320109', title, discount: '40%', volume: 35100, recentTrades: 100 }),
    cand({ id: 'other', title: 'Oversized Colorful Sports Sunglasses UV400', discount: '5%' }),
  ];
  const ranked = rankTrending(pool, { limit: 10 });
  assert.equal(ranked.length, 2);
  // higher-scored duplicate wins
  assert.equal(ranked[0].product.id, '1005007345320109');
});

test('rankTrending dedupes near-dup titles (unit/punctuation variants, triple listing)', () => {
  const pool = [
    cand({ id: 's1', title: 'Oversized Colorful Sports Sunglasses' }),
    cand({ id: 's2', title: 'Oversized Colorful Sports Sunglasses UV400' }),
    cand({ id: 's3', title: 'oversized colorful sports sunglasses!' }),
    cand({ id: 'w1', title: 'Soowee 80cm Long Synthetic Hair White Purple Cosplay Wigs' }),
    cand({ id: 'w2', title: 'Soowee 80 CM Long Synthetic Hair White Purple Cosplay Wigs' }),
  ];
  const ranked = rankTrending(pool, { limit: 10 });
  assert.equal(ranked.length, 2, '3 sunglass dupes -> 1, 2 wig dupes -> 1');
  // equal scores -> id asc, so the first of each dupe cluster wins
  assert.deepEqual(ranked.map((r) => r.product.id), ['s1', 'w1']);
  // no two cards share a normalized title
  const keys = ranked.map((r) => normalizeTitleKey(r.product.title));
  assert.equal(new Set(keys).size, keys.length);
});

test('rankTrending keeps distinct products that share generic words', () => {
  const pool = [
    cand({ id: 'a', title: 'Wireless Bluetooth Earbuds Pro' }),
    cand({ id: 'b', title: 'Wireless Bluetooth Speaker Pro' }),
    cand({ id: 'c', title: 'Wireless Bluetooth Earbuds Max' }),
  ];
  const ranked = rankTrending(pool, { limit: 10 });
  assert.equal(ranked.length, 3);
});

test('trendReasonLabel returns localized human reasons', () => {
  assert.match(trendReasonLabel('price_drop', false), /price dropped/i);
  assert.match(trendReasonLabel('order_momentum', false), /popular/i);
  assert.match(trendReasonLabel('freshness', false), /new/i);
  assert.match(trendReasonLabel('price_drop', true), /[\u0590-\u05FF]/);
});

test('scores are deterministic for the same input', () => {
  const pool = [
    cand({ id: 'a', discount: '33%', volume: 123, recentTrades: 45 }),
    cand({ id: 'b', discount: '10%', volume: 4567, recentTrades: 8 }),
  ];
  const first = rankTrending(pool, { limit: 2 }).map((r) => r.score);
  const second = rankTrending(pool, { limit: 2 }).map((r) => r.score);
  assert.deepEqual(first, second);
});
