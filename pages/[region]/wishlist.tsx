import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '../../components/Header';
import Icon from '../../components/icons';
import SeoHead from '../../components/SeoHead';
import { getRegion, RegionCode } from '../../lib/regions';
import { useWishlist, WishlistItem } from '../../lib/useWishlist';
import type { ProductCardProduct } from '../../components/ProductCard';

/** Minimal product card rendering inside the wishlist page — avoids importing the full ProductCard component tree just for the wishlist page. */
function WishlistItemCard({
  item,
  rtl,
  currencySymbol,
  region,
  onRemove,
}: {
  item: WishlistItem;
  rtl: boolean;
  currencySymbol: string;
  region: string;
  onRemove: (id: string) => void;
}) {
  const productUrl = `/${region}/product/${encodeURIComponent(item.id)}`;
  const price = Number(item.price) || 0;
  const original =
    item.originalPrice != null && item.originalPrice > price ? item.originalPrice : null;

  return (
    <article className="product-card group bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col h-full relative">
      {/* Link to product page */}
      <a
        href={productUrl}
        className="absolute inset-0 z-0"
        aria-label={item.title}
      />

      {/* Image */}
      <div className="aspect-square bg-gray-50 overflow-hidden relative">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--shopli-warm-gray)' }}>
            <Icon name="package" size={32} />
          </div>
        )}

        {item.discount && (
          <span className="absolute top-2 end-2 text-[0.6rem] sm:text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-sm shadow-sm" style={{ color: 'var(--shopli-orange)' }}>
            -{item.discount}
          </span>
        )}

        {/* Remove button */}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(item.id); }}
          className="absolute top-2 start-2 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center z-10 shadow-sm transition-all hover:scale-110"
          aria-label={rtl ? 'הסר מהמועדפים' : 'Remove from wishlist'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--shopli-warm-gray)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {item.freeShipping && (
          <span className="absolute bottom-2 start-2 flex items-center gap-0.5 text-[0.55rem] font-semibold px-1.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm" style={{ color: 'var(--shopli-teal)' }}>
            <Icon name="truck" size={10} />
            {rtl ? 'משלוח חינם' : 'Free ship'}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3">
        <h3 className="font-semibold text-xs sm:text-sm leading-tight line-clamp-2 mb-1.5" style={{ color: 'var(--shopli-navy)' }}>
          {item.title}
        </h3>

        <div className="flex items-baseline gap-1.5 flex-wrap mb-1">
          <span className="font-bold text-sm sm:text-base tabular-nums" style={{ color: 'var(--shopli-teal)' }} dir="ltr">
            {currencySymbol}{price.toFixed(2)}
          </span>
          {original != null && (
            <span className="text-[0.65rem] sm:text-xs line-through tabular-nums" style={{ color: 'var(--shopli-warm-gray)' }} dir="ltr">
              {currencySymbol}{original.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 flex-wrap mt-auto" style={{ color: 'var(--shopli-warm-gray)' }}>
          {(item.rating || 0) > 0 && (
            <>
              <Icon name="star" size={11} className="text-yellow-500 shrink-0" />
              <span className="text-[0.65rem] font-medium tabular-nums">
                {((item.rating || 0) / 20).toFixed(1)}
              </span>
            </>
          )}
          {(item.volume || 0) > 0 && (
            <span className="text-[0.6rem] sm:text-[0.65rem]">
              {item.volume > 999 ? `${(item.volume / 1000).toFixed(1)}k` : String(item.volume)}
              {rtl ? ' נמכרו' : ' sold'}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default function WishlistPage() {
  const router = useRouter();
  const region = (router.query.region as string) || 'eu';
  const config = getRegion(region as RegionCode);
  if (!config) return null;
  const rtl = config.direction === 'rtl';
  const lang = config.lang || 'en';

  const { items: wishlistItems, remove, count } = useWishlist();
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Sort newest-first
  const sorted = [...wishlistItems].sort((a, b) => b.addedAt - a.addedAt);

  const handleEmailSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim()) return;
      setSubmitting(true);
      setEmailStatus(null);
      try {
        const res = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), region, wishlist: true }),
        });
        const data = await res.json();
        setEmailStatus(data);
        if (data.ok) setEmail('');
      } catch {
        setEmailStatus({ ok: false, message: rtl ? 'שגיאה, נסו שוב' : 'Error, try again' });
      }
      setSubmitting(false);
    },
    [email, region, rtl],
  );

  return (
    <>
      <SeoHead
        region={region as RegionCode}
        path={`/${region}/wishlist`}
        title={rtl ? 'המועדפים שלי | Shopli' : 'My Wishlist | Shopli'}
        description={rtl ? 'שמרתם מוצרים שאהבתם? המועדפים שלכם מחכים לכם כאן.' : 'Saved products you love — your wishlist awaits.'}
        noindex
      />
      <Header currentRegion={region as RegionCode} dir={config.direction} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-16">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold mb-2" style={{ color: 'var(--shopli-navy)' }}>
            <span className="inline-flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--shopli-orange)" stroke="var(--shopli-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
              {rtl ? 'המועדפים שלי' : 'My Wishlist'}
            </span>
          </h1>
          <p className="text-sm" style={{ color: 'var(--shopli-warm-gray)' }}>
            {count > 0
              ? (rtl
                  ? `יש לך ${count} מוצרים שמורים`
                  : `You have ${count} saved ${count === 1 ? 'product' : 'products'}`)
              : (rtl ? 'עדיין לא שמרתם מוצרים' : "You haven't saved any products yet")}
          </p>
        </div>

        {count === 0 ? (
          /* Empty state */
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center" style={{ background: 'oklch(90% 0.06 45)', color: 'var(--shopli-orange)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
            </div>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--shopli-navy)' }}>
              {rtl ? 'המועדפים שלך ריקים' : 'Your wishlist is empty'}
            </h2>
            <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: 'var(--shopli-warm-gray)' }}>
              {rtl
                ? 'לחצו על הלב 🧡 ליד מוצרים שאהבתם כדי לשמור אותם למועד מאוחר יותר'
                : 'Tap the heart 🧡 on products you love to save them for later'}
            </p>
            <Link href={`/${region}`} className="btn-primary">
              {rtl ? 'גלו מוצרים' : 'Browse products'}
            </Link>
          </div>
        ) : (
          <>
            {/* Product grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12">
              {sorted.map((item) => (
                <WishlistItemCard
                  key={item.id}
                  item={item}
                  rtl={rtl}
                  currencySymbol={config.currencySymbol}
                  region={region}
                  onRemove={remove}
                />
              ))}
            </div>

            {/* Email capture — save wishlist for price-drop notifications */}
            <section className="max-w-2xl mx-auto">
              <div className="rounded-2xl p-6 md:p-8 text-center" style={{ background: 'var(--shopli-navy)', color: 'white' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--shopli-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
                <h2 className="text-lg font-bold mb-2">
                  {rtl ? 'שמרו את המועדפים שלכם למייל' : 'Save your wishlist to email'}
                </h2>
                <p className="text-sm mb-4 max-w-md mx-auto" style={{ color: 'oklch(70% 0.02 80)' }}>
                  {rtl
                    ? 'הכניסו אימייל וקבלו התראה כשיש ירידת מחיר על המוצרים ששמרתם'
                    : 'Enter your email and get notified when prices drop on your saved items'}
                </p>
                <form onSubmit={handleEmailSubmit} className="flex gap-2 max-w-sm mx-auto">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={rtl ? 'האימייל שלך' : 'your@email.com'}
                    className="flex-1 min-w-0 px-4 py-2.5 rounded-xl text-sm text-gray-900 placeholder-gray-400 border-0 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl font-bold text-sm shrink-0 disabled:opacity-50 cursor-pointer"
                    style={{ background: 'var(--shopli-orange)', color: 'white' }}
                  >
                    {submitting
                      ? (rtl ? '...' : '...')
                      : (rtl ? 'שמרו' : 'Save')}
                  </button>
                </form>
                {emailStatus && (
                  <p className={`text-xs mt-2 ${emailStatus.ok ? '' : 'text-red-300'}`} style={{ color: emailStatus.ok ? 'oklch(80% 0.05 130)' : undefined }}>
                    {emailStatus.message}
                  </p>
                )}
                <p className="text-xs mt-3" style={{ color: 'oklch(70% 0.02 80)' }}>
                  {rtl ? 'לא נשלח ספאם. אפשר להפסיק בכל עת.' : 'No spam. Unsubscribe anytime.'}
                </p>
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
}