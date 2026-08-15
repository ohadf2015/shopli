import { test } from 'node:test';
import assert from 'node:assert/strict';
import { THEMES, getThemeGroups, themeForCollection } from '../lib/collection-themes';
import { getAllCollections } from '../lib/collections';

test('every collection belongs to exactly one theme', () => {
  // Adding a collection without placing it should fail here, not silently
  // vanish from the menu.
  const placed = THEMES.flatMap((t) => t.slugs);
  const dupes = placed.filter((s, i) => placed.indexOf(s) !== i);
  assert.deepEqual(dupes, [], 'a collection is in two themes');

  const real = getAllCollections().filter((c) => c.name || c.tag).map((c) => c.slug);
  const missing = real.filter((s) => !placed.includes(s));
  assert.deepEqual(missing, [], 'collection with no theme');
});

test('no theme points at a collection that does not exist', () => {
  const real = new Set(getAllCollections().map((c) => c.slug));
  const ghosts = THEMES.flatMap((t) => t.slugs).filter((s) => !real.has(s));
  assert.deepEqual(ghosts, []);
});

test('a menu of themes is small enough to scan', () => {
  // The whole point: 78 choices became a handful.
  assert.ok(THEMES.length <= 8, `${THEMES.length} themes is another wall`);
});

test('groups are localized and resolve their collections', () => {
  const he = getThemeGroups('he');
  assert.equal(he.length, THEMES.length);
  assert.ok(he.every((g) => g.collections.length > 0));
  const home = he.find((g) => g.key === 'home')!;
  assert.ok(home.name.he);
  assert.ok(home.collections.some((c) => c.slug === 'kitchen'));
});

test('a collection can name its theme', () => {
  assert.equal(themeForCollection('gel-nails')?.key, 'makeup-nails');
  assert.equal(themeForCollection('not-a-collection'), undefined);
});

test('groups survive getServerSideProps serialization', () => {
  // Next refuses to serialize `undefined`, and CollectionDef.icon is optional —
  // which 500'd every homepage and the hub until icon defaulted to null.
  const groups = getThemeGroups('en');
  const seen: string[] = [];
  JSON.stringify(groups, (k, v) => {
    if (v === undefined) seen.push(k);
    return v;
  });
  assert.deepEqual(seen, []);
});
