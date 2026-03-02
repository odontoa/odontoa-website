import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import { useParams } from "react-router-dom";
import { TherapyRecord } from "@/types/ToothRecords";

interface TherapyRecordsParams {
  toothNumber?: number | null;
  limit?: number;
  page?: number;
  filter?: string;
  dentistId?: string;
  treatmentType?: string;
  status?: string;
}

interface TherapyRecordsResponse {
  data: TherapyRecord[];
  totalElements: number;
  totalPages: number;
  pageSize: number;
  pageNumber: number;
}

const buildQueryString = (params: Record<string, any>): string => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value.toString());
    }
  });

  return queryParams.toString();
};

export const useGetTherapyRecordsByPatientID = (
  params: TherapyRecordsParams = {}
) => {
  const { id } = useParams();
  
  const {
    toothNumber = null,
    limit = 15,
    page = 0,
    filter = "",
    dentistId = "",
    treatmentType = "",
    status = ""
  } = params;

  return useQuery<TherapyRecordsResponse, Error>({
    queryKey: [
      "therapyRecords",
      "patientMedicalCards",
      id,
      toothNumber,
      limit,
      page,
      filter,
      dentistId,
      treatmentType,
      status,
    ],
    queryFn: async () => {
      if (!id) {
        throw new Error("Patient ID is required");
      }

      const queryString = buildQueryString({
        toothNumber,
        limit,
        page,
        filter,
        dentistId,
        treatmentType,
        status
      });

      const url = `patientMedicalCard/${id}/therapyRecords${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url);
      return response.data;
    },
    enabled: !!id,
  });
};
