import DesktopCenovnik from "@/ui-lab/screens/ordinacija/DesktopCenovnik";

export const metadata = {
  title: "Cenovnik | Ordinacija | UI Lab",
  robots: "noindex, nofollow",
};

export default function CenovnikPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <DesktopCenovnik className="flex h-full w-full" />
    </div>
  );
}
