import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/lib/utils";
import type { ToothTreatmentFormData } from "@/lib/schemas";
import { getTranslatedToothParts, getTranslatedAllTeeth, isFrontTooth } from "@/lib/constants";

interface TreatmentListProps {
  treatments: ToothTreatmentFormData[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  currency?: string;
}

export function TreatmentList({ treatments, onEdit, onDelete, currency = "RSD" }: TreatmentListProps) {
  const { t } = useTranslation();

  const translatedToothParts = getTranslatedToothParts(t);
  const translatedAllTeeth = getTranslatedAllTeeth(t);

  const getToothLabel = (toothNumber: number | undefined) => {
    if (!toothNumber) return "";
    const tooth = translatedAllTeeth.find(t => t.number === toothNumber);
    return tooth?.label || toothNumber.toString();
  };

  if (treatments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("appointments.treatmentsByTeeth")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="font-medium">
              {t("appointments.noTreatmentsAdded")}
            </p>
            <p className="text-sm">
              {t("appointments.clickAddTreatment")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("appointments.treatmentsByTeeth")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {treatments.map((treatment, index) => (
          <Card
            key={index}
            className="border-2 border-gray-200 hover:border-blue-300 transition-colors"
          >
            <CardContent className="p-3">
              <div className="flex items-start gap-4">
                {/* Left side - Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-base mb-2">
                    {t("appointments.treatment")} #{index + 1}
                  </h4>
                  
                  <div className="space-y-1.5 text-sm">
                    {/* Tooth or Global */}
                    {treatment.isGlobal ? (
                      <div>
                        <span className="font-medium text-gray-600">{t("appointments.globalTherapy")}:</span>{" "}
                        <Badge variant="secondary" className="text-xs">{t("common.yes")}</Badge>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="font-medium text-gray-600">{t("dentalCard.tooth")}:</span>{" "}
                            <span>{getToothLabel(treatment.toothNumber)}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">{t("appointments.toothType")}:</span>{" "}
                            <span>
                              {treatment.toothType === "permanent" 
                                ? t("appointments.permanentTooth")
                                : t("appointments.deciduousTooth")
                              }
                            </span>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Tooth Areas */}
                    {!treatment.isGlobal && treatment.toothAreas && treatment.toothAreas.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-600">{t("appointments.toothParts")}:</span>{" "}
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {treatment.toothAreas.map((area, areaIndex) => {
                            const partIndex = ["Incizalno", "Okluzalno", "Bukalno", "Distalno", "Mezijalno", "Palatinalno", "Lingvalno", "Krunica", "Jednokoreni zub", "Dvokoreni zub", "Trokoreni zub", "Livena nadogradnja"].indexOf(area);
                            const translatedArea = partIndex >= 0 ? translatedToothParts[partIndex] : area;
                            return (
                              <Badge key={areaIndex} variant="secondary" className="text-xs py-0">
                                {translatedArea}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Price */}
                    {treatment.price && (
                      <div>
                        <span className="font-medium text-gray-600">{t("appointmentDetail.price")}:</span>{" "}
                        <span className="text-green-600 font-semibold">
                          {formatCurrency(parseFloat(treatment.price), currency)}
                        </span>
                      </div>
                    )}

                    {/* Notes */}
                    {treatment.notes && (
                      <div>
                        <span className="font-medium text-gray-600">{t("appointments.notes")}:</span>{" "}
                        <span className="text-gray-700">{treatment.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side - SVG Tooth Diagram and Action Buttons */}
                <div className="flex-shrink-0 flex flex-col items-end gap-2">
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(index)}
                      className="h-7 w-7 p-0"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(index)}
                      className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  
                  {/* SVG Tooth Diagram */}
                  {!treatment.isGlobal && treatment.toothAreas && treatment.toothAreas.length > 0 && (() => {
                    const isFront = treatment.toothNumber ? isFrontTooth(treatment.toothNumber) : false;
                    return (
                      <div className="w-32 h-32 bg-gray-50 rounded-lg p-2 border border-gray-200">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="-2 -2 45.19 45.18"
                          className="w-full h-full"
                        >
                          <style>{`
                            .tooth-part-display {
                              fill: #e5e7eb;
                              stroke: #9ca3af;
                              stroke-width: 0.3;
                              stroke-linejoin: round;
                            }
                            .tooth-part-display-selected {
                              fill: #3b82f6;
                              stroke: #1e40af;
                              stroke-width: 0.5;
                            }
                          `}</style>
                          
                          {/* Distalno (Right) - Always shown */}
                          <path
                            className={treatment.toothAreas.includes("Distalno") ? "tooth-part-display-selected" : "tooth-part-display"}
                            d="M34.88,5.76c3.89,3.74,6.31,9,6.31,14.83s-2.42,11.09-6.31,14.83l-8.56-8.49c1.74-1.55,2.83-3.82,2.83-6.34s-1.09-4.79-2.83-6.34h0s8.56-8.49,8.56-8.49Z"
                          />
                          
                          {/* Lingvalno/Palatinalno (Top surface) - Always shown */}
                          <path
                            className={treatment.toothAreas.includes("Lingvalno") || treatment.toothAreas.includes("Palatinalno") ? "tooth-part-display-selected" : "tooth-part-display"}
                            d="M34.88,5.76l-8.56,8.48c-1.51-1.37-3.52-2.2-5.72-2.2-2.48,0-4.71,1.05-6.27,2.74L5.98,6.08C9.72,2.33,14.89,0,20.6,0s10.57,2.2,14.28,5.76h0Z"
                          />
                          
                          {/* Center part - Incizalno for front teeth, Okluzalno for side teeth */}
                          {isFront ? (
                            <path
                              className={treatment.toothAreas.includes("Incizalno") ? "tooth-part-display-selected" : "tooth-part-display"}
                              d="M26.32,14.25c1.74,1.55,2.83,3.82,2.83,6.34s-1.09,4.79-2.83,6.34c-1.51,1.38-3.52,2.21-5.72,2.21-2.37,0-4.5-.96-6.05-2.51s-2.5-3.68-2.5-6.04.87-4.29,2.28-5.81c1.56-1.69,3.79-2.74,6.27-2.74,2.2,0,4.21.83,5.72,2.2h0Z"
                            />
                          ) : (
                            <path
                              className={treatment.toothAreas.includes("Okluzalno") ? "tooth-part-display-selected" : "tooth-part-display"}
                              d="M26.32,14.25c1.74,1.55,2.83,3.82,2.83,6.34s-1.09,4.79-2.83,6.34c-1.51,1.38-3.52,2.21-5.72,2.21-2.37,0-4.5-.96-6.05-2.51s-2.5-3.68-2.5-6.04.87-4.29,2.28-5.81c1.56-1.69,3.79-2.74,6.27-2.74,2.2,0,4.21.83,5.72,2.2h0Z"
                            />
                          )}
                          
                          {/* Bottom part - Labijalno for front teeth, Bukalno for side teeth */}
                          {isFront ? (
                            <path
                              className={treatment.toothAreas.includes("Labijalno") ? "tooth-part-display-selected" : "tooth-part-display"}
                              d="M14.55,26.63c1.55,1.55,3.68,2.51,6.05,2.51,2.2,0,4.21-.83,5.72-2.21l8.56,8.49c-3.71,3.56-8.73,5.76-14.28,5.76s-10.88-2.32-14.61-6.07l8.34-8.18s.22-.3.22-.3Z"
                            />
                          ) : (
                            <path
                              className={treatment.toothAreas.includes("Bukalno") ? "tooth-part-display-selected" : "tooth-part-display"}
                              d="M14.55,26.63c1.55,1.55,3.68,2.51,6.05,2.51,2.2,0,4.21-.83,5.72-2.21l8.56,8.49c-3.71,3.56-8.73,5.76-14.28,5.76s-10.88-2.32-14.61-6.07l8.34-8.18s.22-.3.22-.3Z"
                            />
                          )}
                          
                          {/* Mezijalno (Left) - Always shown */}
                          <path
                            className={treatment.toothAreas.includes("Mezijalno") ? "tooth-part-display-selected" : "tooth-part-display"}
                            d="M14.55,26.63l-.22.3-8.34,8.18C2.29,31.38,0,26.25,0,20.59S2.29,9.8,5.98,6.08l8.35,8.7c-1.41,1.52-2.28,3.56-2.28,5.81,0,2.36.96,4.5,2.5,6.04h0Z"
                          />
                          
                          {/* Krunica - Only shown if selected (overlay on center) */}
                          {treatment.toothAreas.includes("Krunica") && (
                            <path
                              className="tooth-part-display-selected"
                              d="M26.32,14.25c1.74,1.55,2.83,3.82,2.83,6.34s-1.09,4.79-2.83,6.34c-1.51,1.38-3.52,2.21-5.72,2.21-2.37,0-4.5-.96-6.05-2.51s-2.5-3.68-2.5-6.04.87-4.29,2.28-5.81c1.56-1.69,3.79-2.74,6.27-2.74,2.2,0,4.21.83,5.72,2.2h0Z"
                              opacity="0.7"
                            />
                          )}
                        </svg>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

