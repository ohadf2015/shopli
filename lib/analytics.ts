// PostHog analytics — EU project 151059 (shared across products, split by $host).
// The snippet itself is injected in pages/_document.tsx; this module provides
// the typed capture helpers + a delegated click tracker for affiliate CTAs.
//
// Conversion events (trackConversion: PostHog, GA4 and the Growth Radar `growth:` twin):
//   affiliate_click { product, product_id, category, price, currency, region, placement, link_host }
//   telegram_click / whatsapp_click { link_host, region }
//   deal_alerts_signup_completed { form, source }
//   wishlist_alerts_signup_completed { form, region, items_count }
// Every one also carries page, page_title, referrer_host and utm_*.

export const POSTHOG_KEY = 'phc_m3X2YeaZ89r7m8yQYXfc6afyrygXmJG7TegJco5H9skD';
export const POSTHOG_HOST = 'https://eu.i.posthog.com';

declare global {
  interface Window {
    posthog?: {
      capture: (event: string, properties?: Record<string, unknown>) => void;
      init?: (key: string, opts: Record<string, unknown>) => void;
    };
    gr?: { capture: (event: string, properties?: Record<string, unknown>) => void };
    gtag?: (...args: unknown[]) => void;
  }
}

const PII_KEYS = new Set(['name', 'full_name', 'first_name', 'last_name', 'email', 'e-mail', 'mail', 'phone', 'tel', 'mobile', 'note', 'message', 'url', 'href']);

type AnalyticsWindow = Pick<Window, 'posthog' | 'gr' | 'gtag'> & {
  location?: { pathname?: string; search?: string; hostname?: string };
  document?: { title?: string; referrer?: string };
};

export function stripPii(props: Record<string, unknown>): Record<string, unknown> {
  const safe: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (!PII_KEYS.has(key.toLowerCase()) && value !== undefined && value !== '') safe[key] = value;
  }
  return safe;
}

export function pageContext(w: AnalyticsWindow): Record<string, string> {
  const ctx: Record<string, string> = {};
  try {
    const loc = w.location || {};
    if (loc.pathname) ctx.page = loc.pathname;
    const qs = new URLSearchParams(loc.search || '');
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
      const v = qs.get(k);
      if (v) ctx[k] = v;
    }
    if (w.document?.title) ctx.page_title = String(w.document.title).slice(0, 120);
    if (w.document?.referrer) {
      const host = new URL(w.document.referrer).hostname;
      if (host && host !== loc.hostname) ctx.referrer_host = host;
    }
  } catch {
    /* context is best-effort */
  }
  return ctx;
}

