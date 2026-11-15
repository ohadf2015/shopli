import test from 'node:test';
import assert from 'node:assert/strict';
import { BLOG_COLLECTIONS, COMPARISON_COLLECTIONS, relatedForCollection } from '../lib/related-content';
import { COLLECTIONS } from '../lib/collections';
import { blogPosts } from '../lib/blog';
import { getAllComparisonSlugs } from '../lib/comparisons';

const collectionSlugs = new Set(COLLECTIONS.map((c) => c.slug));

test('every linked collection exists', () => {
  for (const [page, slugs] of Object.entries({ ...BLOG_COLLECTIONS, ...COMPARISON_COLLECTIONS })) {
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
