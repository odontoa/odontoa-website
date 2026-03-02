import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import { Dentist } from "@/types/Dentist";

type DentistResponse = {
  data: Dentist[];
  totalElements: number;
  totalPages: number;
  pageSize: number;
  pageNumber: number;
};

export const useGetDentists = (page?: number, search?: string) => {
  return useQuery<DentistResponse, Error>({
    queryKey: ["dentists", search, page],
    queryFn: async () => {
      const response = await api.get(
        `dentists?page=${page}&filter=${search || ""}`
      );
      return response.data;
    },
  });
};
