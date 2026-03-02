import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import { ReportRequest } from "@/types/Report";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

export const useCreateReport = () => {
  const queryClient = useQueryClient();

  const { id } = useParams();

  return useMutation({
    mutationFn: async (data: ReportRequest) => {
      const response = await api.post(`patientMedicalCard/${id}/reports`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["patient"] });
      toast.success("Izveštaj je uspešno sačuvan");
    },
    onError: (error: any) => {
      console.error("Error creating report:", error);
      toast.error("Greška pri čuvanju izveštaja");
    },
  });
};
