import fs from 'fs/promises';
import path from 'path';

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
}

export interface ReviewsSummary {
  reviews: Review[];
  average: number;
  count: number;
}

const REVIEWS_FILE = path.join(process.cwd(), 'data', 'reviews.json');

async function ensureReviewsFile(): Promise<void> {
  try {
    await fs.access(REVIEWS_FILE);
  } catch {
    await fs.mkdir(path.dirname(REVIEWS_FILE), { recursive: true });
    await fs.writeFile(REVIEWS_FILE, '{}', 'utf-8');
  }
}

export async function loadReviews(): Promise<Record<string, Review[]>> {
  await ensureReviewsFile();
  try {
    const raw = await fs.readFile(REVIEWS_FILE, 'utf-8');
    return JSON.parse(raw || '{}') as Record<string, Review[]>;
  } catch {
    return {};
  }
}

export async function saveReviews(reviews: Record<string, Review[]>): Promise<void> {
  await ensureReviewsFile();
  await fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2), 'utf-8');
}

export function calculateReviewsSummary(reviews: Review[]): ReviewsSummary {
  const valid = (reviews || []).filter(
    (r) => typeof r.rating === 'number' && r.rating >= 1 && r.rating <= 5
  );
  const count = valid.length;
  const average = count > 0 ? valid.reduce((sum, r) => sum + r.rating, 0) / count : 0;
  return {
    reviews: valid,
    average: Math.round(average * 10) / 10,
    count,
  };
}

export async function getReviewsByProductId(productId: string): Promise<ReviewsSummary> {
  const all = await loadReviews();
  return calculateReviewsSummary(all[productId] || []);
}

export async function addReview(
  productId: string,
  input: Omit<Review, 'id' | 'date'>
): Promise<Review> {
  const rating = Math.max(1, Math.min(5, Math.round(Number(input.rating) || 1)));
  const text = String(input.text || '').trim();
  const name = String(input.name || '').trim() || 'Anonymous';

  if (text.length < 3) {
    throw new Error('Review text must be at least 3 characters');
  }

  const review: Review = {
    id: `${productId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    rating,
    text,
    date: new Date().toISOString(),
  };

  const all = await loadReviews();
  all[productId] = [...(all[productId] || []), review];
  await saveReviews(all);
  return review;
}
