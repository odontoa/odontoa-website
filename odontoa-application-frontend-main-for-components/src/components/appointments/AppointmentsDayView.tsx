import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAppointments } from "@/hooks/appointments/useGetAppointments";
import { Badge } from "../ui/badge";
import { Button } from "../ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { calculateAppointmentRowSpan, cn, formatTime, getAppointmentStyle, getTimeSlotFromISO, getStatusDotColor, getTreatmentTypeLabel, timeSlots, translateTreatment } from "@/lib/utils";
import { endOfDay, format, isSameDay, startOfDay, isToday } from "date-fns";
import { useTranslation } from "react-i18next";
import { getDateFnsLocale } from "@/lib/utils";
import { AppointmentSettingsModal } from "./AppointmentSettingModal";
import { useCurrentDate } from "@/hooks/store/useCurrentDate";

interface AppointmentsDayViewProps {
    chair: string;
}

export const AppointmentsDayView = ({ chair }: AppointmentsDayViewProps) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [selectedAppointment, setSelectedAppointment] = useState<number | null>(
        null
    );
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { currentDate, navigateDate, goToToday } = useCurrentDate();



    const { data: appointments } = useGetAppointments(startOfDay(currentDate), endOfDay(currentDate), chair);


    const dayAppointments = appointments?.data?.filter(apt =>
        isSameDay(new Date(apt.startTime), currentDate) && apt.status !== "canceled"
    ) || [];

    const handleAppointmentClick = (appointmentId: number) => {
        setSelectedAppointment(appointmentId);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedAppointment(null);
    };

    const handleTimelineBoxClick = (time: string) => {
        // For daily view, we use the current date
        const date = new Date(currentDate);
        date.setHours(0, 0, 0, 0);

        // Navigate to create appointment page with pre-filled data
        const params = new URLSearchParams({
            date: date.toISOString(),
            time: time,
            chair: chair
        });

        navigate(`/appointments/create?${params.toString()}`);
    };

    return (
        <div className="space-y-6">
            {/* Navigation Header */}
            <div className="flex items-start justify-between bg-blue-50 rounded-lg border border-blue-200 p-6 mb-6">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateDate("prev", "daily")}
                    className="h-10 w-10 p-0"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="text-center flex flex-col items-center gap-3">
                    <h2 className="text-2xl font-bold text-blue-800">
                        {format(currentDate, "PPP", { locale: getDateFnsLocale(i18n.language) })}
                    </h2>
                    <p className="text-sm text-blue-600 font-medium">
                        {format(currentDate, "EEEE", { locale: getDateFnsLocale(i18n.language) })}
                    </p>
                    {!isToday(currentDate) && (
                        <Button
                            variant="secondary"
                            size="sm"
                            className="mt-2 px-4 py-2 text-sm font-medium"
                            onClick={goToToday}
                        >
                            {t("appointments.today")}
                        </Button>
                    )}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateDate("next", "daily")}
                    className="h-10 w-10 p-0"
                >
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>

            {/* Day Grid */}
            <div className="grid grid-cols-[100px_1fr] gap-0 border border-blue-200 rounded-lg overflow-hidden shadow-sm">
                {/* Time Column */}
                <div className="bg-blue-100">
                    <div className="h-16 border-b border-r border-blue-200 flex items-center justify-center font-semibold text-sm text-blue-700">
                        {t("appointments.time")}
                    </div>
                    {timeSlots.map((time) => (
                        <div key={time} className="h-16 border-b border-r border-blue-200 flex items-center justify-center text-sm text-blue-600 font-medium">
                            {time}
                        </div>
                    ))}
                </div>

                {/* Appointments Column */}
                <div className="relative">
                    <div className="h-16 border-b border-blue-200 bg-blue-100 flex flex-col items-center justify-center">
                        <div className="font-semibold text-sm text-blue-800">{t("appointments.today")}</div>
                        <div className="text-xs text-blue-600 font-medium">
                            {format(currentDate, "d.M", { locale: getDateFnsLocale(i18n.language) })}
                        </div>
                    </div>

                    {/* Time slot backgrounds */}
                    {timeSlots.map((time) => (
                        <div
                            key={time}
                            className="h-16 border-b border-blue-200 relative hover:bg-blue-50 transition-colors cursor-pointer"
                            onClick={() => handleTimelineBoxClick(time)}
                        >
                        </div>
                    ))}

                    {/* Appointments as absolutely positioned elements */}
                    {dayAppointments.map((appointment) => {
                        const timeSlotIndex = getTimeSlotFromISO(appointment.startTime);
                        const rowSpan = calculateAppointmentRowSpan(
                            appointment.startTime,
                            appointment.endTime
                        );

                        // Calculate position
                        const topPosition = `calc(${timeSlotIndex} * 64px + 64px)`;
                        const height = `calc(${rowSpan} * 64px - 4px)`;

                        return (
                            <div
                                key={appointment.id}
                                className={`absolute left-1 right-1 rounded-md border-2 p-1 text-xs cursor-pointer transition-all duration-200 hover:shadow-lg flex flex-col justify-start ${getAppointmentStyle(
                                    appointment.dentalService,
                                    appointment.status
                                )}`}
                                style={{
                                    top: topPosition,
                                    height: height,
                                    zIndex: 10,
                                }}
                                onClick={() => handleAppointmentClick(appointment.id)}
                            >
                                {/* Status dot and time */}
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-1">
                                        <div className={cn("w-2 h-2 rounded-full", getStatusDotColor(appointment.status))}></div>
                                        <Badge className={cn("text-xs font-medium", getTreatmentTypeLabel(appointment.dentalService).color)}>
                                            {getTreatmentTypeLabel(appointment.dentalService).label}
                                        </Badge>
                                    </div>
                                    <span className="text-xs font-medium text-blue-600">
                                        {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                                    </span>
                                </div>
                                
                                {/* Patient name - main content */}
                                <div className="font-semibold text-sm text-blue-800 truncate">
                                    {appointment.patientMedicalCard.firstName}{" "}
                                    {appointment.patientMedicalCard.lastName}
                                </div>
                                
                                {/* Treatment type - only if there's space */}
                                {rowSpan > 1 && (
                                    <div className="text-xs opacity-80 truncate">
                                        {translateTreatment(appointment.dentalService, t)}
                                    </div>
                                )}
                                
                                {/* Doctor name - only if there's space */}
                                {rowSpan > 2 && (
                                    <div className="text-xs opacity-75 truncate">
                                        Dr {appointment.dentist.firstName}{" "}
                                        {appointment.dentist.lastName}
                                    </div>
                                )}
                            </div>
                        );
                    })} 
                </div>
            </div>

            {/* Summary */}
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-600">
                        {t("appointments.totalAppointmentsToday")}: <span className="font-semibold text-slate-800">{dayAppointments.length}</span>
                    </div>
                    <div className="text-sm text-slate-600 font-medium">
                        {format(currentDate, "d. MMMM yyyy", { locale: getDateFnsLocale(i18n.language) })}
                    </div>
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
};