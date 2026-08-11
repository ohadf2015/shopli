import type { ServerResponse } from 'http';

/**
 * Cache-Control for a page whose content comes from the AliExpress API.
 *
 * Every product page used to set its cache header unconditionally, so a single
 * rate-limited call (measured at ~10% — see `callApi` in lib/aliexpress.ts) froze
 * a product-less page at the CDN for as long as an hour. That is what made live
 * products render "Product not found", and what left collection and mood pages
 * looking empty to everyone who arrived during the window.
 *
 * An empty page is never worth caching: re-render it and the next visitor gets
 * the real thing.
 */
export function cacheIfNotEmpty(res: ServerResponse, hasContent: boolean, value: string): void {
  // 30s, not 0: during an API bad patch every request would otherwise re-render
  // and pay the retry backoff, which is a thundering herd at exactly the wrong
  // moment. Short enough that recovery is still seconds away.
  const cacheControl = hasContent ? value : 'public, s-maxage=30, must-revalidate';
  res.setHeader('Cache-Control', cacheControl);
  // On Vercel, Vercel-CDN-Cache-Control takes precedence for edge caching, so set it too.
  // This ensures empty responses cannot be long-cached even if a caller sets both headers.
  res.setHeader('Vercel-CDN-Cache-Control', cacheControl);
}
