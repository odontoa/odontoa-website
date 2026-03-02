import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, Clock, Calendar, Users } from "lucide-react";
import { AppointmentSettingsModal } from "./AppointmentSettingModal";
import { Badge } from "../ui/badge";
import { calculateAppointmentRowSpan, cn, formatTime, getAppointmentStyle, getTimeSlotFromISO, getStatusDotColor, getTreatmentTypeLabel, getWeekday, getWeekRange, timeSlots, translateTreatment } from "@/lib/utils";
import { addDays, format, isThisWeek } from "date-fns";
import { useTranslation } from "react-i18next";
import { getDateFnsLocale } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useGetAppointments } from "@/hooks/appointments/useGetAppointments";
import { useWeekDays } from "@/hooks/appointments/useGetWeekDays";
import { ExportAppointmentsModal } from "./ExportAppointmentsModal";
import type { Appointment } from "@/types/Appointment";
import { useAppointmentsView } from "@/hooks/store/useAppointmentsView";
import { useCurrentDate } from "@/hooks/store/useCurrentDate";
import { AppointmentsDayView } from "./AppointmentsDayView";
import CalendarView from "./CalendarView";
import { ChairSwitcher } from "./ChairSwitcher";
import { useDefaultChair } from "@/hooks/useDefaultChair";

// ViewTypeSelector component to avoid TypeScript narrowing issues
const ViewTypeSelector = ({
  viewType,
  setViewType,
  includeWeekend,
  setIncludeWeekend
}: {
  viewType: string;
  setViewType: (type: 'daily' | 'weekly' | 'monthly') => void;
  includeWeekend: boolean;
  setIncludeWeekend: (include: boolean) => void;
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 bg-blue-50 rounded-lg border border-blue-200 p-1.5">
        <Button
          variant={viewType === "daily" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewType("daily")}
          className={cn("flex items-center gap-2 px-3 py-1.5 text-sm font-medium hover:bg-blue-600 hover:text-white", viewType === "daily" && "bg-blue-600 hover:bg-blue-700")}
        >
          <Clock className="h-4 w-4" />
          {t("appointments.daily")}
        </Button>
        <Button
          variant={viewType === "weekly" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewType("weekly")}
          className={cn("flex items-center gap-2 px-3 py-1.5 text-sm font-medium hover:bg-blue-600 hover:text-white", viewType === "weekly" && "bg-blue-600 hover:bg-blue-700")}
        >
          <Calendar className="h-4 w-4" />
          {t("appointments.weekly")}
        </Button>
        <Button
          variant={viewType === "monthly" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewType("monthly")}
          className={cn("flex items-center gap-2 px-3 py-1.5 text-sm font-medium hover:bg-blue-600 hover:text-white", viewType === "monthly" && "bg-blue-600 hover:bg-blue-700")}
        >
          <Users className="h-4 w-4" />
          {t("appointments.monthly")}
        </Button>
      </div>

      {/* Weekend Toggle */}
      {viewType === "weekly" && (
        <div className="flex items-center gap-2 bg-green-50 rounded-lg border border-green-200 p-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeWeekend}
              onChange={(e) => setIncludeWeekend(e.target.checked)}
              className="w-4 h-4 text-green-600 bg-white border-green-300 rounded focus:ring-green-500 focus:ring-2"
            />
            <span className="text-sm font-medium text-green-700">{t("appointments.includeWeekend")}</span>
          </label>
        </div>
      )}
    </div>
  );
};

