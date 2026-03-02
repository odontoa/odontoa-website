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

export const useGetTodayAppointments = () => {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

  return useQuery<AppointmentsResponse, Error>({
    queryKey: ["todayAppointments"],
    queryFn: async () => {
      const response = await api.get(`appointments?limit=15`, {
        params: {
          startTime: startOfDay.toISOString(),
          endTime: endOfDay.toISOString(),
        },
      });
      return response.data;
    },
  });
}; 