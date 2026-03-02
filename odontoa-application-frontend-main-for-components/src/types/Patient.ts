import { Appointment } from "./Appointment";
import { Dentist } from "./Dentist";
import { TherapyRecord } from "./ToothRecords";

export interface PatientRequest {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dentistId: number;
  birthDate: Date;
  address: string;
  country: string;
  city: string;
  profileImage: File;
}

export interface PhoneNumber {
  phonenumber: string;
}

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumbers: PhoneNumber[];
  email: string;
  birthDate: Date;
  address: string;
  country: string;
  city: string;
  profileImage: string;
  dentist: Dentist;
  appointments: Appointment[];
  therapyRecords: TherapyRecord[];
}
