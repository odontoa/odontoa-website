import { Suspense } from "react";
import PredracunPrintTemplate from "@/ui-lab/screens/finansije/predracun/PredracunPrintTemplate";

export const metadata = {
  title: "Predračun — Štampa | UI Lab",
  robots: "noindex, nofollow",
};

export default function PrintPage({ params }: { params: { id: string } }) {
  return (
    <Suspense>
      <PredracunPrintTemplate predracunId={params.id} />
    </Suspense>
  );
}
