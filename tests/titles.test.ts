import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cleanTitle } from '../lib/titles';

test('known machine-translation misspellings are fixed', () => {
  assert.equal(cleanTitle('LED Dislpaly Digital Alarm Clock'), 'LED Display Digital Alarm Clock');
  assert.equal(cleanTitle('Wireles Bluetoot Earphonee'), 'Wireless Bluetooth Earphones');
});

test('drop-ship boilerplate is stripped wherever it sits', () => {
  assert.equal(
    cleanTitle('Hot Sale Silicone Face Brush Free Shipping'),
    'Silicone Face Brush'
  );
  assert.equal(
    cleanTitle('New Arrival Stainless Steel Water Bottle Dropshipping'),
    'Stainless Steel Water Bottle'
  );
});

test('keyword-soup duplication collapses to one word', () => {
  assert.equal(cleanTitle('Coffee Press Press Maker'), 'Coffee Press Maker');
  assert.equal(cleanTitle('LED LED Strip Light'), 'LED Strip Light');
});

test('a title with nothing wrong comes back unchanged', () => {
  const t = 'Stainless Steel French Press Coffee Maker 1L';
  assert.equal(cleanTitle(t), t);
});

test('cleaning is idempotent', () => {
  const t = 'Hot Sale LED Dislpaly Strip Strip Light Free Shipping';
  const once = cleanTitle(t);
  assert.equal(cleanTitle(once), once);
});

test('empty input stays empty, filler-only titles keep the original', () => {
  assert.equal(cleanTitle(''), '');
  // Stripping would leave nothing — the original is the better answer.
  assert.equal(cleanTitle('Hot Sale'), 'Hot Sale');
});

test('orphaned separators from boilerplate removal are cleaned up', () => {
  assert.equal(cleanTitle('Kitchen Knife, Hot Sale, 8 inch'), 'Kitchen Knife, 8 inch');
});
