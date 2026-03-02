import DesktopMkb10 from "@/ui-lab/screens/ordinacija/DesktopMkb10";

export const metadata = {
  title: "MKB-10 | Ordinacija | UI Lab",
  robots: "noindex, nofollow",
};

export default function Mkb10Page() {
  return (
    <div className="flex h-screen overflow-hidden">
      <DesktopMkb10 className="flex h-full w-full" />
    </div>
  );
}
