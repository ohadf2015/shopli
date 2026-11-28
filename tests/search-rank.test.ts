import test from 'node:test';
import assert from 'node:assert/strict';
import { rankByQuery } from '../lib/search-rank';

test('the product searched for outranks a best-selling accessory', () => {
  const ranked = rankByQuery(
    [
      { title: 'USB C Cable 3A Fast Charging Cord for Phone' },
      { title: 'Type C Cable for Samsung Power Bank Charger' },
      { title: 'Power Bank 20000mAh Portable Charger' },
    ],
    'power bank',
  );
  assert.equal(ranked[0].title, 'Power Bank 20000mAh Portable Charger');
  assert.equal(ranked[2].title, 'USB C Cable 3A Fast Charging Cord for Phone');
});

test('keeps sales order when titles cannot be matched (Hebrew titles, English query)', () => {
  const items = [{ title: 'מטען נייד' }, { title: 'כבל' }];
  assert.deepEqual(rankByQuery(items, 'power bank'), items);
});
