import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  TREND_SCORE_VERSION,
  discountPct,
  computeTrendScore,
  rankTrending,
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
    cand({ id: 'low', discount: '5%', volume: 10, recentTrades: 0 }),
    cand({ id: 'high', discount: '80%', volume: 9000, recentTrades: 800 }),
    cand({ id: 'mid', discount: '40%', volume: 100, recentTrades: 10 }),
    cand({ id: 'high', discount: '80%', volume: 9000, recentTrades: 800 }), // dupe
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
