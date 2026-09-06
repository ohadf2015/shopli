import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseProductUrl,
  parseKitUrls,
  customsStampCopyHe,
  classifyDutyWaiverBand,
  dutyWaiverBandRows,
  kitTippingHint,
  kitTippingCopyHe,
} from '../lib/landed-url';
import {
  IL_VAT_RATE,
  BOI_CUSTOMS_FX_UPLIFT,
  USD_TO_ILS_RATE,
  DUTY_FREE_THRESHOLD_USD,
  DUTY_WAIVER_CEILING_USD,
  estimateLandedCost,
  estimateKitLandedCost,
  customsFxTooltipHe,
  vatFxHonestyStripHe,
} from '../lib/landed-cost';

test('parseProductUrl: Amazon /dp/ASIN', () => {
  const p = parseProductUrl('https://www.amazon.com/Some-Title/dp/B0EXAMPLE1/ref=sr_1_1');
  assert.ok(p);
  assert.equal(p.source, 'amazon');
  assert.equal(p.host, 'amazon.com');
  assert.equal(p.productId, 'B0EXAMPLE1');
  assert.equal(p.canonicalUrl, 'https://amazon.com/dp/B0EXAMPLE1');
});

test('parseProductUrl: Amazon /gp/product/ASIN without scheme', () => {
  const p = parseProductUrl('www.amazon.co.uk/gp/product/B09ABCDEF0?psc=1');
  assert.ok(p);
  assert.equal(p.source, 'amazon');
  assert.equal(p.host, 'amazon.co.uk');
  assert.equal(p.productId, 'B09ABCDEF0');
});

test('parseProductUrl: AliExpress item id', () => {
  const p = parseProductUrl('https://www.aliexpress.com/item/1005006123456789.html');
  assert.ok(p);
  assert.equal(p.source, 'aliexpress');
  assert.equal(p.productId, '1005006123456789');
  assert.match(p.canonicalUrl!, /\/item\/1005006123456789\.html$/);
});

test('parseProductUrl: other host keeps host, no invented id', () => {
  const p = parseProductUrl('https://shop.example.com/p/123');
  assert.ok(p);
  assert.equal(p.source, 'other');
  assert.equal(p.host, 'shop.example.com');
  assert.equal(p.productId, undefined);
});

test('parseProductUrl: empty / garbage → null', () => {
  assert.equal(parseProductUrl(''), null);
  assert.equal(parseProductUrl('   '), null);
  assert.equal(parseProductUrl('not a url'), null);
  assert.equal(parseProductUrl('ftp://amazon.com/dp/B0EXAMPLE1'), null);
});

test('parseKitUrls: 2–5 amazon URLs, blanks ignored, invalid skipped, cap 5', () => {
  const raw = `
https://www.amazon.com/dp/B0AAA11111
not-a-url
https://www.amazon.com/dp/B0BBB22222

https://www.amazon.com/dp/B0CCC33333, https://www.amazon.com/dp/B0DDD44444
https://www.amazon.com/dp/B0EEE55555
https://www.amazon.com/dp/B0FFF66666
`;
  const kit = parseKitUrls(raw);
  assert.equal(kit.length, 5);
  assert.equal(kit[0].productId, 'B0AAA11111');
  assert.equal(kit[4].productId, 'B0EEE55555');
  assert.ok(kit.every((p) => p.source === 'amazon'));
});

test('parseKitUrls: dedupes canonical ASIN and tolerates empty', () => {
  assert.deepEqual(parseKitUrls(''), []);
  assert.deepEqual(parseKitUrls('   \n  '), []);
  const d = parseKitUrls(
    'https://www.amazon.com/dp/B0AAA11111\nhttps://www.amazon.com/Some/dp/B0AAA11111?psc=1'
  );
  assert.equal(d.length, 1);
  assert.equal(d[0].productId, 'B0AAA11111');
});

test('kit tipping: 37.49+37.49 USD stays ptur (no tip); 40+40 tips into vat-only', () => {
  const under = kitTippingHint([
    { price: 37.49, currency: 'USD', freeShipping: true },
    { price: 37.49, currency: 'USD', freeShipping: true },
  ]);
  assert.equal(under.tipped, false);
  assert.equal(under.singleAllPtur, true);
  assert.equal(under.kitDutyFree, true);
  assert.equal(under.kitBand, 'ptur');

  const tip = kitTippingHint([
    { price: 40, currency: 'USD', freeShipping: true },
    { price: 40, currency: 'USD', freeShipping: true },
  ]);
  assert.equal(tip.tipped, true);
  assert.equal(tip.singleAllPtur, true);
  assert.equal(tip.kitDutyFree, false);
  assert.equal(tip.kitBand, 'vat-only');

  const kit = estimateKitLandedCost([
    { price: 40, currency: 'USD', freeShipping: true },
    { price: 40, currency: 'USD', freeShipping: true },
  ]);
  assert.ok(kit);
  assert.equal(classifyDutyWaiverBand(kit.usdPrice), 'vat-only');
});

