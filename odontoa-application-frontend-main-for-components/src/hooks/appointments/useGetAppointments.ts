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

export const useGetAppointments = (start: Date, end: Date, chair: string) => {
  return useQuery<AppointmentsResponse, Error>({
    queryKey: ["appointments", start, end, chair],
    queryFn: async () => {
      const response = await api.get(`appointments?limit=100`, {
        params: {
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          chair: chair,
        },
      });
      return response.data;
    },
  });
};
