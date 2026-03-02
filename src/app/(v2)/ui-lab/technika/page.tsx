import { redirect } from "next/navigation";

// Canonical master-data location is Ordinacija → Tehnika.
// This route is kept for bookmark compatibility only.
export default function TechnikaRedirectPage() {
  redirect("/ui-lab/ordinacija/tehnika");
}
