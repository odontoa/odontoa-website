import api from "@/api/axios";
import { useAuth } from "@/auth/AuthProvider";
import { DentistSchema } from "@/lib/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateDentist = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: DentistSchema) => {
      const response = await api.post("dentists", {
        ...data,
        clinicId: user?.clinicId
      });
      return response.data;
    },
    onSuccess: () => {
      toast("Stomatolog uspesno dodat");
      queryClient.invalidateQueries({ queryKey: ["dentists"] });
    },
    onError: (error) => {
      toast(error.message || "Greška prilikom dodavanja stomatologa.");
    },
  });
};
