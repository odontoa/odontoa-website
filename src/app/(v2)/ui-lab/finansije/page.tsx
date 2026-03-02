import { redirect } from "next/navigation";

// Canonical entry point is Finansije → Predračun.
// This route is kept for bookmark compatibility only.
export default function FinansijePage() {
  redirect("/ui-lab/finansije/predracun");
}
