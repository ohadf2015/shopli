import test from 'node:test';
import assert from 'node:assert/strict';
import { blogPosts, getBlogPostsForRegion, isBlogPostInRegion } from '../lib/blog';

test('a region-restricted post is published only in its own region', () => {
  const restricted = blogPosts.filter((p) => p.regions?.length);
  assert.ok(restricted.length > 0, 'expected at least one region-restricted post');

  for (const post of restricted) {
    for (const region of post.regions!) {
      assert.ok(isBlogPostInRegion(post.slug, region), `${post.slug} should publish in ${region}`);
    }
    // Anywhere else it must 404, not render a page about another country's rules.
    for (const other of ['eu', 'us', 'de', 'fr']) {
      if (post.regions!.includes(other)) continue;
      assert.equal(isBlogPostInRegion(post.slug, other), false, `${post.slug} must not publish in ${other}`);
    }
  }
});

test('unrestricted posts publish everywhere', () => {
  const open = blogPosts.filter((p) => !p.regions);
  assert.ok(open.length > 0);
  for (const region of ['il', 'eu', 'us', 'ru']) {
    const slugs = getBlogPostsForRegion(region).map((p) => p.slug);
    for (const post of open) {
      assert.ok(slugs.includes(post.slug), `${post.slug} missing from ${region}`);
    }
  }
});

test('getBlogPostsForRegion returns newest first', () => {
  const dates = getBlogPostsForRegion('il').map((p) => new Date(p.publishDate).getTime());
  assert.deepEqual(dates, [...dates].sort((a, b) => b - a));
});

test('an unknown slug is not in any region', () => {
  assert.equal(isBlogPostInRegion('does-not-exist', 'il'), false);
});

test('every post has the Hebrew and English fields the /il and /eu pages read', () => {
  // t() falls back to en, so a missing he silently ships English to the Hebrew
  // audience — the one that actually visits. Fail loudly instead.
  for (const post of blogPosts) {
    for (const field of ['title', 'metaDesc', 'intro'] as const) {
      assert.ok(post[field].he?.trim(), `${post.slug}: ${field} missing he`);
      assert.ok(post[field].en?.trim(), `${post.slug}: ${field} missing en`);
    }
    assert.ok(post.sections.length > 0, `${post.slug}: no sections`);
    for (const s of post.sections) {
      assert.ok(s.heading.he?.trim() && s.body.he?.trim(), `${post.slug}: a section is missing he`);
    }
    for (const f of post.faq) {
      assert.ok(f.q.he?.trim() && f.a.he?.trim(), `${post.slug}: an faq entry is missing he`);
    }
  }
});

test('slugs are unique', () => {
  const slugs = blogPosts.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});
