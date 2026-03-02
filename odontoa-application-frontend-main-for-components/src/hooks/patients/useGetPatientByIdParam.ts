import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import type { Patient } from "@/types/Patient";

export const useGetPatientByIdParam = (patientId: string | null) => {
  return useQuery<Patient, Error>({
    queryKey: ["patient", patientId],
    queryFn: async () => {
      if (!patientId) {
        throw new Error("Patient ID is required");
      }
      const response = await api.get(`/patientMedicalCard/${patientId}`);
      return response.data;
    },
    enabled: !!patientId,
  });
};
