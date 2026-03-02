import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import { toast } from "sonner";
import { ToothTreatmentFormData } from "@/lib/schemas";

export const useUpdateTherapy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      therapyId, 
      data 
    }: { 
      therapyId: number; 
      data: ToothTreatmentFormData; 
    }) => {
      const response = await api.patch(`patientMedicalCard/therapyRecords/${therapyId}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Terapija uspešno ažurirana");
      queryClient.invalidateQueries({ queryKey: ["therapyRecords"] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Greška prilikom ažuriranja terapije.";

      toast.error(errorMessage);
    },
  });
}; 