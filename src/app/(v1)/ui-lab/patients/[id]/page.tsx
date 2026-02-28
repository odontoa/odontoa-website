"use client";

import { useParams } from "next/navigation";
import PatientDetailScreen from "@/ui-lab/screens/patient-detail-screen";

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = Number(params.id);

  return <PatientDetailScreen patientId={patientId} />;
}
