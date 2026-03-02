import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import { ReportResponse } from "@/types/Report";

export const useGetReportsByPatientId = (patientId: number) => {
  return useQuery<ReportResponse, Error>({
    queryKey: ["reports", patientId],
    queryFn: async () => {
      const response = await api.get(`patientMedicalCard/${patientId}/reports`);
      return response.data;
    },
    enabled: !!patientId,
  });
};
