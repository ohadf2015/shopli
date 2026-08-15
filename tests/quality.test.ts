import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  passesQualityGate,
  qualityScore,
  qualityTier,
  filterQuality,
  QUALITY_MIN_RATE,
  QUALITY_MIN_VOLUME,
} from '../lib/quality';

test('rejects products below the measured floor', () => {
  assert.equal(passesQualityGate({ rating: 88, volume: 5000 }), false);
  assert.equal(passesQualityGate({ rating: 98, volume: 40 }), false);
  assert.equal(passesQualityGate({ rating: QUALITY_MIN_RATE, volume: QUALITY_MIN_VOLUME }), true);
});

test('a missing signal is not a bad signal', () => {
  // The affiliate API omits fields during a bad patch; rejecting on 0 would
  // silently drop whole responses.
  assert.equal(passesQualityGate({ rating: 0, volume: 0 }), true);
  assert.equal(passesQualityGate({}), true);
});

test('rating outranks volume, volume breaks ties', () => {
  assert.ok(qualityScore({ rating: 98, volume: 200 }) > qualityScore({ rating: 92, volume: 90000 }));
  assert.ok(qualityScore({ rating: 95, volume: 9000 }) > qualityScore({ rating: 95, volume: 150 }));
});

test('top tier needs both a high rating and proof of sales', () => {
  assert.equal(qualityTier({ rating: 98, volume: 5000 }), 'top');
  assert.equal(qualityTier({ rating: 98, volume: 200 }), 'good');
  assert.equal(qualityTier({ rating: 70, volume: 5000 }), 'weak');
});

test('filterQuality drops the tail and ranks the rest', () => {
  const out = filterQuality([
    { id: 'weak', rating: 70, volume: 5000 },
    { id: 'ok', rating: 91, volume: 800 },
    { id: 'best', rating: 99, volume: 9000 },
  ] as Array<{ id: string; rating: number; volume: number }>);
  assert.deepEqual(out.map((p) => p.id), ['best', 'ok']);
});

test('filtering never empties a non-empty list', () => {
  // An empty category page is worse than a mediocre product on it.
  const junk = [{ id: 'a', rating: 82, volume: 3 }, { id: 'b', rating: 86, volume: 2 }];
  const out = filterQuality(junk);
  assert.equal(out.length, 2);
  assert.equal(out[0].id, 'b'); // still ranked, best-of-a-bad-lot first
});
