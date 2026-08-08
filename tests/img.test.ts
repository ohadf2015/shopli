import test from 'node:test';
import assert from 'node:assert/strict';
import { cdnImage, productImage } from '../lib/img';

const CDN = 'https://ae-pic-a1.aliexpress-media.com/kf/Sed09328fa3bf42ff94d3b072dc0d7ca9C.jpg';

test('cdnImage appends an AVIF transform for Alibaba CDN images', () => {
  assert.equal(cdnImage(CDN, 400), `${CDN}_400x400.jpg_.avif`);
  assert.equal(cdnImage('https://ae01.alicdn.com/kf/x.png', 200), 'https://ae01.alicdn.com/kf/x.png_200x200.jpg_.avif');
});

test('cdnImage rounds up to a width the CDN honors', () => {
  // 320 is NOT honored by the CDN (verified: returns the full-size original),
  // so a request for 320 must round up to 400.
  assert.equal(cdnImage(CDN, 320), `${CDN}_400x400.jpg_.avif`);
  assert.equal(cdnImage(CDN, 1), `${CDN}_120x120.jpg_.avif`);
  assert.equal(cdnImage(CDN, 5000), `${CDN}_800x800.jpg_.avif`);
});

test('cdnImage is idempotent — never double-appends a transform', () => {
  assert.equal(cdnImage(cdnImage(CDN, 400), 400), `${CDN}_400x400.jpg_.avif`);
  assert.equal(cdnImage(cdnImage(CDN, 200), 640), `${CDN}_640x640.jpg_.avif`);
});

test('non-CDN and empty URLs pass through untouched', () => {
  assert.equal(cdnImage('https://example.com/a.jpg', 400), 'https://example.com/a.jpg');
  assert.equal(cdnImage('', 400), '');
  assert.equal(cdnImage('/local.png', 400), '/local.png');
  // Guard against a hostname-suffix bypass (evil-alicdn.com is not alicdn.com).
  assert.equal(cdnImage('https://evil-alicdn.com/x.jpg', 400), 'https://evil-alicdn.com/x.jpg');
});

test('productImage always sets intrinsic dimensions (CLS guard)', () => {
  for (const url of [CDN, 'https://example.com/a.jpg', '']) {
    const p = productImage(url, 400);
    assert.equal(p.width, 400, `width missing for ${url || '(empty)'}`);
    assert.equal(p.height, 400, `height missing for ${url || '(empty)'}`);
    assert.equal(p.loading, 'lazy');
  }
});

test('productImage emits a 1x/2x srcset within CDN limits', () => {
  const p = productImage(CDN, 200) as any;
  assert.equal(p.srcSet, `${CDN}_200x200.jpg_.avif 1x, ${CDN}_400x400.jpg_.avif 2x`);
  // At the CDN ceiling there is no larger variant to offer, so 2x is dropped
  // rather than pointing at the same file twice.
  assert.equal((productImage(CDN, 800) as any).srcSet, `${CDN}_800x800.jpg_.avif 1x`);
  // Non-CDN images get no srcset at all.
  assert.equal((productImage('https://example.com/a.jpg', 200) as any).srcSet, undefined);
});
