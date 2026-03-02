import { create } from 'zustand';
import { addWeeks, subWeeks, addDays, subDays, addMonths, subMonths } from 'date-fns';

interface CurrentDateState {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  navigateDate: (direction: 'prev' | 'next', viewType: 'daily' | 'weekly' | 'monthly') => void;
  navigateWeek: (direction: 'prev' | 'next') => void;
  navigateDay: (direction: 'prev' | 'next') => void;
  navigateMonth: (direction: 'prev' | 'next') => void;
  goToToday: () => void;
}

export const useCurrentDate = create<CurrentDateState>((set, get) => ({
  currentDate: new Date(),
  
  setCurrentDate: (date: Date) => set({ currentDate: date }),
  
  navigateDate: (direction: 'prev' | 'next', viewType: 'daily' | 'weekly' | 'monthly') => {
    const { currentDate } = get();
    let newDate: Date;
    
    switch (viewType) {
      case 'daily':
        newDate = direction === 'prev' ? subDays(currentDate, 1) : addDays(currentDate, 1);
        break;
      case 'weekly':
        newDate = direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1);
        break;
      case 'monthly':
        newDate = direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1);
        break;
      default:
        newDate = currentDate;
    }
    
    set({ currentDate: newDate });
  },
  
  navigateWeek: (direction: 'prev' | 'next') => {
    const { currentDate } = get();
    const newDate = direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1);
    set({ currentDate: newDate });
  },
  
  navigateDay: (direction: 'prev' | 'next') => {
    const { currentDate } = get();
    const newDate = direction === 'prev' ? subDays(currentDate, 1) : addDays(currentDate, 1);
    set({ currentDate: newDate });
  },
  
  navigateMonth: (direction: 'prev' | 'next') => {
    const { currentDate } = get();
    const newDate = direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1);
    set({ currentDate: newDate });
  },
  
  goToToday: () => set({ currentDate: new Date() }),
})); 