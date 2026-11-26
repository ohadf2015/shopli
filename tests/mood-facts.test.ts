import test from 'node:test';
import assert from 'node:assert/strict';
import { kitFacts, kitSummary, moodTitle, pickReason, reasonLine } from '../lib/mood-facts';
import { MOOD_BOARDS } from '../lib/moodboards';

const p = (id: string, price: number, rating = 0, volume = 0) => ({ id, title: id, price, rating, volume });
const money = (n: number) => `€${n.toFixed(2)}`;

test('kit facts sum the first pick and the cheapest pick per slot', () => {
  const f = kitFacts([
    { caption: 'Hat', products: [p('a', 5, 96, 100), p('b', 3, 90, 50)] },
    { caption: 'Shirt', products: [p('c', 10, 94, 1000)] },
    { caption: 'Boots', products: [p('d', 8, 92, 10), p('e', 9, 99, 5)] },
    { caption: 'Empty', products: [] },
  ]);
  assert.deepEqual(f, { pieces: 3, pickTotal: 23, cheapestTotal: 21, totalOrders: 1165 });
});

test('fewer than three filled slots is no kit', () => {
  assert.equal(kitFacts([{ caption: 'a', products: [p('a', 1)] }, { caption: 'b', products: [p('b', 0)] }]), null);
});

test('a pick reason claims only what is true across the shown listings', () => {
  const r = pickReason([p('a', 5, 96, 1200), p('b', 3, 98, 50)]);
  assert.deepEqual(r?.kinds, ['most-ordered']);
  assert.equal(reasonLine('en', r!), 'Our first pick is rated 4.8 out of 5 with 1.2k orders, the most ordered of the 2 options here.');
  const solo = pickReason([p('a', 5, 0, 40)]);
  assert.deepEqual(solo?.kinds, []);
  assert.equal(reasonLine('en', solo!), 'Our first pick has 40 orders.');
  assert.match(reasonLine('he', r!), /הכי נמכר מבין 2 האפשרויות/);
});

test('title and summary use the live totals', () => {
  const f = { pieces: 6, pickTotal: 27.4, cheapestTotal: 19.8, totalOrders: 48210 };
  assert.equal(moodTitle('Sushi Kit', 'en', f, money), 'Sushi Kit: 6-Piece Set From €19.80');
  assert.match(kitSummary('en', f, money), /costs €27\.40 today, or €19\.80/);
  assert.match(kitSummary('en', { ...f, cheapestTotal: 27.4 }, money), /also the cheapest/);
  assert.equal(moodTitle('Sushi Kit', 'en', null, money), 'Sushi Kit');
});

test('mood board copy carries no typed prices', () => {
  const typed = /[€$£₪]\s?\d|\d\s?[€₪]|under\s+[€$£₪]|פחות מ-?₪/i;
  for (const b of Object.values(MOOD_BOARDS)) {
    for (const field of [b.h1, b.metaTitle, b.metaDesc, b.intro]) {
      for (const text of Object.values(field)) assert.doesNotMatch(text, typed, `${b.slug}: ${text}`);
    }
  }
});
