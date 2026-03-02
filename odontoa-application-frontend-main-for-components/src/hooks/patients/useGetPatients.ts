import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
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

// Regular pagination hook
export const useGetPatients = ({
  page = 1,
  search,
  pageSize = 10,
}: {
  page?: number;
  search?: string;
  pageSize?: number;
}) => {
  const { user } = useAuth();

  const clinicId = user?.clinicId;

  return useQuery<PatientResponse, Error>({
    queryKey: ["patientMedicalCards", search, page, clinicId],
    queryFn: async () => {
      const response = await api.get(
        `patientMedicalCard?page=${page}&pageSize=${pageSize}&filter=${search || ""}`
      );
      return response.data;
    },
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });
};

// Infinite scroll hook
export const useGetPatientsInfinite = ({
  search,
  pageSize = 10,
}: {
  search?: string;
  pageSize?: number;
}) => {
  const { user } = useAuth();
  const clinicId = user?.clinicId;

  return useInfiniteQuery<PatientResponse, Error>({
    queryKey: ["patientsInfinite", search, clinicId],
    queryFn: async ({ pageParam = 1 }): Promise<PatientResponse> => {
      const response = await api.get(
        `patientMedicalCard?page=${pageParam}&pageSize=${pageSize}&filter=${search || ""}`
      );
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pageNumber < lastPage.totalPages) {
        return lastPage.pageNumber + 1;
      }
      return undefined;
    },
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });
};
