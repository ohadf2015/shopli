import test from 'node:test';
import assert from 'node:assert/strict';
import {
  estimateLandedCost,
  estimateKitLandedCost,
  USD_TO_ILS_RATE,
  DUTY_FREE_THRESHOLD_USD,
  DUTY_WAIVER_CEILING_USD,
  IL_VAT_RATE,
  BOI_CUSTOMS_FX_UPLIFT,
  customsFxTooltipHe,
  vatFxHonestyStripHe,
} from '../lib/landed-cost';

test('constants encode the IL import rules', () => {
  assert.equal(DUTY_FREE_THRESHOLD_USD, 75);
  assert.equal(DUTY_WAIVER_CEILING_USD, 500);
  assert.equal(IL_VAT_RATE, 0.18);
  assert.ok(USD_TO_ILS_RATE > 3 && USD_TO_ILS_RATE < 5);
  // Skills IL foil: goods on a rashimon use BoI representative + 0.5%
  assert.equal(BOI_CUSTOMS_FX_UPLIFT, 0.005);
});

test('customs FX tooltip explains BoI representative rate + 0.5%', () => {
  const tip = customsFxTooltipHe();
  assert.match(tip, /בנק ישראל/);
  assert.match(tip, /\+ 0\.5%/);
  assert.match(tip, /רשומון/);
  assert.match(tip, new RegExp(USD_TO_ILS_RATE.toFixed(2).replace('.', '\\.')));
  assert.match(tip, /רשות המסים/);
});

test('VAT/FX honesty strip labels 18% VAT and BoI representative +0.5% (rashimon)', () => {
  const strip = vatFxHonestyStripHe();
  assert.match(strip, /מע״ם 18%/);
  assert.match(strip, /בנק ישראל/);
  assert.match(strip, /\+ 0\.5%/);
  assert.match(strip, /רשומון/);
  // Foil: rivals still publish stale 17% in body — we never label 17%.
  assert.doesNotMatch(strip, /17%/);
  // Keep #18 tooltip math/wording independent of the strip.
  const tip = customsFxTooltipHe();
  assert.match(tip, /\+ 0\.5%/);
  assert.notEqual(strip, tip);
});


test('74.99 USD (free shipping) is duty-free: no VAT, total = goods price', () => {
  const est = estimateLandedCost({ price: 74.99, currency: 'USD', freeShipping: true });
  assert.ok(est);
  assert.equal(est.dutyFree, true);
  assert.equal(est.vatIls, 0);
  assert.equal(est.shippingIls, 0);
  assert.ok(Math.abs(est.totalIls - 74.99 * USD_TO_ILS_RATE) < 1e-9);
});

test('75.01 USD (free shipping) crosses the threshold: 18% VAT on goods', () => {
  const est = estimateLandedCost({ price: 75.01, currency: 'USD', freeShipping: true });
  assert.ok(est);
  assert.equal(est.dutyFree, false);
  const priceIls = 75.01 * USD_TO_ILS_RATE;
  assert.ok(Math.abs(est.vatIls - IL_VAT_RATE * priceIls) < 1e-9);
  assert.ok(Math.abs(est.totalIls - priceIls * (1 + IL_VAT_RATE)) < 1e-9);
});

test('exactly 75.00 USD is NOT under the threshold (boundary is strict)', () => {
  const est = estimateLandedCost({ price: 75, currency: 'USD', freeShipping: true });
  assert.ok(est);
  assert.equal(est.dutyFree, false);
  assert.ok(est.vatIls > 0);
});

test('ILS input converts back to USD for the threshold check', () => {
  // 74.99 USD in ILS stays duty-free; 75.01 USD in ILS does not.
  const under = estimateLandedCost({ price: 74.99 * USD_TO_ILS_RATE, currency: 'ILS', freeShipping: true });
  const over = estimateLandedCost({ price: 75.01 * USD_TO_ILS_RATE, currency: 'ILS', freeShipping: true });
  assert.ok(under && over);
  assert.equal(under.dutyFree, true);
  assert.equal(over.dutyFree, false);
  // currency symbol forms behave the same as ISO codes
  assert.equal(estimateLandedCost({ price: 10, currency: '₪', freeShipping: true })!.dutyFree, true);
  assert.equal(estimateLandedCost({ price: 100, currency: '$', freeShipping: true })!.dutyFree, false);
});

test('shipping is excluded from the threshold but included in the VAT base', () => {
  // 70 USD of goods + 100 ILS shipping: goods under $75 -> still duty-free,
  // even though goods+shipping in ILS is well over the dollar threshold.
  const est = estimateLandedCost({ price: 70, currency: 'USD', freeShipping: false, shippingIls: 100 });
  assert.ok(est);
  assert.equal(est.dutyFree, true);
  assert.equal(est.vatIls, 0);
  assert.ok(Math.abs(est.totalIls - (70 * USD_TO_ILS_RATE + 100)) < 1e-9);

  // Same shipping over the threshold: VAT applies to goods + shipping.
  const taxed = estimateLandedCost({ price: 80, currency: 'USD', freeShipping: false, shippingIls: 100 });
  assert.ok(taxed);
  assert.equal(taxed.dutyFree, false);
  const base = 80 * USD_TO_ILS_RATE + 100;
  assert.ok(Math.abs(taxed.vatIls - IL_VAT_RATE * base) < 1e-9);
  assert.ok(Math.abs(taxed.totalIls - base * (1 + IL_VAT_RATE)) < 1e-9);
});

