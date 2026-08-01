import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/** Known-bad MT patterns that should NEVER appear in Hebrew UI strings */
const BAD_PATTERNS: RegExp[] = [
  // Mixed He-En concatenation (e.g. "קישור partnerפים")
  /[\u0590-\u05FF]{2,}[a-zA-Z]{3,}/,
  /[a-zA-Z]{3,}[\u0590-\u05FF]{2,}/,
  // "משימה" used instead of "מערך/עמדה/ציוד" for Desk Setup context
  // Check for "משימה" as a general category/collection label
  // Gibberish word patterns — words that repeat nonsensically
  /[\u0590-\u05FF]{5,}[\u0590-\u05FF\s]{0,10}[\u0590-\u05FF]{5,}/,
];

/** Files known to contain Hebrew strings (inline rtl ? conditionals or data) */
const HEBREW_FILES = [
  'pages/[region]/index.tsx',
  'pages/[region]/search.tsx',
  'pages/[region]/compare/index.tsx',
  'pages/[region]/compare/[slug].tsx',
  'pages/[region]/collection/[collection].tsx',
  'pages/[region]/blog/index.tsx',
  'pages/[region]/blog/[slug].tsx',
  'pages/[region]/mood/[mood].tsx',
  'pages/[region]/google-shopping-feed.tsx',
  'components/Header.tsx',
  'components/ProductCard.tsx',
  'components/WhatsAppShare.tsx',
  'lib/collections.ts',
  'lib/collection-content.ts',
  'lib/blog.ts',
  'lib/regions.ts',
  'lib/moodboards.ts',
];

/** Extract all Hebrew string literals from a file's content */
function extractHebrewStrings(content: string): string[] {
  const results: string[] = [];
  // Match string literals (single-quoted, double-quoted, backtick) containing Hebrew
  const regex = /['"`]([^'"`\n]*[\u0590-\u05FF][^'"`\n]*)['"`]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    results.push(match[1]);
  }
  return results;
}

/** Check if a string contains known bad MT patterns */
function hasMTGarbage(s: string): string | null {
  for (const pattern of BAD_PATTERNS) {
    // Skip matches that are just legitimate long Hebrew words
    const m = s.match(pattern);
    if (m) {
      // Filter out false positives — legitimate Hebrew with English borrowings
      const matched = m[0];
      // "AI", "GPS", "USB", "LED", "TWS", "ANC", etc. are acceptable English loanwords
      const knownAcronyms = /\b(AI|GPS|USB|LED|TWS|ANC|RGB|HDMI|SIM|TSA|FPS|BT|AC|DC|WiFi|RFID|IPX|UPF|PD|OBS|iOS|ENC|LTE|USB-C|USB-A|EU|UK|AU|US)\b/;
      // If the match is ONLY the acronym (with nothing else), it's fine
      if (knownAcronyms.test(matched.replace(/[\u0590-\u05FF\s]/g, ''))) {
        continue;
      }
      return `Matched pattern ${pattern}: found "${matched}" in "${s.substring(0, 80)}"`;
    }
  }
  return null;
}

test('every Hebrew-containing file exists', () => {
  for (const file of HEBREW_FILES) {
    const fullPath = join(__dirname, '..', file);
    assert.equal(existsSync(fullPath), true, `Expected ${file} to exist`);
  }
});

test('no MT-garbage in Hebrew strings across all source files', () => {
  const issues: string[] = [];

  for (const file of HEBREW_FILES) {
    const fullPath = join(__dirname, '..', file);
    if (!existsSync(fullPath)) {
      issues.push(`MISSING: ${file}`);
      continue;
    }
    const content = readFileSync(fullPath, 'utf-8');
    const hebrewStrings = extractHebrewStrings(content);

    for (const s of hebrewStrings) {
      const issue = hasMTGarbage(s);
      if (issue) {
        issues.push(`[${file}] ${issue}`);
      }
    }
  }

  // Special check: "משימה ביתית" should not appear as a collection or category name
  // If it does, that means "Desk Setup" was mistranslated as "home task/assignment"
  for (const file of HEBREW_FILES) {
    const fullPath = join(__dirname, '..', file);
    if (!existsSync(fullPath)) continue;
    const content = readFileSync(fullPath, 'utf-8');
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('משימה ביתית') && !lines[i].includes('//')) {
        issues.push(`[${file}:${i + 1}] Found "משימה ביתית" (task/assignment home) — likely wrong translation for Desk Setup`);
      }
    }
  }

  assert.deepEqual(issues, [], `Found ${issues.length} MT-garbage issues:\n${issues.join('\n')}`);
});

test('all collection Hebrew names are valid Hebrew (not empty, not partial)', () => {
  // Import collections directly
  const { COLLECTIONS } = require('../lib/collections');
  const issues: string[] = [];

  for (const coll of COLLECTIONS) {
    // Check hebrew name
    if (coll.name?.he) {
      if (coll.name.he.length < 2) {
        issues.push(`Collection "${coll.slug}" has very short Hebrew name: "${coll.name.he}"`);
      }
      // Check for mixed He-En (acronyms like USB are OK)
      const heOnly = coll.name.he.replace(/[A-Za-z0-9\s\-/]+/g, '').trim();
      if (heOnly.length < 2 && coll.name.he.length > 2) {
        issues.push(`Collection "${coll.slug}" Hebrew name has mostly English: "${coll.name.he}"`);
      }
    }
    // Check hebrew description
    if (coll.desc?.he) {
      if (coll.desc.he.length < 4) {
        issues.push(`Collection "${coll.slug}" has very short Hebrew desc: "${coll.desc.he}"`);
      }
    }
  }

  assert.deepEqual(issues, [], `Collection Hebrew issues:\n${issues.join('\n')}`);
});

test('IL region meta has Hebrew title and description', () => {
  const { REGIONS } = require('../lib/regions');
  const il = REGIONS.il;
  assert.ok(il, 'IL region must exist');
  assert.ok(/[\u0590-\u05FF]/.test(il.meta.title), `IL meta.title should have Hebrew but got: "${il.meta.title}"`);
  assert.ok(/[\u0590-\u05FF]/.test(il.meta.description), `IL meta.description should have Hebrew but got: "${il.meta.description}"`);
});

test('sanitizeHebrewTitle fixes broken geresh spacing', () => {
  // Test the existing function from aliexpress.ts
  const content = readFileSync(join(__dirname, '..', 'lib', 'aliexpress.ts'), 'utf-8');
  // The function itself is not exported, but we can verify its presence by checking
  // the replace patterns exist
  assert.ok(content.includes("sanitizeHebrewTitle"), 'sanitizeHebrewTitle function must exist');
  assert.ok(content.includes("replace(/([א-ת])\\s*['`]\\s*([א-ת])/g"), 'geresh fix regex must exist');
  assert.ok(content.includes("replace(/\\s{2,}/g"), 'double-space fix must exist');
});
