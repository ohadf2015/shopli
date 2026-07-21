import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState, useCallback, useEffect } from 'react';
import Header from '../../components/Header';
import Icon from '../../components/icons';
import SeoHead from '../../components/SeoHead';
import { getRegion, RegionCode } from '../../lib/regions';
import { breadcrumbJsonLd, SITE_URL } from '../../lib/seo';
import {
  fetchProductsByIds,
  extractSpecs,
  getDifferences,
  findBestIndex,
  productGroupJsonLd,
  ComparableProduct,
} from '../../lib/product-compare';
import type { Product } from '../../lib/types';
import type { RegionConfig } from '../../lib/regions';

interface ComparePageProps {
  region: RegionCode;
  config: RegionConfig;
  products: Product[];
  productIds: string[];
  rtl: boolean;
  error: string | null;
}

export default function ComparePage({
  region,
  config,
  products,
  productIds,
  rtl,
  error: serverError,
}: ComparePageProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searching, setSearching] = useState(false);

  const lang = config?.lang || 'en';
  const currencySymbol = config?.currencySymbol || '€';

  // Build comparable products
  const comparableProducts: ComparableProduct[] = products.map((p) => ({
    product: p,
    specs: extractSpecs(p, currencySymbol),
  }));

  const diffKeys = getDifferences(comparableProducts);

  const pageUrl = `${SITE_URL}/${region}/compare?products=${productIds.join(',')}`;
  const title =
    products.length > 0
      ? `Compare: ${products.map((p) => p.title).slice(0, 3).join(' vs ')} | Shopli`
      : 'Product Comparison | Shopli';
  const description =
    products.length > 0
      ? `Compare ${products.map((p) => p.title).slice(0, 3).join(', ')} — side-by-side specs, prices, ratings, and more.`
      : 'Compare products side-by-side to find the best deal.';

  // Structured data
  const structuredData: Record<string, unknown>[] = [
    breadcrumbJsonLd([
      { name: rtl ? 'דף הבית' : 'Home', url: `${SITE_URL}/${region}` },
      { name: rtl ? 'השוואת מוצרים' : 'Product Comparison', url: pageUrl },
    ]),
  ];

  if (products.length > 0) {
    structuredData.push(
      productGroupJsonLd(products, region, pageUrl, config?.currency || 'EUR')
    );
  }

  // Copy shareable URL
  const handleCopyUrl = useCallback(() => {
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [pageUrl]);

  // Remove a product from comparison
  const handleRemove = useCallback(
    (id: string) => {
      const newIds = productIds.filter((pid) => pid !== id);
      if (newIds.length === 0) {
        router.push(`/${region}/compare`);
      } else {
        router.push(`/${region}/compare?products=${newIds.join(',')}`);
      }
    },
    [productIds, region, router]
  );

  // Add a product to comparison
  const handleAdd = useCallback(
    (id: string) => {
      const newIds = [...productIds, id];
      router.push(`/${region}/compare?products=${newIds.join(',')}`);
      setSearchQuery('');
      setSearchResults([]);
    },
    [productIds, region, router]
  );

  // Search for products
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `${SITE_URL}/api/products/search?q=${encodeURIComponent(searchQuery)}&region=${region}&limit=6`
      );
      const data = await res.json();
      if (data.success && data.products) {
        // Filter out already-compared products
        const existingIds = new Set(products.map((p) => p.id));
        setSearchResults(
          data.products.filter((p: any) => !existingIds.has(p.id))
        );
      }
    } catch {
      setSearchResults([]);
    }
    setSearching(false);
  }, [searchQuery, region, products]);

  // Rating display
  const renderStars = (rating: number) => {
    const stars = rating > 0 ? Math.round(rating / 20) : 0;
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
  };

  const renderSpecValue = (cp: ComparableProduct, key: string) => {
    const spec = cp.specs.find((s) => s.key === key);
    if (!spec) return <span className="text-gray-300">—</span>;

    switch (spec.type) {
      case 'boolean':
        return (
          <span className={spec.value === true ? 'text-green-600' : 'text-red-400'}>
            {spec.formatted}
          </span>
        );
      case 'rating':
        return (
          <span className="text-yellow-600 font-medium">
            {renderStars(typeof spec.value === 'number' ? spec.value : 0)}{' '}
            {spec.formatted}
          </span>
        );
      case 'price':
        return (
          <span className="font-bold" style={{ color: 'var(--shopli-teal)' }}>
            {spec.formatted}
          </span>
        );
      case 'tags':
        return (
          <div className="flex flex-wrap gap-1">
            {(Array.isArray(spec.value) ? spec.value : []).slice(0, 4).map((tag, i) => (
              <span
                key={i}
                className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        );
      default:
        return <span className="text-gray-800">{spec.formatted}</span>;
    }
  };

  return (
    <>
      <SeoHead
        region={region as RegionCode}
        path={`/compare?products=${productIds.join(',')}`}
        title={title}
        description={description}
        ogType="website"
        jsonLd={structuredData}
      />
      <Header currentRegion={region} dir={config?.direction} />

      <main
        className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16"
        dir={config?.direction}
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs mb-6" style={{ color: 'var(--shopli-warm-gray)' }}>
          <a href={`/${region}`}>{rtl ? 'דף הבית' : 'Home'}</a>
          <span>/</span>
          <span style={{ color: 'var(--shopli-navy)' }}>
            {rtl ? 'השוואת מוצרים' : 'Product Comparison'}
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: 'var(--shopli-navy)' }}>
              {rtl ? 'השוואת מוצרים' : 'Product Comparison'}
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--shopli-warm-gray)' }}>
              {products.length > 0
                ? rtl
                  ? `משווים ${products.length} מוצרים`
                  : `Comparing ${products.length} products`
                : rtl
                  ? 'בחרו מוצרים להשוואה'
                  : 'Select products to compare'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyUrl}
              className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2"
              style={{ color: 'var(--shopli-navy)' }}
            >
              <Icon name="share" size={14} />
              {copied
                ? (rtl ? 'הועתק!' : 'Copied!')
                : (rtl ? 'העתק קישור' : 'Copy Link')}
            </button>
          </div>
        </div>

        {/* Error state */}
        {serverError && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-6 mb-8 text-center">
            <p className="text-red-700 text-sm">{serverError}</p>
          </div>
        )}

        {/* Empty state — search for products */}
        {products.length === 0 && !serverError && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--shopli-navy)' }}>
              {rtl ? 'בחרו מוצרים להשוואה' : 'Choose Products to Compare'}
            </h2>
            <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: 'var(--shopli-warm-gray)' }}>
              {rtl
                ? 'חפשו מוצרים ולחצו להוספה להשוואה. או השתמשו בקישור עם פרמטר products='
                : 'Search for products and add them to the comparison. Or use a URL with products= parameter.'}
            </p>

            <div className="max-w-md mx-auto">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder={rtl ? 'חפשו מוצר...' : 'Search products...'}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <button
                  onClick={handleSearch}
                  disabled={searching || !searchQuery.trim()}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40"
                  style={{ background: 'var(--shopli-teal)' }}
                >
                  {searching ? '...' : (rtl ? 'חפש' : 'Search')}
                </button>
              </div>
            </div>

            {/* Example quick-add links */}
            <div className="mt-6">
              <p className="text-xs font-medium mb-3" style={{ color: 'var(--shopli-warm-gray)' }}>
                {rtl ? 'או נסו דוגמאות:' : 'Or try examples:'}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { ids: 'e1,e2,e6', label: 'Gadgets' },
                  { ids: 'e3,e4', label: 'Home & Tools' },
                  { ids: 'e5,e2', label: 'Electronics' },
                  { ids: 'f1,f2,f3', label: 'מוצרים בעברית' },
                ].map((ex) => (
                  <a
                    key={ex.ids}
                    href={`/${region}/compare?products=${ex.ids}`}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-orange-200 transition-colors"
                    style={{ color: 'var(--shopli-navy)' }}
                  >
                    {ex.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Comparison Table */}
        {products.length > 0 && (
          <>
            {/* Product cards row */}
            <div className="grid gap-4 mb-8" style={{
              gridTemplateColumns: `160px repeat(${products.length}, 1fr)`,
            }}>
              {/* Label column */}
              <div className="hidden sm:block" />

              {/* Product cards */}
              {products.map((product, idx) => {
                const cp = comparableProducts[idx];
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group relative"
                  >
                    {/* Remove button */}
                    <button
                      onClick={() => handleRemove(product.id)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:border-red-200 z-10"
                      title={rtl ? 'הסר' : 'Remove'}
                    >
                      <Icon name="close" size={12} />
                    </button>

                    {/* Image */}
                    <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <div className="text-gray-300">
                          <Icon name="package" size={40} />
                        </div>
                      )}
                    </div>

                    {/* Affiliate link */}
                    <div className="p-3">
                      <h3 className="text-xs font-semibold leading-tight line-clamp-2 mb-2 min-h-[2em]" style={{ color: 'var(--shopli-navy)' }}>
                        {product.title}
                      </h3>
                      <a
                        href={product.affiliateLink}
                        target="_blank"
                        rel="nofollow sponsored"
                        className="block w-full text-center py-1.5 rounded-lg text-[11px] font-semibold text-white transition-colors hover:opacity-90"
                        style={{ background: 'var(--shopli-orange)' }}
                      >
                        {rtl ? 'קנה עכשיו' : 'Buy Now'}
                      </a>
                    </div>
                  </div>
                );
              })}

              {/* Add product button */}
              {products.length < 6 && (
                <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center min-h-[200px] group hover:border-orange-300 hover:bg-orange-50/20 transition-colors">
                  <div className="text-center p-4">
                    <div className="text-2xl mb-2 text-gray-300 group-hover:text-orange-400 transition-colors">+</div>
                    <p className="text-xs font-medium" style={{ color: 'var(--shopli-warm-gray)' }}>
                      {rtl ? 'הוסף מוצר' : 'Add Product'}
                    </p>

                    {/* Mini search */}
                    <div className="mt-3">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSearch();
                        }}
                        placeholder={rtl ? 'חפש...' : 'Search...'}
                        className="w-full px-2 py-1.5 text-[11px] rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-300"
                      />
                      {searchResults.length > 0 && (
                        <div className="mt-2 bg-white border border-gray-100 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                          {searchResults.slice(0, 5).map((p) => (
                            <button
                              key={p.id}
                              onClick={() => handleAdd(p.id)}
                              className="w-full text-left px-2 py-1.5 text-[11px] hover:bg-orange-50 transition-colors flex items-center gap-2"
                            >
                              {p.imageUrl ? (
                                <img src={p.imageUrl} alt="" className="w-6 h-6 object-contain rounded" />
                              ) : (
                                <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-gray-300">
                                  <Icon name="package" size={10} />
                                </div>
                              )}
                              <span className="truncate flex-1">{p.title}</span>
                              <span className="font-bold shrink-0" style={{ color: 'var(--shopli-teal)' }}>
                                {currencySymbol}{p.price.toFixed(2)}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                      {searching && (
                        <p className="text-[10px] mt-1 text-gray-400">{rtl ? 'מחפש...' : 'Searching...'}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Specs table */}
            {comparableProducts.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--shopli-warm-gray)', width: 160 }}>
                          {rtl ? 'מאפיין' : 'Specification'}
                        </th>
                        {products.map((p, idx) => (
                          <th key={p.id} className="text-center py-3 px-4 font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--shopli-navy)' }}>
                            {rtl ? `מוצר ${idx + 1}` : `Product ${idx + 1}`}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparableProducts[0].specs.map((spec) => {
                        const isDifferent = diffKeys.has(spec.key);
                        const bestIdx = findBestIndex(comparableProducts, spec.key);

                        return (
                          <tr
                            key={spec.key}
                            className={`border-b border-gray-50 transition-colors ${
                              isDifferent ? 'bg-amber-50/30' : ''
                            } hover:bg-gray-50/50`}
                          >
                            <td className="py-3 px-4 font-medium text-xs" style={{ color: 'var(--shopli-navy)' }}>
                              <div className="flex items-center gap-2">
                                {spec.label}
                                {isDifferent && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">
                                    {rtl ? 'שונה' : 'Diff'}
                                  </span>
                                )}
                              </div>
                            </td>
                            {products.map((p, idx) => {
                              const isBest = isDifferent && idx === bestIdx;
                              return (
                                <td
                                  key={p.id}
                                  className={`py-3 px-4 text-center text-xs relative ${
                                    isBest ? 'bg-green-50' : ''
                                  }`}
                                >
                                  {isBest && (
                                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-green-500 text-white whitespace-nowrap">
                                      {rtl ? 'הכי טוב' : 'BEST'}
                                    </span>
                                  )}
                                  <div className={isBest ? 'pt-3' : ''}>
                                    {renderSpecValue(comparableProducts[idx], spec.key)}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Share section */}
            <section className="mt-8 py-6 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-sm font-medium" style={{ color: 'var(--shopli-warm-gray)' }}>
                  {rtl ? 'שתפו את ההשוואה עם חברים' : 'Share this comparison with friends'}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyUrl}
                    className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    style={{ color: 'var(--shopli-navy)' }}
                  >
                    <Icon name="share" size={14} />
                    {copied ? (rtl ? '✓ הועתק!' : '✓ Copied!') : (rtl ? 'העתק קישור להשוואה' : 'Copy Comparison Link')}
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {/* How to use section */}
        {products.length === 0 && (
          <section className="mt-8">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--shopli-navy)' }}>
                {rtl ? 'איך זה עובד' : 'How It Works'}
              </h3>
              <ul className="space-y-2 text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">1.</span>
                  {rtl
                    ? 'חפשו מוצרים ולחצו להוספה להשוואה'
                    : 'Search for products and add them to the comparison'}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">2.</span>
                  {rtl
                    ? 'השוו מחירים, דירוגים, ומאפיינים side-by-side'
                    : 'Compare prices, ratings, and specs side-by-side'}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">3.</span>
                  {rtl
                    ? 'שתפו את ההשוואה עם קישור ייחודי'
                    : 'Share the comparison with a unique URL'}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">4.</span>
                  {rtl
                    ? 'לחצו "קנה עכשיו" כדי לרכוש במחיר הטוב ביותר'
                    : 'Click "Buy Now" to purchase at the best price'}
                </li>
              </ul>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
          <div className="font-semibold" style={{ color: 'var(--shopli-navy)' }}>shopli</div>
          <div>&copy; {new Date().getFullYear()} {rtl ? 'כל הזכויות שמורות' : 'All rights reserved.'}</div>
        </div>
      </footer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, query, res }) => {
  try {
    const region = (params?.region as string) || 'eu';
    const config = getRegion(region);
    const rtl = config.direction === 'rtl';

    // Parse product IDs from query string
    const productsParam = (query?.products as string) || '';
    const productIds = productsParam
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);

    let products: Product[] = [];
    let error: string | null = null;

    if (productIds.length > 0) {
      products = await fetchProductsByIds(region, productIds);

      if (products.length === 0) {
        error = `No products found for IDs: ${productIds.join(', ')}`;
      } else if (products.length < productIds.length) {
        const found = new Set(products.map((p) => p.id));
        const missing = productIds.filter((id) => !found.has(id));
        error = `Could not find some products: ${missing.join(', ')}`;
      }
    }

    // Cache for 5 minutes
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

    return {
      props: {
        region,
        config,
        products,
        productIds,
        rtl,
        error,
      },
    };
  } catch (e: any) {
    return {
      props: {
        region: 'eu',
        config: getRegion('eu'),
        products: [],
        productIds: [],
        rtl: false,
        error: e?.message || 'Failed to load comparison',
      },
    };
  }
};