import { create } from 'zustand';

type ViewType = 'daily' | 'weekly' | 'monthly';

interface ViewState {
  viewType: ViewType;
  setViewType: (viewType: ViewType) => void;
}

export const useAppointmentsView = create<ViewState>((set, _) => ({
  viewType: 'weekly',
  setViewType: (viewType: ViewType) => set({ viewType }),
}));
