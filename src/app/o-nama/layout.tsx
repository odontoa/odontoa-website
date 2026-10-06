import type { Metadata } from 'next'
import type { ReactNode } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { pageMetadata } from "@/lib/seo/metadata";

/* OG slika je podrazumevana: /images/2dentists-smiling.jpg ima 6261x4174 px i 11 MB,
   sto mreze odbijaju kao preview sliku. */
export const metadata: Metadata = pageMetadata({
  title: 'O nama | Odontoa - Digitalna stomatologija',
  description: 'Upoznajte Odontoa tim i našu misiju da digitalizujemo stomatološke ordinacije u Srbiji. Fokus na pacijente, sigurnost i inovacije.',
  socialDescription: 'Upoznajte Odontoa tim i našu misiju da digitalizujemo stomatološke ordinacije u Srbiji.',
  keywords: 'Odontoa, o nama, tim, misija, vrednosti, stomatologija, digitalizacija',
  path: '/o-nama',
})

export default function AboutLayout({
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