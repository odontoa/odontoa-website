import api from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

type FormData = {
  snaAngle?: number | null;
  snbAngle?: number | null;
  anbAngle?: number | null;
  snSppAngle?: number | null;
  snMpAngle?: number | null;
  sppMpAngle?: number | null;
  nsarAngle?: number | null;
  sargoAngle?: number | null;
  argomeAngle?: number | null;
  bjorkPolygonSum?: number | null;
  sgoLength?: number | null;
  nmeLength?: number | null;
  sgoNmeRatio?: number | null;
  iSppAngle?: number | null;
  iMpAngle?: number | null;
  iiAngle?: number | null;
  nseLength?: number | null;
  corpusMaxillaLength?: number | null;
  corpusMandibleLength?: number | null;
  ramusMandibleLength?: number | null;
  analysisDate: Date;
  xrayImage: File | null;
  findings: string | null;
};

export const useCreateCephalometric = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();

  return useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new FormData();

      // Add all measurement fields
      const measurementFields = [
        "snaAngle",
        "snbAngle",
        "anbAngle",
        "snSppAngle",
        "snMpAngle",
        "sppMpAngle",
        "nsarAngle",
        "sargoAngle",
        "argomeAngle",
        "bjorkPolygonSum",
        "sgoLength",
        "nmeLength",
        "sgoNmeRatio",
        "iSppAngle",
        "iMpAngle",
        "iiAngle",
        "nseLength",
        "corpusMaxillaLength",
        "corpusMandibleLength",
        "ramusMandibleLength",
      ];

      measurementFields.forEach((field) => {
        const value = data[field as keyof FormData];
        if (value !== undefined && value !== null) {
          formData.append(field, value.toString());
        }
      });

      formData.append("analysisDate", data.analysisDate.toISOString());

      if (data.findings !== null) {
        formData.append("findings", data.findings);
      }

      if (data.xrayImage) {
        formData.append("xrayImage", data.xrayImage);
      }

      const response = await api.post(
        `patientMedicalCard/${id}/profileCephalometricAnalysis`,
        formData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profileCephalometricAnalysis"] });
    },
  });
};
