import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clampDescription, getSeoHead } from '../lib/seo';

test('clampDescription leaves short text alone', () => {
  assert.equal(clampDescription('Short and sweet.'), 'Short and sweet.');
});

test('clampDescription ends long text on a word boundary within 160 chars', () => {
  const long =
    'RGB Ambient Light Strip USB 5V LED 5050 Music Sync Flexible Tape Smart Home Lights Remote APP Control for TV Backlight Room Decoration Party Gaming Desk Setup Bedroom';
  const out = clampDescription(long);
  assert.ok(out.length <= 160, String(out.length));
  assert.ok(out.endsWith('…'));
  assert.ok(long.startsWith(out.slice(0, -1)), 'is a prefix of the original');
  assert.ok(!/\s…$/.test(out));
});

test('getSeoHead clamps the meta and social descriptions', () => {
  const head = getSeoHead({ region: 'eu', description: 'word '.repeat(60) });
  for (const m of head.meta) {
    if ((m as any).name === 'description' || (m as any).property === 'og:description') {
      assert.ok((m as any).content.length <= 160);
    }
  }
});
