import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Odontoa Studio",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudioRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Minimal layout for Sanity Studio - no marketing chrome
  // /studio is an internal CMS route and should not be indexed by search engines
  // Note: html/body are provided by root layout, we just wrap children here
  // The metadata export above handles the noindex robots directive
  return <>{children}</>;
}

