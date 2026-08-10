import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildGmcFeedXml,
  collectionGoogleCategory,
  xmlEncode,
  DEFAULT_GOOGLE_CATEGORY,
  GmcFeedItem,
} from '../lib/gmc-feed';

const sample: GmcFeedItem[] = [
  {
    id: '1005001234567890',
    title: 'מנורת שולחן LED עם טעינה אלחוטית',
    description: 'מנורת שולחן LED עם טעינה אלחוטית',
    price: 42.9,
    currency: 'ILS',
    imageUrl: 'https://ae01.alicdn.com/kf/lamp.jpg',
    brand: 'Baseus',
    productType: 'עמדת עבודה ביתית',
    googleCategory: '269',
    volume: 12000,
  },
  {
    id: '1005009876543210',
    title: 'Yoga mat <extra> "thick" & comfy',
    description: 'Yoga mat <extra> "thick" & comfy',
    price: 55,
    currency: 'USD',
    imageUrl: 'https://ae01.alicdn.com/kf/mat.jpg',
    brand: '',
    productType: 'Home Gym',
    googleCategory: '',
  },
];

test('feed is RSS 2.0 with the g: namespace and one item per valid product', () => {
  const xml = buildGmcFeedXml('il', sample);
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(xml, /<rss xmlns:g="http:\/\/base\.google\.com\/ns\/1\.0" version="2\.0">/);
  assert.equal((xml.match(/<item>/g) || []).length, 2);
  assert.match(xml, /<\/rss>/);
});

test('every item carries the GMC required attributes', () => {
  const xml = buildGmcFeedXml('il', sample);
  for (const tag of ['g:id', 'g:title', 'g:description', 'g:link', 'g:image_link', 'g:price', 'g:availability', 'g:brand', 'g:condition']) {
    assert.equal((xml.match(new RegExp(`<${tag}>` , 'g')) || []).length, 2, `missing ${tag}`);
  }
});

test('identifier_exists is no — AliExpress exposes no GTIN and fake ones get disapproved', () => {
  const xml = buildGmcFeedXml('il', sample);
  assert.equal((xml.match(/<g:identifier_exists>no<\/g:identifier_exists>/g) || []).length, 2);
});

test('g:link lands on our own PDP, never the affiliate URL (GMC claimed-domain rule)', () => {
  const xml = buildGmcFeedXml('il', sample);
  assert.match(xml, /<g:link>https:\/\/www\.tryshopli\.com\/il\/product\/1005001234567890<\/g:link>/);
  assert.doesNotMatch(xml, /aliexpress\.com/);
});

test('Hebrew titles pass through UTF-8 and prices keep their currency code', () => {
  const xml = buildGmcFeedXml('il', sample);
  assert.match(xml, /<g:title>מנורת שולחן LED עם טעינה אלחוטית<\/g:title>/);
  assert.match(xml, /<g:price>42\.90 ILS<\/g:price>/);
  assert.match(xml, /<g:price>55\.00 USD<\/g:price>/);
});

test('special characters are XML-escaped and brand defaults to AliExpress', () => {
  const xml = buildGmcFeedXml('us', sample);
  assert.match(xml, /Yoga mat &lt;extra&gt; &quot;thick&quot; &amp; comfy/);
  assert.match(xml, /<g:brand>AliExpress<\/g:brand>/);
  // empty googleCategory falls back to the default
  assert.match(xml, new RegExp(`<g:google_product_category>${DEFAULT_GOOGLE_CATEGORY}</g:google_product_category>`));
});

test('items with no title, no positive price or no image are dropped (GMC would disapprove them)', () => {
  const broken: GmcFeedItem[] = [
    { ...sample[0], id: 'a', title: '' },
    { ...sample[0], id: 'b', price: 0 },
    { ...sample[0], id: 'c', imageUrl: '' },
  ];
  const xml = buildGmcFeedXml('il', broken);
  assert.equal((xml.match(/<item>/g) || []).length, 0);
});

test('titles are truncated to the 150-char GMC cap', () => {
  const long: GmcFeedItem = { ...sample[0], id: 'long', title: 'x'.repeat(200) };
  const xml = buildGmcFeedXml('il', [long]);
  const m = xml.match(/<g:title>(x+)<\/g:title>/);
  assert.ok(m);
  assert.equal(m![1].length, 150);
});

test('xmlEncode covers all five XML entities', () => {
  assert.equal(xmlEncode(`&<>"'`), '&amp;&lt;&gt;&quot;&apos;');
});

test('collectionGoogleCategory prefers explicit, then map, then default', () => {
  assert.equal(collectionGoogleCategory('halloween', '999'), '999');
  assert.equal(collectionGoogleCategory('halloween'), '209');
  assert.equal(collectionGoogleCategory('no-such-slug'), DEFAULT_GOOGLE_CATEGORY);
});
