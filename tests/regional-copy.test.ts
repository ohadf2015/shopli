import { test } from 'node:test';
import assert from 'node:assert/strict';
import { localCurrency } from '../lib/regions';
import { getFeaturedCollections } from '../lib/collections';

test('English euro thresholds show the reader region symbol', () => {
  assert.equal(localCurrency('Gadgets Under €10', 'us'), 'Gadgets Under $10');
  assert.equal(localCurrency('under 25€ each', 'uk'), 'under £25 each');
  assert.equal(localCurrency('Gadgets Under €10', 'eu'), 'Gadgets Under €10');
  assert.equal(localCurrency('בפחות מ-₪40', 'il'), 'בפחות מ-₪40');
});

test('Halloween is not featured after October', () => {
  for (const region of ['us', 'uk', 'eu']) {
    const slugs = getFeaturedCollections(region, 10, new Date('2026-11-28')).map((c) => c.slug);
    assert.ok(!slugs.includes('halloween'), region);
  }
  assert.ok(getFeaturedCollections('us', 10, new Date('2026-10-15')).some((c) => c.slug === 'halloween'));
});
