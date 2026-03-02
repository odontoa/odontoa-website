import { useGetStudyModel } from "@/hooks/orthoCard/useGetStudyModel";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Activity, Calculator, CalendarIcon, Ruler, Scale } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Input } from "../ui/input";
import { cn, getDifferenceColor } from "@/lib/utils";
import { getDifferenceBadge } from "../DifferenceBadge";
import { SubmitHandler, useForm } from "react-hook-form";
import { useUpdateStudyModel } from "@/hooks/orthoCard/useUpdateStudyModel";
import { useAnalysisEditingMode } from "@/hooks/store/useAnalysisEditingMode";
import { StickyActions } from "@/components/sticky-actions";

interface FormFields {
  parameters?: {
    toothStatus?: {
      upper?: {
        [key: string]: boolean;
      }
      lower?: {
        [key: string]: boolean;
      }
    };
    roToothStatus?: string | null;
    upperIncisorSum?: number | null;
    facialIndex?: "usko" | "srednje" | "siroko" | null;
    verticalIrregularities?: {
      supraposition?: {
        upper: {
          [key: string]: boolean;
        },
        lower: {
          [key: string]: boolean;
        }
      }
      infraposition?: {
        upper: {
          [key: string]: boolean;
        },
        lower: {
          [key: string]: boolean;
        }
      }
    };
  };
  analyses?: {
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
          [key: string]: number;
        };
        total?: number | null;
      };
      lower?: {
        teeth?: {
          [key: string]: number;
        };
        total?: number | null;
      };
      finding?: string | null;
    };
    lundstromAnalysis?: {
      upper?: {
        segments?: {
          [key: string]: {
            requiredSpace?: number | null;
            availableSpace?: number | null;
          };
        };
        teeth?: {
          [key: string]: {
            width?: number | null;
            segment?: string | null;
          };
        };
      };
      lower?: {
        segments?: {
          [key: string]: {
            requiredSpace?: number | null;
            availableSpace?: number | null;
          };
        };
        teeth?: {
          [key: string]: {
            width?: number | null;
            segment?: string | null;
          };
        };
      };
    };
  }
}

interface SchwartzMeasurement {
  actual: number | null;
  expected: number | null;
  difference: number | null;
}

interface SchwartzAnalysis {
  upper: {
    prednjaSirina: SchwartzMeasurement;
    zadnjaSirina: SchwartzMeasurement;
    visinaLuka: SchwartzMeasurement;
  };
  lower: {
    prednjaSirina: SchwartzMeasurement;
    zadnjaSirina: SchwartzMeasurement;
    visinaLuka: SchwartzMeasurement;
  };
}

// Define all tooth numbers in the correct order
const UPPER_TEETH = [
  "t16",
  "t15",
  "t14",
  "t13",
  "t12",
  "t11",
  "t21",
  "t22",
  "t23",
  "t24",
  "t25",
  "t26",
];
const LOWER_TEETH = [
  "t46",
  "t45",
  "t44",
  "t43",
  "t42",
  "t41",
  "t31",
  "t32",
  "t33",
  "t34",
  "t35",
  "t36",
];

