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