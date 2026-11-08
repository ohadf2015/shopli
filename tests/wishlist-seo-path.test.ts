import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

test('wishlist SeoHead path has no region prefix (SeoHead adds it)', () => {
  const src = readFileSync(join(process.cwd(), 'pages/[region]/wishlist.tsx'), 'utf8');
  assert.match(src, /path="\/wishlist"/);
  assert.doesNotMatch(src, /path=\{`\/\$\{region\}\/wishlist`\}/);
});
