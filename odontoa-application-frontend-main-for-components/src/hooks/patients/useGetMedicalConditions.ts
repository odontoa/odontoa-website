import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import { useParams } from "react-router-dom";
import { MedicalCondition } from "@/types/MedicalCondition";

export const useGetMedicalConditions = () => {
  const { id } = useParams();

  return useQuery<MedicalCondition[], Error>({
    queryKey: ["medicalConditions", id],
    queryFn: async () => {
      if (!id) {
        throw new Error("Patient ID is required");
      }

      const response = await api.get(
        `patientMedicalCard/${id}/medicalConditions`
      );
      return response.data;
    },
    enabled: !!id,
  });
}; 