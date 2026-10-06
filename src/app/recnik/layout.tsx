import type { ReactNode } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

/* Metadata je na stranicama (page.tsx), ne ovde: layout ne sme da prenese canonical
   /recnik na stranice pojmova i kategorija. */
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

