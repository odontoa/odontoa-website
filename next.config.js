/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'images.unsplash.com',
      // Strapi Cloud asset host
      'inspiring-chocolate-0dd8ffdae3.strapiapp.com',
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
};

module.exports = nextConfig; 