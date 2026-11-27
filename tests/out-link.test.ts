import { test } from 'node:test';
import assert from 'node:assert/strict';
import { outHref, goTarget, isBotUserAgent } from '../lib/out-link';

const SCLICK = 'https://s.click.aliexpress.com/e/_oABC123';

test('AliExpress links route through /api/go and back out unchanged', () => {
  const href = outHref(SCLICK);
  assert.ok(href.startsWith('/api/go?u='));
  const u = new URL(href, 'https://www.tryshopli.com').searchParams.get('u');
  assert.equal(goTarget(u), SCLICK);
});

test('non-AliExpress, http and junk links are not redirected', () => {
  for (const bad of ['https://evil.com/x', 'https://aliexpress.com.evil.com/', 'http://s.click.aliexpress.com/e/x', 'javascript:alert(1)', '', '#']) {
    assert.equal(goTarget(bad), null, bad);
  }
  assert.equal(outHref('#'), '#');
  assert.equal(outHref('/il/product/1'), '/il/product/1');
});

test('crawlers are refused, real browsers pass', () => {
  for (const ua of [undefined, '', 'Mozilla/5.0 (compatible; Bytespider; spider-feedback@bytedance.com)', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/120.0 Safari/537.36', 'meta-externalagent/1.1', 'python-requests/2.31', 'TelegramBot (like TwitterBot)']) {
    assert.equal(isBotUserAgent(ua), true, String(ua));
  }
  for (const ua of ['Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36']) {
    assert.equal(isBotUserAgent(ua), false, ua);
  }
});
