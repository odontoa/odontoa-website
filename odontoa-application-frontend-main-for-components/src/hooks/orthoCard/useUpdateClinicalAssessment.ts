import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

interface FormData {
  facialFeatures: {
    face?: string | null;
    lips?: string | null;
    nasolabialSulcus?: string | null;
    mentolabialSulcus?: string | null;
    profile?: string | null;
    biometricField?: string | null;
  };
  oralFeatures: {
    hygiene?: string | null;
    frenulum?: {
      gornjiLabijalni: boolean | null;
      donjiLabijalni: boolean | null;
      labijalni: boolean | null;
    };
    dentalMidlines?: string | null;
    angleClassification?: string | null;
    incisalStep?: string | null;
    buccalOcclusion?: string | null;
  };
  functionalAssessment: {
    notes?: string | null;
    speech?: string | null;
    chewingTemporalis?: string | null;
    chewingMasseter?: string | null;
    swallowing?: string | null;
    breathing?: string | null;
    prematureContact?: string | null;
    forcedBite?: string | null;
    mandibularMobility?: string | null;
  };
}

export const useUpdateClinicalAssessment = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.patch(
        `patientMedicalCard/${id}/clinicalAssessments`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      toast("Clinical Assessment je uspesno azuriran");
      queryClient.invalidateQueries({ queryKey: ["clinicalAssessments"] });
    },
  });
};
