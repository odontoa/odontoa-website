import api from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ToothTreatmentFormData } from "@/lib/schemas";

type FormData = ToothTreatmentFormData[];

export const useCreateToothRecordsBulk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      patientId,
      appointmentId,
    }: {
      data: FormData;
      patientId: number;
      appointmentId: number;
    }) => {
      const response = await api.post(
        `patientMedicalCard/${patientId}/appointments/${appointmentId}/therapyRecordsBulk`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      toast("Terapijski zapis uspesno dodat");
      queryClient.invalidateQueries({ queryKey: ["therapyRecords"] });
    },
    onError: (error) => {
      toast(error.message || "Greška prilikom dodavanja pacijenta.");
    },
  });
};
