import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/config/site-url';

/* Zajednicki recept za metadata javnih stranica.

   Next.js metadata se ne spaja duboko: stranica koja definise svoj openGraph gubi og:image
   iz root layouta, a stranica bez alternates nasledjuje canonical roditelja. Zato svaka
   javna stranica gradi metadata ovde: canonical, og:url, OG i Twitter slika uvek idu zajedno,
   a canonical je uvek ka samoj stranici. */

export type OgImage = { url: string; width: number; height: number; alt: string };

/** Podrazumevana OG slika (1200x630). Generise je scripts/generate-og-default.mjs. */
export const DEFAULT_OG_IMAGE: OgImage = {
  url: '/images/og/odontoa-default.png',
  width: 1200,
  height: 630,
  alt: 'Odontoa, softver za stomatološke ordinacije',
};

export const SITE_NAME = 'Odontoa';
export const SITE_LOCALE = 'sr_RS';

type PageMetadataInput = {
  /** Puni <title>, bez templejta. */
  title: string;
  description: string;
  /** Putanja stranice (npr. "/kontakt"); iz nje se gradi canonical i og:url. */
  path: string;
  /** Ako se OG/Twitter naslov ili opis razlikuju od title/description. */
  socialTitle?: string;
  socialDescription?: string;
  image?: OgImage;
  keywords?: string;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
  /** Pregazi canonical (apsolutni URL ili putanja), npr. za sadrzaj objavljen i drugde. */
  canonical?: string;
};

export function pageMetadata({
  title,
  description,
  path,
  socialTitle,
  socialDescription,
  image = DEFAULT_OG_IMAGE,
  keywords,
  ogType = 'website',
  publishedTime,
  modifiedTime,
  noindex,
  canonical,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const ogTitle = socialTitle ?? title;
  const ogDescription = socialDescription ?? description;
  const images = [{ ...image, url: absoluteUrl(image.url) }];

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: canonical ? absoluteUrl(canonical) : url },
    openGraph: {
      type: ogType,
      url,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      title: ogTitle,
      description: ogDescription,
      images,
      ...(ogType === 'article' && publishedTime ? { publishedTime } : {}),
      ...(ogType === 'article' && modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: images.map((i) => i.url),
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
