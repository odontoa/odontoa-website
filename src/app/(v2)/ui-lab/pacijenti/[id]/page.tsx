import PatientDetailsScreen from "@/ui-lab/screens/pacijenti-detalji/PatientDetailsScreen";

export const metadata = {
  title: "Pregled pacijenta | UI Lab",
  robots: "noindex, nofollow",
};

export default async function PatientDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PatientDetailsScreen id={id} />;
}
