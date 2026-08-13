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
 * Fetch a remote product image and inline it as a data URI so satori never
 * has to fetch during render (a failed render-time fetch kills the whole
 * ImageResponse stream -> empty 200 body). Returns null on any failure.
 */
async function fetchImageAsDataUri(url: string | null): Promise<string | null> {
  if (!url || !/^https:\/\//i.test(url)) return null;
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(4000),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; shopli-og/1.0)' },
    });
    if (!res.ok) return null;
    const contentType = (res.headers.get('content-type') || '').split(';')[0].trim();
    if (!contentType.startsWith('image/')) return null;
    const buf = new Uint8Array(await res.arrayBuffer());
    if (buf.byteLength === 0 || buf.byteLength > 3 * 1024 * 1024) return null;
    let binary = '';
    const CHUNK = 0x8000;
    for (let i = 0; i < buf.length; i += CHUNK) {
      binary += String.fromCharCode(...buf.subarray(i, i + CHUNK));
    }
    return `data:${contentType};base64,${btoa(binary)}`;
  } catch {
    return null;
  }
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
  const imageParam = searchParams.get('image');

  const truncatedTitle = title.length > 70 ? title.slice(0, 67) + '…' : title;
  const hasDiscount = originalPrice != null && Number(originalPrice) > Number(price || 0);

  // Satori fetches <img> URLs during render; if that fetch fails/returns
  // non-image, the whole ImageResponse stream errors and Vercel emits a
  // 200 with an EMPTY body. Pre-fetch with a timeout and inline as a data
  // URI; on any failure fall back to the text-only layout.
  const productImage = await fetchImageAsDataUri(imageParam);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: PALETTE.cream,
          fontFamily: 'system-ui, "Segoe UI", Arial, sans-serif',
          direction: rtl ? 'rtl' : 'ltr',
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
                fontSize: truncatedTitle.length > 50 ? 32 : 38,
                fontWeight: 800,
                lineHeight: 1.2,
                color: PALETTE.navy,
                letterSpacing: -0.5,
                display: 'flex',
              }}
            >
              {truncatedTitle}
            </div>

            {/* Price row */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
              {price && (
                <div
                  style={{
                    fontSize: 42,
                    fontWeight: 900,
                    color: PALETTE.teal,
                    letterSpacing: -1,
                    display: 'flex',
                  }}
                >
                  {currencySymbol}{Number(price).toFixed(2)}
                </div>
              )}
              {hasDiscount && (
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 600,
                    color: PALETTE.muted,
                    textDecoration: 'line-through',
                    display: 'flex',
                  }}
                >
                  {currencySymbol}{Number(originalPrice).toFixed(2)}
                </div>
              )}
              {discount && (
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: PALETTE.discount,
                    background: '#fef2f2',
                    padding: '4px 14px',
                    borderRadius: 999,
                    display: 'flex',
                  }}
                >
                  -{discount}
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
            <span>{rtl ? 'גלה באליאקספרס' : 'See on AliExpress'}</span>
            <span style={{ fontSize: 18 }}>→</span>
          </div>
        </div>

        {/* Right panel: product image */}
        {productImage ? (
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
              src={productImage}
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