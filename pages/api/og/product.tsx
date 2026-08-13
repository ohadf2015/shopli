import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

const PALETTE = {
  navy: '#1a2744',
  orange: '#e87a1f',
  teal: '#1e8a7d',
  cream: '#faf7f2',
  white: '#ffffff',
  muted: '#8a8074',
  discount: '#dc2626',
  'gray-100': '#f3f4f6',
  'gray-200': '#e5e7eb',
};

/**
 * Fetch the product image bytes ourselves instead of letting satori fetch the
 * remote URL. AliExpress CDNs content-negotiate to WebP for modern browser
 * User-Agents, and satori/resvg cannot decode WebP — the whole OG render
 * then fails and the endpoint returns an empty body. Requesting only
 * image/png,image/jpeg in Accept (no wildcard) makes the CDN serve the
 * original JPEG/PNG. Returns null on any failure so the card degrades to
 * the branded placeholder instead of breaking the image.
 */
async function fetchProductImage(url: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(url, {
      headers: {
        // No wildcard/webp in Accept => CDN serves the original JPEG/PNG.
        Accept: 'image/png,image/jpeg',
      },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const type = (res.headers.get('content-type') || '').toLowerCase();
    if (!type.includes('png') && !type.includes('jpeg') && !type.includes('jpg')) return null;
    const buf = await res.arrayBuffer();
    if (buf.byteLength === 0 || buf.byteLength > 2_000_000) return null;
    return buf;
  } catch {
    return null;
  }
}

interface OgParams {
  truncatedTitle: string;
  price: string | null;
  currencySymbol: string;
  originalPrice: string | null;
  discount: string | null;
  hasDiscount: boolean;
  rtl: boolean;
  imageData: ArrayBuffer | null;
}

function renderOg(p: OgParams): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: PALETTE.cream,
          fontFamily: 'system-ui, "Segoe UI", Arial, sans-serif',
          direction: p.rtl ? 'rtl' : 'ltr',
        }}
      >
        {/* Left panel: text content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            padding: '48px 40px 40px 48px',
          }}
        >
          {/* Brand top bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: PALETTE.orange,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: PALETTE.white,
                fontSize: 20,
                fontWeight: 800,
              }}
            >
              S
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: PALETTE.navy,
                letterSpacing: -0.3,
              }}
            >
              shopli
            </div>
          </div>

          {/* Title and price */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              maxWidth: 520,
            }}
          >
            {/* Orange accent bar */}
            <div
              style={{
                width: 56,
                height: 5,
                borderRadius: 3,
                background: PALETTE.orange,
              }}
            />
            <div
              style={{
                fontSize: p.truncatedTitle.length > 50 ? 32 : 38,
                fontWeight: 800,
                lineHeight: 1.2,
                color: PALETTE.navy,
                letterSpacing: -0.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {p.truncatedTitle}
            </div>

            {/* Price row */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
              {p.price && (
                <div
                  style={{
                    fontSize: 42,
                    fontWeight: 900,
                    color: PALETTE.teal,
                    letterSpacing: -1,
                  }}
                >
                  {`${p.currencySymbol}${Number(p.price).toFixed(2)}`}
                </div>
              )}
              {p.hasDiscount && (
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 600,
                    color: PALETTE.muted,
                    textDecoration: 'line-through',
                  }}
                >
                  {`${p.currencySymbol}${Number(p.originalPrice).toFixed(2)}`}
                </div>
              )}
              {p.discount && (
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: PALETTE.discount,
                    background: '#fef2f2',
                    padding: '4px 14px',
                    borderRadius: 999,
                  }}
                >
                  {`-${p.discount}`}
                </div>
              )}
            </div>
          </div>

          {/* Bottom CTA */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 16,
              fontWeight: 600,
              color: PALETTE.orange,
            }}
          >
            <span>{p.rtl ? 'גלה באליאקספרס' : 'See on AliExpress'}</span>
            <span style={{ fontSize: 18 }}>→</span>
          </div>
        </div>

        {/* Right panel: product image */}
        {p.imageData ? (
          <div
            style={{
              width: 504,
              height: 630,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: PALETTE.white,
              overflow: 'hidden',
              borderLeft: `1px solid ${PALETTE['gray-200']}`,
            }}
          >
            <img
              src={p.imageData as unknown as string}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                padding: 24,
              }}
            />
          </div>
        ) : (
          <div
            style={{
              width: 504,
              height: 630,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${PALETTE['gray-100']} 0%, ${PALETTE.cream} 100%)`,
              borderLeft: `1px solid ${PALETTE['gray-200']}`,
            }}
          >
            <div
              style={{
                width: 128,
                height: 128,
                borderRadius: 32,
                background: PALETTE.orange,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: PALETTE.white,
                fontSize: 56,
                fontWeight: 800,
                opacity: 0.4,
              }}
            >
              S
            </div>
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    }
  );
}

/**
 * Per-product Open Graph image (1200×630).
 * Usage: /api/og/product?title=...&price=...&currencySymbol=...&originalPrice=...&discount=...&lang=...
 * Shows the product image (right) + title + price (left) + Shopli branding.
 */
export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'Product';
  const price = searchParams.get('price');
  const currencySymbol = searchParams.get('currencySymbol') || '₪';
  const originalPrice = searchParams.get('originalPrice');
  const discount = searchParams.get('discount');
  const lang = searchParams.get('lang') || 'en';
  const rtl = lang === 'he';
  const productImage = searchParams.get('image');

  const truncatedTitle = title.length > 70 ? title.slice(0, 67) + '…' : title;
  const hasDiscount = originalPrice != null && Number(originalPrice) > Number(price || 0);
  const imageData = productImage ? await fetchProductImage(productImage) : null;

  const params: OgParams = {
    truncatedTitle,
    price,
    currencySymbol,
    originalPrice,
    discount,
    hasDiscount,
    rtl,
    imageData,
  };

  try {
    return renderOg(params);
  } catch {
    // Never return an empty body: retry without the product image so the
    // shared link still gets a branded preview card.
    return renderOg({ ...params, imageData: null });
  }
}
