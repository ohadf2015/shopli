/** @type {import('next').NextConfig} */

const fs = require('fs');
const path = require('path');

// Beauty niches now live only under /[region]/category/*.
const csvPath = path.join(__dirname, 'data', 'beauty-niche.csv');
const csvText = fs.readFileSync(csvPath, 'utf-8');
const migratedSlugs = csvText
  .split(/\r?\n/)
  .slice(1)
  .map((line) => line.split(',')[0].trim())
  .filter(Boolean);

module.exports = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ae01.alicdn.com' },
      { protocol: 'https', hostname: '**.alicdn.com' },
    ],
  },
  async redirects() {
    return migratedSlugs.map((slug) => ({
      source: `/:region/collection/${slug}`,
      destination: `/:region/category/${slug}`,
      permanent: true,
    }));
  },
  async rewrites() {
    return [
      { source: '/api/:path*', destination: 'http://localhost:4123/api/v1/:path*' },
    ];
  },
};
