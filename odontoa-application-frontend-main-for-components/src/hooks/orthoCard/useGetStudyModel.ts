import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import { useParams } from "react-router-dom";
import { StudyModel } from "@/types/StudyModel";

export const useGetStudyModel = () => {
  const { id } = useParams();

  return useQuery<StudyModel, Error>({
    queryKey: ["studyModel"],
    queryFn: async () => {
      const response = await api.get(`patientMedicalCard/${id}/studyModel`);
      return response.data;
    },
  });
};
