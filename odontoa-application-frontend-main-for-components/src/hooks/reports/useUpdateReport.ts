import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import { Report } from "@/types/Report";
import { toast } from "sonner";

export const useUpdateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Report> }) => {
      const response = await api.put(`reports/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["patient"] });
      toast.success("Izveštaj je uspešno ažuriran");
    },
    onError: (error: any) => {
      console.error("Error updating report:", error);
      toast.error("Greška pri ažuriranju izveštaja");
    },
  });
};
