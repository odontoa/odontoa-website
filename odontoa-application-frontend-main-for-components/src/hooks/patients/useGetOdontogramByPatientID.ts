import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import { useParams } from "react-router-dom";
import { Odontogram } from "@/types/Odontogram";

export const useGetOdontogramByPatientID = () => {
    const { id } = useParams();

    return useQuery<Odontogram>({
        queryKey: ["odontogram", id],
        queryFn: async () => {
            const response = await api.get(`patientMedicalCard/${id}/odontogram`);
            return response.data;
        },
    });
};