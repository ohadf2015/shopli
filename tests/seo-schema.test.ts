import { test } from 'node:test';
import assert from 'node:assert/strict';
import { productJsonLd, SITE_URL } from '../lib/seo';

const base = {
  title: 'Widget',
  url: `${SITE_URL}/eu/product/123`,
  price: 9.9,
  currency: 'EUR',
  region: 'eu',
};

test('PDP rule: productJsonLd emits no aggregateRating without rating args', () => {
  const ld = productJsonLd(base) as Record<string, unknown>;
  assert.equal(ld.aggregateRating, undefined);
  assert.ok(JSON.stringify(ld).includes('"@type":"Offer"'));
});

test('productJsonLd still supports aggregateRating when real data exists', () => {
  const ld = productJsonLd({ ...base, ratingValue: 4.5, reviewCount: 12 }) as any;
  assert.equal(ld.aggregateRating['@type'], 'AggregateRating');
  assert.equal(ld.aggregateRating.reviewCount, 12);
});

test('canonical site url is www.tryshopli.com', () => {
  assert.equal(SITE_URL, 'https://www.tryshopli.com');
});
