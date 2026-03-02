// ─── Shared UI-Lab types ──────────────────────────────────────────────────────
// All V2 UI-Lab domain types live here. No backend dependency.

// ─── Calendar primitives ──────────────────────────────────────────────────────

export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

// ─── Appointment ──────────────────────────────────────────────────────────────

export type ApptStatus = "ZAKAZANO" | "ZAVRSENO" | "NIJE_SE_POJAVIO" | "OTKAZANO";
export type ApptType   = "STOMATOLOSKI" | "ORTODONTSKI";

export type Appointment = {
  id: string;
  patientName: string;
  procedureLabel: string;
  startTime: string;       // "HH:MM"
  endTime?: string;
  dateISO: string;         // "YYYY-MM-DD"
  dayKey: DayKey;
  chairId: 1 | 2 | 3 | 4;
  status: ApptStatus;
  isUrgent?: boolean;
  durationMin: number;
  doctorName?: string;
  notes?: string;
  cancelReason?: string;
  cancelNote?: string;
  canceledAt?: string;
  // Completion fields
  apptType?: ApptType;
  treatments?: Treatment[];
  completedAt?: string;
};

// ─── Treatment ────────────────────────────────────────────────────────────────

export type TreatmentScope = "ALL" | "SINGLE" | "MULTI";
export type ToothType      = "STALNI" | "MLECNI";

export type TherapyRef = {
  therapyId: string;
  name: string;
  unitPrice: number;
};

export type TechRef = {
  techId: string;
  name: string;
  cost: number;
};

export type Treatment = {
  id: string;
  scope: TreatmentScope;
  toothType: ToothType;
  selectedTeeth: number[];  // FDI notation; empty when scope="ALL"
  therapies: TherapyRef[];
  basePrice: number;        // sum of therapy unit prices (before multiplier)
  multiplier: number;       // 1 for ALL/SINGLE; number of selectedTeeth for MULTI
  totalPrice: number;       // manually editable override (basePrice * multiplier by default)
  isPriceOverridden: boolean;
  percentCorrection?: number; // set when priceMode="percent"; undefined otherwise
  tech: TechRef | null;
  note: string;
};

// ─── Therapy (Cenovnik entry) ─────────────────────────────────────────────────

export type TherapyCategory =
  | "Pregledi"
  | "Preventiva i parodontologija"
  | "Konzervativa"
  | "Endodoncija"
  | "Oralna hirurgija"
  | "Implantologija"
  | "Protetika"
  | "Estetska stomatologija"
  | "Ortodoncija"
  | "Vanstandardne usluge";

export type Therapy = {
  id: string;
  category: TherapyCategory;
  name: string;
  defaultPrice: number;
  isActive: boolean;
  // TODO: add billingType: "FIXED" | "PER_TOOTH" | "PER_CANAL" | "PER_CROWN" | "PER_JAW" | "PER_QUADRANT" | "PER_UNIT"
};

// ─── Technician / Lab ─────────────────────────────────────────────────────────

export type Technician = {
  id: string;
  name: string;
  phone?: string;
  note?: string;
};
