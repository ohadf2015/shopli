// PostHog analytics — EU project 151059 (shared across products, split by $host).
// The snippet itself is injected in pages/_document.tsx; this module provides
// the typed capture helpers + a delegated click tracker for affiliate CTAs.
//
// Event schema (matches the old smart-shopping-il instrumentation):
//   affiliate_click { product, product_id, category, price, currency, page, url, region? }
//   outbound_click  { target, page, url }   (telegram / whatsapp)

export const POSTHOG_KEY = 'phc_m3X2YeaZ89r7m8yQYXfc6afyrygXmJG7TegJco5H9skD';
export const POSTHOG_HOST = 'https://eu.i.posthog.com';

declare global {
  interface Window {
    posthog?: {
      capture: (event: string, properties?: Record<string, unknown>) => void;
      init?: (key: string, opts: Record<string, unknown>) => void;
    };
  }
}

function capture(event: string, properties: Record<string, unknown>) {
  try {
    if (typeof window !== 'undefined' && window.posthog?.capture) {
      window.posthog.capture(event, properties);
    }
  } catch {
    /* analytics must never break the page */
  }
}

const AFFILIATE_HOST_RE = /(^|\.)aliexpress\.com$|(^|\.)s\.click\.aliexpress\.com$/;

function isAffiliateUrl(url: URL): boolean {
  return AFFILIATE_HOST_RE.test(url.hostname) || url.hostname.endsWith('.aliexpress.com');
}

/**
 * Installs ONE delegated click listener on document that fires:
 *  - affiliate_click for any anchor pointing at AliExpress (incl. s.click short links)
 *  - outbound_click for Telegram / WhatsApp links
 * Product metadata is read from data-* attributes on the closest `.product-card`
 * (rendered by components/ProductCard.tsx) or the anchor itself.
 * Returns an uninstall function.
 */
export function installClickTracking(): () => void {
  const onClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    const anchor = target?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!anchor) return;

    let url: URL;
    try {
      url = new URL(anchor.href, window.location.origin);
    } catch {
      return;
    }

    const page = window.location.pathname;

    if (isAffiliateUrl(url)) {
      const card = anchor.closest('[data-product-id], .product-card') as HTMLElement | null;
      const attr = (el: HTMLElement | null, name: string) =>
        el?.getAttribute(name) || anchor.getAttribute(name) || undefined;
      capture('affiliate_click', {
        product: attr(card, 'data-product-title'),
        product_id: attr(card, 'data-product-id'),
        category: attr(card, 'data-category'),
        price: attr(card, 'data-price'),
        currency: attr(card, 'data-currency'),
        page,
        url: anchor.href,
      });
      return;
    }

    if (url.hostname === 't.me' || url.hostname === 'telegram.me') {
      capture('outbound_click', { target: 'telegram', page, url: anchor.href });
    } else if (url.hostname === 'wa.me' || url.hostname.endsWith('.whatsapp.com')) {
      capture('outbound_click', { target: 'whatsapp', page, url: anchor.href });
    }
  };

  // capture phase so we fire before any navigation/other handlers
  document.addEventListener('click', onClick, true);
  return () => document.removeEventListener('click', onClick, true);
}
