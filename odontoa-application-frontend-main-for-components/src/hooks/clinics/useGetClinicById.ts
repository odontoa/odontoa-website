import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import { useAuth } from "@/auth/AuthProvider";
import { Clinic } from "@/types/Clinic";

export const useGetClinicById = () => {
  const { user } = useAuth();
  const clinicId = user?.clinicId;

  return useQuery<Clinic, Error>({
    queryKey: ["clinic", clinicId],
    queryFn: async () => {
      const response = await api.get(`clinics/${clinicId}`);
      return response.data;
    },
  });
};
