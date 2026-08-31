import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeVolumeVelocity } from '../lib/trend-velocity';

test('units sold per day is the volume delta divided by the span', () => {
  const out = computeVolumeVelocity(
    { a: { volume: 100, spanDays: 4 } },
    [{ id: 'a', volume: 140 }]
  );
  assert.deepEqual(out.a, { perDay: 10, spanDays: 4 });
});

test('a product with no baseline is absent, not zero', () => {
  const out = computeVolumeVelocity({}, [{ id: 'a', volume: 140 }]);
  assert.equal('a' in out, false);
});

test('a flat product is present with perDay 0', () => {
  const out = computeVolumeVelocity(
    { a: { volume: 100, spanDays: 3 } },
    [{ id: 'a', volume: 100 }]
  );
  assert.deepEqual(out.a, { perDay: 0, spanDays: 3 });
});

test('a counter reset reads as a broken reading, not a decline', () => {
  const out = computeVolumeVelocity(
    { a: { volume: 500, spanDays: 5 } },
    [{ id: 'a', volume: 12 }]
  );
  assert.equal('a' in out, false);
});

test('same-day baselines give nothing to divide by and are skipped', () => {
  const out = computeVolumeVelocity(
    { a: { volume: 100, spanDays: 0 } },
    [{ id: 'a', volume: 140 }]
  );
  assert.equal('a' in out, false);
});

test('products without an id are skipped', () => {
  const out = computeVolumeVelocity({ a: { volume: 1, spanDays: 2 } }, [{ volume: 140 }]);
  assert.deepEqual(out, {});
});

test('a missing live volume counts as zero sold, so only a zero baseline survives', () => {
  const out = computeVolumeVelocity(
    { a: { volume: 0, spanDays: 2 }, b: { volume: 10, spanDays: 2 } },
    [{ id: 'a' }, { id: 'b' }]
  );
  assert.deepEqual(out.a, { perDay: 0, spanDays: 2 });
  assert.equal('b' in out, false);
});
