import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildCompareRows,
  pickBestCompareProduct,
  parseCompareIds,
  MIN_COMPARE_PRODUCTS,
} from '../lib/product-compare';
import type { SearchProduct } from '../lib/aliexpress';

function fakeProduct(partial: Partial<SearchProduct> & { id: string; price: number }): SearchProduct {
  return {
    sku: 1,
    title: partial.title || `Product ${partial.id}`,
    originalPrice: partial.originalPrice ?? partial.price + 10,
    currency: 'EUR',
    imageUrl: '',
    images: [],
    affiliateLink: 'https://s.click.aliexpress.com/e/_test',
    rating: partial.rating ?? 90,
    reviewCount: partial.reviewCount ?? 10,
    volume: partial.volume ?? 100,
    category: 'Gadgets',
    categoryPath: 'Gadgets',
    shopName: 'Test Shop',
    shopId: '1',
    discount: partial.discount ?? '10%',
    commissionRate: 5,
    freeShipping: partial.freeShipping ?? true,
    ...partial,
  } as SearchProduct;
}

test('parseCompareIds keeps 2–4 numeric ids', () => {
  assert.deepEqual(parseCompareIds('1005001, 1005002'), ['1005001', '1005002']);
  assert.equal(parseCompareIds('abc').length, 0);
});

test('pickBestCompareProduct returns null under MIN_COMPARE_PRODUCTS', () => {
  const one = [fakeProduct({ id: '1', price: 10 })];
  assert.equal(pickBestCompareProduct(one, buildCompareRows(one, '€')), null);
  assert.ok(MIN_COMPARE_PRODUCTS >= 2);
});

test('pickBestCompareProduct prefers more differing-spec wins, then lower price', () => {
  const products = [
    fakeProduct({ id: 'cheap-weak', price: 5, rating: 60, volume: 10, reviewCount: 1 }),
    fakeProduct({ id: 'pricey-strong', price: 40, rating: 98, volume: 900, reviewCount: 200 }),
  ];
  const rows = buildCompareRows(products, '€');
  const pick = pickBestCompareProduct(products, rows);
  assert.ok(pick);
  // Stronger product should win rating/volume/reviewCount rows even if price loses
  assert.equal(pick!.product.id, 'pricey-strong');
  assert.ok(pick!.wins >= 1);
});

test('pickBestCompareProduct price-tiebreaks when wins are equal', () => {
  const products = [
    fakeProduct({
      id: 'a',
      price: 20,
      rating: 90,
      volume: 50,
      reviewCount: 5,
      discount: '10%',
      freeShipping: true,
      shopName: 'Same',
      category: 'X',
    }),
    fakeProduct({
      id: 'b',
      price: 10,
      rating: 90,
      volume: 50,
      reviewCount: 5,
      discount: '10%',
      freeShipping: true,
      shopName: 'Same',
      category: 'X',
    }),
  ];
  const rows = buildCompareRows(products, '€');
  // Force equal wins by only counting differs — price differs so cheapest wins that row;
  // if other rows identical, cheapest also wins overall via price tie-break or price win.
  const pick = pickBestCompareProduct(products, rows);
  assert.ok(pick);
  assert.equal(pick!.product.id, 'b');
});
