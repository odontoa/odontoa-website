import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  User,
  Phone,
  Stethoscope,
  Trash2,
  Plus,
  AlertCircle,
  Edit,
  Check,
  PlayCircle,
  CheckCircle,
  XCircle,
  CalendarIcon,
  Info,
  HeartPulse,
  DollarSign,
  Pencil,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/input";
import {
  addHours,
  addMinutes,
  differenceInMinutes,
  format,
  parseISO,
  startOfDay,
  isEqual,
} from "date-fns";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { dgGroups, thGroups, toothParts, dgOptions, thOptions, getTranslatedToothParts, getTranslatedDgGroups, getTranslatedThGroups, getTranslatedDgOptions, getTranslatedThOptions, getTranslatedAllTeeth } from "@/lib/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import {
  AppointmentFormData,
  appointmentFormSchema,
  TreatmentFormData,
  treatmentFormSchema,
} from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateAppointment } from "@/hooks/appointments/useUpdateAppointment";
import { useCreateToothRecordsBulk } from "@/hooks/patients/useCreateToothRecordsBulk";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { cn, generateTimes, getStatusInfo, getCancellationReasonLabel, formatCurrency, getDateFnsLocale, translateTreatment } from "@/lib/utils";
import { useGetAppointmentByID } from "@/hooks/appointments/useGetAppointmentByID";
import { useGetClinicById } from "@/hooks/clinics/useGetClinicById";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "../ui/checkbox";
import { CancellationModal } from "./CancellationModal";
import { CancellationReason } from "@/types/Appointment";

