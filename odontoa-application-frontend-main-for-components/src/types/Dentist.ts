export interface Dentist {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password?: string;
  role: "ADMIN" | "USER";
}
