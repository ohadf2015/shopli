import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeVerdict, sparklinePoints, verdictReason, type PricePoint } from '../lib/verdict';

function series(prices: number[], start = '2026-09-01', vol0 = 1000, perDay = 10): PricePoint[] {
  const t0 = Date.parse(start);
  return prices.map((price, i) => ({
    day: new Date(t0 + i * 86400000).toISOString().slice(0, 10),
    price,
    volume: vol0 + i * perDay,
  }));
}

test('too few readings → new, no price claims', () => {
  const v = computeVerdict({ priceNow: 5, rating: 98, history: series([5, 5, 5]) });
  assert.equal(v.kind, 'new');
  assert.equal(v.median, null);
});

test('well under its own median → good', () => {
  const v = computeVerdict({ priceNow: 8, rating: 97, history: series([12, 12, 13, 12, 11, 12, 9]) });
  assert.equal(v.kind, 'good');
  assert.ok(v.vsMedianPct! <= -10);
});

test('lowest recorded price counts as good even if close to median', () => {
  const v = computeVerdict({ priceNow: 9.9, rating: 95, history: series([10, 10, 10, 10, 10, 10]) });
  assert.equal(v.kind, 'good');
  assert.equal(v.isLowest, true);
});

test('well above its own median → wait', () => {
  const v = computeVerdict({ priceNow: 15, rating: 96, history: series([10, 10, 11, 10, 12, 10]) });
  assert.equal(v.kind, 'wait');
});

test('in the normal band → fair', () => {
  const v = computeVerdict({ priceNow: 10.5, rating: 96, history: series([10, 11, 10, 11, 10, 11]) });
  assert.equal(v.kind, 'fair');
});

test('low rating wins over a cheap price → mixed', () => {
  const v = computeVerdict({ priceNow: 5, rating: 80, history: series([10, 10, 10, 10, 10, 10]) });
  assert.equal(v.kind, 'mixed');
});

test('orders per day comes from the recent readings', () => {
  const v = computeVerdict({ priceNow: 10, rating: 96, history: series([10, 10, 10, 10, 10, 10, 10, 10], '2026-09-01', 1000, 25) });
  assert.equal(v.perDay, 25);
});

test('unsorted input and junk rows are handled', () => {
  const h = series([12, 12, 12, 12, 12]).reverse();
  h.push({ day: 'bad', price: 1, volume: 0 }, { day: '2026-09-09', price: 0, volume: 0 });
  const v = computeVerdict({ priceNow: 12, rating: 96, history: h });
  assert.equal(v.readings, 5);
});

test('reason text names the usual price', () => {
  const v = computeVerdict({ priceNow: 8, rating: 97, history: series([12, 12, 13, 12, 11, 12, 12]) });
  const s = verdictReason(v, 'en', (n) => `€${n.toFixed(2)}`);
  assert.match(s, /€12\.00/);
});

test('sparkline spaces points by day, so a gap stays a gap', () => {
  const h: PricePoint[] = [
    { day: '2026-09-01', price: 10, volume: 0 },
    { day: '2026-09-02', price: 10, volume: 0 },
    { day: '2026-10-01', price: 5, volume: 0 },
  ];
  const pts = sparklinePoints(h, 5, 104, 50, 2).split(' ').map((p) => Number(p.split(',')[0]));
  assert.equal(pts.length, 3);
  assert.ok(pts[1] - pts[0] < 5, 'consecutive days sit close together');
  assert.ok(pts[2] - pts[1] > 90, 'the month gap spans most of the width');
});
