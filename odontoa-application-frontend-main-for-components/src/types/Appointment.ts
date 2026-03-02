import { Dentist } from "./Dentist";
import type { Patient } from "./Patient";
import { TherapyRecord } from "./ToothRecords";

export interface AppointmentRequest {
  patientId: number;
  staffId: number;
  dateTime: Date;
  description: string;
}

export type AppointmentStatus =
  | "scheduled"
  | "in_progress"
  | "completed"
  | "canceled"
  | "no_show";

export type CancellationReason = 
  | "patient_canceled" 
  | "doctor_canceled" 
  | "patient_late" 
  | "emergency" 
  | "other";

export interface Appointment {
  id: number;
  patientMedicalCard: Patient;
  dentist: Dentist;
  startTime: string;
  endTime: string;
  treatmentType: string;
  dentalService: string;
  chair: number;
  status: AppointmentStatus;
  therapyRecords: TherapyRecord[];
  notes: string;
  cancellationReason?: CancellationReason;
  cancellationNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}
