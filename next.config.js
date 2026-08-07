/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  images: {
    domains: [
      'localhost',
      'images.unsplash.com',
      'cdn.sanity.io',
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
      /* home4 je postao pocetna; stari URL je deljen tokom dizajn revizija. */
      {
        source: '/home4',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
