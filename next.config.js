// 'unsafe-inline' on scripts: _document inlines the PostHog and GA bootstraps.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.posthog.com https://growthradar.app https://company-brain-production-841e.up.railway.app",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.aliexpress-media.com https://*.alicdn.com https://*.google-analytics.com https://*.googletagmanager.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.posthog.com https://growthradar.app https://company-brain-production-841e.up.railway.app https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
  "worker-src 'self' blob:",
  "frame-src 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    // Constrained CI runner (shared pid/thread cgroup cap): keep workers low.
    cpus: 2,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ae01.alicdn.com' },
      { protocol: 'https', hostname: '**.alicdn.com' },
    ],
  },
  async redirects() {
    return [
      // Ended Andoer softbox light kit; bookmarked visitors still arrive here.
      {
        source: '/:region/product/1005011681039717',
        destination: '/:region/collection/content-creator',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    // AliExpress deals feed aliases on the canonical /il path.
    const feedAliases = [
      { source: '/il/api/deals', destination: '/il/data/deals.json' },
      { source: '/il/api/health', destination: '/il/health.json' },
    ];
    // Local-only proxy to the standalone API server. In production every /api
    // route is served by pages/api, and this rule would point unmatched ones at
    // a localhost that does not exist inside the Vercel function.
    if (process.env.NODE_ENV === 'production') return feedAliases;
    return [
      ...feedAliases,
      { source: '/api/:path*', destination: 'http://localhost:4123/api/v1/:path*' },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: CSP },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      // CORS for the ali_express deals feed mirrored under /il
      {
        source: '/il/data/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
        ],
      },
      {
        source: '/il/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
        ],
      },
    ];
  },
};
