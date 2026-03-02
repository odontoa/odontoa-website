import api from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { ToothTreatmentFormData } from "@/lib/schemas";

export const useCreateToothRecord = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();

  return useMutation({
    mutationFn: async (data: ToothTreatmentFormData) => {
      const response = await api.post(
        `patientMedicalCard/${id}/therapyRecords`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      toast("Terapija uspesno dodata");
      queryClient.invalidateQueries({ queryKey: ["therapyRecords"] });
    },
    onError: (error) => {
      toast(error.message || "Greška prilikom dodavanja terapije.");
    },
  });
};
