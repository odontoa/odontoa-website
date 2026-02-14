import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import { Providers } from '@/components/Providers'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'

import './globals.css'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const manrope = Manrope({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
})

const defaultMetadata: Metadata = {
  title: 'Odontoa - Napredni sistem za upravljanje stomatološkom ordinacijom',
  description: 'Kompletno rešenje za upravljanje stomatološkom ordinacijom. Upravljajte pacijentima, terminima, finansijama i analitikom na jednom mestu.',
  keywords: 'stomatologija, ordinacija, pacijenti, termini, finansije, analitika',
  authors: [{ name: 'Odontoa Team' }],
  creator: 'Odontoa Team',
  publisher: 'Odontoa',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://odontoa.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Odontoa - Napredni sistem za upravljanje stomatološkom ordinacijom',
    description: 'Kompletno rešenje za upravljanje stomatološkom ordinacijom. Upravljajte pacijentima, terminima, finansijama i analitikom na jednom mestu.',
    url: 'https://odontoa.com',
    siteName: 'Odontoa',
    images: [
      {
        url: '/images/Odontoa - logo pack/social_media_profile_image.png',
        width: 1200,
        height: 630,
        alt: 'Odontoa - Stomatološka ordinacija',
      },
    ],
    locale: 'sr_RS',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Odontoa - Napredni sistem za upravljanje stomatološkom ordinacijom',
    description: 'Kompletno rešenje za upravljanje stomatološkom ordinacijom.',
    images: ['/images/Odontoa - logo pack/social_media_profile_image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
}

const comingSoonMetadata: Metadata = {
  title: 'Odontoa je online',
  description: 'Platforma za upravljanje stomatološkom ordinacijom. Termini, kartoni i tim na jednom mestu.',
  metadataBase: new URL('https://odontoa.com'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Odontoa je online',
    description: 'Platforma za upravljanje stomatološkom ordinacijom. Termini, kartoni i tim na jednom mestu.',
    url: 'https://odontoa.com',
    siteName: 'Odontoa',
    images: [
      {
        url: '/images/Odontoa - logo pack/social_media_profile_image.png',
        width: 1200,
        height: 630,
        alt: 'Odontoa - Platforma za upravljanje ordinacijom',
      },
    ],
    locale: 'sr_RS',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Odontoa je online',
    description: 'Platforma za upravljanje stomatološkom ordinacijom. Termini, kartoni i tim na jednom mestu.',
    images: ['/images/Odontoa - logo pack/social_media_profile_image.png'],
  },
  robots: { index: true, follow: true },
}

export async function generateMetadata(): Promise<Metadata> {
  if (process.env.SITE_MODE === 'coming_soon') {
    return comingSoonMetadata;
  }
  return defaultMetadata;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sr" className={`${inter.variable} ${manrope.variable}`}>
      <body className={inter.className}>
        <GoogleAnalytics />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 