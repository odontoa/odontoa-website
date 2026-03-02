const STORAGE_KEY = "odontoa_v2_clinic_profile";

export interface ClinicProfile {
  name: string;
  pib: string;
  mb?: string;
  email: string;
  phone: string;
  website?: string;
  address: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  logoDataUrl?: string;
  memoDataUrl?: string;
  memoFileName?: string;
  note?: string;
}

export const DEFAULT_CLINIC_PROFILE: ClinicProfile = {
  name: "",
  pib: "",
  mb: "",
  email: "",
  phone: "",
  website: "",
  address: { street: "", city: "", zip: "", country: "Srbija" },
  logoDataUrl: undefined,
  memoDataUrl: undefined,
  memoFileName: undefined,
  note: "",
};

export function loadClinicProfile(): ClinicProfile {
  if (typeof window === "undefined") return { ...DEFAULT_CLINIC_PROFILE };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_CLINIC_PROFILE };
    return { ...DEFAULT_CLINIC_PROFILE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_CLINIC_PROFILE };
  }
}

export function saveClinicProfile(profile: ClinicProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Quota exceeded — silently ignore; UI shows autosave status
  }
}
