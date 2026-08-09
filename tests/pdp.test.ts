import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildPdpDescription,
  buildPdpSpecs,
  buildPdpProsCons,
  buildPdpFaq,
  relatedCollections,
  listingAggregateFields,
} from '../lib/pdp';
import { getDemoProductById } from '../lib/demo-products';
import { COLLECTIONS } from '../lib/collections';

const product = getDemoProductById('1005007001', 'eu', 'EUR')!;
const noShipping = getDemoProductById('1005007003', 'eu', 'EUR')!;

test('meta description is richer than the bare title', () => {
  const desc = buildPdpDescription(product, false);
  assert.notEqual(desc, product.title);
  assert.ok(desc.length > product.title.length + 20);
  assert.ok(desc.includes(product.title));
  assert.ok(desc.includes('9.90'), 'includes price');
  assert.ok(/free shipping/i.test(desc), 'mentions free shipping');
  const heDesc = buildPdpDescription(product, true);
  assert.ok(/[\u0590-\u05FF]/.test(heDesc), 'hebrew variant is hebrew');
});

test('specs table has labeled rows from product data', () => {
  const specs = buildPdpSpecs(product, false);
  assert.ok(specs.length >= 4);
  for (const row of specs) {
    assert.ok(row.label.length > 0 && row.value.length > 0);
  }
  assert.ok(specs.some((s) => s.value === product.shopName));
  assert.ok(buildPdpSpecs(noShipping, false).length >= 4);
});

test('pros/cons are derived from product signals', () => {
  const { pros, cons } = buildPdpProsCons(product, false);
  assert.ok(pros.length >= 2);
  assert.ok(cons.length >= 1);
  // high rating + free shipping + discount should surface as pros
  assert.ok(pros.some((p) => /free shipping/i.test(p)));
  const cheap = buildPdpProsCons(noShipping, false);
  assert.ok(cheap.cons.some((c) => /shipping/i.test(c)), 'paid shipping listed as con');
});

test('faq has at least 3 non-empty Q&A pairs, localized', () => {
  const faq = buildPdpFaq(product, false);
  assert.ok(faq.length >= 3);
  for (const item of faq) {
    assert.ok(item.q.length > 5 && item.a.length > 10);
  }
  const heFaq = buildPdpFaq(product, true);
  assert.ok(/[\u0590-\u05FF]/.test(heFaq[0].q));
});

test('related collections returns valid collection slugs', () => {
  const rel = relatedCollections(product);
  assert.ok(rel.length >= 1 && rel.length <= 4);
  const slugs = new Set(COLLECTIONS.map((c) => c.slug));
  for (const c of rel) assert.ok(slugs.has(c.slug), `unknown slug ${c.slug}`);
});

test('listingAggregateFields strips ratings when the schema URL is an on-site PDP', () => {
  const stripped = listingAggregateFields(
    { id: '1005007001' },
    { ratingValue: 4.7, reviewCount: 2341 }
  );
  assert.equal(stripped.ratingValue, undefined);
  assert.equal(stripped.reviewCount, undefined);

  const kept = listingAggregateFields(
    { id: '' },
    { ratingValue: 4.7, reviewCount: 2341 }
  );
  assert.equal(kept.ratingValue, 4.7);
  assert.equal(kept.reviewCount, 2341);
});
