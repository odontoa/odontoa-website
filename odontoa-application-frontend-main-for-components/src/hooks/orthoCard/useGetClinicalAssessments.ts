import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import { useParams } from "react-router-dom";

interface ClinicalAssessmentResponse {
  id: number;
  clinicalAssessment: {
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
      frenulum?: {
        gornjiLabijalni: boolean;
        donjiLabijalni: boolean;
        labijalni: boolean;
      };
      dentalMidlines?: string;
      incisalStep?: string;
      angleClassification?: string;
      buccalOcclusion?: string;
      mandibularMobility?: string;
    };
    functionalAssessment: {
      prematureContact?: string;
      swallowing?: string;
      speech?: string;
      forcedBite?: string;
      breathing?: string;
      notes?: string;
      chewingMasseter?: string;
      chewingTemporalis?: string;
    };
  };
  patientMedicalCardId: number;
  updatedAt?: string;
}

export const useGetClinicalAssessments = () => {
  const { id } = useParams();

  return useQuery<ClinicalAssessmentResponse, Error>({
    queryKey: ["clinicalAssessments"],
    queryFn: async () => {
      const response = await api.get(
        `patientMedicalCard/${id}/clinicalAssessments`
      );
      return response.data;
    },
  });
};
