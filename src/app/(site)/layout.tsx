import type { ReactNode } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { isComingSoon as getIsComingSoon } from "@/lib/config/site-mode";

export default function SiteLayout({ children }: { children: ReactNode }) {
  const isComingSoon = getIsComingSoon();
  return (
    <div className="min-h-screen flex flex-col">
      {!isComingSoon && <Navigation />}
      <main className="flex-1">{children}</main>
      {!isComingSoon && <Footer />}
    </div>
  );
}

