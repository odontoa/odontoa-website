// Figma: https://www.figma.com/design/mYp2a6a5Lmanh6P1Dk6FId/Moodify---Mental-Health-Analytics-Admin-Dashboard--Community-?node-id=16:1146
// Tablet (later, do not implement): node-id=288:7994
// Mobile (later, do not implement): node-id=291:9656
import { Urbanist } from "next/font/google";
import "@/ui-lab/ui-lab-tokens.css";

const urbanist = Urbanist({ subsets: ["latin"] });

export const metadata = {
  title: "Figma V2 Dashboard | UI Lab",
  robots: "noindex, nofollow",
};

export default function FigmaDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`ui-lab ui-lab-v2 min-h-screen ${urbanist.className}`}
      style={{ background: "var(--v2-bg)" }}
    >
      {children}
    </div>
  );
}
