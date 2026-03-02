import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useCreateAppointment } from "@/hooks/appointments/useCreateAppointment";
import { useCreatePatient } from "@/hooks/patients/useCreatePatient";
import { Loading } from "@/components/ui/loading";
import {
  CalendarIcon,
  Check,
  Clock,
  MapPin,
  Pencil,
  Phone,
  Stethoscope,
  Timer,
  User,
  UserPlus,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  Info,
} from "lucide-react";
import { addHours, addMinutes } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useGetDentists } from "@/hooks/dentists/useGetDentists";
import { useGetPatientsInfinite } from "@/hooks/patients/useGetPatients";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, generateTimes, useDebounce, translateTreatment } from "@/lib/utils";
import { format } from "date-fns";
import { useGetClinicById } from "@/hooks/clinics/useGetClinicById";
import { useDefaultChair } from "@/hooks/useDefaultChair";
import { useTranslation } from "react-i18next";
import { getDateFnsLocale } from "@/lib/utils";
import { Textarea } from "../components/ui/textarea";
import { Input } from "@/components/ui/input";
import { PhoneNumbersInput } from "../components/ui/PhoneNumbersInput";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetPatientByIdParam } from "@/hooks/patients/useGetPatientByIdParam";

// Schema builders that accept translation function
const getAppointmentSchema = (t: (key: string) => string) => z.object({
  treatmentType: z.string({ required_error: t("forms.requiredField") }).min(1, t("forms.selectTreatmentType")),
  dentalService: z.string({ required_error: t("forms.requiredField") }).min(1, t("forms.selectTreatment")),
  chair: z.coerce
    .number({ required_error: t("forms.requiredField") })
    .min(1, t("forms.selectChair")),
  startTime: z.date({ required_error: t("forms.selectDate") }),
  time: z.string({ required_error: t("forms.requiredField") }).min(1, t("forms.selectTime")),
  duration: z
    .string({ required_error: t("forms.requiredField") })
    .min(1, t("forms.enterDuration")),
  notes: z.string().optional(),
  patientId: z
    .string({ required_error: t("forms.requiredField") })
    .min(1, t("forms.selectPatient")),
  dentistId: z
    .string({ required_error: t("forms.requiredField") })
    .min(1, t("forms.selectDoctor")),
});

// Schema for quick patient addition
const getQuickPatientSchema = (t: (key: string) => string) => z.object({
  firstName: z.string({ required_error: t("forms.requiredField") }).min(1, t("forms.firstNameRequired")),
  lastName: z.string({ required_error: t("forms.requiredField") }).min(1, t("forms.lastNameRequired")),
  phoneNumbers: z.array(z.object({
    phonenumber: z.string().min(1, t("forms.phoneRequired")),
  })).min(1, t("forms.addAtLeastOnePhone")),
});

type FormFields = z.infer<ReturnType<typeof getAppointmentSchema>>;
type QuickPatientFields = z.infer<ReturnType<typeof getQuickPatientSchema>>;

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  fields: (keyof FormFields)[];
}

const getWizardSteps = (t: (key: string) => string): WizardStep[] => [
  {
    id: "patient",
    title: t("appointments.patient"),
    description: t("appointments.patientDescription"),
    icon: <User className="h-5 w-5" />,
    fields: ["patientId"],
  },
  {
    id: "treatment",
    title: t("appointments.treatment"),
    description: t("appointments.treatmentDescription"),
    icon: <Stethoscope className="h-5 w-5" />,
    fields: ["treatmentType", "dentalService", "dentistId", "startTime", "time", "duration", "chair"],
  },
  {
    id: "review",
    title: t("appointments.review"),
    description: t("appointments.reviewDescription"),
    icon: <Check className="h-5 w-5" />,
    fields: ["notes"],
  },
];

