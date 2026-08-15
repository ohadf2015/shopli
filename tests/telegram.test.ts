import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildPicksMessage, escapeMarkdown, shortTitle } from '../lib/telegram';
import type { Pick, PickReason } from '../lib/picks';

function pick(over: Partial<Pick> = {}): Pick {
  return {
    productId: '1005001', title: 'Silicone Face Brush', price: 5.98, currency: 'ILS',
    imageUrl: 'x', rating: 96, volume: 4000, reason: 'surging' as PickReason, score: 80,
    perDay: 551, recentPerDay: 2178, surge: 3.95, spanDays: 4,
    priceNow: 5.98, priceMedian: 6.92, dropPct: 14, ...over,
  };
}

test('nothing to say means no post', () => {
  // A filler roundup every day regardless is what made the old channel dead.
  assert.equal(buildPicksMessage('il', []), null);
});

test('the post states why each product is in it', () => {
  const msg = buildPicksMessage('us', [pick(), pick({ productId: '2', reason: 'price_drop', dropPct: 28 })], {
    currencySymbol: '$',
  })!;
  assert.match(msg, /2178 sold today/);
  assert.match(msg, /4\\\.0x its usual rate/);
  assert.match(msg, /28% below its own median price over 4 days/);
});

test('links go to Shopli, never straight to AliExpress', () => {
  const msg = buildPicksMessage('il', [pick()], { currencySymbol: '₪' })!;
  assert.match(msg, /\/il\/product\/1005001/);
  assert.doesNotMatch(msg, /aliexpress/i);
});

test('MarkdownV2 reserved characters are escaped', () => {
  // One unescaped '.' and Telegram rejects the entire message.
  const msg = buildPicksMessage('us', [pick({ title: 'Pro-Grade (v2.0) Kit!' })], { currencySymbol: '$' })!;
  // Strip escaped pairs and the link URLs (the one place escaping is not
  // required), then nothing reserved may remain.
  const bare = msg.replace(/\\./g, '').replace(/\]\([^)]*\)/g, ']');
  assert.doesNotMatch(bare, /[.!()-]/);
  assert.equal(escapeMarkdown('a.b-c!'), 'a\\.b\\-c\\!');
});

test('titles are cut at a word', () => {
  const long = 'Wireless Bluetooth Earphones With Charging Case And Noise Cancelling Microphone For Sport';
  const out = shortTitle(long);
  assert.ok(out.length <= 71);
  assert.ok(out.endsWith('…'));
  assert.ok(!out.includes('  '));
});

test('the region decides the language', () => {
  assert.match(buildPicksMessage('il', [pick()], { currencySymbol: '₪' })!, /מזנק/);
  assert.match(buildPicksMessage('de', [pick()], { currencySymbol: '€' })!, /Surging/);
});
