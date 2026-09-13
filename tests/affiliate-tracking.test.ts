import { test } from 'node:test';
import assert from 'node:assert/strict';

import { ensureAffiliateTracking } from '../lib/aliexpress';
import { getDemoProducts } from '../lib/demo-products';
import { sanitizeWishlistIds } from '../lib/newsletter';

const TID = process.env.ALIEXPRESS_TRACKING_ID || 'shopli';

test('bare item URL gets aff_fcid appended', () => {
  const out = ensureAffiliateTracking('https://www.aliexpress.com/item/1005007001.html', '1005007001');
  assert.equal(out, `https://www.aliexpress.com/item/1005007001.html?aff_fcid=${TID}`);
});

test('bare URL with existing query string uses &', () => {
  const out = ensureAffiliateTracking('https://www.aliexpress.com/item/1.html?x=1', '1');
  assert.equal(out, `https://www.aliexpress.com/item/1.html?x=1&aff_fcid=${TID}`);
});

test('s.click deep links are left untouched', () => {
  const url = 'https://s.click.aliexpress.com/s/AbC123';
  assert.equal(ensureAffiliateTracking(url, '1'), url);
});

test('URLs already carrying an aff_ param are left untouched', () => {
  const url = 'https://www.aliexpress.com/item/1.html?aff_fcid=abc';
  assert.equal(ensureAffiliateTracking(url, '1'), url);
});

test('empty URL falls back to a generated tracked link from the product id', () => {
  assert.equal(
    ensureAffiliateTracking('', '1005007001'),
    `https://www.aliexpress.com/item/1005007001.html?aff_fcid=${TID}`,
  );
});

test('non-AliExpress URLs are left untouched', () => {
  const url = 'https://example.com/item/1.html';
  assert.equal(ensureAffiliateTracking(url, '1'), url);
});

test('every demo product carries a tracked affiliate link (kg 88 regression)', () => {
  for (const p of getDemoProducts('il', 'ILS')) {
    assert.match(p.affiliateLink, /aff_fcid=/, `demo product ${p.id} has no tracking`);
    assert.match(p.affiliateLink, new RegExp(`/item/${p.id}\\.html`), `demo product ${p.id} wrong item url`);
  }
});

test('sanitizeWishlistIds keeps plausible ids, dedupes, drops junk', () => {
  const out = sanitizeWishlistIds([
    '1005007001',
    ' 1005007002 ',
    '1005007001', // dupe
    'abc',        // not numeric
    '123',        // too short
    '1'.repeat(25), // too long
    null,
    1005007003,   // numbers coerced
  ]);
  assert.deepEqual(out, ['1005007001', '1005007002', '1005007003']);
});

test('sanitizeWishlistIds caps at 50 and ignores non-arrays', () => {
  assert.equal(sanitizeWishlistIds(Array.from({ length: 80 }, (_, i) => String(100000000000 + i))).length, 50);
  assert.deepEqual(sanitizeWishlistIds('1005007001'), []);
  assert.deepEqual(sanitizeWishlistIds(undefined), []);
});
