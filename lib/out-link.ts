const AE_HOST_RE = /(^|\.)aliexpress\.com$/;

export const GO_PATH = '/api/go';

function aliexpressUrl(raw: string | null | undefined): URL | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' && AE_HOST_RE.test(url.hostname) ? url : null;
  } catch {
    return null;
  }
}

/** Outbound AliExpress links go through our redirect so crawlers never reach the tracked link. */
export function outHref(link: string): string {
  return aliexpressUrl(link) ? `${GO_PATH}?u=${encodeURIComponent(link)}` : link;
}

/** The AliExpress URL a /api/go link points at, or null for anything else (no open redirect). */
export function goTarget(u: string | string[] | null | undefined): string | null {
  const url = aliexpressUrl(Array.isArray(u) ? u[0] : u);
  return url ? url.toString() : null;
}

const BOT_UA_RE =
  /bot|crawl|spider|slurp|headless|preview|scrap|fetch|monitor|lighthouse|pagespeed|facebookexternalhit|meta-external|python|curl|wget|httpclient|okhttp|axios|go-http|java\/|libwww|node|scrapy|phantom|puppeteer|playwright|selenium|bytespider|petalbot|ahrefs|semrush|mj12|dotbot|yandex|baidu|sogou|360spider|applebot/i;

export function isBotUserAgent(ua: string | undefined): boolean {
  return !ua || BOT_UA_RE.test(ua);
}
