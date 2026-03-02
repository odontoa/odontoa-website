import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import type { Patient } from "@/types/Patient";
import { useParams } from "react-router-dom";

export const useGetPatientById = () => {
  const { id } = useParams();

  return useQuery<Patient, Error>({
    queryKey: ["patient", id],
    queryFn: async () => {
      const response = await api.get(`/patientMedicalCard/${id}`);
      return response.data;
    },
  });
};
