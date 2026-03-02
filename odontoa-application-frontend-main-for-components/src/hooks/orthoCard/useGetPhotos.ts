import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import { useParams } from "react-router-dom";
import { Photos } from "@/types/Photos";

export const useGetPhotos = () => {
  const { id } = useParams();

  return useQuery<Photos[], Error>({
    queryKey: ["photos"],
    queryFn: async () => {
      const response = await api.get(`patientMedicalCard/${id}/photos`);
      return response.data;
    },
  });
};
