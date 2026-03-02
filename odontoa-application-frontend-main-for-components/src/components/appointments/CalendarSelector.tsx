import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { getDateFnsLocale } from "@/lib/utils";

type CalendarSelectorProps = {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
};

export default function CalendarSelector({ selectedDate, onDateChange }: CalendarSelectorProps) {
  const { t, i18n } = useTranslation();
  const today = new Date();
  
  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const formattedDate = format(selectedDate, "MMMM yyyy", { locale: getDateFnsLocale(i18n.language) });

  // Generisanje datuma za prikaz sedmice
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - date.getDay() + i);
    return date;
  });

  const weekDayNames = i18n.language === 'sr' 
    ? ['Ned', 'Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <button 
            onClick={() => navigateDay('prev')}
            className="p-2 rounded-full hover:bg-gray-100 mr-1"
            title={t("appointments.previousDay")}
          >
            <ChevronLeft size={18} />
          </button>
          <h2 className="text-lg font-medium">{formattedDate}</h2>
          <button 
            onClick={() => navigateDay('next')}
            className="p-2 rounded-full hover:bg-gray-100 ml-1"
            title={t("appointments.nextDay")}
          >
            <ChevronRight size={18} />
          </button>
        </div>
        
        <button 
          onClick={goToToday}
          className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-md hover:bg-primary/20"
        >
          {t("appointments.today")}
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center">
        {weekDayNames.map((day) => (
          <div key={day} className="text-xs font-medium text-gray-500 pb-1">
            {day}
          </div>
        ))}
        
        {weekDates.map((date) => {
          const isSelected = date.toDateString() === selectedDate.toDateString();
          const isToday = date.toDateString() === today.toDateString();
          
          return (
            <button 
              key={date.toISOString()}
              onClick={() => onDateChange(new Date(date))}
              className={`
                py-2 rounded-full text-sm
                ${isSelected ? 'bg-primary text-white' : ''}
                ${isToday && !isSelected ? 'bg-primary/10 text-primary' : ''}
                ${!isSelected && !isToday ? 'hover:bg-gray-100' : ''}
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
} 