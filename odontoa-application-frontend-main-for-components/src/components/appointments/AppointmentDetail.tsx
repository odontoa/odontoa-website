import { useState } from "react";
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  AlertCircle,
  Edit,
  DollarSign,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import { useGetClinicById } from "@/hooks/clinics/useGetClinicById";
import { formatCurrency } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { getDateFnsLocale } from "@/lib/utils";

type AppointmentDetailProps = {
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientImage?: string;
  patientPhone?: string;
  patientEmail?: string;
  procedureType: string;
  procedureDesc?: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: "finished" | "encounter" | "registered" | "canceled";
  doctor: string;
  notes?: string;
  paymentStatus?: "paid" | "unpaid" | "partial";
  price?: number;
  onClose: () => void;
  onEdit?: () => void;
};

export default function AppointmentDetail({
  appointmentId,
  patientId,
  patientName,
  patientImage,
  patientPhone,
  patientEmail,
  procedureType,
  procedureDesc,
  date,
  startTime,
  endTime,
  status,
  doctor,
  notes,
  paymentStatus = "unpaid",
  price,
  onClose,
  onEdit,
}: AppointmentDetailProps) {
  const { t, i18n } = useTranslation();
  const [currentStatus, setCurrentStatus] = useState(status);
  const { data: clinic } = useGetClinicById();

  const formatDate = (date: Date) => {
    return format(date, "EEEE, d MMMM yyyy", { locale: getDateFnsLocale(i18n.language) });
  };

  const handleStatusChange = (
    newStatus: "finished" | "encounter" | "registered" | "canceled"
  ) => {
    setCurrentStatus(newStatus);
  };

  const paymentStatusColors = {
    paid: "bg-green-100 text-green-800",
    unpaid: "bg-red-100 text-red-800",
    partial: "bg-yellow-100 text-yellow-800",
  };

  const paymentStatusText = {
    paid: t("appointmentDetail.paid"),
    unpaid: t("appointmentDetail.unpaid"),
    partial: t("appointmentDetail.partial"),
  };

  const reservationId = `#RSVA${appointmentId.toString().padStart(4, "0")}`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-semibold">{reservationId}</h2>
            <p className="text-sm text-gray-500">{t("appointmentDetail.appointmentDetails")}</p>
          </div>
          <div className="flex items-center gap-3">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Edit size={18} className="text-gray-600" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Status Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-700">{t("appointmentDetail.appointmentStatus")}</h3>
              <select
                value={currentStatus}
                onChange={(e) => handleStatusChange(e.target.value as any)}
                className="text-sm border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="registered">{t("appointmentDetail.registered")}</option>
                <option value="encounter">{t("appointmentDetail.encounter")}</option>
                <option value="finished">{t("appointmentDetail.finished")}</option>
                <option value="canceled">{t("appointmentDetail.canceled")}</option>
              </select>
            </div>
            <div className="flex gap-2 flex-wrap">
              <StatusBadge
                status={currentStatus}
                className="px-3 py-1 text-sm"
              />
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${paymentStatusColors[paymentStatus]}`}
              >
                {paymentStatusText[paymentStatus]}
              </span>
            </div>
          </div>

          {/* Appointment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700 border-b pb-2">
                {t("appointmentDetail.appointmentInfo")}
              </h3>

              <div className="flex gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Calendar size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{t("appointmentDetail.date")}</p>
                  <p className="text-sm text-gray-600">{formatDate(date)}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Clock size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{t("appointmentDetail.time")}</p>
                  <p className="text-sm text-gray-600">
                    {startTime} - {endTime}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <User size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{t("appointmentDetail.doctor")}</p>
                  <p className="text-sm text-gray-600">{doctor}</p>
                </div>
              </div>

              {price !== undefined && (
                <div className="flex gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <DollarSign size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t("appointmentDetail.price")}</p>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(price, clinic?.currency || "RSD")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Patient Info */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700 border-b pb-2">
                {t("appointmentDetail.patientInfo")}
              </h3>

              <div className="flex gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                  {patientImage ? (
                    <img
                      src={patientImage}
                      alt={patientName}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 font-medium">
                      {patientName.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{patientName}</p>
                  <button
                    className="text-xs text-primary hover:underline"
                    onClick={() =>
                      window.open(`/patients/${patientId}`, "_blank")
                    }
                  >
                    {t("appointmentDetail.viewCard")}
                  </button>
                </div>
              </div>

              {patientPhone && (
                <div className="flex gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Phone size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t("appointmentDetail.phone")}</p>
                    <p className="text-sm text-gray-600">{patientPhone}</p>
                  </div>
                </div>
              )}

              {patientEmail && (
                <div className="flex gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Mail size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t("appointmentDetail.email")}</p>
                    <p className="text-sm text-gray-600">{patientEmail}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Treatment Info */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 border-b pb-2 mb-4">
              {t("appointmentDetail.treatmentInfo")}
            </h3>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold">{procedureType}</h4>
              {procedureDesc && (
                <p className="text-sm text-gray-600 mt-1">{procedureDesc}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          {notes && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 border-b pb-2 mb-4">
                {t("appointmentDetail.notes")}
              </h3>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 flex gap-3">
                <AlertCircle
                  size={18}
                  className="text-yellow-600 flex-shrink-0 mt-1"
                />
                <p className="text-sm text-gray-700">{notes}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            {currentStatus !== "canceled" && (
              <button
                onClick={() => handleStatusChange("canceled")}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                {t("appointmentDetail.cancelAppointment")}
              </button>
            )}
            {currentStatus === "registered" && (
              <button
                onClick={() => handleStatusChange("encounter")}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                {t("appointmentDetail.startExamination")}
              </button>
            )}
            {currentStatus === "encounter" && (
              <button
                onClick={() => handleStatusChange("finished")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {t("appointmentDetail.finishExamination")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
