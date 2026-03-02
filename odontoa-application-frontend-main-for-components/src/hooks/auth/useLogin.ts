import api from "@/api/axios";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await api.post("/auth/login", data);
      return response.data;
    },
  });
};
