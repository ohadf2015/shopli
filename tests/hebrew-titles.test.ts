import { test } from 'node:test';
import assert from 'node:assert/strict';

import { cleanGeneratedTitle, parseGeneratedTitles } from '../lib/hebrew-titles';

test('cleanGeneratedTitle accepts a short natural Hebrew title', () => {
  assert.equal(cleanGeneratedTitle('מטחנת קפה חשמלית', 'garbled source'), 'מטחנת קפה חשמלית');
  assert.equal(cleanGeneratedTitle('TIMEMORE פרנץ׳ פרס', 'garbled source'), 'TIMEMORE פרנץ׳ פרס');
});

test('cleanGeneratedTitle strips wrapping quotes and collapses whitespace', () => {
  assert.equal(cleanGeneratedTitle('"מטחנת  קפה"', 'src'), 'מטחנת קפה');
});

test('cleanGeneratedTitle rejects titles with no Hebrew', () => {
  assert.equal(cleanGeneratedTitle('Electric Coffee Grinder', 'src'), null);
  assert.equal(cleanGeneratedTitle('12345', 'src'), null);
});

test('cleanGeneratedTitle rejects near-copies of the garbled source', () => {
  const src = 'TIMEMORE צרפתי עיתונות עיתונות, מכונת קפה תה';
  assert.equal(cleanGeneratedTitle(src, src), null);
});

test('cleanGeneratedTitle rejects keyword-stuffing length and sizes', () => {
  assert.equal(cleanGeneratedTitle('מטחנת קפה חשמלית מטחנת קפה מטחנת קפה מטחנת קפה מטחנת קפה', 'src'), null);
  assert.equal(cleanGeneratedTitle('מטחנת קפה 48 מ"מ', 'src'), null);
  assert.equal(cleanGeneratedTitle('קפה', 'src'), null); // single word
});

test('parseGeneratedTitles parses a bare JSON array', () => {
  const rows = parseGeneratedTitles('[{"id":"1","title":"מטחנת קפה"}]');
  assert.deepEqual(rows, [{ id: '1', title: 'מטחנת קפה' }]);
});

test('parseGeneratedTitles tolerates ```json fences and prose', () => {
  const text = 'Here you go:\n```json\n[{"id":"1","title":"פרנץ׳ פרס"},{"id":"2","title":"סיר מוקה"}]\n```\nHope this helps!';
  const rows = parseGeneratedTitles(text);
  assert.equal(rows.length, 2);
  assert.equal(rows[1].id, '2');
});

test('parseGeneratedTitles returns [] on garbage', () => {
  assert.deepEqual(parseGeneratedTitles('no json here'), []);
  assert.deepEqual(parseGeneratedTitles('[{"broken":'), []);
  assert.deepEqual(parseGeneratedTitles(''), []);
});

test('parseGeneratedTitles drops entries without an id', () => {
  const rows = parseGeneratedTitles('[{"title":"מטחנת קפה"},{"id":"3","title":"סיר מוקה"}]');
  assert.deepEqual(rows, [{ id: '3', title: 'סיר מוקה' }]);
});
