import { test } from 'node:test';
import assert from 'node:assert/strict';
import { productJsonLd, faqJsonLd, SITE_URL } from '../lib/seo';

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

test('faqJsonLd emits one Question per real Q&A pair', () => {
  const ld = faqJsonLd([
    { question: 'Is shipping free?', answer: 'On most picks, yes.' },
    { question: 'How long does it take?', answer: '10-20 days to the EU.' },
  ]) as any;
  assert.equal(ld['@type'], 'FAQPage');
  assert.equal(ld.mainEntity.length, 2);
  assert.equal(ld.mainEntity[0]['@type'], 'Question');
  assert.equal(ld.mainEntity[0].acceptedAnswer.text, 'On most picks, yes.');
});

test('faqJsonLd returns null rather than an invalid empty FAQPage', () => {
  // A post with no FAQ, or one whose translations are missing for this locale,
  // must not emit an FAQPage with an empty mainEntity — that is invalid markup.
  assert.equal(faqJsonLd([]), null);
  assert.equal(faqJsonLd([{ question: '', answer: '' }]), null);
  assert.equal(faqJsonLd([{ question: 'Q?', answer: '   ' }]), null);
  // Partial data: keep the complete pairs, drop the incomplete one.
  const ld = faqJsonLd([{ question: 'Q?', answer: 'A.' }, { question: 'Q2?', answer: '' }]) as any;
  assert.equal(ld.mainEntity.length, 1);
});
