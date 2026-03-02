import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  XCircle,
  User,
  Stethoscope,
  Clock,
  AlertCircle,
  Info,
  Calendar,
} from "lucide-react";
import { CancellationReason } from "@/types/Appointment";
import { useTranslation } from "react-i18next";

interface CancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: CancellationReason, notes?: string) => void;
  appointmentData?: {
    patientName: string;
    date: string;
    time: string;
    service: string;
  };
  isLoading?: boolean;
}

export const CancellationModal = ({
  isOpen,
  onClose,
  onConfirm,
  appointmentData,
  isLoading = false,
}: CancellationModalProps) => {
  const { t } = useTranslation();
  const [selectedReason, setSelectedReason] = useState<CancellationReason | "">("");
  const [notes, setNotes] = useState("");

  const handleConfirm = () => {
    if (selectedReason) {
      onConfirm(selectedReason as CancellationReason, notes.trim() || undefined);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedReason("");
    setNotes("");
    onClose();
  };

  const reasons = [
    { value: "patient_canceled", label: t("appointments.patientCanceled"), icon: User },
    { value: "doctor_canceled", label: t("appointments.doctorCanceled"), icon: Stethoscope },
    { value: "patient_late", label: t("appointments.patientLate"), icon: Clock },
    { value: "emergency", label: t("appointments.emergency"), icon: AlertCircle },
    { value: "other", label: t("appointments.other"), icon: Info },
  ] as const;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-700">
            <XCircle className="h-6 w-6" />
            {t("components.cancellationModal.cancelingAppointment")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Appointment Info */}
          {appointmentData && (
            <div className="p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-800">{t("components.cancellationModal.appointmentDetails")}</span>
              </div>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="font-medium">{t("components.cancellationModal.patient")}:</span> {appointmentData.patientName}
                </div>
                <div>
                  <span className="font-medium">{t("components.cancellationModal.date")}:</span> {appointmentData.date}
                </div>
                <div>
                  <span className="font-medium">{t("components.cancellationModal.time")}:</span> {appointmentData.time}
                </div>
                <div>
                  <span className="font-medium">{t("components.cancellationModal.service")}:</span> {appointmentData.service}
                </div>
              </div>
            </div>
          )}

          {/* Reason Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              {t("components.cancellationModal.selectReason")} <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={selectedReason} 
              onValueChange={(value) => setSelectedReason(value as CancellationReason)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("components.cancellationModal.selectReasonPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {reasons.map((reason) => {
                  const Icon = reason.icon;
                  return (
                    <SelectItem key={reason.value} value={reason.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {reason.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Additional Notes */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              {t("components.cancellationModal.additionalNotes")}
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("components.cancellationModal.additionalNotesPlaceholder")}
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              {t("components.cancellationModal.cancel")}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedReason || isLoading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? t("components.cancellationModal.canceling") : t("components.cancellationModal.cancelAppointment")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
