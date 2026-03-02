import DesktopTehnikaOrdinacija from "@/ui-lab/screens/ordinacija/DesktopTehnikaOrdinacija";

export const metadata = {
  title: "Tehnika | Ordinacija | UI Lab",
  robots: "noindex, nofollow",
};

export default function TehnikaOrdinacijaPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <DesktopTehnikaOrdinacija className="flex h-full w-full" />
    </div>
  );
}
