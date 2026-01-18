/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  images: {
    domains: [
      'localhost',
      'images.unsplash.com',
    ],
    unoptimized: true,
  },
  trailingSlash: false,
  async headers() {
    return [
      {
        source: '/llms.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/llms.txt',
        destination: '/api/llms',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/blog3',
        destination: '/blogovi',
        permanent: true,
      },
      {
        source: '/blog3/:slug',
        destination: '/blogovi/:slug',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
