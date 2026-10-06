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
  /* charset je obavezan: bez njega se dijakritika u llms fajlovima prikazuje pogresno. */
  async headers() {
    return ['/llms.txt', '/llms-full.txt'].map((source) => ({
      source,
      headers: [
        {
          key: 'Content-Type',
          value: 'text/plain; charset=utf-8',
        },
      ],
    }));
  },
  async rewrites() {
    return [
      {
        source: '/llms.txt',
        destination: '/api/llms',
      },
      {
        source: '/llms-full.txt',
        destination: '/api/llms-full',
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
      /* Stare varijante pocetne vise nisu javne: jedina pocetna je /.
         Kod starih varijanti je u src/legacy/routes, van app rutera. */
      ...['/home2', '/home3', '/home4', '/dizajn-varijante'].map((source) => ({
        source,
        destination: '/',
        statusCode: 301,
      })),
    ];
  },
};

module.exports = nextConfig;
