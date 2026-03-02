import { create } from "zustand";

interface AnalysisEditingModeState {
    isEditing: boolean;
    toggleEditing: () => void;
    cancelEditing: () => void;
}

export const useAnalysisEditingMode = create<AnalysisEditingModeState>((set) => ({
    isEditing: false,
    toggleEditing: () => set((state) => ({ isEditing: !state.isEditing })),
    cancelEditing: () => set({ isEditing: false }),
}));