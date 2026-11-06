import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aliexpressIdFromInput } from '../lib/ae-link';

test('full item URLs on any AliExpress host', () => {
  assert.equal(aliexpressIdFromInput('https://www.aliexpress.com/item/1005006678116483.html?spm=a2g0o'), '1005006678116483');
  assert.equal(aliexpressIdFromInput('https://he.aliexpress.com/item/1005006678116483.html'), '1005006678116483');
  assert.equal(aliexpressIdFromInput('aliexpress.us/item/3256809322622768.html'), '3256809322622768');
  assert.equal(aliexpressIdFromInput('https://m.aliexpress.com/item/1005006678116483.html'), '1005006678116483');
});

test('bare product id', () => {
  assert.equal(aliexpressIdFromInput(' 1005006678116483 '), '1005006678116483');
});

test('ordinary searches and other sites are left alone', () => {
  assert.equal(aliexpressIdFromInput('wireless earbuds'), null);
  assert.equal(aliexpressIdFromInput('2024'), null);
  assert.equal(aliexpressIdFromInput('https://www.temu.com/item/1005006678116483.html'), null);
  assert.equal(aliexpressIdFromInput('https://evil-aliexpress.com.example.org/item/1005006678116483.html'), null);
  assert.equal(aliexpressIdFromInput('https://a.aliexpress.com/_mKxyz'), null);
  assert.equal(aliexpressIdFromInput(''), null);
});
