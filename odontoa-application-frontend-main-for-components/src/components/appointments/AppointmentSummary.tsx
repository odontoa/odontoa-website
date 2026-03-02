import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Phone,
  Stethoscope,
  Clock,
  CalendarIcon,
  HeartPulse,
  DollarSign,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { formatCurrency, getDateFnsLocale, getStatusInfo, translateTreatment } from "@/lib/utils";
import type { Appointment } from "@/types/Appointment";

interface AppointmentSummaryProps {
  appointment: Appointment;
  currency?: string;
}

export function AppointmentSummary({ appointment, currency = "RSD" }: AppointmentSummaryProps) {
  const { t, i18n } = useTranslation();

  const formatDateTime = (date: Date) => {
    return format(date, "HH:mm", { locale: getDateFnsLocale(i18n.language) });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          {t("appointments.appointmentInfo")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="font-medium">{t("appointments.patient")}:</span>
            <span>
              {appointment.patientMedicalCard.firstName}{" "}
              {appointment.patientMedicalCard.lastName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="font-medium">{t("appointmentDetail.phone")}:</span>
            <span>{appointment.patientMedicalCard.phoneNumbers[0].phonenumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-gray-500" />
            <span className="font-medium">{t("appointments.doctor")}:</span>
            <span>
              Dr {appointment.dentist.firstName}{" "}
              {appointment.dentist.lastName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="font-medium">{t("appointments.chair")}:</span>
            <span>{appointment.chair}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-600" />
            <span className="font-medium">{t("appointments.time")}:</span>
            <span>
              {formatDateTime(new Date(appointment.startTime))}{" "}
              - {formatDateTime(new Date(appointment.endTime))}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-purple-600" />
            <span className="font-medium">{t("appointments.date")}:</span>
            <span>
              {format(new Date(appointment.startTime), "PPP", {
                locale: getDateFnsLocale(i18n.language),
              })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-red-500" />
            <span className="font-medium">{t("appointments.dentalService")}:</span>
            <span>{translateTreatment(appointment.dentalService, t)}</span>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="font-medium">{t("appointmentDetail.price")}:</span>
            <span className="text-green-600 font-medium">
              {appointment.therapyRecords && appointment.therapyRecords.length > 0
                ? formatCurrency(
                    appointment.therapyRecords.reduce((total, therapy) =>
                      total + (therapy.price ? therapy.price : 0), 0
                    ),
                    currency
                  )
                : formatCurrency(0, currency)
              }
            </span>
          </div>

          <div className="flex items-center gap-2 col-span-2">
            <span className="font-medium">{t("appointments.status")}:</span>
            <Badge
              className={`${getStatusInfo(appointment.status, t).color
                } flex items-center gap-1 border`}
            >
              {getStatusInfo(appointment.status, t).icon}
              {getStatusInfo(appointment.status, t).text}
            </Badge>
          </div>

          {appointment.notes && (
            <div className="flex flex-col gap-2 col-span-2">
              <span className="font-medium">{t("appointments.notes")}:</span>
              <p className="text-sm text-gray-600">{appointment.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

