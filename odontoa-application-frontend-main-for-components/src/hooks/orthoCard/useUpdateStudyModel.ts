import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

interface ToothMeasurement {
  width?: number | null;
  segment?: string | null;
  requiredSpace?: number | null;
  availableSpace?: number | null;
}

interface FormData {
  patientMedicalCardId: number;
  analyses: {
    schwartzAnalysis?: {
      upper?: {
        prednjaSirina?: {
          actual?: number | null;
          expected?: number | null;
        };
        zadnjaSirina?: {
          actual?: number | null;
          expected?: number | null;
        };
        visinaLuka?: {
          actual?: number | null;
          expected?: number | null;
        };
      };
      lower?: {
        prednjaSirina?: {
          actual?: number | null;
          expected?: number | null;
        };
        zadnjaSirina?: {
          actual?: number | null;
          expected?: number | null;
        };
        visinaLuka?: {
          actual?: number | null;
          expected?: number | null;
        };
      };
    };
    moyersAnalysis?: {
      upper?: {
        left?: {
          measuredValue?: number | null;
          tableValue?: number | null;
        };
        right?: {
          measuredValue?: number | null;
          tableValue?: number | null;
        };
      };
      lower?: {
        left?: {
          measuredValue?: number | null;
          tableValue?: number | null;
        };
        right?: {
          measuredValue?: number | null;
          tableValue?: number | null;
        };
      };
    };
    boltonAnalysis?: {
      upper?: {
        teeth?: {
          [key: string]: number | null;
        };
        total?: number | null;
      };
      lower?: {
        teeth?: {
          [key: string]: number | null;
        };
        total?: number | null;
      };
      finding?: string | null;
    };
    lundstromAnalysis?: {
      upper?: {
        teeth?: {
          [key: string]: ToothMeasurement;
        };
      };
      lower?: {
        teeth?: {
          [key: string]: ToothMeasurement;
        };
      };
    };
  };
  parameters: {
    toothStatus?: {
      upper?: {
        [key: string]: number | null;
      }
      lower?: {
        [key: string]: number | null;
      }
    };
    roToothStatus?: string | null;
    upperIncisorSum?: number | null;
    lowerIncisorSum?: number | null;
    facialIndex?: "usko" | "srednje" | "siroko" | null;
    verticalIrregularities?: {
      supraposition?: {
        [key: string]: boolean;
      }
      infraposition?: {
        [key: string]: boolean;
      }
    };
  };
}

export const useUpdateStudyModel = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.put(
        `patientMedicalCard/${id}/studyModel`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      toast("Studijski model je uspesno ažuriran");
      queryClient.invalidateQueries({ queryKey: ["studyModel"] });
    },
  });
};
