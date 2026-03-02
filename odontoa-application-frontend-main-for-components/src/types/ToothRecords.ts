import { Appointment } from "./Appointment";

export interface TherapyRecord {
  id: number;
  toothNumber: number;
  toothAreas: string[];
  toothType: "deciduous" | "permanent";
  entryType: "Status" | "Terapija" | "Kontrola" | "Dg/Th";
  dgGroupName?: string;
  dgValue?: string;
  therapies: Array<{ thGroupName: string; thValue: string }>;
  notes?: string;
  price: number;
  isGlobal: boolean;
  createdAt: Date;
  appointment: Appointment;
}
