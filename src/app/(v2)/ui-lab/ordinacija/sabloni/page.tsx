import OrdinacijaSabloniScreen from "@/ui-lab/screens/ordinacija-sabloni/OrdinacijaSabloniScreen";

export const metadata = {
  title: "Šabloni | Ordinacija | UI Lab",
  robots: "noindex, nofollow",
};

export default function SabloniPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <OrdinacijaSabloniScreen className="flex h-full w-full" />
    </div>
  );
}
