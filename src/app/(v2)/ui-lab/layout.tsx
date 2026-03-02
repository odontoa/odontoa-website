import { Urbanist } from "next/font/google";
import "@/ui-lab/ui-lab-tokens.css";
import { UILabProviders } from "./providers";

const urbanist = Urbanist({ subsets: ["latin"] });

export const metadata = {
  title: "UI Lab V2",
  robots: "noindex, nofollow",
};

export default function UILabV2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`ui-lab ui-lab-v2 min-h-screen ${urbanist.className}`}
      style={{ background: "var(--v2-bg)" }}
    >
      <UILabProviders>{children}</UILabProviders>
    </div>
  );
}
