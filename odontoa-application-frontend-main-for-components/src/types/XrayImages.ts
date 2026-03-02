export interface XrayImage {
  id: number;
  xrayType: string;
  description?: string | null;
  imageUrl: string;
  createdAt: Date;
  patientMedicalCardId: number;
}
