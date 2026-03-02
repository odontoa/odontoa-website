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

export const useGetAppointmentsByDentistID = () => {
  return useQuery<AppointmentsResponse, Error>({
    queryKey: ["appointments"],
    queryFn: async () => {
      const response = await api.get("appointments?limit=5&sortBy=updatedAt&order=DESC");
      return response.data;
    },
  });
};
