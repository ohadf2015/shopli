import test from 'node:test';
import assert from 'node:assert/strict';
import { BLOG_COLLECTIONS, COMPARISON_COLLECTIONS, MOOD_COLLECTIONS, moodsForCollection, relatedForCollection, relatedForMood } from '../lib/related-content';
import { MOOD_BOARDS } from '../lib/moodboards';
import { COLLECTIONS } from '../lib/collections';
import { blogPosts } from '../lib/blog';
import { getAllComparisonSlugs } from '../lib/comparisons';

const collectionSlugs = new Set(COLLECTIONS.map((c) => c.slug));

test('every linked collection exists', () => {
  for (const [page, slugs] of Object.entries({ ...BLOG_COLLECTIONS, ...COMPARISON_COLLECTIONS, ...MOOD_COLLECTIONS })) {
    for (const s of slugs) assert.ok(collectionSlugs.has(s), `${page} links missing collection ${s}`);
  }
});

test('every linked guide and comparison exists', () => {
  const blog = new Set(blogPosts.map((p) => p.slug));
  for (const s of Object.keys(BLOG_COLLECTIONS)) assert.ok(blog.has(s), `missing guide ${s}`);
  const cmp = new Set(getAllComparisonSlugs());
  for (const s of Object.keys(COMPARISON_COLLECTIONS)) assert.ok(cmp.has(s), `missing comparison ${s}`);
});

test('every comparison article links at least one collection', () => {
  for (const s of getAllComparisonSlugs()) {
    assert.ok((COMPARISON_COLLECTIONS[s] || []).length > 0, `comparison ${s} links no collection`);
  }
});

test('collection lookup inverts the maps', () => {
  const r = relatedForCollection('home-gym');
  assert.deepEqual(r.blog, ['best-home-gym-under-500']);
  assert.deepEqual(r.compare, ['resistance-bands-vs-dumbbells']);
  assert.deepEqual(relatedForCollection('nail-art'), { blog: [], compare: [] });
});

test('every mood board links at least one collection, and only real boards are mapped', () => {
  for (const slug of Object.keys(MOOD_BOARDS)) assert.ok((MOOD_COLLECTIONS[slug] || []).length > 0, `mood ${slug} links no collection`);
  for (const slug of Object.keys(MOOD_COLLECTIONS)) assert.ok(MOOD_BOARDS[slug], `missing mood ${slug}`);
});

test('mood boards pick up guides through shared collections and link back', () => {
  assert.ok(relatedForMood('home-gym-pro').blog.includes('best-home-gym-under-500'));
  assert.ok(relatedForMood('digital-nomad').blog.includes('best-power-bank-guide-2026'));
  assert.ok(moodsForCollection('halloween').includes('jack-sparrow'));
});