// Helper to render day cards for a given chair
function renderDayCardsForChair(
  dayNames: string[],
  dates: string[],
  appts: { data?: Appointment[] } | undefined,
  getWeekday: (isoString: string) => number,
  getAppointmentStyle: (dentalService: string, status: string) => string,
  handleAppointmentClick: (appointmentId: number) => void,
  formatTime: (isoString: string) => string,
  navigate: (path: string) => void,
  addDays: (date: Date, amount: number) => Date,
  weekRange: { start: Date; end: Date },
  chair: string,
  t: (key: string) => string
) {
  return dayNames.map((day, dayIndex) => {
    const dayAppointments = appts?.data?.filter(a => getWeekday(a.startTime) === dayIndex && a.status !== "canceled") || [];
    // Sort appointments by startTime to display them chronologically
    dayAppointments.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    
    return (
      <div key={day} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {/* Day Header */}
        <div className="bg-blue-50 p-4 border-b border-blue-200 flex items-center justify-between">
          <div>
            <div className="font-semibold text-blue-800">{day}</div>
            <div className="text-xs text-blue-500">{dates[dayIndex]}</div>
          </div>
          <div className="text-xs text-blue-600 font-medium">
            {dayAppointments.length} {dayAppointments.length !== 1 ? t("appointments.appointments") : t("appointments.appointment")}
          </div>
        </div>
        {/* Appointments for this day */}
        <div className="p-4 space-y-3">
          {dayAppointments.length > 0 ? (
            dayAppointments.map(appointment => (
              <div
                key={appointment.id}
                className={`p-4 rounded-md border-2 cursor-pointer transition-all duration-200 hover:shadow-md flex flex-col gap-1 ${getAppointmentStyle(appointment.dentalService, appointment.status)}`}
                onClick={() => handleAppointmentClick(appointment.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <div className={cn("w-2 h-2 rounded-full", getStatusDotColor(appointment.status))}></div>
                    <Badge className={cn("text-xs font-medium", getTreatmentTypeLabel(appointment.dentalService).color)}>
                      {getTreatmentTypeLabel(appointment.dentalService).label}
                    </Badge>
                  </div>
                  <span className="text-xs font-medium whitespace-nowrap text-blue-600">
                    {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                  </span>
                </div>
                <div className="font-semibold truncate mb-1 text-blue-800">
                  {appointment.patientMedicalCard.firstName} {appointment.patientMedicalCard.lastName}
                </div>
                <div className="text-xs font-medium opacity-80 truncate mb-1">
                  {translateTreatment(appointment.dentalService, t)}
                </div>
                <div className="text-xs opacity-75 truncate">
                  Dr {appointment.dentist.firstName} {appointment.dentist.lastName}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-blue-400">
              {t("appointments.noScheduledAppointments")}
            </div>
          )}
        </div>
        {/* Add appointment button for this day */}
        <div className="p-4 border-t border-blue-100">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              const clickedDate = addDays(weekRange.start, dayIndex);
              
              // Navigate to create appointment page with pre-filled data
              const params = new URLSearchParams({
                date: clickedDate.toISOString(),
                time: "09:00",
                chair: chair
              });
              
              navigate(`/appointments/create?${params.toString()}`);
            }}
          >
            + {t("appointments.addAppointment")}
          </Button>
        </div>
      </div>
    );
  });
}

export default function Component() {
  const { t, i18n } = useTranslation();
  const { defaultChair } = useDefaultChair();
  const [chair, setChair] = useState(defaultChair);
  const [includeWeekend, setIncludeWeekend] = useState(false);

  // Update chair when default changes
  useEffect(() => {
    setChair(defaultChair);
  }, [defaultChair]);

  // Notify parent of chair changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('chairChanged', { detail: chair }));
    }
  }, [chair]);

  const { viewType, setViewType } = useAppointmentsView();
  const { currentDate, navigateWeek, goToToday } = useCurrentDate();

  const weekRange = getWeekRange(currentDate, includeWeekend);

  const navigate = useNavigate();
  const [selectedAppointment, setSelectedAppointment] = useState<number | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);


  // Export modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const { data: appts } = useGetAppointments(
    weekRange.start,
    weekRange.end,
    chair
  );

  const handleAppointmentClick = (appointmentId: number) => {
    setSelectedAppointment(appointmentId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  // New function to handle timeline box clicks
  const handleTimelineBoxClick = (dayIndex: number, time: string) => {
    // Calculate the date for the clicked day
    const clickedDate = addDays(weekRange.start, dayIndex);

    // Navigate to create appointment page with pre-filled data
    const params = new URLSearchParams({
      date: clickedDate.toISOString(),
      time: time,
      chair: chair
    });
    
    navigate(`/appointments/create?${params.toString()}`);
  };

  // Get week days - always call the hook but with appropriate parameters
  const { dayNames, dates } = useWeekDays(currentDate, viewType === "weekly" ? includeWeekend : false);

  // Only show week-related content when in weekly view
  const shouldShowWeekContent = viewType === "weekly";

  return (
    <div className="w-full space-y-6">
      {viewType === "daily" && (
        <Card>
          <CardHeader className="pb-6">
            <div className="flex flex-col sm:flex-row gap-6 items-center justify-between">
              <ChairSwitcher chair={chair} setChair={setChair} />
              <ViewTypeSelector
                viewType={viewType}
                setViewType={setViewType}
                includeWeekend={includeWeekend}
                setIncludeWeekend={setIncludeWeekend}
              />
            </div>
          </CardHeader>
          <CardContent className="p-2 md:p-6">
            <AppointmentsDayView chair={chair} />
          </CardContent>
        </Card>
      )}
      {viewType === "weekly" && (
        <div className="hidden lg:block">
          <Card>
            <CardHeader className="pb-6">
              <div className="flex flex-col sm:flex-row gap-6 items-center justify-between">
                <ChairSwitcher chair={chair} setChair={setChair} />
                <ViewTypeSelector
                  viewType={viewType}
                  setViewType={setViewType}
                  includeWeekend={includeWeekend}
                  setIncludeWeekend={setIncludeWeekend}
                />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Navigation Header */}
              <div className="flex items-start justify-between bg-blue-50 rounded-lg border border-blue-200 p-6 mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateWeek("prev")}
                  className="h-10 w-10 p-0"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="text-center flex flex-col items-center gap-3">
                  <h2 className="text-2xl font-bold text-blue-800">
                    {format(weekRange.start, "PPP", { locale: getDateFnsLocale(i18n.language) })} - {format(weekRange.end, "PPP", { locale: getDateFnsLocale(i18n.language) })}
                  </h2>
                  <p className="text-sm text-blue-600 font-medium">
                    {includeWeekend ? t("appointments.weekWithWeekend") : t("appointments.workingWeek")}
                  </p>
                  {!(isThisWeek(currentDate, { weekStartsOn: 1 })) && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mt-2 px-4 py-2 text-sm font-medium"
                      onClick={() => goToToday()}
                    >
                      {t("appointments.thisWeek")}
                    </Button>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateWeek("next")}
                  className="h-10 w-10 p-0"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
              <div className="relative">
                <div className={`grid ${includeWeekend ? 'grid-cols-8' : 'grid-cols-6'} gap-0 border border-blue-200 rounded-lg overflow-hidden shadow-sm`}>
                  {/* Header Row */}
                  <div className="bg-blue-100 p-4 border-r border-blue-200 font-semibold text-sm text-blue-700">
                    {t("appointments.time")}
                  </div>
                  {dayNames.map((day, index) => (
                    <div
                      key={day}
                      className="bg-blue-100 p-4 border-r border-blue-200 last:border-r-0 text-center"
                    >
                      <div className="font-semibold text-sm text-blue-800">{day}</div>
                      <div className="text-xs text-blue-600 mt-1 font-medium">
                        {dates[index]}
                      </div>
                    </div>
                  ))}

                  {/* Time Slots */}
                  {timeSlots.map((time, timeIndex) => (
                    <div key={time} className="contents">
                      {/* Time Label */}
                      <div className="bg-blue-50 h-[60px] p-3 border-r border-t border-blue-200 text-sm font-semibold text-blue-700">
                        {time}
                      </div>

                      {/* Day Columns */}
                      {dayNames.map((_, dayIndex) => (
                        <div
                          key={`${timeIndex}-${dayIndex}`}
                          className="relative border-t border-r border-blue-200 last:border-r-0 h-[60px] p-1 hover:bg-blue-50 cursor-pointer transition-colors"
                          onClick={() => handleTimelineBoxClick(dayIndex, time)}
                        ></div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Appointments as absolutely positioned elements */}
                {appts?.data.filter(a => a.chair?.toString() === chair && a.status !== "canceled").map((appointment) => {
                  const dayIndex = getWeekday(appointment.startTime);
                  const timeSlotIndex = getTimeSlotFromISO(appointment.startTime);
                  const rowSpan = calculateAppointmentRowSpan(
                    appointment.startTime,
                    appointment.endTime
                  );

                  // Calculate position based on whether weekend is included
                  const columnWidth = includeWeekend ? 100 / 8 : 100 / 6;
                  const leftPosition = `calc(${(dayIndex + 1) * columnWidth}%)`;
                  const topPosition = `calc(${timeSlotIndex} * 60px + 73px)`;
                  const width = `calc(${columnWidth}% - 2px)`;
                  const height = `calc(${rowSpan} * 60px)`;

                  return (
                    <div
                      key={appointment.id}
                      className={`absolute rounded-md border p-1.5 text-xs cursor-pointer transition-colors overflow-hidden ${getAppointmentStyle(
                        appointment.dentalService, 
                        appointment.status
                      )}`}
                      style={{
                        left: leftPosition,
                        top: topPosition,
                        width: width,
                        height: height,
                        zIndex: 10,
                      }}
                      onClick={() => handleAppointmentClick(appointment.id)}
                    >
                      {/* Header with time and status */}
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold text-blue-700">
                          {formatTime(appointment.startTime)}
                        </span>
                        <div className="flex items-center">
                          <div className={cn("w-1.5 h-1.5 rounded-full", getStatusDotColor(appointment.status))}></div>
                        </div>
                      </div>
                      
                      {/* Patient name */}
                      <div className="font-semibold text-xs mb-0.5 truncate leading-tight text-gray-800">
                        {appointment.patientMedicalCard.firstName} {appointment.patientMedicalCard.lastName}
                      </div>
                      
                      {/* Service */}
                      <div className="text-xs opacity-75 truncate leading-tight">
                        {translateTreatment(appointment.dentalService, t)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-6 mt-6 text-sm flex-wrap p-4 bg-blue-50 rounded-lg border border-blue-200">
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
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {viewType === "monthly" && (
        <Card>
          <CardHeader className="pb-6">
            <div className="flex flex-col sm:flex-row gap-6 items-center justify-between">
              <ChairSwitcher chair={chair} setChair={setChair} />
              <ViewTypeSelector
                viewType={viewType}
                setViewType={setViewType}
                includeWeekend={includeWeekend}
                setIncludeWeekend={setIncludeWeekend}
              />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <CalendarView chair={chair} />
          </CardContent>
        </Card>
      )}

      {/* Mobile Timeline View (no Card wrapper) */}
      <div className="lg:hidden space-y-6 mt-6 px-4 pb-8">
        <div className="flex items-center justify-between mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <ChairSwitcher chair={chair} setChair={setChair} />
        </div>
        {/* Week navigation for mobile */}
        <div className="flex items-center justify-center gap-3 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <Button
            size="icon"
            variant="outline"
            onClick={() => navigateWeek("prev")}
            className="h-10 w-10 p-0 flex items-center justify-center"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="text-sm font-semibold px-4 text-blue-700">
            {format(weekRange.start, "PPP", { locale: getDateFnsLocale(i18n.language) })} - {format(weekRange.end, "PPP", { locale: getDateFnsLocale(i18n.language) })}
          </span>
          <Button
            size="icon"
            variant="outline"
            onClick={() => navigateWeek("next")}
            className="h-10 w-10 p-0 flex items-center justify-center"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Weekend toggle for mobile */}
        {shouldShowWeekContent && (
          <div className="flex items-center justify-center mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeWeekend}
                onChange={(e) => setIncludeWeekend(e.target.checked)}
                className="w-4 h-4 text-green-600 bg-white border-green-300 rounded focus:ring-green-500 focus:ring-2"
              />
              <span className="text-sm font-medium text-green-700">{t("appointments.includeWeekend")}</span>
            </label>
          </div>
        )}

        {/* Mobile timeline view only for weekly view */}
        {shouldShowWeekContent && renderDayCardsForChair(dayNames, dates, appts, getWeekday, getAppointmentStyle, handleAppointmentClick, formatTime, navigate, addDays, weekRange, chair, t)}
      </div>

      {
        selectedAppointment && (
          <AppointmentSettingsModal
            appointmentId={selectedAppointment}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        )
      }


      {/* Export Modal */}
      <ExportAppointmentsModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div >
  );
}

