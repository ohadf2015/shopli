import { test } from 'node:test';
import assert from 'node:assert/strict';

import { trackConversion } from '../lib/analytics';

function fakeWindow() {
  const calls: Array<[string, string, Record<string, unknown>]> = [];
  const win = {
    location: { pathname: '/il/mood/cozy', search: '?utm_source=tg&utm_campaign=weekly&x=1', hostname: 'www.tryshopli.com' },
    document: { title: 'Cozy picks', referrer: 'https://t.me/shopli' },
    posthog: { capture: (e: string, p?: Record<string, unknown>) => { calls.push(['posthog', e, p ?? {}]); } },
    gr: { capture: (e: string, p?: Record<string, unknown>) => { calls.push(['gr', e, p ?? {}]); } },
    gtag: (_kind: unknown, e: unknown, p: unknown) => { calls.push(['gtag', e as string, p as Record<string, unknown>]); },
  };
  return { win, calls };
}

test('one conversion goes to PostHog, GA4 and Growth Radar under the same name with page context', () => {
  const { win, calls } = fakeWindow();
  trackConversion('deal_alerts_signup_completed', { form: 'deal_alerts', source: 'mood' }, win);
  assert.deepEqual(calls.map(([sink, e]) => [sink, e]), [
    ['posthog', 'deal_alerts_signup_completed'],
    ['gtag', 'deal_alerts_signup_completed'],
    ['gr', 'growth:deal_alerts_signup_completed'],
  ]);
  assert.deepEqual(calls[2][2], {
    page: '/il/mood/cozy',
    utm_source: 'tg',
    utm_campaign: 'weekly',
    page_title: 'Cozy picks',
    referrer_host: 't.me',
    form: 'deal_alerts',
    source: 'mood',
  });
});

test('PII, full links and empty values never reach any sink', () => {
  const { win, calls } = fakeWindow();
  trackConversion(
    'affiliate_click',
    { product_id: '1005007001', email: 'a@b.co', Phone: '050', name: 'Dana', url: 'https://s.click.aliexpress.com/x?aff=1', note: 'hi', category: '' },
    win,
  );
  for (const [, , props] of calls) {
    for (const key of ['email', 'Phone', 'name', 'url', 'note', 'category']) assert.equal(key in props, false, key);
    assert.equal(props.product_id, '1005007001');
  }
});

test('a throwing or missing sink never breaks the others', () => {
  const { win, calls } = fakeWindow();
  win.posthog.capture = () => { throw new Error('blocked'); };
  const noGtag = { ...win, gtag: undefined };
  assert.doesNotThrow(() => trackConversion('whatsapp_click', { link_host: 'wa.me' }, noGtag));
  assert.deepEqual(calls.map(([, e]) => e), ['growth:whatsapp_click']);
});
