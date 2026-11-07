import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';

// Hiding an element by pushing it far off-screen (left: -9999px and the like)
// widens right-to-left pages by that much. On Nov 7 2026 a honeypot field did
// exactly that, and every Hebrew page carrying the deal-alerts form rendered
// as an empty cream screen. Hide things by clipping them in place instead.
const OFFSCREEN = /(left|right|inset-inline-start|inset-inline-end|insetInlineStart|insetInlineEnd)\s*:\s*['"]?-\d{4,}px/;

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(tsx|ts|css)$/.test(entry.name)) out.push(full);
  }
  return out;
}

test('no element is hidden by a huge off-screen offset (breaks RTL pages)', () => {
  const root = path.resolve(__dirname, '..', '..');
  const files = ['components', 'pages', 'styles'].flatMap((d) => walk(path.join(root, d)));
  const offenders = files.filter((f) => OFFSCREEN.test(fs.readFileSync(f, 'utf8')));
  assert.deepEqual(offenders.map((f) => path.relative(root, f)), []);
});
