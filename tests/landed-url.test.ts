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
  ITA_SHAAR_OLAMI_CALC_URL,
  itaShaarOlamiFoilStripHe,
  itaShaarOlamiLinkLabelHe,
  israelVat18Not17FoilEn,
  IWISHBAG_AMAZON_IL_URL,
  IWISHBAG_PAGE_LAST_UPDATED,
  IWISHBAG_BODY_STILL_WRONG_VERIFIED,
  iwishbagSideBySideRows,
  iwishbagBodyStillWrongHeadlineEn,
  iwishbagSideBySideIntroHe,
  DUTYDECODER_IL_URL,
  DUTYDECODER_STALE_17_VERIFIED,
  dutyDecoderSideBySideRows,
  dutyDecoderStale17HeadlineEn,
  dutyDecoderSideBySideIntroHe,
  GATEWAYLINES_TARIFF_URL,
  GATEWAYLINES_STALE_17_VERIFIED,
  GATEWAYLINES_VAT_LABEL_QUOTE,
  gatewayLinesSideBySideRows,
  gatewayLinesStale17HeadlineEn,
  gatewayLinesSideBySideIntroHe,
  TAX_AUTHORITY_VAT_CITE_URL,
  TAX_AUTHORITY_VAT_RATE_PCT,
  VAT_TRUTH_LAST_CHECKED,
  vatTruthCompetitorsStill17ProofRows,
  taxAuthorityVat18CiteEn,
  vatTruthLastCheckedStampEn,
  vatTruthHeadlineEn,
  vatTruthIntroHe,
  IWISHBAG_FLIPKART_ETSY_SELF_CONTRADICTION_VERIFIED,
  IWISHBAG_BODY_17_VAT_QUOTE,
  IWISHBAG_OWN_TABLE_18_VAT_QUOTE,
  iwishbagFlipkartEtsySelfContradictionRows,
  iwishbagFlipkartEtsySelfContradictionHeadlineEn,
  iwishbagFlipkartEtsySelfContradictionIntroHe,
  IWISHBAG_ALIEXPRESS_WALMART_EBAY_SELF_CONTRADICTION_VERIFIED,
  iwishbagAliexpressWalmartEbaySelfContradictionRows,
  iwishbagAliexpressWalmartEbaySelfContradictionHeadlineEn,
  iwishbagAliexpressWalmartEbaySelfContradictionIntroHe,
  IWISHBAG_TARGET_IL_URL,
  IWISHBAG_TARGET_SELF_CONTRADICTION_VERIFIED,
  iwishbagTargetSelfContradictionRows,
  iwishbagTargetSelfContradictionHeadlineEn,
  iwishbagTargetSelfContradictionIntroHe,
  IWISHBAG_AMAZONUS_SELF_CONTRADICTION_VERIFIED,
  iwishbagAmazonUsSelfContradictionRows,
  iwishbagAmazonUsSelfContradictionHeadlineEn,
  iwishbagAmazonUsSelfContradictionIntroHe,
  IWISHBAG_AMAZONINDIA_SELF_CONTRADICTION_VERIFIED,
  iwishbagAmazonIndiaSelfContradictionRows,
  iwishbagAmazonIndiaSelfContradictionHeadlineEn,
  iwishbagAmazonIndiaSelfContradictionIntroHe,
  IWISHBAG_AMAZONJP_IL_URL,
  IWISHBAG_AMAZONJP_SELF_CONTRADICTION_VERIFIED,
  iwishbagAmazonJpSelfContradictionRows,
  iwishbagAmazonJpSelfContradictionHeadlineEn,
  iwishbagAmazonJpSelfContradictionIntroHe,
  IWISHBAG_MYNTRA_IL_URL,
  IWISHBAG_MYNTRA_SELF_CONTRADICTION_VERIFIED,
  iwishbagMyntraSelfContradictionRows,
  iwishbagMyntraSelfContradictionHeadlineEn,
  iwishbagMyntraSelfContradictionIntroHe,
  IWISHBAG_YAHOO_SHOPPING_JP_IL_URL,
  IWISHBAG_SHEIN_TEMU_404_VERIFIED,
  IWISHBAG_SHEIN_IL_URL_LIVE,
  IWISHBAG_TEMU_IL_URL_LIVE,
  RATESHIPS_IL_URL,
  RATESHIPS_STALE_17_VERIFIED,
  RATESHIPS_FAQ_VAT_17_QUOTE,
  rateShipsSideBySideRows,
  rateShipsStale17HeadlineEn,
  rateShipsSideBySideIntroHe,
  PTUR_THRESHOLD_CHURN_LAST_CHECKED,
  PTUR_OFFICIAL_USD,
  PTUR_CHURN_130_USD,
  SKILLS_IL_CUSTOMS_CALC_URL,
  OPENACCOUNTANTS_IL_CUSTOMS_URL,
  GOV_IL_PERSONAL_IMPORT_CALC_URL,
  pturThresholdChurnRows,
  pturThresholdChurnHeadlineEn,
  pturThresholdChurnLastCheckedStampEn,
  pturOfficial75CiteEn,
  pturThresholdChurnIntroHe,
  IWISHBAG_ETSY_IL_URL,
  IWISHBAG_EBAY_IL_URL,
  IWISHBAG_WALMART_IL_URL,
  IWISHBAG_ALIEXPRESS_IL_URL,
  IWISHBAG_SHEIN_IL_URL,
  IWISHBAG_TEMU_IL_URL,
  IWISHBAG_FLIPKART_IL_URL,
  IWISHBAG_AMAZONINDIA_IL_URL,
  MARKETPLACE_HOW_TOS,
  getMarketplaceHowTo,
  iwishbagMarketplaceSideBySideRows,
  iwishbagMarketplaceFoilIntroEn,
  SKILLS_IL_CUSTOMS,
  SKILLS_IL_SHEKEL,
  SKILLS_IL_STAMP_DATE,
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

test('customs stamp copy: Skills IL customs v1.4.0 + shekel v2.2.0 · Sep 23, 18% not 17%, BoI+0.5%', () => {
  assert.equal(SKILLS_IL_CUSTOMS, 'v1.4.0');
  assert.equal(SKILLS_IL_SHEKEL, 'v2.2.0');
  assert.equal(SKILLS_IL_STAMP_DATE, 'Sep 23');

  const stamp = customsStampCopyHe();
  assert.match(stamp, /Skills IL customs v1\.4\.0/);
  assert.match(stamp, /shekel v2\.2\.0/);
  assert.match(stamp, /Sep 23/);
  assert.doesNotMatch(stamp, /Sep 6/);
  assert.match(stamp, /מע״ם בישראל 18%/);
  assert.match(stamp, /לא 17%/);
  assert.match(stamp, /בנק ישראל/);
  assert.match(stamp, /\+ 0\.5%/);
  assert.match(stamp, /רשומון/);
  assert.match(stamp, /\$75/);
  assert.match(stamp, /\$500/);
  assert.match(stamp, /ויתור מכס|מע״ם בלבד/);
  assert.match(stamp, /iWishBag/);
  assert.match(stamp, /2026-04-29/);
  assert.match(stamp, /"17% VAT"/); // foil quotes rival body bug
  assert.doesNotMatch(stamp, /מע״ם 17%/);
});

