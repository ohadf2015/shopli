import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getHreflangTags, getSeoHead, SITE_URL } from '../lib/seo';
import { REGIONS, RegionCode } from '../lib/regions';

const regionCodes = Object.keys(REGIONS) as RegionCode[];

const HREFLANG_RE = /^[a-z]{2,3}(-[A-Z]{2})?$|^x-default$/;

test('hreflang cluster covers every region exactly once plus x-default', () => {
  for (const region of regionCodes) {
    const tags = getHreflangTags(region, '/');
    const alternates = tags.filter(t => t.rel === 'alternate');
    assert.equal(alternates.length, regionCodes.length + 1);
    for (const code of regionCodes) {
      const tag = alternates.find(t => t.href === `${SITE_URL}/${code}/`);
      assert.ok(tag, `${region}: missing alternate for /${code}/`);
      assert.match(tag!.hrefLang, HREFLANG_RE, `${region}: invalid hreflang "${tag!.hrefLang}"`);
      assert.notEqual(tag!.hrefLang, 'x-default');
    }
    const xDefault = alternates.filter(t => t.hrefLang === 'x-default');
    assert.equal(xDefault.length, 1);
    assert.equal(xDefault[0].href, `${SITE_URL}/eu/`);
  }
});

test('he -> /il and ru -> /ru', () => {
  const tags = getHreflangTags('il', '/');
  assert.equal(tags.filter(t => t.rel==='alternate').find(t => t.href===`${SITE_URL}/il/`)?.hrefLang, 'he');
  assert.equal(tags.filter(t => t.rel==='alternate').find(t => t.href===`${SITE_URL}/ru/`)?.hrefLang, 'ru');
});

test('no invented locale codes (en-EU is invalid)', () => {
  for (const region of regionCodes) {
    for (const t of getHreflangTags(region, '/some/page')) {
      if (t.rel !== 'alternate') continue;
      assert.notEqual(t.hrefLang, 'en-EU');
      assert.match(t.hrefLang, HREFLANG_RE);
    }
  }
});

test('canonical emitted for every region path and points at self', () => {
  for (const region of regionCodes) {
    const canonical = getHreflangTags(region, '/product/123').find(t => t.rel === 'canonical');
    assert.ok(canonical);
    assert.equal(canonical!.href, `${SITE_URL}/${region}/product/123`);
  }
});

test('hreflang: false emits canonical only, no alternates', () => {
  const head = getSeoHead({ region: 'eu', path: '/deals', canonical: `${SITE_URL}/deals`, hreflang: false });
  const links = head.meta.filter(m => m.tag === 'link');
  assert.equal(links.length, 1);
  assert.equal(links[0].rel, 'canonical');
  assert.equal(links[0].href, `${SITE_URL}/deals`);
});
