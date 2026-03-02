import api from "@/api/axios";
import { PatientSchema } from "@/lib/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: PatientSchema }) => {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      data.email && formData.append("email", data.email);
      data.address && formData.append("address", data.address);
      data.country && formData.append("country", data.country);
      data.city && formData.append("city", data.city);

      const birthDateString = format(data.birthDate, "yyyy-MM-dd'T'00:00:00.000'Z'");
      formData.append("birthDate", birthDateString);

      formData.append("dentistId", data.dentistId.toString());
      formData.append("phoneNumbers", JSON.stringify(data.phoneNumbers));
      
      if (data.profileImage) {
        formData.append("profileImage", data.profileImage);
      }
      const response = await api.patch(`patientMedicalCard/${id}`, formData);
      return response.data;
    },
    onSuccess: () => {
      toast("Pacijent uspešno izmenjen");
      queryClient.invalidateQueries({ queryKey: ["patientMedicalCards"] });
      queryClient.invalidateQueries({ queryKey: ["patient"] });
    },
    onError: (error: any) => {
      toast(error.message || "Greška prilikom izmene pacijenta.");
    },
  });
};
