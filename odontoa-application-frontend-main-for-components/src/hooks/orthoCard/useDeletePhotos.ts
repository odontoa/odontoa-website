import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export const useDeletePhotos = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();

  return useMutation<void, Error, number>({
    mutationFn: async (photoId: number) => {
      if (!id) {
        throw new Error("Patient ID is required");
      }

      await api.delete(
        `patientMedicalCard/${id}/photos/${photoId}`
      );
    },
    onSuccess: () => {
      toast.success("Fotografija uspešno obrisana");
      queryClient.invalidateQueries({ queryKey: ["photos"] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Greška prilikom brisanja fotografije.";
      toast.error(errorMessage);
    },
  });
};
