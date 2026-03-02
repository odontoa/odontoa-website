import { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { toothParts, getTranslatedToothParts, upperJawPermanent, upperJawTemporary, lowerJawPermanent, lowerJawTemporary, teethSVGsPermanent, teethSVGsTemporary, isFrontTooth, thGroups, thOptions, getTranslatedThGroups, getTranslatedThOptions } from "@/lib/constants";
import {
  toothTreatmentSchema,
  type ToothTreatmentFormData,
} from "@/lib/schemas";
import { ToothGroup } from "../patients/dental/ToothGroup";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import { TherapyRecord } from "@/types/ToothRecords";

interface TreatmentWizardProps {
  onSave: (treatment: ToothTreatmentFormData) => void;
  onCancel: () => void;
  initialData?: ToothTreatmentFormData;
  currency?: string;
  patientId?: number;
}

export function TreatmentWizard({
  onSave,
  onCancel,
  initialData,
  currency = "RSD",
  patientId,
}: TreatmentWizardProps) {
  const { t } = useTranslation();

  const translatedToothParts = getTranslatedToothParts(t);
  const translatedThGroups = getTranslatedThGroups(t);
  const translatedThOptions = getTranslatedThOptions(t);

  const form = useForm<ToothTreatmentFormData>({
    resolver: zodResolver(toothTreatmentSchema),
    defaultValues: initialData || {
      toothNumber: 0,
      toothAreas: [],
      toothType: "permanent",
      dgGroupName: undefined,
      therapies: [],
      dgValue: undefined,
      notes: undefined,
      price: "",
      isGlobal: false,
      isWholeTooth: false,
    },
  });

  const isGlobal = form.watch("isGlobal");
  const isWholeTooth = form.watch("isWholeTooth");

  const toothType = form.watch("toothType");
  const toothNumber = form.watch("toothNumber");
  
  // Determine if selected tooth is front or side tooth
  const isFront = typeof toothNumber === "number" && toothNumber > 0 ? isFrontTooth(toothNumber) : false;

  // Get therapy records to check if tooth is already extracted
  // Use custom query since we have patientId from props, not from route params
  const { data: therapyRecords } = useQuery<{
    data: TherapyRecord[];
    totalElements: number;
    totalPages: number;
    pageSize: number;
    pageNumber: number;
  }>({
    queryKey: [
      "therapyRecords",
      "patientMedicalCards",
      patientId,
      isWholeTooth && toothNumber ? toothNumber : null,
    ],
    queryFn: async () => {
      if (!patientId) {
        return { data: [], totalElements: 0, totalPages: 0, pageSize: 0, pageNumber: 0 };
      }
      
      const queryParams = new URLSearchParams();
      if (isWholeTooth && toothNumber) {
        queryParams.append("toothNumber", toothNumber.toString());
      }
      queryParams.append("limit", "100");
      queryParams.append("page", "1");
      
      const url = `patientMedicalCard/${patientId}/therapyRecords${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    },
    enabled: !!patientId && isWholeTooth && !!toothNumber,
  });

  // Check if selected tooth is already extracted
  const isToothExtracted = useMemo(() => {
    if (!isWholeTooth || !toothNumber || !therapyRecords?.data) return false;
    
    return therapyRecords.data.some((record) => {
      if (record.isGlobal || !record.therapies || record.therapies.length === 0) return false;
      return record.therapies.some(
        (therapy) => therapy.thGroupName === "Vađenje zuba"
      );
    });
  }, [isWholeTooth, toothNumber, therapyRecords]);

  // Reset tooth-related fields when isGlobal changes
  useEffect(() => {
    if (isGlobal) {
      form.setValue("toothNumber", 0);
      form.setValue("toothAreas", []);
      form.setValue("isWholeTooth", false);
      form.setValue("therapies", []);
    }
  }, [isGlobal, form]);

  // Reset fields when isWholeTooth changes
  useEffect(() => {
    if (isWholeTooth) {
      form.setValue("toothAreas", []);
      form.setValue("isGlobal", false);
      // Set default therapy to "Vađenje zuba" if no therapy is selected
      if (!form.getValues("therapies") || form.getValues("therapies")?.length === 0) {
        form.setValue("therapies", [{
          thGroupName: "Vađenje zuba",
          thValue: "",
        }]);
      }
    } else {
      form.setValue("therapies", []);
    }
  }, [isWholeTooth, form]);

  const handleSave = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error(t("messages.fixFormErrors"));
      return;
    }

    const data = form.getValues();
    onSave(data);
  };

  const renderStep = () => {
    // Single step: All fields combined
    return (
      <div className="space-y-6">
        {/* Global Checkbox */}
        <FormField
          control={form.control}
          name="isGlobal"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-lg border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-medium">
                  {t("appointments.globalTherapy")}
                </FormLabel>
                <p className="text-sm text-gray-500">
                  {t("appointments.globalTherapyDescription")}
                </p>
              </div>
            </FormItem>
          )}
        />

        {/* Whole Tooth Checkbox */}
        <FormField
          control={form.control}
          name="isWholeTooth"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-lg border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-medium">
                  {t("appointments.wholeToothTreatment")}
                </FormLabel>
                <p className="text-sm text-gray-500">
                  {t("appointments.wholeToothTreatmentDescription")}
                </p>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="toothType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-semibold">
                {t("appointments.toothType")}
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50">
                    <RadioGroupItem value="permanent" id="permanent" />
                    <Label
                      htmlFor="permanent"
                      className="flex-1 cursor-pointer"
                    >
                      {t("appointments.permanentTooth")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50">
                    <RadioGroupItem value="deciduous" id="deciduous" />
                    <Label
                      htmlFor="deciduous"
                      className="flex-1 cursor-pointer"
                    >
                      {t("appointments.deciduousTooth")}
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tooth Selection (only if not global or if whole tooth) */}
        {(!isGlobal || isWholeTooth) && (
          <>
            <FormField
              control={form.control}
              name="toothNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    {t("appointments.selectTooth")}
                  </FormLabel>
                  <p className="text-sm text-gray-500 mb-3">
                    {t("appointments.clickToSelectTooth")}
                  </p>

                  {/* Warning if tooth is already extracted */}
                  {isWholeTooth && isToothExtracted && (
                    <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200 flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-yellow-900">
                          {t("appointments.toothAlreadyExtracted")}
                        </p>
                        <p className="text-xs text-yellow-700 mt-1">
                          {t("appointments.toothAlreadyExtractedDescription")}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Visual Odontogram */}
                  <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
                    {/* Upper Jaw */}
                    <div className="mb-6">
                      <p className="text-xs font-semibold text-gray-600 mb-2 text-center">
                        {t("appointments.upperJaw")}
                      </p>
                      {/* Upper Jaw */}
                      <div className="flex justify-center mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          version="1.1"
                          viewBox="0 0 818.34 220.45"
                          className="w-full max-w-4xl"
                        >
                          {toothType === "permanent" ? upperJawPermanent.map((toothNumber) => (
                            <ToothGroup
                              key={toothNumber}
                              toothNumber={toothNumber}
                              onClick={(toothNum) => field.onChange(Number(toothNum))}
                              selected={field.value === Number(toothNumber)}
                              paths={teethSVGsPermanent[toothNumber]}
                            />
                          )) : upperJawTemporary.map((toothNumber) => (
                            <ToothGroup
                              key={toothNumber}
                              toothNumber={toothNumber}
                              onClick={(toothNum) => field.onChange(Number(toothNum))}
                              selected={field.value === Number(toothNumber)}
                              paths={teethSVGsTemporary[toothNumber]}
                            />
                          ))}
                        </svg>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t-2 border-dashed border-gray-300 my-4"></div>

                    {/* Lower Jaw */}
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-2 text-center">
                        {t("appointments.lowerJaw")}
                      </p>
                      {/* Lower Right Quadrant (48-41) */}
                      <div className="flex justify-center mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          version="1.1"
                          viewBox="0 0 818.34 220.45"
                          className="w-full max-w-4xl"
                        >
                          {toothType === "permanent" ? lowerJawPermanent.map((toothNumber) => (
                            <ToothGroup
                              key={toothNumber}
                              toothNumber={toothNumber}
                              onClick={(toothNum) => field.onChange(Number(toothNum))}
                              selected={field.value === Number(toothNumber)}
                              paths={teethSVGsPermanent[toothNumber]}
                            />
                          )) : lowerJawTemporary.map((toothNumber) => (
                            <ToothGroup
                              key={toothNumber}
                              toothNumber={toothNumber}
                              onClick={(toothNum) => field.onChange(Number(toothNum))}
                              selected={field.value === Number(toothNumber)}
                              paths={teethSVGsTemporary[toothNumber]}
                            />
                          ))}
                        </svg>
                      </div>
                    </div>

                    {/* Selected tooth display */}
                    {field.value! > 0 && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-blue-900">
                          {t("appointments.selectedTooth")}: {field.value}
                        </p>
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Therapy Selection for Whole Tooth */}
            {isWholeTooth && (
              <FormField
                control={form.control}
                name="therapies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      {t("appointments.selectTreatment")}
                    </FormLabel>
                    <p className="text-sm text-gray-500 mb-3">
                      {t("appointments.selectTreatmentForWholeTooth")}
                    </p>
                    <FormControl>
                      <div className="space-y-4">
                        {field.value?.map((therapy, index) => (
                          <div key={index} className="space-y-2">
                            <Select
                              value={therapy.thGroupName}
                              onValueChange={(value) => {
                                const updatedTherapies = [...(field.value || [])];
                                updatedTherapies[index] = { ...therapy, thGroupName: value, thValue: "" };
                                field.onChange(updatedTherapies);
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder={t("appointments.selectTherapyGroup")} />
                              </SelectTrigger>
                              <SelectContent>
                                {/* Only show "Vađenje zuba" for now */}
                                <SelectItem value="Vađenje zuba">
                                  {translatedThGroups[thGroups.indexOf("Vađenje zuba")] || "Vađenje zuba"}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {therapy.thGroupName && thOptions[therapy.thGroupName as keyof typeof thOptions] && (
                              <Select
                                value={therapy.thValue}
                                onValueChange={(value) => {
                                  const updatedTherapies = [...(field.value || [])];
                                  updatedTherapies[index] = { ...therapy, thValue: value };
                                  field.onChange(updatedTherapies);
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder={t("appointments.selectTherapyValue")} />
                                </SelectTrigger>
                                <SelectContent>
                                  {thOptions[therapy.thGroupName as keyof typeof thOptions]?.map((thValue, thValueIndex) => {
                                    const translatedValue = translatedThOptions[therapy.thGroupName as keyof typeof thOptions]?.[thValueIndex] || thValue;
                                    return (
                                      <SelectItem key={thValueIndex} value={thValue}>
                                        {translatedValue}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Tooth Areas Selection (only if not whole tooth) */}
            {!isWholeTooth && (
              <FormField
                control={form.control}
                name="toothAreas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      {t("appointments.toothParts")}
                    </FormLabel>
                    <p className="text-sm text-gray-500 mb-3">
                      {t("appointments.clickToSelectAreas")}
                    </p>

                  {/* Interactive SVG Tooth Diagram */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-full max-w-[280px] p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                      <svg
                        id="tooth-diagram"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="-2 -2 45.19 45.18"
                        className="w-full h-auto"
                        style={{ overflow: "visible" }}
                      >
                        <style>{`
                        .tooth-part {
                          fill: #e5e7eb;
                          stroke: #6b7280;
                          stroke-width: 0.3;
                          stroke-linejoin: round;
                          cursor: pointer;
                          transition: all 0.2s ease;
                          vector-effect: non-scaling-stroke;
                        }
                        .tooth-part:hover {
                          fill: #bfdbfe;
                          stroke: #3b82f6;
                          stroke-width: 0.5;
                        }
                        .tooth-part-selected {
                          fill: #3b82f6;
                          stroke: #1e40af;
                          stroke-width: 0.5;
                        }
                        .tooth-part-selected:hover {
                          fill: #2563eb;
                          stroke: #1e3a8a;
                          stroke-width: 0.6;
                        }
                      `}</style>

                        {/* Right/Distal - Distalno (always shown) */}
                        <path
                          className={`tooth-part ${
                            field.value?.includes("Distalno")
                              ? "tooth-part-selected"
                              : ""
                          }`}
                          d="M34.88,5.76c3.89,3.74,6.31,9,6.31,14.83s-2.42,11.09-6.31,14.83l-8.56-8.49c1.74-1.55,2.83-3.82,2.83-6.34s-1.09-4.79-2.83-6.34h0s8.56-8.49,8.56-8.49Z"
                          onClick={() => {
                            const currentAreas = field.value || [];
                            if (currentAreas.includes("Distalno")) {
                              field.onChange(
                                currentAreas.filter((a) => a !== "Distalno")
                              );
                            } else {
                              field.onChange([...currentAreas, "Distalno"]);
                            }
                          }}
                        >
                          <title>Distalno (Distal)</title>
                        </path>

                        {/* Top/Lingual-Palatal - Lingvalno/Palatinalno (always shown) */}
                        <path
                          className={`tooth-part ${
                            field.value?.includes("Lingvalno") || field.value?.includes("Palatinalno")
                              ? "tooth-part-selected"
                              : ""
                          }`}
                          d="M34.88,5.76l-8.56,8.48c-1.51-1.37-3.52-2.2-5.72-2.2-2.48,0-4.71,1.05-6.27,2.74L5.98,6.08C9.72,2.33,14.89,0,20.6,0s10.57,2.2,14.28,5.76h0Z"
                          onClick={() => {
                            const currentAreas = field.value || [];
                            // Toggle both Lingvalno and Palatinalno together
                            const hasLingval = currentAreas.includes("Lingvalno");
                            const hasPalat = currentAreas.includes("Palatinalno");
                            if (hasLingval || hasPalat) {
                              field.onChange(
                                currentAreas.filter((a) => a !== "Lingvalno" && a !== "Palatinalno")
                              );
                            } else {
                              // Add Lingvalno by default (can be changed to Palatinalno based on upper/lower jaw if needed)
                              field.onChange([...currentAreas, "Lingvalno"]);
                            }
                          }}
                        >
                          <title>Lingvalno/Palatinalno</title>
                        </path>

                        {/* Center - Incizalno for front teeth, Okluzalno for side teeth */}
                        {isFront ? (
                          <path
                            className={`tooth-part ${
                              field.value?.includes("Incizalno")
                                ? "tooth-part-selected"
                                : ""
                            }`}
                            d="M26.32,14.25c1.74,1.55,2.83,3.82,2.83,6.34s-1.09,4.79-2.83,6.34c-1.51,1.38-3.52,2.21-5.72,2.21-2.37,0-4.5-.96-6.05-2.51s-2.5-3.68-2.5-6.04.87-4.29,2.28-5.81c1.56-1.69,3.79-2.74,6.27-2.74,2.2,0,4.21.83,5.72,2.2h0Z"
                            onClick={() => {
                              const currentAreas = field.value || [];
                              if (currentAreas.includes("Incizalno")) {
                                field.onChange(
                                  currentAreas.filter((a) => a !== "Incizalno")
                                );
                              } else {
                                field.onChange([...currentAreas, "Incizalno"]);
                              }
                            }}
                          >
                            <title>Incizalno (Incisal)</title>
                          </path>
                        ) : (
                          <path
                            className={`tooth-part ${
                              field.value?.includes("Okluzalno")
                                ? "tooth-part-selected"
                                : ""
                            }`}
                            d="M26.32,14.25c1.74,1.55,2.83,3.82,2.83,6.34s-1.09,4.79-2.83,6.34c-1.51,1.38-3.52,2.21-5.72,2.21-2.37,0-4.5-.96-6.05-2.51s-2.5-3.68-2.5-6.04.87-4.29,2.28-5.81c1.56-1.69,3.79-2.74,6.27-2.74,2.2,0,4.21.83,5.72,2.2h0Z"
                            onClick={() => {
                              const currentAreas = field.value || [];
                              if (currentAreas.includes("Okluzalno")) {
                                field.onChange(
                                  currentAreas.filter((a) => a !== "Okluzalno")
                                );
                              } else {
                                field.onChange([...currentAreas, "Okluzalno"]);
                              }
                            }}
                          >
                            <title>Okluzalno (Occlusal)</title>
                          </path>
                        )}

                        {/* Bottom - Labijalno for front teeth, Bukalno for side teeth */}
                        {isFront ? (
                          <path
                            className={`tooth-part ${
                              field.value?.includes("Labijalno")
                                ? "tooth-part-selected"
                                : ""
                            }`}
                            d="M14.55,26.63c1.55,1.55,3.68,2.51,6.05,2.51,2.2,0,4.21-.83,5.72-2.21l8.56,8.49c-3.71,3.56-8.73,5.76-14.28,5.76s-10.88-2.32-14.61-6.07l8.34-8.18s.22-.3.22-.3Z"
                            onClick={() => {
                              const currentAreas = field.value || [];
                              if (currentAreas.includes("Labijalno")) {
                                field.onChange(
                                  currentAreas.filter((a) => a !== "Labijalno")
                                );
                              } else {
                                field.onChange([...currentAreas, "Labijalno"]);
                              }
                            }}
                          >
                            <title>Labijalno (Labial)</title>
                          </path>
                        ) : (
                          <path
                            className={`tooth-part ${
                              field.value?.includes("Bukalno")
                                ? "tooth-part-selected"
                                : ""
                            }`}
                            d="M14.55,26.63c1.55,1.55,3.68,2.51,6.05,2.51,2.2,0,4.21-.83,5.72-2.21l8.56,8.49c-3.71,3.56-8.73,5.76-14.28,5.76s-10.88-2.32-14.61-6.07l8.34-8.18s.22-.3.22-.3Z"
                            onClick={() => {
                              const currentAreas = field.value || [];
                              if (currentAreas.includes("Bukalno")) {
                                field.onChange(
                                  currentAreas.filter((a) => a !== "Bukalno")
                                );
                              } else {
                                field.onChange([...currentAreas, "Bukalno"]);
                              }
                            }}
                          >
                            <title>Bukalno (Buccal)</title>
                          </path>
                        )}

                        {/* Left/Mesial - Mezijalno (always shown) */}
                        <path
                          className={`tooth-part ${
                            field.value?.includes("Mezijalno")
                              ? "tooth-part-selected"
                              : ""
                          }`}
                          d="M14.55,26.63l-.22.3-8.34,8.18C2.29,31.38,0,26.25,0,20.59S2.29,9.8,5.98,6.08l8.35,8.7c-1.41,1.52-2.28,3.56-2.28,5.81,0,2.36.96,4.5,2.5,6.04h0Z"
                          onClick={() => {
                            const currentAreas = field.value || [];
                            if (currentAreas.includes("Mezijalno")) {
                              field.onChange(
                                currentAreas.filter((a) => a !== "Mezijalno")
                              );
                            } else {
                              field.onChange([...currentAreas, "Mezijalno"]);
                            }
                          }}
                        >
                          <title>Mezijalno (Mesial)</title>
                        </path>
                      </svg>
                    </div>

                    {/* Additional tooth parts (not in SVG) */}
                    <div className="w-full">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        {t("appointments.additionalAreas")}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {toothParts
                          .filter(
                            (part) => {
                              // Always exclude surfaces shown in SVG diagram
                              const svgSurfaces = isFront
                                ? [
                                    "Incizalno",
                                    "Labijalno",
                                    "Lingvalno",
                                    "Palatinalno",
                                    "Distalno",
                                    "Mezijalno",
                                  ]
                                : [
                                    "Okluzalno",
                                    "Bukalno",
                                    "Lingvalno",
                                    "Palatinalno",
                                    "Distalno",
                                    "Mezijalno",
                                  ];
                              return !svgSurfaces.includes(part);
                            }
                          )
                          .map((part, index) => {
                            const fullIndex = toothParts.indexOf(part);
                            const translatedPart =
                              translatedToothParts[fullIndex];
                            return (
                              <div
                                key={part}
                                className="flex items-center space-x-2 rounded-lg border p-2 hover:bg-gray-50"
                              >
                                <Checkbox
                                  id={`tooth-area-extra-${index}`}
                                  checked={field.value?.includes(part) || false}
                                  onCheckedChange={(checked) => {
                                    const currentAreas = field.value || [];
                                    if (checked) {
                                      field.onChange([...currentAreas, part]);
                                    } else {
                                      field.onChange(
                                        currentAreas.filter(
                                          (area) => area !== part
                                        )
                                      );
                                    }
                                  }}
                                />
                                <Label
                                  htmlFor={`tooth-area-extra-${index}`}
                                  className="text-xs cursor-pointer flex-1"
                                >
                                  {translatedPart}
                                </Label>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>

                  {/* Selected areas display */}
                  {field.value && field.value.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-900 mb-2">
                        {t("appointments.selectedToothAreas")}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {field.value.map((area) => {
                          const areaIndex = toothParts.indexOf(area);
                          const translatedArea =
                            areaIndex >= 0
                              ? translatedToothParts[areaIndex]
                              : area;
                          return (
                            <Badge
                              key={area}
                              variant="secondary"
                              className="bg-blue-100 text-blue-900 border-blue-300"
                            >
                              {translatedArea}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            )}
          </>
        )}

        {/* Price & Notes */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                {t("appointments.treatmentPrice")}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder={`${t("appointments.enterPrice")} ${currency}`}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                {t("appointments.addNote")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("appointments.notesPlaceholder")}
                  className="min-h-[120px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData
            ? t("wizard.editTreatment")
            : t("appointments.addTreatment")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            {renderStep()}

            <div className="flex justify-end gap-2 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                {t("common.cancel")}
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-2" />
                {initialData
                  ? t("common.saveChanges")
                  : t("wizard.addTreatmentToList")}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