test('freeShipping forces shipping to zero even if shippingIls is passed', () => {
  const est = estimateLandedCost({ price: 10, currency: 'ILS', freeShipping: true, shippingIls: 50 });
  assert.ok(est);
  assert.equal(est.shippingIls, 0);
});

test('rejects unusable input instead of rendering a misleading badge', () => {
  assert.equal(estimateLandedCost({ price: 0, currency: 'ILS' }), null);
  assert.equal(estimateLandedCost({ price: -5, currency: 'ILS' }), null);
  assert.equal(estimateLandedCost({ price: NaN, currency: 'ILS' }), null);
  assert.equal(estimateLandedCost({ price: 10, currency: 'EUR' }), null);
});

test('missing currency defaults to ILS (IL feed rows)', () => {
  const est = estimateLandedCost({ price: 36, freeShipping: true });
  assert.ok(est);
  assert.equal(est.priceIls, 36);
  assert.equal(est.usdPrice, 10);
  assert.equal(est.dutyFree, true);
});


test('kit rollup: two ILS 100+100 stays under $75 ptur', () => {
  const est = estimateKitLandedCost([
    { price: 100, currency: 'ILS', freeShipping: true },
    { price: 100, currency: 'ILS', freeShipping: true },
  ]);
  assert.ok(est);
  assert.equal(est.priceIls, 200);
  assert.equal(est.dutyFree, true);
  assert.equal(est.vatIls, 0);
  assert.equal(est.shippingIls, 0);
  assert.ok(Math.abs(est.usdPrice - 200 / USD_TO_ILS_RATE) < 1e-9);
});

test('kit rollup: two ILS 150+150 crosses $75 and adds 18% VAT', () => {
  const est = estimateKitLandedCost([
    { price: 150, currency: 'ILS', freeShipping: true },
    { price: 150, currency: 'ILS', freeShipping: true },
  ]);
  assert.ok(est);
  assert.equal(est.priceIls, 300);
  assert.equal(est.dutyFree, false);
  assert.ok(Math.abs(est.vatIls - IL_VAT_RATE * 300) < 1e-9);
  assert.ok(Math.abs(est.totalIls - 300 * (1 + IL_VAT_RATE)) < 1e-9);
});

test('kit rollup: each SKU under $75 but the sum is not (the whole point)', () => {
  const a = estimateLandedCost({ price: 50, currency: 'USD', freeShipping: true });
  const b = estimateLandedCost({ price: 50, currency: 'USD', freeShipping: true });
  assert.ok(a && b);
  assert.equal(a.dutyFree, true);
  assert.equal(b.dutyFree, true);
  const kit = estimateKitLandedCost([
    { price: 50, currency: 'USD', freeShipping: true },
    { price: 50, currency: 'USD', freeShipping: true },
  ]);
  assert.ok(kit);
  assert.equal(kit.dutyFree, false);
  assert.ok(kit.vatIls > 0);
});

test('kit rollup: 37.49+37.49 USD is duty-free; 37.50+37.50 is not', () => {
  const under = estimateKitLandedCost([
    { price: 37.49, currency: 'USD', freeShipping: true },
    { price: 37.49, currency: 'USD', freeShipping: true },
  ]);
  const over = estimateKitLandedCost([
    { price: 37.50, currency: 'USD', freeShipping: true },
    { price: 37.50, currency: 'USD', freeShipping: true },
  ]);
  assert.ok(under && over);
  assert.equal(under.dutyFree, true);
  assert.equal(over.dutyFree, false);
});

test('kit rollup: mixed USD + ILS convert before summing', () => {
  const est = estimateKitLandedCost([
    { price: 20, currency: 'USD', freeShipping: true },
    { price: 20 * USD_TO_ILS_RATE, currency: 'ILS', freeShipping: true },
  ]);
  assert.ok(est);
  assert.equal(est.dutyFree, true);
  assert.ok(Math.abs(est.priceIls - 20 * USD_TO_ILS_RATE * 2) < 1e-9);
});

test('kit rollup: shipping is excluded from the $75 threshold but included in VAT base', () => {
  const est = estimateKitLandedCost([
    { price: 30, currency: 'USD', freeShipping: false, shippingIls: 50 },
    { price: 30, currency: 'USD', freeShipping: false, shippingIls: 50 },
  ]);
  assert.ok(est);
  assert.equal(est.dutyFree, true);
  assert.equal(est.shippingIls, 100);
  assert.equal(est.vatIls, 0);
  assert.ok(Math.abs(est.totalIls - (60 * USD_TO_ILS_RATE + 100)) < 1e-9);
});

test('kit rollup: freeShipping on one SKU zeros that SKU shipping', () => {
  const est = estimateKitLandedCost([
    { price: 10, currency: 'ILS', freeShipping: true, shippingIls: 40 },
    { price: 10, currency: 'ILS', freeShipping: false, shippingIls: 40 },
  ]);
  assert.ok(est);
  assert.equal(est.shippingIls, 40);
});

test('kit rollup: empty or all-invalid SKUs return null', () => {
  assert.equal(estimateKitLandedCost([]), null);
  assert.equal(estimateKitLandedCost([{ price: 0, currency: 'ILS' }]), null);
  assert.equal(estimateKitLandedCost([{ price: 10, currency: 'EUR' }]), null);
});

test('kit rollup: unknown-currency SKU is skipped; remaining SKUs still estimate', () => {
  const est = estimateKitLandedCost([
    { price: 10, currency: 'EUR' },
    { price: 36, currency: 'ILS', freeShipping: true },
  ]);
  assert.ok(est);
  assert.equal(est.priceIls, 36);
  assert.equal(est.usdPrice, 10);
  assert.equal(est.dutyFree, true);
});
