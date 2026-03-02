import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Plus, Check, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { AppointmentSummary } from "@/components/appointments/AppointmentSummary";
import { TreatmentList } from "@/components/appointments/TreatmentList";
import { TreatmentWizard } from "@/components/appointments/TreatmentWizard";
import { useGetAppointmentByID } from "@/hooks/appointments/useGetAppointmentByID";
import { useGetClinicById } from "@/hooks/clinics/useGetClinicById";
import { useCreateToothRecordsBulk } from "@/hooks/patients/useCreateToothRecordsBulk";
import { useUpdateAppointment } from "@/hooks/appointments/useUpdateAppointment";
import { formatCurrency } from "@/lib/utils";
import type { ToothTreatmentFormData } from "@/lib/schemas";

export function CompleteAppointmentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const appointmentId = id ? parseInt(id) : 0;

  const { data: appointment, isLoading } = useGetAppointmentByID(appointmentId);
  const { data: clinic } = useGetClinicById();
  const { mutate: createToothRecords, isPending: isCreating } = useCreateToothRecordsBulk();
  const { mutate: updateAppointment, isPending: isUpdating } = useUpdateAppointment();

  const [treatments, setTreatments] = useState<ToothTreatmentFormData[]>([]);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddTreatment = () => {
    setEditingIndex(null);
    setIsWizardOpen(true);
  };

  const handleEditTreatment = (index: number) => {
    setEditingIndex(index);
    setIsWizardOpen(true);
  };

  const handleDeleteTreatment = (index: number) => {
    setTreatments(treatments.filter((_, i) => i !== index));
    toast.success(t("messages.treatmentDeleted") || "Treatment deleted");
  };

  const handleSaveTreatment = (treatment: ToothTreatmentFormData) => {
    if (editingIndex !== null) {
      // Edit existing treatment
      const updatedTreatments = [...treatments];
      updatedTreatments[editingIndex] = treatment;
      setTreatments(updatedTreatments);
      toast.success(t("messages.treatmentUpdated") || "Treatment updated");
    } else {
      // Add new treatment
      setTreatments([...treatments, treatment]);
      toast.success(t("messages.treatmentAdded") || "Treatment added");
    }
    setIsWizardOpen(false);
    setEditingIndex(null);
  };

  const handleCancelWizard = () => {
    setIsWizardOpen(false);
    setEditingIndex(null);
  };

  const calculateTotalPrice = () => {
    return treatments.reduce((total, treatment) => {
      return total + (treatment.price ? parseFloat(treatment.price) : 0);
    }, 0);
  };

  const handleCompleteAppointment = () => {
    if (!appointment?.id) return;

    if (treatments.length === 0) {
      toast.error(t("validation.addAtLeastOneTreatment"));
      return;
    }

    // Process treatments to set price as undefined when not entered
    // and exclude toothNumber and toothAreas for global procedures
    // For whole tooth treatments, exclude toothAreas but keep toothNumber
    const processedTreatments = treatments.map((treatment) => {
      const baseTreatment: any = {
        ...treatment,
        price:
          treatment.price && treatment.price.trim() !== ""
            ? treatment.price
            : undefined,
      };

      // For global procedures, exclude toothNumber and toothAreas
      if (treatment.isGlobal) {
        delete baseTreatment.toothNumber;
        delete baseTreatment.toothAreas;
      }

      // For whole tooth treatments, set toothAreas to empty array but keep toothNumber
      if (treatment.isWholeTooth) {
        baseTreatment.toothAreas = [];
      }

      return baseTreatment;
    });

    createToothRecords(
      {
        data: processedTreatments,
        patientId: appointment.patientMedicalCard.id,
        appointmentId: appointment.id,
      },
      {
        onSuccess: () => {
          updateAppointment(
            {
              data: {
                status: "completed",
              },
              appointmentId: appointment.id,
            },
            {
              onSuccess: () => {
                toast.success(t("messages.appointmentCompletedSuccess") || "Appointment completed successfully");
                navigate("/appointments");
              },
              onError: () => {
                toast.error(t("messages.appointmentUpdatedError"));
              },
            }
          );
        },
        onError: () => {
          toast.error(t("messages.errorCreatingTreatment"));
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg">{t("common.loading")}</p>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6">
          <p className="text-lg text-red-600">{t("errors.appointmentNotFound") || "Appointment not found"}</p>
          <Button onClick={() => navigate("/appointments")} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("appointments.backToAppointments")}
          </Button>
        </Card>
      </div>
    );
  }

  const totalPrice = calculateTotalPrice();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/appointments")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("common.back")}
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t("appointments.completeAppointment")}
              </h1>
              <p className="text-gray-600 mt-1">
                {t("appointments.addTreatmentsAndComplete") || "Add treatments and complete the appointment"}
              </p>
            </div>
          </div>
        </div>

        {/* Appointment Summary */}
        <AppointmentSummary
          appointment={appointment}
          currency={clinic?.currency || "RSD"}
        />

        {/* Wizard or Treatment List */}
        {isWizardOpen ? (
          <TreatmentWizard
            onSave={handleSaveTreatment}
            onCancel={handleCancelWizard}
            initialData={editingIndex !== null ? treatments[editingIndex] : undefined}
            currency={clinic?.currency || "RSD"}
            patientId={appointment?.patientMedicalCard?.id}
          />
        ) : (
          <>
            {/* Add Treatment Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {t("appointments.treatmentsByTeeth")}
              </h2>
              <Button
                onClick={handleAddTreatment}
                className="flex items-center gap-2"
                disabled={appointment.status === "completed" || appointment.status === "canceled"}
              >
                <Plus className="h-4 w-4" />
                {t("appointments.addTreatment")}
              </Button>
            </div>

            {/* Treatment List */}
            <TreatmentList
              treatments={treatments}
              onEdit={handleEditTreatment}
              onDelete={handleDeleteTreatment}
              currency={clinic?.currency || "RSD"}
            />
          </>
        )}

        {/* Summary and Complete Button */}
        {!isWizardOpen && treatments.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">
                    {t("appointments.totalTreatments")}:{" "}
                    <span className="font-bold text-gray-900">{treatments.length}</span>
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {t("appointments.totalPrice")}:{" "}
                    <span className="text-green-600 text-2xl">
                      {formatCurrency(totalPrice, clinic?.currency || "RSD")}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <Button
                    onClick={handleCompleteAppointment}
                    disabled={isCreating || isUpdating || appointment.status === "completed"}
                    className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6"
                  >
                    <Check className="h-5 w-5 mr-2" />
                    {isCreating || isUpdating
                      ? t("common.loading")
                      : t("appointments.completeAndSaveTreatment")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

