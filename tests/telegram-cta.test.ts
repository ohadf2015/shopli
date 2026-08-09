/**
 * Regression test for t_c80e5c43 — dead "Join Telegram" CTAs.
 *
 * /us and /eu linked to t.me/shopli_us and t.me/shopli_eu, both nonexistent
 * (t.me/s/<name> returns 302). The only verified-existing channel in the
 * product is `shoppingisraelnew` (Hebrew, Israel). Locales without a real
 * channel must NOT expose a Telegram CTA.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { REGIONS } from '../lib/regions';
import { organizationJsonLd } from '../lib/seo';

// Channels verified live (t.me/s/<name> -> HTTP 200) as of 2026-07-29.
const VERIFIED_CHANNELS = new Set(['shoppingisraelnew']);

test('every tgChannel in REGIONS is a verified-existing channel', () => {
  for (const [code, config] of Object.entries(REGIONS)) {
    if (config.tgChannel) {
      assert.ok(
        VERIFIED_CHANNELS.has(config.tgChannel),
        `region "${code}" points at unverified channel "${config.tgChannel}"`,
      );
    }
  }
});

test('us and eu locales expose no Telegram CTA (no real channel exists)', () => {
  assert.equal(REGIONS.us.tgChannel, undefined);
  assert.equal(REGIONS.eu.tgChannel, undefined);
});

test('il and ru keep the real shoppingisraelnew channel', () => {
  assert.equal(REGIONS.il.tgChannel, 'shoppingisraelnew');
  assert.equal(REGIONS.ru.tgChannel, 'shoppingisraelnew');
});

test('organization JSON-LD sameAs lists only existing channels', () => {
  const { sameAs } = organizationJsonLd();
  for (const url of sameAs) {
    const m = url.match(/^https:\/\/t\.me\/(.+)$/);
    assert.ok(m, `unexpected non-telegram sameAs URL: ${url}`);
    assert.ok(
      VERIFIED_CHANNELS.has(m[1]),
      `sameAs advertises dead channel: ${url}`,
    );
  }
});

test('Header has no silent fallback to the Hebrew IL channel for other locales', () => {
  const src = readFileSync(join(__dirname, '../../components/Header.tsx'), 'utf8');
  assert.ok(
    !src.includes("|| 'shoppingisraelnew'"),
    'Header.tsx still falls back to shoppingisraelnew when tgChannel is undefined',
  );
});
