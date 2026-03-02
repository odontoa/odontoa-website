import { z } from "zod";
import i18n from "@/i18n/config";

// Helper function to get translated messages
const t = (key: string): string => {
  return i18n.t(key);
};

export const toothTreatmentSchema = z.object({
  toothNumber: z.number().optional(),
  entryType: z.enum(["Status", "Terapija", "Kontrola", "Dg/Th"]).optional(),
  toothAreas: z.array(z.string()),
  toothType: z.enum(["deciduous", "permanent"], { 
    required_error: t("validation.toothTypeRequired")
  }),
  dgGroupName: z.string().optional(),
  dgValue: z.string().optional(),
  therapies: z.array(z.object({ 
    thGroupName: z.string(), 
    thValue: z.string() 
  })).optional(),
  notes: z.string().optional(),
  price: z.coerce.string().optional(),
  isGlobal: z.boolean(),
  isWholeTooth: z.boolean().optional(),
}).refine(
  (data) => {
    // If not global therapy and not whole tooth, tooth number must be selected
    if (!data.isGlobal && !data.isWholeTooth && (!data.toothNumber || data.toothNumber === 0)) {
      return false;
    }
    return true;
  },
  {
    message: t("validation.selectTooth"),
    path: ["toothNumber"],
  }
).refine(
  (data) => {
    // If whole tooth is selected, tooth number must be selected
    if (data.isWholeTooth && (!data.toothNumber || data.toothNumber === 0)) {
      return false;
    }
    return true;
  },
  {
    message: t("validation.selectTooth"),
    path: ["toothNumber"],
  }
).refine(
  (data) => {
    // If whole tooth is selected, at least one therapy must be selected
    if (data.isWholeTooth && (!data.therapies || data.therapies.length === 0)) {
      return false;
    }
    return true;
  },
  {
    message: t("validation.selectTherapy") || "Please select at least one therapy",
    path: ["therapies"],
  }
).refine(
  (data) => {
    // If not global therapy and not whole tooth, at least one tooth area must be selected
    if (!data.isGlobal && !data.isWholeTooth && (!data.toothAreas || data.toothAreas.length === 0)) {
      return false;
    }
    return true;
  },
  {
    message: t("validation.selectToothArea"),
    path: ["toothAreas"],
  }
)
// .refine(
//   (data) => {
//     // If entry type is "Dg/Th", at least one therapy must be added
//     if (data.entryType === "Dg/Th" && (!data.therapies || data.therapies.length === 0)) {
//       return false;
//     }
//     return true;
//   },
//   {
//     message: t("validation.addAtLeastOneTherapy"),
//     path: ["therapies"],
//   }
// ).refine(
//   (data) => {
//     // If entry type is "Dg/Th", at least one complete therapy must be added
//     if (data.entryType === "Dg/Th") {
//       if (!data.therapies || data.therapies.length === 0) {
//         return false;
//       }
//       // Check if at least one therapy has both thGroupName and thValue
//       const hasCompleteTherapy = data.therapies.some(therapy => 
//         therapy.thGroupName && therapy.thGroupName.trim() !== '' && 
//         therapy.thValue && therapy.thValue.trim() !== ''
//       );
//       return hasCompleteTherapy;
//     }
//     return true;
//   },
//   {
//     message: t("validation.addCompleteTherapy"),
//     path: ["therapies"],
//   }
// );

export const treatmentFormSchema = z.object({
  toothTreatments: z
    .array(toothTreatmentSchema)
    .min(1, t("validation.addAtLeastOneTreatment")),
});

