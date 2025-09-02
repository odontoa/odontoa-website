import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kontakt | Odontoa - Digitalna stomatologija',
  description: 'Kontaktirajte Odontoa tim za sve informacije o digitalizaciji vaše stomatološke ordinacije. Dostupni smo da odgovorimo na sva vaša pitanja.',
  keywords: 'kontakt, Odontoa, stomatologija, digitalizacija, ordinacija, podrška',
  openGraph: {
    title: 'Kontakt | Odontoa - Digitalna stomatologija',
    description: 'Kontaktirajte Odontoa tim za sve informacije o digitalizaciji vaše stomatološke ordinacije.',
    url: 'https://odontoa.com/kontakt',
    siteName: 'Odontoa',
    locale: 'sr_RS',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Kontakt | Odontoa - Digitalna stomatologija',
    description: 'Kontaktirajte Odontoa tim za sve informacije o digitalizaciji vaše stomatološke ordinacije.',
  },
  alternates: {
    canonical: '/kontakt',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 