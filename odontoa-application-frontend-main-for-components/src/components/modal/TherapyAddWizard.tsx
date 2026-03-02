import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Plus, Trash2, Check, ArrowLeft, Calendar, Clock, User, Stethoscope } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { dgGroups, thGroups, toothParts, dgOptions, thOptions, getTranslatedToothParts, getTranslatedDgGroups, getTranslatedThGroups, getTranslatedDgOptions, getTranslatedThOptions, upperJawPermanent, upperJawTemporary, lowerJawPermanent, lowerJawTemporary, teethSVGsPermanent, teethSVGsTemporary, isFrontTooth } from "@/lib/constants";
import { toothTreatmentSchema, ToothTreatmentFormData } from "@/lib/schemas";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { getDateFnsLocale, getStatusBadge, getTypeBadge } from "@/lib/utils";
import { ToothGroup } from "../patients/dental/ToothGroup";
import { useGetAppointmentsByPatientID } from "@/hooks/appointments/useGetAppointmentsByPatientID";
import { useCreateToothRecordsBulk } from "@/hooks/patients/useCreateToothRecordsBulk";
import { useParams } from "react-router-dom";

interface TherapyAddWizardProps {
  onCancel: () => void;
  selectedTooth?: number | null;
}

type Step = "select-appointment" | "create-therapy";

