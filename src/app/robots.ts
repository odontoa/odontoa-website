import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';

  if (!isProduction) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      /* /home2 i /home3 su arhiva starih varijanti pocetne: nisu linkovane
         iz nava ni footera, ali su javno dostupne i skoro identicne pocetnoj,
         pa se drze van indeksa. */
      disallow: ['/api/', '/studio/', '/home2', '/home3'],
    },
    sitemap: 'https://odontoa.com/sitemap.xml',
  };
}
