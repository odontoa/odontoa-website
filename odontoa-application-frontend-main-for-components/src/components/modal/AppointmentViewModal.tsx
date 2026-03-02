import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Calendar, Clock, User, Stethoscope, MapPin, FileText, X } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { getDateFnsLocale, getStatusBadge, getTypeBadge, getCancellationReasonLabel, translateTreatment } from "@/lib/utils";

interface AppointmentViewModalProps {
  appointment: any;
  isOpen: boolean;
  onClose: () => void;
}

export function AppointmentViewModal({ appointment, isOpen, onClose }: AppointmentViewModalProps) {
  const { t, i18n } = useTranslation();
  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto px-2 md:p-6" showCloseButton={false}>
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
              <Clock className="h-6 w-6 text-blue-600" />
              {t("components.appointmentViewModal.appointmentDetails")}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Appointment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {t("components.appointmentViewModal.appointmentInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{t("components.appointmentViewModal.date")}:</span>
                  <span>{format(new Date(appointment.startTime), "dd.MM.yyyy", { locale: getDateFnsLocale(i18n.language) })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{t("components.appointmentViewModal.time")}:</span>
                  <span>{format(new Date(appointment.startTime), "HH:mm", { locale: getDateFnsLocale(i18n.language) })} - {format(new Date(appointment.endTime), "HH:mm", { locale: getDateFnsLocale(i18n.language) })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{t("components.appointmentViewModal.service")}:</span>
                  <span className="font-semibold">{translateTreatment(appointment.dentalService, t)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{t("components.appointmentViewModal.chair")}:</span>
                  <span className="font-semibold">{appointment.chair}</span>
                </div>
                {appointment.treatmentType && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{t("components.appointmentViewModal.treatmentType")}:</span>
                    {getTypeBadge(appointment.treatmentType, t)}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="font-medium">{t("components.appointmentViewModal.status")}:</span>
                  {getStatusBadge(appointment.status, t)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Doctor Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                {t("components.appointmentViewModal.dentistInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{t("components.appointmentViewModal.fullName")}:</span>
                  <span className="font-semibold">
                    {appointment.dentist.firstName} {appointment.dentist.lastName}
                  </span>
                </div>
                {appointment.dentist.specialization && (
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{t("components.appointmentViewModal.specialization")}:</span>
                    <span>{appointment.dentist.specialization}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Patient Information */}
          {appointment.patientMedicalCard && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {t("components.appointmentViewModal.patientInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{t("components.appointmentViewModal.fullName")}:</span>
                    <span className="font-semibold">
                      {appointment.patientMedicalCard.firstName} {appointment.patientMedicalCard.lastName}
                    </span>
                  </div>
                  {appointment.patientMedicalCard.jmbg && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">JMBG:</span>
                      <span>{appointment.patientMedicalCard.jmbg}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {appointment.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t("components.appointmentViewModal.notes")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{appointment.notes}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cancellation Information */}
          {appointment.status === 'canceled' ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-red-600">
                  <X className="h-5 w-5" />
                  {t("components.appointmentViewModal.cancellationInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {appointment.cancellationReason && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{t("components.appointmentViewModal.cancellationReason")}:</span>
                    <span>{getCancellationReasonLabel(appointment.cancellationReason, t)}</span>
                  </div>
                )}
                {appointment.cancellationNotes && (
                  <div>
                    <span className="font-medium">{t("components.appointmentViewModal.cancellationNotes")}:</span>
                    <div className="bg-red-50 p-4 rounded-lg mt-2">
                      <p className="text-red-700 whitespace-pre-wrap">{appointment.cancellationNotes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
