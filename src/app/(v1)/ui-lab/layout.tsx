import "@/ui-lab/ui-lab-tokens.css";
import AppShell from "@/ui-lab/layout/app-shell";

export const metadata = {
  title: "Odontoa UI Lab",
  description: "Isolated UI sandbox for app redesign mockups",
  robots: "noindex, nofollow",
};

export default function UILabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="ui-lab">
      <AppShell>{children}</AppShell>
    </div>
  );
}
