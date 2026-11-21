#!/usr/bin/env node
// Fails the build when public copy breaks a rule in AGENTS.md ("Public copy").
// Usage: node scripts/check-copy.mjs [root]

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.argv[2] || process.cwd();
const SCAN = ['pages', 'components', 'lib'];
const SKIP = [/^pages\/api\//, /^pages\/admin\//];

// Checked on the text a visitor can reach: comments are stripped first.
const TEXT_RULES = [
  {
    id: 'internal-note',
    re: /Keep #\d|(?<![&\w])#\d{2}(?![0-9a-fA-F\w])|Skills IL/,
    why: 'Working notes (ticket numbers, tool versions) do not belong in text a visitor reads.',
  },
  {
    id: 'named-rival',
    re: /iwishbag|dutydecoder|rateships|gateway ?lines/i,
    why: 'Pages explain our own product. They do not name or criticise other sites.',
  },
  {
    id: 'unbacked-claim',
    re: /quality guaranteed|unbeatable|איכות מובטחת|מחירים מטורפים|qualité garantie|Qualitätsgarantie|qualità garantita|calidad garantizada|гарантия качества/i,
    why: 'We link out to sellers and guarantee nothing. Say what the data shows instead.',
  },
  {
    id: 'vat-spelling',
    re: /מע[״"]ם/,
    why: 'The abbreviation is מע״מ, with a regular mem.',
  },
];

// Checked on the whole file, comments included: these are never legitimate.
const FILE_RULES = [
  {
    id: 'stray-script',
    re: /[\uAC00-\uD7AF\u4E00-\u9FFF\u3040-\u30FF\u300C\u300D]/,
    why: 'Korean, Chinese or Japanese characters in a site that publishes none of those languages.',
  },
  {
    id: 'glued-word',
    re: /[\u05D0-\u05EA][A-Za-z]|[A-Za-z][\u05D0-\u05EA]/,
    why: 'A Hebrew letter glued to a Latin one. Separate them with a space or a hyphen.',
  },
];

// A page that grows past its budget has usually had sections appended instead of edited.
const LINE_BUDGETS = { 'pages/landed.tsx': 500, 'components/MarketplaceHowTo.tsx': 260 };

// On a tool page the tool comes before any explanation of it.
const ORDER_RULES = [
  { file: 'pages/landed.tsx', first: 'data-landed-calculator', before: '<h2' },
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.tsx?$/.test(name)) out.push(full);
  }
  return out;
}

/** Blanks comments but keeps line breaks, so reported line numbers stay true. */
function stripComments(src) {
  const blank = (m) => m.replace(/[^\n]/g, ' ');
  return src.replace(/\/\*[\s\S]*?\*\//g, blank).replace(/(^|[^:'"`\\])\/\/[^\n]*/g, (m, lead) => lead + blank(m.slice(lead.length)));
}

const problems = [];
const report = (file, line, rule, text) =>
  problems.push(`${file}:${line}  [${rule.id}] ${rule.why}\n    ${text.trim().slice(0, 140)}`);

function scanLines(file, text, rules) {
  text.split('\n').forEach((line, i) => {
    for (const rule of rules) if (rule.re.test(line)) report(file, i + 1, rule, line);
  });
}

for (const dir of SCAN) {
  for (const full of walk(join(ROOT, dir))) {
    const file = relative(ROOT, full).split('\\').join('/');
    if (SKIP.some((re) => re.test(file))) continue;
    const src = readFileSync(full, 'utf8');
    scanLines(file, stripComments(src), TEXT_RULES);
    scanLines(file, src, FILE_RULES);

    const budget = LINE_BUDGETS[file];
    const lines = src.split('\n').length;
    if (budget && lines > budget) {
      problems.push(`${file}  [line-budget] ${lines} lines, budget ${budget}. Replace or merge a section instead of adding one.`);
    }
    for (const rule of ORDER_RULES.filter((r) => r.file === file)) {
      const a = src.indexOf(rule.first);
      const b = src.indexOf(rule.before);
      if (a < 0 || (b >= 0 && b < a)) {
        problems.push(`${file}  [tool-first] "${rule.first}" must appear before the first "${rule.before}".`);
      }
    }
  }
}

if (problems.length) {
  console.error(`Public copy check failed (${problems.length}):\n\n${problems.join('\n\n')}\n\nRules: AGENTS.md, "Public copy".`);
  process.exit(1);
}
console.log('Public copy check passed.');
