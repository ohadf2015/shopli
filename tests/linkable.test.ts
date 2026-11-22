import { test } from 'node:test';
import assert from 'node:assert/strict';
import { keepLinkable } from '../lib/linkable';
import { offersChecked } from '../lib/cache';

const p = (id: string) => ({ id, title: `p${id}` });

test('drops products the by-id lookup answered without', async () => {
  const lookup = async (ids: string[]) => ids.filter((id) => id !== '2').map((id) => ({ id }));
  const kept = await keepLinkable([p('1'), p('2'), p('3')], lookup);
  assert.deepEqual(kept.map((x) => x.id), ['1', '3']);
});

test('looks up each id on its own, the way the product page does', async () => {
  const calls: string[][] = [];
  const lookup = async (ids: string[]) => {
    calls.push(ids);
    return ids.map((id) => ({ id }));
  };
  await keepLinkable(['1', '2', '3'].map(p), lookup);
  assert.deepEqual(calls, [['1'], ['2'], ['3']]);
});

test('every lookup coming back empty is an outage, not a verdict: keeps all', async () => {
  const kept = await keepLinkable([p('1'), p('2')], async () => []);
  assert.deepEqual(kept.map((x) => x.id), ['1', '2']);
});

test('every lookup failing keeps all', async () => {
  const kept = await keepLinkable([p('1'), p('2')], async () => {
    throw new Error('rate limited');
  });
  assert.deepEqual(kept.map((x) => x.id), ['1', '2']);
});

test('keeps the original order', async () => {
  const lookup = async (ids: string[]) => (ids[0] === '5' ? [] : [{ id: ids[0] }]);
  const kept = await keepLinkable(['1', '2', '3', '4', '5', '6'].map(p), lookup);
  assert.deepEqual(kept.map((x) => x.id), ['1', '2', '3', '4', '6']);
});

const card = (id: string, price: number) => ({ id, title: `p${id}`, price, originalPrice: price + 1, currency: 'EUR', discount: '10%' });

test('a kept card carries the by-id price, the one its product page shows', async () => {
  const lookup = async (ids: string[]) => [{ id: ids[0], price: 30.19, originalPrice: null, currency: 'EUR', discount: '' }];
  const [kept] = await keepLinkable([card('1', 23.19)], lookup);
  assert.equal(kept.price, 30.19);
  assert.equal(kept.originalPrice, null);
  assert.equal(kept.discount, '');
  assert.equal(kept.title, 'p1');
});

test('a by-id answer without a price leaves the card price alone', async () => {
  const lookup = async (ids: string[]) => [{ id: ids[0], price: 0 }];
  const [kept] = await keepLinkable([card('1', 23.19)], lookup);
  assert.equal(kept.price, 23.19);
  assert.equal(kept.originalPrice, 24.19);
});

test('every lookup failing keeps the search prices', async () => {
  const kept = await keepLinkable([card('1', 5), card('2', 6)], async () => {
    throw new Error('rate limited');
  });
  assert.deepEqual(kept.map((x) => x.price), [5, 6]);
});

test('every lookup failing marks the cards unchecked; a resolved lookup does not', async () => {
  const failed = await keepLinkable([card('1', 5)], async () => {
    throw new Error('rate limited');
  });
  assert.equal(offersChecked(failed), false);
  const ok = await keepLinkable([card('1', 5)], async (ids) => [{ id: ids[0], price: 6 }]);
  assert.equal(offersChecked(ok), true);
});
