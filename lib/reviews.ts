/**
 * Real buyer reviews, from people who actually bought the product.
 *
 * The affiliate API gives us a positive-feedback percentage and nothing else —
 * no review text, and (verified 2026-08-15 against a live response) no
 * `last_5_days_trade_count` field at all, which is what `SearchProduct.reviewCount`
 * was reading. Every product on the site therefore claimed 0 reviews.
 *
 * AliExpress serves its own review widget from a keyless JSON endpoint, the same
 * one the product page calls. It honours `lang`/`country`, so Hebrew visitors get
 * the machine-translated Hebrew review and the localized date, and it returns
 * buyer country, purchased variant, photos and a star histogram.
 *
 * Two denominators, measured on a real product and NOT interchangeable:
 *   - `totalNum` 1186 with `totalPage` 60 at pageSize 20  → reviews with TEXT.
 *   - fiveStarNum+…+oneStarNum = 6814                     → all RATINGS.
 * Rendering "1,186 reviews" over a histogram that sums to 6,814 is visibly
 * wrong, so the two are kept as separate fields and labelled separately.
 *
 * Caveat worth keeping: on the sampled product `oneStarNum`/`twoStarNum` were 0
 * while 557 ratings sat at three stars — the histogram this endpoint returns is
 * filtered upstream. So this data is good for "what do buyers say", and must not
 * be used to claim "we screen out products with bad reviews". The quality gate
 * (lib/quality.ts) is built on the affiliate fields for exactly that reason.
 */

export interface BuyerReview {
  id: string;
  /** 1-5, from buyerEval (0-100). */
  stars: number;
  text: string;
  /** ISO-2 country of the buyer, as reported. */
  country: string;
  /** Already localized by the endpoint for the requested language. */
  date: string;
  /** The variant this buyer actually bought, e.g. "Color:LP40 black". */
  variant: string;
  photos: string[];
  helpful: number;
}

export interface ProductReviews {
  productId: string;
  /** 1-5 average across all ratings. */
  averageStars: number;
  /** Number of star ratings behind `averageStars` (histogram denominator). */
  ratingCount: number;
  /** Number of reviews that have written text (a smaller population). */
  writtenCount: number;
  /** stars 1-5 → count. Filtered upstream; see the caveat above. */
  histogram: Record<1 | 2 | 3 | 4 | 5, number>;
  /** Distinct buyer countries seen in this page of reviews. */
  countries: string[];
  reviews: BuyerReview[];
  fetchedAt: string;
}

const LOCALE: Record<string, { lang: string; country: string }> = {
  il: { lang: 'he_IL', country: 'IL' },
  ru: { lang: 'ru_RU', country: 'IL' },
  us: { lang: 'en_US', country: 'US' },
  uk: { lang: 'en_GB', country: 'GB' },
  eu: { lang: 'en_US', country: 'FR' },
  fr: { lang: 'fr_FR', country: 'FR' },
  de: { lang: 'de_DE', country: 'DE' },
  es: { lang: 'es_ES', country: 'ES' },
  it: { lang: 'it_IT', country: 'IT' },
};

const FEEDBACK_URL = 'https://feedback.aliexpress.com/pc/searchEvaluation.do';

/**
 * Turn one raw endpoint response into what the page renders.
 *
 * Split from the fetch so the fixture test can pin the shape: this is an
 * undocumented endpoint and a silent shape change would otherwise show up as
 * "reviews quietly disappeared" rather than a failing test.
 */
export function parseFeedback(productId: string, raw: any, now = new Date()): ProductReviews | null {
  const data = raw?.data;
  if (!data) return null;
  const stat = data.productEvaluationStatistic || {};

  const histogram = {
    1: Number(stat.oneStarNum || 0),
    2: Number(stat.twoStarNum || 0),
    3: Number(stat.threeStarNum || 0),
    4: Number(stat.fourStarNum || 0),
    5: Number(stat.fiveStarNum || 0),
  } as Record<1 | 2 | 3 | 4 | 5, number>;
  const ratingCount = histogram[1] + histogram[2] + histogram[3] + histogram[4] + histogram[5];

  const reviews: BuyerReview[] = (data.evaViewList || [])
    .map((r: any): BuyerReview => ({
      id: String(r.evaluationIdStr || r.evaluationId || ''),
      // buyerEval is 0-100 in steps of 20; 80 is four stars, not eighty.
      stars: Math.max(1, Math.min(5, Math.round(Number(r.buyerEval || 0) / 20))),
      text: String(r.buyerTranslationFeedback || r.buyerFeedback || '').trim(),
      country: String(r.buyerCountry || '').toUpperCase(),
      date: String(r.evalDate || ''),
      variant: String(r.skuInfo || '').trim(),
      photos: Array.isArray(r.images) ? r.images.filter(Boolean).slice(0, 4) : [],
      helpful: Number(r.upVoteCount || 0),
    }))
    .filter((r: BuyerReview) => r.text.length > 0);

  const averageStars = Number(stat.evarageStar || 0);
  // A response with neither ratings nor text is a dead read, not a product with
  // no reviews — returning null keeps it from being cached as truth.
  if (!ratingCount && !reviews.length) return null;

  return {
    productId,
    averageStars,
    ratingCount,
    writtenCount: Number(data.totalNum || stat.totalNum || reviews.length),
    histogram,
    countries: [...new Set(reviews.map((r) => r.country).filter(Boolean))],
    reviews,
    fetchedAt: now.toISOString(),
  };
}

/**
 * One live read. Times out fast and returns null on anything unexpected — this
 * is decoration on a page that must render without it.
 */
export async function fetchProductReviews(
  productId: string,
  region: string,
  { pageSize = 20, timeoutMs = 4000 }: { pageSize?: number; timeoutMs?: number } = {}
): Promise<ProductReviews | null> {
  const loc = LOCALE[region] || LOCALE.us;
  const url = `${FEEDBACK_URL}?${new URLSearchParams({
    productId,
    lang: loc.lang,
    country: loc.country,
    page: '1',
    pageSize: String(pageSize),
    filter: 'all',
    sort: 'complex_default',
  })}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        // Without a browser UA this endpoint answers with an interstitial.
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        'Accept': 'application/json,text/plain,*/*',
        'Referer': 'https://www.aliexpress.com/',
      },
    });
    if (!res.ok) return null;
    return parseFeedback(productId, await res.json());
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** 1-5 star average expressed the way the rest of the site holds ratings (0-100). */
export function starsToRate(averageStars: number): number {
  return Math.round(averageStars * 20 * 10) / 10;
}

/**
 * The one line a card can show: "4.9 ★ · 6,814 ratings".
 * Never invents a count — with no ratings it returns an empty string so the
 * caller renders nothing rather than "0 reviews", which is the bug this
 * module exists to kill.
 */
export function reviewSummaryLine(r: ProductReviews | null, lang = 'en'): string {
  if (!r || !r.ratingCount) return '';
  const n = r.ratingCount.toLocaleString(lang === 'he' ? 'he-IL' : 'en-US');
  return `${r.averageStars.toFixed(1)} ★ · ${n}`;
}
