import api from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

type FormData = {
  photoType: string;
  category: string;
  description?: string | null;
  imageFile: File | null;
};

export const useCreatePhotos = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();

  return useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new FormData();

      formData.append("photoType", data.photoType);
      formData.append("category", data.category);
      data.description && formData.append("description", data.description);
      data.imageFile && formData.append("file", data.imageFile);

      const response = await api.post(
        `patientMedicalCard/${id}/photos`,
        formData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] });
    },
  });
};
