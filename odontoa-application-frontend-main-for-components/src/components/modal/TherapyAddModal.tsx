import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Calendar, Clock, User, Stethoscope, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { getDateFnsLocale, getStatusBadge, getTypeBadge } from "@/lib/utils";
import { dgGroups, thGroups, toothParts, dgOptions, thOptions, getTranslatedToothParts, getTranslatedDgGroups, getTranslatedThGroups, getTranslatedDgOptions, getTranslatedThOptions, getTranslatedAllTeeth } from "@/lib/constants";
import { toothTreatmentSchema, ToothTreatmentFormData } from "@/lib/schemas";
import { useGetAppointmentsByPatientID } from "@/hooks/appointments/useGetAppointmentsByPatientID";
import { useCreateToothRecordsBulk } from "@/hooks/patients/useCreateToothRecordsBulk";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface TherapyAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTooth?: number | null;
}

type Step = "select-appointment" | "create-therapy";

export function TherapyAddModal({ isOpen, onClose, selectedTooth }: TherapyAddModalProps) {
  const { t, i18n } = useTranslation();
  const [currentStep, setCurrentStep] = useState<Step>("select-appointment");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const { id: patientId } = useParams();

  const { data: appointments } = useGetAppointmentsByPatientID(1, 100);
  const { mutate: createToothRecords, isPending } = useCreateToothRecordsBulk();

  // Get translated constants
  const translatedToothParts = getTranslatedToothParts(t);
  const translatedDgGroups = getTranslatedDgGroups(t);
  const translatedThGroups = getTranslatedThGroups(t);
  const translatedDgOptions = getTranslatedDgOptions(t);
  const translatedThOptions = getTranslatedThOptions(t);
  const translatedAllTeeth = getTranslatedAllTeeth(t);

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
      price: undefined,
      isGlobal: false,
    },
  });

  const selectedEntryType = form.watch("entryType");
  const isGlobal = form.watch("isGlobal");

  // Handle isGlobal change and reset tooth-related fields
  const handleIsGlobalChange = (checked: boolean) => {
    form.setValue("isGlobal", checked);
    
    // Reset tooth-related fields when switching to global therapy
    if (checked) {
      form.setValue("toothNumber", 0);
      form.setValue("toothAreas", []);
    }
  };

  // Set selected tooth when modal opens or selectedTooth changes
  useEffect(() => {
    if (selectedTooth && selectedTooth > 0) {
      form.setValue("toothNumber", selectedTooth);
      form.setValue("isGlobal", false);
    }
  }, [selectedTooth, form]);

  // Reset form when entry type changes
  useEffect(() => {
    if (selectedEntryType !== "Dg/Th") {
      form.setValue("dgGroupName", undefined);
      form.setValue("dgValue", undefined);
      form.setValue("therapies", []);
    }
  }, [selectedEntryType, form]);

  // Reset tooth-related fields when isGlobal changes
  useEffect(() => {
    if (isGlobal) {
      form.setValue("toothNumber", 0);
      form.setValue("toothAreas", []);
    }
  }, [isGlobal, form]);

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

  const handleClose = () => {
    setCurrentStep("select-appointment");
    setSelectedAppointment(null);
    form.reset();
    // Reset isGlobal when closing
    form.setValue("isGlobal", false);
    onClose();
  };

  const onSubmit = (data: ToothTreatmentFormData) => {
    if (!selectedAppointment || !patientId) return;

    // Check if form has validation errors
    if (Object.keys(form.formState.errors).length > 0) {
      toast.error(t("components.therapyAddModal.fixErrors"));
      return;
    }

    createToothRecords(
      {
        data: [data],
        patientId: parseInt(patientId),
        appointmentId: selectedAppointment.id,
      },
      {
        onSuccess: () => {
          handleClose();
        },
        onError: (error) => {
          toast.error(error.message || t("components.therapyAddModal.errorAdding"));
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" showCloseButton={false}>
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
              <Plus className="h-6 w-6 text-blue-600" />
              {currentStep === "select-appointment" ? t("components.therapyAddModal.selectAppointment") : t("components.therapyAddModal.addTherapy")}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {currentStep === "select-appointment" && (
          <div className="space-y-4">
            <p className="text-gray-600">
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
          </div>
        )}

        {currentStep === "create-therapy" && selectedAppointment && (
          <div className="space-y-6">
            {/* Selected Appointment Info */}
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
                  <Button variant="outline" size="sm" onClick={handleBackToAppointments}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t("components.therapyAddModal.changeAppointment")}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Therapy Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("components.therapyAddModal.therapyInfo")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Global Therapy Checkbox */}
                    <FormField
                      control={form.control}
                      name="isGlobal"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={handleIsGlobalChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-medium">
                              {t("components.therapyAddModal.allTeeth")}
                            </FormLabel>
                            <p className="text-sm text-gray-500">
                              {t("components.therapyAddModal.allTeethDescription")}
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* Tooth Selection - Only show when not global */}
                    {!isGlobal && (
                      <>
                        <FormField
                          control={form.control}
                          name="toothNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("components.therapyAddModal.selectTooth")}</FormLabel>
                              <Select
                                onValueChange={(value) => field.onChange(Number.parseInt(value))}
                                value={field.value?.toString() || ""}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={t("components.therapyAddModal.selectToothPlaceholder")} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {translatedAllTeeth.map((tooth, toothIndex) => (
                                    <SelectItem
                                      key={toothIndex}
                                      value={tooth.number.toString()}
                                    >
                                      {tooth.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="toothType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("components.therapyAddModal.toothType")}</FormLabel>
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
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="toothAreas"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("components.therapyAddModal.toothParts")}</FormLabel>
                              <div className="grid grid-cols-2 gap-2">
                                {toothParts.map((part, partIndex) => {
                                  const translatedPart = translatedToothParts[partIndex];
                                  return (
                                    <div key={partIndex} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`tooth-area-${partIndex}`}
                                        checked={field.value?.includes(part) || false}
                                        onCheckedChange={(checked) => {
                                          const currentAreas = field.value || [];
                                          if (checked) {
                                            field.onChange([...currentAreas, part]);
                                          } else {
                                            field.onChange(currentAreas.filter((area: string) => area !== part));
                                          }
                                        }}
                                      />
                                      <Label
                                        htmlFor={`tooth-area-${partIndex}`}
                                        className="text-sm"
                                      >
                                        {translatedPart}
                                      </Label>
                                    </div>
                                  );
                                })}
                              </div>
                              {field.value && field.value.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {field.value.map((area: string) => {
                                    const areaIndex = toothParts.indexOf(area);
                                    const translatedArea = areaIndex >= 0 ? translatedToothParts[areaIndex] : area;
                                    return (
                                      <Badge key={area} variant="secondary" className="flex items-center gap-1">
                                        {translatedArea}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            field.onChange((field.value || []).filter((a: string) => a !== area));
                                          }}
                                          className="ml-1 hover:bg-red-200 rounded-full p-0.5"
                                        >
                                          ×
                                        </button>
                                      </Badge>
                                    );
                                  })}
                                </div>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    {/* Entry Type */}
                    <FormField
                      control={form.control}
                      name="entryType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("components.therapyAddModal.entryType")}</FormLabel>
                          <RadioGroup
                            onValueChange={field.onChange}
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Show DG Group and TH Group only when entry type is "Dg/Th" */}
                    {selectedEntryType === "Dg/Th" && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              defaultValue={0}
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
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                  >
                    {t("components.therapyAddModal.cancel")}
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? t("components.therapyAddModal.adding") : t("components.therapyAddModal.addTherapy")}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 