import type { Metadata } from 'next'
import type { ReactNode } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { isComingSoon } from "@/lib/config/site-mode";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: 'Kontakt | Odontoa - Digitalna stomatologija',
  description: 'Kontaktirajte Odontoa tim za sve informacije o digitalizaciji vaše stomatološke ordinacije. Dostupni smo da odgovorimo na sva vaša pitanja.',
  socialDescription: 'Kontaktirajte Odontoa tim za sve informacije o digitalizaciji vaše stomatološke ordinacije.',
  keywords: 'kontakt, Odontoa, stomatologija, digitalizacija, ordinacija, podrška',
  path: '/kontakt',
})

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