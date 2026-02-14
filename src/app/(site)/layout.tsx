import type { ReactNode } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function SiteLayout({ children }: { children: ReactNode }) {
  const isComingSoon = process.env.SITE_MODE === 'coming_soon';
  return (
    <div className="min-h-screen flex flex-col">
      {!isComingSoon && <Navigation />}
      <main className="flex-1">{children}</main>
      {!isComingSoon && <Footer />}
    </div>
  );
}

