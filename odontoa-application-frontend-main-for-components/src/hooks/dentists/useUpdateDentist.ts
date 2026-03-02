import api from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdateDentistData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  role?: "ADMIN" | "USER";
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const useUpdateDentist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateDentistData }) => {
      const response = await api.patch(`dentists/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Profil uspešno ažuriran");
      queryClient.invalidateQueries({ queryKey: ["dentists"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Greška prilikom ažuriranja profila.";

      toast.error(errorMessage);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      const response = await api.post("/auth/change-password", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Lozinka uspešno promenjena");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Greška prilikom promene lozinke.";

      toast.error(errorMessage);
    },
  });
}; 