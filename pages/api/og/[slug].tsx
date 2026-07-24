import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

const PALETTE = {
  navy: '#1a2744',
  orange: '#e87a1f',
  cream: '#faf7f2',
  white: '#ffffff',
  muted: '#8a8074',
};

/**
 * Per-category Open Graph image (1200×630 JPG-compatible PNG).
 * Usage: /api/og/{collection-slug}?title=...&lang=he
 */
export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pathSlug = req.nextUrl.pathname.split('/').pop() || 'shopli';
  const slug = decodeURIComponent(pathSlug.replace(/\.png$/i, ''));
  const titleParam = searchParams.get('title') || '';
  const lang = searchParams.get('lang') || 'en';
  const rtl = lang === 'he' || searchParams.get('dir') === 'rtl';

  const title =
    titleParam ||
    slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  const badge = rtl ? 'שופלי · קטגוריה' : 'SHOPLI · COLLECTION';
  const cta = rtl ? 'דילים מאליאקספרס' : 'AliExpress deals curated for you';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: `linear-gradient(135deg, ${PALETTE.cream} 0%, #fff 45%, #fff5eb 100%)`,
          padding: '56px 64px',
          fontFamily: 'system-ui, "Segoe UI", Arial, sans-serif',
          direction: rtl ? 'rtl' : 'ltr',
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: PALETTE.orange,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: PALETTE.white,
                fontSize: 28,
                fontWeight: 800,
              }}
            >
              S
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: PALETTE.navy,
                letterSpacing: -0.5,
              }}
            >
              shopli
            </div>
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 1.5,
              color: PALETTE.orange,
              textTransform: 'uppercase' as const,
            }}
          >
            {badge}
          </div>
        </div>

        {/* Title block */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            maxWidth: 980,
          }}
        >
          <div
            style={{
              width: 72,
              height: 6,
              borderRadius: 4,
              background: PALETTE.orange,
            }}
          />
          <div
            style={{
              fontSize: title.length > 48 ? 52 : 64,
              fontWeight: 800,
              lineHeight: 1.15,
              color: PALETTE.navy,
              letterSpacing: -1,
            }}
          >
            {title.length > 80 ? title.slice(0, 77) + '…' : title}
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 500,
              color: PALETTE.muted,
            }}
          >
            {cta}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            borderTop: `2px solid ${PALETTE.orange}33`,
            paddingTop: 24,
          }}
        >
          <div style={{ fontSize: 22, color: PALETTE.muted, fontWeight: 600 }}>
            {slug}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: PALETTE.navy,
              color: PALETTE.white,
              padding: '12px 28px',
              borderRadius: 999,
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            {rtl ? 'גלו דילים ←' : 'Browse deals →'}
          </div>
        </div>
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
