import { CompleteAppointmentScreen } from "@/ui-lab/screens/calendar/complete/CompleteAppointmentScreen";

export const metadata = {
  title: "Završi termin | UI Lab",
  robots: "noindex, nofollow",
};

export default function CompleteAppointmentPage({
  params,
}: {
  params: { id: string };
}) {
  return <CompleteAppointmentScreen appointmentId={params.id} />;
}
