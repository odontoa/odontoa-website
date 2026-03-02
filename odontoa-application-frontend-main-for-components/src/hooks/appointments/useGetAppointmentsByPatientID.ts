import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import type { Appointment, AppointmentStatus } from "@/types/Appointment";
import { useParams } from "react-router-dom";

export type AppointmentsResponse = {
  data: Appointment[];
  totalElements: number;
  totalPages: number;
  pageSize: number;
  pageNumber: number;
};

export const useGetAppointmentsByPatientID = (
  page?: number,
  limit?: number,
  status?: AppointmentStatus,
  filter?: string,
  dentistId?: string
) => {
  const { id } = useParams();

  return useQuery<AppointmentsResponse, Error>({
    queryKey: ["appointmentsByPatient", page, limit, status, filter, dentistId],
    queryFn: async () => {
      const response = await api.get(
        `patientMedicalCard/${id}/appointments?page=${page}&limit=${limit}`,
        {
          params: {
            status: status,
            filter: filter,
            dentistId: dentistId,
          },
        }
      );
      return response.data;
    },
  });
};
