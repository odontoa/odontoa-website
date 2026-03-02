export interface ReportResponse {
  data: Report[];
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface Report {
  id?: number;
  patientId: number;
  title: string;
  content: string;
  reportDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ReportRequest {
  title: string;
  content: string;
}
