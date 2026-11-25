import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ENTITY_FACTS } from '../lib/entity-map';

const read = (f: string) => readFileSync(f, 'utf8').replace(/\s+/g, ' ');

test('every entity-map quote still appears word for word in its source file', () => {
  assert.ok(ENTITY_FACTS.length >= 5);
  for (const f of ENTITY_FACTS) {
    const src = read(f.file);
    for (const part of f.parts ?? [f.quote]) assert.ok(src.includes(part), `${f.label}: ${part}`);
  }
});

test('the entity map is in the sitemap, footer and llms.txt', () => {
  for (const f of ['pages/sitemap.xml.tsx', 'components/Footer.tsx', 'pages/llms.txt.tsx']) {
    assert.ok(read(f).includes('/entity-map'), f);
  }
});
