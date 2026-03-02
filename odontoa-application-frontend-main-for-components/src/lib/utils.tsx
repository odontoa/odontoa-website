import { Badge } from "@/components/ui/badge";
import { AppointmentStatus } from "@/types/Appointment";
import { clsx, type ClassValue } from "clsx";
import { addDays, startOfWeek } from "date-fns";
import { CheckCircle, Clock, PlayCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { srLatn } from "date-fns/locale";
import { enUS } from "date-fns/locale";
import { thGroupCategories } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (
  firstName: string | undefined,
  lastName: string | undefined
) => {
  if (!firstName && !lastName) return "?";
  const firstInitial = firstName ? firstName[0].toUpperCase() : "";
  const lastInitial = lastName ? lastName[0].toUpperCase() : "";
  return `${firstInitial}${lastInitial}`;
};

export function calculateAge(date?: Date): number | undefined {
  if (!date) return undefined;
  const birthDate = new Date(date);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}

export const isActive = (path: string, pathname: string) => {
  return pathname === path;
};

export const isActiveTab = (basePath: string, currentPath: string) => {
  return currentPath.startsWith(basePath);
};

export const getDifferenceColor = (difference: number | undefined) => {
  if (difference) {
    if (difference > 0) return "text-green-600";
    if (difference < 0) return "text-red-600";
  }
  return "text-gray-600";
};

export const generateTimes = () => {
  const times = [];
  for (let h = 8; h < 20; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hour = h.toString().padStart(2, "0");
      const minute = m.toString().padStart(2, "0");
      times.push(`${hour}:${minute}`);
    }
  }
  return times;
};

