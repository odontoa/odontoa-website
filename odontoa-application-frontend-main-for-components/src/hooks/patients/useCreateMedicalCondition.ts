import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import { useParams } from "react-router-dom";
import {  MedicalCondition, MedicalConditionRequest } from "@/types/MedicalCondition";
import { toast } from "sonner";

export const useCreateMedicalCondition = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();

  return useMutation<MedicalCondition, Error, MedicalConditionRequest>({
    mutationFn: async (data: MedicalConditionRequest) => {
      if (!id) {
        throw new Error("Patient ID is required");
      }

      const response = await api.post(
        `patientMedicalCard/${id}/medicalConditions`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      toast("Medicinsko stanje uspešno dodato");
      queryClient.invalidateQueries({ queryKey: ["medicalConditions"] });
    },
    onError: (error) => {
      toast(error.message || "Greška prilikom dodavanja medicinskog stanja.");
    },
  });
}; 