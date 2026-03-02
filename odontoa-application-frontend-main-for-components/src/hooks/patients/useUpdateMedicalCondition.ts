import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import { useParams } from "react-router-dom";
import { MedicalCondition, MedicalConditionRequest } from "@/types/MedicalCondition";
import { toast } from "sonner";

export const useUpdateMedicalCondition = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();

  return useMutation<MedicalCondition, Error, { conditionId: number; data: MedicalConditionRequest }>({
    mutationFn: async ({ conditionId, data }: { conditionId: number; data: MedicalConditionRequest }) => {
      if (!id) {
        throw new Error("Patient ID is required");
      }

      const response = await api.put(
        `patientMedicalCard/${id}/medicalConditions/${conditionId}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      toast("Medicinsko stanje uspešno ažurirano");
      queryClient.invalidateQueries({ queryKey: ["medicalConditions"] });
    },
    onError: (error) => {
      toast(error.message || "Greška prilikom ažuriranja medicinskog stanja.");
    },
  });
}; 