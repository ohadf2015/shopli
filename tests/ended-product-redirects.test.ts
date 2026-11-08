import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';

const nextConfig = require(path.join(process.cwd(), 'next.config.js'));

test('an ended product with direct visits redirects permanently to its collection in the same region', async () => {
  const redirects: Array<{ source: string; destination: string; permanent: boolean }> =
    await nextConfig.redirects();
  const rule = redirects.find((r) => r.source.endsWith('/product/1005011681039717'));
  assert.ok(rule);
  assert.equal(rule.permanent, true);
  assert.equal(rule.source, '/:region/product/1005011681039717');
  assert.equal(rule.destination, '/:region/collection/content-creator');
});
