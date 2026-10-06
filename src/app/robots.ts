import { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/config/site-url';

/* Na Vercelu odlucuje VERCEL_ENV: preview deploy je takodje NODE_ENV=production, ali ne sme
   da se indeksira. Van Vercela (lokalni `next start`) vazi NODE_ENV. */
function isProductionDeployment(): boolean {
  if (process.env.VERCEL_ENV) return process.env.VERCEL_ENV === 'production';
  return process.env.NODE_ENV === 'production';
}

export default function robots(): MetadataRoute.Robots {
  if (!isProductionDeployment()) {
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
      /* Stare varijante pocetne (/home2, /home3, /home4, /dizajn-varijante) vode 301
         na /, pa ih ne blokiramo: crawler treba da vidi preusmerenje. Interne i sakrivene
         rute vracaju 404 + noindex iz middleware-a, pa ni njih ne treba blokirati ovde. */
      disallow: ['/api/', '/studio/'],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
