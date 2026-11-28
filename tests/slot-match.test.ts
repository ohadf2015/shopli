import test from 'node:test';
import assert from 'node:assert/strict';
import { pickDistinct, slotMatches } from '../lib/slot-match';
import { MOOD_BOARDS } from '../lib/moodboards';

const slot = (slug: string, caption: string) => {
  const item = MOOD_BOARDS[slug].items.find((i) => i.caption.en === caption);
  assert.ok(item, `${slug}: no slot ${caption}`);
  return item!;
};

test('titles seen on live boards land only in the slot they belong to', () => {
  const nori = slot('sushi-night', 'Nori Seaweed Sheets (50pk)');
  assert.equal(slotMatches('DIY Seaweed Nori Punch Cutter Rice Ball Molds Smile Face', nori), false);
  assert.equal(slotMatches('6 in 1 Sushi Maker Box Onigiri Mold Triangle Sushi Mold', nori), false);
  assert.equal(slotMatches('Roasted Seaweed Nori Sheets for Sushi 50 Sheets', nori), true);

  const paddle = slot('sushi-night', 'Rice Paddle (Shamoji)');
  assert.equal(slotMatches('Nonstick Rice Spoon Kitchen Supplies Rice Cooker Rice Shovel', paddle), true);
  assert.equal(slotMatches('1PC-Rosewood Spoon Rest Holder Storage Rack Rice Spoon Spatula', paddle), false);

  const wig = slot('jack-sparrow', 'Dreadlock Wig with Beads');
  assert.equal(slotMatches('Pirate Hat Faux Leather Brown Vintage Captain Hat Cosplay', wig), false);
  assert.equal(slotMatches('Captain Pirate Cosplay Wig Long Dreadlocks with Beads', wig), true);

  const boots = slot('jack-sparrow', 'Pirate Boots');
  assert.equal(slotMatches('Medieval Men Arm Cosplay Gauntlet Bracer Viking Knight', boots), false);
  assert.equal(slotMatches('Faux Leather Pirate Boots Costume Shoe Covers', boots), true);

  const earbuds = slot('wireless-audio', 'TWS Noise-Cancelling Earbuds');
  assert.equal(slotMatches('Hard Shell Earbuds Case Carrying Box', earbuds), false);
});

test('matching is at the start of a word, not inside one', () => {
  assert.equal(slotMatches('Chat Box Holder', { match: ['hat'] }), false);
  assert.equal(slotMatches('Sun Hat UV Protection', { match: ['hat'] }), true);
  assert.equal(slotMatches('Pull-Up Bar Doorway', { match: ['pull-up'] }), true);
});

test('a product shows in the first slot that wants it and nowhere after', () => {
  const p = (id: string) => ({ id });
  const out = pickDistinct([[p('a'), p('b')], [p('a'), p('c'), p('d')], [p('b')]], 2);
  assert.deepEqual(out.map((l) => l.map((x) => x.id)), [['a', 'b'], ['c', 'd'], []]);
});

test('every mood board slot has a match rule in lower case', () => {
  for (const b of Object.values(MOOD_BOARDS)) {
    for (const item of b.items) {
      assert.ok(item.match.length > 0, `${b.slug}: ${item.caption.en} has no match`);
      for (const n of [...item.match, ...(item.not || [])]) assert.equal(n, n.toLowerCase(), `${b.slug}: ${n}`);
    }
  }
});
