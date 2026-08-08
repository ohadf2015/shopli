/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ae01.alicdn.com' },
      { protocol: 'https', hostname: '**.alicdn.com' },
    ],
  },
  async rewrites() {
    // Local-only proxy to the standalone API server. In production every /api
    // route is served by pages/api, and this rule would point unmatched ones at
    // a localhost that does not exist inside the Vercel function.
    if (process.env.NODE_ENV === 'production') return [];
    return [
      { source: '/api/:path*', destination: 'http://localhost:4123/api/v1/:path*' },
    ];
  },
};