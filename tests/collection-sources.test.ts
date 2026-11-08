import { test } from 'node:test';
import assert from 'node:assert/strict';
import { COLLECTION_CONTENT } from '../lib/collection-content';

test('the zero-waste guide cites Eurostat for its packaging-waste figure', () => {
  const guide = COLLECTION_CONTENT['zero-waste'];
  assert.match(guide.intro.en, /181 kg/);
  assert.ok(guide.sources?.some((s) => s.url.startsWith('https://ec.europa.eu/eurostat/')));
});

test('the home-bar guide links the official IBA specs for the cocktails it recommends', () => {
  const urls = (COLLECTION_CONTENT['home-bar'].sources || []).map((s) => s.url);
  assert.ok(urls.includes('https://iba-world.com/iba-cocktail/daiquiri/'));
  assert.ok(urls.includes('https://iba-world.com/iba-cocktail/whiskey-sour/'));
});

test('every cited source is an https link with a label in English', () => {
  for (const guide of Object.values(COLLECTION_CONTENT)) {
    for (const s of guide.sources || []) {
      assert.match(s.url, /^https:\/\//);
      assert.ok(s.label.en);
    }
  }
});
