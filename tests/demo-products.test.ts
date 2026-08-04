import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEMO_PRODUCT_IDS,
  getDemoProducts,
  getDemoProductById,
} from '../lib/demo-products';
import { ensureTrackedLink } from '../lib/aliexpress';

test('demo catalog exposes exactly the known static ids', () => {
  assert.deepEqual([...DEMO_PRODUCT_IDS].sort(), [
    '1005007001',
    '1005007002',
    '1005007003',
    '1005007005',
  ]);
});

test('getDemoProducts localizes titles and prices per region', () => {
  const il = getDemoProducts('il', 'ILS');
  const eu = getDemoProducts('eu', 'EUR');
  assert.equal(il.length, DEMO_PRODUCT_IDS.length);
  assert.equal(eu.length, DEMO_PRODUCT_IDS.length);
  assert.notEqual(il[0].title, eu[0].title);
  assert.ok(il[0].price > eu[0].price, 'ILS price should be higher nominal than EUR');
  for (const p of eu) {
    assert.ok(p.affiliateLink.includes(p.id), 'affiliate link contains product id');
    assert.equal(p.currency, 'EUR');
  }
});

test('getDemoProductById round-trips every catalog id and rejects unknown ids', () => {
  for (const id of DEMO_PRODUCT_IDS) {
    assert.ok(getDemoProductById(id, 'eu', 'EUR'), `missing demo product ${id}`);
  }
  assert.equal(getDemoProductById('nope', 'eu', 'EUR'), null);
});

test('every demo product affiliateLink carries affiliate tracking (aff_fcid)', () => {
  for (const region of ['il', 'eu'] as const) {
    for (const p of getDemoProducts(region, region === 'il' ? 'ILS' : 'EUR')) {
      assert.ok(
        p.affiliateLink.includes('aff_fcid='),
        `demo product ${p.id} (${region}) affiliateLink missing aff_fcid: ${p.affiliateLink}`,
      );
    }
  }
});

test('ensureTrackedLink appends aff_fcid to a raw AliExpress item URL', () => {
  const out = ensureTrackedLink('https://www.aliexpress.com/item/1005007002.html');
  assert.ok(out.startsWith('https://www.aliexpress.com/item/1005007002.html'));
  assert.ok(out.includes('aff_fcid='), `expected aff_fcid in ${out}`);
});

test('ensureTrackedLink leaves an already-tracked URL unchanged', () => {
  const tracked = 'https://www.aliexpress.com/item/1005007002.html?aff_fcid=shopli';
  assert.equal(ensureTrackedLink(tracked), tracked);
});

test('ensureTrackedLink leaves "#" unchanged', () => {
  assert.equal(ensureTrackedLink('#'), '#');
});

test('ensureTrackedLink leaves non-AliExpress URLs unchanged', () => {
  const other = 'https://example.com/item/123';
  assert.equal(ensureTrackedLink(other), other);
});
