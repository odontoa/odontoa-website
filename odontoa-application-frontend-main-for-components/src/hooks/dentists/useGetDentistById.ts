import api from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { Dentist } from "@/types/Dentist";

export const useGetDentistById = (id: number) => {
  return useQuery({
    queryKey: ["dentist", id],
    queryFn: async (): Promise<Dentist> => {
      const response = await api.get(`dentists/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}; 