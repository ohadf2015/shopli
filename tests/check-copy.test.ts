import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const SCRIPT = path.join(process.cwd(), 'scripts', 'check-copy.mjs');

function run(files: Record<string, string>) {
  const root = mkdtempSync(path.join(tmpdir(), 'copy-check-'));
  for (const dir of ['pages', 'components', 'lib']) mkdirSync(path.join(root, dir));
  for (const [name, body] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(root, name)), { recursive: true });
    writeFileSync(path.join(root, name), body);
  }
  const res = spawnSync(process.execPath, [SCRIPT, root], { encoding: 'utf8' });
  return { code: res.status, out: res.stdout + res.stderr };
}

const CLEAN_LANDED = '<section data-landed-calculator />\n<h2>How it works</h2>\n';

test('the repository itself passes', () => {
  const res = spawnSync(process.execPath, [SCRIPT], { encoding: 'utf8' });
  assert.equal(res.status, 0, res.stdout + res.stderr);
});

test('clean copy passes, and dev comments with ticket numbers are not copy', () => {
  const res = run({
    'pages/landed.tsx': CLEAN_LANDED,
    'lib/a.ts': "// fixed in #42\nexport const t = 'מע״מ 18%';\nconst color = '#141414';\nconst url = 'https://example.com/a';\n",
  });
  assert.equal(res.code, 0, res.out);
});

test('each rule fails the check on its own', () => {
  const cases: Record<string, Record<string, string>> = {
    'internal-note': { 'lib/a.ts': "export const t = 'VAT is 18%. Keep #19 / #23';\n" },
    'named-rival': { 'components/A.tsx': '<p>iWishBag still says 17%</p>\n' },
    'unbacked-claim': { 'lib/a.ts': "export const d = 'Unbeatable prices, quality guaranteed.';\n" },
    'vat-spelling': { 'lib/a.ts': "export const t = 'מע״ם 18%';\n" },
    'stray-script': { 'lib/a.ts': "export const t = 'מוצרים 멋 טובים';\n" },
    'glued-word': { 'lib/a.ts': "export const t = 'נגדים, LEDים וחוטים';\n" },
    'tool-first': { 'pages/landed.tsx': '<h2>Why we are right</h2>\n<section data-landed-calculator />\n' },
    'line-budget': { 'pages/landed.tsx': CLEAN_LANDED + '<p />\n'.repeat(600) },
  };
  for (const [rule, files] of Object.entries(cases)) {
    const res = run({ 'pages/landed.tsx': CLEAN_LANDED, ...files });
    assert.equal(res.code, 1, `${rule} should fail`);
    assert.match(res.out, new RegExp(`\\[${rule}\\]`), `${rule} should be named`);
  }
});

test('api and admin routes are not public copy', () => {
  const res = run({ 'pages/landed.tsx': CLEAN_LANDED, 'pages/api/x.ts': "export const t = 'see #42';\n" });
  assert.equal(res.code, 0, res.out);
});
