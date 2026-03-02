import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetPatientById } from "@/hooks/patients/useGetPatientById";
import { useGetAppointmentsByPatientID } from "@/hooks/appointments/useGetAppointmentsByPatientID";
import { useGetMedicalConditions } from "@/hooks/patients/useGetMedicalConditions";
import { useDeleteMedicalCondition } from "@/hooks/patients/useDeleteMedicalCondition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/loading";
import { User, Calendar, Phone, Mail, MapPin, Plus, Activity } from "lucide-react";
import MedicalConditionModal from "@/components/modal/Patient/MedicalConditionModal";
import { MedicalCondition } from "@/types/MedicalCondition";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useMedicalConditionModal } from "@/hooks/store/useMedicalConditionModal";
import { useTranslation } from "react-i18next";
import { translateTreatment } from "@/lib/utils";

export default function PatientDetailsPage() {
  const { t, i18n } = useTranslation();
  const { id: patientId } = useParams();

  if (!patientId) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center">
        <p className="text-gray-600">{t("patientDetails.invalidPatientId")}</p>
      </div>
    );
  }

  const [deletingCondition, setDeletingCondition] = useState<MedicalCondition | null>(null);
  const { data: medicalConditions } = useGetMedicalConditions();
  const { openModal } = useMedicalConditionModal();
  const deleteMedicalCondition = useDeleteMedicalCondition();

  const confirmDelete = () => {
    if (deletingCondition) {
      deleteMedicalCondition.mutate(deletingCondition.id, {
        onSuccess: () => {
          setDeletingCondition(null);
        },
      });
    }
  };

  const { data: patient, isLoading, error } = useGetPatientById();

  const { data: appointments } = useGetAppointmentsByPatientID(
    1,
    5,
    "completed"
  );

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8">
        <Loading size="md" showLogo={false} />
      </div>
    );
  }

  if (error || !patient) {
    console.error("Error loading patient:", error);
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center">
        <p className="text-red-600">
          {t("patientDetails.errorLoading")}:
          <br />
          {error?.message || t("patientDetails.unknownError")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Patient Info & Medical Conditions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Information Card */}
          <Card className="shadow-xl border-0 bg-white">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-xl lg:text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <User className="h-5 w-5" />
                {t("patientDetails.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
                  <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{t("patientDetails.birthDate")}</p>
                    <p className="font-medium text-gray-900">
                      {new Date(patient.birthDate).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'sr-RS', {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50/50 rounded-lg">
                  <Phone className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{t("patientDetails.phones")}</p>
                    <div className="space-y-1">
                      {patient.phoneNumbers?.map((phone, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 text-sm">{phone.phonenumber}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
                  <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{t("patientDetails.email")}</p>
                    <p className="font-medium text-gray-900">{patient.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50/50 rounded-lg">
                  <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{t("patientDetails.address")}</p>
                    <p className="font-medium text-gray-900">{patient.address}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Conditions Card */}
          <Card className="shadow-xl border-0 bg-white">
            <CardHeader className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                  <CardTitle className="text-xl lg:text-2xl font-semibold text-gray-800 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-red-500" />
                  {t("patientDetails.medicalCondition")}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openModal}
                  className="bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t("patientDetails.addCondition")}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0">
              {medicalConditions && medicalConditions.length > 0 ? (
                <div className="space-y-3">
                  {medicalConditions.map((patientCondition) => (
                    <div key={patientCondition.id} className="p-4 bg-red-50/50 border border-red-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-red-800 text-sm mb-1">
                            {patientCondition.name}
                          </h4>
                          {patientCondition.description && (
                            <p className="text-sm text-red-600">
                              {patientCondition.description}
                            </p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeletingCondition(patientCondition)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-100"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                  <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="italic">{t("patientDetails.noConditions")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Recent Treatments */}
        <div className="lg:col-span-2">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm h-fit">
            <CardHeader className="p-4 lg:p-6">
                <CardTitle className="text-xl lg:text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t("patientDetails.recentTreatments")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0">
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {appointments?.data && appointments.data.length > 0 ? (
                  appointments.data.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 border border-blue-200/50 rounded-lg hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {translateTreatment(appointment.dentalService, t)}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {new Date(appointment.startTime).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'sr-RS', {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Dr {appointment.dentist.firstName} {appointment.dentist.lastName}</span>
                            <span>•</span>
                            <span>{appointment.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="italic">{t("patientDetails.noRecentTreatments")}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Medical Condition Modal */}
      <MedicalConditionModal />
 

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deletingCondition}
        onOpenChange={() => setDeletingCondition(null)}
        onConfirm={confirmDelete}
        title={t("patientDetails.deleteCondition")}
        description={t("patientDetails.deleteConditionConfirm", { name: deletingCondition?.name || "" })}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        variant="destructive"
      />
    </div>
  );
}
