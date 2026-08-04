import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  SIMILAR_ALGO_VERSION,
  tokenizeTitle,
  titleTokenOverlap,
  priceBandMatch,
  similarityScore,
  findSimilar,
  type SimilarCandidate,
} from '../lib/similar';

function cand(overrides: Partial<SimilarCandidate>): SimilarCandidate {
  return {
    id: '1',
    title: 'Wireless Earbuds Bluetooth',
    price: 10,
    originalPrice: null,
    discount: '',
    rating: 90,
    volume: 1000,
    category: 'Electronics',
    imageUrl: '',
    affiliateLink: 'https://example.com/aff',
    currency: 'EUR',
    ...overrides,
  };
}

const source = cand({
  id: 'src',
  title: 'Wireless Earbuds Bluetooth TWS',
  price: 10,
  rating: 88,
  discount: '20%',
  category: 'Electronics',
});

test('algorithm version is weighted-v1', () => {
  assert.equal(SIMILAR_ALGO_VERSION, 'weighted-v1');
});

test('tokenizeTitle lowercases, strips punctuation, drops stopwords and short tokens', () => {
  const tokens = tokenizeTitle('Wireless Earbuds, Bluetooth 5.3 TWS! the Pro');
  assert.ok(tokens.includes('wireless'));
  assert.ok(tokens.includes('earbuds'));
  assert.ok(tokens.includes('bluetooth'));
  assert.ok(!tokens.includes('the'), 'stopword removed');
  assert.ok(!tokens.includes('5.3'), 'version noise removed');
});

test('titleTokenOverlap is a Jaccard-style 0..1 ratio', () => {
  assert.equal(titleTokenOverlap('wireless earbuds', 'wireless earbuds'), 1);
  assert.equal(titleTokenOverlap('wireless earbuds', 'kitchen knife'), 0);
  const partial = titleTokenOverlap('wireless earbuds bluetooth', 'wireless earbuds case');
  assert.ok(partial > 0 && partial < 1);
});

test('priceBandMatch: within ±40% scores 1, decays outside', () => {
  assert.equal(priceBandMatch(10, 12), 1);
  assert.equal(priceBandMatch(10, 14), 1);
  assert.equal(priceBandMatch(10, 6), 1);
  assert.ok(priceBandMatch(10, 20) < 1, 'outside band decays');
  assert.equal(priceBandMatch(10, 0), 0);
});

test('category match is the heaviest component (40)', () => {
  const sameCat = cand({ id: 'a', title: 'Totally Different Words', price: 99, category: 'Electronics', rating: 0, discount: '' });
  const diffCat = cand({ id: 'b', title: 'Totally Different Words', price: 99, category: 'Kitchen', rating: 0, discount: '' });
  const s1 = similarityScore(source, sameCat);
  const s2 = similarityScore(source, diffCat);
  assert.ok(s1.score - s2.score >= 39, `category weight dominates (${s1.score} vs ${s2.score})`);
});

test('reason chips reflect why a product matched', () => {
  const better = cand({
    id: 'better',
    category: 'Electronics',
    price: 11,
    rating: 95,
    discount: '60%',
    title: 'Earbuds Pro Max',
  });
  const { chips } = similarityScore(source, better);
  assert.ok(chips.includes('same_category'));
  assert.ok(chips.includes('similar_price'));
  assert.ok(chips.includes('higher_rated'));
  assert.ok(chips.includes('bigger_discount'));
});

test('findSimilar excludes the source product', () => {
  const results = findSimilar(source, [source, cand({ id: 'other' })]);
  assert.ok(!results.some((r) => r.product.id === 'src'));
});

test('first 3 results are same top-level category', () => {
  const candidates = [
    cand({ id: 'x1', category: 'Kitchen', title: 'Wireless Earbuds Bluetooth TWS', price: 10, rating: 99, discount: '90%' }),
    cand({ id: 'e1', category: 'Electronics', title: 'Earbuds case', price: 11 }),
    cand({ id: 'e2', category: 'Electronics', title: 'Bluetooth speaker', price: 12 }),
    cand({ id: 'e3', category: 'Electronics', title: 'TWS earphones', price: 9 }),
  ];
  const results = findSimilar(source, candidates);
  assert.ok(results.length >= 3);
  for (const r of results.slice(0, 3)) {
    assert.equal(r.product.category, 'Electronics', `rank slot expects same category, got ${r.product.id}`);
  }
});

test('prefers price band ±40% unless fewer than limit matches', () => {
  const inBand = cand({ id: 'in', price: 12, category: 'Electronics' });
  const outBand = cand({ id: 'out', price: 50, category: 'Electronics' });
  const candidates = [inBand, outBand,
    cand({ id: 'c1', price: 8, category: 'Electronics' }),
    cand({ id: 'c2', price: 13, category: 'Electronics' }),
    cand({ id: 'c3', price: 7, category: 'Electronics' }),
    cand({ id: 'c4', price: 9, category: 'Electronics' }),
    cand({ id: 'c5', price: 10, category: 'Electronics' }),
  ];
  const results = findSimilar(source, candidates, { limit: 6 });
  assert.equal(results.length, 6);
  assert.ok(!results.some((r) => r.product.id === 'out'), 'out-of-band excluded when enough in-band matches');
  const scarce = findSimilar(source, [outBand], { limit: 6 });
  assert.equal(scarce.length, 1, 'out-of-band kept when nothing else exists');
});

test('caps at 6 results by default and sorts by score desc', () => {
  const many = Array.from({ length: 12 }, (_, i) =>
    cand({ id: `p${i}`, title: `Wireless Earbuds model ${i}`, price: 10 + i, category: 'Electronics' }));
  const results = findSimilar(source, many);
  assert.ok(results.length <= 6);
  for (let i = 1; i < results.length; i++) {
    assert.ok(results[i - 1].score >= results[i].score, 'sorted desc');
  }
});

test('empty candidate pool returns empty results', () => {
  assert.deepEqual(findSimilar(source, []), []);
});

test('results carry algorithm version', () => {
  const results = findSimilar(source, [cand({ id: 'other' })]);
  assert.equal(results[0].algorithmVersion, 'weighted-v1');
});
