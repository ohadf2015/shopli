import test from 'node:test';
import assert from 'node:assert/strict';
import { cdnImage, productImage } from '../lib/img';

const CDN = 'https://ae-pic-a1.aliexpress-media.com/kf/Sed09328fa3bf42ff94d3b072dc0d7ca9C.jpg';

test('cdnImage appends the CDN resize suffix for Alibaba CDN images', () => {
  assert.equal(cdnImage(CDN, 200), `${CDN}_200x200.jpg`);
  assert.equal(cdnImage('https://ae01.alicdn.com/kf/x.png', 200), 'https://ae01.alicdn.com/kf/x.png_200x200.jpg');
});

test('cdnImage never emits a width the CDN ignores', () => {
  // 160, 180, 400, 450 and 750 are silent no-ops that return the FULL-SIZE
  // original, so a request near them must round to a width that really resizes.
  for (const dead of [160, 180, 400, 450, 750]) {
    const out = cdnImage(CDN, dead);
    assert.notEqual(out, `${CDN}_${dead}x${dead}.jpg`, `${dead} is a CDN no-op and must not be emitted`);
  }
  assert.equal(cdnImage(CDN, 400), `${CDN}_480x480.jpg`);
  assert.equal(cdnImage(CDN, 160), `${CDN}_200x200.jpg`);
  assert.equal(cdnImage(CDN, 1), `${CDN}_50x50.jpg`);
  assert.equal(cdnImage(CDN, 5000), `${CDN}_960x960.jpg`);
});

test('cdnImage does not pin the codec to AVIF', () => {
  // The CDN picks AVIF vs WebP from the request Accept header. Forcing `_.avif`
  // sends AVIF even to a client that never advertised it, and ProductCard hides
  // an image that fails to decode — a blank card with no visible error.
  assert.ok(!cdnImage(CDN, 200).includes('.avif'));
  assert.ok(!(productImage(CDN, 200) as any).srcSet.includes('.avif'));
});

test('cdnImage is idempotent — never double-appends a transform', () => {
  assert.equal(cdnImage(cdnImage(CDN, 480), 480), `${CDN}_480x480.jpg`);
  assert.equal(cdnImage(cdnImage(CDN, 200), 640), `${CDN}_640x640.jpg`);
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
    assert.equal(p.width, 480, `width missing for ${url || '(empty)'}`);
    assert.equal(p.height, 480, `height missing for ${url || '(empty)'}`);
    assert.equal(p.loading, 'lazy');
  }
});

test('productImage emits a 1x/2x srcset within CDN limits', () => {
  const p = productImage(CDN, 200) as any;
  assert.equal(p.srcSet, `${CDN}_200x200.jpg 1x, ${CDN}_480x480.jpg 2x`);
  // At the CDN ceiling there is no larger variant to offer, so 2x is dropped
  // rather than pointing at the same file twice.
  assert.equal((productImage(CDN, 960) as any).srcSet, `${CDN}_960x960.jpg 1x`);
  // Non-CDN images get no srcset at all.
  assert.equal((productImage('https://example.com/a.jpg', 200) as any).srcSet, undefined);
});
