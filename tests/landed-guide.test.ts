import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MARKETPLACE_HOW_TOS,
  classifyImportBand,
  getMarketplaceHowTo,
  howToExamples,
  howToFaqEn,
  importBandRowsHe,
  landedFaqHe,
  orderLosesExemption,
} from '../lib/landed-guide';

test('bands split at $75 and $500, and each has copy', () => {
  assert.equal(classifyImportBand(74.99), 'exempt');
  assert.equal(classifyImportBand(75), 'vat-only');
  assert.equal(classifyImportBand(499.99), 'vat-only');
  assert.equal(classifyImportBand(500), 'full');
  assert.equal(classifyImportBand(0), null);
  assert.equal(classifyImportBand(NaN), null);
  assert.deepEqual(importBandRowsHe().map((r) => r.id), ['exempt', 'vat-only', 'full']);
});

test('an order of items that are each exempt can lose the exemption together', () => {
  const usd = (price: number) => ({ price, currency: 'USD', freeShipping: true });
  assert.equal(orderLosesExemption([usd(40), usd(40)], 3.4), true);
  assert.equal(orderLosesExemption([usd(30), usd(30)], 3.4), false);
  // One item already over the line is not a surprise caused by combining.
  assert.equal(orderLosesExemption([usd(80), usd(10)], 3.4), false);
  assert.equal(orderLosesExemption([usd(40)], 3.4), false);
});

test('worked examples cover one order per band and add 18% only above $75', () => {
  const [small, mid, large] = howToExamples(3.4);
  assert.deepEqual([small.band, mid.band, large.band], ['exempt', 'vat-only', 'full']);
  assert.equal(small.vatIls, 0);
  assert.equal(small.totalIls, small.goodsIls);
  assert.ok(Math.abs(mid.vatIls - 120 * 3.4 * 0.18) < 1e-9);
  assert.ok(Math.abs(mid.totalIls - 120 * 3.4 * 1.18) < 1e-9);
});

test('every guide has a unique path and answers the tax question for its store', () => {
  const paths = MARKETPLACE_HOW_TOS.map((m) => m.path);
  assert.equal(new Set(paths).size, paths.length);
  for (const m of MARKETPLACE_HOW_TOS) {
    assert.match(m.path, /^\/how-to-[a-z]+-israel$/);
    assert.equal(getMarketplaceHowTo(m.id), m);
    const faq = howToFaqEn(m.nameEn);
    assert.ok(faq[0].question.includes(m.nameEn));
    assert.match(faq[0].answer, /\$75/);
    assert.match(faq[0].answer, /18%/);
  }
});

test('calculator FAQ states the current rules', () => {
  const text = landedFaqHe().map((f) => `${f.question} ${f.answer}`).join(' ');
  assert.match(text, /\$75/);
  assert.match(text, /18%/);
  assert.match(text, /72 שעות/);
  assert.doesNotMatch(text, /17%/);
});
