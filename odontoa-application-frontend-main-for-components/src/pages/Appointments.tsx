import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import TimelineGrid from "@/components/appointments/TimelineGrid";
import { Button } from "@/components/ui/Button";
import { Plus, Calendar, Clock, Download } from "lucide-react";
import { useTranslation } from "react-i18next";

export const AppointmentsPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Navigate to create page if ?add=true is present
  useEffect(() => {
    if (searchParams.get("add") === "true") {
      navigate("/appointments/create");
    }
  }, [searchParams, navigate]);

  const handleCreateAppointment = () => {
    navigate("/appointments/create");
  };

  const handleExportAppointments = () => {
    navigate("/appointments/export");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-2 lg:p-6 space-y-8">
        {/* Enhanced Header Section */}
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-blue-100 rounded-3xl blur-3xl"></div>

          <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {t("appointments.title")}
                    </h1>
                    <p className="text-gray-600 mt-1 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {t("appointments.subtitle")}
                    </p>
                  </div>
                </div>
              </div>


              <div className="flex gap-3">
                <Button
                  onClick={handleExportAppointments}
                  variant="outline"
                  className="px-6 py-3 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-semibold"
                >
                  <Download className="h-5 w-5" />
                  {t("appointments.exportData")}
                </Button>
                <Button
                  onClick={handleCreateAppointment}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-semibold"
                >
                  <Plus className="h-5 w-5" />
                  {t("appointments.newAppointment")}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <TimelineGrid />
        </div>
      </div>
    </div>
  );
};
