import api from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

type FormData = {
  xrayType: string;
  description?: string | null;
  imageFile: File | null;
};

export const useCreateXrayImages = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();

  return useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new FormData();

      formData.append("xrayType", data.xrayType);
      data.imageFile && formData.append("file", data.imageFile);
      data.description && formData.append("description", data.description);

      const response = await api.post(
        `patientMedicalCard/${id}/xray-images`,
        formData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["xray-images"] });
    },
  });
};
