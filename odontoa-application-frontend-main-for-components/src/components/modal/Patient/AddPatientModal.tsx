import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { useCreatePatient } from "@/hooks/patients/useCreatePatient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitHandler, useForm } from "react-hook-form";
import { useGetDentists } from "@/hooks/dentists/useGetDentists";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { CalendarIcon, Upload, X, Plus, Pencil, Loader2 } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { patientSchema, PatientSchema } from "@/lib/schemas";
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
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useUpdatePatient } from "@/hooks/patients/useUpdatePatient";
import { Loading } from "@/components/ui/loading";
import { Patient } from "@/types/Patient";
import { PhoneNumbersInput } from "@/components/ui/PhoneNumbersInput";
import { useTranslation } from "react-i18next";
import { getDateFnsLocale } from "@/lib/utils";

export default function AddPatientModal({
  open,
  setOpen,
  patient,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  patient?: Patient;
}) {
  const { t, i18n } = useTranslation();
  const { mutate: createPatient, isPending: isCreating } = useCreatePatient();
  const { mutate: updatePatient, isPending: isUpdating } = useUpdatePatient();
  const { data: dentists } = useGetDentists();

  const form = useForm<PatientSchema>({
    resolver: zodResolver(patientSchema),
  });

  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("profileImage", file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      form.setValue("profileImage", undefined);
    }
  };

  const removeAvatar = () => {
    setPreview(null);
    form.setValue("profileImage", undefined);
    const fileInput = document.getElementById(
      "avatar-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const onSubmit: SubmitHandler<PatientSchema> = (data) => {
    if (patient) {
      updatePatient(
        { id: patient.id, data },
        {
          onSuccess: () => {
            setOpen(false);
          },
        }
      );
    } else {
      createPatient(data, {
        onSuccess: () => {
          setOpen(false);
        },
      });
    }
  };

  const handleSubmit = form.handleSubmit(onSubmit, () => {
    form.trigger();
  });

  const handleOpenChange = (open: boolean) => {
    form.reset();
    setPreview(null);
    setOpen(open);
  };

  useEffect(() => {
    if (patient) {
      form.reset({
        firstName: patient.firstName || "",
        lastName: patient.lastName || "",
        email: patient.email || "",
        phoneNumbers: patient.phoneNumbers?.length > 0
          ? patient.phoneNumbers
          : [{ phonenumber: "" }],
        address: patient.address || "",
        country: patient.country || "",
        city: patient.city || "",
        birthDate: patient.birthDate ? new Date(patient.birthDate) : undefined,
        dentistId: patient.dentist.id ? patient.dentist.id.toString() : undefined,
        profileImage: undefined,
      });
      setPreview(typeof patient.profileImage === "string" ? patient.profileImage : null);
    } else {
      form.reset({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumbers: [{ phonenumber: "" }],
        address: "",
        country: "",
        city: "",
        birthDate: undefined,
        dentistId: undefined,
        profileImage: undefined,
      });
      setPreview(null);
    }
  }, [patient, open]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {(isCreating || isUpdating) && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80">
            <Loading size="md" showLogo={true} />
            <span className="sr-only">
              {isCreating ? t("patients.creatingPatient") : t("patients.updatingPatient")}
            </span>
          </div>
        )}
        <DialogHeader className="text-center pb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {patient ? t("patients.editPatient") : t("patients.addNewPatient")}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {patient
              ? t("patients.editPatientDescription")
              : t("patients.addPatientDescription")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-2">
            {/* Profile Image Section */}
            <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                    {preview ? (
                      <AvatarImage src={preview} alt="Profile" />
                    ) : (
                      <div className="flex w-full h-full items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 font-semibold text-xl">
                        {getInitials(
                          form.watch("firstName"),
                          form.watch("lastName")
                        )}
                      </div>
                    )}
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 flex gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className={`h-8 w-8 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow ${preview ? "hidden" : ""
                        }`}
                      onClick={() =>
                        document.getElementById("avatar-upload")?.click()
                      }
                    >
                      <Upload className="h-4 w-4" />
                      <span className="sr-only">Upload profile image</span>
                    </Button>
                    {preview && (
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                        onClick={removeAvatar}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove profile image</span>
                      </Button>
                    )}
                  </div>
                  <FormField
                    control={form.control}
                    name="profileImage"
                    render={() => (
                      <FormItem>
                        <FormControl>
                          <Input
                            id="avatar-upload"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("patients.profileImage")}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t("patients.profileImageDescription")}
                  </p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="h-24 flex flex-col">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      {t("common.firstName")} <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          form.trigger("firstName");
                        }}
                        onBlur={() => form.trigger("firstName")}
                        value={field.value || ""}
                        placeholder={t("patients.enterFirstName")}
                        className={cn(
                          "h-10",
                          form.formState.errors.firstName && "border-red-500 focus:border-red-500 focus:ring-red-500"
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="h-24 flex flex-col">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      {t("common.lastName")} <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          form.trigger("lastName");
                        }}
                        onBlur={() => form.trigger("lastName")}
                        value={field.value || ""}
                        placeholder={t("patients.enterLastName")}
                        className={cn(
                          "h-10",
                          form.formState.errors.lastName && "border-red-500 focus:border-red-500 focus:ring-red-500"
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="h-24 flex flex-col">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      {t("common.email")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          form.trigger("email");
                        }}
                        onBlur={() => form.trigger("email")}
                        value={field.value || ""}
                        type="email"
                        placeholder="pacijent@email.com"
                        className={cn(
                          "h-10",
                          form.formState.errors.email && "border-red-500 focus:border-red-500 focus:ring-red-500"
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumbers"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PhoneNumbersInput
                        phoneNumbers={field.value || []}
                        onChange={field.onChange}
                        error={form.formState.errors.phoneNumbers?.message}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="h-24 flex flex-col">
                    <FormLabel className="text-sm font-medium text-gray-700">{t("common.address")}</FormLabel>
                    <FormControl>
                      <Input
                        onChange={field.onChange}
                        value={field.value || ""}
                        placeholder={t("patients.enterAddress")}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="h-24 flex flex-col">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      {t("common.city")} <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          form.trigger("city");
                        }}
                        onBlur={() => form.trigger("city")}
                        value={field.value || ""}
                        placeholder={t("patients.enterCity")}
                        className={cn(
                          "h-10",
                          form.formState.errors.city && "border-red-500 focus:border-red-500 focus:ring-red-500"
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="h-24 flex flex-col">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      {t("common.country")} <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          form.trigger("country");
                        }}
                        onBlur={() => form.trigger("country")}
                        value={field.value || ""}
                        placeholder={t("patients.enterCountry")}
                        className={cn(
                          "h-10",
                          form.formState.errors.country && "border-red-500 focus:border-red-500 focus:ring-red-500"
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Medical Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col h-24">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      {t("patients.birthDate")} <span className="text-red-500">*</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "h-10 text-left font-normal justify-start",
                              !field.value && "text-muted-foreground",
                              form.formState.errors.birthDate && "border-red-500 focus:border-red-500 focus:ring-red-500"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP", {
                                locale: getDateFnsLocale(i18n.language),
                              })
                            ) : (
                              <span>{t("patients.selectBirthDate")}</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => {
                            field.onChange(date);
                            form.trigger("birthDate");
                          }}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dentistId"
                render={({ field }) => (
                  <FormItem className="h-24 flex flex-col">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      {t("patients.dentist")} <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.trigger("dentistId");
                        }}
                        value={field.value ? field.value.toString() : undefined}
                      >
                        <SelectTrigger className={cn(
                          "min-h-10",
                          form.formState.errors.dentistId && "border-red-500 focus:border-red-500 focus:ring-red-500"
                        )}>
                          <SelectValue placeholder={t("patients.selectDentist")} />
                        </SelectTrigger>
                        <SelectContent>
                          {dentists?.data.map((dentist) => (
                            <SelectItem
                              key={dentist.id}
                              value={dentist.id.toString()}
                            >
                              Dr {dentist.firstName} {dentist.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                disabled={isCreating || isUpdating}
              >
                {(isCreating || isUpdating) ? (
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                ) : patient ? (
                  <Pencil className="h-4 w-4 mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                {patient ? t("patients.saveChanges") : t("patients.addPatient")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
