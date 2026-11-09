import { test } from 'node:test';
import assert from 'node:assert/strict';
import { productPageTitle } from '../lib/seo';

test('long product titles are cut at a word so the full title stays within 60 chars', () => {
  const t = productPageTitle('HTC NE79 TWS Bluetooth 6.0 Earbuds AI Translation 135 Languages ENC Noise Cancelling');
  assert.ok(t.length <= 60, t);
  assert.ok(t.endsWith('… | Shopli'), t);
});

test('short titles are kept whole', () => {
  assert.equal(productPageTitle('Magic Hair Brush'), 'Magic Hair Brush | Shopli');
});
