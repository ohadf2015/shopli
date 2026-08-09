import test from 'node:test';
import assert from 'node:assert/strict';
import { getTrendCategories, inWindow } from '../lib/trend-calendar';
import { computeVolumeVelocity } from '../lib/trend-velocity';

const on = (m: number, d: number) => new Date(Date.UTC(2026, m - 1, d));
const keys = (region: string, date: Date) => getTrendCategories(region, date).map((c) => c.key);

test('inWindow handles a window that wraps past 31 December', () => {
  const winter: [number, number][] = [[11, 15], [2, 28]];
  assert.equal(inWindow(on(12, 25), winter[0], winter[1]), true);
  assert.equal(inWindow(on(1, 10), winter[0], winter[1]), true);
  assert.equal(inWindow(on(11, 20), winter[0], winter[1]), true);
  assert.equal(inWindow(on(6, 1), winter[0], winter[1]), false);
});

test('inWindow is inclusive at both ends', () => {
  assert.equal(inWindow(on(5, 1), [5, 1], [9, 10]), true);
  assert.equal(inWindow(on(9, 10), [5, 1], [9, 10]), true);
  assert.equal(inWindow(on(9, 11), [5, 1], [9, 10]), false);
});

test('the frozen-calendar bug stays fixed: no Halloween in August, no Summer in January', () => {
  assert.ok(!keys('eu', on(8, 8)).includes('halloween'));
  assert.ok(keys('eu', on(10, 20)).includes('halloween'));
  assert.ok(!keys('eu', on(1, 15)).includes('summer'));
  assert.ok(keys('eu', on(7, 1)).includes('summer'));
});

test('holidays are region-specific', () => {
  // Halloween is not an Israeli shopping season; Purim and the autumn holidays are.
  assert.ok(!keys('il', on(10, 20)).includes('halloween'));
  assert.ok(keys('il', on(10, 5)).includes('high-holidays'));
  assert.ok(keys('il', on(3, 1)).includes('purim'));
  assert.ok(!keys('de', on(3, 1)).includes('purim'));
  assert.ok(!keys('de', on(10, 5)).includes('high-holidays'));
});

test('in-season categories outrank evergreen ones', () => {
  const blackFriday = keys('eu', on(11, 20));
  assert.equal(blackFriday[0], 'black-friday', `expected black-friday first, got ${blackFriday[0]}`);
});

test('there is always a full page, even in a calendar gap', () => {
  for (const region of ['il', 'eu', 'us', 'de', 'ru']) {
    for (let m = 1; m <= 12; m++) {
      const got = getTrendCategories(region, on(m, 15));
      assert.ok(got.length >= 7, `${region} month ${m}: only ${got.length} categories`);
      assert.equal(new Set(got.map((c) => c.key)).size, got.length, `${region} month ${m}: duplicate keys`);
      for (const c of got) assert.ok(c.keywords.length > 0 && c.label.en, `${region}: ${c.key} malformed`);
    }
  }
});

test('every category has a Hebrew label — /il is the traffic', () => {
  for (let m = 1; m <= 12; m++) {
    for (const c of getTrendCategories('il', on(m, 15))) {
      assert.ok(c.label.he?.trim(), `${c.key} has no he label`);
    }
  }
});

test('velocity is units sold per day between snapshots', () => {
  const baselines = { a: { volume: 1000, spanDays: 5 }, b: { volume: 200, spanDays: 2 } };
  const v = computeVolumeVelocity(baselines, [{ id: 'a', volume: 1500 }, { id: 'b', volume: 260 }]);
  assert.equal(v.a!.perDay, 100); // 500 units over 5 days
  assert.equal(v.b!.perDay, 30);
});

test('velocity omits unusable readings rather than scoring them zero', () => {
  const v = computeVolumeVelocity(
    {
      noBaseline: undefined,
      sameDay: { volume: 10, spanDays: 0 },
      counterReset: { volume: 5000, spanDays: 3 },
      flat: { volume: 100, spanDays: 3 },
    },
    [
      { id: 'noBaseline', volume: 900 },
      { id: 'sameDay', volume: 90 },
      { id: 'counterReset', volume: 12 }, // AliExpress reset or relisted
      { id: 'flat', volume: 100 },
    ]
  );
  assert.equal(v.noBaseline, undefined, 'no baseline must not become a reading');
  assert.equal(v.sameDay, undefined, 'a same-day baseline has no elapsed time');
  assert.equal(v.counterReset, undefined, 'a negative delta is a broken counter, not a decline');
  // A genuine zero IS a reading — the item is tracked and sold nothing.
  assert.equal(v.flat!.perDay, 0);
});