export const CreateAppointmentPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefilledPatientId = searchParams.get("patientId");
  const [isPatientPrefilled, setIsPatientPrefilled] = useState(false);
  const [currentStep, setCurrentStep] = useState(prefilledPatientId ? 1 : 0);
  const [showQuickPatientForm, setShowQuickPatientForm] = useState(false);
  const [showPatientInfo, setShowPatientInfo] = useState(false);
  const [patientSearch, setPatientSearch] = useState("");
  const debouncedSearch = useDebounce(patientSearch, 300);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { mutate: createAppointment, isPending } = useCreateAppointment();
  const { mutate: createPatient, isPending: isCreatingPatient } = useCreatePatient();
  const { data: dentists } = useGetDentists();
  const {
    data: patientsData,
    isLoading: patientsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetPatientsInfinite({
    search: debouncedSearch,
  });

  // Flatten all pages into a single array and sort by ID (newest first)
  const patients = patientsData?.pages.flatMap((page: any) => page.data) || [];
  const sortedPatients = [...patients].sort((a, b) => b.id - a.id);
  
  // State to track newly added patients
  const [newlyAddedPatients, setNewlyAddedPatients] = useState<any[]>([]);
  
  // State to track the selected patient separately to avoid pagination issues
  const [selectedPatientData, setSelectedPatientData] = useState<any>(null);
  
  // Combine existing patients with newly added ones, with new ones on top
  const allPatients = useMemo(() => {
    const combined = [...newlyAddedPatients, ...sortedPatients.filter(patient => 
      !newlyAddedPatients.some(newPatient => newPatient.id === patient.id)
    )];
    
    // If we have a selected patient that's not in the current list, add it
    if (selectedPatientData && !combined.some(patient => patient.id === selectedPatientData.id)) {
      combined.unshift(selectedPatientData);
    }
    
    return combined;
  }, [newlyAddedPatients, sortedPatients, selectedPatientData]);
  const { data: clinic } = useGetClinicById();
  const { data: prefilledPatientData } = useGetPatientByIdParam(prefilledPatientId);
  const { defaultChair } = useDefaultChair();

  // Get initial values from URL params
  const selectedDate = searchParams.get("date") ? new Date(searchParams.get("date")!) : undefined;
  const selectedTime = searchParams.get("time") || undefined;
  const selectedChair = searchParams.get("chair") ? parseInt(searchParams.get("chair")!) : undefined;

  const appointmentSchema = getAppointmentSchema(t);
  const quickPatientSchema = getQuickPatientSchema(t);
  const wizardSteps = getWizardSteps(t);

  const form = useForm<FormFields>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      startTime: selectedDate ?? (() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
      })(),
      time: selectedTime || "",
      chair: selectedChair || parseInt(defaultChair) || 1,
      notes: "",
      treatmentType: "",
      patientId: "",
      dentistId: "",
      dentalService: "",
    },
  });

  const quickPatientForm = useForm<QuickPatientFields>({
    resolver: zodResolver(quickPatientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumbers: [{ phonenumber: "" }],
    },
  });

  // Get the selected treatment type from the form
  const selectedTreatmentType = form.watch("treatmentType");
  const [previousTreatmentType, setPreviousTreatmentType] = useState<string>("");

  // Clear dental service only when treatment type actually changes (not on navigation)
  useEffect(() => {
    if (selectedTreatmentType && selectedTreatmentType !== previousTreatmentType) {
      form.setValue("dentalService", "");
      setPreviousTreatmentType(selectedTreatmentType);
    }
  }, [selectedTreatmentType, previousTreatmentType, form]);

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    const [hours, minutes] = data.time.split(":").map(Number);
    const startTime = addHours(
      addMinutes(new Date(data.startTime), minutes),
      hours
    );
    const endTime = addMinutes(new Date(startTime), parseInt(data.duration));

    createAppointment(
      {
        chair: data.chair,
        dentalService: data.dentalService,
        dentistId: parseInt(data.dentistId),
        endTime: endTime,
        patientId: parseInt(data.patientId),
        startTime: startTime,
        duration: parseInt(data.duration),
        notes: data.notes,
        treatmentType: data.treatmentType,
      },
      {
        onSuccess: () => {
          navigate("/appointments");
        },
        onError: (error) => {
          const anyErr: any = error as any;
          const backendMessage =
            anyErr?.response?.data?.message ||
            anyErr?.message ||
            t("errors.generic");
          form.setError("root", {
            type: "server",
            message: Array.isArray(backendMessage)
              ? backendMessage.join("\n")
              : backendMessage,
          });
        },
      }
    );
  };

  const onQuickPatientSubmit: SubmitHandler<QuickPatientFields> = (data) => {
    const selectedDentistId = form.getValues("dentistId") || dentists?.data[0]?.id?.toString() || "1";

    createPatient(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumbers: data.phoneNumbers,
        dentistId: selectedDentistId,
        birthDate: new Date("2000-01-01"),
        country: "Srbija",
        city: "Beograd"
      },
      {
        onSuccess: (newPatient) => {
          // Add the new patient to the top of the list immediately
          setNewlyAddedPatients(prev => [newPatient, ...prev]);
          
          // Select the newly created patient
          form.setValue("patientId", newPatient.id.toString());
          form.trigger("patientId");
          setSelectedPatientData(newPatient); // Store selected patient data
          
          // Clear search to show all patients including the new one
          setPatientSearch("");
          
          // Hide the quick form
          setShowQuickPatientForm(false);
          
          // Reset the quick form
          quickPatientForm.reset({
            firstName: "",
            lastName: "",
            phoneNumbers: [{ phonenumber: "" }],
          });
          
          // Scroll to top of the patient list to show the selected patient
          if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = 0;
          }
        },
      }
    );
  };

  // Ensure selected chair does not exceed clinic chair count
  useEffect(() => {
    if (clinic?.chairNumber) {
      const currentChair = form.getValues("chair");
      if (currentChair > clinic.chairNumber) {
        form.setValue("chair", clinic.chairNumber);
      }
    }
  }, [clinic?.chairNumber, form]);

  // Cleanup scroll timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Handle prefilled patient from URL
  useEffect(() => {
    if (prefilledPatientId) {
      form.setValue("patientId", prefilledPatientId);
      setIsPatientPrefilled(true);
    }
  }, [prefilledPatientId, form]);

  // Set selected patient data when prefilled patient data is loaded
  useEffect(() => {
    if (prefilledPatientData) {
      setSelectedPatientData(prefilledPatientData);
    }
  }, [prefilledPatientData]);

  const nextStep = async () => {
    const currentStepFields = wizardSteps[currentStep].fields;
    const isValid = await form.trigger(currentStepFields);
    
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, wizardSteps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // Save form data when navigating between steps
  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const isStepValid = (stepIndex: number) => {
    const stepFields = wizardSteps[stepIndex].fields;
    return stepFields.every(field => {
      const value = form.getValues(field);
      const error = form.formState.errors[field];
      return value && !error;
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Patient step
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="relative">
                <Input
                  placeholder={t("appointments.searchPatientsPlaceholder")}
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  className="w-full pl-10"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              {/* Selected patient indicator */}
              {form.watch("patientId") && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-800">
                      {t("appointments.selectedPatient")}: {(() => {
                        const selectedPatient = allPatients.find(p => p.id.toString() === form.watch("patientId"));
                        return selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName} (ID: ${selectedPatient.id})` : t("appointments.unknown");
                      })()}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        form.setValue("patientId", "");
                        form.trigger("patientId");
                        setSelectedPatientData(null); // Clear selected patient data
                      }}
                      className="ml-auto h-6 px-2 text-green-600 hover:bg-green-100"
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="border rounded-lg">
              {patientsLoading ? (
                <div className="p-8 text-center">
                  <Loading size="sm" showLogo={false} />
                </div>
              ) : allPatients.length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <p className="text-gray-500">{t("appointments.noPatientsFound")}</p>
                </div>
              ) : (
                <>
                  {/* Patient list header */}
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{t("appointments.patientList")}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {allPatients.length} {allPatients.length !== 1 ? t("appointments.patients") : t("appointments.patient")}
                        </span>
                        {debouncedSearch && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {t("appointments.filtered")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                <ScrollArea 
                  className="h-64"
                  ref={scrollAreaRef}
                >
                  <div className="p-2 space-y-2">
                    {allPatients.map((patient) => {
                      const isSelected = form.watch("patientId") === patient.id.toString();
                      return (
                        <div
                          key={patient.id}
                          onClick={() => {
                            form.setValue("patientId", patient.id.toString());
                            form.trigger("patientId"); // Trigger validation
                            setSelectedPatientData(patient); // Store selected patient data
                            setPatientSearch("");
                          }}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-200 border-2",
                            isSelected
                              ? "bg-blue-100 border-blue-500 shadow-md ring-2 ring-blue-200"
                              : "hover:bg-blue-50 border-transparent hover:border-blue-200"
                          )}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={cn(
                              "w-3 h-3 rounded-full border-2 transition-colors",
                              isSelected
                                ? "bg-blue-500 border-blue-500"
                                : "border-gray-300"
                            )} />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <div className={cn(
                                  "font-medium transition-colors",
                                  isSelected ? "text-blue-900" : "text-gray-900"
                                )}>
                                  {patient.firstName} {patient.lastName}
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className={cn(
                                    "px-2 py-1 text-xs rounded-full font-medium",
                                    isSelected 
                                      ? "bg-blue-200 text-blue-800" 
                                      : "bg-gray-100 text-gray-600"
                                  )}>
                                    #{patient.id}
                                  </div>
                                  {newlyAddedPatients.some(newPatient => newPatient.id === patient.id) && (
                                    <div className="px-2 py-1 text-xs rounded-full font-medium bg-green-100 text-green-800">
                                      {t("appointments.newPatient")}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className={cn(
                                "text-sm transition-colors mt-1 flex items-center gap-1",
                                isSelected ? "text-blue-700" : "text-gray-500"
                              )}>
                                <Phone className="h-3 w-3" />
                                {patient.phoneNumbers?.[0]?.phonenumber || 'N/A'}
                              </div>
                            </div>
                          </div>
                          <Check
                            className={cn(
                              "h-5 w-5 transition-all duration-200",
                              isSelected
                                ? "opacity-100 text-blue-600 scale-110"
                                : "opacity-0 scale-90"
                            )}
                          />
                        </div>
                      );
                    })}
                    
                    {/* Load more button */}
                    {hasNextPage && (
                      <div className="p-4 text-center">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fetchNextPage()}
                          disabled={isFetchingNextPage}
                          className="w-full"
                        >
                          {isFetchingNextPage ? (
                            <>
                              <Loading size="sm" showLogo={false} />
                              <span className="ml-2">{t("appointments.loading")}</span>
                            </>
                          ) : (
                            t("appointments.loadMorePatients")
                          )}
                        </Button>
                      </div>
                    )}
                    
                    {/* Loading indicator for auto-scroll */}
                    {isFetchingNextPage && (
                      <div className="p-2 text-center">
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                          <Loading size="sm" showLogo={false} />
                          <span>{t("appointments.loadingNewPatients")}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                </>
              )}
            </div>

            {/* Add new patient section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <UserPlus className="h-5 w-5 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-blue-900">
                    {t("appointments.patientNoCard")}
                  </h4>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPatientInfo(!showPatientInfo)}
                  className="p-1 h-8 w-8 text-blue-600 hover:bg-blue-100 rounded-full"
                >
                  <Info className="h-4 w-4" />
                </Button>
              </div>
              
              {showPatientInfo && (
                <div className="mb-4 p-3 bg-blue-100 rounded-lg border border-blue-300">
                  <p className="text-sm text-blue-800">
                    {t("appointments.patientNoCardInfo")}
                  </p>
                </div>
              )}
              
              <Button
                type="button"
                variant="outline"
                className="w-full text-blue-600 border-blue-300 hover:bg-blue-100"
                onClick={() => setShowQuickPatientForm(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {t("appointments.addNewPatient")}
              </Button>
            </div>

            {/* Quick Patient Form */}
            {showQuickPatientForm && (
              <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-blue-900">{t("appointments.quickAddPatient")}</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowQuickPatientForm(false)}
                  >
                    ✕
                  </Button>
                </div>

                <Form {...quickPatientForm}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        control={quickPatientForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("common.firstName")}</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder={t("appointments.enterFirstName")} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={quickPatientForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("common.lastName")}</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder={t("appointments.enterLastName")} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={quickPatientForm.control}
                        name="phoneNumbers"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <PhoneNumbersInput
                                phoneNumbers={field.value || []}
                                onChange={field.onChange}
                                error={quickPatientForm.formState.errors.phoneNumbers?.message}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowQuickPatientForm(false)}
                      >
                        {t("common.cancel")}
                      </Button>
                      <Button 
                        type="button"
                        onClick={quickPatientForm.handleSubmit(onQuickPatientSubmit)}
                        disabled={isCreatingPatient}
                      >
                        {isCreatingPatient ? t("appointments.adding") : t("appointments.addPatient")}
                      </Button>
                    </div>
                  </div>
                </Form>
              </div>
            )}
          </div>
        );

      case 1: // Treatment and Timing step
        return (
          <div className="space-y-6">
            {/* Treatment Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                {t("appointments.treatmentSection")}
              </h3>
              
              <FormField
                control={form.control}
                name="treatmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-blue-600" />
                      {t("appointments.treatmentType")}
                    </FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.clearErrors("treatmentType");
                      }} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("appointments.selectTreatmentTypePlaceholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="stomatoloski">{t("treatmentTypes.dental")}</SelectItem>
                        <SelectItem value="ortodontski">{t("treatmentTypes.orthodontic")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dentalService"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-blue-600" />
                      {t("appointments.dentalService")}
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.clearErrors("dentalService");
                      }}
                      value={field.value}
                      disabled={!selectedTreatmentType}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              selectedTreatmentType
                                ? t("appointments.selectTreatmentPlaceholder")
                                : t("appointments.selectTreatmentTypeFirst")
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedTreatmentType === "stomatoloski" && (
                          <>
                            <SelectItem value="Pregled">{t("dentalServices.examination")}</SelectItem>
                            <SelectItem value="Vadjenje">{t("dentalServices.extraction")}</SelectItem>
                            <SelectItem value="Plomba">{t("dentalServices.filling")}</SelectItem>
                            <SelectItem value="Lečenje kanala">{t("dentalServices.rootCanal")}</SelectItem>
                            <SelectItem value="Čišćenje">{t("dentalServices.cleaning")}</SelectItem>
                            <SelectItem value="Protetika">{t("dentalServices.prosthetics")}</SelectItem>
                            <SelectItem value="Ostalo">{t("appointments.other")}</SelectItem>
                          </>
                        )}
                        {selectedTreatmentType === "ortodontski" && (
                          <>
                            <SelectItem value="Ortodontski pregled">{t("dentalServices.orthoExamination")}</SelectItem>
                            <SelectItem value="Postavljanje aparata">{t("dentalServices.applianceInstallation")}</SelectItem>
                            <SelectItem value="Kontrola">{t("appointments.control")}</SelectItem>
                            <SelectItem value="Promena žice">{t("dentalServices.wireChange")}</SelectItem>
                            <SelectItem value="Retencija">{t("dentalServices.retention")}</SelectItem>
                            <SelectItem value="Uzimanje otiska">{t("dentalServices.impression")}</SelectItem>
                            <SelectItem value="Ostalo">{t("appointments.other")}</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dentistId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-600" />
                      {t("appointments.doctor")}
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.clearErrors("dentistId");
                      }}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("appointments.selectDoctor")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dentists?.data.map((dentist) => (
                          <SelectItem
                            key={dentist.id}
                            value={dentist.id.toString()}
                          >
                            {dentist.firstName} {dentist.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Timing Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                {t("appointments.appointmentSection")}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-purple-600" />
                        {t("appointments.date")}
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: getDateFnsLocale(i18n.language) })
                              ) : (
                                <span>{t("appointments.selectDatePlaceholder")}</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date < new Date("1900-01-01")
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        {t("appointments.time")}
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.clearErrors("time");
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("appointments.selectTimePlaceholder")} />
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

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Timer className="h-4 w-4 text-red-600" />
                        {t("appointments.duration")}
                      </FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.clearErrors("duration");
                        }} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("appointments.selectDurationPlaceholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="15">15 {t("appointments.minutes")}</SelectItem>
                          <SelectItem value="30">30 {t("appointments.minutes")}</SelectItem>
                          <SelectItem value="45">45 {t("appointments.minutes")}</SelectItem>
                          <SelectItem value="60">60 {t("appointments.minutes")}</SelectItem>
                          <SelectItem value="90">90 {t("appointments.minutes")}</SelectItem>
                          <SelectItem value="120">120 {t("appointments.minutes")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="chair"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-600" />
                        {t("appointments.chair")}
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.clearErrors("chair");
                        }}
                        value={field.value?.toString()}
                        disabled={!clinic?.chairNumber}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("appointments.selectChairPlaceholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from(
                            { length: clinic?.chairNumber ?? 0 },
                            (_, index) => {
                              const value = (index + 1).toString();
                              return (
                                <SelectItem key={value} value={value}>
                                  {t("appointments.chairNumber")} {value}
                                </SelectItem>
                              );
                            }
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        );

      case 2: // Review step
        const formData = form.getValues();
        const selectedPatient = allPatients.find(p => p.id.toString() === formData.patientId);
        const selectedDentist = dentists?.data.find(d => d.id.toString() === formData.dentistId);
        
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-lg">{t("appointments.reviewAppointment")}</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("appointments.patient")}:</span>
                  <span className="font-medium">
                    {selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName} (ID: ${selectedPatient.id})` : t("appointments.notSelectedN")}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("appointments.doctor")}:</span>
                  <span className="font-medium">
                    {selectedDentist ? `${selectedDentist.firstName} ${selectedDentist.lastName}` : t("appointments.notSelectedN")}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("appointments.dentalService")}:</span>
                  <span className="font-medium">{formData.dentalService ? translateTreatment(formData.dentalService, t) : t("appointments.notSelectedN")}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("appointments.date")}:</span>
                  <span className="font-medium">
                    {formData.startTime ? format(formData.startTime, "PPP", { locale: getDateFnsLocale(i18n.language) }) : t("common.notSet")}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("appointments.time")}:</span>
                  <span className="font-medium">{formData.time || t("appointments.notSelectedN")}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("appointments.duration")}:</span>
                  <span className="font-medium">{formData.duration ? `${formData.duration} ${t("appointments.minutes")}` : t("appointments.notSelectedN")}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("appointments.chair")}:</span>
                  <span className="font-medium">{formData.chair ? `${t("appointments.chairNumber")} ${formData.chair}` : t("appointments.notSelectedF")}</span>
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Pencil className="h-4 w-4 text-yellow-600" />
                    {t("appointments.notes")}
                  </FormLabel>
                  <Textarea 
                    {...field} 
                    placeholder={t("appointments.addNotesPlaceholder")}
                    className="min-h-[100px]" 
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/appointments")}
            className="mb-4 p-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("appointments.backToAppointments")}
          </Button>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t("appointments.scheduleNewAppointment")}
          </h1>
          <p className="text-gray-600">
            {t("common.show")} {currentStep + 1} {t("common.of")} {wizardSteps.length}
          </p>
        </div>

        {/* Patient Info Banner for Prefilled Patient */}
        {isPatientPrefilled && selectedPatientData && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">
                  {t("appointments.schedulingFor")}: {selectedPatientData.firstName} {selectedPatientData.lastName}
                </p>
                <p className="text-xs text-green-700">{t("appointments.patientId")}: #{selectedPatientData.id}</p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {wizardSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  onClick={() => {
                    // Allow navigation to previous steps or current step
                    if (index <= currentStep || isStepValid(index)) {
                      goToStep(index);
                    }
                  }}
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors z-10 relative cursor-pointer",
                    index <= currentStep
                      ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                      : "bg-white border-gray-300 text-gray-400",
                    isStepValid(index) && index < currentStep && "bg-green-600 border-green-600 hover:bg-green-700",
                    // Disable click for future steps that aren't valid
                    index > currentStep && !isStepValid(index) && "cursor-not-allowed opacity-50"
                  )}
                >
                  {isStepValid(index) && index < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                {index < wizardSteps.length - 1 && (
                  <div
                    className={cn(
                      "w-20 h-0.5 transition-colors relative -ml-2",
                      index < currentStep ? "bg-blue-600" : "bg-gray-300"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">
                {wizardSteps[currentStep].title}
              </h2>
              {isStepValid(currentStep) && (
                <div className="flex items-center gap-1 text-green-600">
                  <Check className="h-4 w-4" />
                  <span className="text-sm font-medium">{t("appointments.completed")}</span>
                </div>
              )}
            </div>
            <p className="text-gray-600">
              {wizardSteps[currentStep].description}
            </p>
          </div>
        </div>

        {/* Step Content */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              {renderStepContent()}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0 || (currentStep === 1 && isPatientPrefilled)}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                {t("appointments.back")}
              </Button>

              {currentStep < wizardSteps.length - 1 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2"
                >
                  {t("appointments.next")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  type="button" 
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isPending}
                  className="flex items-center gap-2"
                >
                  {isPending ? t("appointments.scheduling") : t("appointments.scheduleAppointment")}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
