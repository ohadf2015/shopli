import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from './icons';
import { productImage } from '../lib/img';
import { SIMILAR_ALGO_VERSION, SIMILAR_CHIP_LABELS, SimilarChip } from '../lib/similar';
import {
  trackFindSimilarClick,
  trackFindSimilarView,
  trackSimilarProductClick,
  trackFindSimilarError,
} from '../lib/analytics';

interface SimilarProduct {
  id: string;
  title: string;
  price: number;
  originalPrice?: number | null;
  discount?: string;
  rating: number;
  volume: number;
  category: string;
  imageUrl: string;
  affiliateLink: string;
  currency: string;
}

interface SimilarEntry {
  rank: number;
  score: number;
  chips: SimilarChip[];
  product: SimilarProduct;
}

interface FindSimilarProps {
  region: string;
  rtl: boolean;
  currencySymbol: string;
  source: {
    id: string;
    title: string;
    price: number;
    currency: string;
    category: string;
  };
}

export default function FindSimilar({ region, rtl, currencySymbol, source }: FindSimilarProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SimilarEntry[] | null>(null);
  const [error, setError] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  const openDrawer = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(
        `/api/products/similar?region=${encodeURIComponent(region)}&id=${encodeURIComponent(source.id)}`
      );
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      if (!data.success || !Array.isArray(data.results)) {
        throw new Error(data.error || 'bad response');
      }
      setResults(data.results);
      setOpen(true);
      trackFindSimilarClick({
        region,
        surface: 'pdp',
        source_product_id: source.id,
        source_category: source.category,
        source_price: source.price,
        currency: source.currency,
        result_count: data.results.length,
        algorithm_version: data.algorithmVersion || SIMILAR_ALGO_VERSION,
      });
    } catch (err: any) {
      trackFindSimilarError({ region, source_product_id: source.id, error: String(err?.message || err) });
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // find_similar_view when results render
  useEffect(() => {
    if (open && results) {
      trackFindSimilarView({
        region,
        surface: 'pdp',
        source_product_id: source.id,
        product_ids: results.map((r) => r.product.id),
        result_count: results.length,
        algorithm_version: SIMILAR_ALGO_VERSION,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, results]);

  // Escape to close, focus close button on open, simple Tab trap
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, close]);

  return (
    <>
      <div className="flex flex-col items-start gap-2">
        <button
          ref={triggerRef}
          type="button"
          onClick={openDrawer}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl border transition-colors"
          style={{
            borderColor: 'var(--shopli-teal)',
            color: 'var(--shopli-teal)',
            background: 'rgba(20,184,166,0.06)',
            opacity: loading ? 0.6 : 1,
          }}
          aria-haspopup="dialog"
        >
          <Icon name="search" size={15} />
          {loading
            ? rtl
              ? 'מחפש...'
              : 'Searching...'
            : rtl
              ? 'מצאו מוצרים דומים'
              : 'Find similar picks'}
        </button>

        {error && (
          <div
            role="alert"
            className="flex items-center gap-2 text-xs rounded-lg border px-3 py-2"
            style={{
              borderColor: 'rgba(248,113,113,0.4)',
              color: '#fca5a5',
              background: 'rgba(248,113,113,0.08)',
            }}
          >
            <span>{rtl ? 'לא הצלחנו לטעון מוצרים דומים' : "Couldn't load similar picks"}</span>
            <button
              type="button"
              onClick={openDrawer}
              disabled={loading}
              className="font-bold underline underline-offset-2"
              style={{ color: '#fca5a5' }}
            >
              {rtl ? 'נסו שוב' : 'Retry'}
            </button>
          </div>
        )}
      </div>

      {open && (
        <>
          <div className="fs-overlay" onClick={close} aria-hidden="true" />
          <div
            ref={panelRef}
            className="fs-panel trend-surface"
            role="dialog"
            aria-modal="true"
            aria-label={rtl ? 'מוצרים דומים' : 'Similar products'}
          >
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: 'var(--t-border)' }}
            >
              <h2 className="text-base font-extrabold" style={{ color: 'var(--t-text)' }}>
                {rtl ? 'מוצרים דומים' : 'Similar picks'}
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label={rtl ? 'סגירה' : 'Close'}
                className="p-2 rounded-full hover:bg-white/10"
                style={{ color: 'var(--t-muted)' }}
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-4 space-y-3">
              {results && results.length === 0 && (
                <p className="text-sm text-center py-8" style={{ color: 'var(--t-muted)' }}>
                  {rtl ? 'לא נמצאו התאמות קרובות עדיין' : 'No close matches yet'}
                </p>
              )}
              {results?.map((entry) => {
                const p = entry.product;
                const href = `/${region}/product/${encodeURIComponent(p.id)}`;
                return (
                  <a
                    key={p.id}
                    href={href}
                    onClick={() =>
                      trackSimilarProductClick({
                        region,
                        surface: 'pdp',
                        source_product_id: source.id,
                        product_id: p.id,
                        rank: entry.rank,
                        similarity_score: entry.score,
                        algorithm_version: SIMILAR_ALGO_VERSION,
                      })
                    }
                    className="flex gap-3 rounded-2xl border p-3 transition-colors hover:border-orange-400/60"
                    style={{ borderColor: 'var(--t-border)', background: 'var(--t-panel-soft)' }}
                    data-product-id={p.id}
                    data-product-title={p.title}
                    data-price={p.price.toFixed(2)}
                    data-currency={p.currency}
                    data-category={p.category}
                  >
                    <div
                      className="w-16 h-16 shrink-0 rounded-xl overflow-hidden"
                      style={{ background: '#0b1222' }}
                    >
                      {p.imageUrl && (
                        <img
                          {...productImage(p.imageUrl, 120)}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold leading-snug line-clamp-2" style={{ color: 'var(--t-text)' }}>
                        {p.title}
                      </p>
                      <div className="flex items-baseline gap-2 mt-1" dir="ltr">
                        <span className="text-sm font-extrabold tabular-nums" style={{ color: 'var(--t-teal)' }}>
                          {currencySymbol}
                          {p.price.toFixed(2)}
                        </span>
                        {p.rating > 0 && (
                          <span className="text-[0.65rem] tabular-nums" style={{ color: 'var(--t-muted)' }}>
                            ★ {(p.rating / 20).toFixed(1)}
                          </span>
                        )}
                      </div>
                      {entry.chips.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {entry.chips.map((chip) => (
                            <span key={chip} className="trend-chip">
                              {rtl ? SIMILAR_CHIP_LABELS[chip].he : SIMILAR_CHIP_LABELS[chip].en}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}
