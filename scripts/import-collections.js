#!/usr/bin/env node
/**
 * Bulk CSV collection importer for shopli.
 *
 * Usage:
 *   node scripts/import-collections.js <file.csv>            # validate + preview only
 *   node scripts/import-collections.js <file.csv> --commit   # validate + append to lib/collections.ts
 *   node scripts/import-collections.js --template            # print a template CSV
 *
 * CSV columns: slug,name_en,name_he,desc_en,desc_he,keywords,icon,google_category
 *   - keywords: pipe-separated ("kw one|kw two"), 1-6 per collection
 *   - each valid collection = up to 10 new products in the Google Shopping feed
 */
const fs = require('fs');
const path = require('path');
const { validateCSV, renderCollectionsTS, appendToCollectionsSource, TEMPLATE_CSV } = require('./csv-import-core');

const COLLECTIONS_PATH = path.join(__dirname, '..', 'lib', 'collections.ts');

function existingSlugs() {
  const src = fs.readFileSync(COLLECTIONS_PATH, 'utf8');
  return [...src.matchAll(/slug:\s*'([^']+)'/g)].map(m => m[1]);
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--template')) {
    process.stdout.write(TEMPLATE_CSV + '\n');
    return;
  }
  const file = args.find(a => !a.startsWith('--'));
  const commit = args.includes('--commit');
  if (!file) {
    console.error('Usage: node scripts/import-collections.js <file.csv> [--commit] | --template');
    process.exit(2);
  }
  if (!fs.existsSync(file)) {
    console.error(`File not found: ${file}`);
    process.exit(2);
  }

  const text = fs.readFileSync(file, 'utf8');
  const { rows, valid, errors, summary } = validateCSV(text, existingSlugs());

  console.log('=== Import preview ===');
  for (const r of rows) {
    if (r.errors.length === 0) {
      console.log(`  OK    row ${r.row}: ${r.slug} (${r.name_en}) — ${r.keywords.length} keywords`);
    } else {
      console.log(`  FAIL  row ${r.row}: ${r.slug || '(no slug)'}`);
      for (const e of r.errors) console.log(`        - ${e}`);
    }
  }
  console.log(`\nSummary: ${summary.total} rows, ${summary.ok} valid, ${summary.failed} failed`);
  console.log(`Estimated new feed products: ~${valid.length * 10} (10 items per collection)`);

  if (!commit) {
    console.log('\nDry run — re-run with --commit to append valid rows to lib/collections.ts');
    if (valid.length > 0) {
      console.log('\n--- Generated TypeScript (preview) ---');
      console.log(renderCollectionsTS(valid));
    }
    process.exit(errors.length > 0 ? 1 : 0);
  }

  if (valid.length === 0) {
    console.error('\nNothing to commit — 0 valid rows.');
    process.exit(1);
  }
  const src = fs.readFileSync(COLLECTIONS_PATH, 'utf8');
  const next = appendToCollectionsSource(src, valid);
  fs.writeFileSync(COLLECTIONS_PATH, next);
  console.log(`\nCommitted ${valid.length} collections to lib/collections.ts (${errors.length} rows skipped).`);
  console.log('Next: npm run build && git commit && push — the Google Shopping feed picks new collections up automatically.');
  process.exit(errors.length > 0 ? 1 : 0);
}

main();
