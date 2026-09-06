/**
 * Product-URL parser + duty-waiver band copy for /landed
 * (paste Amazon / AliExpress / any URL → IL quote).
 * Provenance only — no live scraping. Quote math stays in lib/landed-cost.ts (#14/#18/#19/#20).
 */

import {
  DUTY_FREE_THRESHOLD_USD,
  DUTY_WAIVER_CEILING_USD,
  IL_VAT_RATE,
  BOI_CUSTOMS_FX_UPLIFT,
} from './landed-cost';

export type LandedUrlSource = 'amazon' | 'aliexpress' | 'other';

export interface ParsedProductUrl {
  host: string;
  source: LandedUrlSource;
  productId?: string;
  canonicalUrl?: string;
}

/** Personal-import band for goods value (USD). Matches estimator: under $75 = ptur. */
export type DutyWaiverBand = 'ptur' | 'vat-only' | 'full';

export interface DutyWaiverBandRow {
  id: DutyWaiverBand;
  /** Inclusive lower bound (USD goods). null = open floor. */
  fromUsd: number | null;
  /** Exclusive upper bound (USD goods). null = open ceiling. */
  toUsd: number | null;
  titleHe: string;
  detailHe: string;
}

const AMAZON_HOST =
  /(?:^|\.)amazon\.(?:com|co\.uk|de|fr|it|es|ca|com\.au|co\.jp|in|com\.mx|com\.br|nl|se|pl|com\.be|ae|sa|sg|com\.tr)(?:$|:)/i;
const ALIEXPRESS_HOST = /(?:^|\.)aliexpress\.(?:com|us|ru)(?:$|:)/i;

/** Amazon ASIN: 10 chars, starts with B0… or alphanumeric ISBN-like. */
const ASIN_RE = /(?:\/(?:dp|gp\/product|gp\/aw\/d|product)\/)([A-Z0-9]{10})(?:[/?]|$)/i;
/** AliExpress item id in /item/{id}.html or /i/{id}.html */
const AE_ITEM_RE = /\/(?:item|i)\/(\d{6,})(?:\.html)?/i;

function normalizeUrl(raw: string): URL | null {
  const trimmed = (raw || '').trim();
  if (!trimmed) return null;
  try {
    let candidate = trimmed;
    if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
      // Explicit scheme — only http(s); never rewrite ftp/etc into https://ftp://…
      if (!/^https?:\/\//i.test(trimmed)) return null;
    } else {
      candidate = `https://${trimmed}`;
    }
    const u = new URL(candidate);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    if (!u.hostname || !u.hostname.includes('.')) return null;
    return u;
  } catch {
    return null;
  }
}

function classifyHost(host: string): LandedUrlSource {
  const h = host.toLowerCase();
  if (AMAZON_HOST.test(h)) return 'amazon';
  if (ALIEXPRESS_HOST.test(h)) return 'aliexpress';
  return 'other';
}

/**
 * Parse a pasted product URL for /landed provenance.
 * Returns null for empty / unparseable input (never invents a quote).
 */
export function parseProductUrl(raw: string): ParsedProductUrl | null {
  const u = normalizeUrl(raw);
  if (!u) return null;

  const host = u.hostname.replace(/^www\./i, '').toLowerCase();
  const source = classifyHost(host);
  const pathAndQuery = `${u.pathname}${u.search}`;

  let productId: string | undefined;
  if (source === 'amazon') {
    const m = pathAndQuery.match(ASIN_RE);
    if (m) productId = m[1].toUpperCase();
  } else if (source === 'aliexpress') {
    const m = pathAndQuery.match(AE_ITEM_RE);
    if (m) productId = m[1];
  }

  let canonicalUrl: string | undefined;
  if (source === 'amazon' && productId) {
    canonicalUrl = `https://${host}/dp/${productId}`;
  } else if (source === 'aliexpress' && productId) {
    canonicalUrl = `https://${host}/item/${productId}.html`;
  } else {
    canonicalUrl = `${u.protocol}//${u.host}${u.pathname}`.replace(/\/$/, '') || undefined;
  }

  return { host, source, productId, canonicalUrl };
}

/**
 * Classify goods USD value into personal-import bands (Skills IL v1.4.0).
 * Aligns with estimator: under $75 = ptur; $75–<$500 = VAT-only duty waiver.
 * Does not change estimator math (#18/#19/#20).
 */
export function classifyDutyWaiverBand(usdGoods: number): DutyWaiverBand | null {
  const n = Number(usdGoods);
  if (!Number.isFinite(n) || n <= 0) return null;
  if (n < DUTY_FREE_THRESHOLD_USD) return 'ptur';
  if (n < DUTY_WAIVER_CEILING_USD) return 'vat-only';
  return 'full';
}

/**
 * Static band rows for /landed (ptur + VAT-only duty waiver + above-$500 note).
 * Copy only — estimator still omits HS duty / purchase tax above $500.
 */
export function dutyWaiverBandRows(): DutyWaiverBandRow[] {
  const vatPct = Math.round(IL_VAT_RATE * 100);
  const fxPct = (BOI_CUSTOMS_FX_UPLIFT * 100).toFixed(1);
  const ptur = DUTY_FREE_THRESHOLD_USD;
  const ceiling = DUTY_WAIVER_CEILING_USD;
  return [
    {
      id: 'ptur',
      fromUsd: null,
      toUsd: ptur,
      titleHe: `מתחת ל-$${ptur} · פטור מלא (פטור)`,
      detailHe:
        'פטור ממכס וממע״ם על ערך הסחורה בלבד (משלוח לא נספר לתקרה). יבוא אישי רגיל.',
    },
    {
      id: 'vat-only',
      fromUsd: ptur,
      toUsd: ceiling,
      titleHe: `$${ptur}–$${ceiling} · מע״ם בלבד (ויתור מכס)`,
      detailHe:
        `מכס נדחה (duty waiver); משלמים מע״ם ${vatPct}% על סחורה+משלוח. שער רשומון: יציג בנק ישראל + ${fxPct}%.`,
    },
    {
      id: 'full',
      fromUsd: ceiling,
      toUsd: null,
      titleHe: `מעל $${ceiling} · מכס אפשרי לפי HS`,
      detailHe:
        `מע״ם ${vatPct}% חל; מכס / מס קנייה לפי סיווג HS — לא ממודל במחשבון (הערכה שמרנית: מע״ם בלבד).`,
    },
  ];
}

/**
 * Hebrew customs-stamp copy for /landed (Skills IL v1.4.0 · Sep 6 foil).
 * Labels 18% VAT + BoI representative +0.5% — never 17%.
 * Does not change estimator math (#18/#19).
 */
export function customsStampCopyHe(): string {
  return (
    'חותמת מכס (Skills IL v1.4.0 · Sep 6): מע״ם 18% · שער יציג בנק ישראל + 0.5% לרשומון. ' +
    'פסים: פטור מתחת ל-$75 · $75–$500 מע״ם בלבד (ויתור מכס). ' +
    'יריבים (למשל iWishBag Amazon→IL) עדיין כותבים "17% VAT" בגוף העמוד בעוד שטבלת המכסים אצלם מציינת 18%.'
  );
}
