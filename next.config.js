/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['a.espncdn.com', 'secure.espncdn.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/espn/:path*',
        destination: 'https://site.api.espn.com/apis/site/v2/sports/:path*',
      },
    ];
  },
};

module.exports = nextConfig;