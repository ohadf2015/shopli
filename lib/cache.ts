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
  res.setHeader('Cache-Control', hasContent ? value : 'public, s-maxage=0, must-revalidate');
}
