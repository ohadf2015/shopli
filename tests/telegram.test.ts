import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildPickPost, escapeHtml, shortTitle } from '../lib/telegram';
import type { Pick, PickReason } from '../lib/picks';

function pick(over: Partial<Pick> = {}): Pick {
  return {
    productId: '1005001', title: 'Silicone Face Brush', price: 5.98, currency: 'ILS',
    imageUrl: 'https://ae01.alicdn.com/x.jpg', rating: 96, volume: 4000, category: 'Beauty', reason: 'surging' as PickReason, score: 80,
    perDay: 551, recentPerDay: 2178, surge: 3.95, spanDays: 4,
    priceNow: 5.98, priceMedian: 6.92, dropPct: 14, asOf: '2026-08-15', ...over,
  };
}

const LINK = 'https://s.click.aliexpress.com/e/_abc';

test('a post is a photo with the reason, price and why it is here', () => {
  const post = buildPickPost('us', pick(), { currencySymbol: '$' });
  assert.equal(post.photo, 'https://ae01.alicdn.com/x.jpg');
  assert.match(post.caption, /Selling fast/);
  assert.match(post.caption, /\$5\.98/);
  assert.match(post.caption, /2,178 sold a day, 4\.0x its usual pace/);
});

test('a price drop shows the usual price it dropped from', () => {
  const post = buildPickPost('us', pick({ reason: 'price_drop', dropPct: 28, priceMedian: 8.3 }), { currencySymbol: '$' });
  assert.match(post.caption, /usually \$8\.30/);
  assert.match(post.caption, /28% below its usual price/);
});

test('the buy button appears only with a tracked promotion link', () => {
  const withLink = buildPickPost('il', pick(), { currencySymbol: '₪', buyLink: LINK });
  assert.deepEqual(withLink.buttons.map((b) => b.url), [LINK, 'https://www.tryshopli.com/il/product/1005001']);
  const untracked = buildPickPost('il', pick(), { buyLink: 'https://www.aliexpress.com/item/1.html' });
  assert.equal(untracked.buttons.length, 1);
  assert.match(untracked.buttons[0].url, /tryshopli\.com\/il\/product\/1005001/);
});

test('review count is shown when known and omitted rather than zero', () => {
  assert.match(buildPickPost('us', pick(), { reviews: 124 }).caption, /124 reviews/);
  assert.doesNotMatch(buildPickPost('us', pick()).caption, /reviews/);
});

test('Israel posts are in Hebrew, use the Hebrew title and flag duty-free items', () => {
  const post = buildPickPost('il', pick(), { currencySymbol: '₪', title: 'מברשת ניקוי פנים מסיליקון' });
  assert.match(post.caption, /מזנק עכשיו/);
  assert.match(post.caption, /מברשת ניקוי פנים/);
  assert.match(post.caption, /בלי מע״מ ומכס/);
  const pricey = buildPickPost('il', pick({ price: 900 }), { currencySymbol: '₪' });
  assert.doesNotMatch(pricey.caption, /מע״מ/);
});

test('titles are escaped for HTML and cut at a word', () => {
  const post = buildPickPost('us', pick({ title: 'Cable <USB-C> & Lightning' }));
  assert.match(post.caption, /Cable &lt;USB-C&gt; &amp; Lightning/);
  assert.equal(escapeHtml('a<b'), 'a&lt;b');
  const out = shortTitle('Wireless Bluetooth Earphones With Charging Case And Noise Cancelling Microphone For Sport');
  assert.ok(out.length <= 71 && out.endsWith('…'));
});

test('captions stay under the Telegram photo caption limit', () => {
  const post = buildPickPost('il', pick({ title: 'x '.repeat(500) }), { currencySymbol: '₪', reviews: 99999, buyLink: LINK });
  assert.ok(post.caption.length < 1024);
});
