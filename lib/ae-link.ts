/**
 * Pull an AliExpress product id out of whatever a shopper pastes into search:
 * a full item URL (any aliexpress.* host, any language subdomain), a mobile
 * "m." link, or a bare product id. Returns null for anything else, so ordinary
 * searches behave exactly as before.
 *
 * Short share links (a.aliexpress.com/_xxxx, s.click.aliexpress.com) carry no
 * id and would need a network round-trip to resolve, so they are left alone.
 */
export function aliexpressIdFromInput(input: string): string | null {
  const s = (input || '').trim();
  if (!s) return null;
  if (/^\d{10,20}$/.test(s)) return s;
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(s) ? s : `https://${s}`);
  } catch {
    return null;
  }
  if (!/(^|\.)aliexpress\.[a-z.]+$/i.test(url.hostname)) return null;
  const m = url.pathname.match(/\/item\/(?:[^/]*\D)?(\d{10,20})\.html/i);
  if (m) return m[1];
  const q = url.searchParams.get('productId') || url.searchParams.get('product_id');
  return q && /^\d{10,20}$/.test(q) ? q : null;
}
