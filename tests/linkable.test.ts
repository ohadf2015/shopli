import { test } from 'node:test';
import assert from 'node:assert/strict';
import { keepLinkable } from '../lib/linkable';

const p = (id: string) => ({ id, title: `p${id}` });

test('drops products the by-id lookup answered without', async () => {
  const lookup = async (ids: string[]) => ids.filter((id) => id !== '2').map((id) => ({ id }));
  const kept = await keepLinkable([p('1'), p('2'), p('3')], lookup);
  assert.deepEqual(kept.map((x) => x.id), ['1', '3']);
});

test('an empty answer is an outage, not a verdict: keeps the batch', async () => {
  const kept = await keepLinkable([p('1'), p('2')], async () => []);
  assert.deepEqual(kept.map((x) => x.id), ['1', '2']);
});

test('a failed lookup keeps the batch', async () => {
  const kept = await keepLinkable([p('1'), p('2')], async () => {
    throw new Error('rate limited');
  });
  assert.deepEqual(kept.map((x) => x.id), ['1', '2']);
});

test('looks up at most 4 ids per call and keeps the original order', async () => {
  const calls: string[][] = [];
  const lookup = async (ids: string[]) => {
    calls.push(ids);
    return ids.filter((id) => id !== '5').map((id) => ({ id }));
  };
  const kept = await keepLinkable(['1', '2', '3', '4', '5', '6'].map(p), lookup);
  assert.deepEqual(calls.map((c) => c.length), [4, 2]);
  assert.deepEqual(kept.map((x) => x.id), ['1', '2', '3', '4', '6']);
});

test('one batch failing does not let another batch drop its misses', async () => {
  const lookup = async (ids: string[]) => {
    if (ids.includes('1')) return [];
    return ids.filter((id) => id !== '6').map((id) => ({ id }));
  };
  const kept = await keepLinkable(['1', '2', '3', '4', '5', '6'].map(p), lookup);
  assert.deepEqual(kept.map((x) => x.id), ['1', '2', '3', '4', '5']);
});
