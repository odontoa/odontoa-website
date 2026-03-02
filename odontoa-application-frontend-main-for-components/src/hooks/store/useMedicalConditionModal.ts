import { create } from 'zustand';

interface MedicalConditionModalState {
  isOpen: boolean;
  selectedCondition: string | null;
  isAddDetailsOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  selectCondition: (condition: string) => void;
  openAddDetails: () => void;
  closeAddDetails: () => void;
  reset: () => void;
}

export const useMedicalConditionModal = create<MedicalConditionModalState>((set) => ({
  isOpen: false,
  selectedCondition: null,
  isAddDetailsOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false, selectedCondition: null, isAddDetailsOpen: false }),
  selectCondition: (condition: string) => set({ selectedCondition: condition, isAddDetailsOpen: true }),
  openAddDetails: () => set({ isAddDetailsOpen: true }),
  closeAddDetails: () => set({ isAddDetailsOpen: false, selectedCondition: null }),
  reset: () => set({ isOpen: false, selectedCondition: null, isAddDetailsOpen: false }),
}));
