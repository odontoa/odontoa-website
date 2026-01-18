import type { Metadata } from 'next'
import type { ReactNode } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

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
  children: ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
} 