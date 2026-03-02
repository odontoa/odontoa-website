// Type for individual tooth data from backend
// Can be extended in the future to include more detailed tooth information
export type ToothData = string | null;

// Type for all teeth data using FDI notation
// Quadrant 1 (11-18): Upper right
// Quadrant 2 (21-28): Upper left
// Quadrant 3 (31-38): Lower left
// Quadrant 4 (41-48): Lower right
export interface TeethData {
  // Upper right quadrant (11-18)
  t11?: ToothData;
  t12?: ToothData;
  t13?: ToothData;
  t14?: ToothData;
  t15?: ToothData;
  t16?: ToothData;
  t17?: ToothData;
  t18?: ToothData;
  // Upper left quadrant (21-28)
  t21?: ToothData;
  t22?: ToothData;
  t23?: ToothData;
  t24?: ToothData;
  t25?: ToothData;
  t26?: ToothData;
  t27?: ToothData;
  t28?: ToothData;
  // Lower left quadrant (31-38)
  t31?: ToothData;
  t32?: ToothData;
  t33?: ToothData;
  t34?: ToothData;
  t35?: ToothData;
  t36?: ToothData;
  t37?: ToothData;
  t38?: ToothData;
  // Lower right quadrant (41-48)
  t41?: ToothData;
  t42?: ToothData;
  t43?: ToothData;
  t44?: ToothData;
  t45?: ToothData;
  t46?: ToothData;
  t47?: ToothData;
  t48?: ToothData;
}

// Full odontogram response from backend
export interface Odontogram {
  id: number;
  patientMedicalCardId: number;
  teeth: TeethData;
  createdAt: Date;
  updatedAt: Date;
}