export function TherapyAddWizard({ onCancel, selectedTooth }: TherapyAddWizardProps) {
  const { t, i18n } = useTranslation();
  const [currentStep, setCurrentStep] = useState<Step>("select-appointment");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id: patientId } = useParams();

  const { data: appointments } = useGetAppointmentsByPatientID(1, 100);
  const { mutate: createToothRecords, isPending } = useCreateToothRecordsBulk();

  // Get translated constants
  const translatedToothParts = getTranslatedToothParts(t);
  const translatedDgGroups = getTranslatedDgGroups(t);
  const translatedThGroups = getTranslatedThGroups(t);
  const translatedDgOptions = getTranslatedDgOptions(t);
  const translatedThOptions = getTranslatedThOptions(t);

  const form = useForm<ToothTreatmentFormData>({
    resolver: zodResolver(toothTreatmentSchema),
    defaultValues: {
      toothNumber: 0,
      entryType: "Status",
      toothAreas: [],
      toothType: "permanent",
      dgGroupName: undefined,
      dgValue: undefined,
      therapies: [],
      notes: undefined,
      price: "",
      isGlobal: false,
      isWholeTooth: false,
    },
  });

  // Watch only the entry type for conditional rendering
  const entryType = form.watch("entryType");
  const isGlobal = form.watch("isGlobal");
  const isWholeTooth = form.watch("isWholeTooth");
  const toothType = form.watch("toothType");
  const toothNumber = form.watch("toothNumber");
  
  // Determine if selected tooth is front or side tooth
  const isFront = typeof toothNumber === "number" && toothNumber > 0 ? isFrontTooth(toothNumber) : false;

  // Handle isGlobal change and reset tooth-related fields
  const handleIsGlobalChange = (checked: boolean) => {
    form.setValue("isGlobal", checked);

    // Reset tooth-related fields when switching to global therapy
    if (checked) {
      form.setValue("toothNumber", 0);
      form.setValue("toothAreas", []);
      form.setValue("isWholeTooth", false);
      form.setValue("therapies", []);
    }
  };

  // Handle isWholeTooth change and reset tooth-related fields
  const handleIsWholeToothChange = (checked: boolean) => {
    form.setValue("isWholeTooth", checked);

    // Reset tooth-related fields when switching to whole tooth therapy
    if (checked) {
      form.setValue("toothAreas", []);
      form.setValue("isGlobal", false);
    }
  };

  // Scroll to top when component mounts or step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Set selected tooth when component mounts or selectedTooth changes
  useEffect(() => {
    if (selectedTooth && selectedTooth > 0) {
      form.setValue("toothNumber", selectedTooth);
      form.setValue("isGlobal", false);
    }
  }, [selectedTooth, form]);

  // Reset form when entry type changes
  useEffect(() => {
    if (entryType !== "Dg/Th") {
      form.setValue("dgGroupName", undefined);
      form.setValue("dgValue", undefined);
      form.setValue("therapies", []);
    }
  }, [entryType, form]);

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
    }
  }, [isWholeTooth, form]);

  const handleAppointmentSelect = (appointment: any) => {
    setSelectedAppointment(appointment);
    setCurrentStep("create-therapy");
  };

  const handleBackToAppointments = () => {
    setCurrentStep("select-appointment");
    setSelectedAppointment(null);
    form.reset();
    // Restore selected tooth after reset
    if (selectedTooth && selectedTooth > 0) {
      form.setValue("toothNumber", selectedTooth);
      form.setValue("isGlobal", false);
    }
  };

  const handleSave = async () => {
    if (!selectedAppointment || !patientId) return;

    const isValid = await form.trigger();
    if (!isValid) {
      toast.error(t("components.therapyAddModal.fixErrors"));
      return;
    }

    const data = form.getValues();
    
    // Process treatment to set price as undefined when not entered
    // and exclude toothNumber and toothAreas for global procedures
    // For whole tooth treatments, set toothAreas to empty array but keep toothNumber
    const processedTreatment: any = {
      ...data,
      price: data.price && data.price.trim() !== "" ? data.price : undefined,
    };

    // For global procedures, exclude toothNumber and toothAreas
    if (data.isGlobal) {
      delete processedTreatment.toothNumber;
      delete processedTreatment.toothAreas;
    }

    // For whole tooth treatments, set toothAreas to empty array but keep toothNumber
    if (data.isWholeTooth) {
      processedTreatment.toothAreas = [];
    }

    setIsSubmitting(true);
    
    createToothRecords(
      {
        data: [processedTreatment],
        patientId: parseInt(patientId),
        appointmentId: selectedAppointment.id,
      },
      {
        onSuccess: () => {
          onCancel();
        },
        onError: (error) => {
          toast.error(error.message || t("components.therapyAddModal.errorAdding"));
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      }
    );
  };

  // Handle entry type change and reset dependent fields
  const handleEntryTypeChange = (value: string) => {
    form.setValue("entryType", value as any);

    // Reset DG and TH related fields when entry type is not "Dg/Th"
    if (value !== "Dg/Th") {
      form.setValue('dgGroupName', undefined);
      form.setValue('dgValue', undefined);
      form.setValue('therapies', []);
    }
  };

  // Step 1: Select Appointment
  if (currentStep === "select-appointment") {
    return (
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("common.back")}
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              {t("components.therapyAddModal.selectAppointment")}
            </h1>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 mb-4">
              {t("components.therapyAddModal.selectAppointmentDescription")}
            </p>
            
            <div className="grid gap-3 max-h-96 overflow-y-auto">
              {appointments?.data && appointments.data.length > 0 ? (
                appointments.data.map((appointment) => (
                  <Card 
                    key={appointment.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleAppointmentSelect(appointment)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">
                                {format(new Date(appointment.startTime), "dd.MM.yyyy", { locale: getDateFnsLocale(i18n.language) })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">
                                {format(new Date(appointment.startTime), "HH:mm", { locale: getDateFnsLocale(i18n.language) })} - 
                                {format(new Date(appointment.endTime), "HH:mm", { locale: getDateFnsLocale(i18n.language) })}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Stethoscope className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{appointment.dentalService}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">
                                Dr {appointment.dentist.firstName} {appointment.dentist.lastName}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 items-end">
                          {getStatusBadge(appointment.status, t)}
                          {getTypeBadge(appointment.treatmentType, t)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    {t("components.therapyAddModal.noAppointmentsFound")}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t("components.therapyAddModal.addAppointmentFirst")}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 2: Create Therapy
  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={handleBackToAppointments}
          disabled={isSubmitting}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("common.back")}
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            {t("components.therapyAddModal.addTherapy")}
          </h1>
        </div>
      </div>

      {/* Selected Appointment Info */}
      {selectedAppointment && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {t("components.therapyAddModal.selectedAppointment")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">
                    {format(new Date(selectedAppointment.startTime), "dd.MM.yyyy", { locale: getDateFnsLocale(i18n.language) })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">
                    {format(new Date(selectedAppointment.startTime), "HH:mm", { locale: getDateFnsLocale(i18n.language) })} - 
                    {format(new Date(selectedAppointment.endTime), "HH:mm", { locale: getDateFnsLocale(i18n.language) })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{selectedAppointment.dentalService}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("components.therapyAddModal.therapyInfo")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
        <Form {...form}>
          <form className="space-y-6">
                {/* Global Therapy Checkbox */}
                <FormField
                  control={form.control}
                  name="isGlobal"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-lg border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={handleIsGlobalChange}
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
                          onCheckedChange={handleIsWholeToothChange}
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

                {/* Tooth Selection - Show when not global or when whole tooth */}
                {(!isGlobal || isWholeTooth) && (
                  <>
                    <FormField
                      control={form.control}
                      name="toothType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>{t("components.therapyAddModal.toothType")}</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex flex-wrap gap-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="permanent" id="permanent" />
                                <Label htmlFor="permanent" className="text-sm">
                                  {t("components.therapyAddModal.permanent")}
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="deciduous" id="deciduous" />
                                <Label htmlFor="deciduous" className="text-sm">
                                  {t("components.therapyAddModal.deciduous")}
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="toothNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("components.therapyAddModal.selectTooth")}</FormLabel>
                          <p className="text-sm text-gray-500 mb-3">
                            {t("appointments.clickToSelectTooth")}
                          </p>

                          {/* Visual Odontogram */}
                          <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
                            {/* Upper Jaw */}
                            <div className="mb-6">
                              <p className="text-xs font-semibold text-gray-600 mb-2 text-center">
                                {t("appointments.upperJaw")}
                              </p>
                              <div className="flex justify-center mb-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  version="1.1"
                                  viewBox="0 0 818.34 220.45"
                                  className="w-full max-w-4xl"
                                >
                                  {toothType === "permanent" ? upperJawPermanent.map((toothNum) => (
                                    <ToothGroup
                                      key={toothNum}
                                      toothNumber={toothNum}
                                      onClick={(toothNum) => field.onChange(Number(toothNum))}
                                      selected={field.value === Number(toothNum)}
                                      paths={teethSVGsPermanent[toothNum]}
                                    />
                                  )) : upperJawTemporary.map((toothNum) => (
                                    <ToothGroup
                                      key={toothNum}
                                      toothNumber={toothNum}
                                      onClick={(toothNum) => field.onChange(Number(toothNum))}
                                      selected={field.value === Number(toothNum)}
                                      paths={teethSVGsTemporary[toothNum]}
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
                              <div className="flex justify-center mb-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  version="1.1"
                                  viewBox="0 0 818.34 220.45"
                                  className="w-full max-w-4xl"
                                >
                                  {toothType === "permanent" ? lowerJawPermanent.map((toothNum) => (
                                    <ToothGroup
                                      key={toothNum}
                                      toothNumber={toothNum}
                                      onClick={(toothNum) => field.onChange(Number(toothNum))}
                                      selected={field.value === Number(toothNum)}
                                      paths={teethSVGsPermanent[toothNum]}
                                    />
                                  )) : lowerJawTemporary.map((toothNum) => (
                                    <ToothGroup
                                      key={toothNum}
                                      toothNumber={toothNum}
                                      onClick={(toothNum) => field.onChange(Number(toothNum))}
                                      selected={field.value === Number(toothNum)}
                                      paths={teethSVGsTemporary[toothNum]}
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
                  </>
                )}

                {/* Tooth Areas - Only show when not global and not whole tooth */}
                {!isGlobal && !isWholeTooth && (
                      <FormField
                        control={form.control}
                        name="toothAreas"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("components.therapyAddModal.toothParts")}</FormLabel>
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
                                    const hasLingval = currentAreas.includes("Lingvalno");
                                    const hasPalat = currentAreas.includes("Palatinalno");
                                    if (hasLingval || hasPalat) {
                                      field.onChange(
                                        currentAreas.filter((a) => a !== "Lingvalno" && a !== "Palatinalno")
                                      );
                                    } else {
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
                                {field.value.map((area: string) => {
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
                {/* Entry Type */}
                <FormField
                  control={form.control}
                  name="entryType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>{t("components.therapyAddModal.entryType")}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={handleEntryTypeChange}
                          value={field.value}
                          className="flex flex-wrap gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Status" id="status" />
                            <Label htmlFor="status" className="text-sm">
                              {t("components.therapyAddModal.status")}
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Terapija" id="terapija" />
                            <Label htmlFor="terapija" className="text-sm">
                              {t("components.therapyAddModal.therapy")}
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Kontrola" id="kontrola" />
                            <Label htmlFor="kontrola" className="text-sm">
                              {t("components.therapyAddModal.control")}
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Dg/Th" id="dg-th" />
                            <Label htmlFor="dg-th" className="text-sm">
                              {t("components.therapyAddModal.dgTh")}
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Show DG Group and TH Group only when entry type is "Dg/Th" */}
                {entryType === "Dg/Th" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* DG Group */}
                      <FormField
                        control={form.control}
                        name="dgGroupName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("components.therapyAddModal.dgGroup")}</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || ""}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("components.therapyAddModal.selectDgGroup")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {dgGroups.map((dgGroup, dgIndex) => {
                                  const translatedGroup = translatedDgGroups[dgIndex];
                                  return (
                                    <SelectItem key={dgIndex} value={dgGroup}>
                                      {translatedGroup}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* DG Value */}
                      <FormField
                        control={form.control}
                        name="dgValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("components.therapyAddModal.dgValue")}</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || ""}
                              disabled={!form.watch("dgGroupName")}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("components.therapyAddModal.selectDgValue")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {form.watch("dgGroupName") &&
                                  dgOptions[form.watch("dgGroupName") as keyof typeof dgOptions]?.map((dgValue, dgValueIndex) => {
                                    const translatedValue = translatedDgOptions[form.watch("dgGroupName") as keyof typeof dgOptions]?.[dgValueIndex] || dgValue;
                                    return (
                                      <SelectItem key={dgValueIndex} value={dgValue}>
                                        {translatedValue}
                                      </SelectItem>
                                    );
                                  })
                                }
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* TH Therapies */}
                    <FormField
                      control={form.control}
                      name="therapies"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between mb-4">
                            <FormLabel>{t("components.therapyAddModal.therapies")}</FormLabel>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => {
                                field.onChange([...(field.value || []), { thGroupName: "", thValue: "" }]);
                              }}
                              className="flex items-center gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              {t("components.therapyAddModal.addTherapy")}
                            </Button>
                          </div>
                          
                          <div className="space-y-4">
                            {field.value?.map((therapy, therapyIndex) => (
                              <Card key={therapyIndex} className="p-4 border-2 border-dashed border-gray-200">
                                <div className="flex items-center justify-between mb-3">
                                  <h5 className="font-medium">{t("components.therapyAddModal.therapyNumber", { number: therapyIndex + 1 })}</h5>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      field.onChange((field.value || []).filter((_, i) => i !== therapyIndex));
                                    }}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {/* TH Group */}
                                  <div>
                                    <Label className="text-sm font-medium">{t("components.therapyAddModal.thGroup")}</Label>
                                    <Select
                                      value={therapy.thGroupName}
                                      onValueChange={(value) => {
                                        const updatedTherapies = [...(field.value || [])];
                                        updatedTherapies[therapyIndex] = { ...therapy, thGroupName: value, thValue: "" };
                                        field.onChange(updatedTherapies);
                                      }}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder={t("components.therapyAddModal.selectThGroup")} />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {thGroups.map((thGroup, thIndex) => {
                                          const translatedGroup = translatedThGroups[thIndex];
                                          return (
                                            <SelectItem key={thIndex} value={thGroup}>
                                              {translatedGroup}
                                            </SelectItem>
                                          );
                                        })}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  {/* TH Value */}
                                  <div>
                                    <Label className="text-sm font-medium">{t("components.therapyAddModal.thValue")}</Label>
                                    <Select
                                      value={therapy.thValue}
                                      onValueChange={(value) => {
                                        const updatedTherapies = [...(field.value || [])];
                                        updatedTherapies[therapyIndex] = { ...therapy, thValue: value };
                                        field.onChange(updatedTherapies);
                                      }}
                                      disabled={!therapy.thGroupName}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder={t("components.therapyAddModal.selectThValue")} />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {therapy.thGroupName &&
                                          thOptions[therapy.thGroupName as keyof typeof thOptions]?.map((thValue, thValueIndex) => {
                                            const translatedValue = translatedThOptions[therapy.thGroupName as keyof typeof thOptions]?.[thValueIndex] || thValue;
                                            return (
                                              <SelectItem key={thValueIndex} value={thValue}>
                                                {translatedValue}
                                              </SelectItem>
                                            );
                                          })
                                        }
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                {/* Show selected therapy as badge */}
                                {therapy.thGroupName && therapy.thValue && (
                                  <div className="mt-3">
                                    <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                                      {translatedThGroups[thGroups.indexOf(therapy.thGroupName)] || therapy.thGroupName}: {translatedThOptions[therapy.thGroupName as keyof typeof thOptions]?.[thOptions[therapy.thGroupName as keyof typeof thOptions]?.indexOf(therapy.thValue) || 0] || therapy.thValue}
                                    </Badge>
                                  </div>
                                )}
                              </Card>
                            )) || []}
                          </div>

                          {/* Show all selected therapies as summary */}
                          {field.value && field.value.length > 0 && (
                            <div className="mt-4">
                              <Label className="text-sm font-medium mb-2 block">{t("components.therapyAddModal.selectedTherapies")}</Label>
                              <div className="flex flex-wrap gap-2">
                                {field.value
                                  .filter(therapy => therapy.thGroupName && therapy.thValue)
                                  .map((therapy, idx) => {
                                    const translatedGroup = translatedThGroups[thGroups.indexOf(therapy.thGroupName)] || therapy.thGroupName;
                                    const translatedValue = translatedThOptions[therapy.thGroupName as keyof typeof thOptions]?.[thOptions[therapy.thGroupName as keyof typeof thOptions]?.indexOf(therapy.thValue) || 0] || therapy.thValue;
                                    return (
                                      <Badge key={idx} variant="outline">
                                        {translatedGroup}: {translatedValue}
                                      </Badge>
                                    );
                                  })
                                }
                              </div>
                            </div>
                          )}

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* Price */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("components.therapyAddModal.price")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("components.therapyAddModal.enterPrice")}
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Notes */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("components.therapyAddModal.notes")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("components.therapyAddModal.notesPlaceholder")}
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting || isPending}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={isSubmitting || isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Check className="h-4 w-4 mr-2" />
                {isSubmitting || isPending ? t("components.therapyAddModal.adding") : t("components.therapyAddModal.addTherapy")}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
    </div>
  );
}

