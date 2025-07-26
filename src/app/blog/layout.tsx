import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Odontoa Blog | Vodiči i saveti za digitalnu stomatologiju',
  description: 'Praktični saveti i vodiči za digitalno vođenje stomatološke ordinacije. Najnoviji trendovi u digitalnoj stomatologiji.',
  keywords: 'stomatologija, blog, vodiči, saveti, digitalna ordinacija, pacijenti',
  openGraph: {
    title: 'Odontoa Blog | Vodiči i saveti za digitalnu stomatologiju',
    description: 'Praktični saveti i vodiči za digitalno vođenje stomatološke ordinacije.',
    url: 'https://odontoa.com/blog',
    siteName: 'Odontoa Blog',
    images: [
      {
        url: '/odontoa-logo1.png',
        width: 1200,
        height: 630,
        alt: 'Odontoa Blog',
      },
    ],
    locale: 'sr_RS',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Odontoa Blog | Vodiči i saveti za digitalnu stomatologiju',
    description: 'Praktični saveti i vodiči za digitalno vođenje stomatološke ordinacije.',
    images: ['/odontoa-logo1.png'],
  },
  alternates: {
    canonical: '/blog',
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 