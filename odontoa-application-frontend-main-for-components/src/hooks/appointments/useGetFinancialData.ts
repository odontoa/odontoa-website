import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import type { Appointment } from "@/types/Appointment";

export type AppointmentsResponse = {
  data: Appointment[];
  totalElements: number;
  totalPages: number;
  pageSize: number;
  pageNumber: number;
};

export interface FinancialDataParams {
  startDate: Date;
  endDate: Date;
  dentistId?: number;
  patientId?: number;
  chair?: number;
}

export const useGetFinancialData = (params: FinancialDataParams) => {
  return useQuery<AppointmentsResponse, Error>({
    queryKey: ["financialData", params.startDate, params.endDate, params.dentistId, params.patientId, params.chair],
    queryFn: async () => {
      const requestParams: any = {
        limit: 1000,
        startTime: params.startDate.toISOString(),
        endTime: params.endDate.toISOString(),
        status: "completed", // Only completed appointments count for earnings
      };

      if (params.dentistId) {
        requestParams.dentistId = params.dentistId;
      }

      if (params.patientId) {
        requestParams.patientId = params.patientId;
      }

      if (params.chair) {
        requestParams.chair = params.chair;
      }

      const response = await api.get(`appointments`, {
        params: requestParams,
      });
      return response.data;
    },
    enabled: !!params.startDate && !!params.endDate,
  });
};

