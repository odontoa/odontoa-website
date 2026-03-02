import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import { useParams } from "react-router-dom";
import { CephalometricAnalysis } from "@/types/CephalometricAnalysis";

export const useGetCephalometric = () => {
  const { id } = useParams();

  return useQuery<CephalometricAnalysis, Error>({
    queryKey: ["profileCephalometricAnalysis"],
    queryFn: async () => {
      const response = await api.get(`patientMedicalCard/${id}/profileCephalometricAnalysis`);
      return response.data;
    },
  });
};
