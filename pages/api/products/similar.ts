import type { NextApiRequest, NextApiResponse } from 'next';
import { getProductsByIds, searchAliExpress, SearchProduct } from '../../../lib/aliexpress';
import { getDemoProductById } from '../../../lib/demo-products';
import { findSimilar, tokenizeTitle, SIMILAR_ALGO_VERSION, SimilarCandidate, SimilarChip } from '../../../lib/similar';
import { isValidRegion } from '../../../lib/regions';

function toSimilarCandidate(p: SearchProduct): SimilarCandidate {
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    originalPrice: p.originalPrice,
    discount: p.discount,
    rating: p.rating,
    volume: p.volume,
    category: p.category || 'general',
    imageUrl: p.imageUrl,
    affiliateLink: p.affiliateLink,
    currency: p.currency,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { region = 'eu', id = '' } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, error: 'Missing id param', results: [] });
  }
  if (!isValidRegion(region as string)) {
    return res.status(400).json({ success: false, error: 'Invalid region', results: [] });
  }

  try {
    // 1. Resolve the source product (live catalog, then demo fallback).
    let source: SearchProduct | undefined;
    try {
      source = (await getProductsByIds([id], region as string))[0];
    } catch {
      /* fall through to demo */
    }
    if (!source) {
      source = getDemoProductById(id, region as string, 'EUR') as unknown as SearchProduct | undefined;
    }
    if (!source) {
      return res.status(404).json({ success: false, error: 'Product not found', results: [] });
    }

    // 2. Candidate pool: search by the source's category and its top title tokens.
    const tokens = tokenizeTitle(source.title).slice(0, 3);
    const queries = [source.category, tokens.join(' ')].filter(Boolean);
    const pools = await Promise.all(
      queries.map((q) =>
        searchAliExpress(q, region as string, 12).catch(() => [] as SearchProduct[])
      )
    );
    const candidates = pools.flat().map(toSimilarCandidate);

    // 3. Rank deterministically.
    let results = findSimilar(toSimilarCandidate(source), candidates, { limit: 6 });

    // 4. Popular fallback: if fewer than 3 close matches, pad with the
    //    best-selling same-category products (never an empty drawer).
    if (results.length > 0 && results.length < 3) {
      const fallbackPool = candidates
        .filter((c) => c.category === source!.category && !results.some((r) => r.product.id === c.id))
        .sort((a, b) => b.volume - a.volume)
        .slice(0, 3 - results.length);
      results = [
        ...results,
        ...fallbackPool.map((product) => ({
          product,
          score: 0,
          chips: ['same_category'] as SimilarChip[],
          algorithmVersion: SIMILAR_ALGO_VERSION,
        })),
      ];
    }

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
    return res.status(200).json({
      success: true,
      source_id: id,
      algorithmVersion: SIMILAR_ALGO_VERSION,
      results: results.map((r, i) => ({
        rank: i + 1,
        score: r.score,
        chips: r.chips,
        product: r.product,
      })),
    });
  } catch (error: any) {
    return res.status(200).json({ success: false, error: error?.message || 'Unknown error', results: [] });
  }
}
