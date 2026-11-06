import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  isPromotionLink,
  itemIdFromUrl,
  parsePromotionLinks,
  withPromotionLinks,
} from '../lib/aliexpress';

test('only s.click links count as promotion links', () => {
  assert.equal(isPromotionLink('https://s.click.aliexpress.com/s/AbC123'), true);
  assert.equal(isPromotionLink('https://www.aliexpress.com/item/1.html?aff_fcid=shopli'), false);
  assert.equal(isPromotionLink(''), false);
  assert.equal(isPromotionLink(undefined), false);
});

test('item id is read from an item URL', () => {
  assert.equal(itemIdFromUrl('https://www.aliexpress.com/item/1005007001.html?x=1'), '1005007001');
  assert.equal(itemIdFromUrl('https://s.click.aliexpress.com/s/AbC'), '');
});

test('link.generate response maps item id to its promotion link', () => {
  const data = {
    aliexpress_affiliate_link_generate_response: {
      resp_result: {
        result: {
          promotion_links: {
            promotion_link: [
              { source_value: 'https://www.aliexpress.com/item/111111111.html', promotion_link: 'https://s.click.aliexpress.com/s/one' },
              { source_value: 'https://www.aliexpress.com/item/222222222.html', promotion_link: 'https://evil.example/s/two' },
              { source_value: 'https://www.aliexpress.com/item/333333333.html' },
            ],
          },
        },
      },
    },
  };
  const out = parsePromotionLinks(data);
  assert.deepEqual([...out.entries()], [['111111111', 'https://s.click.aliexpress.com/s/one']]);
});

test('a single promotion_link object (not an array) is handled', () => {
  const data = {
    aliexpress_affiliate_link_generate_response: {
      resp_result: { result: { promotion_links: { promotion_link: {
        source_value: 'https://www.aliexpress.com/item/444444444.html',
        promotion_link: 'https://s.click.aliexpress.com/s/four',
      } } } },
    },
  };
  assert.equal(parsePromotionLinks(data).get('444444444'), 'https://s.click.aliexpress.com/s/four');
});

test('an error response or junk parses to no links', () => {
  assert.equal(parsePromotionLinks({ error_response: { code: 'ApiCallLimit' } }).size, 0);
  assert.equal(parsePromotionLinks(null).size, 0);
});

test('without API keys withPromotionLinks fails open and changes nothing', async () => {
  const products = [
    { id: '1005007001', affiliateLink: 'https://www.aliexpress.com/item/1005007001.html?aff_fcid=x' },
    { id: '1005007002', affiliateLink: 'https://s.click.aliexpress.com/s/ok' },
  ];
  assert.deepEqual(await withPromotionLinks(products), products);
});
