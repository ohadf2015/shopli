import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ensureTrackedLink } from '../lib/api';
import {
  DEMO_PRODUCT_IDS,
  getDemoProducts,
  getDemoProductById,
} from '../lib/demo-products';

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

test('every demo product affiliateLink contains the affiliate tracking param', () => {
  for (const region of ['il', 'eu', 'us']) {
    for (const p of getDemoProducts(region, 'USD')) {
      assert.ok(
        p.affiliateLink.includes('aff_fcid='),
        `affiliateLink for ${p.id} in ${region} is missing aff_fcid: ${p.affiliateLink}`
      );
    }
  }
});

test('ensureTrackedLink appends aff_fcid only to raw AliExpress item URLs', () => {
  const raw = 'https://www.aliexpress.com/item/1005007002.html';
  const tracked = ensureTrackedLink(raw);
  assert.ok(tracked.includes('aff_fcid='), `expected aff_fcid in ${tracked}`);
  assert.ok(tracked.startsWith(raw), `expected ${tracked} to start with ${raw}`);
});

test('ensureTrackedLink leaves already-tracked AliExpress URLs unchanged', () => {
  const already = 'https://www.aliexpress.com/item/1005007002.html?aff_fcid=shopli';
  assert.equal(ensureTrackedLink(already), already);
});

test('ensureTrackedLink leaves non-AliExpress and placeholder URLs unchanged', () => {
  assert.equal(ensureTrackedLink('#'), '#');
  assert.equal(
    ensureTrackedLink('https://example.com/product/123'),
    'https://example.com/product/123'
  );
});
