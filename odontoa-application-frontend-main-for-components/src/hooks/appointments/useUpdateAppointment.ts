import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import { toast } from "sonner";
import { AppointmentStatus } from "@/types/Appointment";
import { AxiosError } from "axios";

interface FormData {
  startTime?: Date;
  endTime?: Date;
  dentalService?: string;
  chair?: number;
  status?: AppointmentStatus;
  notes?: string;
  cancellationReason?: string | null;
  cancellationNotes?: string | null;
}

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      data,
      appointmentId,
    }: {
      data: FormData;
      appointmentId: number;
    }) => {
      const response = await api.patch(`appointments/${appointmentId}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast("Status uspesno azuriran");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error) => {
      const axiosError = error as AxiosError<any>;
      const data: any = axiosError.response?.data;
      const rawMessage =
        (Array.isArray(data?.message)
          ? data.message.join("\n")
          : data?.message) ||
        data?.error ||
        "";
      let message = rawMessage?.toString().trim();
      
      // Check for appointment overlap/conflict messages
      if (message.toLowerCase().includes("overlap")) {
        message = "Termin se preklapa sa postojećim terminom. Molimo izaberite drugo vreme.";
      } else if (axiosError.code === "ERR_NETWORK") {
        message = "Server nedostupan. Proverite konekciju ili API rutu.";
      } else if (!message) {
        message = axiosError.message || "Greška pri ažuriranju termina";
      }
      
      toast(message);
    },
  });
};
