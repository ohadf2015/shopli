import { useEffect, useRef, useState } from 'react';
import Icon from './icons';
import { productImage } from '../lib/img';
import { MAX_COMPARE_PRODUCTS, parseCompareIds } from '../lib/product-compare';

interface Hit {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
}

interface Props {
  region: string;
  rtl: boolean;
  currencySymbol: string;
  currentIds: string[];
  onAdd: (ids: string[]) => void;
  error?: string | null;
  autoFocus?: boolean;
}

export default function CompareAddProduct({
  region,
  rtl,
  currencySymbol,
  currentIds,
  onAdd,
  error,
  autoFocus,
}: Props) {
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<Hit[]>([]);
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'failed'>('idle');
  const seq = useRef(0);

  const pasted = parseCompareIds(q);
  const full = currentIds.length >= MAX_COMPARE_PRODUCTS;
  const query = q.trim();

  useEffect(() => {
    if (query.length < 2 || pasted.length > 0) {
      setHits([]);
      setState('idle');
      return;
    }
    const mine = ++seq.current;
    setState('loading');
    const t = setTimeout(async () => {
      try {
        const r = await fetch(
          `/api/products/search?q=${encodeURIComponent(query)}&region=${region}&limit=6`
        );
        const j = await r.json();
        if (mine !== seq.current) return;
        setHits(j.products || []);
        setState(j.success ? 'done' : 'failed');
      } catch {
        if (mine === seq.current) setState('failed');
      }
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, region]);

  const add = (ids: string[]) => {
    onAdd(ids);
    setQ('');
    setHits([]);
    setState('idle');
  };

  return (
    <div className="bg-white rounded-xl border border-[#141414] p-4 sm:p-5">
      <label
        htmlFor="compare-add"
        className="block text-sm font-bold mb-2"
        style={{ color: 'var(--shopli-navy)' }}
      >
        {rtl ? 'הוסיפו מוצר להשוואה' : 'Add a product to compare'}
      </label>
      {full ? (
        <p className="text-sm" style={{ color: 'var(--shopli-warm-gray)' }}>
          {rtl
            ? `אפשר להשוות עד ${MAX_COMPARE_PRODUCTS} מוצרים. הסירו אחד כדי להוסיף אחר.`
            : `You can compare up to ${MAX_COMPARE_PRODUCTS} products. Remove one to add another.`}
        </p>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1 min-w-0">
            <span
              className="absolute top-1/2 -translate-y-1/2 start-3 pointer-events-none"
              style={{ color: 'var(--shopli-warm-gray)' }}
            >
              <Icon name="search" size={16} />
            </span>
            <input
              id="compare-add"
              type="search"
              value={q}
              autoFocus={autoFocus}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && pasted.length > 0 && add(pasted)}
              placeholder={
                rtl
                  ? 'חפשו מוצר, או הדביקו קישור מ-AliExpress'
                  : 'Search a product, or paste an AliExpress link'
              }
              className="w-full ps-9 pe-3 py-3 text-base rounded-lg border border-[#141414] focus:outline-none focus:ring-2 focus:ring-orange-200"
              style={{ color: 'var(--shopli-navy)' }}
              autoComplete="off"
            />
          </div>
          {pasted.length > 0 && (
            <button type="button" className="btn-primary whitespace-nowrap" onClick={() => add(pasted)}>
              {rtl ? `הוסף ${pasted.length}` : `Add ${pasted.length}`}
            </button>
          )}
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {state === 'loading' && (
        <p className="mt-3 text-sm" style={{ color: 'var(--shopli-warm-gray)' }} role="status">
          {rtl ? 'מחפשים…' : 'Searching…'}
        </p>
      )}
      {state === 'failed' && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {rtl ? 'החיפוש נכשל. נסו שוב.' : 'Search failed. Try again.'}
        </p>
      )}
      {state === 'done' && hits.length === 0 && (
        <p className="mt-3 text-sm" style={{ color: 'var(--shopli-warm-gray)' }}>
          {rtl ? 'לא נמצאו מוצרים. נסו מילות חיפוש אחרות.' : 'No products found. Try different words.'}
        </p>
      )}
      {hits.length > 0 && (
        <ul className="mt-3 divide-y divide-gray-100 border border-[#141414] rounded-lg overflow-hidden">
          {hits.map((h) => {
            const added = currentIds.includes(h.id);
            return (
              <li key={h.id}>
                <button
                  type="button"
                  disabled={added}
                  onClick={() => add([h.id])}
                  className="w-full flex items-center gap-3 p-2.5 text-start hover:bg-[#FFF4E4] disabled:opacity-50 disabled:hover:bg-transparent"
                >
                  {h.imageUrl ? (
                    <img
                      {...productImage(h.imageUrl, 96)}
                      alt=""
                      className="w-11 h-11 object-contain rounded bg-[#FFF4E4] shrink-0"
                    />
                  ) : (
                    <span className="w-11 h-11 shrink-0" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span
                      className="block text-sm font-medium line-clamp-2"
                      style={{ color: 'var(--shopli-navy)' }}
                    >
                      {h.title}
                    </span>
                    <span className="block text-sm font-bold" style={{ color: 'var(--shopli-teal)' }}>
                      {currencySymbol}
                      {h.price.toFixed(2)}
                    </span>
                  </span>
                  <span className="text-sm font-semibold shrink-0" style={{ color: 'var(--shopli-orange)' }}>
                    {added ? (rtl ? 'נוסף' : 'Added') : rtl ? '+ הוסף' : '+ Add'}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
