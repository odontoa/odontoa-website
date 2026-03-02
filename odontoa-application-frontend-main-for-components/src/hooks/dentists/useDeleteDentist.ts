import api from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteDentist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`dentists/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast("Doktor uspesno izbrisan");
      queryClient.invalidateQueries({ queryKey: ["dentists"] });
    },
    onError: (error: any) => {
      // Extract error message from API response
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Greška prilikom brisanja doktora.";
      
      toast.error(errorMessage);
    },
  });
};
