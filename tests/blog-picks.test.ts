import test from 'node:test';
import assert from 'node:assert/strict';
import { pickCandidates, pickPageSize, priceInUsd } from '../lib/blog-picks';
import { blogPosts, isBlogPostInRegion } from '../lib/blog';

test('priceInUsd converts the currencies the regions use, and gives up on others', () => {
  assert.equal(priceInUsd(10, 'USD'), 10);
  assert.ok(Math.abs((priceInUsd(36, 'ILS') ?? 0) - 10) < 0.01);
  assert.ok((priceInUsd(10, 'EUR') ?? 0) > 10);
  assert.ok((priceInUsd(10, 'gbp') ?? 0) > 10);
  assert.equal(priceInUsd(10, 'JPY'), null);
  assert.equal(priceInUsd(10, undefined), null);
});

test('a price floor drops the accessories but keeps the order the API returned', () => {
  // Shapes of the 2026-11-15 "power bank 20000mAh 22.5W" results for il.
  const results = [
    { id: 'toocki', price: 50.38, currency: 'ILS' },
    { id: 'essager', price: 81.69, currency: 'ILS' },
    { id: 'empty-18650-shell', price: 23.98, currency: 'ILS' },
    { id: 'qoovi', price: 50.39, currency: 'ILS' },
  ];
  assert.deepEqual(pickCandidates(results, 10).map((p) => p.id), ['toocki', 'essager', 'qoovi']);
});

test('no floor means no filtering', () => {
  const results = [{ price: 1, currency: 'USD' }, { price: 2, currency: 'USD' }];
  assert.equal(pickCandidates(results), results);
});

test('an unconvertible currency is kept rather than emptying the pick', () => {
  assert.equal(pickCandidates([{ price: 1, currency: 'XYZ' }], 50).length, 1);
});

test('titleIncludes keeps only the named model, with no fallback', () => {
  const results = [
    { id: 'a810', title: '70mai A810 4K+1080P dash cam', price: 97, currency: 'USD' },
    { id: 'a810s', title: '70mai a810s 4K dash cam', price: 97, currency: 'USD' },
  ];
  assert.deepEqual(pickCandidates(results, 50, ['A810S']).map((p) => p.id), ['a810s']);
  assert.equal(pickCandidates(results.slice(0, 1), 50, ['A810S']).length, 0);
});

test('a floored pick asks for a wider result page', () => {
  assert.equal(pickPageSize({ name: 'a', keyword: 'a' }), 6);
  assert.equal(pickPageSize({ name: 'a', keyword: 'a', minPriceUsd: 10 }), 20);
  assert.equal(pickPageSize({ name: 'a', keyword: 'a', titleIncludes: ['X1'] }), 20);
});

test('every guide links only to posts that exist, and every pick has a keyword', () => {
  for (const post of blogPosts) {
    for (const slug of post.relatedPosts || []) {
      assert.ok(isBlogPostInRegion(slug, 'il') || isBlogPostInRegion(slug, 'us'), `${post.slug} links to missing post ${slug}`);
    }
    for (const pick of post.relatedProducts) {
      assert.ok(pick.keyword.trim(), `${post.slug} has a pick without a keyword`);
    }
  }
});

test('slugs are unique', () => {
  const slugs = blogPosts.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});
