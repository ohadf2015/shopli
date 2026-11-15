import test from 'node:test';
import assert from 'node:assert/strict';
import { collectionFacts, formatOrders } from '../lib/collection-facts';

const p = (id: string, price: number, rating: number, volume: number) => ({ id, title: id, price, rating, volume });

test('needs at least three priced products', () => {
  assert.equal(collectionFacts([p('a', 1, 90, 1), p('b', 2, 90, 1)]), null);
  assert.equal(collectionFacts([p('a', 1, 90, 1), p('a', 2, 90, 1), p('c', 0, 90, 1)]), null);
});

test('picks top rated, most ordered and cheapest without repeats', () => {
  const f = collectionFacts([p('rated', 10, 99, 50), p('popular', 8, 92, 5000), p('cheap', 2, 91, 10), p('mid', 6, 93, 20)])!;
  assert.equal(f.count, 4);
  assert.equal(f.minPrice, 2);
  assert.equal(f.maxPrice, 10);
  assert.equal(f.topRated?.id, 'rated');
  assert.equal(f.mostOrdered?.id, 'popular');
  assert.equal(f.cheapest?.id, 'cheap');
  assert.equal(f.totalOrders, 5080);
});

test('drops a slot rather than mislabel a runner-up', () => {
  const f = collectionFacts([p('best', 1, 99, 9000), p('b', 5, 90, 10), p('c', 6, 91, 20)])!;
  assert.equal(f.topRated?.id, 'best');
  assert.equal(f.mostOrdered, null);
  assert.equal(f.cheapest, null);
  const g = collectionFacts([p('rated', 10, 99, 50), p('cheap', 2, 91, 9000), p('c', 6, 91, 20)])!;
  assert.equal(g.mostOrdered?.id, 'cheap');
  assert.equal(g.cheapest, null);
});

test('formats order counts', () => {
  assert.equal(formatOrders(950), '950');
  assert.equal(formatOrders(1234), '1.2k');
  assert.equal(formatOrders(45678), '46k');
});
