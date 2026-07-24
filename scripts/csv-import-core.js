// Shared CSV import core for shopli collections.
// Used by scripts/import-collections.js (CLI) and pages/api/admin/import.ts (web).
// Plain CommonJS so both Node CLI and Next.js API routes can require it without a build step.

const VALID_ICONS = ['mask', 'run', 'monitor', 'bulb', 'chef', 'plane', 'tent', 'music', 'smartphone', 'sun', 'backpack', 'paw', 'car', 'lamp', 'camera'];
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const GOOGLE_CAT_RE = /^\d{1,7}$/;

const REQUIRED_COLUMNS = ['slug', 'name_en', 'keywords'];
const ALL_COLUMNS = ['slug', 'name_en', 'name_he', 'desc_en', 'desc_he', 'keywords', 'icon', 'google_category'];

function parseCSV(text) {
  // Minimal RFC-4180-ish parser: handles quoted fields, escaped quotes, commas/newlines inside quotes.
  const rows = [];
  let field = '';
  let row = [];
  let inQuotes = false;
  const src = String(text).replace(/^﻿/, '');
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field); field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && src[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some(v => v.trim() !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    if (row.some(v => v.trim() !== '')) rows.push(row);
  }
  return rows;
}

/**
 * Validate CSV text into collection definitions.
 * @param {string} text raw CSV
 * @param {string[]} existingSlugs slugs already in lib/collections.ts
 * @returns {{ rows: Array, valid: Array, errors: Array, summary: object }}
 */
function validateCSV(text, existingSlugs = []) {
  const table = parseCSV(text);
  if (table.length === 0) {
    return { rows: [], valid: [], errors: [{ row: 0, slug: '', errors: ['CSV is empty'] }], summary: { total: 0, ok: 0, failed: 1 } };
  }
  const header = table[0].map(h => h.trim().toLowerCase());
  const missingCols = REQUIRED_COLUMNS.filter(c => !header.includes(c));
  if (missingCols.length > 0) {
    return { rows: [], valid: [], errors: [{ row: 1, slug: '', errors: [`Missing required columns: ${missingCols.join(', ')}. Expected: ${ALL_COLUMNS.join(', ')}`] }], summary: { total: 0, ok: 0, failed: 1 } };
  }
  const colIdx = {};
  for (const c of ALL_COLUMNS) colIdx[c] = header.indexOf(c);

  const seen = new Set(existingSlugs);
  const rows = [];
  const valid = [];
  const errors = [];

  for (let r = 1; r < table.length; r++) {
    const raw = table[r];
    const get = (c) => (colIdx[c] >= 0 && raw[colIdx[c]] !== undefined ? raw[colIdx[c]].trim() : '');
    const rowNum = r + 1; // 1-based incl. header
    const entry = {
      slug: get('slug'),
      name_en: get('name_en'),
      name_he: get('name_he'),
      desc_en: get('desc_en'),
      desc_he: get('desc_he'),
      keywords: get('keywords').split('|').map(k => k.trim()).filter(Boolean),
      icon: get('icon'),
      google_category: get('google_category'),
    };
    const rowErrors = [];
    if (!entry.slug) rowErrors.push('slug is required');
    else if (!SLUG_RE.test(entry.slug)) rowErrors.push(`slug "${entry.slug}" must be lowercase kebab-case (a-z, 0-9, hyphens)`);
    else if (seen.has(entry.slug)) rowErrors.push(`slug "${entry.slug}" already exists (duplicate)`);
    if (!entry.name_en) rowErrors.push('name_en is required');
    if (entry.keywords.length === 0) rowErrors.push('keywords is required (pipe-separated, e.g. "kw one|kw two")');
    if (entry.keywords.length > 6) rowErrors.push(`too many keywords (${entry.keywords.length}) — max 6`);
    if (entry.icon && !VALID_ICONS.includes(entry.icon)) rowErrors.push(`icon "${entry.icon}" not in allowed set: ${VALID_ICONS.join(', ')}`);
    if (entry.google_category && !GOOGLE_CAT_RE.test(entry.google_category)) rowErrors.push(`google_category "${entry.google_category}" must be a numeric Google taxonomy ID`);

    const record = { row: rowNum, slug: entry.slug, name_en: entry.name_en, keywords: entry.keywords, errors: rowErrors };
    rows.push(record);
    if (rowErrors.length > 0) {
      errors.push(record);
    } else {
      seen.add(entry.slug);
      valid.push(entry);
    }
  }

  return {
    rows,
    valid,
    errors,
    summary: { total: table.length - 1, ok: valid.length, failed: errors.length },
  };
}

/** Escape a JS string literal for embedding in generated TS. */
function tsStr(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/**
 * Render validated entries as TypeScript CollectionDef snippets matching lib/collections.ts style.
 */
function renderCollectionsTS(valid) {
  return valid.map(e => {
    const kw = e.keywords.map(k => `'${tsStr(k)}'`).join(', ');
    const lines = [
      `  {`,
      `    slug: '${tsStr(e.slug)}',`,
      `    keywords: [${kw}],`,
      `    name: { en: '${tsStr(e.name_en)}'${e.name_he ? `, he: '${tsStr(e.name_he)}'` : ''} },`,
    ];
    if (e.desc_en) {
      lines.push(`    desc: { en: '${tsStr(e.desc_en)}'${e.desc_he ? `, he: '${tsStr(e.desc_he)}'` : ''} },`);
    }
    lines.push(`    icon: '${tsStr(e.icon || 'bulb')}',`);
    if (e.google_category) {
      lines.push(`    googleCategory: '${tsStr(e.google_category)}',`);
    }
    lines.push(`  },`);
    return lines.join('\n');
  }).join('\n');
}

/**
 * Append entries into lib/collections.ts source before the closing "];" of COLLECTIONS.
 * Returns new source or throws if marker not found.
 */
function appendToCollectionsSource(source, valid) {
  const marker = '\n];\n';
  const idx = source.lastIndexOf(marker);
  if (idx === -1) throw new Error('Could not find COLLECTIONS closing marker "];" in lib/collections.ts');
  const snippet = renderCollectionsTS(valid);
  return source.slice(0, idx) + '\n' + snippet + source.slice(idx);
}

const TEMPLATE_CSV = [
  ALL_COLUMNS.join(','),
  'example-slug,Example Collection,אוסף לדוגמה,Short English description,תיאור קצר בעברית,keyword one|keyword two|keyword three,bulb,488',
].join('\n');

module.exports = { parseCSV, validateCSV, renderCollectionsTS, appendToCollectionsSource, TEMPLATE_CSV, ALL_COLUMNS, VALID_ICONS };