test('English foil: Israel VAT is 18% not 17%', () => {
  const en = israelVat18Not17FoilEn();
  assert.equal(en, 'Israel VAT is 18% not 17%.');
  assert.match(en, /18%/);
  assert.match(en, /not 17%/);
  assert.doesNotMatch(en, /BoI|customs math/i);
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

test('keep #18–#24 math: constants + tooltip + honesty strip + estimator untouched', () => {
  assert.equal(IL_VAT_RATE, 0.18);
  assert.equal(BOI_CUSTOMS_FX_UPLIFT, 0.005);
  assert.equal(USD_TO_ILS_RATE, 3.6);
  assert.equal(DUTY_FREE_THRESHOLD_USD, 75);
  const tip = customsFxTooltipHe();
  assert.match(tip, /\+ 0\.5%/);
  const strip = vatFxHonestyStripHe();
  assert.match(strip, /מע״ם 18%/);
  assert.match(strip, /לא 17%/);
  assert.doesNotMatch(strip, /מע״ם 17%/);
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
  // ITA foil from #23 still present
  assert.match(ITA_SHAAR_OLAMI_CALC_URL, /shaarolami-query\.customs\.mof\.gov\.il/);
  // #24 English foil still present
  assert.equal(israelVat18Not17FoilEn(), 'Israel VAT is 18% not 17%.');
});

test('ITA Shaar Olami foil: deep-link + same $75 / $75–$500 bands as רשות המיסים', () => {
  assert.match(ITA_SHAAR_OLAMI_CALC_URL, /^https:\/\/shaarolami-query\.customs\.mof\.gov\.il\//);
  assert.match(ITA_SHAAR_OLAMI_CALC_URL, /PersonalImportTax\/Home\/Calc/);

  const strip = itaShaarOlamiFoilStripHe();
  assert.match(strip, /רשות המיסים|שער עולמי/);
  assert.match(strip, /\$75/);
  assert.match(strip, /\$500/);
  assert.match(strip, /מע״ם בלבד|ויתור מכס/);
  assert.match(strip, /פטור/);
  assert.doesNotMatch(strip, /מע״ם 17%/);

  const label = itaShaarOlamiLinkLabelHe();
  assert.match(label, /שער עולמי/);
  assert.match(label, /רשות המיסים/);
});

test('ITA Shaar Olami foil is presentation-only: bands + estimator still match #21/#22', () => {
  assert.equal(DUTY_FREE_THRESHOLD_USD, 75);
  assert.equal(DUTY_WAIVER_CEILING_USD, 500);
  assert.equal(classifyDutyWaiverBand(74.99), 'ptur');
  assert.equal(classifyDutyWaiverBand(75), 'vat-only');
  assert.equal(classifyDutyWaiverBand(500), 'full');
  const mid = estimateLandedCost({ price: 200, currency: 'USD', freeShipping: true });
  assert.ok(mid);
  assert.equal(mid.dutyFree, false);
  assert.ok(Math.abs(mid.vatIls - IL_VAT_RATE * 200 * USD_TO_ILS_RATE) < 1e-9);
});


test('iWishBag side-by-side foil: body still wrong as of Sep 7 night', () => {
  assert.equal(
    IWISHBAG_AMAZON_IL_URL,
    'https://www.iwishbag.com/how-to-buy-from/amazon-us/israel',
  );
  assert.equal(IWISHBAG_PAGE_LAST_UPDATED, '2026-04-29');
  assert.equal(IWISHBAG_BODY_STILL_WRONG_VERIFIED, 'Sep 7 night');

  const headline = iwishbagBodyStillWrongHeadlineEn();
  assert.match(headline, /body still wrong/i);
  assert.match(headline, /"17% VAT"/);
  assert.match(headline, /table\/reality 18%/);
  assert.match(headline, /Sep 7 night/);
  assert.doesNotMatch(headline, /מע״ם 17%/);

  const intro = iwishbagSideBySideIntroHe();
  assert.match(intro, /iWishBag/);
  assert.match(intro, /"17% VAT"/);
  assert.match(intro, /18%/);
  assert.match(intro, /Sep 7 night/);
  assert.match(intro, /2026-04-29/);
  assert.match(intro, /BoI\+0\.5%/);
  assert.doesNotMatch(intro, /מע״ם 17%/);

  const rows = iwishbagSideBySideRows();
  assert.ok(rows.length >= 4);
  const body = rows.find((r) => r.id === 'body-vat');
  assert.ok(body);
  assert.equal(body.iwishbagWrong, true);
  assert.match(body.shopliEn, /18%/);
  assert.match(body.iwishbagEn, /17%/);
  assert.match(body.iwishbagEn, /still wrong/i);

  const table = rows.find((r) => r.id === 'table-vat');
  assert.ok(table);
  assert.match(table.shopliEn, /18%/);
  assert.match(table.iwishbagEn, /18%/);
  assert.equal(table.iwishbagWrong, undefined);

  const paste = rows.find((r) => r.id === 'paste-url');
  assert.ok(paste);
  assert.match(paste.shopliEn, /\/landed/);
  assert.match(paste.labelEn, /Amazon|URL/i);

  const fx = rows.find((r) => r.id === 'boi-fx');
  assert.ok(fx);
  assert.match(fx.shopliEn, /Labeled|rashimon/i);

  const updated = rows.find((r) => r.id === 'last-updated');
  assert.ok(updated);
  assert.equal(updated.iwishbagWrong, true);
  assert.match(updated.iwishbagEn, /2026-04-29/);
  assert.match(updated.iwishbagEn, /Sep 7 night/);
});

test('side-by-side foil is presentation-only: #18–#24 math + prior foils intact', () => {
  assert.equal(IL_VAT_RATE, 0.18);
  assert.equal(BOI_CUSTOMS_FX_UPLIFT, 0.005);
  assert.equal(USD_TO_ILS_RATE, 3.6);
  assert.equal(DUTY_FREE_THRESHOLD_USD, 75);
  assert.equal(DUTY_WAIVER_CEILING_USD, 500);
  assert.equal(SKILLS_IL_CUSTOMS, 'v1.4.0');
  assert.equal(SKILLS_IL_SHEKEL, 'v2.2.0');
  assert.equal(SKILLS_IL_STAMP_DATE, 'Sep 23');

  const strip = vatFxHonestyStripHe();
  assert.match(strip, /מע״ם 18%/);
  assert.match(strip, /לא 17%/);

  assert.match(ITA_SHAAR_OLAMI_CALC_URL, /shaarolami-query\.customs\.mof\.gov\.il/);
  assert.match(itaShaarOlamiFoilStripHe(), /\$75/);

  assert.equal(israelVat18Not17FoilEn(), 'Israel VAT is 18% not 17%.');

  const mid = estimateLandedCost({ price: 200, currency: 'USD', freeShipping: true });
  assert.ok(mid);
  assert.ok(Math.abs(mid.vatIls - IL_VAT_RATE * 200 * USD_TO_ILS_RATE) < 1e-9);
});


test('marketplace how-tos: Etsy/eBay/Walmart/AliExpress/Amazon JP/Shein/Temu/Flipkart/Amazon US/Amazon India/Myntra iWishBag URLs + paths', () => {
  assert.equal(IWISHBAG_ETSY_IL_URL, 'https://www.iwishbag.com/how-to-buy-from/etsy/israel');
  assert.equal(IWISHBAG_EBAY_IL_URL, 'https://www.iwishbag.com/how-to-buy-from/ebay/israel');
  assert.equal(IWISHBAG_WALMART_IL_URL, 'https://www.iwishbag.com/how-to-buy-from/walmart/israel');
  assert.equal(IWISHBAG_ALIEXPRESS_IL_URL, 'https://www.iwishbag.com/how-to-buy-from/aliexpress/israel');
  assert.equal(IWISHBAG_AMAZONJP_IL_URL, 'https://www.iwishbag.com/how-to-buy-from/amazon-japan/israel');
  assert.equal(IWISHBAG_SHEIN_IL_URL, 'https://www.iwishbag.com/how-to-buy-from/shein/israel');
  assert.equal(IWISHBAG_TEMU_IL_URL, 'https://www.iwishbag.com/how-to-buy-from/temu/israel');
  assert.equal(IWISHBAG_SHEIN_IL_URL_LIVE, false);
  assert.equal(IWISHBAG_TEMU_IL_URL_LIVE, false);
  assert.equal(IWISHBAG_SHEIN_TEMU_404_VERIFIED, '2026-09-23 12:40');
  assert.equal(getMarketplaceHowTo('shein').iwishbagUrlLive, false);
  assert.equal(getMarketplaceHowTo('temu').iwishbagUrlLive, false);
  assert.equal(IWISHBAG_FLIPKART_IL_URL, 'https://www.iwishbag.com/how-to-buy-from/flipkart/israel');
  assert.equal(IWISHBAG_AMAZON_IL_URL, 'https://www.iwishbag.com/how-to-buy-from/amazon-us/israel');
  assert.equal(IWISHBAG_AMAZONINDIA_IL_URL, 'https://www.iwishbag.com/how-to-buy-from/amazon-india/israel');

  assert.equal(MARKETPLACE_HOW_TOS.length, 11);
  const ids = MARKETPLACE_HOW_TOS.map((m) => m.id);
  assert.deepEqual(ids, ['etsy', 'ebay', 'walmart', 'aliexpress', 'amazonjp', 'shein', 'temu', 'flipkart', 'amazonus', 'amazonindia', 'myntra']);

  for (const m of MARKETPLACE_HOW_TOS) {
    assert.match(m.path, new RegExp(`^/how-to-${m.id}-israel$`));
    assert.match(m.iwishbagUrl, /iwishbag\.com\/how-to-buy-from\//);
    assert.equal(getMarketplaceHowTo(m.id).path, m.path);
  }

  const ae = getMarketplaceHowTo('aliexpress');
  assert.equal(ae.nameEn, 'AliExpress');
  assert.equal(ae.path, '/how-to-aliexpress-israel');
  const jp = getMarketplaceHowTo('amazonjp');
  assert.equal(jp.nameEn, 'Amazon JP');
  assert.equal(jp.path, '/how-to-amazonjp-israel');
  const shein = getMarketplaceHowTo('shein');
  assert.equal(shein.nameEn, 'Shein');
  assert.equal(shein.path, '/how-to-shein-israel');
  const temu = getMarketplaceHowTo('temu');
  assert.equal(temu.nameEn, 'Temu');
  assert.equal(temu.path, '/how-to-temu-israel');
  const flipkart = getMarketplaceHowTo('flipkart');
  assert.equal(flipkart.nameEn, 'Flipkart');
  assert.equal(flipkart.path, '/how-to-flipkart-israel');
  const amazonus = getMarketplaceHowTo('amazonus');
  assert.equal(amazonus.nameEn, 'Amazon US');
  assert.equal(amazonus.path, '/how-to-amazonus-israel');
  assert.equal(amazonus.iwishbagUrl, IWISHBAG_AMAZON_IL_URL);
  const amazonindia = getMarketplaceHowTo('amazonindia');
  assert.equal(amazonindia.nameEn, 'Amazon India');
  assert.equal(amazonindia.path, '/how-to-amazonindia-israel');
  assert.equal(amazonindia.iwishbagUrl, IWISHBAG_AMAZONINDIA_IL_URL);
  assert.equal(IWISHBAG_MYNTRA_IL_URL, 'https://www.iwishbag.com/how-to-buy-from/myntra/israel');
  const myntra = getMarketplaceHowTo('myntra');
  assert.equal(myntra.nameEn, 'Myntra');
  assert.equal(myntra.path, '/how-to-myntra-israel');
  assert.equal(myntra.iwishbagUrl, IWISHBAG_MYNTRA_IL_URL);
});

test('marketplace foil copy: 18% not 17%, Skills Sep 23 stamp, body still wrong', () => {
  for (const m of MARKETPLACE_HOW_TOS) {
    const intro = iwishbagMarketplaceFoilIntroEn(m.id);
    assert.match(intro, /"17% VAT"/);
    assert.match(intro, /18%/);
    assert.match(intro, /Sep 7 night/);
    assert.match(intro, /\/landed/);
    assert.match(intro, new RegExp(m.nameEn));
    assert.match(intro, /Israel VAT is 18% not 17%/);
    assert.doesNotMatch(intro, /מע״ם 17%/);

    const rows = iwishbagMarketplaceSideBySideRows(m.id);
    const body = rows.find((r) => r.id === 'body-vat');
    assert.ok(body);
    assert.equal(body.iwishbagWrong, true);
    assert.match(body.iwishbagEn, /17%/);
    assert.match(body.iwishbagEn, /still wrong/i);
    assert.match(body.shopliEn, /18%/);

    const paste = rows.find((r) => r.id === 'paste-url');
    assert.ok(paste);
    assert.match(paste.labelEn, new RegExp(m.nameEn));
    assert.match(paste.shopliEn, /\/landed/);
    assert.ok(paste.shopliEn.includes(m.path));
  }

  // Shared foils still present
  assert.equal(israelVat18Not17FoilEn(), 'Israel VAT is 18% not 17%.');
  assert.equal(SKILLS_IL_CUSTOMS, 'v1.4.0');
  assert.equal(SKILLS_IL_SHEKEL, 'v2.2.0');
  assert.equal(SKILLS_IL_STAMP_DATE, 'Sep 23');
  const stamp = customsStampCopyHe();
  assert.match(stamp, /Sep 23/);
  assert.match(stamp, /לא 17%/);
});

test('marketplace foil is presentation-only: estimator math unchanged', () => {
  assert.equal(IL_VAT_RATE, 0.18);
  assert.equal(BOI_CUSTOMS_FX_UPLIFT, 0.005);
  assert.equal(USD_TO_ILS_RATE, 3.6);
  assert.equal(DUTY_FREE_THRESHOLD_USD, 75);
  assert.equal(DUTY_WAIVER_CEILING_USD, 500);
  const mid = estimateLandedCost({ price: 200, currency: 'USD', freeShipping: true });
  assert.ok(mid);
  assert.ok(Math.abs(mid.vatIls - IL_VAT_RATE * 200 * USD_TO_ILS_RATE) < 1e-9);
});


test('DutyDecoder side-by-side foil: still 17% as of Sep 15', () => {
  assert.equal(DUTYDECODER_IL_URL, 'https://dutydecoder.com/israel');
  assert.equal(DUTYDECODER_STALE_17_VERIFIED, 'Sep 15');

  const headline = dutyDecoderStale17HeadlineEn();
  assert.match(headline, /DutyDecoder still wrong/i);
  assert.match(headline, /"17% VAT"/);
  assert.match(headline, /reality 18%/);
  assert.match(headline, /Sep 15/);
  assert.match(headline, /dutydecoder\.com\/israel/);
  assert.doesNotMatch(headline, /מע״ם 17%/);

  const intro = dutyDecoderSideBySideIntroHe();
  assert.match(intro, /DutyDecoder/);
  assert.match(intro, /"17% VAT"/);
  assert.match(intro, /18%/);
  assert.match(intro, /Sep 15/);
  assert.match(intro, /BoI\+0\.5%/);
  assert.doesNotMatch(intro, /מע״ם 17%/);

  const rows = dutyDecoderSideBySideRows();
  assert.ok(rows.length >= 4);

  const badge = rows.find((r) => r.id === 'badge-vat');
  assert.ok(badge);
  assert.equal(badge.dutyDecoderWrong, true);
  assert.match(badge.shopliEn, /18%/);
  assert.match(badge.dutyDecoderEn, /17%/);
  assert.match(badge.dutyDecoderEn, /still wrong/i);

  const body = rows.find((r) => r.id === 'body-vat');
  assert.ok(body);
  assert.equal(body.dutyDecoderWrong, true);
  assert.match(body.shopliEn, /18%/);
  assert.match(body.dutyDecoderEn, /17%/);

  const reality = rows.find((r) => r.id === 'reality');
  assert.ok(reality);
  assert.match(reality.shopliEn, /18%/);
  assert.match(reality.dutyDecoderEn, /18%/);

  const paste = rows.find((r) => r.id === 'paste-url');
  assert.ok(paste);
  assert.match(paste.shopliEn, /\/landed/);

  const verified = rows.find((r) => r.id === 'last-verified');
  assert.ok(verified);
  assert.equal(verified.dutyDecoderWrong, true);
  assert.match(verified.dutyDecoderEn, /Sep 15/);
  assert.match(verified.dutyDecoderEn, /17%/);
});

test('DutyDecoder foil is presentation-only: #18–#36 math + prior foils intact', () => {
  assert.equal(IL_VAT_RATE, 0.18);
  assert.equal(BOI_CUSTOMS_FX_UPLIFT, 0.005);
  assert.equal(USD_TO_ILS_RATE, 3.6);
  assert.equal(DUTY_FREE_THRESHOLD_USD, 75);
  assert.equal(DUTY_WAIVER_CEILING_USD, 500);
  assert.equal(SKILLS_IL_CUSTOMS, 'v1.4.0');
  assert.equal(SKILLS_IL_SHEKEL, 'v2.2.0');
  assert.equal(SKILLS_IL_STAMP_DATE, 'Sep 23');

  const strip = vatFxHonestyStripHe();
  assert.match(strip, /מע״ם 18%/);
  assert.match(strip, /לא 17%/);

  assert.match(ITA_SHAAR_OLAMI_CALC_URL, /shaarolami-query\.customs\.mof\.gov\.il/);
  assert.equal(israelVat18Not17FoilEn(), 'Israel VAT is 18% not 17%.');
  assert.equal(IWISHBAG_BODY_STILL_WRONG_VERIFIED, 'Sep 7 night');

  const mid = estimateLandedCost({ price: 200, currency: 'USD', freeShipping: true });
  assert.ok(mid);
  assert.ok(Math.abs(mid.vatIls - IL_VAT_RATE * 200 * USD_TO_ILS_RATE) < 1e-9);
});


test('Gateway Lines side-by-side foil: still מע״מ(17%) as of Sep 22', () => {
  assert.equal(
    GATEWAYLINES_TARIFF_URL,
    'https://tariff.gatewaylines.co.il/tariff-calculator',
  );
  assert.equal(GATEWAYLINES_STALE_17_VERIFIED, 'Sep 22');
  assert.equal(GATEWAYLINES_VAT_LABEL_QUOTE, 'מע״מ(17%)');

  const headline = gatewayLinesStale17HeadlineEn();
  assert.match(headline, /Gateway Lines still wrong/i);
  assert.match(headline, /מע״מ\(17%\)/);
  assert.match(headline, /reality 18%/);
  assert.match(headline, /BoI\+0\.5%/);
  assert.match(headline, /Sep 22/);
  assert.match(headline, /tariff\.gatewaylines\.co\.il/);

  const intro = gatewayLinesSideBySideIntroHe();
  assert.match(intro, /Gateway Lines/);
  assert.match(intro, /מע״מ\(17%\)/);
  assert.match(intro, /18%/);
  assert.match(intro, /Sep 22/);
  assert.match(intro, /BoI\+0\.5%/);

  const rows = gatewayLinesSideBySideRows();
  assert.ok(rows.length >= 4);

  const breakdown = rows.find((r) => r.id === 'breakdown-vat');
  assert.ok(breakdown);
  assert.equal(breakdown.gatewayLinesWrong, true);
  assert.match(breakdown.shopliEn, /18%/);
  assert.match(breakdown.gatewayLinesEn, /מע״מ\(17%\)/);
  assert.match(breakdown.gatewayLinesEn, /still wrong/i);

  const methodology = rows.find((r) => r.id === 'methodology-vat');
  assert.ok(methodology);
  assert.equal(methodology.gatewayLinesWrong, true);
  assert.match(methodology.shopliEn, /18%/);
  assert.match(methodology.shopliEn, /BoI\+0\.5%/);
  assert.match(methodology.gatewayLinesEn, /מע״מ 17%/);

  const reality = rows.find((r) => r.id === 'reality');
  assert.ok(reality);
  assert.match(reality.shopliEn, /18%/);
  assert.match(reality.gatewayLinesEn, /18%/);

  const paste = rows.find((r) => r.id === 'paste-url');
  assert.ok(paste);
  assert.match(paste.shopliEn, /\/landed/);

  const verified = rows.find((r) => r.id === 'last-verified');
  assert.ok(verified);
  assert.equal(verified.gatewayLinesWrong, true);
  assert.match(verified.gatewayLinesEn, /Sep 22/);
  assert.match(verified.gatewayLinesEn, /מע״מ\(17%\)/);
});

test('Gateway Lines foil is presentation-only: #18–#38 math + prior foils intact', () => {
  assert.equal(IL_VAT_RATE, 0.18);
  assert.equal(BOI_CUSTOMS_FX_UPLIFT, 0.005);
  assert.equal(USD_TO_ILS_RATE, 3.6);
  assert.equal(DUTY_FREE_THRESHOLD_USD, 75);
  assert.equal(DUTY_WAIVER_CEILING_USD, 500);
  assert.equal(SKILLS_IL_CUSTOMS, 'v1.4.0');
  assert.equal(SKILLS_IL_SHEKEL, 'v2.2.0');
  assert.equal(SKILLS_IL_STAMP_DATE, 'Sep 23');

  const strip = vatFxHonestyStripHe();
  assert.match(strip, /מע״ם 18%/);
  assert.match(strip, /לא 17%/);

  assert.match(ITA_SHAAR_OLAMI_CALC_URL, /shaarolami-query\.customs\.mof\.gov\.il/);
  assert.equal(israelVat18Not17FoilEn(), 'Israel VAT is 18% not 17%.');
  assert.equal(IWISHBAG_BODY_STILL_WRONG_VERIFIED, 'Sep 7 night');
  assert.equal(DUTYDECODER_STALE_17_VERIFIED, 'Sep 15');
  assert.equal(GATEWAYLINES_STALE_17_VERIFIED, 'Sep 22');

  const mid = estimateLandedCost({ price: 200, currency: 'USD', freeShipping: true });
  assert.ok(mid);
  assert.ok(Math.abs(mid.vatIls - IL_VAT_RATE * 200 * USD_TO_ILS_RATE) < 1e-9);
});

test('VAT truth moat: Tax Authority 18% cite + last-checked + competitors still 17%', () => {
  assert.equal(
    TAX_AUTHORITY_VAT_CITE_URL,
    'https://www.gov.il/he/departments/topics/vat/govil-landing-page',
  );
  assert.equal(TAX_AUTHORITY_VAT_RATE_PCT, 18);
  assert.equal(VAT_TRUTH_LAST_CHECKED, '2026-09-22 18:45');
  assert.equal(TAX_AUTHORITY_VAT_RATE_PCT, Math.round(IL_VAT_RATE * 100));

  const cite = taxAuthorityVat18CiteEn();
  assert.match(cite, /Tax Authority/);
  assert.match(cite, /רשות המיסים/);
  assert.match(cite, /18%/);
  assert.match(cite, /2025-01-01/);

  const stamp = vatTruthLastCheckedStampEn();
  assert.match(stamp, /Last checked/);
  assert.match(stamp, /2026-09-22 18:45/);

  const headline = vatTruthHeadlineEn();
  assert.match(headline, /VAT truth/i);
  assert.match(headline, /Tax Authority 18%/);
  assert.match(headline, /competitors still 17%/i);
  assert.match(headline, /Gateway Lines still wrong post-#39/);
  assert.match(headline, /2026-09-22 18:45/);

  const intro = vatTruthIntroHe();
  assert.match(intro, /רשות המיסים/);
  assert.match(intro, /18%/);
  assert.match(intro, /Gateway Lines/);
  assert.match(intro, /#39/);
  assert.match(intro, /2026-09-22 18:45/);
  assert.match(intro, /BoI\+0\.5%/);

  const rows = vatTruthCompetitorsStill17ProofRows();
  assert.ok(rows.length >= 3);

  const gateway = rows.find((r) => r.id === 'gatewaylines');
  assert.ok(gateway);
  assert.equal(gateway.stillWrong, true);
  assert.equal(gateway.liveUrl, GATEWAYLINES_TARIFF_URL);
  assert.match(gateway.claimEn, /מע״מ\(17%\)/);
  assert.match(gateway.claimEn, /post-#39/);

  const duty = rows.find((r) => r.id === 'dutydecoder');
  assert.ok(duty);
  assert.equal(duty.stillWrong, true);
  assert.equal(duty.liveUrl, DUTYDECODER_IL_URL);
  assert.match(duty.claimEn, /17%/);

  const iwish = rows.find((r) => r.id === 'iwishbag');
  assert.ok(iwish);
  assert.equal(iwish.stillWrong, true);
  assert.equal(iwish.liveUrl, IWISHBAG_AMAZON_IL_URL);
  assert.match(iwish.claimEn, /17%/);

  // Every proof row is a live still-wrong competitor
  assert.ok(rows.every((r) => r.stillWrong && /17%/.test(r.claimEn)));
});

test('VAT truth moat is presentation-only: #18–#39 math + prior foils intact', () => {
  assert.equal(IL_VAT_RATE, 0.18);
  assert.equal(BOI_CUSTOMS_FX_UPLIFT, 0.005);
  assert.equal(USD_TO_ILS_RATE, 3.6);
  assert.equal(DUTY_FREE_THRESHOLD_USD, 75);
  assert.equal(DUTY_WAIVER_CEILING_USD, 500);
  assert.equal(SKILLS_IL_CUSTOMS, 'v1.4.0');
  assert.equal(SKILLS_IL_SHEKEL, 'v2.2.0');
  assert.equal(SKILLS_IL_STAMP_DATE, 'Sep 23');

  assert.match(ITA_SHAAR_OLAMI_CALC_URL, /shaarolami-query\.customs\.mof\.gov\.il/);
  assert.equal(israelVat18Not17FoilEn(), 'Israel VAT is 18% not 17%.');
  assert.equal(IWISHBAG_BODY_STILL_WRONG_VERIFIED, 'Sep 7 night');
  assert.equal(DUTYDECODER_STALE_17_VERIFIED, 'Sep 15');
  assert.equal(GATEWAYLINES_STALE_17_VERIFIED, 'Sep 22');
  assert.equal(GATEWAYLINES_VAT_LABEL_QUOTE, 'מע״מ(17%)');
  assert.equal(VAT_TRUTH_LAST_CHECKED, '2026-09-22 18:45');
  assert.equal(TAX_AUTHORITY_VAT_RATE_PCT, 18);

  const mid = estimateLandedCost({ price: 200, currency: 'USD', freeShipping: true });
  assert.ok(mid);
  assert.ok(Math.abs(mid.vatIls - IL_VAT_RATE * 200 * USD_TO_ILS_RATE) < 1e-9);
});

test('iWishBag Flipkart+Etsy self-contradiction strip: body 17% vs own table 18%', () => {
  assert.equal(IWISHBAG_PAGE_LAST_UPDATED, '2026-04-29');
  assert.equal(IWISHBAG_FLIPKART_ETSY_SELF_CONTRADICTION_VERIFIED, '2026-09-15 14:15');
  assert.equal(IWISHBAG_FLIPKART_IL_URL, 'https://www.iwishbag.com/how-to-buy-from/flipkart/israel');
  assert.equal(IWISHBAG_ETSY_IL_URL, 'https://www.iwishbag.com/how-to-buy-from/etsy/israel');
  assert.match(IWISHBAG_BODY_17_VAT_QUOTE, /17% VAT/);
  assert.match(IWISHBAG_OWN_TABLE_18_VAT_QUOTE, /Standard VAT\/GST 18%/);

  const headline = iwishbagFlipkartEtsySelfContradictionHeadlineEn();
  assert.match(headline, /Flipkart\+Etsy/i);
  assert.match(headline, /self-contradiction/i);
  assert.match(headline, /17% VAT/);
  assert.match(headline, /Standard VAT\/GST 18%/);
  assert.match(headline, /2026-04-29/);
  assert.match(headline, /2026-09-15 14:15/);

  const intro = iwishbagFlipkartEtsySelfContradictionIntroHe();
  assert.match(intro, /Flipkart\+Etsy/);
  assert.match(intro, /17% VAT/);
  assert.match(intro, /18%/);
  assert.match(intro, /2026-04-29/);
  assert.match(intro, /2026-09-15 14:15/);
  assert.match(intro, /BoI\+0\.5%/);

  const rows = iwishbagFlipkartEtsySelfContradictionRows();
  assert.ok(rows.length >= 6);

  const body = rows.find((r) => r.id === 'body-vat');
  assert.ok(body);
  assert.equal(body.iwishbagWrong, true);
  assert.match(body.iwishbagEn, /17% VAT/);
  assert.match(body.shopliEn, /18%/);

  const table = rows.find((r) => r.id === 'own-table-vat');
  assert.ok(table);
  assert.match(table.iwishbagEn, /Standard VAT\/GST 18%/);
  assert.notEqual(table.iwishbagWrong, true);

  const self = rows.find((r) => r.id === 'self-contradiction');
  assert.ok(self);
  assert.equal(self.iwishbagWrong, true);
  assert.match(self.iwishbagEn, /Body 17% vs own table 18%/);

  const flipkart = rows.find((r) => r.id === 'flipkart-lane');
  assert.ok(flipkart);
  assert.equal(flipkart.iwishbagWrong, true);
  assert.equal(flipkart.liveUrl, IWISHBAG_FLIPKART_IL_URL);
  assert.match(flipkart.iwishbagEn, /Apr 29/);

  const etsy = rows.find((r) => r.id === 'etsy-lane');
  assert.ok(etsy);
  assert.equal(etsy.iwishbagWrong, true);
  assert.equal(etsy.liveUrl, IWISHBAG_ETSY_IL_URL);
  assert.match(etsy.iwishbagEn, /Apr 29/);

  const last = rows.find((r) => r.id === 'last-updated');
  assert.ok(last);
  assert.equal(last.iwishbagWrong, true);
  assert.match(last.iwishbagEn, /2026-04-29/);
  assert.match(last.iwishbagEn, /2026-09-15 14:15/);
});

test('Flipkart+Etsy self-contradiction foil is presentation-only: #18–#41 math + prior foils intact', () => {
  assert.equal(IL_VAT_RATE, 0.18);
  assert.equal(BOI_CUSTOMS_FX_UPLIFT, 0.005);
  assert.equal(USD_TO_ILS_RATE, 3.6);
  assert.equal(DUTY_FREE_THRESHOLD_USD, 75);
  assert.equal(DUTY_WAIVER_CEILING_USD, 500);
  assert.equal(SKILLS_IL_CUSTOMS, 'v1.4.0');
  assert.equal(SKILLS_IL_SHEKEL, 'v2.2.0');
  assert.equal(SKILLS_IL_STAMP_DATE, 'Sep 23');

  assert.match(ITA_SHAAR_OLAMI_CALC_URL, /shaarolami-query\.customs\.mof\.gov\.il/);
  assert.equal(israelVat18Not17FoilEn(), 'Israel VAT is 18% not 17%.');
  assert.equal(IWISHBAG_BODY_STILL_WRONG_VERIFIED, 'Sep 7 night');
  assert.equal(DUTYDECODER_STALE_17_VERIFIED, 'Sep 15');
  assert.equal(GATEWAYLINES_STALE_17_VERIFIED, 'Sep 22');
  assert.equal(GATEWAYLINES_VAT_LABEL_QUOTE, 'מע״מ(17%)');
  assert.equal(VAT_TRUTH_LAST_CHECKED, '2026-09-22 18:45');
  assert.equal(TAX_AUTHORITY_VAT_RATE_PCT, 18);
  assert.equal(IWISHBAG_FLIPKART_ETSY_SELF_CONTRADICTION_VERIFIED, '2026-09-15 14:15');
  assert.equal(IWISHBAG_PAGE_LAST_UPDATED, '2026-04-29');

  const mid = estimateLandedCost({ price: 200, currency: 'USD', freeShipping: true });
  assert.ok(mid);
  assert.ok(Math.abs(mid.vatIls - IL_VAT_RATE * 200 * USD_TO_ILS_RATE) < 1e-9);
});

test('iWishBag AliExpress+Walmart+eBay self-contradiction strip: body 17% vs own table 18%', () => {
  assert.equal(IWISHBAG_PAGE_LAST_UPDATED, '2026-04-29');
  assert.equal(IWISHBAG_ALIEXPRESS_WALMART_EBAY_SELF_CONTRADICTION_VERIFIED, '2026-09-15 16:35');
  assert.equal(IWISHBAG_ALIEXPRESS_IL_URL, 'https://www.iwishbag.com/how-to-buy-from/aliexpress/israel');
  assert.equal(IWISHBAG_WALMART_IL_URL, 'https://www.iwishbag.com/how-to-buy-from/walmart/israel');
  assert.equal(IWISHBAG_EBAY_IL_URL, 'https://www.iwishbag.com/how-to-buy-from/ebay/israel');
  assert.match(IWISHBAG_BODY_17_VAT_QUOTE, /17% VAT/);
  assert.match(IWISHBAG_OWN_TABLE_18_VAT_QUOTE, /Standard VAT\/GST 18%/);

  const headline = iwishbagAliexpressWalmartEbaySelfContradictionHeadlineEn();
  assert.match(headline, /AliExpress\+Walmart\+eBay/i);
  assert.match(headline, /self-contradiction/i);
  assert.match(headline, /17% VAT/);
  assert.match(headline, /Standard VAT\/GST 18%/);
  assert.match(headline, /2026-04-29/);
  assert.match(headline, /2026-09-15 16:35/);

  const intro = iwishbagAliexpressWalmartEbaySelfContradictionIntroHe();
  assert.match(intro, /AliExpress\+Walmart\+eBay/);
  assert.match(intro, /17% VAT/);
  assert.match(intro, /18%/);
  assert.match(intro, /2026-04-29/);
  assert.match(intro, /2026-09-15 16:35/);
  assert.match(intro, /BoI\+0\.5%/);

  const rows = iwishbagAliexpressWalmartEbaySelfContradictionRows();
  assert.ok(rows.length >= 7);

  const body = rows.find((r) => r.id === 'body-vat');
  assert.ok(body);
  assert.equal(body.iwishbagWrong, true);
  assert.match(body.iwishbagEn, /17% VAT/);
  assert.match(body.shopliEn, /18%/);

  const table = rows.find((r) => r.id === 'own-table-vat');
  assert.ok(table);
  assert.match(table.iwishbagEn, /Standard VAT\/GST 18%/);
  assert.notEqual(table.iwishbagWrong, true);

  const self = rows.find((r) => r.id === 'self-contradiction');
  assert.ok(self);
  assert.equal(self.iwishbagWrong, true);
  assert.match(self.iwishbagEn, /Body 17% vs own table 18%/);

  const aliexpress = rows.find((r) => r.id === 'aliexpress-lane');
  assert.ok(aliexpress);
  assert.equal(aliexpress.iwishbagWrong, true);
  assert.equal(aliexpress.liveUrl, IWISHBAG_ALIEXPRESS_IL_URL);
  assert.match(aliexpress.iwishbagEn, /Apr 29/);

  const walmart = rows.find((r) => r.id === 'walmart-lane');
  assert.ok(walmart);
  assert.equal(walmart.iwishbagWrong, true);
  assert.equal(walmart.liveUrl, IWISHBAG_WALMART_IL_URL);
  assert.match(walmart.iwishbagEn, /Apr 29/);

  const ebay = rows.find((r) => r.id === 'ebay-lane');
  assert.ok(ebay);
  assert.equal(ebay.iwishbagWrong, true);
  assert.equal(ebay.liveUrl, IWISHBAG_EBAY_IL_URL);
  assert.match(ebay.iwishbagEn, /Apr 29/);

  const last = rows.find((r) => r.id === 'last-updated');
  assert.ok(last);
  assert.equal(last.iwishbagWrong, true);
  assert.match(last.iwishbagEn, /2026-04-29/);
  assert.match(last.iwishbagEn, /2026-09-15 16:35/);
});

test('AliExpress+Walmart+eBay self-contradiction foil is presentation-only: #18–#41 math + prior foils intact', () => {
  assert.equal(IL_VAT_RATE, 0.18);
  assert.equal(BOI_CUSTOMS_FX_UPLIFT, 0.005);
  assert.equal(USD_TO_ILS_RATE, 3.6);
  assert.equal(DUTY_FREE_THRESHOLD_USD, 75);
  assert.equal(DUTY_WAIVER_CEILING_USD, 500);
  assert.equal(SKILLS_IL_CUSTOMS, 'v1.4.0');
  assert.equal(SKILLS_IL_SHEKEL, 'v2.2.0');
  assert.equal(SKILLS_IL_STAMP_DATE, 'Sep 23');

  assert.match(ITA_SHAAR_OLAMI_CALC_URL, /shaarolami-query\.customs\.mof\.gov\.il/);
  assert.equal(israelVat18Not17FoilEn(), 'Israel VAT is 18% not 17%.');
  assert.equal(IWISHBAG_BODY_STILL_WRONG_VERIFIED, 'Sep 7 night');
  assert.equal(DUTYDECODER_STALE_17_VERIFIED, 'Sep 15');
  assert.equal(GATEWAYLINES_STALE_17_VERIFIED, 'Sep 22');
  assert.equal(GATEWAYLINES_VAT_LABEL_QUOTE, 'מע״מ(17%)');
  assert.equal(VAT_TRUTH_LAST_CHECKED, '2026-09-22 18:45');
  assert.equal(TAX_AUTHORITY_VAT_RATE_PCT, 18);
  assert.equal(IWISHBAG_FLIPKART_ETSY_SELF_CONTRADICTION_VERIFIED, '2026-09-15 14:15');
  assert.equal(IWISHBAG_ALIEXPRESS_WALMART_EBAY_SELF_CONTRADICTION_VERIFIED, '2026-09-15 16:35');
  assert.equal(IWISHBAG_PAGE_LAST_UPDATED, '2026-04-29');

  const mid = estimateLandedCost({ price: 200, currency: 'USD', freeShipping: true });
  assert.ok(mid);
  assert.ok(Math.abs(mid.vatIls - IL_VAT_RATE * 200 * USD_TO_ILS_RATE) < 1e-9);
});


test('ptur threshold-churn honesty strip: official $75 + $75↔$130 flip-flops + last-checked', () => {
  assert.equal(PTUR_OFFICIAL_USD, 75);
  assert.equal(PTUR_OFFICIAL_USD, DUTY_FREE_THRESHOLD_USD);
  assert.equal(PTUR_CHURN_130_USD, 130);
  assert.equal(PTUR_THRESHOLD_CHURN_LAST_CHECKED, '2026-09-21 16:30');
  assert.match(SKILLS_IL_CUSTOMS_CALC_URL, /agentskills\.co\.il/);
  assert.match(SKILLS_IL_CUSTOMS_CALC_URL, /israeli-customs-duty-calculator/);
  assert.match(OPENACCOUNTANTS_IL_CUSTOMS_URL, /openaccountants\.com\/skills\/il-customs-duty/);
  assert.match(GOV_IL_PERSONAL_IMPORT_CALC_URL, /gov\.il/);
  assert.match(GOV_IL_PERSONAL_IMPORT_CALC_URL, /customs-tax-calculation-import-by-israelis/);

  const cite = pturOfficial75CiteEn();
  assert.match(cite, /Official personal-import ptur/);
  assert.match(cite, /\$75/);
  assert.match(cite, /goods value alone/i);

  const stamp = pturThresholdChurnLastCheckedStampEn();
  assert.match(stamp, /Last checked/);
  assert.match(stamp, /2026-09-21 16:30/);

  const headline = pturThresholdChurnHeadlineEn();
  assert.match(headline, /threshold churn/i);
  assert.match(headline, /\$75/);
  assert.match(headline, /\$130/);
  assert.match(headline, /Skills IL/);
  assert.match(headline, /OpenAccountants/);
  assert.match(headline, /2026-09-21 16:30/);

  const intro = pturThresholdChurnIntroHe();
  assert.match(intro, /\$75/);
  assert.match(intro, /\$130/);
  assert.match(intro, /Skills IL/);
  assert.match(intro, /OpenAccountants/);
  assert.match(intro, /2026-09-21 16:30/);

  const rows = pturThresholdChurnRows();
  assert.ok(rows.length >= 6);

  const official = rows.find((r) => r.id === 'official-ptur');
  assert.ok(official);
  assert.match(official.detailEn, /\$75/);
  assert.notEqual(official.churnCallout, true);

  const skills = rows.find((r) => r.id === 'skills-il-churn');
  assert.ok(skills);
  assert.equal(skills.churnCallout, true);
  assert.equal(skills.liveUrl, SKILLS_IL_CUSTOMS_CALC_URL);
  assert.match(skills.detailEn, /\$130/);
  assert.match(skills.detailEn, /1 Jun 2026/i);

  const oa = rows.find((r) => r.id === 'openaccountants-churn');
  assert.ok(oa);
  assert.equal(oa.churnCallout, true);
  assert.equal(oa.liveUrl, OPENACCOUNTANTS_IL_CUSTOMS_URL);
  assert.match(oa.detailEn, /\$150/);
  assert.match(oa.detailEn, /24 Feb 2026/);

  const secondary = rows.find((r) => r.id === 'body-still-17-secondary');
  assert.ok(secondary);
  assert.match(secondary.detailEn, /secondary/i);
  assert.match(secondary.detailEn, /17% body still wrong/);
  assert.match(secondary.detailEn, /#41/);
  assert.match(secondary.detailEn, /#42/);
  assert.notEqual(secondary.churnCallout, true);

  const last = rows.find((r) => r.id === 'last-checked');
  assert.ok(last);
  assert.equal(last.churnCallout, true);
  assert.equal(last.detailEn, PTUR_THRESHOLD_CHURN_LAST_CHECKED);
  assert.equal(last.liveUrl, GOV_IL_PERSONAL_IMPORT_CALC_URL);
});

test('ptur threshold-churn foil is presentation-only: #18–#42 math + prior foils intact', () => {
  assert.equal(IL_VAT_RATE, 0.18);
  assert.equal(BOI_CUSTOMS_FX_UPLIFT, 0.005);
  assert.equal(USD_TO_ILS_RATE, 3.6);
  assert.equal(DUTY_FREE_THRESHOLD_USD, 75);
  assert.equal(DUTY_WAIVER_CEILING_USD, 500);
  assert.equal(PTUR_OFFICIAL_USD, 75);
  assert.equal(SKILLS_IL_CUSTOMS, 'v1.4.0');
  assert.equal(SKILLS_IL_SHEKEL, 'v2.2.0');
  assert.equal(SKILLS_IL_STAMP_DATE, 'Sep 23');

  assert.match(ITA_SHAAR_OLAMI_CALC_URL, /shaarolami-query\.customs\.mof\.gov\.il/);
  assert.equal(israelVat18Not17FoilEn(), 'Israel VAT is 18% not 17%.');
  assert.equal(IWISHBAG_BODY_STILL_WRONG_VERIFIED, 'Sep 7 night');
  assert.equal(DUTYDECODER_STALE_17_VERIFIED, 'Sep 15');
  assert.equal(GATEWAYLINES_STALE_17_VERIFIED, 'Sep 22');
  assert.equal(GATEWAYLINES_VAT_LABEL_QUOTE, 'מע״מ(17%)');
  assert.equal(VAT_TRUTH_LAST_CHECKED, '2026-09-22 18:45');
  assert.equal(TAX_AUTHORITY_VAT_RATE_PCT, 18);
  assert.equal(IWISHBAG_FLIPKART_ETSY_SELF_CONTRADICTION_VERIFIED, '2026-09-15 14:15');
  assert.equal(IWISHBAG_ALIEXPRESS_WALMART_EBAY_SELF_CONTRADICTION_VERIFIED, '2026-09-15 16:35');
  assert.equal(IWISHBAG_PAGE_LAST_UPDATED, '2026-04-29');
  assert.equal(PTUR_THRESHOLD_CHURN_LAST_CHECKED, '2026-09-21 16:30');
  assert.equal(PTUR_CHURN_130_USD, 130);

  const mid = estimateLandedCost({ price: 200, currency: 'USD', freeShipping: true });
  assert.ok(mid);
  assert.ok(Math.abs(mid.vatIls - IL_VAT_RATE * 200 * USD_TO_ILS_RATE) < 1e-9);
});

test('iWishBag Target→IL self-contradiction strip: body 17% vs own table 18%', () => {
  assert.equal(IWISHBAG_PAGE_LAST_UPDATED, '2026-04-29');
  assert.equal(IWISHBAG_TARGET_SELF_CONTRADICTION_VERIFIED, '2026-09-21 18:45');
  assert.equal(IWISHBAG_TARGET_IL_URL, 'https://www.iwishbag.com/how-to-buy-from/target/israel');
  assert.match(IWISHBAG_BODY_17_VAT_QUOTE, /17% VAT/);
  assert.match(IWISHBAG_OWN_TABLE_18_VAT_QUOTE, /Standard VAT\/GST 18%/);

  const headline = iwishbagTargetSelfContradictionHeadlineEn();
  assert.match(headline, /Target→IL/i);
  assert.match(headline, /self-contradiction/i);
  assert.match(headline, /17% VAT/);
  assert.match(headline, /Standard VAT\/GST 18%/);
  assert.match(headline, /2026-04-29/);
  assert.match(headline, /2026-09-21 18:45/);

  const intro = iwishbagTargetSelfContradictionIntroHe();
  assert.match(intro, /Target→IL/);
  assert.match(intro, /17% VAT/);
  assert.match(intro, /18%/);
  assert.match(intro, /2026-04-29/);
  assert.match(intro, /2026-09-21 18:45/);
  assert.match(intro, /BoI\+0\.5%/);

  const rows = iwishbagTargetSelfContradictionRows();
  assert.ok(rows.length >= 5);

  const body = rows.find((r) => r.id === 'body-vat');
  assert.ok(body);
  assert.equal(body.iwishbagWrong, true);
  assert.match(body.iwishbagEn, /17% VAT/);
  assert.match(body.shopliEn, /18%/);

  const table = rows.find((r) => r.id === 'own-table-vat');
  assert.ok(table);
  assert.match(table.iwishbagEn, /Standard VAT\/GST 18%/);
  assert.notEqual(table.iwishbagWrong, true);

  const self = rows.find((r) => r.id === 'self-contradiction');
  assert.ok(self);
  assert.equal(self.iwishbagWrong, true);
  assert.match(self.iwishbagEn, /Body 17% vs own table 18%/);

  const target = rows.find((r) => r.id === 'target-lane');
  assert.ok(target);
  assert.equal(target.iwishbagWrong, true);
  assert.equal(target.liveUrl, IWISHBAG_TARGET_IL_URL);
  assert.match(target.iwishbagEn, /Apr 29/);

  const last = rows.find((r) => r.id === 'last-updated');
  assert.ok(last);
  assert.equal(last.iwishbagWrong, true);
  assert.match(last.iwishbagEn, /2026-04-29/);
  assert.match(last.iwishbagEn, /2026-09-21 18:45/);
});

test('Target→IL self-contradiction foil is presentation-only: #18–#43 math + prior foils intact', () => {
  assert.equal(IL_VAT_RATE, 0.18);
  assert.equal(BOI_CUSTOMS_FX_UPLIFT, 0.005);
  assert.equal(USD_TO_ILS_RATE, 3.6);
  assert.equal(DUTY_FREE_THRESHOLD_USD, 75);
  assert.equal(DUTY_WAIVER_CEILING_USD, 500);
  assert.equal(PTUR_OFFICIAL_USD, 75);
  assert.equal(SKILLS_IL_CUSTOMS, 'v1.4.0');
  assert.equal(SKILLS_IL_SHEKEL, 'v2.2.0');
  assert.equal(SKILLS_IL_STAMP_DATE, 'Sep 23');

  assert.match(ITA_SHAAR_OLAMI_CALC_URL, /shaarolami-query\.customs\.mof\.gov\.il/);
  assert.equal(israelVat18Not17FoilEn(), 'Israel VAT is 18% not 17%.');
  assert.equal(IWISHBAG_BODY_STILL_WRONG_VERIFIED, 'Sep 7 night');
  assert.equal(DUTYDECODER_STALE_17_VERIFIED, 'Sep 15');
  assert.equal(GATEWAYLINES_STALE_17_VERIFIED, 'Sep 22');
  assert.equal(GATEWAYLINES_VAT_LABEL_QUOTE, 'מע״מ(17%)');
  assert.equal(VAT_TRUTH_LAST_CHECKED, '2026-09-22 18:45');
  assert.equal(TAX_AUTHORITY_VAT_RATE_PCT, 18);
  assert.equal(IWISHBAG_FLIPKART_ETSY_SELF_CONTRADICTION_VERIFIED, '2026-09-15 14:15');
  assert.equal(IWISHBAG_ALIEXPRESS_WALMART_EBAY_SELF_CONTRADICTION_VERIFIED, '2026-09-15 16:35');
  assert.equal(IWISHBAG_TARGET_SELF_CONTRADICTION_VERIFIED, '2026-09-21 18:45');
  assert.equal(IWISHBAG_PAGE_LAST_UPDATED, '2026-04-29');
  assert.equal(PTUR_THRESHOLD_CHURN_LAST_CHECKED, '2026-09-21 16:30');
  assert.equal(PTUR_CHURN_130_USD, 130);

  const mid = estimateLandedCost({ price: 200, currency: 'USD', freeShipping: true });
  assert.ok(mid);
  assert.ok(Math.abs(mid.vatIls - IL_VAT_RATE * 200 * USD_TO_ILS_RATE) < 1e-9);
});

test('RateShips side-by-side foil: whole-page VAT 17% as of Sep 22', () => {
  assert.equal(RATESHIPS_IL_URL, 'https://rateships.com/en/customs/israel');
  assert.equal(RATESHIPS_STALE_17_VERIFIED, 'Sep 22');
  assert.match(RATESHIPS_FAQ_VAT_17_QUOTE, /VAT\/tax rate on imports to Israel is 17%/);

  const headline = rateShipsStale17HeadlineEn();
  assert.match(headline, /RateShips still wrong/i);
  assert.match(headline, /"VAT 17%"/);
  assert.match(headline, /reality 18%/);
  assert.match(headline, /Sep 22/);
  assert.match(headline, /rateships\.com\/en\/customs\/israel/);
  assert.match(headline, /Quick Facts/);
  assert.match(headline, /FAQ/);
  assert.match(headline, /estimate table/);
  assert.doesNotMatch(headline, /מע״ם 17%/);

  const intro = rateShipsSideBySideIntroHe();
  assert.match(intro, /RateShips/);
  assert.match(intro, /"VAT 17%"/);
  assert.match(intro, /18%/);
  assert.match(intro, /Sep 22/);
  assert.match(intro, /BoI\+0\.5%/);
  assert.doesNotMatch(intro, /מע״ם 17%/);

  const rows = rateShipsSideBySideRows();
  assert.ok(rows.length >= 5);

  const title = rows.find((r) => r.id === 'title-quick-facts');
  assert.ok(title);
  assert.equal(title.rateshipsWrong, true);
  assert.match(title.shopliEn, /18%/);
  assert.match(title.rateshipsEn, /17%/);
  assert.match(title.rateshipsEn, /Quick Facts/);

  const faq = rows.find((r) => r.id === 'faq-vat');
  assert.ok(faq);
  assert.equal(faq.rateshipsWrong, true);
  assert.match(faq.shopliEn, /18%/);
  assert.match(faq.rateshipsEn, /17%/);
  assert.match(faq.rateshipsEn, /VAT\/tax rate on imports to Israel is 17%/);

  const estimate = rows.find((r) => r.id === 'estimate-table');
  assert.ok(estimate);
  assert.equal(estimate.rateshipsWrong, true);
  assert.match(estimate.rateshipsEn, /17% math/);
  assert.match(estimate.rateshipsEn, /\$100/);

  const reality = rows.find((r) => r.id === 'reality');
  assert.ok(reality);
  assert.match(reality.shopliEn, /18%/);
  assert.match(reality.rateshipsEn, /18%/);
  assert.notEqual(reality.rateshipsWrong, true);

  const paste = rows.find((r) => r.id === 'paste-url');
  assert.ok(paste);
  assert.match(paste.shopliEn, /\/landed/);

  const verified = rows.find((r) => r.id === 'last-verified');
  assert.ok(verified);
  assert.equal(verified.rateshipsWrong, true);
  assert.match(verified.rateshipsEn, /Sep 22/);
  assert.match(verified.rateshipsEn, /17%/);
  assert.match(verified.shopliEn, /Sep 23/);
});

test('RateShips foil is presentation-only: estimator math unchanged (18%) + prior foils intact', () => {
  assert.equal(IL_VAT_RATE, 0.18);
  assert.equal(BOI_CUSTOMS_FX_UPLIFT, 0.005);
  assert.equal(USD_TO_ILS_RATE, 3.6);
  assert.equal(DUTY_FREE_THRESHOLD_USD, 75);
  assert.equal(DUTY_WAIVER_CEILING_USD, 500);
  assert.equal(PTUR_OFFICIAL_USD, 75);
  assert.equal(SKILLS_IL_CUSTOMS, 'v1.4.0');
  assert.equal(SKILLS_IL_SHEKEL, 'v2.2.0');
  assert.equal(SKILLS_IL_STAMP_DATE, 'Sep 23');

  assert.match(ITA_SHAAR_OLAMI_CALC_URL, /shaarolami-query\.customs\.mof\.gov\.il/);
  assert.equal(israelVat18Not17FoilEn(), 'Israel VAT is 18% not 17%.');
  assert.equal(IWISHBAG_BODY_STILL_WRONG_VERIFIED, 'Sep 7 night');
  assert.equal(DUTYDECODER_STALE_17_VERIFIED, 'Sep 15');
  assert.equal(GATEWAYLINES_STALE_17_VERIFIED, 'Sep 22');
  assert.equal(GATEWAYLINES_VAT_LABEL_QUOTE, 'מע״מ(17%)');
  assert.equal(VAT_TRUTH_LAST_CHECKED, '2026-09-22 18:45');
  assert.equal(TAX_AUTHORITY_VAT_RATE_PCT, 18);
  assert.equal(IWISHBAG_FLIPKART_ETSY_SELF_CONTRADICTION_VERIFIED, '2026-09-15 14:15');
  assert.equal(IWISHBAG_ALIEXPRESS_WALMART_EBAY_SELF_CONTRADICTION_VERIFIED, '2026-09-15 16:35');
  assert.equal(IWISHBAG_TARGET_SELF_CONTRADICTION_VERIFIED, '2026-09-21 18:45');
  assert.equal(IWISHBAG_PAGE_LAST_UPDATED, '2026-04-29');
  assert.equal(PTUR_THRESHOLD_CHURN_LAST_CHECKED, '2026-09-21 16:30');
  assert.equal(PTUR_CHURN_130_USD, 130);
  assert.equal(RATESHIPS_STALE_17_VERIFIED, 'Sep 22');
  assert.equal(RATESHIPS_IL_URL, 'https://rateships.com/en/customs/israel');

  // Distinct from DutyDecoder #38 and Target #44
  assert.notEqual(RATESHIPS_IL_URL, DUTYDECODER_IL_URL);
  assert.notEqual(RATESHIPS_IL_URL, IWISHBAG_TARGET_IL_URL);

  const mid = estimateLandedCost({ price: 200, currency: 'USD', freeShipping: true });
  assert.ok(mid);
  assert.ok(Math.abs(mid.vatIls - IL_VAT_RATE * 200 * USD_TO_ILS_RATE) < 1e-9);
});

test('iWishBag Amazon US→IL self-contradiction strip: body 17% vs own table 18%', () => {
  assert.equal(IWISHBAG_PAGE_LAST_UPDATED, '2026-04-29');
  assert.equal(IWISHBAG_AMAZONUS_SELF_CONTRADICTION_VERIFIED, '2026-09-23 08:15');
  assert.equal(IWISHBAG_AMAZON_IL_URL, 'https://www.iwishbag.com/how-to-buy-from/amazon-us/israel');
  assert.match(IWISHBAG_BODY_17_VAT_QUOTE, /17% VAT/);
  assert.match(IWISHBAG_OWN_TABLE_18_VAT_QUOTE, /Standard VAT\/GST 18%/);

  const headline = iwishbagAmazonUsSelfContradictionHeadlineEn();
  assert.match(headline, /Amazon US→IL/i);
  assert.match(headline, /self-contradiction/i);
  assert.match(headline, /17% VAT/);
  assert.match(headline, /Standard VAT\/GST 18%/);
  assert.match(headline, /2026-04-29/);
  assert.match(headline, /2026-09-23 08:15/);

  const intro = iwishbagAmazonUsSelfContradictionIntroHe();
  assert.match(intro, /Amazon US→IL/);
  assert.match(intro, /17% VAT/);
  assert.match(intro, /18%/);
  assert.match(intro, /2026-04-29/);
  assert.match(intro, /2026-09-23 08:15/);
  assert.match(intro, /BoI\+0\.5%/);

  const rows = iwishbagAmazonUsSelfContradictionRows();
  assert.ok(rows.length >= 5);

  const body = rows.find((r) => r.id === 'body-vat');
  assert.ok(body);
  assert.equal(body.iwishbagWrong, true);
  assert.match(body.iwishbagEn, /17% VAT/);
  assert.match(body.shopliEn, /18%/);

  const table = rows.find((r) => r.id === 'own-table-vat');
  assert.ok(table);
  assert.match(table.iwishbagEn, /Standard VAT\/GST 18%/);
  assert.notEqual(table.iwishbagWrong, true);

  const self = rows.find((r) => r.id === 'self-contradiction');
  assert.ok(self);
  assert.equal(self.iwishbagWrong, true);
  assert.match(self.iwishbagEn, /Body 17% vs own table 18%/);

  const amazonus = rows.find((r) => r.id === 'amazonus-lane');
  assert.ok(amazonus);
  assert.equal(amazonus.iwishbagWrong, true);
  assert.equal(amazonus.liveUrl, IWISHBAG_AMAZON_IL_URL);
  assert.match(amazonus.iwishbagEn, /Apr 29/);

  const last = rows.find((r) => r.id === 'last-updated');
  assert.ok(last);
  assert.equal(last.iwishbagWrong, true);
  assert.match(last.iwishbagEn, /2026-04-29/);
  assert.match(last.iwishbagEn, /2026-09-23 08:15/);
});

test('Amazon US→IL self-contradiction foil is presentation-only: #18–#48 math + prior foils intact', () => {
  assert.equal(IL_VAT_RATE, 0.18);
  assert.equal(BOI_CUSTOMS_FX_UPLIFT, 0.005);
  assert.equal(USD_TO_ILS_RATE, 3.6);
  assert.equal(DUTY_FREE_THRESHOLD_USD, 75);
  assert.equal(DUTY_WAIVER_CEILING_USD, 500);
  assert.equal(PTUR_OFFICIAL_USD, 75);
  assert.equal(SKILLS_IL_CUSTOMS, 'v1.4.0');
  assert.equal(SKILLS_IL_SHEKEL, 'v2.2.0');
  assert.equal(SKILLS_IL_STAMP_DATE, 'Sep 23');

  assert.match(ITA_SHAAR_OLAMI_CALC_URL, /shaarolami-query\.customs\.mof\.gov\.il/);
  assert.equal(israelVat18Not17FoilEn(), 'Israel VAT is 18% not 17%.');
  assert.equal(IWISHBAG_BODY_STILL_WRONG_VERIFIED, 'Sep 7 night');
  assert.equal(DUTYDECODER_STALE_17_VERIFIED, 'Sep 15');
  assert.equal(GATEWAYLINES_STALE_17_VERIFIED, 'Sep 22');
  assert.equal(GATEWAYLINES_VAT_LABEL_QUOTE, 'מע״מ(17%)');
  assert.equal(VAT_TRUTH_LAST_CHECKED, '2026-09-22 18:45');
  assert.equal(TAX_AUTHORITY_VAT_RATE_PCT, 18);
  assert.equal(IWISHBAG_FLIPKART_ETSY_SELF_CONTRADICTION_VERIFIED, '2026-09-15 14:15');
  assert.equal(IWISHBAG_ALIEXPRESS_WALMART_EBAY_SELF_CONTRADICTION_VERIFIED, '2026-09-15 16:35');
  assert.equal(IWISHBAG_TARGET_SELF_CONTRADICTION_VERIFIED, '2026-09-21 18:45');
  assert.equal(IWISHBAG_AMAZONUS_SELF_CONTRADICTION_VERIFIED, '2026-09-23 08:15');
  assert.equal(IWISHBAG_AMAZONINDIA_SELF_CONTRADICTION_VERIFIED, '2026-09-23 10:40');
  assert.equal(IWISHBAG_PAGE_LAST_UPDATED, '2026-04-29');
  assert.equal(PTUR_THRESHOLD_CHURN_LAST_CHECKED, '2026-09-21 16:30');
  assert.equal(PTUR_CHURN_130_USD, 130);
  assert.equal(RATESHIPS_STALE_17_VERIFIED, 'Sep 22');
  assert.equal(RATESHIPS_IL_URL, 'https://rateships.com/en/customs/israel');

  // Distinct from Target #44 / RateShips #46 / Amazon US URL is the known foil lane
  assert.notEqual(IWISHBAG_AMAZON_IL_URL, IWISHBAG_TARGET_IL_URL);
  assert.notEqual(IWISHBAG_AMAZON_IL_URL, RATESHIPS_IL_URL);
  assert.notEqual(IWISHBAG_AMAZONUS_SELF_CONTRADICTION_VERIFIED, IWISHBAG_TARGET_SELF_CONTRADICTION_VERIFIED);

  const mid = estimateLandedCost({ price: 200, currency: 'USD', freeShipping: true });
  assert.ok(mid);
  assert.ok(Math.abs(mid.vatIls - IL_VAT_RATE * 200 * USD_TO_ILS_RATE) < 1e-9);
});


test('iWishBag Amazon India→IL self-contradiction strip: body 17% vs own table 18%', () => {
  assert.equal(IWISHBAG_PAGE_LAST_UPDATED, '2026-04-29');
  assert.equal(IWISHBAG_AMAZONINDIA_SELF_CONTRADICTION_VERIFIED, '2026-09-23 10:40');
  assert.equal(IWISHBAG_AMAZONINDIA_IL_URL, 'https://www.iwishbag.com/how-to-buy-from/amazon-india/israel');
  assert.match(IWISHBAG_BODY_17_VAT_QUOTE, /17% VAT/);
  assert.match(IWISHBAG_OWN_TABLE_18_VAT_QUOTE, /Standard VAT\/GST 18%/);
  assert.equal(SKILLS_IL_CUSTOMS, 'v1.4.0');
  assert.equal(SKILLS_IL_STAMP_DATE, 'Sep 23');

  const headline = iwishbagAmazonIndiaSelfContradictionHeadlineEn();
  assert.match(headline, /Amazon India→IL/i);
  assert.match(headline, /self-contradiction/i);
  assert.match(headline, /17% VAT/);
  assert.match(headline, /Standard VAT\/GST 18%/);
  assert.match(headline, /2026-04-29/);
  assert.match(headline, /2026-09-23 10:40/);

  const intro = iwishbagAmazonIndiaSelfContradictionIntroHe();
  assert.match(intro, /Amazon India→IL/);
  assert.match(intro, /17% VAT/);
  assert.match(intro, /18%/);
  assert.match(intro, /2026-04-29/);
  assert.match(intro, /2026-09-23 10:40/);
  assert.match(intro, /BoI\+0\.5%/);

  const rows = iwishbagAmazonIndiaSelfContradictionRows();
  assert.ok(rows.length >= 5);

  const body = rows.find((r) => r.id === 'body-vat');
  assert.ok(body);
  assert.equal(body.iwishbagWrong, true);
  assert.match(body.iwishbagEn, /17% VAT/);
  assert.match(body.shopliEn, /18%/);

  const table = rows.find((r) => r.id === 'own-table-vat');
  assert.ok(table);
  assert.match(table.iwishbagEn, /Standard VAT\/GST 18%/);
  assert.notEqual(table.iwishbagWrong, true);

  const self = rows.find((r) => r.id === 'self-contradiction');
  assert.ok(self);
  assert.equal(self.iwishbagWrong, true);
  assert.match(self.iwishbagEn, /Body 17% vs own table 18%/);

  const amazonindia = rows.find((r) => r.id === 'amazonindia-lane');
  assert.ok(amazonindia);
  assert.equal(amazonindia.iwishbagWrong, true);
  assert.equal(amazonindia.liveUrl, IWISHBAG_AMAZONINDIA_IL_URL);
  assert.match(amazonindia.iwishbagEn, /Apr 29/);

  const last = rows.find((r) => r.id === 'last-updated');
  assert.ok(last);
  assert.equal(last.iwishbagWrong, true);
  assert.match(last.iwishbagEn, /2026-04-29/);
  assert.match(last.iwishbagEn, /2026-09-23 10:40/);
  assert.match(last.shopliEn, /Sep 23/);
});

test('Amazon India→IL self-contradiction foil is presentation-only: distinct from #48/#36 + math intact', () => {
  assert.equal(IL_VAT_RATE, 0.18);
  assert.equal(BOI_CUSTOMS_FX_UPLIFT, 0.005);
  assert.equal(SKILLS_IL_CUSTOMS, 'v1.4.0');
  assert.equal(SKILLS_IL_STAMP_DATE, 'Sep 23');
  assert.equal(IWISHBAG_AMAZONINDIA_SELF_CONTRADICTION_VERIFIED, '2026-09-23 10:40');
  assert.equal(IWISHBAG_AMAZONUS_SELF_CONTRADICTION_VERIFIED, '2026-09-23 08:15');
  assert.notEqual(IWISHBAG_AMAZONINDIA_IL_URL, IWISHBAG_AMAZON_IL_URL);
  assert.notEqual(
    IWISHBAG_AMAZONINDIA_SELF_CONTRADICTION_VERIFIED,
    IWISHBAG_AMAZONUS_SELF_CONTRADICTION_VERIFIED,
  );
  assert.equal(IWISHBAG_PAGE_LAST_UPDATED, '2026-04-29');

  const mid = estimateLandedCost({ price: 200, currency: 'USD', freeShipping: true });
  assert.ok(mid);
  assert.ok(Math.abs(mid.vatIls - IL_VAT_RATE * 200 * USD_TO_ILS_RATE) < 1e-9);
});


test('iWishBag Amazon Japan→IL self-contradiction strip: body 17% vs own table 18%', () => {
  assert.equal(IWISHBAG_PAGE_LAST_UPDATED, '2026-04-29');
  assert.equal(IWISHBAG_AMAZONJP_SELF_CONTRADICTION_VERIFIED, '2026-09-23 12:40');
  assert.equal(IWISHBAG_AMAZONJP_IL_URL, 'https://www.iwishbag.com/how-to-buy-from/amazon-japan/israel');
  assert.equal(
    IWISHBAG_YAHOO_SHOPPING_JP_IL_URL,
    'https://www.iwishbag.com/how-to-buy-from/yahoo-shopping-jp/israel',
  );
  assert.match(IWISHBAG_BODY_17_VAT_QUOTE, /17% VAT/);
  assert.match(IWISHBAG_OWN_TABLE_18_VAT_QUOTE, /Standard VAT\/GST 18%/);
  assert.equal(SKILLS_IL_CUSTOMS, 'v1.4.0');
  assert.equal(SKILLS_IL_STAMP_DATE, 'Sep 23');
  assert.equal(IWISHBAG_SHEIN_TEMU_404_VERIFIED, '2026-09-23 12:40');
  assert.equal(IWISHBAG_SHEIN_IL_URL_LIVE, false);
  assert.equal(IWISHBAG_TEMU_IL_URL_LIVE, false);

  const headline = iwishbagAmazonJpSelfContradictionHeadlineEn();
  assert.match(headline, /Amazon Japan→IL/i);
  assert.match(headline, /self-contradiction/i);
  assert.match(headline, /17% VAT/);
  assert.match(headline, /Standard VAT\/GST 18%/);
  assert.match(headline, /2026-04-29/);
  assert.match(headline, /2026-09-23 12:40/);

  const intro = iwishbagAmazonJpSelfContradictionIntroHe();
  assert.match(intro, /Amazon Japan→IL/);
  assert.match(intro, /17% VAT/);
  assert.match(intro, /18%/);
  assert.match(intro, /2026-04-29/);
  assert.match(intro, /2026-09-23 12:40/);
  assert.match(intro, /BoI\+0\.5%/);
  assert.match(intro, /Yahoo|Shein|Temu|404/);

  const rows = iwishbagAmazonJpSelfContradictionRows();
  assert.ok(rows.length >= 6);

  const body = rows.find((r) => r.id === 'body-vat');
  assert.ok(body);
  assert.equal(body.iwishbagWrong, true);
  assert.match(body.iwishbagEn, /17% VAT/);
  assert.match(body.shopliEn, /18%/);

  const table = rows.find((r) => r.id === 'own-table-vat');
  assert.ok(table);
  assert.match(table.iwishbagEn, /Standard VAT\/GST 18%/);
  assert.notEqual(table.iwishbagWrong, true);

  const self = rows.find((r) => r.id === 'self-contradiction');
  assert.ok(self);
  assert.equal(self.iwishbagWrong, true);
  assert.match(self.iwishbagEn, /Body 17% vs own table 18%/);

  const amazonjp = rows.find((r) => r.id === 'amazonjp-lane');
  assert.ok(amazonjp);
  assert.equal(amazonjp.iwishbagWrong, true);
  assert.equal(amazonjp.liveUrl, IWISHBAG_AMAZONJP_IL_URL);
  assert.match(amazonjp.iwishbagEn, /Apr 29/);

  const yahoo = rows.find((r) => r.id === 'yahoo-jp-note');
  assert.ok(yahoo);
  assert.equal(yahoo.liveUrl, IWISHBAG_YAHOO_SHOPPING_JP_IL_URL);
  assert.match(yahoo.iwishbagEn, /17%|18%|Apr 29/);

  const dead = rows.find((r) => r.id === 'shein-temu-404');
  assert.ok(dead);
  assert.equal(dead.iwishbagWrong, true);
  assert.match(dead.iwishbagEn, /404/);
  assert.match(dead.iwishbagEn, /2026-09-23 12:40/);

  const last = rows.find((r) => r.id === 'last-updated');
  assert.ok(last);
  assert.equal(last.iwishbagWrong, true);
  assert.match(last.iwishbagEn, /2026-04-29/);
  assert.match(last.iwishbagEn, /2026-09-23 12:40/);
  assert.match(last.shopliEn, /Sep 23/);
});

test('Amazon Japan→IL self-contradiction foil is presentation-only: distinct from #49/#48 + math intact', () => {
  assert.equal(IL_VAT_RATE, 0.18);
  assert.equal(BOI_CUSTOMS_FX_UPLIFT, 0.005);
  assert.equal(SKILLS_IL_CUSTOMS, 'v1.4.0');
  assert.equal(SKILLS_IL_STAMP_DATE, 'Sep 23');
  assert.equal(IWISHBAG_AMAZONJP_SELF_CONTRADICTION_VERIFIED, '2026-09-23 12:40');
  assert.equal(IWISHBAG_AMAZONINDIA_SELF_CONTRADICTION_VERIFIED, '2026-09-23 10:40');
  assert.equal(IWISHBAG_AMAZONUS_SELF_CONTRADICTION_VERIFIED, '2026-09-23 08:15');
  assert.notEqual(IWISHBAG_AMAZONJP_IL_URL, IWISHBAG_AMAZON_IL_URL);
  assert.notEqual(IWISHBAG_AMAZONJP_IL_URL, IWISHBAG_AMAZONINDIA_IL_URL);
  assert.notEqual(
    IWISHBAG_AMAZONJP_SELF_CONTRADICTION_VERIFIED,
    IWISHBAG_AMAZONINDIA_SELF_CONTRADICTION_VERIFIED,
  );
  assert.equal(IWISHBAG_PAGE_LAST_UPDATED, '2026-04-29');
  assert.equal(IWISHBAG_SHEIN_IL_URL_LIVE, false);
  assert.equal(IWISHBAG_TEMU_IL_URL_LIVE, false);

  const mid = estimateLandedCost({ price: 200, currency: 'USD', freeShipping: true });
  assert.ok(mid);
  assert.ok(Math.abs(mid.vatIls - IL_VAT_RATE * 200 * USD_TO_ILS_RATE) < 1e-9);
});



test('iWishBag Myntra→IL self-contradiction strip: body 17% vs own table 18%', () => {
  assert.equal(IWISHBAG_PAGE_LAST_UPDATED, '2026-04-29');
  assert.equal(IWISHBAG_MYNTRA_SELF_CONTRADICTION_VERIFIED, '2026-09-23 14:35');
  assert.equal(IWISHBAG_MYNTRA_IL_URL, 'https://www.iwishbag.com/how-to-buy-from/myntra/israel');
  assert.match(IWISHBAG_BODY_17_VAT_QUOTE, /17% VAT/);
  assert.match(IWISHBAG_OWN_TABLE_18_VAT_QUOTE, /Standard VAT\/GST 18%/);
  assert.equal(SKILLS_IL_CUSTOMS, 'v1.4.0');
  assert.equal(SKILLS_IL_STAMP_DATE, 'Sep 23');

  const headline = iwishbagMyntraSelfContradictionHeadlineEn();
  assert.match(headline, /Myntra→IL/i);
  assert.match(headline, /self-contradiction/i);
  assert.match(headline, /17% VAT/);
  assert.match(headline, /Standard VAT\/GST 18%/);
  assert.match(headline, /2026-04-29/);
  assert.match(headline, /2026-09-23 14:35/);

  const intro = iwishbagMyntraSelfContradictionIntroHe();
  assert.match(intro, /Myntra→IL/);
  assert.match(intro, /17% VAT/);
  assert.match(intro, /18%/);
  assert.match(intro, /2026-04-29/);
  assert.match(intro, /2026-09-23 14:35/);
  assert.match(intro, /BoI\+0\.5%/);

  const rows = iwishbagMyntraSelfContradictionRows();
  assert.ok(rows.length >= 5);

  const body = rows.find((r) => r.id === 'body-vat');
  assert.ok(body);
  assert.equal(body.iwishbagWrong, true);
  assert.match(body.iwishbagEn, /17% VAT/);
  assert.match(body.shopliEn, /18%/);

  const table = rows.find((r) => r.id === 'own-table-vat');
  assert.ok(table);
  assert.match(table.iwishbagEn, /Standard VAT\/GST 18%/);
  assert.notEqual(table.iwishbagWrong, true);

  const self = rows.find((r) => r.id === 'self-contradiction');
  assert.ok(self);
  assert.equal(self.iwishbagWrong, true);
  assert.match(self.iwishbagEn, /Body 17% vs own table 18%/);

  const myntra = rows.find((r) => r.id === 'myntra-lane');
  assert.ok(myntra);
  assert.equal(myntra.iwishbagWrong, true);
  assert.equal(myntra.liveUrl, IWISHBAG_MYNTRA_IL_URL);
  assert.match(myntra.iwishbagEn, /Apr 29/);

  const last = rows.find((r) => r.id === 'last-updated');
  assert.ok(last);
  assert.equal(last.iwishbagWrong, true);
  assert.match(last.iwishbagEn, /2026-04-29/);
  assert.match(last.iwishbagEn, /2026-09-23 14:35/);
  assert.match(last.shopliEn, /Sep 23/);
});

test('Myntra→IL self-contradiction foil is presentation-only: distinct from #50/#49/#48 + math intact', () => {
  assert.equal(IL_VAT_RATE, 0.18);
  assert.equal(BOI_CUSTOMS_FX_UPLIFT, 0.005);
  assert.equal(SKILLS_IL_CUSTOMS, 'v1.4.0');
  assert.equal(SKILLS_IL_STAMP_DATE, 'Sep 23');
  assert.equal(IWISHBAG_MYNTRA_SELF_CONTRADICTION_VERIFIED, '2026-09-23 14:35');
  assert.equal(IWISHBAG_AMAZONJP_SELF_CONTRADICTION_VERIFIED, '2026-09-23 12:40');
  assert.equal(IWISHBAG_AMAZONINDIA_SELF_CONTRADICTION_VERIFIED, '2026-09-23 10:40');
  assert.equal(IWISHBAG_AMAZONUS_SELF_CONTRADICTION_VERIFIED, '2026-09-23 08:15');
  assert.notEqual(IWISHBAG_MYNTRA_IL_URL, IWISHBAG_AMAZON_IL_URL);
  assert.notEqual(IWISHBAG_MYNTRA_IL_URL, IWISHBAG_AMAZONINDIA_IL_URL);
  assert.notEqual(IWISHBAG_MYNTRA_IL_URL, IWISHBAG_AMAZONJP_IL_URL);
  assert.notEqual(
    IWISHBAG_MYNTRA_SELF_CONTRADICTION_VERIFIED,
    IWISHBAG_AMAZONJP_SELF_CONTRADICTION_VERIFIED,
  );
  assert.equal(IWISHBAG_PAGE_LAST_UPDATED, '2026-04-29');

  const mid = estimateLandedCost({ price: 200, currency: 'USD', freeShipping: true });
  assert.ok(mid);
  assert.ok(Math.abs(mid.vatIls - IL_VAT_RATE * 200 * USD_TO_ILS_RATE) < 1e-9);
});
