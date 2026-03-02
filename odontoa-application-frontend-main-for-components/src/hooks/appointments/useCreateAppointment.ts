import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import { toast } from "sonner";
import { AxiosError } from "axios";

type FormData = {
  treatmentType: string;
  dentalService: string;
  chair: number;
  startTime: Date;
  endTime: Date;
  patientId: number;
  dentistId: number;
  duration: number;
  notes: string | undefined;
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.post("appointments", data);
      return response.data;
    },
    onSuccess: () => {
      toast("Termin uspesno kreiran");
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
        message = axiosError.message || "Greška pri zakazivanju termina";
      }
      
      toast(message);
    },
  });
};
