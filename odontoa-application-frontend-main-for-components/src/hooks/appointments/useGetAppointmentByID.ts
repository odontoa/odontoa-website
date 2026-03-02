import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import type { Appointment } from "@/types/Appointment";

export const useGetAppointmentByID = (appointmentId: number) => {
  return useQuery<Appointment, Error>({
    queryKey: ["appointments", appointmentId],
    queryFn: async () => {
      const response = await api.get(`/appointments/${appointmentId}`);
      return response.data;
    },
  });
};
