/**
 * Responsive images without Vercel's image-optimization quota.
 *
 * Product photos come from Alibaba's media CDN (ae-pic-*.aliexpress-media.com,
 * ae0*.alicdn.com), which has its own resizer: appending `_640x640.jpg` to the
 * object key returns a resized copy. Measured on a real 800x800 product photo,
 * `_200x200.jpg` is 6,170 B against 125,446 B for the original (-95%).
 *
 * The CDN also content-negotiates the codec off the request's Accept header —
 * AVIF to browsers that advertise it, WebP to those that don't. So we do NOT
 * append the `_.avif` suffix: that pins the response to AVIF even for a client
 * that never offered it (verified: an `Accept: image/jpeg,image/png` request
 * for `..._.avif` still comes back `content-type: image/avif`). Since
 * ProductCard hides an image that fails to decode, an AVIF-only URL would show
 * pre-16 Safari a blank card with no visible error. Plain `_WxH.jpg` gets the
 * modern codec where it's supported and stays safe where it isn't.
 *
 * next/image would route every one of these through Vercel's optimizer, which
 * is metered per source image; this site renders thousands of distinct product
 * photos across ~1,500 pages, so that bill/quota is the thing to avoid.
 *
 * ponytail: URL transform only. If we ever self-host product photos, swap this
 * for next/image — the call sites already pass width/height.
 */

/**
 * Widths the CDN actually honors, probed against real objects. An unlisted
 * width is a silent no-op that returns the FULL-SIZE original — 160, 180, 400,
 * 450 and 750 all behave that way — so round to a member of this list, never
 * to whatever the layout happens to want.
 */
const CDN_WIDTHS = [50, 100, 120, 140, 200, 220, 250, 300, 350, 480, 500, 640, 720, 800, 960] as const;

const CDN_HOSTS = /(^|\.)(alicdn\.com|aliexpress-media\.com)$/i;

function isCdnImage(url: string): boolean {
  if (!url) return false;
  try {
    return CDN_HOSTS.test(new URL(url).hostname);
  } catch {
    return false;
  }
}

/**
 * Strip any transform suffix a previous call (or the API) already appended, so
 * repeated calls can't stack `_200x200.jpg_480x480.jpg` onto an object key.
 */
function baseUrl(url: string): string {
  return url.replace(/(\.(?:jpg|jpeg|png|webp|avif))_.*$/i, '$1');
}

function nearestWidth(width: number): number {
  return CDN_WIDTHS.find((w) => w >= width) ?? CDN_WIDTHS[CDN_WIDTHS.length - 1];
}

/** One resized variant. Returns the URL unchanged for non-CDN images. */
export function cdnImage(url: string, width: number): string {
  if (!isCdnImage(url)) return url;
  const w = nearestWidth(width);
  return `${baseUrl(url)}_${w}x${w}.jpg`;
}

/**
 * Props for a product `<img>`: a srcset at the CDN widths that bracket the
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
