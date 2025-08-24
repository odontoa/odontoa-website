import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'O nama | Odontoa - Digitalna stomatologija',
  description: 'Upoznajte Odontoa tim i našu misiju da digitalizujemo stomatološke ordinacije u Srbiji. Fokus na pacijente, sigurnost i inovacije.',
  keywords: 'Odontoa, o nama, tim, misija, vrednosti, stomatologija, digitalizacija',
  openGraph: {
    title: 'O nama | Odontoa - Digitalna stomatologija',
    description: 'Upoznajte Odontoa tim i našu misiju da digitalizujemo stomatološke ordinacije u Srbiji.',
    url: 'https://odontoa.com/o-nama',
    siteName: 'Odontoa',
    images: [
      {
        url: '/images/2dentists-smiling.jpg',
        width: 1200,
        height: 630,
        alt: 'Odontoa tim - Stomatolozi',
      },
    ],
    locale: 'sr_RS',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'O nama | Odontoa - Digitalna stomatologija',
    description: 'Upoznajte Odontoa tim i našu misiju da digitalizujemo stomatološke ordinacije u Srbiji.',
    images: ['/images/2dentists-smiling.jpg'],
  },
  alternates: {
    canonical: '/o-nama',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 