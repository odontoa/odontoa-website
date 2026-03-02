import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import { useParams } from "react-router-dom";
import { XrayImage } from "@/types/XrayImages";

export const useGetXrayImages = () => {
  const { id } = useParams();

  return useQuery<XrayImage[], Error>({
    queryKey: ["xray-images"],
    queryFn: async () => {
      const response = await api.get(`patientMedicalCard/${id}/xray-images`);
      return response.data;
    },
  });
};
