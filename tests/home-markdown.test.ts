import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wantsMarkdown, homeMarkdown } from '../lib/home-markdown';
import { getRegion } from '../lib/regions';

test('wantsMarkdown follows the Accept header', () => {
  assert.equal(wantsMarkdown('text/markdown'), true);
  assert.equal(wantsMarkdown('text/markdown, text/html;q=0.8'), true);
  assert.equal(wantsMarkdown('text/html,application/xhtml+xml,*/*;q=0.8'), false);
  assert.equal(wantsMarkdown('text/html, text/markdown;q=0.5'), false);
  assert.equal(wantsMarkdown('text/markdown;q=0'), false);
  assert.equal(wantsMarkdown(undefined), false);
});

test('homeMarkdown lists the day\'s picks and collections with product links', () => {
  const card = { productId: '123', title: 'Widget', imageUrl: '', price: 9.5, why: 'Usually ~€12.00', badge: '−20%', tone: 'drop' as const, stars: 4.5 };
  const md = homeMarkdown(
    { region: 'eu', config: getRegion('eu'), rtl: false, drops: [card], sellers: [], chips: [{ slug: 'x', name: 'X' }], asOf: '2026-11-10' },
    { h1: 'H', sub: 'S', drops: 'D', dropsSub: 'ds', sellers: 'Se', sellersSub: 'ss', finds: 'Finds', findsSub: 'fs', browse: 'Browse', howTitle: 'How', how: 'Because', asOf: 'As of', empty: 'Empty' }
  );
  assert.match(md, /^# H/);
  assert.ok(md.includes('[Widget](https://www.tryshopli.com/eu/product/123)'));
  assert.ok(md.includes('/eu/collection/x'));
  assert.ok(md.includes('As of 2026-11-10'));
});
