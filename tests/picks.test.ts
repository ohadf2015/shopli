import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aggregateSnapshots, diversifyPicks, pickReason, scorePick, type Pick, type PickReason, type PickSnapshot } from '../lib/picks';

function snaps(rows: Array<[string, number, number | null]>): PickSnapshot[] {
  return rows.map(([seenOn, volume, price]) => ({ productId: 'p1', seenOn, volume, price }));
}

test('one reading is not a trend', () => {
  assert.equal(aggregateSnapshots(snaps([['2026-08-14', 100, 10]])), null);
});

test('units per day comes from the observed span', () => {
  const m = aggregateSnapshots(snaps([
    ['2026-08-08', 1000, 10],
    ['2026-08-15', 1070, 10],
  ]))!;
  assert.equal(m.spanDays, 7);
  assert.equal(m.perDay, 10);
});

test('a counter reset is a broken reading, not a decline', () => {
  assert.equal(aggregateSnapshots(snaps([['2026-08-08', 5000, 10], ['2026-08-15', 12, 10]])), null);
});

test('surge compares the latest day against the products own rate', () => {
  const m = aggregateSnapshots(snaps([
    ['2026-08-11', 1000, 10],
    ['2026-08-12', 1010, 10],
    ['2026-08-13', 1020, 10],
    ['2026-08-14', 1100, 10], // 80 in a day against a ~27/day average
  ]))!;
  assert.ok(m.surge > 2);
  assert.equal(pickReason(m), 'surging');
});

test('a slow product selling one extra unit is not surging', () => {
  const m = aggregateSnapshots(snaps([
    ['2026-08-12', 100, 10],
    ['2026-08-13', 100, 10],
    ['2026-08-14', 101, 10],
  ]))!;
  // The ratio is infinite-ish but the volume is noise. Needs real units too.
  assert.notEqual(pickReason(m), 'surging');
});

test('a discount is measured against the products OWN median price', () => {
  // AliExpress list prices are seller-controlled, so their "discount" means
  // nothing. Ours is the only honest one.
  const m = aggregateSnapshots(snaps([
    ['2026-08-11', 500, 100],
    ['2026-08-12', 501, 100],
    ['2026-08-13', 502, 100],
    ['2026-08-14', 503, 70],
  ]))!;
  assert.equal(m.priceMedian, 100);
  assert.equal(m.dropPct, 30);
  assert.equal(pickReason(m), 'price_drop');
});

test('a price rise is not a drop', () => {
  const m = aggregateSnapshots(snaps([
    ['2026-08-13', 500, 100],
    ['2026-08-14', 505, 130],
  ]))!;
  assert.ok(m.dropPct < 0);
  assert.equal(pickReason(m), 'bestseller');
});

test('a product that sold nothing is not a pick at all', () => {
  const m = aggregateSnapshots(snaps([['2026-08-13', 500, 10], ['2026-08-14', 500, 10]]))!;
  assert.equal(pickReason(m), null);
});

test('missing prices do not fake a discount', () => {
  const m = aggregateSnapshots(snaps([['2026-08-13', 500, null], ['2026-08-14', 520, null]]))!;
  assert.equal(m.dropPct, 0);
  assert.equal(m.priceMedian, null);
});

test('scoring is deterministic and rewards momentum over popularity', () => {
  const surging = aggregateSnapshots(snaps([
    ['2026-08-12', 1000, 10], ['2026-08-13', 1010, 10], ['2026-08-14', 1120, 10],
  ]))!;
  const steady = aggregateSnapshots(snaps([
    ['2026-08-12', 90000, 10], ['2026-08-13', 90010, 10], ['2026-08-14', 90020, 10],
  ]))!;
  const a = scorePick(surging, 95, 1120);
  assert.equal(a, scorePick(surging, 95, 1120)); // same in, same out
  assert.ok(a > scorePick(steady, 95, 90020));
});

function pick(id: string, reason: PickReason, score: number): Pick {
  return {
    productId: id, reason, score, perDay: 1, recentPerDay: 1, surge: 1, spanDays: 7,
    priceNow: 10, priceMedian: 10, dropPct: 0, title: id, price: 10, currency: 'ILS',
    imageUrl: 'x', rating: 95, volume: 1000,
  };
}

test('a list mixes reasons instead of showing five surging in a row', () => {
  const out = diversifyPicks([
    pick('s1', 'surging', 90), pick('s2', 'surging', 88), pick('s3', 'surging', 80),
    pick('d1', 'price_drop', 70), pick('d2', 'price_drop', 60),
    pick('b1', 'bestseller', 50),
  ], 5);
  assert.deepEqual(out.map((p) => p.productId), ['s1', 'd1', 'b1', 's2', 'd2']);
});

test('an empty reason costs nothing', () => {
  const out = diversifyPicks([pick('s1', 'surging', 90), pick('s2', 'surging', 80)], 5);
  assert.deepEqual(out.map((p) => p.productId), ['s1', 's2']);
});
