import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import type { Patient } from "@/types/Patient";
import { useAuth } from "@/auth/AuthProvider";

type PatientResponse = {
  data: Patient[];
  totalElements: number;
  totalPages: number;
  pageSize: number;
  pageNumber: number;
};

export const useGetAllPatients = () => {
  const { user } = useAuth();
  const clinicId = user?.clinicId;

  return useQuery<Patient[], Error>({
    queryKey: ["allPatients", clinicId],
    queryFn: async () => {
      const allPatients: Patient[] = [];
      let page = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        const response = await api.get(
          `patientMedicalCard?page=${page}&pageSize=100&filter=`
        );
        const data: PatientResponse = response.data;
        
        allPatients.push(...data.data);
        
        // Check if there are more pages
        hasMorePages = page < data.totalPages;
        page++;
      }

      return allPatients;
    },
    enabled: !!clinicId,
    staleTime: 5 * 60 * 1000,
  });
};