export const appointmentFormSchema = z.object({
  chair: z.coerce
    .number({ required_error: t("validation.requiredField") })
    .min(1, t("validation.selectChair")),
  startTime: z.date({ required_error: t("validation.selectDate") }),
  time: z.string(),
  duration: z.coerce
    .number({ required_error: t("validation.requiredField") })
    .min(1, t("validation.enterDuration")),
  status: z.enum([
    "scheduled",
    "completed",
    "in_progress",
    "canceled",
    "no_show",
  ]),
  notes: z.string().optional(),
  cancellationReason: z.string().nullable().optional(),
  cancellationNotes: z.string().nullable().optional(),
}).refine((data) => {
  // If status is canceled, cancellationReason should be provided
  if (data.status === "canceled" && !data.cancellationReason) {
    return false;
  }
  return true;
}, {
  message: t("validation.cancellationReasonRequired"),
  path: ["cancellationReason"]
})

export type AppointmentFormData = z.infer<typeof appointmentFormSchema>;
export type ToothTreatmentFormData = z.infer<typeof toothTreatmentSchema>;
export type TreatmentFormData = z.infer<typeof treatmentFormSchema>;

export const phoneNumberSchema = z.object({
  phonenumber: z.string().min(1, t("validation.phoneRequired")),
});

export const patientSchema = z.object({
  firstName: z.string({ required_error: t("validation.requiredField") }).min(1, t("validation.firstNameRequired")),
  lastName: z.string({ required_error: t("validation.requiredField") }).min(1, t("validation.lastNameRequired")),
  address: z.string().optional(),
  country: z.string({ required_error: t("validation.requiredField") }).min(1, t("validation.countryRequired")),
  city: z.string({ required_error: t("validation.requiredField") }).min(1, t("validation.cityRequired")),
  phoneNumbers: z.array(phoneNumberSchema).min(1, t("validation.addAtLeastOnePhone")),
  dentistId: z.string({ required_error: t("validation.requiredField") }).min(1, t("validation.dentistRequired")),
  email: z.string().optional(),
  birthDate: z.date({ required_error: t("validation.requiredField") }),
  profileImage: z.instanceof(File).optional(),
});

export type PhoneNumberSchema = z.infer<typeof phoneNumberSchema>;
export type PatientSchema = z.infer<typeof patientSchema>;

export const dentistSchema = z.object({
  firstName: z.string({ required_error: t("validation.requiredField") }),
  lastName: z.string({ required_error: t("validation.requiredField") }),
  phone: z.string({ required_error: t("validation.requiredField") }),
  email: z.string({ required_error: t("validation.requiredField") }).email({ message: t("validation.invalidEmail") }),
  password: z.string({ required_error: t("validation.requiredField") }).min(8, t("validation.passwordMinLength")),
  role: z.enum(["ADMIN", "USER"], { required_error: t("validation.requiredField") }),
});

export type DentistSchema = z.infer<typeof dentistSchema>;

export const dentistEditSchema = dentistSchema.omit({ password: true });
export type DentistEditSchema = z.infer<typeof dentistEditSchema>;

export const loginSchema = z.object({
  email: z
    .string({ required_error: t("validation.requiredField") })
    .email({ message: t("validation.invalidEmail") }),
  password: z.string({ message: t("validation.requiredField") }).min(8, t("validation.passwordMinLength")),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const medicalConditionSchema = z.object({
  conditionName: z.string({ required_error: t("validation.requiredField") }),
  description: z.string({ required_error: t("validation.requiredField") }),
});

export type MedicalConditionSchema = z.infer<typeof medicalConditionSchema>;

// X-Ray Images validation schema
export const xrayImageSchema = z.object({
  xrayType: z.string().min(1, t("validation.xrayTypeRequired")),
  description: z.string().optional().nullable(),
  imageFile: z.instanceof(File, { message: t("validation.imageRequired") })
});

export type XrayImageFormData = z.infer<typeof xrayImageSchema>;

// Photos validation schema
export const photoSchema = z.object({
  photoType: z.string().min(1, t("validation.photoTypeRequired")),
  category: z.string().min(1, t("validation.categoryRequired")),
  description: z.string().optional().nullable(),
  imageFile: z.instanceof(File, { message: t("validation.photoRequired") })
});

export type PhotoFormData = z.infer<typeof photoSchema>;