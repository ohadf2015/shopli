/**
 * Acceptance tests for PDP hard-404 (docs/specs/pdp-hard-404.md).
 *
 * Dual-failure (AE + demo both miss) must surface as Next.js `{ notFound: true }`,
 * not HTTP 200 + in-page not-found props. Demo fallback must still serve when AE fails.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { SearchProduct } from '../lib/aliexpress';
import { getDemoProductById } from '../lib/demo-products';
import { resolvePdpProduct, pdpGsspWhenMissing } from '../lib/pdp';

function fakeProduct(id: string): SearchProduct {
  return {
    id,
    sku: '',
    title: `Product ${id}`,
    price: 1,
    originalPrice: null,
    currency: 'EUR',
    imageUrl: '',
    images: [],
    affiliateLink: `https://www.aliexpress.com/item/${id}.html`,
    rating: 0,
    reviewCount: 0,
    volume: 0,
    category: '',
    categoryPath: '',
    shopName: '',
    shopId: '',
    discount: '',
    commissionRate: 0,
    freeShipping: false,
  };
}

test('dual-failure: AE empty + unknown demo id → null product', async () => {
  const product = await resolvePdpProduct('invalid-stale-id-999', 'eu', 'EUR', {
    getProductsByIds: async () => [],
    getDemoProductById,
  });
  assert.equal(product, null);
});

test('dual-failure: AE throws + unknown demo id → null product', async () => {
  const product = await resolvePdpProduct('invalid-stale-id-999', 'eu', 'EUR', {
    getProductsByIds: async () => {
      throw new Error('upstream outage');
    },
    getDemoProductById,
  });
  assert.equal(product, null);
});

test('GSSP maps missing product to Next.js { notFound: true } (not props soft-404)', () => {
  const result = pdpGsspWhenMissing();
  assert.deepEqual(result, { notFound: true });
  assert.ok(!('props' in result), 'must not wrap notFound inside props (soft-404)');
});

test('demo fallback: AE empty but known catalog id → serves demo product', async () => {
  const product = await resolvePdpProduct('1005007001', 'eu', 'EUR', {
    getProductsByIds: async () => [],
    getDemoProductById,
  });
  assert.ok(product, 'demo product must be returned');
  assert.equal(product!.id, '1005007001');
  assert.equal(product!.currency, 'EUR');
  assert.match(product!.title, /Wireless Charger|מטען/i);
});

test('demo fallback: AE throws but known catalog id → serves demo product', async () => {
  const product = await resolvePdpProduct('1005007001', 'il', 'ILS', {
    getProductsByIds: async () => {
      throw new Error('network');
    },
    getDemoProductById,
  });
  assert.ok(product);
  assert.equal(product!.id, '1005007001');
  assert.equal(product!.currency, 'ILS');
});

test('AE hit: live product used without requiring demo', async () => {
  const live = fakeProduct('live-ae-42');
  let demoCalled = false;
  const product = await resolvePdpProduct('live-ae-42', 'eu', 'EUR', {
    getProductsByIds: async (ids) => {
      assert.deepEqual(ids, ['live-ae-42']);
      return [live];
    },
    getDemoProductById: (id, region, currency) => {
      demoCalled = true;
      return getDemoProductById(id, region, currency);
    },
  });
  assert.equal(product, live);
  assert.equal(demoCalled, false, 'demo must not be consulted when AE succeeds');
});
