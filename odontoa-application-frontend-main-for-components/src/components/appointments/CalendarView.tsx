import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "../ui/badge";
import { cn, getTreatmentTypeLabel } from "@/lib/utils";
import {
  addDays,
  format,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
} from "date-fns";
import { useTranslation } from "react-i18next";
import { getDateFnsLocale } from "@/lib/utils";
import { useGetAppointments } from "@/hooks/appointments/useGetAppointments";
import { AppointmentSettingsModal } from "./AppointmentSettingModal";
import { useAppointmentsView } from "@/hooks/store/useAppointmentsView";
import type { Appointment } from "@/types/Appointment";
import { useState } from "react";
import { useCurrentDate } from "@/hooks/store/useCurrentDate";

// Monthly View Component
const MonthlyView = ({
  currentDate,
  appointments,
  onNavigate,
  onDateClick
}: {
  currentDate: Date;
  appointments: Appointment[];
  onNavigate: (direction: "prev" | "next", viewType: "daily" | "weekly" | "monthly") => void;
  onDateClick: (date: Date) => void;
}) => {
  const { t, i18n } = useTranslation();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  // Get the start of the week that contains the first day of the month
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });

  // Get the end of the week that contains the last day of the month
  const endDate = addDays(startOfWeek(monthEnd, { weekStartsOn: 1 }), 6);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => isSameDay(new Date(apt.startTime), date) && apt.status !== "canceled");
  };

  const isCurrentMonth = (date: Date) => isSameMonth(date, currentDate);
  const isToday = (date: Date) => isSameDay(date, new Date());
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  };

  const weekDayNames = i18n.language === 'sr' 
    ? ["Pon", "Uto", "Sre", "Čet", "Pet", "Sub", "Ned"]
    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="space-y-4">
      {/* Navigation Header */}
      <div className="flex items-center justify-between bg-blue-50 rounded-lg border border-blue-200 p-6 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate("prev", "monthly")}
          className="h-10 w-10 p-0"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-center flex flex-col items-center gap-3">
          <h2 className="text-2xl font-bold text-blue-800">
            {format(currentDate, "MMMM yyyy", { locale: getDateFnsLocale(i18n.language) })}
          </h2>
          <p className="text-sm text-blue-600 font-medium">{t("appointments.monthlyView")}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate("next", "monthly")}
          className="h-10 w-10 p-0"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg border border-blue-200 overflow-hidden shadow-sm">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-0">
          {weekDayNames.map((day, index) => (
            <div
              key={day}
              className={cn(
                "p-4 border-r border-blue-200 last:border-r-0 text-center font-semibold text-sm",
                index >= 5 ? "bg-red-50 text-red-700" : "bg-blue-100 text-blue-700"
              )}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-0">
          {calendarDays.map((day) => {
            const dayAppointments = getAppointmentsForDate(day);
            const isCurrentMonthDay = isCurrentMonth(day);
            const isTodayDay = isToday(day);
            const isWeekendDay = isWeekend(day);

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "min-h-[140px] p-3 border-r border-b border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors relative",
                  !isCurrentMonthDay && "bg-blue-50 text-blue-400",
                  isTodayDay && "bg-blue-50 border-blue-300",
                  isWeekendDay && isCurrentMonthDay && "bg-red-50"
                )}
                onClick={() => onDateClick(day)}
              >
                {/* Date Number */}
                <div className={cn(
                  "text-sm font-medium mb-2 flex items-center justify-between",
                  isTodayDay && "text-blue-600 font-bold",
                  isWeekendDay && isCurrentMonthDay && "text-red-600"
                )}>
                  <span>{format(day, "d")}</span>
                  {dayAppointments.length > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      {dayAppointments.length}
                    </span>
                  )}
                </div>

                {/* Appointment Summary */}
                {dayAppointments.length > 0 && (
                  <div className="space-y-1">
                    {/* Total appointments count */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-blue-800">
                        {dayAppointments.length} {dayAppointments.length !== 1 ? t("appointments.appointments") : t("appointments.appointment")}
                      </span>
                    </div>

                    {/* Status breakdown */}
                    <div className="flex items-center gap-1 flex-wrap">
                      {dayAppointments.filter(apt => apt.status === 'scheduled').length > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          <span className="text-xs text-blue-700">
                            {dayAppointments.filter(apt => apt.status === 'scheduled').length}
                          </span>
                        </div>
                      )}
                      {dayAppointments.filter(apt => apt.status === 'in_progress').length > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="text-xs text-blue-700">
                            {dayAppointments.filter(apt => apt.status === 'in_progress').length}
                          </span>
                        </div>
                      )}
                      {dayAppointments.filter(apt => apt.status === 'completed').length > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-xs text-blue-700">
                            {dayAppointments.filter(apt => apt.status === 'completed').length}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Service type breakdown */}
                    <div className="flex items-center gap-1 flex-wrap">
                      {dayAppointments.filter(apt => getTreatmentTypeLabel(apt.dentalService).type === 'stomatoloski').length > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="text-xs text-blue-700">
                            {dayAppointments.filter(apt => getTreatmentTypeLabel(apt.dentalService).type === 'stomatoloski').length} stom.
                          </span>
                        </div>
                      )}
                      {dayAppointments.filter(apt => getTreatmentTypeLabel(apt.dentalService).type === 'ortodontski').length > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                          <span className="text-xs text-blue-700">
                            {dayAppointments.filter(apt => getTreatmentTypeLabel(apt.dentalService).type === 'ortodontski').length} ort.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Empty state */}
                {dayAppointments.length === 0 && isCurrentMonthDay && (
                  <div className="text-blue-300 text-xs text-center mt-2">
                    {t("appointments.noAppointments")}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="bg-white rounded-lg border border-blue-200 p-6 shadow-sm">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {appointments.length}
            </div>
            <div className="text-sm text-blue-600 font-medium">{t("appointments.totalAppointments")}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {appointments.filter(apt => apt.status === 'scheduled').length}
            </div>
            <div className="text-sm text-blue-600 font-medium">{t("appointments.scheduled")}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {appointments.filter(apt => apt.status === 'in_progress').length}
            </div>
            <div className="text-sm text-blue-600 font-medium">{t("appointments.inProgress")}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CalendarViewProps {
  chair: string;
}

export default function CalendarView({ chair }: CalendarViewProps) {
  const { t } = useTranslation();
  const { viewType, setViewType } = useAppointmentsView();
  const { currentDate, navigateDate, setCurrentDate } = useCurrentDate();
  const [selectedAppointment, setSelectedAppointment] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate date range based on view type
  const getDateRange = () => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);

    switch (viewType) {
      case "daily":
        return { start, end };
      case "weekly":
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const weekEnd = addDays(weekStart, 4);
        return { start: weekStart, end: weekEnd };
      case "monthly":
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        return { start: monthStart, end: monthEnd };
      default:
        return { start, end };
    }
  };

  const { start, end } = getDateRange();
  const { data: appointmentsResponse } = useGetAppointments(start, end, chair);
  const appointments = appointmentsResponse?.data || [];

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleDateClick = (date: Date) => {
    // Switch to daily view and set the clicked date
    setCurrentDate(date);
    setViewType('daily');
  };

  return (
    <div className="w-full space-y-6">
      <MonthlyView
        currentDate={currentDate}
        appointments={appointments}
        onNavigate={navigateDate}
        onDateClick={handleDateClick}
      />

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm flex-wrap justify-center p-4 bg-blue-50 rounded-lg border border-blue-200">
        <span className="text-blue-700 font-semibold">{t("appointments.status")}:</span>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-blue-700 font-medium">{t("appointments.completed")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-blue-700 font-medium">{t("appointments.inProgress")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-blue-700 font-medium">{t("appointments.scheduled")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-blue-700 font-medium">{t("appointments.canceled")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-500"></div>
          <span className="text-blue-700 font-medium">{t("appointments.didNotShow")}</span>
        </div>

        <span className="text-blue-700 font-semibold ml-4">{t("appointments.serviceTypes")}:</span>

        {/* Stomatološki usluge */}
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-xs">{t("treatmentTypes.dental")}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-100 border-2 border-green-300"></div>
          <span className="text-blue-700 font-medium">{t("dentalServices.examination")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-100 border-2 border-red-300"></div>
          <span className="text-blue-700 font-medium">{t("dentalServices.extraction")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-100 border-2 border-yellow-300"></div>
          <span className="text-blue-700 font-medium">{t("dentalServices.filling")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-100 border-2 border-orange-300"></div>
          <span className="text-blue-700 font-medium">{t("dentalServices.rootCanal")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-100 border-2 border-blue-300"></div>
          <span className="text-blue-700 font-medium">{t("dentalServices.cleaning")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-indigo-100 border-2 border-indigo-300"></div>
          <span className="text-blue-700 font-medium">{t("dentalServices.prosthetics")}</span>
        </div>

        {/* Ortodontski usluge */}
        <div className="flex items-center gap-2">
          <Badge className="bg-purple-100 text-purple-800 border-purple-300 text-xs">{t("treatmentTypes.orthodontic")}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-purple-100 border-2 border-purple-300"></div>
          <span className="text-blue-700 font-medium">{t("dentalServices.orthoExamination")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-pink-100 border-2 border-pink-300"></div>
          <span className="text-blue-700 font-medium">{t("dentalServices.applianceInstallation")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-teal-100 border-2 border-teal-300"></div>
          <span className="text-blue-700 font-medium">{t("dentalServices.control")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-cyan-100 border-2 border-cyan-300"></div>
          <span className="text-blue-700 font-medium">{t("dentalServices.wireChange")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-100 border-2 border-emerald-300"></div>
          <span className="text-blue-700 font-medium">{t("dentalServices.retention")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-violet-100 border-2 border-violet-300"></div>
          <span className="text-blue-700 font-medium">{t("dentalServices.impression")}</span>
        </div>

        <span className="text-blue-700 font-semibold ml-4">{t("appointments.monthlyView")}:</span>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-blue-700 font-medium">{t("treatmentTypes.dental")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span className="text-blue-700 font-medium">{t("treatmentTypes.orthodontic")}</span>
        </div>
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <AppointmentSettingsModal
          appointmentId={selectedAppointment}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}