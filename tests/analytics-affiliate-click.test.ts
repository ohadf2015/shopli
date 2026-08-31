/**
 * Regression test for affiliate_click payload quality.
 *
 * Baseline (HogQL, tryshopli.com, last 7d as of 2026-08-31): every
 * affiliate_click carried `region=null` and `price` as a string, and the
 * direct affiliate CTAs on /compare and /mood carried no data-* attributes,
 * so those clicks lost product_id/category/price entirely.
 *
 * Locks both halves: the parsers in lib/analytics.ts, and the presence of the
 * data-* attributes on every outbound AliExpress CTA that isn't a ProductCard.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { regionFromPath, numericPrice } from '../lib/analytics';

test('regionFromPath reads the locale segment off the path', () => {
  assert.equal(regionFromPath('/il/compare'), 'il');
  assert.equal(regionFromPath('/us/mood/gifts-for-her'), 'us');
  assert.equal(regionFromPath('/eu/product/1005006'), 'eu');
  assert.equal(regionFromPath('/ru'), 'ru');
});

test('regionFromPath returns undefined for non-region paths', () => {
  assert.equal(regionFromPath('/'), undefined);
  assert.equal(regionFromPath('/deals'), undefined);
  assert.equal(regionFromPath('/blog/best-gifts'), undefined);
});

test('numericPrice makes price a number, never a string', () => {
  assert.equal(numericPrice('12.90'), 12.9);
  assert.equal(numericPrice('0'), 0);
  assert.equal(numericPrice('1005'), 1005);
});

test('numericPrice drops unparseable prices instead of sending NaN', () => {
  assert.equal(numericPrice(''), undefined);
  assert.equal(numericPrice(null), undefined);
  assert.equal(numericPrice(undefined), undefined);
  assert.equal(numericPrice('₪12.90'), undefined);
});

// The delegated tracker reads metadata off the closest [data-product-id]
// ancestor, so a CTA without these attrs produces a metadata-less event.
const REQUIRED_ATTRS = ['data-product-id', 'data-product-title', 'data-price', 'data-currency', 'data-category'];

const CTA_PAGES = [
  'pages/[region]/compare/index.tsx',
  'pages/[region]/compare/[slug].tsx',
  'pages/[region]/mood/[mood].tsx',
  'pages/[region]/product/[id].tsx',
];

// ponytail: substring check over source, not per-anchor. compare/index.tsx has two
// CTA blocks — this catches "attrs deleted from the page", not "from one of two CTAs".
// Upgrade to a per-anchor parse only if a partial regression actually ships.
test('every page with a direct affiliate CTA tags it with product metadata', () => {
  for (const rel of CTA_PAGES) {
    // __dirname is .test-build/tests at runtime, so hop two levels to the repo root.
    const src = readFileSync(join(__dirname, '../..', rel), 'utf8');
    for (const attr of REQUIRED_ATTRS) {
      assert.ok(src.includes(attr), `${rel} is missing ${attr} on its affiliate CTA`);
    }
  }
});