export default function StudyModelAnalysis() {
  const { isEditing, cancelEditing } = useAnalysisEditingMode();

  const { data: analysisData } = useGetStudyModel();
  const { mutate: updateStudyModel } = useUpdateStudyModel();

  const { register, handleSubmit } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    cancelEditing();
    const cleanData = JSON.parse(
      JSON.stringify(data, (_, value) => (value === "" ? null : value))
    );
    updateStudyModel(cleanData);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Studijski model
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-2">
                Detaljna klinička procena i analiza studijskog modela
              </p>
              {analysisData?.updatedAt && (
                <div className="flex items-center gap-2 my-4">
                  <CalendarIcon className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">
                    Poslednji put ažurirano: <span className="font-medium text-gray-800">
                      {new Date(analysisData.updatedAt).toLocaleDateString('sr-Latn-RS', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </span>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Main Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative">
          <StickyActions
            onSave={handleSubmit(onSubmit)}
          />

          <Card id="parameters" className="shadow-lg border-0 bg-white">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-xl lg:text-2xl font-semibold text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Ruler className="h-5 w-5 text-blue-600" />
                </div>
                Parametri
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0">
              {/* Tooth Status Section */}
              <div className="mb-6">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-medium text-gray-800">
                      Status zuba
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Upper Teeth */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Gornja vilica:</p>
                      {isEditing ? (
                        <div className="grid grid-cols-6 gap-2">
                          {UPPER_TEETH.map((tooth) => (
                            <div key={tooth} className="text-center">
                              <label className="flex flex-col items-center gap-1 cursor-pointer p-2 rounded border hover:bg-blue-50 transition-colors">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                  {...register(`parameters.toothStatus.upper.${tooth}`)}
                                  defaultChecked={Boolean(analysisData?.parameters?.toothStatus?.upper?.[tooth])}
                                />
                                <span className="text-xs text-gray-600 font-medium">
                                  {tooth.replace('t', '')}
                                </span>
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-6 gap-2">
                          {UPPER_TEETH.map((tooth) => (
                            <div key={tooth} className="text-center">
                              <div className={`flex flex-col items-center gap-1 p-2 rounded ${analysisData?.parameters?.toothStatus?.upper?.[tooth]
                                ? 'bg-green-50 border border-green-200'
                                : 'bg-gray-50 border border-gray-200'
                                }`}>
                                <div className={`w-4 h-4 rounded flex items-center justify-center ${analysisData?.parameters?.toothStatus?.upper?.[tooth]
                                  ? 'bg-green-500'
                                  : 'bg-gray-300'
                                  }`}>
                                  {analysisData?.parameters?.toothStatus?.upper?.[tooth] && (
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                                <span className={`text-xs font-medium ${analysisData?.parameters?.toothStatus?.upper?.[tooth]
                                  ? 'text-green-700'
                                  : 'text-gray-500'
                                  }`}>
                                  {tooth.replace('t', '')}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Lower Teeth */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Donja vilica:</p>
                      {isEditing ? (
                        <div className="grid grid-cols-6 gap-2">
                          {LOWER_TEETH.map((tooth) => (
                            <div key={tooth} className="text-center">
                              <label className="flex flex-col items-center gap-1 cursor-pointer p-2 rounded border hover:bg-blue-50 transition-colors">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                  {...register(`parameters.toothStatus.lower.${tooth}`)}
                                  defaultChecked={Boolean(analysisData?.parameters?.toothStatus?.lower?.[tooth])}
                                />
                                <span className="text-xs text-gray-600 font-medium">
                                  {tooth.replace('t', '')}
                                </span>
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-6 gap-2">
                          {LOWER_TEETH.map((tooth) => (
                            <div key={tooth} className="text-center">
                              <div className={`flex flex-col items-center gap-1 p-2 rounded ${analysisData?.parameters?.toothStatus?.lower?.[tooth]
                                ? 'bg-green-50 border border-green-200'
                                : 'bg-gray-50 border border-gray-200'
                                }`}>
                                <div className={`w-4 h-4 rounded flex items-center justify-center ${analysisData?.parameters?.toothStatus?.lower?.[tooth]
                                  ? 'bg-green-500'
                                  : 'bg-gray-300'
                                  }`}>
                                  {analysisData?.parameters?.toothStatus?.lower?.[tooth] && (
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                                <span className={`text-xs font-medium ${analysisData?.parameters?.toothStatus?.lower?.[tooth]
                                  ? 'text-green-700'
                                  : 'text-gray-500'
                                  }`}>
                                  {tooth.replace('t', '')}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Vertical Irregularities Section */}
              <div className="space-y-4 mb-6">
                {/* Supraposition - Upper Teeth */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-medium text-gray-800">
                      Uspravne nepravilnosti zuba (Suprapozicija)
                    </h3>
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Suprapozicija (gornja vilica):</p>
                  {isEditing ? (
                    <div className="grid grid-cols-6 gap-2">
                      {UPPER_TEETH.map((tooth) => (
                        <div key={tooth} className="text-center">
                          <label className="flex flex-col items-center gap-1 cursor-pointer p-2 rounded border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              {...register(`parameters.verticalIrregularities.supraposition.upper.${tooth}`)}
                              defaultChecked={Boolean(analysisData?.parameters?.verticalIrregularities?.supraposition?.upper?.[tooth])}
                            />
                            <span className="text-xs text-gray-600 font-medium">
                              {tooth.replace('t', '')}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-6 gap-2">
                      {UPPER_TEETH.map((tooth) => (
                        <div key={tooth} className="text-center">
                          <div className={`flex flex-col items-center gap-1 p-2 rounded ${analysisData?.parameters?.verticalIrregularities?.supraposition?.upper?.[tooth]
                            ? 'bg-orange-50 border border-orange-200'
                            : 'bg-gray-50 border border-gray-200'
                            }`}>
                            <div className={`w-4 h-4 rounded flex items-center justify-center ${analysisData?.parameters?.verticalIrregularities?.supraposition?.upper?.[tooth]
                              ? 'bg-orange-500'
                              : 'bg-gray-300'
                              }`}>
                              {analysisData?.parameters?.verticalIrregularities?.supraposition?.upper?.[tooth] && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <span className={`text-xs font-medium ${analysisData?.parameters?.verticalIrregularities?.supraposition?.upper?.[tooth]
                              ? 'text-orange-700'
                              : 'text-gray-500'
                              }`}>
                              {tooth.replace('t', '')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-sm font-medium text-gray-700 mb-2">Suprapozicija (donja vilica):</p>
                  {isEditing ? (
                    <div className="grid grid-cols-6 gap-2">
                      {LOWER_TEETH.map((tooth) => (
                        <div key={tooth} className="text-center">
                          <label className="flex flex-col items-center gap-1 cursor-pointer p-2 rounded border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              {...register(`parameters.verticalIrregularities.supraposition.lower.${tooth}`)}
                              defaultChecked={Boolean(analysisData?.parameters?.verticalIrregularities?.supraposition?.lower?.[tooth])}
                            />
                            <span className="text-xs text-gray-600 font-medium">
                              {tooth.replace('t', '')}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-6 gap-2">
                      {LOWER_TEETH.map((tooth) => (
                        <div key={tooth} className="text-center">
                          <div className={`flex flex-col items-center gap-1 p-2 rounded ${analysisData?.parameters?.verticalIrregularities?.supraposition?.lower?.[tooth]
                            ? 'bg-orange-50 border border-orange-200'
                            : 'bg-gray-50 border border-gray-200'
                            }`}>
                            <div className={`w-4 h-4 rounded flex items-center justify-center ${analysisData?.parameters?.verticalIrregularities?.supraposition?.lower?.[tooth]
                              ? 'bg-orange-500'
                              : 'bg-gray-300'
                              }`}>
                              {analysisData?.parameters?.verticalIrregularities?.supraposition?.lower?.[tooth] && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <span className={`text-xs font-medium ${analysisData?.parameters?.verticalIrregularities?.supraposition?.lower?.[tooth]
                              ? 'text-orange-700'
                              : 'text-gray-500'
                              }`}>
                              {tooth.replace('t', '')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Infraposition - Upper Teeth */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-medium text-gray-800">
                      Uspravne nepravilnosti zuba (Suprapozicija)
                    </h3>
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Infrapozicija (gornja vilica):</p>
                  {isEditing ? (
                    <div className="grid grid-cols-6 gap-2">
                      {UPPER_TEETH.map((tooth) => (
                        <div key={tooth} className="text-center">
                          <label className="flex flex-col items-center gap-1 cursor-pointer p-2 rounded border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              {...register(`parameters.verticalIrregularities.infraposition.upper.${tooth}`)}
                              defaultChecked={Boolean(analysisData?.parameters?.verticalIrregularities?.infraposition?.upper?.[tooth])}
                            />
                            <span className="text-xs text-gray-600 font-medium">
                              {tooth.replace('t', '')}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-6 gap-2">
                      {UPPER_TEETH.map((tooth) => (
                        <div key={tooth} className="text-center">
                          <div className={`flex flex-col items-center gap-1 p-2 rounded ${analysisData?.parameters?.verticalIrregularities?.infraposition?.upper?.[tooth]
                            ? 'bg-red-50 border border-red-200'
                            : 'bg-gray-50 border border-gray-200'
                            }`}>
                            <div className={`w-4 h-4 rounded flex items-center justify-center ${analysisData?.parameters?.verticalIrregularities?.infraposition?.upper?.[tooth]
                              ? 'bg-red-500'
                              : 'bg-gray-300'
                              }`}>
                              {analysisData?.parameters?.verticalIrregularities?.infraposition?.upper?.[tooth] && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <span className={`text-xs font-medium ${analysisData?.parameters?.verticalIrregularities?.infraposition?.upper?.[tooth]
                              ? 'text-red-700'
                              : 'text-gray-500'
                              }`}>
                              {tooth.replace('t', '')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-sm font-medium text-gray-700 mb-2">Infrapozicija (donja vilica):</p>
                  {isEditing ? (
                    <div className="grid grid-cols-6 gap-2">
                      {LOWER_TEETH.map((tooth) => (
                        <div key={tooth} className="text-center">
                          <label className="flex flex-col items-center gap-1 cursor-pointer p-2 rounded border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              {...register(`parameters.verticalIrregularities.infraposition.lower.${tooth}`)}
                              defaultChecked={Boolean(analysisData?.parameters?.verticalIrregularities?.infraposition?.lower?.[tooth])}
                            />
                            <span className="text-xs text-gray-600 font-medium">
                              {tooth.replace('t', '')}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-6 gap-2">
                      {LOWER_TEETH.map((tooth) => (
                        <div key={tooth} className="text-center">
                          <div className={`flex flex-col items-center gap-1 p-2 rounded ${analysisData?.parameters?.verticalIrregularities?.infraposition?.lower?.[tooth]
                            ? 'bg-red-50 border border-red-200'
                            : 'bg-gray-50 border border-gray-200'
                            }`}>
                            <div className={`w-4 h-4 rounded flex items-center justify-center ${analysisData?.parameters?.verticalIrregularities?.infraposition?.lower?.[tooth]
                              ? 'bg-red-500'
                              : 'bg-gray-300'
                              }`}>
                              {analysisData?.parameters?.verticalIrregularities?.infraposition?.lower?.[tooth] && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <span className={`text-xs font-medium ${analysisData?.parameters?.verticalIrregularities?.infraposition?.lower?.[tooth]
                              ? 'text-red-700'
                              : 'text-gray-500'
                              }`}>
                              {tooth.replace('t', '')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="mb-6 col-span-1">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-200">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Suma inciziva gore (mm):
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {analysisData?.parameters?.upperIncisorSum
                        ? analysisData.parameters.upperIncisorSum
                        : "-"}
                    </p>
                  </div>
                </div>
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-200">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Suma inciziva dole (mm):
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {analysisData?.parameters?.lowerIncisorSum
                        ? analysisData.parameters.lowerIncisorSum
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Face Index Parameter */}
              <div className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity className="h-5 w-5 text-gray-600" />
                      <h3 className="text-lg font-medium text-gray-800">
                        Indeks lica
                      </h3>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        Odaberite tip lica:
                      </p>

                      {isEditing ? (
                        <div className="flex flex-wrap gap-3">
                          {/* Narrow Face Option */}
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              value="usko"
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              {...register("parameters.facialIndex")}
                              defaultChecked={analysisData?.parameters?.facialIndex === "usko"}
                            />
                            <span className="text-sm font-medium text-gray-700">Usko</span>
                          </label>

                          {/* Medium Face Option */}
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              value="srednje"
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              {...register("parameters.facialIndex")}
                              defaultChecked={analysisData?.parameters?.facialIndex === "srednje"}
                            />
                            <span className="text-sm font-medium text-gray-700">Srednje</span>
                          </label>

                          {/* Wide Face Option */}
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              value="siroko"
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              {...register("parameters.facialIndex")}
                              defaultChecked={analysisData?.parameters?.facialIndex === "siroko"}
                            />
                            <span className="text-sm font-medium text-gray-700">Široko</span>
                          </label>
                        </div>
                      ) : (
                        <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                          <span className="text-sm text-blue-700 font-medium">
                            {analysisData?.parameters?.facialIndex === "usko" ? "Usko lice" :
                              analysisData?.parameters?.facialIndex === "srednje" ? "Srednje lice" :
                                analysisData?.parameters?.facialIndex === "siroko" ? "Široko lice" : "Nije odabrano"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* RO Status Parameter */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity className="h-5 w-5 text-gray-600" />
                      <h3 className="text-lg font-medium text-gray-800">
                        RO status zuba
                      </h3>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        Unesite status zuba:
                      </p>

                      {isEditing ? (
                        <textarea
                          {...register("parameters.roToothStatus")}
                          defaultValue={analysisData?.parameters?.roToothStatus || ""}
                          className="w-full p-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={3}
                          placeholder="Unesite detalje o RO statusu zuba..."
                        />
                      ) : (
                        <div className="mt-3 p-3 bg-green-50 rounded border border-green-200">
                          <span className="text-sm text-green-700 font-medium">
                            {analysisData?.parameters?.roToothStatus || "Nema unetog statusa"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schwartz Analysis */}
          <Card id="schwartz-analysis" className="shadow-lg border-0 bg-white">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-xl lg:text-2xl font-semibold text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Ruler className="h-5 w-5 text-blue-600" />
                </div>
                Schwartz-ova analiza
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upper Jaw */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Gornja vilica
                  </h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-sm font-medium">Parametar</TableHead>
                          <TableHead className="text-sm font-medium text-center">Je</TableHead>
                          <TableHead className="text-sm font-medium text-center">Treba</TableHead>
                          <TableHead className="text-sm font-medium text-center">Razlika</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analysisData &&
                          (
                            Object.entries(
                              analysisData.analyses.schwartzAnalysis.upper
                            ) as [
                              keyof SchwartzAnalysis["upper"],
                              SchwartzMeasurement
                            ][]
                          ).map(([param, values]) => (
                            <TableRow key={param}>
                              <TableCell className="font-medium text-sm">
                                {param === 'prednjaSirina' ? 'Prednja širina' :
                                  param === 'zadnjaSirina' ? 'Zadnja širina' :
                                    param === 'visinaLuka' ? 'Visina luka' : param}
                              </TableCell>
                              <TableCell className="py-2">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      `analyses.schwartzAnalysis.upper.${param}.actual`
                                    )}
                                    defaultValue={
                                      values.actual ?? undefined
                                    }
                                    className="max-w-16 h-8 px-2 text-center text-sm"
                                  />
                                ) : (
                                  <span className="text-center block">
                                    {values.actual ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="py-2">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      `analyses.schwartzAnalysis.upper.${param}.expected`
                                    )}
                                    defaultValue={
                                      values.expected ?? undefined
                                    }
                                    className="max-w-16 h-8 px-2 text-center text-sm"
                                  />
                                ) : (
                                  <span className="text-center block">
                                    {values.expected ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell
                                className={cn(getDifferenceColor(
                                  values.difference ?? undefined
                                ), "text-center")}
                              >
                                {getDifferenceBadge(
                                  values.difference ?? undefined
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Lower Jaw */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Donja vilica
                  </h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-sm font-medium">Parametar</TableHead>
                          <TableHead className="text-sm font-medium text-center">Je</TableHead>
                          <TableHead className="text-sm font-medium text-center">Treba</TableHead>
                          <TableHead className="text-sm font-medium text-center">Razlika</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analysisData &&
                          (
                            Object.entries(
                              analysisData.analyses.schwartzAnalysis.lower
                            ) as [
                              keyof SchwartzAnalysis["lower"],
                              SchwartzMeasurement
                            ][]
                          ).map(([param, values]) => (
                            <TableRow key={param}>
                              <TableCell className="font-medium text-sm">
                                {param === 'prednjaSirina' ? 'Prednja širina' :
                                  param === 'zadnjaSirina' ? 'Zadnja širina' :
                                    param === 'visinaLuka' ? 'Visina luka' : param}
                              </TableCell>
                              <TableCell className="py-2">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      `analyses.schwartzAnalysis.lower.${param}.actual`
                                    )}
                                    defaultValue={
                                      values.actual ?? undefined
                                    }
                                    className="max-w-16 h-8 px-2 text-center text-sm"
                                  />
                                ) : (
                                  <span className="text-center block">
                                    {values.actual ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="py-2">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      `analyses.schwartzAnalysis.lower.${param}.expected`
                                    )}
                                    defaultValue={
                                      values.expected ?? undefined
                                    }
                                    className="max-w-16 h-8 px-2 text-center text-sm"
                                  />
                                ) : (
                                  <span className="text-center block">
                                    {values.expected ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell
                                className={cn(getDifferenceColor(
                                  values.difference ?? undefined
                                ), "text-center")}
                              >
                                {getDifferenceBadge(
                                  values.difference ?? undefined
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Moyers Analysis */}
          <Card id="moyers-analysis" className="shadow-lg border-0 bg-white">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-xl lg:text-2xl font-semibold text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calculator className="h-5 w-5 text-purple-600" />
                </div>
                Moyers-ova analiza
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0">
              {/* Lower Incisor Sum */}


              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upper Jaw */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Gornja vilica
                  </h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-sm font-medium"></TableHead>
                          <TableHead className="text-sm font-medium text-center">Levo</TableHead>
                          <TableHead className="text-sm font-medium text-center">Desno</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analysisData && (
                          <>
                            <TableRow>
                              <TableCell className="font-medium text-sm">
                                Izmerena vrednost
                              </TableCell>
                              <TableCell className="py-2 ">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      "analyses.moyersAnalysis.upper.left.measuredValue"
                                    )}
                                    defaultValue={
                                      analysisData.analyses.moyersAnalysis
                                        .upper.left.measuredValue
                                    }
                                    className="max-w-16 h-8 px-2 text-center text-sm mx-auto"
                                  />
                                ) : (
                                  <span className="text-center block">
                                    {analysisData.analyses.moyersAnalysis
                                      .upper.left.measuredValue ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="py-2">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      "analyses.moyersAnalysis.upper.right.measuredValue"
                                    )}
                                    defaultValue={
                                      analysisData.analyses.moyersAnalysis
                                        .upper.right.measuredValue
                                    }
                                    className="max-w-16 h-8 px-2 text-center text-sm mx-auto"
                                  />
                                ) : (
                                  <span className="text-center block">
                                    {analysisData.analyses.moyersAnalysis
                                      .upper.right.measuredValue ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium text-sm">
                                Tabelarna vrednost
                              </TableCell>
                              <TableCell className="py-2">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      "analyses.moyersAnalysis.upper.left.tableValue"
                                    )}
                                    defaultValue={
                                      analysisData.analyses.moyersAnalysis
                                        .upper.left.tableValue
                                    }
                                    className="max-w-16 h-8 px-2 text-center text-sm mx-auto"
                                  />
                                ) : (
                                  <span className="text-center block">
                                    {analysisData.analyses.moyersAnalysis
                                      .upper.left.tableValue ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="py-2">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      "analyses.moyersAnalysis.upper.right.tableValue"
                                    )}
                                    defaultValue={
                                      analysisData.analyses.moyersAnalysis
                                        .upper.right.tableValue
                                    }
                                    className="max-w-16 h-8 px-2 text-center text-sm mx-auto"
                                  />
                                ) : (
                                  <span className="text-center block">
                                    {analysisData.analyses.moyersAnalysis
                                      .upper.right.tableValue ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium text-sm">
                                RAZLIKA
                              </TableCell>
                              <TableCell
                                className={cn(getDifferenceColor(
                                  analysisData.analyses.moyersAnalysis.upper
                                    .left.difference
                                ), "text-center")}
                              >
                                {getDifferenceBadge(
                                  analysisData.analyses.moyersAnalysis.upper
                                    .left.difference
                                )}
                              </TableCell>
                              <TableCell
                                className={cn(getDifferenceColor(
                                  analysisData.analyses.moyersAnalysis.upper
                                    .right.difference
                                ), "text-center")}
                              >
                                {getDifferenceBadge(
                                  analysisData.analyses.moyersAnalysis.upper
                                    .right.difference
                                )}
                              </TableCell>
                            </TableRow>
                          </>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Lower Jaw */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Donja vilica
                  </h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-sm font-medium"></TableHead>
                          <TableHead className="text-sm font-medium text-center">Levo</TableHead>
                          <TableHead className="text-sm font-medium text-center">Desno</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analysisData && (
                          <>
                            <TableRow>
                              <TableCell className="font-medium text-sm">
                                Izmerena vrednost
                              </TableCell>
                              <TableCell className="py-2">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      "analyses.moyersAnalysis.lower.left.measuredValue"
                                    )}
                                    defaultValue={
                                      analysisData.analyses.moyersAnalysis
                                        .lower.left.measuredValue
                                    }
                                    className="max-w-16 h-8 px-2 text-center text-sm mx-auto"
                                  />
                                ) : (
                                  <span className="text-center block">
                                    {analysisData.analyses.moyersAnalysis
                                      .lower.left.measuredValue ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="py-2">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      "analyses.moyersAnalysis.lower.right.measuredValue"
                                    )}
                                    defaultValue={
                                      analysisData.analyses.moyersAnalysis
                                        .lower.right.measuredValue
                                    }
                                    className="max-w-16 h-8 px-2 text-center text-sm mx-auto"
                                  />
                                ) : (
                                  <span className="text-center block">
                                    {analysisData.analyses.moyersAnalysis
                                      .lower.right.measuredValue ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium text-sm">
                                Tabelarna vrednost
                              </TableCell>
                              <TableCell className="py-2">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      "analyses.moyersAnalysis.lower.left.tableValue"
                                    )}
                                    defaultValue={
                                      analysisData.analyses.moyersAnalysis
                                        .lower.left.tableValue
                                    }
                                    className="max-w-16 h-8 px-2 text-center text-sm mx-auto"
                                  />
                                ) : (
                                  <span className="text-center block">
                                    {analysisData.analyses.moyersAnalysis
                                      .lower.left.tableValue ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="py-2">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      "analyses.moyersAnalysis.lower.right.tableValue"
                                    )}
                                    defaultValue={
                                      analysisData.analyses.moyersAnalysis
                                        .lower.right.tableValue
                                    }
                                    className="max-w-16 h-8 px-2 text-center text-sm mx-auto"
                                  />
                                ) : (
                                  <span className="text-center block">
                                    {analysisData.analyses.moyersAnalysis
                                      .lower.right.tableValue ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium text-sm">
                                RAZLIKA
                              </TableCell>
                              <TableCell
                                className={cn(getDifferenceColor(
                                  analysisData.analyses.moyersAnalysis.lower
                                    .left.difference
                                ), "text-center")}
                              >
                                {getDifferenceBadge(
                                  analysisData.analyses.moyersAnalysis.lower
                                    .left.difference
                                )}
                              </TableCell>
                              <TableCell
                                className={cn(getDifferenceColor(
                                  analysisData.analyses.moyersAnalysis.lower
                                    .right.difference
                                ), "text-center")}
                              >
                                {getDifferenceBadge(
                                  analysisData.analyses.moyersAnalysis.lower
                                    .right.difference
                                )}
                              </TableCell>
                            </TableRow>
                          </>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bolton Analysis */}
          <Card id="bolton-analysis" className="shadow-lg border-0 bg-white">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-xl lg:text-2xl font-semibold text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Scale className="h-5 w-5 text-orange-600" />
                </div>
                Bolton-ova analiza
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0">
              <div className="space-y-6">
                {/* Upper Jaw */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    Gornja vilica
                  </h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-sm font-medium">Zub</TableHead>
                          {UPPER_TEETH.map((tooth) => (
                            <TableHead key={tooth} className="text-xs font-medium text-center">
                              {tooth.replace('t', '')}
                            </TableHead>
                          ))}
                          <TableHead className="text-sm font-bold text-center">
                            Ukupno
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analysisData && (
                          <TableRow>
                            <TableCell className="font-medium text-sm">
                              Širina (mm)
                            </TableCell>
                            {UPPER_TEETH.map((tooth) => (
                              <TableCell key={`upper-${tooth}`} className="py-2">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      `analyses.boltonAnalysis.upper.teeth.${tooth}`
                                    )}
                                    defaultValue={
                                      analysisData?.analyses.boltonAnalysis
                                        .upper.teeth[tooth] || ""
                                    }
                                    className="max-w-12 h-8 px-1 text-center text-xs"
                                  />
                                ) : (
                                  <span className="text-center block text-sm">
                                    {analysisData?.analyses.boltonAnalysis
                                      .upper.teeth[tooth] || "-"}
                                  </span>
                                )}
                              </TableCell>
                            ))}
                            <TableCell className="font-bold text-orange-600 text-center">
                              {analysisData.analyses.boltonAnalysis.upper.total}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Lower Jaw */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Donja vilica
                  </h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-sm font-medium">Zub</TableHead>
                          {LOWER_TEETH.map((tooth) => (
                            <TableHead key={tooth} className="text-xs font-medium text-center">
                              {tooth.replace('t', '')}
                            </TableHead>
                          ))}
                          <TableHead className="text-sm font-bold text-center">
                            Ukupno
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analysisData && (
                          <TableRow>
                            <TableCell className="font-medium text-sm">
                              Širina (mm)
                            </TableCell>
                            {LOWER_TEETH.map((tooth) => (
                              <TableCell key={`lower-${tooth}`} className="py-2">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      `analyses.boltonAnalysis.lower.teeth.${tooth}`
                                    )}
                                    defaultValue={
                                      analysisData?.analyses.boltonAnalysis
                                        .lower.teeth[tooth] || ""
                                    }
                                    className="max-w-12 h-8 px-1 text-center text-xs"
                                  />
                                ) : (
                                  <span className="text-center block text-sm">
                                    {analysisData?.analyses.boltonAnalysis
                                      .lower.teeth[tooth] || "-"}
                                  </span>
                                )}
                              </TableCell>
                            ))}
                            <TableCell className="font-bold text-orange-600 text-center">
                              {analysisData.analyses.boltonAnalysis.lower.total}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Bolton Analysis Finding */}
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="font-medium text-orange-800 mb-2">Nalaz:</p>
                      {isEditing ? (
                        <textarea
                          {...register("analyses.boltonAnalysis.finding")}
                          defaultValue={analysisData?.analyses.boltonAnalysis.finding || ""}
                          className="w-full p-3 text-sm border border-orange-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                          rows={3}
                          placeholder="Unesite nalaz za Bolton-ovu analizu..."
                        />
                      ) : (
                        <p className="text-sm text-orange-700">
                          {analysisData?.analyses.boltonAnalysis.finding || "Nema unetog nalaza"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lundstrom Analysis */}
          <Card id="lundstrom-analysis" className="shadow-lg border-0 bg-white">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-xl lg:text-2xl font-semibold text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Activity className="h-5 w-5 text-green-600" />
                </div>
                Lundstrom-ova analiza
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0">
              <div className="space-y-8">
                {/* Upper Jaw */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Gornja vilica
                  </h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-sm font-medium">Zub</TableHead>
                          {UPPER_TEETH.map((tooth) => (
                            <TableHead key={tooth} className="text-xs font-medium text-center">
                              {tooth.replace('t', '')}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analysisData && (
                          <>
                            <TableRow>
                              <TableCell className="font-medium text-sm">
                                Širina (mm)
                              </TableCell>
                              {UPPER_TEETH.map((tooth) => {
                                const data = analysisData.analyses.lundstromAnalysis.upper.teeth[tooth];
                                if (!data) return <TableCell key={tooth} className="text-sm text-center">-</TableCell>;
                                return (
                                  <TableCell key={tooth} className="py-1">
                                    {isEditing ? (
                                      <Input
                                        {...register(
                                          `analyses.lundstromAnalysis.upper.teeth.${tooth}.width`
                                        )}
                                        defaultValue={data.width}
                                        className="max-w-12 h-7 px-1 text-center text-xs mx-auto"
                                      />
                                    ) : (
                                      <span className="text-sm text-center block">
                                        {data.width ?? "-"}
                                      </span>
                                    )}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium text-sm">
                                Segment
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                <span className="text-sm font-medium text-green-600">S1</span>
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                <span className="text-sm font-medium text-green-600">S2</span>
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                <span className="text-sm font-medium text-green-600">S3</span>
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                <span className="text-sm font-medium text-green-600">S4</span>
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                <span className="text-sm font-medium text-green-600">S5</span>
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                <span className="text-sm font-medium text-green-600">S6</span>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium text-sm">
                                Potreban prostor (mm)
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      `analyses.lundstromAnalysis.upper.segments.s1.requiredSpace`
                                    )}
                                    defaultValue={analysisData?.analyses.lundstromAnalysis.upper.segments.s1?.requiredSpace}
                                    className="max-w-12 h-7 px-1 text-center text-xs mx-auto"
                                  />
                                ) : (
                                  <span className="text-sm text-center block">
                                    {analysisData?.analyses.lundstromAnalysis.upper.segments.s1?.requiredSpace ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      `analyses.lundstromAnalysis.upper.segments.s2.requiredSpace`
                                    )}
                                    defaultValue={analysisData?.analyses.lundstromAnalysis.upper.segments.s2?.requiredSpace}
                                    className="max-w-12 h-7 px-1 text-center text-xs mx-auto"
                                  />
                                ) : (
                                  <span className="text-sm text-center block">
                                    {analysisData?.analyses.lundstromAnalysis.upper.segments.s2?.requiredSpace ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      `analyses.lundstromAnalysis.upper.segments.s3.requiredSpace`
                                    )}
                                    defaultValue={analysisData?.analyses.lundstromAnalysis.upper.segments.s3?.requiredSpace}
                                    className="max-w-12 h-7 px-1 text-center text-xs mx-auto"
                                  />
                                ) : (
                                  <span className="text-sm text-center block">
                                    {analysisData?.analyses.lundstromAnalysis.upper.segments.s3?.requiredSpace ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      `analyses.lundstromAnalysis.upper.segments.s4.requiredSpace`
                                    )}
                                    defaultValue={analysisData?.analyses.lundstromAnalysis.upper.segments.s4?.requiredSpace}
                                    className="max-w-12 h-7 px-1 text-center text-xs mx-auto"
                                  />
                                ) : (
                                  <span className="text-sm text-center block">
                                    {analysisData?.analyses.lundstromAnalysis.upper.segments.s4?.requiredSpace ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      `analyses.lundstromAnalysis.upper.segments.s5.requiredSpace`
                                    )}
                                    defaultValue={analysisData?.analyses.lundstromAnalysis.upper.segments.s5?.requiredSpace}
                                    className="max-w-12 h-7 px-1 text-center text-xs mx-auto"
                                  />
                                ) : (
                                  <span className="text-sm text-center block">
                                    {analysisData?.analyses.lundstromAnalysis.upper.segments.s5?.requiredSpace ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      `analyses.lundstromAnalysis.upper.segments.s6.requiredSpace`
                                    )}
                                    defaultValue={analysisData?.analyses.lundstromAnalysis.upper.segments.s6?.requiredSpace}
                                    className="max-w-12 h-7 px-1 text-center text-xs mx-auto"
                                  />
                                ) : (
                                  <span className="text-sm text-center block">
                                    {analysisData?.analyses.lundstromAnalysis.upper.segments.s6?.requiredSpace ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium text-sm">
                                Dostupan prostor (mm)
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      `analyses.lundstromAnalysis.upper.segments.s1.availableSpace`
                                    )}
                                    defaultValue={analysisData?.analyses.lundstromAnalysis.upper.segments.s1?.availableSpace}
                                    className="max-w-12 h-7 px-1 text-center text-xs mx-auto"
                                  />
                                ) : (
                                  <span className="text-sm text-center block">
                                    {analysisData?.analyses.lundstromAnalysis.upper.segments.s1?.availableSpace ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      `analyses.lundstromAnalysis.upper.segments.s2.availableSpace`
                                    )}
                                    defaultValue={analysisData?.analyses.lundstromAnalysis.upper.segments.s2?.availableSpace}
                                    className="max-w-12 h-7 px-1 text-center text-xs mx-auto"
                                  />
                                ) : (
                                  <span className="text-sm text-center block">
                                    {analysisData?.analyses.lundstromAnalysis.upper.segments.s2?.availableSpace ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      `analyses.lundstromAnalysis.upper.segments.s3.availableSpace`
                                    )}
                                    defaultValue={analysisData?.analyses.lundstromAnalysis.upper.segments.s3?.availableSpace}
                                    className="max-w-12 h-7 px-1 text-center text-xs mx-auto"
                                  />
                                ) : (
                                  <span className="text-sm text-center block">
                                    {analysisData?.analyses.lundstromAnalysis.upper.segments.s3?.availableSpace ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      `analyses.lundstromAnalysis.upper.segments.s4.availableSpace`
                                    )}
                                    defaultValue={analysisData?.analyses.lundstromAnalysis.upper.segments.s4?.availableSpace}
                                    className="max-w-12 h-7 px-1 text-center text-xs mx-auto"
                                  />
                                ) : (
                                  <span className="text-sm text-center block">
                                    {analysisData?.analyses.lundstromAnalysis.upper.segments.s4?.availableSpace ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      `analyses.lundstromAnalysis.upper.segments.s5.availableSpace`
                                    )}
                                    defaultValue={analysisData?.analyses.lundstromAnalysis.upper.segments.s5?.availableSpace}
                                    className="max-w-12 h-7 px-1 text-center text-xs mx-auto"
                                  />
                                ) : (
                                  <span className="text-sm text-center block">
                                    {analysisData?.analyses.lundstromAnalysis.upper.segments.s5?.availableSpace ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      `analyses.lundstromAnalysis.upper.segments.s6.availableSpace`
                                    )}
                                    defaultValue={analysisData?.analyses.lundstromAnalysis.upper.segments.s6?.availableSpace}
                                    className="max-w-12 h-7 px-1 text-center text-xs mx-auto"
                                  />
                                ) : (
                                  <span className="text-sm text-center block">
                                    {analysisData?.analyses.lundstromAnalysis.upper.segments.s6?.availableSpace ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium text-sm">
                                Razlika
                              </TableCell>
                              <TableCell colSpan={2} className={`text-center ${getDifferenceColor(analysisData?.analyses.lundstromAnalysis.upper.segments.s1?.difference)}`}>
                                {getDifferenceBadge(analysisData?.analyses.lundstromAnalysis.upper.segments.s1?.difference)}
                              </TableCell>
                              <TableCell colSpan={2} className={`text-center ${getDifferenceColor(analysisData?.analyses.lundstromAnalysis.upper.segments.s2?.difference)}`}>
                                {getDifferenceBadge(analysisData?.analyses.lundstromAnalysis.upper.segments.s2?.difference)}
                              </TableCell>
                              <TableCell colSpan={2} className={`text-center ${getDifferenceColor(analysisData?.analyses.lundstromAnalysis.upper.segments.s3?.difference)}`}>
                                {getDifferenceBadge(analysisData?.analyses.lundstromAnalysis.upper.segments.s3?.difference)}
                              </TableCell>
                              <TableCell colSpan={2} className={`text-center ${getDifferenceColor(analysisData?.analyses.lundstromAnalysis.upper.segments.s4?.difference)}`}>
                                {getDifferenceBadge(analysisData?.analyses.lundstromAnalysis.upper.segments.s4?.difference)}
                              </TableCell>
                              <TableCell colSpan={2} className={`text-center ${getDifferenceColor(analysisData?.analyses.lundstromAnalysis.upper.segments.s5?.difference)}`}>
                                {getDifferenceBadge(analysisData?.analyses.lundstromAnalysis.upper.segments.s5?.difference)}
                              </TableCell>
                              <TableCell colSpan={2} className={`text-center ${getDifferenceColor(analysisData?.analyses.lundstromAnalysis.upper.segments.s6?.difference)}`}>
                                {getDifferenceBadge(analysisData?.analyses.lundstromAnalysis.upper.segments.s6?.difference)}
                              </TableCell>
                            </TableRow>
                          </>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Lower Jaw */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Donja vilica
                  </h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-sm font-medium">Zub</TableHead>
                          {LOWER_TEETH.map((tooth) => (
                            <TableHead key={tooth} className="text-xs font-medium text-center">
                              {tooth.replace('t', '')}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analysisData && (
                          <>
                            <TableRow>
                              <TableCell className="font-medium text-sm">
                                Širina (mm)
                              </TableCell>
                              {LOWER_TEETH.map((tooth) => {
                                const data = analysisData.analyses.lundstromAnalysis.lower.teeth[tooth];
                                if (!data) return <TableCell key={tooth} className="text-sm text-center">-</TableCell>;
                                return (
                                  <TableCell key={tooth} className="py-1">
                                    {isEditing ? (
                                      <Input
                                        {...register(
                                          `analyses.lundstromAnalysis.lower.teeth.${tooth}.width`
                                        )}
                                        defaultValue={data.width}
                                        className="max-w-12 h-7 px-1 text-center text-xs mx-auto"
                                      />
                                    ) : (
                                      <span className="text-sm text-center block">
                                        {data.width ?? "-"}
                                      </span>
                                    )}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium text-sm">
                                Segment
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                <span className="text-sm font-medium text-green-600">S1</span>
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                <span className="text-sm font-medium text-green-600">S2</span>
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                <span className="text-sm font-medium text-green-600">S3</span>
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                <span className="text-sm font-medium text-green-600">S4</span>
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                <span className="text-sm font-medium text-green-600">S5</span>
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                <span className="text-sm font-medium text-green-600">S6</span>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium text-sm">
                                Potreban prostor (mm)
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      `analyses.lundstromAnalysis.lower.segments.s1.requiredSpace`
                                    )}
                                    defaultValue={analysisData?.analyses.lundstromAnalysis.lower.segments.s1?.requiredSpace}
                                    className="max-w-12 h-7 px-1 text-center text-xs mx-auto"
                                  />
                                ) : (
                                  <span className="text-sm text-center block">
                                    {analysisData?.analyses.lundstromAnalysis.lower.segments.s1?.requiredSpace ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      `analyses.lundstromAnalysis.lower.segments.s2.requiredSpace`
                                    )}
                                    defaultValue={analysisData?.analyses.lundstromAnalysis.lower.segments.s2?.requiredSpace}
                                    className="max-w-12 h-7 px-1 text-center text-xs mx-auto"
                                  />
                                ) : (
                                  <span className="text-sm text-center block">
                                    {analysisData?.analyses.lundstromAnalysis.lower.segments.s2?.requiredSpace ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      `analyses.lundstromAnalysis.lower.segments.s3.requiredSpace`
                                    )}
                                    defaultValue={analysisData?.analyses.lundstromAnalysis.lower.segments.s3?.requiredSpace}
                                    className="max-w-12 h-7 px-1 text-center text-xs mx-auto"
                                  />
                                ) : (
                                  <span className="text-sm text-center block">
                                    {analysisData?.analyses.lundstromAnalysis.lower.segments.s3?.requiredSpace ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      `analyses.lundstromAnalysis.lower.segments.s4.requiredSpace`
                                    )}
                                    defaultValue={analysisData?.analyses.lundstromAnalysis.lower.segments.s4?.requiredSpace}
                                    className="max-w-12 h-7 px-1 text-center text-xs mx-auto"
                                  />
                                ) : (
                                  <span className="text-sm text-center block">
                                    {analysisData?.analyses.lundstromAnalysis.lower.segments.s4?.requiredSpace ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      `analyses.lundstromAnalysis.lower.segments.s5.requiredSpace`
                                    )}
                                    defaultValue={analysisData?.analyses.lundstromAnalysis.lower.segments.s5?.requiredSpace}
                                    className="max-w-12 h-7 px-1 text-center text-xs mx-auto"
                                  />
                                ) : (
                                  <span className="text-sm text-center block">
                                    {analysisData?.analyses.lundstromAnalysis.lower.segments.s5?.requiredSpace ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      `analyses.lundstromAnalysis.lower.segments.s6.requiredSpace`
                                    )}
                                    defaultValue={analysisData?.analyses.lundstromAnalysis.lower.segments.s6?.requiredSpace}
                                    className="max-w-12 h-7 px-1 text-center text-xs mx-auto"
                                  />
                                ) : (
                                  <span className="text-sm text-center block">
                                    {analysisData?.analyses.lundstromAnalysis.lower.segments.s6?.requiredSpace ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium text-sm">
                                Dostupan prostor (mm)
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      `analyses.lundstromAnalysis.lower.segments.s1.availableSpace`
                                    )}
                                    defaultValue={analysisData?.analyses.lundstromAnalysis.lower.segments.s1?.availableSpace}
                                    className="max-w-12 h-7 px-1 text-center text-xs mx-auto"
                                  />
                                ) : (
                                  <span className="text-sm text-center block">
                                    {analysisData?.analyses.lundstromAnalysis.lower.segments.s1?.availableSpace ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      `analyses.lundstromAnalysis.lower.segments.s2.availableSpace`
                                    )}
                                    defaultValue={analysisData?.analyses.lundstromAnalysis.lower.segments.s2?.availableSpace}
                                    className="max-w-12 h-7 px-1 text-center text-xs mx-auto"
                                  />
                                ) : (
                                  <span className="text-sm text-center block">
                                    {analysisData?.analyses.lundstromAnalysis.lower.segments.s2?.availableSpace ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      `analyses.lundstromAnalysis.lower.segments.s3.availableSpace`
                                    )}
                                    defaultValue={analysisData?.analyses.lundstromAnalysis.lower.segments.s3?.availableSpace}
                                    className="max-w-12 h-7 px-1 text-center text-xs mx-auto"
                                  />
                                ) : (
                                  <span className="text-sm text-center block">
                                    {analysisData?.analyses.lundstromAnalysis.lower.segments.s3?.availableSpace ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      `analyses.lundstromAnalysis.lower.segments.s4.availableSpace`
                                    )}
                                    defaultValue={analysisData?.analyses.lundstromAnalysis.lower.segments.s4?.availableSpace}
                                    className="max-w-12 h-7 px-1 text-center text-xs mx-auto"
                                  />
                                ) : (
                                  <span className="text-sm text-center block">
                                    {analysisData?.analyses.lundstromAnalysis.lower.segments.s4?.availableSpace ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      `analyses.lundstromAnalysis.lower.segments.s5.availableSpace`
                                    )}
                                    defaultValue={analysisData?.analyses.lundstromAnalysis.lower.segments.s5?.availableSpace}
                                    className="max-w-12 h-7 px-1 text-center text-xs mx-auto"
                                  />
                                ) : (
                                  <span className="text-sm text-center block">
                                    {analysisData?.analyses.lundstromAnalysis.lower.segments.s5?.availableSpace ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell colSpan={2} className="py-1 text-center">
                                {isEditing ? (
                                  <Input
                                    {...register(
                                      `analyses.lundstromAnalysis.lower.segments.s6.availableSpace`
                                    )}
                                    defaultValue={analysisData?.analyses.lundstromAnalysis.lower.segments.s6?.availableSpace}
                                    className="max-w-12 h-7 px-1 text-center text-xs mx-auto"
                                  />
                                ) : (
                                  <span className="text-sm text-center block">
                                    {analysisData?.analyses.lundstromAnalysis.lower.segments.s6?.availableSpace ?? "-"}
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium text-sm">
                                Razlika
                              </TableCell>
                              <TableCell colSpan={2} className={`text-center ${getDifferenceColor(analysisData?.analyses.lundstromAnalysis.lower.segments.s1?.difference)}`}>
                                {getDifferenceBadge(analysisData?.analyses.lundstromAnalysis.lower.segments.s1?.difference)}
                              </TableCell>
                              <TableCell colSpan={2} className={`text-center ${getDifferenceColor(analysisData?.analyses.lundstromAnalysis.lower.segments.s2?.difference)}`}>
                                {getDifferenceBadge(analysisData?.analyses.lundstromAnalysis.lower.segments.s2?.difference)}
                              </TableCell>
                              <TableCell colSpan={2} className={`text-center ${getDifferenceColor(analysisData?.analyses.lundstromAnalysis.lower.segments.s3?.difference)}`}>
                                {getDifferenceBadge(analysisData?.analyses.lundstromAnalysis.lower.segments.s3?.difference)}
                              </TableCell>
                              <TableCell colSpan={2} className={`text-center ${getDifferenceColor(analysisData?.analyses.lundstromAnalysis.lower.segments.s4?.difference)}`}>
                                {getDifferenceBadge(analysisData?.analyses.lundstromAnalysis.lower.segments.s4?.difference)}
                              </TableCell>
                              <TableCell colSpan={2} className={`text-center ${getDifferenceColor(analysisData?.analyses.lundstromAnalysis.lower.segments.s5?.difference)}`}>
                                {getDifferenceBadge(analysisData?.analyses.lundstromAnalysis.lower.segments.s5?.difference)}
                              </TableCell>
                              <TableCell colSpan={2} className={`text-center ${getDifferenceColor(analysisData?.analyses.lundstromAnalysis.lower.segments.s6?.difference)}`}>
                                {getDifferenceBadge(analysisData?.analyses.lundstromAnalysis.lower.segments.s6?.difference)}
                              </TableCell>
                            </TableRow>
                          </>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
