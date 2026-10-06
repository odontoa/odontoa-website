import type { Metadata } from 'next'
import type { ReactNode } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { isComingSoon } from "@/lib/config/site-mode";

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
  /* Kontakt je otvoren i u coming-soon rezimu; tada nav i footer ne linkuju zatvorene rute. */
  const comingSoon = isComingSoon();
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation comingSoon={comingSoon} />
      <main className="flex-1">{children}</main>
      <Footer comingSoon={comingSoon} />
    </div>
  );
} 