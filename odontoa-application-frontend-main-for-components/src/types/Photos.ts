export interface Photos {
  id: number;
  photoType: string;
  category: string;
  description?: string | null;
  imageUrl: string;
  createdAt: Date;
  patientMedicalCardId: number;
}
