import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Icon from '../components/icons';
import { productImage } from '../lib/img';
import { getRegion, isValidRegion, type RegionCode } from '../lib/regions';

/**
 * The 404 a shopper actually lands on.
 *
 * Most of our real visitors arrive from ChatGPT answers that link straight to a
 * product page, and AliExpress retires listings all the time. Those links used
 * to end on Next's bare white "404 | This page could not be found" with no
 * header, no search and nowhere to go, so every one of them left.
 *
 * The status stays a hard 404 (docs/specs/pdp-hard-404.md): this page is static
 * and only fills in client-side, with today's live picks for the visitor's
 * region from /api/products/picks, which reads our own tables and never the
 * AliExpress API.
 */

interface LivePick {
  productId: string;
  title: string;
  price: number;
  imageUrl: string;
  rating: number;
}

const COPY = {
  en: {
    title: 'This deal has ended',
    product: 'The seller pulled this listing from AliExpress, or it is no longer available where you are.',
    page: 'We could not find that page.',
    live: "Today's live deals instead",
    home: 'See all deals',
    search: 'Search for something similar',
    placeholder: 'What were you looking for?',
  },
  he: {
    title: 'הדיל הזה הסתיים',
    product: 'המוכר הוריד את המוצר מאליאקספרס, או שהוא כבר לא זמין לאזור שלך.',
    page: 'לא מצאנו את הדף הזה.',
    live: 'הדילים החיים של היום במקום',
    home: 'לכל הדילים',
    search: 'חפשו משהו דומה',
    placeholder: 'מה חיפשתם?',
  },
};

function regionFromPath(path: string): RegionCode {
  const seg = path.match(/^\/([a-z]{2})(?:\/|$)/)?.[1] || 'eu';
  return isValidRegion(seg) ? seg : 'eu';
}

export default function NotFound() {
  // Static page: the real URL is only known in the browser.
  const [path, setPath] = useState('');
  const [picks, setPicks] = useState<LivePick[] | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setPath(window.location.pathname);
  }, []);

  const region = regionFromPath(path);
  const config = getRegion(region);
  const rtl = config.direction === 'rtl';
  const t = rtl ? COPY.he : COPY.en;
  const isProduct = /\/product\//.test(path);

  useEffect(() => {
    if (!path) return;
    let cancelled = false;
    try {
      window.posthog?.capture('not_found_view', { region, is_product: isProduct });
    } catch {
      /* analytics must never break the page */
    }
    fetch(`/api/products/picks?region=${region}&limit=8`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setPicks(Array.isArray(d?.picks) ? d.picks.slice(0, 8) : []);
      })
      .catch(() => {
        if (!cancelled) setPicks([]);
      });
    return () => {
      cancelled = true;
    };
  }, [path, region, isProduct]);

  const fmt = (n: number) =>
    `${config.currencySymbol}${n.toFixed(2)}`;

  return (
    <>
      <Head>
        <title>{`${t.title} | Shopli`}</title>
        <meta name="robots" content="noindex" />
      </Head>
      <Header currentRegion={region} dir={config.direction} />
      <main dir={config.direction} className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16">
        <section className="max-w-xl mx-auto text-center">
          <div
            className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center"
            style={{ background: 'oklch(92% 0.06 45)', color: 'var(--shopli-orange)' }}
          >
            <Icon name="package" size={28} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2" style={{ color: 'var(--shopli-navy)' }}>
            {isProduct ? t.title : t.page}
          </h1>
          {isProduct && (
            <p className="text-sm sm:text-base mb-6" style={{ color: 'var(--shopli-warm-gray)' }}>
              {t.product}
            </p>
          )}
          <form
            action={`/${region}/search`}
            method="get"
            className="flex gap-2 mb-2"
            role="search"
            aria-label={t.search}
          >
            <input
              name="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.placeholder}
              className="flex-1 rounded-xl border px-4 py-3 text-base"
              style={{ borderColor: 'oklch(88% 0.01 80)' }}
            />
            <button type="submit" className="btn-primary px-5" aria-label={t.search}>
              <Icon name="search" size={18} />
            </button>
          </form>
        </section>

        <section className="mt-10" aria-labelledby="live-deals">
          <div className="flex items-end justify-between mb-4">
            <h2 id="live-deals" className="text-lg sm:text-xl font-bold" style={{ color: 'var(--shopli-navy)' }}>
              {t.live}
            </h2>
            <a href={`/${region}`} className="text-sm font-semibold" style={{ color: 'var(--shopli-orange)' }}>
              {t.home} {rtl ? '←' : '→'}
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {(picks ?? Array.from({ length: 8 }, () => null)).map((p, i) =>
              p ? (
                <a
                  key={p.productId}
                  href={`/${region}/product/${p.productId}`}
                  className="group block rounded-2xl overflow-hidden bg-white border transition hover:shadow-md"
                  style={{ borderColor: 'oklch(92% 0.01 80)' }}
                >
                  <div className="aspect-square bg-gray-50 overflow-hidden">
                    {p.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        {...productImage(p.imageUrl, 300)}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm leading-snug line-clamp-2 mb-1" style={{ color: 'var(--shopli-navy)' }}>
                      {p.title}
                    </p>
                    <p className="font-bold" style={{ color: 'var(--shopli-orange)' }}>
                      {fmt(p.price)}
                    </p>
                  </div>
                </a>
              ) : (
                <div key={i} className="rounded-2xl bg-gray-100 animate-pulse aspect-[3/4]" aria-hidden />
              )
            )}
          </div>
          {picks && picks.length === 0 && (
            <p className="text-center mt-6">
              <a href={`/${region}`} className="btn-primary inline-block">
                {t.home}
              </a>
            </p>
          )}
        </section>
      </main>
    </>
  );
}
