import api from "@/api/axios";
import { PatientSchema } from "@/lib/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";

export const useCreatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PatientSchema) => {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      data.email && formData.append("email", data.email);
      data.address && formData.append("address", data.address);
      data.country && formData.append("country", data.country);
      data.city && formData.append("city", data.city);
      
      // Format birthDate without timezone conversion
      const birthDateString = format(data.birthDate, "yyyy-MM-dd'T'00:00:00.000'Z'");
      formData.append("birthDate", birthDateString);
      formData.append("dentistId", data.dentistId.toString());
      
      formData.append("phoneNumbers", JSON.stringify(data.phoneNumbers));
      
      if (data.profileImage) {
        formData.append("profileImage", data.profileImage);
      }
      const response = await api.post("patientMedicalCard", formData);
      return response.data;
    },
    onSuccess: () => {
      toast("Pacijent uspesno dodat");
      queryClient.invalidateQueries({ queryKey: ["patientMedicalCards"] });
    },
    onError: (error) => {
      toast(error.message || "Greška prilikom dodavanja pacijenta.");
    },
  });
};
