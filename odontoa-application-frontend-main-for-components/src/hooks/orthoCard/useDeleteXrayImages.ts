import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export const useDeleteXrayImages = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();

  return useMutation<void, Error, number>({
    mutationFn: async (imageId: number) => {
      if (!id) {
        throw new Error("Patient ID is required");
      }

      await api.delete(
        `patientMedicalCard/${id}/xray-images/${imageId}`
      );
    },
    onSuccess: () => {
      toast.success("X-Ray snimak uspešno obrisan");
      queryClient.invalidateQueries({ queryKey: ["xray-images"] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Greška prilikom brisanja X-Ray snimka.";
      toast.error(errorMessage);
    },
  });
};
