export interface MedicalCondition {
  id: number;
  name: string;
  description: string;
}

export interface MedicalConditionRequest {
  name: string;
  description?: string;
}

export interface MedicalConditionsResponse {
  data: MedicalCondition[];
  total: number;
  page: number;
  limit: number;
} 