import test from 'node:test';
import assert from 'node:assert/strict';
import { parseProductUrl, customsStampCopyHe } from '../lib/landed-url';
import {
  IL_VAT_RATE,
  BOI_CUSTOMS_FX_UPLIFT,
  USD_TO_ILS_RATE,
  estimateLandedCost,
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

test('customs stamp copy: Skills IL v2.2.0, 18% VAT, BoI+0.5%, never 17%', () => {
  const stamp = customsStampCopyHe();
  assert.match(stamp, /Skills IL v2\.2\.0/);
  assert.match(stamp, /מע״ם 18%/);
  assert.match(stamp, /בנק ישראל/);
  assert.match(stamp, /\+ 0\.5%/);
  assert.match(stamp, /רשומון/);
  assert.match(stamp, /iWishBag|17%/); // foil mentions rival 17% claim
  // Foil line cites rivals' "17%" — ensure we do not *label our rate* as 17%:
  assert.match(stamp, /מע״ם 18%/);
  assert.doesNotMatch(stamp, /מע״ם 17%/);
});

test('keep #18/#19 math: constants + tooltip + honesty strip untouched by /landed', () => {
  assert.equal(IL_VAT_RATE, 0.18);
  assert.equal(BOI_CUSTOMS_FX_UPLIFT, 0.005);
  assert.equal(USD_TO_ILS_RATE, 3.6);
  const tip = customsFxTooltipHe();
  assert.match(tip, /\+ 0\.5%/);
  const strip = vatFxHonestyStripHe();
  assert.match(strip, /מע״ם 18%/);
  assert.doesNotMatch(strip, /17%/);
  // Estimator still taxes 75.01 USD at 18%
  const est = estimateLandedCost({ price: 75.01, currency: 'USD', freeShipping: true });
  assert.ok(est);
  assert.equal(est.dutyFree, false);
  assert.ok(Math.abs(est.vatIls - IL_VAT_RATE * 75.01 * USD_TO_ILS_RATE) < 1e-9);
});
