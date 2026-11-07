import { test } from 'node:test';
import assert from 'node:assert/strict';
import { COLLECTION_CONTENT, collectionByline } from '../lib/collection-content';

test('every editorial collection carries a real ISO publish date', () => {
  for (const [slug, c] of Object.entries(COLLECTION_CONTENT)) {
    assert.match(c.published, /^\d{4}-\d{2}-\d{2}$/, slug);
    assert.ok(!Number.isNaN(Date.parse(c.published)), slug);
  }
});

test('byline names Shopli and a readable date in the page language', () => {
  const en = collectionByline('2026-07-15', 'en');
  assert.equal(en.iso, '2026-07-15');
  assert.match(en.text, /Shopli/);
  assert.match(en.text, /July 15, 2026/);
  const he = collectionByline('2026-07-15', 'he');
  assert.match(he.text, /[֐-׿]/);
  for (const lang of ['fr', 'de', 'es', 'it', 'ru']) {
    assert.match(collectionByline('2026-07-15', lang).text, /Shopli/, lang);
  }
});

test('the date does not shift with the server time zone', () => {
  assert.match(collectionByline('2026-07-01', 'en').text, /\b1\b/);
});
