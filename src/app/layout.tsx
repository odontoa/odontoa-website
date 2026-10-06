import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import { Providers } from '@/components/Providers'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
import { SITE_URL } from '@/lib/config/site-url'
import { DEFAULT_OG_IMAGE, SITE_LOCALE, SITE_NAME } from '@/lib/seo/metadata'

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

/* Podrazumevani metadata za ceo sajt. Namerno BEZ canonical-a i og:url: stranica bez
   svog canonical-a ne sme da nasledi canonical pocetne. Javne stranice grade svoj
   metadata kroz pageMetadata() (src/lib/seo/metadata.ts); pocetna je u (site)/page.tsx. */
export const metadata: Metadata = {
  title: 'Odontoa - Napredni sistem za upravljanje stomatološkom ordinacijom',
  description: 'Softver za stomatološke ordinacije: zakazivanje, karton, RTG, zubna tehnika, dokumentacija i finansije u jednom sistemu.',
  keywords: 'stomatologija, ordinacija, pacijenti, termini, finansije, analitika',
  authors: [{ name: 'Odontoa Team' }],
  creator: 'Odontoa Team',
  publisher: 'Odontoa',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: '/images/Odontoa-New-logo-pack-2026/favicons/favicon.ico', sizes: 'any' },
      { url: '/images/Odontoa-New-logo-pack-2026/favicons/favicon.svg', type: 'image/svg+xml' },
      { url: '/images/Odontoa-New-logo-pack-2026/favicons/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: '/images/Odontoa-New-logo-pack-2026/favicons/favicon.ico',
    apple: '/images/Odontoa-New-logo-pack-2026/favicons/apple-touch-icon.png',
  },
  openGraph: {
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    type: 'website',
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    images: [DEFAULT_OG_IMAGE.url],
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
  /* Vazi i u coming-soon rezimu, da Search Console verifikacija radi pre punog launcha. */
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
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