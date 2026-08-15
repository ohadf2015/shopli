import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseFeedback, reviewSummaryLine, starsToRate } from '../lib/reviews';

// A real capture of feedback.aliexpress.com/pc/searchEvaluation.do (2026-08-15),
// trimmed to 3 reviews. This is an undocumented endpoint — when AliExpress
// changes its shape, this test is what says so.
const fixture = JSON.parse(
  readFileSync(join(__dirname, '..', '..', 'tests', 'fixtures', 'aliexpress-feedback.json'), 'utf8')
);

test('parses a real response', () => {
  const r = parseFeedback('3256806852323474', fixture)!;
  assert.ok(r);
  assert.equal(r.averageStars, 4.9);
  assert.ok(r.reviews.length > 0);
  assert.ok(r.reviews.every((x) => x.text.length > 0));
  assert.ok(r.reviews.every((x) => x.stars >= 1 && x.stars <= 5));
});

test('ratings and written reviews are different populations', () => {
  const r = parseFeedback('3256806852323474', fixture)!;
  const hist = r.histogram[1] + r.histogram[2] + r.histogram[3] + r.histogram[4] + r.histogram[5];
  // 6814 ratings vs 1186 written reviews on this product. Rendering one count
  // over the other's histogram is the bug this assertion guards.
  assert.equal(r.ratingCount, hist);
  assert.notEqual(r.ratingCount, r.writtenCount);
});

test('buyerEval 0-100 becomes 1-5 stars', () => {
  const r = parseFeedback('x', {
    data: {
      productEvaluationStatistic: { evarageStar: 4.0, fiveStarNum: 1 },
      evaViewList: [
        { evaluationId: 1, buyerEval: 100, buyerFeedback: 'great' },
        { evaluationId: 2, buyerEval: 80, buyerFeedback: 'good' },
        { evaluationId: 3, buyerEval: 20, buyerFeedback: 'bad' },
      ],
    },
  })!;
  assert.deepEqual(r.reviews.map((x) => x.stars), [5, 4, 1]);
});

test('reviews with no text are dropped', () => {
  const r = parseFeedback('x', {
    data: {
      productEvaluationStatistic: { evarageStar: 5, fiveStarNum: 10 },
      evaViewList: [
        { evaluationId: 1, buyerEval: 100, buyerFeedback: '   ' },
        { evaluationId: 2, buyerEval: 100, buyerFeedback: 'says something' },
      ],
    },
  })!;
  assert.equal(r.reviews.length, 1);
});

test('a dead read is null, not an empty product', () => {
  // Must not be cached as "this product has no reviews".
  assert.equal(parseFeedback('x', {}), null);
  assert.equal(parseFeedback('x', { data: { evaViewList: [], productEvaluationStatistic: {} } }), null);
});

test('summary line never invents a count', () => {
  assert.equal(reviewSummaryLine(null), '');
  const r = parseFeedback('3256806852323474', fixture)!;
  assert.match(reviewSummaryLine(r), /4\.9 ★ · [\d,]+/);
});

test('stars map back onto the sites 0-100 rating scale', () => {
  assert.equal(starsToRate(4.9), 98);
  assert.equal(starsToRate(5), 100);
});
