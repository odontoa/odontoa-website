import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import { toast } from "sonner";

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (appointmentId: number) => {
      const response = await api.delete(`/appointments/${appointmentId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Termin je uspešno obrisan");
      queryClient.invalidateQueries({ queryKey: ["appointmentsByPatient"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error: any) => {
      // Extract error message from API response
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Greška pri brisanju termina";
      
      toast.error(errorMessage);
    },
  });
}; 