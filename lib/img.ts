/**
 * Responsive images without Vercel's image-optimization quota.
 *
 * Product photos come from Alibaba's media CDN (ae-pic-*.aliexpress-media.com,
 * ae0*.alicdn.com), which has its own resizer: appending `_640x640.jpg_.avif`
 * to the object key returns a resized AVIF. Measured on a real product photo:
 * 800x800 webp original 42,470 B -> `_200x200.jpg_.avif` 3,439 B (-92%).
 *
 * next/image would route every one of these through Vercel's optimizer, which
 * is metered per source image; this site renders thousands of distinct product
 * photos across ~1,500 pages, so that bill/quota is the thing to avoid.
 *
 * ponytail: URL transform only. If we ever self-host product photos, swap this
 * for next/image — the call sites already pass width/height.
 */

/**
 * Widths the CDN actually honors. Asking for an unlisted width (e.g. 320) is a
 * no-op and silently returns the full-size original, so only emit these.
 */
const CDN_WIDTHS = [120, 200, 220, 400, 480, 640, 800] as const;

const CDN_HOSTS = /(^|\.)(alicdn\.com|aliexpress-media\.com)$/i;

function isCdnImage(url: string): boolean {
  if (!url) return false;
  try {
    return CDN_HOSTS.test(new URL(url).hostname);
  } catch {
    return false;
  }
}

/** Strip any transform suffix a previous call (or the API) already appended. */
function baseUrl(url: string): string {
  return url.replace(/(\.(?:jpg|jpeg|png|webp|avif))_.*$/i, '$1');
}

function nearestWidth(width: number): number {
  return CDN_WIDTHS.find((w) => w >= width) ?? CDN_WIDTHS[CDN_WIDTHS.length - 1];
}

/** One resized AVIF variant. Returns the URL unchanged for non-CDN images. */
export function cdnImage(url: string, width: number): string {
  if (!isCdnImage(url)) return url;
  const w = nearestWidth(width);
  return `${baseUrl(url)}_${w}x${w}.jpg_.avif`;
}

/**
 * Props for a product `<img>`: AVIF srcset at the CDN widths that bracket the
 * rendered size, plus intrinsic width/height so the browser reserves the box
 * (these cards are square) instead of shifting layout in.
 *
 * @param displayWidth CSS pixels the image occupies at its largest breakpoint.
 * @param sizes        `sizes` attribute; defaults to a fixed `displayWidth`.
 */
export function productImage(url: string, displayWidth: number, sizes?: string) {
  const width = nearestWidth(displayWidth);
  const common = { width, height: width, loading: 'lazy' as const, decoding: 'async' as const };

  if (!isCdnImage(url)) return { src: url, ...common };

  // 1x and 2x — enough for retina without shipping a monster srcset.
  const retina = nearestWidth(width * 2);
  const srcSet =
    retina > width
      ? `${cdnImage(url, width)} 1x, ${cdnImage(url, retina)} 2x`
      : `${cdnImage(url, width)} 1x`;

  return { src: cdnImage(url, width), srcSet, sizes, ...common };
}
