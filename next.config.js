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
    return [
      { source: '/api/:path*', destination: 'http://localhost:4123/api/v1/:path*' },
    ];
  },
};