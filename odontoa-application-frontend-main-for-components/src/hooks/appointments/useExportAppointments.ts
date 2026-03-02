import { useMutation } from "@tanstack/react-query";
import api from "@/api/axios";

export interface ExportAppointmentsParams {
  period: "daily" | "weekly" | "monthly" | "all";
  format: "csv";
  startDate?: string;
  endDate?: string;
  status?: string;
  dentistId?: number;
  chair?: number;
  treatmentType?: string;
  patientId?: number;
  patientName?: string;
}

export const useExportAppointments = () => {
  return useMutation({
    mutationFn: async (params: ExportAppointmentsParams) => {
      const { patientName, ...rest } = params;
      const response = await api.post("appointments/export/csv", rest, {
        responseType: "blob",
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Create blob and download file
      const blob = new Blob([data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      // Generate filename: ime-prezime-period-vreme-od-vreme-do
      let filename = "";
      
      // Translate period to Serbian
      const periodTranslations = {
        daily: 'dnevni',
        weekly: 'nedeljni', 
        monthly: 'mesecni',
        all: 'sve-vreme'
      };
      
      const serbianPeriod = periodTranslations[variables.period] || variables.period;
      
      if (variables.patientId && variables.patientName) {
        // Specific patient: ime-prezime-period-vreme-od-vreme-do
        const cleanName = variables.patientName.replace(/\s+/g, '-').toLowerCase();
        filename = `${cleanName}-${serbianPeriod}`;
      } else {
        // All patients: svi-pacijenti-period-vreme-od-vreme-do
        filename = `svi-pacijenti-${serbianPeriod}`;
      }
      
      if (variables.startDate && variables.endDate) {
        const startDate = variables.startDate.replace(/-/g, '');
        const endDate = variables.endDate.replace(/-/g, '');
        filename += `-${startDate}-${endDate}`;
      } else {
        // Add current date as fallback
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0].replace(/-/g, '');
        filename += `-${currentDate}`;
      }
      
      filename += '.csv';
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
};
