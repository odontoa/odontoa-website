import AppointmentCard from "./AppointmentCard";
import type { Appointment } from "@/types/Appointment";
import { useTranslation } from "react-i18next";
import { translateTreatment } from "@/lib/utils";

type DoctorColumnProps = {
  day: string;
  appointments: Appointment[] | undefined;
  currency?: string;
};

export default function DoctorColumn({ day, appointments, currency = "RSD" }: DoctorColumnProps) {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-2 p-3 border-b bg-white sticky top-0 z-10">
        <h3 className="font-medium text-sm">{day}</h3>
      </div>

      <div className="flex-1 space-y-2 p-2">
        {appointments?.map((appointment, index) => (
          <AppointmentCard
            key={index}
            patientName={`${appointment.patientMedicalCard.firstName} ${appointment.patientMedicalCard.lastName}`}
            procedureType={translateTreatment(appointment.dentalService, t)}
            time={`${appointment.startTime} - ${appointment.endTime}`}
            currency={currency}
          />
        ))}
      </div>
    </div>
  );
}
