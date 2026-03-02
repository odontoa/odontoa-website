import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export const useDeleteMedicalCondition = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();

  return useMutation<void, Error, number>({
    mutationFn: async (conditionId: number) => {
      if (!id) {
        throw new Error("Patient ID is required");
      }

      await api.delete(
        `patientMedicalCard/${id}/medicalConditions/${conditionId}`
      );
    },
    onSuccess: () => {
      toast("Medicinsko stanje uspešno obrisano");
      queryClient.invalidateQueries({ queryKey: ["medicalConditions"] });
    },
    onError: (error) => {
      toast(error.message || "Greška prilikom brisanja medicinskog stanja.");
    },
  });
}; 