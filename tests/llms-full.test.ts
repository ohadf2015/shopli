import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildLlmsFullTxt } from '../lib/llms-full';
import { blogPosts } from '../lib/blog';
import { comparisons } from '../lib/comparisons';

test('llms-full carries every published guide and comparison with its text', () => {
  const txt = buildLlmsFullTxt();
  for (const p of blogPosts.filter((p) => (p.category as string) !== 'draft')) {
    assert.ok(txt.includes(`/blog/${p.slug}`), p.slug);
    assert.ok(txt.includes(p.intro.en), p.slug);
  }
  for (const c of comparisons) assert.ok(txt.includes(`/compare/${c.slug}`), c.slug);
  assert.ok(!txt.includes('undefined'));
});