/** One specific conversion event, same name in PostHog, GA4 and Growth Radar (`growth:<event>`). Never throws. */
export function trackConversion(event: string, props: Record<string, unknown> = {}, win?: AnalyticsWindow) {
  const w = win ?? (typeof window !== 'undefined' ? window : undefined);
  if (!w) return;
  const safe = stripPii({ ...pageContext(w), ...props });
  try { w.posthog?.capture?.(event, safe); } catch { /* analytics must never break the page */ }
  try { if (typeof w.gtag === 'function') w.gtag('event', event, safe); } catch { /* analytics must never break the page */ }
  try { w.gr?.capture?.(`growth:${event}`, safe); } catch { /* analytics must never break the page */ }
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

// ------------------------------------------------------------------
// Discovery surfaces (trending rail/page, PDP find-similar) — spec: t_a5202144
// Never send PII, affiliate tokens, or full outbound URLs.
// ------------------------------------------------------------------

export type TrendingSurface = 'home_rail' | 'trending_page';

/** Fire once per surface per session when the rail/page is ≥50% visible. */
export function trackTrendingView(props: {
  region: string;
  locale: string;
  surface: TrendingSurface;
  product_ids: string[];
  result_count: number;
  score_version: string;
}) {
  const key = `trending_view:${props.surface}:${props.region}`;
  try {
    if (typeof window !== 'undefined' && window.sessionStorage?.getItem(key)) return;
    window.sessionStorage?.setItem(key, '1');
  } catch {
    /* storage blocked — still fire once per page load */
  }
  capture('trending_view', { ...props, experiment: 'trending_launch_v1', variant: 'rail' });
}

export function trackTrendingClick(props: {
  region: string;
  surface: TrendingSurface;
  product_id: string;
  rank: number;
  trend_score: number;
  trend_reason: string;
  click_target: 'pdp' | 'outbound' | 'compare' | 'share';
  price: number;
  currency: string;
  discount_pct: number;
  score_version: string;
}) {
  capture('trending_click', props);
}

export function trackFindSimilarClick(props: {
  region: string;
  surface: 'pdp';
  source_product_id: string;
  source_category: string;
  source_price: number;
  currency: string;
  result_count: number;
  algorithm_version: string;
}) {
  capture('find_similar_click', props);
}

export function trackFindSimilarView(props: {
  region: string;
  surface: 'pdp';
  source_product_id: string;
  product_ids: string[];
  result_count: number;
  algorithm_version: string;
}) {
  capture('find_similar_view', props);
}

export function trackSimilarProductClick(props: {
  region: string;
  surface: 'pdp';
  source_product_id: string;
  product_id: string;
  rank: number;
  similarity_score: number;
  algorithm_version: string;
}) {
  capture('similar_product_click', props);
}

export function trackFindSimilarError(props: {
  region: string;
  source_product_id: string;
  error: string;
}) {
  capture('find_similar_error', props);
}

// ------------------------------------------------------------------
// Share bar (mood / collection / compare / blog / PDP) — spec: t_281f2ede
// One-tap WhatsApp/Telegram/native sharing is the only realistic growth
// loop at current traffic, so every share tap is measured.
// ------------------------------------------------------------------

export type SharePageType = 'mood' | 'collection' | 'compare' | 'blog' | 'product';
export type ShareNetwork = 'whatsapp' | 'telegram' | 'native';

export function trackShareClick(props: {
  page_type: SharePageType;
  network: ShareNetwork;
  region?: string;
}) {
  capture('share_click', props);
}

// ------------------------------------------------------------------
// Compare-page next actions — spec: t_3315f1df
// /xx/compare bounces 97-99%; every internal next-action click (PDP, search,
// trending, deals) is the conversion signal that the new CTAs work.
// ------------------------------------------------------------------

export function trackCompareNextAction(props: {
  region: string;
  surface: 'compare_tool' | 'compare_article';
  target: 'pdp' | 'best_pick' | 'search' | 'trending' | 'deals' | 'article';
  product_id?: string;
}) {
  capture('compare_next_action', props);
}

const AFFILIATE_HOST_RE = /(^|\.)aliexpress\.com$|(^|\.)s\.click\.aliexpress\.com$/;

function isAffiliateUrl(url: URL): boolean {
  return AFFILIATE_HOST_RE.test(url.hostname) || url.hostname.endsWith('.aliexpress.com');
}

function regionFromPath(path: string): string | undefined {
  const m = path.match(/^\/([a-z]{2})(?:\/|$)/);
  return m?.[1];
}

function numericPrice(raw: string | undefined | null): number | undefined {
  if (raw == null || raw === '') return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * Installs ONE delegated click listener on document that fires:
 *  - affiliate_click for any anchor pointing at AliExpress (incl. s.click short links)
 *  - telegram_click / whatsapp_click for Telegram / WhatsApp links
 * Product metadata is read from data-* attributes on the closest `[data-product-id]`
 * / `.product-card` ancestor (rendered by components/ProductCard.tsx) or the anchor
 * itself, so direct affiliate CTAs on compare/mood/PDP pages are all tracked.
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
      const baseProps = {
        product: attr(card, 'data-product-title'),
        product_id: attr(card, 'data-product-id'),
        category: attr(card, 'data-category'),
        price: numericPrice(attr(card, 'data-price')),
        currency: attr(card, 'data-currency'),
        region: attr(card, 'data-region') || regionFromPath(page),
        // Which outbound button was used (e.g. collection_glance), when it says.
        placement: anchor.getAttribute('data-cta') || undefined,
        page,
        link_host: url.hostname,
      };
      trackConversion('affiliate_click', baseProps);
      if (card?.getAttribute('data-trending-hub') === 'true') {
        capture('trending_hub_click', baseProps);
      }
      return;
    }

    if (url.hostname === 't.me' || url.hostname === 'telegram.me') {
      trackConversion('telegram_click', { link_host: url.hostname, region: regionFromPath(page) });
    } else if (url.hostname === 'wa.me' || url.hostname.endsWith('.whatsapp.com')) {
      trackConversion('whatsapp_click', { link_host: url.hostname, region: regionFromPath(page) });
    }
  };

  // capture phase so we fire before any navigation/other handlers
  document.addEventListener('click', onClick, true);
  return () => document.removeEventListener('click', onClick, true);
}