test('kit tipping: one SKU already over $75 is not single-miss tip', () => {
  const h = kitTippingHint([
    { price: 80, currency: 'USD', freeShipping: true },
    { price: 20, currency: 'USD', freeShipping: true },
  ]);
  assert.equal(h.tipped, false);
  assert.equal(h.singleAllPtur, false);
  assert.equal(h.kitDutyFree, false);
  assert.equal(h.kitBand, 'vat-only');
});

test('kit tipping copy mentions $75 threshold and never 17% VAT', () => {
  const c = kitTippingCopyHe();
  assert.match(c, /\$75/);
  assert.match(c, /ערכה|פטור/);
  assert.doesNotMatch(c, /מע״ם 17%/);
});

test('customs stamp copy: Skills IL v1.4.0, 18% VAT, BoI+0.5%, bands, never 17%', () => {
  const stamp = customsStampCopyHe();
  assert.match(stamp, /Skills IL v1\.4\.0/);
  assert.match(stamp, /Sep 6/);
  assert.match(stamp, /מע״ם 18%/);
  assert.match(stamp, /בנק ישראל/);
  assert.match(stamp, /\+ 0\.5%/);
  assert.match(stamp, /רשומון/);
  assert.match(stamp, /\$75/);
  assert.match(stamp, /\$500/);
  assert.match(stamp, /ויתור מכס|מע״ם בלבד/);
  assert.match(stamp, /iWishBag|17%/); // foil mentions rival 17% claim
  assert.match(stamp, /מע״ם 18%/);
  assert.doesNotMatch(stamp, /מע״ם 17%/);
  assert.doesNotMatch(stamp, /v2\.2\.0/);
});

test('duty-waiver bands: $75 ptur + $75–$500 VAT-only + above-$500', () => {
  assert.equal(DUTY_FREE_THRESHOLD_USD, 75);
  assert.equal(DUTY_WAIVER_CEILING_USD, 500);

  assert.equal(classifyDutyWaiverBand(74.99), 'ptur');
  assert.equal(classifyDutyWaiverBand(75), 'vat-only');
  assert.equal(classifyDutyWaiverBand(200), 'vat-only');
  assert.equal(classifyDutyWaiverBand(499.99), 'vat-only');
  assert.equal(classifyDutyWaiverBand(500), 'full');
  assert.equal(classifyDutyWaiverBand(0), null);
  assert.equal(classifyDutyWaiverBand(-1), null);

  const rows = dutyWaiverBandRows();
  assert.equal(rows.length, 3);
  assert.equal(rows[0].id, 'ptur');
  assert.equal(rows[1].id, 'vat-only');
  assert.equal(rows[2].id, 'full');
  assert.equal(rows[0].toUsd, 75);
  assert.equal(rows[1].fromUsd, 75);
  assert.equal(rows[1].toUsd, 500);
  assert.match(rows[0].titleHe, /פטור/);
  assert.match(rows[1].titleHe, /מע״ם בלבד|ויתור מכס/);
  assert.match(rows[1].detailHe, /מע״ם 18%/);
  assert.match(rows[1].detailHe, /0\.5%/);
  assert.doesNotMatch(rows.map((r) => r.detailHe).join('\n'), /מע״ם 17%/);
});

test('keep #18/#19/#20 math: constants + tooltip + honesty strip + estimator untouched', () => {
  assert.equal(IL_VAT_RATE, 0.18);
  assert.equal(BOI_CUSTOMS_FX_UPLIFT, 0.005);
  assert.equal(USD_TO_ILS_RATE, 3.6);
  assert.equal(DUTY_FREE_THRESHOLD_USD, 75);
  const tip = customsFxTooltipHe();
  assert.match(tip, /\+ 0\.5%/);
  const strip = vatFxHonestyStripHe();
  assert.match(strip, /מע״ם 18%/);
  assert.doesNotMatch(strip, /17%/);
  // Estimator still taxes 75.01 USD at 18% (boundary unchanged)
  const est = estimateLandedCost({ price: 75.01, currency: 'USD', freeShipping: true });
  assert.ok(est);
  assert.equal(est.dutyFree, false);
  assert.ok(Math.abs(est.vatIls - IL_VAT_RATE * 75.01 * USD_TO_ILS_RATE) < 1e-9);
  // Mid VAT-only band still VAT-only in estimator (no duty modeled)
  const mid = estimateLandedCost({ price: 200, currency: 'USD', freeShipping: true });
  assert.ok(mid);
  assert.equal(mid.dutyFree, false);
  assert.ok(Math.abs(mid.vatIls - IL_VAT_RATE * 200 * USD_TO_ILS_RATE) < 1e-9);
  assert.ok(Math.abs(mid.totalIls - 200 * USD_TO_ILS_RATE * (1 + IL_VAT_RATE)) < 1e-9);
});
