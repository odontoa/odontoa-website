import api from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeletePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number ) => {
      const response = await api.delete(`patientMedicalCard/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast("Pacijent uspesno izbrisan");
      queryClient.invalidateQueries({ queryKey: ["patientMedicalCards"] });
    },
    onError: (error: any) => {
      // Extract error message from API response
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Greška prilikom brisanja pacijenta.";
      
      toast.error(errorMessage);
    },
  });
};
