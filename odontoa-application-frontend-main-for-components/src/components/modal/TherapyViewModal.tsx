import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Calendar, Clock, User, Phone, Stethoscope, MapPin, FileText, X } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { getDateFnsLocale, getStatusBadge, getTypeBadge, translateTreatment } from "@/lib/utils";

interface TherapyViewModalProps {
  therapy: any;
  isOpen: boolean;
  onClose: () => void;
}

export function TherapyViewModal({ therapy, isOpen, onClose }: TherapyViewModalProps) {
  const { t, i18n } = useTranslation();
  if (!therapy) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto px-2 md:p-6" showCloseButton={false}>
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              {t("components.therapyViewModal.therapyDetails")}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Therapy Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t("components.therapyViewModal.therapyInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {therapy.isGlobal && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{t("components.therapyViewModal.allTeeth")}:</span>
                    <span className="text-lg">{t("components.therapyViewModal.yes")}</span>
                  </div>
                )}
                {/* Tooth Info - Only show when not global */}
                {!therapy.isGlobal && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{t("components.therapyViewModal.tooth")}:</span>
                      <span className="text-lg font-semibold">{therapy.toothNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{t("components.therapyViewModal.toothType")}:</span>
                      <Badge variant="secondary">
                        {therapy.toothType === "deciduous" ? t("components.therapyViewModal.deciduous") : t("components.therapyViewModal.permanent")}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{t("components.therapyViewModal.toothParts")}:</span>
                      <div className="flex flex-wrap gap-1">
                        {(therapy.toothAreas || (therapy.toothArea ? [therapy.toothArea] : [])).map((area: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                        {(!therapy.toothAreas || therapy.toothAreas.length === 0) && (!therapy.toothArea) && (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center gap-2">
                  <span className="font-medium">{t("components.therapyViewModal.entryType")}:</span>
                  <Badge variant="outline">{therapy.entryType}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{t("components.therapyViewModal.dgGroup")}:</span>
                  <span>{therapy.dgGroupName || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{t("components.therapyViewModal.dgValue")}:</span>
                  <span>{therapy.dgValue || "N/A"}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-medium">{t("components.therapyViewModal.therapies")}:</span>
                  <div className="flex flex-wrap gap-2">
                    {(therapy.therapies || (therapy.thGroupName && therapy.thValue ? [{ thGroupName: therapy.thGroupName, thValue: therapy.thValue }] : [])).map((therapyItem: { thGroupName: string; thValue: string }, index: number) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {therapyItem.thGroupName}: {therapyItem.thValue}
                      </Badge>
                    ))}
                    {(!therapy.therapies || therapy.therapies.length === 0) && (!therapy.thGroupName || !therapy.thValue) && (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{t("components.therapyViewModal.price")}:</span>
                  <span>{therapy.price || "N/A"}</span>
                </div>
              </div>

              {therapy.notes && (
                <div className="mt-4">
                  <span className="font-medium">{t("components.therapyViewModal.notes")}:</span>
                  <p className="mt-2 p-3 bg-gray-50 rounded-lg text-gray-700">
                    {therapy.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Appointment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t("components.therapyViewModal.appointmentInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{t("components.therapyViewModal.date")}:</span>
                  <span>
                    {format(new Date(therapy.appointment.startTime), "PPP", { locale: getDateFnsLocale(i18n.language) })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{t("components.therapyViewModal.time")}:</span>
                  <span>
                    {format(new Date(therapy.appointment.startTime), "HH:mm", { locale: getDateFnsLocale(i18n.language) })} -
                    {format(new Date(therapy.appointment.endTime), "HH:mm", { locale: getDateFnsLocale(i18n.language) })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{t("components.therapyViewModal.service")}:</span>
                  <span>{translateTreatment(therapy.appointment.dentalService, t)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{t("components.therapyViewModal.chair")}:</span>
                  <span>{therapy.appointment.chair}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{t("components.therapyViewModal.status")}:</span>
                  {getStatusBadge(therapy.appointment.status, t)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{t("components.therapyViewModal.type")}:</span>
                  {getTypeBadge(therapy.appointment.treatmentType, t)}
                </div>
                <div className="mt-4 col-span-1 md:col-span-2">
                  <span className="font-medium">{t("components.therapyViewModal.appointmentNotes")}:</span>
                  <p className="mt-2 p-3 bg-gray-50 rounded-lg text-gray-700">
                    {therapy.appointment.notes ?? t("components.therapyViewModal.noNotes")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dentist Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                {t("components.therapyViewModal.dentistInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{t("components.therapyViewModal.fullName")}:</span>
                  <span>
                    Dr {therapy.appointment.dentist.firstName} {therapy.appointment.dentist.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{t("components.therapyViewModal.phone")}:</span>
                  <span>{therapy.appointment.dentist.phone || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{t("components.therapyViewModal.email")}:</span>
                  <span>{therapy.appointment.dentist.email || "N/A"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                {t("components.therapyViewModal.patientInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{t("components.therapyViewModal.fullName")}:</span>
                  <span>
                    {therapy.patientMedicalCard.firstName} {therapy.patientMedicalCard.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{t("components.therapyViewModal.phone")}:</span>
                  <span>{therapy.patientMedicalCard.phoneNumbers[0].phonenumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{t("components.therapyViewModal.address")}:</span>
                  <span>{therapy.patientMedicalCard.address || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{t("components.therapyViewModal.email")}:</span>
                  <span>{therapy.patientMedicalCard.email || "N/A"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
} 