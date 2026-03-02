import api from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

type FormData = {
  facialFeatures: {
    face?: string;
    lips?: string;
    nasolabialSulcus?: string;
    mentolabialSulcus?: string;
    profile?: string;
    biometricField?: string;
  };
  oralFeatures: {
    hygiene?: string;
    frenulum?: Record<string, boolean>;
    dentalMidlines?: string;
    angleClassification?: string;
    incisalStep?: string;
    buccalOcclusion?: string;
  };
  functionalAssessment: {
    notes?: string;
    speech?: string;
    chewingTemporalis?: string;
    chewingMasseter?: string;
    swallowing?: string;
    breathing?: string;
    prematureContact?: string;
    forcedBite?: string;
    mandibularMobility?: string;
  };
};

export const useCreateClinicalAssessment = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();

  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.post(
        `patientMedicalCard/${id}/clinicalAssessments`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      toast("Clinical Assessment uspesno dodat");
      queryClient.invalidateQueries({ queryKey: ["clinicalAssessments"] });
    },
    onError: (error) => {
      toast(error.message || "Greška prilikom dodavanja clinical assessmenta.");
    },
  });
};