interface AppointmentSettingsModalProps {
  appointmentId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function AppointmentSettingsModal({
  appointmentId,
  isOpen,
  onClose,
}: AppointmentSettingsModalProps) {
  const { t, i18n } = useTranslation();
  const { data: appointment } = useGetAppointmentByID(appointmentId);
  const { data: clinic } = useGetClinicById();
  const [isEndingAppointment, setIsEndingAppointment] = useState(false);
  const [isEditingAppointment, setIsEditingAppointment] = useState(false);
  const [originalFormData, setOriginalFormData] = useState<AppointmentFormData | null>(null);
  const [isCancellationModalOpen, setIsCancellationModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const navigate = useNavigate();

  // Get translated constants
  const translatedToothParts = getTranslatedToothParts(t);
  const translatedDgGroups = getTranslatedDgGroups(t);
  const translatedThGroups = getTranslatedThGroups(t);
  const translatedDgOptions = getTranslatedDgOptions(t);
  const translatedThOptions = getTranslatedThOptions(t);
  const translatedAllTeeth = getTranslatedAllTeeth(t);

  const formatDateTime = (date: Date) => {
    return format(date, "HH:mm", { locale: getDateFnsLocale(i18n.language) });
  };

  const form = useForm<TreatmentFormData>({
    resolver: zodResolver(treatmentFormSchema),
    defaultValues: {
      toothTreatments: [],
    },
  });

  const appointmentForm = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      chair: 1,
      startTime: new Date(),
      time: "",
      duration: 30,
      status: "scheduled",
      notes: "",
      cancellationReason: null,
      cancellationNotes: "",
    },
  });

  // Watch form values to detect changes reactively
  const watchedValues = appointmentForm.watch();

  // Check if form has been modified
  const hasFormChanges = () => {
    if (!originalFormData || !isEditingAppointment) return false;

    return (
      watchedValues.chair !== originalFormData.chair ||
      watchedValues.time !== originalFormData.time ||
      watchedValues.duration !== originalFormData.duration ||
      watchedValues.status !== originalFormData.status ||
      watchedValues.notes !== originalFormData.notes ||
      watchedValues.cancellationReason !== originalFormData.cancellationReason ||
      watchedValues.cancellationNotes !== originalFormData.cancellationNotes ||
      !isEqual(watchedValues.startTime, originalFormData.startTime)
    );
  };

  useEffect(() => {
    if (appointment) {
      const appointmentDate = new Date(appointment.startTime);
      const formData = {
        chair: appointment.chair,
        status: appointment.status,
        startTime: appointmentDate,
        time: format(appointmentDate, "HH:mm"),
        duration: differenceInMinutes(
          appointment.endTime,
          appointment.startTime
        ),
        notes: appointment.notes,
        cancellationReason: appointment.cancellationReason,
        cancellationNotes: appointment.cancellationNotes || "",
      };

      appointmentForm.reset(formData);
      setOriginalFormData(formData);
    }
  }, [appointment, appointmentForm]);

  // Ensure selected chair does not exceed clinic chair count when editing
  useEffect(() => {
    if (clinic?.chairNumber) {
      const currentChair = appointmentForm.getValues("chair");
      if (currentChair > clinic.chairNumber) {
        appointmentForm.setValue("chair", clinic.chairNumber);
      }
    }
  }, [clinic?.chairNumber, appointmentForm]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "toothTreatments",
  });

  // Watch for entry type changes and reset dependent fields
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name && name.startsWith('toothTreatments') && name.includes('entryType')) {
        const index = parseInt(name.split('.')[1]);
        const entryType = value.toothTreatments?.[index]?.entryType;

        if (entryType !== "Dg/Th") {
          // Reset DG and TH related fields when entry type is not "Dg/Th"
          form.setValue(`toothTreatments.${index}.dgGroupName`, undefined);
          form.setValue(`toothTreatments.${index}.dgValue`, undefined);
          form.setValue(`toothTreatments.${index}.therapies`, []);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Watch for isGlobal changes and reset tooth-related fields
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name && name.startsWith('toothTreatments') && name.includes('isGlobal')) {
        const index = parseInt(name.split('.')[1]);
        const isGlobal = value.toothTreatments?.[index]?.isGlobal;

        if (isGlobal) {
          form.setValue(`toothTreatments.${index}.toothNumber`, 0);
          form.setValue(`toothTreatments.${index}.toothAreas`, []);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const addToothTreatment = () => {
    append({
      toothNumber: 0,
      entryType: "Status",
      toothAreas: [],
      toothType: "permanent",
      dgGroupName: undefined,
      therapies: [],
      dgValue: undefined,
      notes: undefined,
      price: "",
      isGlobal: false,
    });
  };

  // Calculate total price from all treatments
  const calculateTotalPrice = () => {
    return fields.reduce((total, _, index) => {
      const treatmentPrice = form.watch(`toothTreatments.${index}.price`);
      return total + (treatmentPrice ? parseFloat(treatmentPrice) : 0);
    }, 0);
  };

  const totalPrice = calculateTotalPrice();

  const removeToothTreatment = (index: number) => {
    remove(index);
  };

  const { mutate: createToothRecords } = useCreateToothRecordsBulk();
  const { mutate: updateAppointment } = useUpdateAppointment();

  const handleCancellation = (reason: CancellationReason, notes?: string) => {
    if (!appointment?.id) return;

    setIsCancelling(true);
    updateAppointment(
      {
        data: {
          status: "canceled",
          cancellationReason: reason,
          cancellationNotes: notes,
        },
        appointmentId: appointment.id,
      },
      {
        onSuccess: () => {
          setIsCancelling(false);
          toast.success(t("messages.appointmentCanceledSuccess"));
          onClose();
        },
        onError: () => {
          setIsCancelling(false);
          toast.error(t("messages.appointmentCanceledError"));
        },
      }
    );
  };

  const onSubmit = async (data: TreatmentFormData) => {
    if (!appointment?.id) return;

    // Check if form has validation errors
    if (Object.keys(form.formState.errors).length > 0) {
      toast.error(t("messages.fixFormErrors"));
      return;
    }

    // Process treatments to set price as undefined when not entered
    // and exclude toothNumber and toothAreas for global procedures
    // For whole tooth treatments, exclude toothAreas but keep toothNumber
    const processedTreatments = data.toothTreatments.map(treatment => {
      const baseTreatment: any = {
        ...treatment,
        price: treatment.price && treatment.price.trim() !== '' ? treatment.price : undefined
      };

      // For global procedures, exclude toothNumber and toothAreas
      if (treatment.isGlobal) {
        delete baseTreatment.toothNumber;
        delete baseTreatment.toothAreas;
      }

      // For whole tooth treatments, set toothAreas to empty array but keep toothNumber
      if (treatment.isWholeTooth) {
        baseTreatment.toothAreas = [];
      }

      return baseTreatment;
    });

    createToothRecords(
      {
        data: processedTreatments,
        patientId: appointment.patientMedicalCard.id,
        appointmentId: appointment.id,
      },
      {
        onSuccess: () => {
          updateAppointment({
            data: {
              status: "completed",
            },
            appointmentId: appointment.id,
          });
          form.reset();
          setIsEndingAppointment(false);
          onClose();
        },
        onError: () => {
          toast.error(t("messages.errorCreatingTreatment"));
        },
      }
    );
  };

  const handleCancel = () => {
    form.reset();
    setIsEndingAppointment(false);
  };

  const onAppointmentFormSubmit = async (data: AppointmentFormData) => {
    // Check if there are actual changes
    if (!hasFormChanges()) {
      toast.info(t("messages.noChangesToSave"));
      setIsEditingAppointment(false);
      return;
    }

    const [hours, minutes] = data.time.split(":").map(Number);
    const startDay = startOfDay(data.startTime);

    const startTime = addHours(addMinutes(new Date(startDay), minutes), hours);
    const endTime = addMinutes(new Date(startTime), data.duration);

    if (appointment?.id) {
      updateAppointment(
        {
          data: {
            chair: data.chair,
            startTime: startTime,
            status: data.status,
            endTime: endTime,
            notes: data.notes,
            cancellationReason: data.status === "canceled" ? data.cancellationReason : null,
            cancellationNotes: data.status === "canceled" ? data.cancellationNotes : null,
          },
          appointmentId: appointment.id,
        },
        {
          onSuccess: () => {
            // Update original form data after successful update
            setOriginalFormData(data);
            setIsEditingAppointment(false);
            toast.success(t("messages.appointmentUpdatedSuccess"));
            onClose();
          },
          onError: () => {
            toast.error(t("messages.appointmentUpdatedError"));
          },
        }
      );
    }
  };

  const handleEditToggle = () => {
    if (isEditingAppointment) {
      // If we're canceling edit mode, reset to original values
      if (originalFormData) {
        appointmentForm.reset(originalFormData);
      }
      setIsEditingAppointment(false);
    } else {
      setIsEditingAppointment(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md md:max-w-5xl max-h-[90vh] overflow-y-auto">
        <Form {...appointmentForm}>
          <form
            id="appointmentForm"
            onSubmit={appointmentForm.handleSubmit(onAppointmentFormSubmit)}
          >
            <DialogHeader>
              <div className="flex flex-row justify-between mt-6">
                <DialogTitle className="text-2xl font-semibold">
                  {t("appointments.appointmentSettings")}
                </DialogTitle>
                <div className="space-x-4 flex flex-row items-center">
                  {isEditingAppointment ? (
                    <div className="space-x-2 flex items-center">
                      <Button
                        className={cn(
                          "transition-all duration-200 min-w-[140px]",
                          hasFormChanges()
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gray-400 cursor-not-allowed"
                        )}
                        type="submit"
                        form="appointmentForm"
                        disabled={!hasFormChanges()}
                      >
                        {hasFormChanges() ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            {t("common.saveChanges")}
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            {t("messages.noChanges")}
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleEditToggle}
                        className="min-w-[80px]"
                      >
                        {t("common.cancel")}
                      </Button>
                    </div>
                  ) : (
                    appointment?.status === "completed" ? (
                      <Button
                        type="button"
                        onClick={() => navigate(`/patients/${appointment?.patientMedicalCard.id}/therapies-and-appointments?openTherapy=true&appointmentId=${appointment.id}`)}
                      >
                        {t("appointments.openTreatment")}
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          onClick={handleEditToggle}
                          disabled={isEndingAppointment}
                          className="min-w-[80px]"
                        >
                          <Edit className="h-4 w-4 mr-2" /> {t("common.edit")}
                        </Button>
                        {appointment && !["canceled", "completed"].includes(appointment.status) && (
                          <Button
                            variant="outline"
                            onClick={() => setIsCancellationModalOpen(true)}
                            disabled={isEndingAppointment}
                            className="min-w-[100px] border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-2" /> {t("appointments.cancelAppointment")}
                          </Button>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    {t("appointments.appointmentInfo")}
                    {isEditingAppointment && hasFormChanges() && (
                      <Badge variant="outline" className="ml-2 text-orange-600 border-orange-600">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {t("messages.unsavedChanges")}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {appointment && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{t("appointments.patient")}:</span>
                          <span>
                            {appointment?.patientMedicalCard.firstName}{" "}
                            {appointment?.patientMedicalCard.lastName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{t("appointmentDetail.phone")}:</span>
                          <span>{appointment?.patientMedicalCard.phoneNumbers[0].phonenumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Stethoscope className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{t("appointments.doctor")}:</span>
                          <span>
                            Dr {appointment?.dentist.firstName}{" "}
                            {appointment?.dentist.lastName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{t("appointments.chair")}:</span>
                          {isEditingAppointment ? (
                            <FormField
                              control={appointmentForm.control}
                              name="chair"
                              render={({ field }) => (
                                <FormItem>
                                  <Select
                                    onValueChange={field.onChange}
                                    value={field.value.toString()}
                                    disabled={!clinic?.chairNumber}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder={t("appointments.selectChair")} />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {Array.from({ length: clinic?.chairNumber ?? 0 }, (_, index) => {
                                        const value = (index + 1).toString();
                                        return (
                                          <SelectItem key={value} value={value}>
                                            {t("appointments.chair")} {value}
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          ) : (
                            <span>{appointment?.chair}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-orange-600" />
                          <span className="font-medium">{t("appointments.time")}:</span>
                          {isEditingAppointment ? (
                            <FormField
                              control={appointmentForm.control}
                              name="time"
                              render={({ field }) => (
                                <FormItem>
                                  <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder={t("appointments.selectTime")} />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {generateTimes().map((t) => (
                                        <SelectItem key={t} value={t}>
                                          {t}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          ) : (
                            <span>
                              {formatDateTime(parseISO(appointment?.startTime))}{" "}
                              - {formatDateTime(parseISO(appointment?.endTime))}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-orange-600" />
                          <span className="font-medium">{t("appointments.duration")}:</span>
                          {isEditingAppointment ? (
                            <FormField
                              control={appointmentForm.control}
                              name="duration"
                              render={({ field }) => (
                                <FormItem>
                                  <Select
                                    onValueChange={field.onChange}
                                    value={field.value.toString() ?? ""}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder={t("appointments.selectDuration")} />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="15">
                                        15 {t("appointments.minutes")}
                                      </SelectItem>
                                      <SelectItem value="30">
                                        30 {t("appointments.minutes")}
                                      </SelectItem>
                                      <SelectItem value="45">
                                        45 {t("appointments.minutes")}
                                      </SelectItem>
                                      <SelectItem value="60">
                                        60 {t("appointments.minutes")}
                                      </SelectItem>
                                      <SelectItem value="90">
                                        90 {t("appointments.minutes")}
                                      </SelectItem>
                                      <SelectItem value="120">
                                        120 {t("appointments.minutes")}
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          ) : (
                            <span>
                              {appointmentForm.getValues("duration")} {t("appointments.minutes")}
                            </span>
                          )}
                        </div>
                        <div className="space-y-4 col-span-2">
                          <div className="flex items-center gap-2">
                            <Info className="w-4 h-4 text-cyan-700" />
                            <span className="font-medium">{t("appointments.status")}:</span>
                            {isEditingAppointment ? (
                              <FormField
                                control={appointmentForm.control}
                                name="status"
                                render={({ field }) => (
                                  <FormItem>
                                    <Select
                                      onValueChange={field.onChange}
                                      value={field.value}
                                    >
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder={t("appointments.selectStatus")} />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="scheduled">
                                          <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            {t("appointments.scheduled")}
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="in_progress">
                                          <div className="flex items-center gap-2">
                                            <PlayCircle className="h-4 w-4" />
                                            {t("appointments.inProgress")}
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="completed">
                                          <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4" />
                                            {t("appointments.completed")}
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="canceled">
                                          <div className="flex items-center gap-2">
                                            <XCircle className="h-4 w-4" />
                                            {t("appointments.canceled")}
                                          </div>
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            ) : (
                              <Badge
                                className={`${getStatusInfo(appointment.status, t).color
                                  } flex items-center gap-1 border`}
                              >
                                {getStatusInfo(appointment.status, t).icon}
                                {getStatusInfo(appointment.status, t).text}
                              </Badge>
                            )}
                          </div>

                          {/* Cancellation Reason Display (Read-only) */}
                          {!isEditingAppointment && appointment.status === "canceled" && (
                            <div className="flex flex-col gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                              <div className="flex items-center gap-2">
                                <XCircle className="w-5 h-5 text-red-700" />
                                <span className="font-semibold text-red-800">{t("appointments.cancellationReason")}</span>
                              </div>
                              <div className="space-y-3">
                                <div>
                                  <div className="text-sm font-medium text-red-800 mb-1">{t("appointments.cancellationReason")}:</div>
                                  <Badge className="bg-red-100 text-red-800 border-red-300">
                                    {appointment.cancellationReason ? getCancellationReasonLabel(appointment.cancellationReason, t) : t("appointments.notSpecified")}
                                  </Badge>
                                </div>

                                {appointment.cancellationNotes && (
                                  <div>
                                    <div className="text-sm font-medium text-red-800 mb-1">{t("appointments.notes")}:</div>
                                    <div className="p-3 bg-white border border-red-300 rounded-md">
                                      <p className="text-sm text-red-800">
                                        {appointment.cancellationNotes}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-row items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-purple-600" />
                          <span className="font-medium">{t("appointments.date")}:</span>
                          {isEditingAppointment ? (
                            <FormField
                              control={appointmentForm.control}
                              name="startTime"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={"outline"}
                                          className={cn(
                                            "text-left font-normal",
                                            !field.value &&
                                            "text-muted-foreground"
                                          )}
                                        >
                                          {field.value ? (
                                            format(field.value, "PPP", {
                                              locale: getDateFnsLocale(i18n.language),
                                            })
                                          ) : (
                                            <span>{t("appointments.selectDate")}</span>
                                          )}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-auto p-0"
                                      align="start"
                                    >
                                      <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                          date < new Date() ||
                                          date < new Date("1900-01-01")
                                        }
                                        autoFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          ) : (
                            <span>
                              {format(appointment.startTime, "PPP", {
                                locale: getDateFnsLocale(i18n.language),
                              })}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-row items-center gap-2">
                          <HeartPulse className="w-4 h-4 text-red-500" />
                          <span className="font-medium">{t("appointments.dentalService")}:</span>
                          <span>{translateTreatment(appointment.dentalService, t)}</span>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="font-medium">{t("appointmentDetail.price")}:</span>
                          <span className="text-green-600 font-medium">
                            {appointment.therapyRecords && appointment.therapyRecords.length > 0
                              ? formatCurrency(
                                  appointment.therapyRecords.reduce((total, therapy) =>
                                    total + (therapy.price ? therapy.price : 0), 0
                                  ),
                                  clinic?.currency || "RSD"
                                )
                              : formatCurrency(0, clinic?.currency || "RSD")
                            }
                          </span>
                        </div>
                        <div className="flex flex-col gap-2 col-span-2 pb-4">
                          <div className="flex items-center gap-2">
                            <Pencil className="w-4 h-4" />
                            <Label>{t("appointments.notes")}</Label>
                          </div>
                          {isEditingAppointment ? (
                            <FormField
                              control={appointmentForm.control}
                              name="notes"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Textarea {...field} className="min-h-[100px]" placeholder={t("appointments.notesPlaceholder")} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          ) : (
                            <span>{appointment.notes ?? t("common.noNotes")}</span>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </DialogHeader>
          </form>
        </Form>
        {!isEndingAppointment && appointment && appointment.status !== "completed" && appointment.status !== "canceled" && (
          <Button
            onClick={() => navigate(`/appointments/${appointment.id}/complete`)}
            disabled={isEditingAppointment}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="h-4 w-4 mr-2" /> {t("appointments.completeAppointment")}
          </Button>
        )}
        <div className="space-y-6">
          {/* Appointment Info */}
          {/* Treatment Form */}
          {isEndingAppointment && (
            <Card>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                    id="treatmentForm"
                  >
                    {/* Per-Tooth Treatments */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                          <Label className="text-base font-medium">
                            {t("appointments.treatmentsByTeeth")}
                          </Label>
                          {/* Show validation error for toothTreatments array */}
                          {form.formState.errors.toothTreatments?.message && (
                            <span className="text-sm text-red-600 mt-1">
                              {form.formState.errors.toothTreatments.message}
                            </span>
                          )}
                        </div>
                        <Button
                          type="button"
                          onClick={addToothTreatment}
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          {t("appointments.addTreatment")}
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {fields.map((field, index) => (
                          <Card
                            key={field.id}
                            className="border-2 border-dashed border-gray-200"
                          >
                            <CardContent className="p-4 space-y-4">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-medium">
                                  {t("appointments.treatment")} #{index + 1}
                                </h4>
                                <Button
                                  type="button"
                                  onClick={() => removeToothTreatment(index)}
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              {/* Entry Type */}
                              <FormField
                                control={form.control}
                                name={`toothTreatments.${index}.entryType`}
                                render={({ field }) => (
                                  <FormItem className="space-y-3">
                                    <FormLabel>{t("appointments.entryType")}</FormLabel>
                                    <FormControl>
                                      <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex flex-wrap gap-4"
                                      >
                                        <div className="flex items-center space-x-2">
                                          <RadioGroupItem
                                            value="Status"
                                            id={`status-${index}`}
                                          />
                                          <Label
                                            htmlFor={`status-${index}`}
                                            className="text-sm"
                                          >
                                            {t("appointments.status")}
                                          </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <RadioGroupItem
                                            value="Terapija"
                                            id={`terapija-${index}`}
                                          />
                                          <Label
                                            htmlFor={`terapija-${index}`}
                                            className="text-sm"
                                          >
                                            {t("appointments.therapy")}
                                          </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <RadioGroupItem
                                            value="Kontrola"
                                            id={`kontrola-${index}`}
                                          />
                                          <Label
                                            htmlFor={`kontrola-${index}`}
                                            className="text-sm"
                                          >
                                            {t("appointments.control")}
                                          </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <RadioGroupItem
                                            value="Dg/Th"
                                            id={`dg-th-${index}`}
                                          />
                                          <Label
                                            htmlFor={`dg-th-${index}`}
                                            className="text-sm"
                                          >
                                            Dg/Th
                                          </Label>
                                        </div>
                                      </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {/* Global Therapy Checkbox */}
                              <FormField
                                control={form.control}
                                name={`toothTreatments.${index}.isGlobal`}
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={(checked) => {
                                          field.onChange(checked);
                                          // Reset tooth-related fields when switching to global therapy
                                          if (checked) {
                                            form.setValue(`toothTreatments.${index}.toothNumber`, 0);
                                            form.setValue(`toothTreatments.${index}.toothAreas`, []);
                                          }
                                        }}
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

                              {/* Tooth Selection - Only show when not global */}
                              {!form.watch(`toothTreatments.${index}.isGlobal`) && (
                                <FormField
                                  control={form.control}
                                  name={`toothTreatments.${index}.toothNumber`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>{t("appointments.selectTooth")}</FormLabel>
                                      <Select
                                        onValueChange={(value) =>
                                          field.onChange(Number.parseInt(value))
                                        }
                                        value={field.value?.toString() || ""}
                                      >
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder={t("appointments.selectTooth")} />
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
                              )}

                              {/* Tooth Type - Only show when not global */}
                              {!form.watch(`toothTreatments.${index}.isGlobal`) && (
                                <FormField
                                  control={form.control}
                                  name={`toothTreatments.${index}.toothType`}
                                  render={({ field }) => (
                                    <FormItem className="space-y-3">
                                      <FormLabel>{t("appointments.toothType")}</FormLabel>
                                      <FormControl>
                                        <RadioGroup
                                          onValueChange={field.onChange}
                                          value={field.value}
                                          className="flex flex-wrap gap-4"
                                        >
                                          <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                              value="permanent"
                                              id={`permanent-${index}`}
                                            />
                                            <Label
                                              htmlFor={`permanent-${index}`}
                                              className="text-sm"
                                            >
                                              {t("appointments.permanentTooth")}
                                            </Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                              value="deciduous"
                                              id={`deciduous-${index}`}
                                            />
                                            <Label
                                              htmlFor={`deciduous-${index}`}
                                              className="text-sm"
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
                              )}

                              {/* Tooth Areas - Only show when not global */}
                              {!form.watch(`toothTreatments.${index}.isGlobal`) && (
                                <FormField
                                  control={form.control}
                                  name={`toothTreatments.${index}.toothAreas`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>{t("appointments.toothParts")}</FormLabel>
                                      <div className="grid grid-cols-2 gap-2">
                                        {toothParts.map((part, partIndex) => {
                                          const translatedPart = translatedToothParts[partIndex];
                                          return (
                                            <div key={partIndex} className="flex items-center space-x-2">
                                              <Checkbox
                                                id={`tooth-area-${index}-${partIndex}`}
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
                                                htmlFor={`tooth-area-${index}-${partIndex}`}
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
                              )}

                              {/* Show DG Group and TH Therapies only when entry type is "Dg/Th" */}
                              {form.watch(`toothTreatments.${index}.entryType`) === "Dg/Th" && (
                                <>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* DG Group */}
                                    <FormField
                                      control={form.control}
                                      name={`toothTreatments.${index}.dgGroupName`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>{t("appointments.dgGroup")}</FormLabel>
                                          <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                          >
                                            <FormControl>
                                              <SelectTrigger>
                                                <SelectValue placeholder={t("appointments.selectDgGroup")} />
                                              </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                              {dgGroups.map((dgGroup, dgIndex) => {
                                                const translatedGroup = translatedDgGroups[dgIndex];
                                                return (
                                                  <SelectItem
                                                    key={dgIndex}
                                                    value={dgGroup}
                                                  >
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

                                    {/* DG Value - depends on selected DG Group */}
                                    <FormField
                                      control={form.control}
                                      name={`toothTreatments.${index}.dgValue`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>{t("appointments.dgValue")}</FormLabel>
                                          <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            disabled={!form.watch(`toothTreatments.${index}.dgGroupName`)}
                                          >
                                            <FormControl>
                                              <SelectTrigger>
                                                <SelectValue placeholder={t("appointments.selectDgValue")} />
                                              </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                              {form.watch(`toothTreatments.${index}.dgGroupName`) &&
                                                dgOptions[form.watch(`toothTreatments.${index}.dgGroupName`) as keyof typeof dgOptions]?.map((dgValue, dgValueIndex) => {
                                                  const translatedValue = translatedDgOptions[form.watch(`toothTreatments.${index}.dgGroupName`) as keyof typeof dgOptions]?.[dgValueIndex] || dgValue;
                                                  return (
                                                    <SelectItem
                                                      key={dgValueIndex}
                                                      value={dgValue}
                                                    >
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
                                    name={`toothTreatments.${index}.therapies`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <div className="flex items-center justify-between mb-4">
                                          <FormLabel>{t("appointments.thTherapies")}</FormLabel>
                                          <Button
                                            type="button"
                                            size="sm"
                                            onClick={() => {
                                              field.onChange([...(field.value || []), { thGroupName: "", thValue: "" }]);
                                            }}
                                            className="flex items-center gap-2"
                                          >
                                            <Plus className="h-4 w-4" />
                                            {t("appointments.addTherapy")}
                                          </Button>
                                        </div>
                                        
                                        <div className="space-y-4">
                                          {field.value?.map((therapy, therapyIndex) => (
                                            <Card key={therapyIndex} className="p-4 border-2 border-dashed border-gray-200">
                                              <div className="flex items-center justify-between mb-3">
                                                <h5 className="font-medium">{t("appointments.therapy")} #{therapyIndex + 1}</h5>
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
                                                  <Label className="text-sm font-medium">{t("appointments.thGroup")}</Label>
                                                  <Select
                                                    value={therapy.thGroupName}
                                                    onValueChange={(value) => {
                                                      const updatedTherapies = [...(field.value || [])];
                                                      updatedTherapies[therapyIndex] = { ...therapy, thGroupName: value, thValue: "" };
                                                      field.onChange(updatedTherapies);
                                                    }}
                                                  >
                                                    <SelectTrigger>
                                                      <SelectValue placeholder={t("appointments.selectThGroup")} />
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
                                                  <Label className="text-sm font-medium">{t("appointments.thValue")}</Label>
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
                                                      <SelectValue placeholder={t("appointments.selectThValue")} />
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
                                            <Label className="text-sm font-medium mb-2 block">{t("appointments.selectedTherapies")}:</Label>
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
                                name={`toothTreatments.${index}.price`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>{t("appointments.treatmentPrice")}</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        placeholder={`${t("appointments.enterPrice")} ${clinic?.currency || "RSD"}`}
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
                                name={`toothTreatments.${index}.notes`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>{t("appointments.addNote")}</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder={t("appointments.notesPlaceholder")}
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
                        ))}

                        {fields.length === 0 && (
                          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <p className="font-medium">
                              {t("appointments.noTreatmentsAdded")}
                            </p>
                            <p className="text-sm">
                              {t("appointments.clickAddTreatment")}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Summary Section */}
                    {fields.length > 0 && (
                      <div className="border-t pt-6">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-blue-900">
                                {t("appointments.totalTreatments")}: <span className="font-bold">{fields.length}</span>
                              </p>
                              <p className="text-sm text-blue-700">
                                {t("appointments.totalPrice")}: <span className="font-bold text-lg">{formatCurrency(totalPrice, clinic?.currency || "RSD")}</span>
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-blue-600" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={form.formState.isSubmitting}
                      >
                        {t("appointments.completeAndSaveTreatment")}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                      >
                        {t("common.cancel")}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>

      {/* Cancellation Modal */}
      <CancellationModal
        isOpen={isCancellationModalOpen}
        onClose={() => setIsCancellationModalOpen(false)}
        onConfirm={handleCancellation}
        appointmentData={appointment ? {
          patientName: `${appointment.patientMedicalCard.firstName} ${appointment.patientMedicalCard.lastName}`,
          date: format(new Date(appointment.startTime), "PPP", { locale: getDateFnsLocale(i18n.language) }),
          time: `${format(new Date(appointment.startTime), "HH:mm")} - ${format(new Date(appointment.endTime), "HH:mm")}`,
          service: translateTreatment(appointment.dentalService, t),
        } : undefined}
        isLoading={isCancelling}
      />
    </Dialog>
  );
}