export const useDebounce = (value: string, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const getStatusInfo = (status: AppointmentStatus, t?: (key: string) => string) => {
  const getText = (key: string) => t ? t(`status.${key}`) : 
    (key === "scheduled" ? "Zakazano" :
     key === "in_progress" ? "U toku" :
     key === "completed" ? "Završeno" :
     key === "canceled" ? "Otkazano" : "Zakazano");
  
  switch (status) {
    case "scheduled":
      return {
        icon: <Clock className="h-4 w-4" />,
        text: getText("scheduled"),
        color: "bg-gray-100 text-gray-700 border-gray-300",
      };
    case "in_progress":
      return {
        icon: <PlayCircle className="h-4 w-4" />,
        text: getText("inProgress"),
        color: "bg-blue-100 text-blue-700 border-blue-300",
      };
    case "completed":
      return {
        icon: <CheckCircle className="h-4 w-4" />,
        text: getText("completed"),
        color: "bg-green-100 text-green-700 border-green-300",
      };
    case "canceled":
      return {
        icon: <XCircle className="h-4 w-4" />,
        text: getText("canceled"),
        color: "bg-red-100 text-red-700 border-red-300",
      };
    default:
      return {
        icon: <Clock className="h-4 w-4" />,
        text: getText("scheduled"),
        color: "bg-gray-100 text-gray-700 border-gray-300",
      };
  }
};


// Configurable time settings - adjust these to change schedule limits
const START_TIME = 8; // 8 AM
const END_TIME = 20; // 8 PM (20:00)
const TIME_STEP_MINUTES = 15; // 15-minute intervals

// Generate time slots based on configuration
export const generateTimeSlots = () => {
  const slots = [];
  for (let hour = START_TIME; hour <= END_TIME; hour++) {
    for (let minutes = 0; minutes < 60; minutes += TIME_STEP_MINUTES) {
      if (hour === END_TIME && minutes > 0) break; // Don't add 20:30 if end time is 20:00
      const timeString = `${hour.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
      slots.push(timeString);
    }
  }
  return slots;
};

export const timeSlots = generateTimeSlots();

export const getServiceStyle = (dentalService: string) => {
  switch (dentalService.toLowerCase()) {
    // Stomatološki usluge
    case "pregled":
      return "bg-green-100 hover:bg-green-200 border-green-300 text-green-800";
    case "vadjenje":
    case "vađenje":
    case "vađenje zuba":
      return "bg-red-100 hover:bg-red-200 border-red-300 text-red-800";
    case "plomba":
    case "plombiranje":
      return "bg-yellow-100 hover:bg-yellow-200 border-yellow-300 text-yellow-800";
    case "lečenje kanala":
      return "bg-orange-100 hover:bg-orange-200 border-orange-300 text-orange-800";
    case "čišćenje":
    case "ciscenje":
    case "ciscenje zuba":
      return "bg-blue-100 hover:bg-blue-200 border-blue-300 text-blue-800";
    case "protetika":
      return "bg-indigo-100 hover:bg-indigo-200 border-indigo-300 text-indigo-800";

    // Ortodontski usluge
    case "ortodontski pregled":
      return "bg-purple-100 hover:bg-purple-200 border-purple-300 text-purple-800";
    case "postavljanje aparata":
      return "bg-pink-100 hover:bg-pink-200 border-pink-300 text-pink-800";
    case "kontrola":
      return "bg-teal-100 hover:bg-teal-200 border-teal-300 text-teal-800";
    case "promena žice":
      return "bg-cyan-100 hover:bg-cyan-200 border-cyan-300 text-cyan-800";
    case "retencija":
      return "bg-emerald-100 hover:bg-emerald-200 border-emerald-300 text-emerald-800";
    case "uzimanje otiska":
      return "bg-violet-100 hover:bg-violet-200 border-violet-300 text-violet-800";

    // Ostalo
    case "ostalo":
      return "bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-600";
    default:
      return "bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-600";
  }
};

export const getAppointmentStyle = (dentalService: string, status: string) => {
  const baseStyle = getServiceStyle(dentalService);
  
  if (status === "canceled") {
    return "bg-gray-200 hover:bg-gray-300 border-gray-400 text-gray-500 opacity-60 border-dashed";
  }
  
  return baseStyle;
};

export const getTreatmentTypeLabel = (dentalService: string) => {
  const service = dentalService.toLowerCase();

  // Ortodontski usluge
  if (service.includes("ortodontski") ||
    service.includes("postavljanje aparata") ||
    service.includes("promena žice") ||
    service.includes("retencija") ||
    service.includes("uzimanje otiska")) {
    return { type: "ortodontski", label: "Ortodontski", color: "bg-purple-100 text-purple-800 border-purple-300" };
  }

  // Stomatološki usluge
  return { type: "stomatoloski", label: "Stomatološki", color: "bg-blue-100 text-blue-800 border-blue-300" };
};

export const getStatusDotColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-500";
    case "in_progress":
      return "bg-blue-500";
    case "scheduled":
      return "bg-yellow-500";
    case "canceled":
      return "bg-red-500";
    case "no_show":
      return "bg-gray-500";
    default:
      return "bg-gray-400";
  }
};

export const formatTime = (isoString: string, locale: string = "sr-RS") => {
  const date = new Date(isoString);
  return date.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const getDateFnsLocale = (language: string) => {
  return language === "en" ? enUS : srLatn;
};

export const getWeekday = (isoString: string) => {
  const date = new Date(isoString);
  // Convert Sunday=0 to Monday=0, but now we support 7 days
  return date.getDay() === 0 ? 6 : date.getDay() - 1;
};

export const getTimeSlotFromISO = (isoString: string) => {
  const date = new Date(isoString);
  const hour = date.getHours();
  const minutes = date.getMinutes();

  // Round minutes to nearest 30-minute interval
  const roundedMinutes =
    Math.floor(minutes / TIME_STEP_MINUTES) * TIME_STEP_MINUTES;
  const timeString = `${hour.toString().padStart(2, "0")}:${roundedMinutes
    .toString()
    .padStart(2, "0")}`;

  return timeSlots.findIndex((slot) => slot === timeString);
};

// Calculate how many time slots an appointment spans (30-minute intervals)
export const calculateAppointmentRowSpan = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  // Calculate duration in minutes
  const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);

  // Calculate how many 30-minute slots this spans
  return Math.ceil(durationMinutes / TIME_STEP_MINUTES);
};

export const getWeekRange = (date: Date, includeWeekend: boolean = false) => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = addDays(start, includeWeekend ? 7 : 5);
  return { start, end };
};

export const getStatusBadge = (status: string, t?: (key: string) => string) => {
  const getLabel = (key: string) => t ? t(`status.${key}`) : 
    (key === "scheduled" ? "Zakazano" :
     key === "completed" ? "Završeno" :
     key === "canceled" ? "Otkazano" :
     key === "in_progress" ? "U toku" : "Zakazano");
  
  const statusConfig = {
    scheduled: { label: getLabel("scheduled"), className: "bg-yellow-100 text-yellow-800" },
    completed: { label: getLabel("completed"), className: "bg-green-100 text-green-800" },
    canceled: { label: getLabel("canceled"), className: "bg-red-100 text-red-800" },
    in_progress: { label: getLabel("inProgress"), className: "bg-blue-100 text-blue-800" }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
  return <Badge className={config.className}>{config.label}</Badge>;
};

export const getTypeBadge = (type: string, t?: (key: string) => string) => {
  const getLabel = (key: string) => t ? t(`treatmentTypes.${key}`) :
    (key === "dental" ? "Stomatološki" : "Ortodontski");
  
  const typeConfig = {
    stomatoloski: { label: getLabel("dental"), className: "bg-green-100 text-green-800" },
    ortodontski: { label: getLabel("orthodontic"), className: "bg-purple-100 text-purple-800" }
  };

  const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.stomatoloski;
  return <Badge className={config.className}>{config.label}</Badge>;
};

export const getCancellationReasonLabel = (reason: string, t?: (key: string) => string) => {
  const getLabel = (key: string) => t ? t(`appointments.${key}`) :
    (key === "patientCanceled" ? "Pacijent otkazao" :
     key === "doctorCanceled" ? "Doktor otkazao" :
     key === "patientLate" ? "Kašnjenje pacijenta" :
     key === "emergency" ? "Hitni slučaj" :
     key === "other" ? "Drugo" : "Nepoznato");
  
  const reasonLabels: Record<string, string> = {
    patient_canceled: getLabel("patientCanceled"),
    doctor_canceled: getLabel("doctorCanceled"), 
    patient_late: getLabel("patientLate"),
    emergency: getLabel("emergency"),
    other: getLabel("other")
  };
  
  return reasonLabels[reason] || getLabel("unknown");
};

// Currency utility functions
export const getCurrencySymbol = (currencyCode: string): string => {
  const currencySymbols: Record<string, string> = {
    RSD: "RSD",
    USD: "$",
    BAM: "KM",
    EUR: "€"
  };
  
  return currencySymbols[currencyCode] || currencyCode;
};

export const getCurrencyLocale = (currencyCode: string): string => {
  const currencyLocales: Record<string, string> = {
    RSD: "sr-RS",
    USD: "en-US",
    BAM: "bs-BA",
    EUR: "de-DE"
  };
  
  return currencyLocales[currencyCode] || "sr-RS";
};

export const formatCurrency = (amount: number, currencyCode: string): string => {
  const locale = getCurrencyLocale(currencyCode);
  const symbol = getCurrencySymbol(currencyCode);
  
  // For currencies that use symbols, format with locale and show symbol
  if (symbol !== currencyCode) {
    return amount.toLocaleString(locale, {
      style: "currency",
      currency: currencyCode,
    });
  }
  
  // For currencies like RSD that use the code as symbol, format with locale and append symbol
  return `${amount.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${symbol}`;
};

/**
 * Translates Serbian treatment names to their i18n translation keys
 * @param treatmentName - Serbian treatment name from backend
 * @returns i18n translation key or the original name if not found
 */
export const getTreatmentTranslationKey = (treatmentName: string): string => {
  const normalized = treatmentName.toLowerCase().trim();
  
  // Map Serbian treatment names to i18n keys
  const treatmentMap: Record<string, string> = {
    "pregled": "dentalServices.examination",
    "vađenje": "dentalServices.extraction",
    "vadjenje": "dentalServices.extraction",
    "vađenje zuba": "dentalServices.extraction",
    "vadjenje zuba": "dentalServices.extraction",
    "plomba": "dentalServices.filling",
    "plombiranje": "dentalServices.filling",
    "lečenje kanala": "dentalServices.rootCanal",
    "lecenje kanala": "dentalServices.rootCanal",
    "čišćenje": "dentalServices.cleaning",
    "ciscenje": "dentalServices.cleaning",
    "čišćenje zuba": "dentalServices.cleaning",
    "ciscenje zuba": "dentalServices.cleaning",
    "protetika": "dentalServices.prosthetics",
    "ortodontski pregled": "dentalServices.orthoExamination",
    "postavljanje aparata": "dentalServices.applianceInstallation",
    "kontrola": "dentalServices.control",
    "promena žice": "dentalServices.wireChange",
    "promena zice": "dentalServices.wireChange",
    "retencija": "dentalServices.retention",
    "uzimanje otiska": "dentalServices.impression",
    "drugo": "dentalServices.other",
    "ostalo": "dentalServices.other",
    "other": "dentalServices.other",
  };
  
  return treatmentMap[normalized] || treatmentName;
};

/**
 * Translates Serbian treatment names using i18n
 * @param treatmentName - Serbian treatment name from backend
 * @param t - i18n translation function
 * @returns Translated treatment name or original if translation not found
 */
export const translateTreatment = (treatmentName: string, t?: (key: string) => string): string => {
  if (!t) return treatmentName;
  
  const translationKey = getTreatmentTranslationKey(treatmentName);
  
  // If it's a translation key (contains dot), use i18n
  if (translationKey.includes(".")) {
    const translated = t(translationKey);
    // If translation returns the key itself, return original name
    return translated !== translationKey ? translated : treatmentName;
  }
  
  // If no mapping found, return original name
  return treatmentName;
};

// Tooth status is now based on therapy group name
export type ToothStatus = string | null;

// Helper to find which category a therapy group belongs to
export const getTherapyCategory = (therapyGroup: string): string | null => {
  for (const [category, groups] of Object.entries(thGroupCategories)) {
    if (groups.includes(therapyGroup)) {
      return category;
    }
  }
  return null;
};

// Color mapping based on therapy categories
export const getToothStatusColor = (status: ToothStatus): string => {
  if (!status) {
    return "fill-gray-200 stroke-gray-400";
  }
  
  // Check specifically for extracted teeth (Vađenje zuba)
  if (status === "Vađenje zuba") {
    return "fill-red-500 stroke-red-700";
  }
  
  const category = getTherapyCategory(status);
  
  switch (category) {
    case "Endodontska terapija":
      return "fill-blue-200 stroke-blue-400";
    case "Restaurativna terapija":
      return "fill-green-200 stroke-green-400";
    case "Protetska terapija":
      return "fill-purple-200 stroke-purple-400";
    case "Higijenska i parodontološka terapija":
      return "fill-cyan-200 stroke-cyan-400";
    case "Hirurške intervencije":
      return "fill-red-200 stroke-red-400";
    case "Preventiva i topička terapija":
      return "fill-yellow-200 stroke-yellow-400";
    default:
      // If therapy group not found in categories, use orange
      return "fill-orange-200 stroke-orange-400";
  }
};

export const getToothStatusLabel = (status: ToothStatus, t?: (key: string) => string): string => {
  if (!status) {
    return t ? (t("dentalCard.noTreatment") || "No treatment") : "No treatment";
  }
  
  const category = getTherapyCategory(status);
  
  if (category && t) {
    // Try to translate the category
    const translatedCategory = t(`constants.thGroupCategories.${category}`) || category;
    // Try to translate the therapy group
    const translatedGroup = t(`constants.thGroups.${status}`) || status;
    return `${translatedCategory}: ${translatedGroup}`;
  }
  
  // Fallback to just the therapy group name
  return status;
};

// Helper function to get all status colors for legend
export const getAllStatusColors = (): Array<{ label: string; color: string; borderColor: string }> => {
  return [
    {
      label: "Bez tretmana",
      color: "bg-gray-200",
      borderColor: "border-gray-400",
    },
    {
      label: "Vađenje zuba",
      color: "bg-red-500",
      borderColor: "border-red-700",
    },
    {
      label: "Endodontska terapija",
      color: "bg-blue-200",
      borderColor: "border-blue-400",
    },
    {
      label: "Restaurativna terapija",
      color: "bg-green-200",
      borderColor: "border-green-400",
    },
    {
      label: "Protetska terapija",
      color: "bg-purple-200",
      borderColor: "border-purple-400",
    },
    {
      label: "Higijenska i parodontološka terapija",
      color: "bg-cyan-200",
      borderColor: "border-cyan-400",
    },
    {
      label: "Hirurške intervencije",
      color: "bg-red-200",
      borderColor: "border-red-400",
    },
    {
      label: "Preventiva i topička terapija",
      color: "bg-yellow-200",
      borderColor: "border-yellow-400",
    },
    {
      label: "Ostalo",
      color: "bg-orange-200",
      borderColor: "border-orange-400",
    },
  ];
};