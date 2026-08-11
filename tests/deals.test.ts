import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidRegion, REGIONS } from '../lib/regions';
import {
  detectDealsLang,
  dealsLangToRegion,
  getDealsCopy,
  DEALS_COLLECTIONS_COUNT,
  DEALS_PRODUCTS_PER_COLLECTION,
} from '../lib/deals';

test('isValidRegion accepts every configured region', () => {
  for (const code of Object.keys(REGIONS)) {
    assert.equal(isValidRegion(code), true, `expected ${code} to be valid`);
  }
});

test('isValidRegion rejects unknown slugs that used to render the EU homepage', () => {
  for (const bogus of ['deals', 'category', 'smart-shopping-il', '', 'IL', 'EU', 'xx']) {
    assert.equal(isValidRegion(bogus), false, `expected "${bogus}" to be invalid`);
  }
});

test('detectDealsLang maps Hebrew Accept-Language to he', () => {
  assert.equal(detectDealsLang('he-IL,he;q=0.9,en-US;q=0.8'), 'he');
  assert.equal(detectDealsLang('he'), 'he');
});

test('detectDealsLang falls back to en', () => {
  assert.equal(detectDealsLang('en-US,en;q=0.9'), 'en');
  assert.equal(detectDealsLang(undefined), 'en');
  assert.equal(detectDealsLang(''), 'en');
});

test('dealsLangToRegion maps he to il and en to eu', () => {
  assert.equal(dealsLangToRegion('he'), 'il');
  assert.equal(dealsLangToRegion('en'), 'eu');
});

test('getDealsCopy returns fully populated localized copy', () => {
  for (const lang of ['he', 'en'] as const) {
    const copy = getDealsCopy(lang);
    for (const key of ['title', 'description', 'h1', 'subtitle', 'freshnessLabel', 'viewAll', 'emptyLabel', 'fullSiteCta', 'dateLocale'] as const) {
      assert.ok(copy[key].length > 0, `${lang}.${key} must be non-empty`);
    }
  }
  assert.notEqual(getDealsCopy('he').title, getDealsCopy('en').title);
});

test('deals page fetch config stays within AliExpress API rate limits', () => {
  assert.ok(DEALS_COLLECTIONS_COUNT <= 10, 'too many collections per SSR request');
  assert.ok(DEALS_PRODUCTS_PER_COLLECTION <= 8, 'too many products per collection');
});

test('cacheIfNotEmpty sets must-revalidate for empty content', async () => {
  const { cacheIfNotEmpty } = await import('../lib/cache');
  const headers: Record<string, string> = {};
  const mockRes = {
    setHeader: (name: string, value: string) => {
      headers[name] = value;
    },
  } as any;

  // Empty content should use short-cache must-revalidate
  cacheIfNotEmpty(mockRes, false, 'public, s-maxage=3600, stale-while-revalidate=86400');
  assert.ok(headers['Cache-Control'].includes('must-revalidate'), 'empty results must have must-revalidate');
  assert.ok(headers['Cache-Control'].includes('s-maxage=30'), 'empty results should have short 30s max-age');
});

test('cacheIfNotEmpty sets both Cache-Control and Vercel-CDN-Cache-Control', async () => {
  const { cacheIfNotEmpty } = await import('../lib/cache');
  const headers: Record<string, string> = {};
  const mockRes = {
    setHeader: (name: string, value: string) => {
      headers[name] = value;
    },
  } as any;

  // With content, both headers should use the long cache
  cacheIfNotEmpty(mockRes, true, 'public, s-maxage=3600, stale-while-revalidate=86400');
  assert.equal(headers['Cache-Control'], 'public, s-maxage=3600, stale-while-revalidate=86400');
  assert.equal(headers['Vercel-CDN-Cache-Control'], 'public, s-maxage=3600, stale-while-revalidate=86400');

  // Verify empty content sets the same short cache on both headers
  const headers2: Record<string, string> = {};
  const mockRes2 = {
    setHeader: (name: string, value: string) => {
      headers2[name] = value;
    },
  } as any;
  cacheIfNotEmpty(mockRes2, false, 'public, s-maxage=3600, stale-while-revalidate=86400');
  assert.equal(headers2['Cache-Control'], headers2['Vercel-CDN-Cache-Control'], 'both headers must match');
  assert.ok(headers2['Vercel-CDN-Cache-Control'].includes('must-revalidate'), 'Vercel header must also block long cache');
});
