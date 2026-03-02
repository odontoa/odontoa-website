import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import { toast } from "sonner";

export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`reports/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["patient"] });
      toast.success("Izveštaj je uspešno obrisan");
    },
    onError: (error: any) => {
      console.error("Error deleting report:", error);
      toast.error("Greška pri brisanju izveštaja");
    },
  });
};
