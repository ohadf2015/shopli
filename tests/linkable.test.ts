import { test } from 'node:test';
import assert from 'node:assert/strict';
import { keepLinkable } from '../lib/linkable';

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
