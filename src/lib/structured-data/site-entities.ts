import { SITE_URL, absoluteUrl } from '@/lib/config/site-url';
import { businessConfig } from '@/lib/config/business';
import { pricing } from '@/lib/config/pricing';

/* Site-wide entiteti sa stabilnim @id vrednostima. Svaka stranica ih ukljucuje u svoj @graph
   i referencira ih preko @id, umesto da ponavlja publisher/organization objekte.

   Samo podaci koje vec imamo javno na sajtu: ime, logo, email i drustvene mreze iz footera
   (businessConfig), cena iz pricing config-a. Bez ocena, recenzija, osnivaca i adrese
   (adresa u config-u nema broj, pa nije potpuna). */

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const SOFTWARE_ID = `${SITE_URL}/#software`;

export type JsonLdNode = Record<string, unknown>;

export const organizationRef = { '@id': ORGANIZATION_ID };
export const websiteRef = { '@id': WEBSITE_ID };

export function organizationNode(): JsonLdNode {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: businessConfig.name,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/images/Odontoa-New-logo-pack-2026/horiyotal_color.png'),
      width: 507,
      height: 165,
    },
    email: businessConfig.email,
    sameAs: Object.values(businessConfig.social),
  };
}

export function websiteNode(): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: businessConfig.name,
    inLanguage: 'sr',
    publisher: organizationRef,
  };
}

/* Proizvod. Cena je godisnja naplata iz pricing config-a. */
export function softwareApplicationNode(): JsonLdNode {
  return {
    '@type': 'SoftwareApplication',
    '@id': SOFTWARE_ID,
    name: businessConfig.name,
    url: SITE_URL,
    description:
      'Softver za stomatološke ordinacije: zakazivanje, karton i odontogram, RTG snimci, zubna tehnika, dokumentacija i finansije u jednom sistemu.',
    applicationCategory: 'BusinessApplication',
    inLanguage: 'sr',
    publisher: organizationRef,
    offers: {
      '@type': 'Offer',
      url: absoluteUrl('/register'),
      price: String(pricing.yearly),
      priceCurrency: pricing.currency,
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: pricing.yearly,
        priceCurrency: pricing.currency,
        billingDuration: 'P1Y',
      },
    },
  };
}
