import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aggregateSnapshots, buildPriceOptions, dedupePicks, diversifyPicks, pickReason, scorePick, type Pick, type PickReason, type PickSnapshot } from '../lib/picks';

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

test('the freshness date is the latest reading behind the numbers', () => {
  const m = aggregateSnapshots(snaps([
    ['2026-08-10', 100, 10],
    ['2026-08-15', 150, 10],
  ]))!;
  assert.equal(m.asOf, '2026-08-15');
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
    ['2026-08-12', 530, 100],
    ['2026-08-13', 560, 100],
    ['2026-08-14', 590, 70],
  ]))!;
  assert.equal(m.priceMedian, 100);
  assert.equal(m.dropPct, 30);
  assert.equal(pickReason(m), 'price_drop');
});

test('a price rise is not a drop', () => {
  const m = aggregateSnapshots(snaps([
    ['2026-08-13', 500, 100],
    ['2026-08-14', 560, 130],
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
    priceNow: 10, priceMedian: 10, dropPct: 0, asOf: '2026-08-15', title: id, price: 10, currency: 'ILS',
    imageUrl: 'x', rating: 95, volume: 1000, category: id,
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

test('the game answer is not recoverable by sorting', () => {
  // v1 always used {0.42x, 1x, 2.1x}: sort the three, take the middle, 2/2
  // every round without looking at the product.
  const ids = ['1005010285372955', '3256806852323474', '1005008248087608', '1005006782788933', '3256809395889247'];
  const medians = ids.map((id) => {
    const opts = buildPriceOptions(19.9, id);
    const sorted = [...opts].sort((a, b) => a - b);
    return sorted[1] === 19.9;
  });
  assert.ok(medians.includes(false), 'the real price is the median for every product id');
  for (const id of ids) {
    const opts = buildPriceOptions(19.9, id);
    assert.equal(new Set(opts).size, 3, 'duplicate option gives the answer away');
    assert.ok(opts.includes(19.9));
    assert.equal(buildPriceOptions(19.9, id).join(), opts.join()); // deterministic
  }
});

test('cheap products still get three distinct options', () => {
  for (const id of ['1', '22', '333', '4444']) {
    const opts = buildPriceOptions(0.6, id);
    assert.equal(new Set(opts).size, 3);
  }
});

test('the same product from five sellers appears once', () => {
  // Live US picks were three Tuya smart sockets and two mini fans out of twelve.
  const out = dedupePicks([
    { title: 'TNCE Tuya EU Plug WiFi Zigbee Smart Socket Power Monitor', category: 'Smart Home' },
    { title: 'Tuya Smart Socket EU 16A Wifi Smart Plug Power Monitor', category: 'Smart Home' },
    { title: 'Stainless Steel Vegetable Peeler Kitchen', category: 'Kitchen' },
  ]);
  assert.equal(out.length, 2);
  assert.match(out[1].title, /Peeler/);
});

test('one category cannot eat the list', () => {
  const out = dedupePicks([
    { title: 'Wifi Smart Socket Power Monitor', category: 'Smart Home' },
    { title: 'Motion Sensor Night Light Hallway', category: 'Smart Home' },
    { title: 'Video Doorbell Camera Wireless Chime', category: 'Smart Home' },
    { title: 'Dog Grooming Comb Brush', category: 'Pet' },
  ]);
  // One per category: the best Smart Home mover, not the three best.
  assert.deepEqual(out.map((p) => p.category), ['Smart Home', 'Pet']);
});

test('a discount on a product nobody buys is not a deal', () => {
  const dead = aggregateSnapshots(snaps([
    ['2026-08-11', 500, 100], ['2026-08-12', 500, 100], ['2026-08-13', 500, 100], ['2026-08-14', 500, 70],
  ]))!;
  assert.equal(dead.dropPct, 30);
  assert.equal(pickReason(dead), null); // was 'price_drop'

  const alive = aggregateSnapshots(snaps([
    ['2026-08-11', 500, 100], ['2026-08-12', 520, 100], ['2026-08-13', 540, 100], ['2026-08-14', 560, 70],
  ]))!;
  assert.equal(pickReason(alive), 'price_drop');
});

test('a best seller has to actually sell', () => {
  const trickle = aggregateSnapshots(snaps([['2026-08-08', 500, 10], ['2026-08-15', 505, 10]]))!;
  assert.equal(pickReason(trickle), null);
  const real = aggregateSnapshots(snaps([['2026-08-08', 500, 10], ['2026-08-15', 1200, 10]]))!;
  assert.equal(pickReason(real), 'bestseller');
});

test('a reserved seed cannot be starved by the category cap', () => {
  // Momentum outscores a discount by construction, so without a reserved slot
  // the surging item in a category evicts that category's price drop. Measured
  // on live US data: one price-drop candidate, zero survivors.
  const items = [
    { title: 'Wifi Smart Socket Power Monitor', category: 'Smart Home', reason: 'surging' },
    { title: 'Motion Sensor Night Light Hallway', category: 'Smart Home', reason: 'price_drop' },
  ];
  assert.equal(dedupePicks(items).length, 1);
  assert.equal(dedupePicks(items, { seed: [items[1]] }).length, 1);
  assert.equal(dedupePicks(items, { seed: [items[1]] })[0].reason, 'price_drop');
});
