import type { Metadata } from 'next'
import type { ReactNode } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: 'Rečnik | Odontoa - Stomatološki rečnik',
  description: 'Kompletan stomatološki rečnik sa objašnjenjima termina, kategorijama i povezanim terminima. Pronađite sve što vam treba o stomatologiji.',
  keywords: 'rečnik, stomatologija, termini, definicije, Odontoa, stomatološki rečnik',
  openGraph: {
    title: 'Rečnik | Odontoa - Stomatološki rečnik',
    description: 'Kompletan stomatološki rečnik sa objašnjenjima termina, kategorijama i povezanim terminima.',
    url: 'https://odontoa.com/recnik',
    siteName: 'Odontoa',
    locale: 'sr_RS',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Rečnik | Odontoa - Stomatološki rečnik',
    description: 'Kompletan stomatološki rečnik sa objašnjenjima termina, kategorijama i povezanim terminima.',
  },
  alternates: {
    canonical: '/recnik',
  },
}

export default function GlossaryLayout({
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

