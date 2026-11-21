#!/usr/bin/env node
/**
 * Print today's Telegram post without sending it.
 *
 * The cron endpoint has a ?dry=1 mode, but CRON_SECRET is a Vercel *Sensitive*
 * variable — `vercel env pull` returns it empty — so that mode cannot be
 * triggered by hand. Without this script the first time MarkdownV2 parsing
 * meets the real Telegram API would be a live post to a live channel.
 *
 * Reads the compiled output of `npm test` (tsconfig.test.json), so:
 *   npm test && node scripts/telegram-preview.mjs il
 *
 * Needs DATABASE_URL, nothing else. No bot token, no secret, sends nothing.
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// .env.local, as written by `vercel env pull` — values are quoted, and a naive
// parser turns a working credential into an InvalidAppKey mystery.
try {
  for (const line of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    process.env[m[1]] ||= v;
  }
} catch {
  // No .env.local is fine if the variables are already exported.
}

let getPicks, buildPickPost, getRegion;
try {
  ({ getPicks } = require('../.test-build/lib/picks.js'));
  ({ buildPickPost } = require('../.test-build/lib/telegram.js'));
  ({ getRegion } = require('../.test-build/lib/regions.js'));
} catch {
  console.error('Build the TS first:  npm test');
  process.exit(1);
}

const region = process.argv[2] || 'il';
const count = parseInt(process.argv[3], 10) || 4;

const picks = (await getPicks(region, { limit: 12 })).slice(0, count);
if (!picks.length) {
  console.log(`No picks for ${region}; the cron would post nothing today.`);
} else {
  for (const p of picks) {
    const post = buildPickPost(region, p, { currencySymbol: getRegion(region).currencySymbol });
    console.log(`[photo] ${post.photo}\n${post.caption}\n${post.buttons.map((b) => `[${b.text}] ${b.url}`).join('\n')}\n`);
  }
}
