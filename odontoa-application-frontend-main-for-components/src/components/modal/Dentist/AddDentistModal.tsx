import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import { dentistSchema, DentistSchema, dentistEditSchema, DentistEditSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateDentist } from "@/hooks/dentists/useCreateDentist";
import { useUpdateDentist } from "@/hooks/dentists/useUpdateDentist";
import { User, Mail, Phone, Lock, Stethoscope, Plus } from "lucide-react";
import { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";

export default function AddDentistModal({
  open,
  setOpen,
  dentist
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  dentist?: any;
}) {
  const { t } = useTranslation();
  const { mutate: createDentist } = useCreateDentist();
  const { mutate: updateDentist } = useUpdateDentist();

  const form = useForm<DentistSchema | DentistEditSchema>({
    resolver: zodResolver(dentist ? dentistEditSchema : dentistSchema),
  });

  useEffect(() => {
    if (dentist) {
      form.reset({
        firstName: dentist.firstName || "",
        lastName: dentist.lastName || "",
        email: dentist.email || "",
        phone: dentist.phone || "",
        role: dentist.role || "USER",
      });
    } else {
      form.reset({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "USER",
      });
    }
  }, [dentist, open])

  const onSubmit: SubmitHandler<DentistSchema | DentistEditSchema> = (data) => {
    if (dentist) {
      updateDentist(
        { id: (dentist as any).id, data: { firstName: data.firstName, lastName: data.lastName, phone: data.phone, email: data.email, role: data.role } },
        {
          onSuccess: () => {
            setOpen(false);
            form.reset();
          },
        }
      );
    } else {
      createDentist(data as DentistSchema, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    form.reset();
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Stethoscope className="h-8 w-8 text-blue-600" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {dentist ? t("dentists.editDentist") : t("dentists.addNewDentist")}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {dentist
              ? t("dentists.editDentistDescription")
              : t("dentists.addDentistDescription")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <User className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">{t("patients.personalInfo")}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-start">
                      <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-500" />
                        {t("common.firstName")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          onChange={field.onChange}
                          value={field.value || ""}
                          placeholder={t("dentists.enterFirstName")}
                          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                    <FormItem className="flex flex-col justify-start">
                      <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-500" />
                        {t("common.lastName")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          onChange={field.onChange}
                          value={field.value || ""}
                          placeholder={t("dentists.enterLastName")}
                          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Role select input */}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-start">
                      <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-blue-500" />
                        {t("dentists.role")}
                      </FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder={t("dentists.selectRole")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ADMIN">ADMIN</SelectItem>
                            <SelectItem value="USER">USER</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <Mail className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">{t("patients.contactInfo")}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-start">
                      <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-green-500" />
                        {t("auth.emailAddress")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          onChange={field.onChange}
                          value={field.value || ""}
                          type="email"
                          placeholder={t("dentists.enterEmail")}
                          className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-start">
                      <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-green-500" />
                        {t("common.phone")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          onChange={field.onChange}
                          value={field.value || ""}
                          placeholder={t("dentists.enterPhone")}
                          className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Security Section */}
            {!dentist &&
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <Lock className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{t("dentists.security")}</h3>
                </div>

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-start">
                      <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Lock className="h-4 w-4 text-purple-500" />
                        {t("dentists.password")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          onChange={field.onChange}
                          type="password"
                          placeholder={t("dentists.minPassword")}
                          className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            }
            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                {dentist ? <Stethoscope className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {dentist ? t("dentists.saveChanges") : t("dentists.addDentist")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
