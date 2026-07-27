import { useState } from 'react';
import Icon from './icons';
import type { Review, ReviewsSummary } from '../lib/reviews';

interface ReviewsProps {
  productId: string;
  summary: ReviewsSummary;
  rtl?: boolean;
}

function StarDisplay({ rating, size = 16 }: { rating: number; size?: number }) {
  const fullStars = Math.round(rating);
  return (
    <span className="inline-flex items-center" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Icon
          key={i}
          name="star"
          size={size}
          className={i < fullStars ? 'text-yellow-400' : 'text-gray-200'}
        />
      ))}
    </span>
  );
}

function StarInput({ name, defaultValue = 0 }: { name: string; defaultValue?: number }) {
  const [hover, setHover] = useState(0);
  const [selected, setSelected] = useState(defaultValue);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => {
        const value = i + 1;
        const filled = value <= (hover || selected);
        return (
          <label
            key={value}
            className="cursor-pointer p-0.5 transition-transform hover:scale-110 focus-within:scale-110"
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(0)}
          >
            <input
              type="radio"
              name={name}
              value={value}
              required
              className="sr-only"
              defaultChecked={value === selected}
              onChange={() => setSelected(value)}
            />
            <Icon
              name="star"
              size={24}
              className={filled ? 'text-yellow-400' : 'text-gray-200'}
            />
          </label>
        );
      })}
    </div>
  );
}

function formatDate(iso: string, rtl: boolean): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(rtl ? 'he-IL' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default function Reviews({ productId, summary, rtl = false }: ReviewsProps) {
  const { reviews, average, count } = summary;
  const title = rtl ? 'ביקורות לקוחות' : 'Customer reviews';
  const submitLabel = rtl ? 'שלח ביקורת' : 'Submit review';
  const nameLabel = rtl ? 'שם' : 'Name';
  const ratingLabel = rtl ? 'דירוג' : 'Rating';
  const textLabel = rtl ? 'ביקורת' : 'Review';
  const textPlaceholder = rtl
    ? 'ספרו לנו מה חשבתם על המוצר...'
    : 'Tell us what you think about this product...';

  return (
    <section id="reviews" className="mt-10 sm:mt-14">
      <h2
        className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2"
        style={{ color: 'var(--shopli-navy)' }}
      >
        <Icon name="thumbs-up" size={20} className="text-yellow-500" />
        {title}
      </h2>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Rating summary */}
        <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <span
              className="text-3xl sm:text-4xl font-extrabold tabular-nums"
              style={{ color: 'var(--shopli-navy)' }}
            >
              {count > 0 ? average.toFixed(1) : '0.0'}
            </span>
            <div className="flex flex-col">
              <StarDisplay rating={average} size={18} />
              <span className="text-xs mt-0.5" style={{ color: 'var(--shopli-warm-gray)' }}>
                {count > 0
                  ? rtl
                    ? `${count} ביקורות`
                    : `${count} review${count === 1 ? '' : 's'}`
                  : rtl
                    ? 'אין ביקורות עדיין'
                    : 'No reviews yet'}
              </span>
            </div>
          </div>

          {/* Rating distribution */}
          {count > 0 && (
            <div className="flex-1 max-w-md">
              {[5, 4, 3, 2, 1].map((star) => {
                const starReviews = reviews.filter((r) => r.rating === star);
                const pct = count > 0 ? Math.round((starReviews.length / count) * 100) : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-3 font-medium" style={{ color: 'var(--shopli-warm-gray)' }}>
                      {star}
                    </span>
                    <Icon name="star" size={10} className="text-yellow-400" />
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${pct}%`, background: 'var(--shopli-orange)' }}
                      />
                    </div>
                    <span className="w-6 text-end tabular-nums" style={{ color: 'var(--shopli-warm-gray)' }}>
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Review list */}
        <ul className="divide-y divide-gray-100">
          {reviews.length === 0 && (
            <li className="p-6 text-center text-sm" style={{ color: 'var(--shopli-warm-gray)' }}>
              {rtl
                ? 'היו הראשונים לכתוב ביקורת על מוצר זה.'
                : 'Be the first to review this product.'}
            </li>
          )}
          {reviews.map((review, index) => (
            <li
              key={review.id}
              className="review-item p-4 sm:p-6"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--shopli-navy)' }}>
                    {review.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
                    {formatDate(review.date, rtl)}
                  </p>
                </div>
                <StarDisplay rating={review.rating} size={14} />
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--shopli-warm-gray)' }}>
                {review.text}
              </p>
            </li>
          ))}
        </ul>

        {/* Submission form */}
        <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50/30">
          <h3
            className="text-sm font-semibold mb-4"
            style={{ color: 'var(--shopli-navy)' }}
          >
            {rtl ? 'כתבו ביקורת' : 'Write a review'}
          </h3>
          <form method="post" action="#reviews" className="space-y-4">
            <input type="hidden" name="productId" value={productId} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="review-name"
                  className="block text-xs font-medium mb-1"
                  style={{ color: 'var(--shopli-warm-gray)' }}
                >
                  {nameLabel}
                </label>
                <input
                  id="review-name"
                  name="name"
                  type="text"
                  required
                  minLength={2}
                  maxLength={60}
                  placeholder={rtl ? 'השם שלך' : 'Your name'}
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                  style={{ color: 'var(--shopli-navy)' }}
                />
              </div>
              <div>
                <span
                  className="block text-xs font-medium mb-1"
                  style={{ color: 'var(--shopli-warm-gray)' }}
                >
                  {ratingLabel}
                </span>
                <StarInput name="rating" />
              </div>
            </div>

            <div>
              <label
                htmlFor="review-text"
                className="block text-xs font-medium mb-1"
                style={{ color: 'var(--shopli-warm-gray)' }}
              >
                {textLabel}
              </label>
              <textarea
                id="review-text"
                name="text"
                required
                minLength={3}
                maxLength={1000}
                rows={4}
                placeholder={textPlaceholder}
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 resize-y"
                style={{ color: 'var(--shopli-navy)' }}
              />
            </div>

            <button type="submit" className="btn-primary text-sm">
              <Icon name="thumbs-up" size={16} />
              {submitLabel}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export type { Review, ReviewsSummary };
