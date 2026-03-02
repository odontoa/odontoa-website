import api from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

type FormData = {
    measurements: {
        snaAngle?: string | null;
        snbAngle?: string | null;
        anbAngle?: string | null;
        snSppAngle?: string | null;
        snMpAngle?: string | null;
        sppMpAngle?: string | null;
        nsarAngle?: string | null;
        sargoAngle?: string | null;
        argomeAngle?: string | null;
        bjorkPolygonSum?: string | null;
        sgoLength?: string | null;
        nmeLength?: string | null;
        sgoNmeRatio?: string | null;
        iSppAngle?: string | null;
        iMpAngle?: string | null;
        iiAngle?: string | null;
        nseLength?: string | null;
        corpusMaxillaLength?: string | null;
        corpusMandibleLength?: string | null;
        ramusMandibleLength?: string | null;
    },
    finding?: string | null;
    xrayImage?: File | null;
};

export const useUpdateCephalometric = () => {
    const queryClient = useQueryClient();
    const { id } = useParams();

    return useMutation({
        mutationFn: async (data: FormData) => {
            const formData = new FormData();
            
            const measurementFields = [
                "snaAngle",
                "snbAngle",
                "anbAngle",
                "snSppAngle",
                "snMpAngle",
                "sppMpAngle",
                "nsarAngle",
                "sargoAngle",
                "argomeAngle",
                "bjorkPolygonSum",
                "sgoLength",
                "nmeLength",
                "sgoNmeRatio",
                "iSppAngle",
                "iMpAngle",
                "iiAngle",
                "nseLength",
                "corpusMaxillaLength",
                "corpusMandibleLength",
                "ramusMandibleLength",
            ];

            measurementFields.forEach((field) => {
                const value = data.measurements[field as keyof FormData['measurements']];
                if (value !== undefined && value !== null) {
                    formData.append(field, value.toString());
                }
            });

            data.finding && formData.append("finding", data.finding);
            data.xrayImage && formData.append("file", data.xrayImage);

            const response = await api.put(
                `patientMedicalCard/${id}/profileCephalometricAnalysis`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data;
        },
        onSuccess: () => {
            toast.success("Cefalometrijska analiza je uspešno ažurirana");
            queryClient.invalidateQueries({ queryKey: ["profileCephalometricAnalysis"] });
        },
        onError: () => {
            toast.error("Greška pri ažuriranju cefalometrijske analize");
        },
    });
}; 