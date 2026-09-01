import test from 'node:test';
import assert from 'node:assert/strict';
import {
  estimateLandedCost,
  USD_TO_ILS_RATE,
  DUTY_FREE_THRESHOLD_USD,
  IL_VAT_RATE,
} from '../lib/landed-cost';

test('constants encode the IL import rules', () => {
  assert.equal(DUTY_FREE_THRESHOLD_USD, 75);
  assert.equal(IL_VAT_RATE, 0.18);
  assert.ok(USD_TO_ILS_RATE > 3 && USD_TO_ILS_RATE < 5);
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
