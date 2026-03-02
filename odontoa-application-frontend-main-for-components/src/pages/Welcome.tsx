import { useAuth } from "@/auth/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Calendar,
  UserCheck,
  Award,
  Activity,
  UserPlus,
  X,
} from "lucide-react";
import { useGetPatients } from "@/hooks/patients/useGetPatients";
import { useGetDentists } from "@/hooks/dentists/useGetDentists";
import { useGetTodayAppointments } from "@/hooks/appointments/useGetTodayAppointments";
import { useGetAppointmentsByDentistID } from "@/hooks/appointments/useGetAppointmentsByDentistID";
import { useNavigate } from "react-router-dom";
import { useDefaultChair } from "@/hooks/useDefaultChair";
import { useTranslation } from "react-i18next";
import { translateTreatment, getDateFnsLocale } from "@/lib/utils";
import { differenceInDays, differenceInHours, startOfWeek, addDays, endOfWeek, format } from "date-fns";
import { BarChart, DonutChart } from "@/components/DashboardMockup-Standalone";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import type { Appointment } from "@/types/Appointment";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

type AppointmentsResponse = {
  data: Appointment[];
  totalElements: number;
  totalPages: number;
  pageSize: number;
  pageNumber: number;
};

export const Welcome = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAllAppointments, setShowAllAppointments] = useState(false);
  const { defaultChair } = useDefaultChair();

  // Fetch real data from backend
  const { data: patientsData } = useGetPatients({ page: 1 });
  const { data: dentistsData } = useGetDentists(1);
  const { data: todayAppointments } = useGetTodayAppointments();
  const { data: recentAppointments } = useGetAppointmentsByDentistID();

  // Fetch appointments for current week (bar chart)
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  
  const { data: weekAppointments } = useQuery<AppointmentsResponse, Error>({
    queryKey: ["weekAppointmentsForChart", weekStart, weekEnd],
    queryFn: async () => {
      const response = await api.get(`appointments?limit=1000`, {
        params: {
          startTime: weekStart.toISOString(),
          endTime: weekEnd.toISOString(),
        },
      });
      return response.data;
    },
  });

  // Calculate statistics from real data
  const totalPatients = patientsData?.totalElements || 0;
  const totalDentists = dentistsData?.totalElements || 0;
  const todayAppointmentsCount =
    todayAppointments?.data?.filter((apt) => apt.status !== "canceled")
      ?.length || 0;

  // Calculate average appointment duration (mock calculation since we don't have duration in API)
  // const averageDuration = "45min"; // This would need to be calculated from actual appointment data

  const stats = [
    {
      title: t("welcome.totalPatients"),
      value: totalPatients.toLocaleString(),
      change: "+12%", // This would need to be calculated from historical data
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: t("welcome.todayAppointments"),
      value: todayAppointmentsCount.toString(),
      change: "+5%", // This would need to be calculated from historical data
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: t("welcome.activeDentists"),
      value: totalDentists.toString(),
      change: "+8%", // This would need to be calculated from historical data
      icon: UserCheck,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    // {
    //   title: "Prosečno vreme",
    //   value: averageDuration,
    //   change: "-3%", // This would need to be calculated from historical data
    //   icon: Clock,
    //   color: "text-orange-600",
    //   bgColor: "bg-orange-50"
    // }
  ];

  const quickActions = [
    {
      title: t("welcome.newPatient"),
      description: t("welcome.newPatientDescription"),
      icon: UserPlus,
      color: "text-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100",
    },
    {
      title: t("welcome.scheduleAppointment"),
      description: t("welcome.scheduleAppointmentDescription"),
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50 hover:bg-green-100",
    },
    {
      title: t("welcome.viewPatients"),
      description: t("welcome.viewPatientsDescription"),
      icon: UserCheck,
      color: "text-orange-600",
      bgColor: "bg-orange-50 hover:bg-orange-100",
    },
  ];

  // Get today's appointments for display (excluding canceled)
  const todaysAppointments =
    todayAppointments?.data?.filter((apt) => apt.status !== "canceled") || [];

  // Calculate appointment counts by day for current week (Bar Chart)
  const barChartData = (() => {
    const appointments = weekAppointments?.data || [];
    const locale = getDateFnsLocale(i18n.language);
    
    // Generate day labels using date-fns format with locale
    const dayLabels = Array.from({ length: 7 }, (_, i) => {
      const dayDate = addDays(weekStart, i);
      // Use "EEEE" for full day name, or "EEE" for abbreviated
      return format(dayDate, "EEEE", { locale });
    });

    // Group appointments by day of week
    const appointmentsByDay = Array.from({ length: 7 }, () => 0);
    
    appointments.forEach((apt) => {
      const aptDate = new Date(apt.startTime);
      const dayOfWeek = aptDate.getDay();
      // Convert Sunday (0) to 6, and shift other days (Monday = 0)
      const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      appointmentsByDay[adjustedDay]++;
    });

    return dayLabels.map((label, index) => ({
      label,
      value: appointmentsByDay[index],
    }));
  })();

  // For Donut Chart: Today's appointments
  const donutChartData = (() => {
    const appointments = todayAppointments?.data || [];
    const scheduled = appointments.filter((apt) => apt.status === "scheduled").length;
    const completed = appointments.filter((apt) => apt.status === "completed").length;
    const canceled = appointments.filter((apt) => apt.status === "canceled").length;
    const inProgress = appointments.filter((apt) => apt.status === "in_progress").length;
    const noShow = appointments.filter((apt) => apt.status === "no_show").length;

    // Color consistency: Blue for scheduled, Green for completed, Red for cancelled
    const colors = {
      scheduled: "#2563eb", // blue
      completed: "#22c55e", // green
      canceled: "#ef4444", // red
      in_progress: "#3b82f6", // light blue
      no_show: "#f59e0b", // orange
    };

    return [
      { label: t("status.scheduled"), value: scheduled, color: colors.scheduled },
      { label: t("status.completed"), value: completed, color: colors.completed },
      { label: t("status.canceled"), value: canceled, color: colors.canceled },
      { label: t("status.inProgress"), value: inProgress, color: colors.in_progress },
      { label: t("appointments.didNotShow") || "Nije se pojavio", value: noShow, color: colors.no_show },
    ].filter((item) => item.value > 0); // Only show statuses with appointments
  })();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-2xl">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </div>
            <div>
              <p className="text-lg md:text-xl text-gray-500 mb-1">
                Dobrodošli
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Dr {user?.firstName || ""} {user?.lastName || ""}
              </h1>
            </div>
          </div>
        </div>

        {/* All 6 Cards Grid - Statistics and Quick Actions combined */}
        <div className="mb-8">
          {/* Statistics Grid - 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="shadow-lg border-0 bg-white hover:shadow-xl transition-shadow duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}
                    >
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions - 3 cards */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Activity className="h-6 w-6 text-blue-600" />
              {t("welcome.quickActions")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickActions.map((action, index) => {
                let onClick;
                if (action.title === t("welcome.newPatient")) {
                  onClick = () => navigate("/patients?add=true");
                } else if (action.title === t("welcome.scheduleAppointment")) {
                  onClick = () => navigate(`/appointments/create?chair=${defaultChair}`);
                } else if (action.title === t("welcome.viewPatients")) {
                  onClick = () => navigate("/patients");
                }
                return (
                  <Card
                    key={index}
                    className="shadow-lg border-0 bg-white hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
                    onClick={onClick}
                    tabIndex={0}
                    role="button"
                    aria-label={action.title}
                  >
                    <CardContent className="p-6">
                      <div
                        className={`h-12 w-12 rounded-lg ${action.bgColor} flex items-center justify-center mb-4 transition-colors duration-300`}
                      >
                        <action.icon className={`h-6 w-6 ${action.color}`} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {action.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Donut Chart */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                {t("welcome.todayAppointmentStatus")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                {donutChartData.length > 0 ? (
                  <DonutChart data={donutChartData} />
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    <p>{t("welcome.noData")}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bar Chart - Termini za ovu nedelju */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Termini za ovu nedelju
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {barChartData.length > 0 ? (
                  <BarChart data={barChartData} />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>{t("welcome.noData")}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Appointments */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                {t("welcome.todayAppointmentsTitle")} (
                {todaysAppointments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaysAppointments.length > 0 ? (
                  <>
                    {todaysAppointments.slice(0, 5).map((appointment) => {
                      const startTime = new Date(appointment.startTime);
                      const locale = i18n.language === "en" ? "en-US" : "sr-RS";
                      const timeString = startTime.toLocaleTimeString(locale, {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                      const patientInitials = `${appointment.patientMedicalCard.firstName.charAt(
                        0
                      )}${appointment.patientMedicalCard.lastName.charAt(0)}`;

                      // Color consistency: Blue for scheduled, Green for completed, Red for cancelled
                      const statusColorClass =
                        appointment.status === "completed"
                          ? "text-green-600"
                          : appointment.status === "in_progress"
                          ? "text-blue-600"
                          : appointment.status === "scheduled"
                          ? "text-blue-600"
                          : appointment.status === "canceled"
                          ? "text-red-600"
                          : "text-gray-600";

                      const bgColorClass =
                        appointment.status === "completed"
                          ? "bg-green-50/50"
                          : appointment.status === "scheduled"
                          ? "bg-blue-50/50"
                          : appointment.status === "canceled"
                          ? "bg-red-50/50"
                          : "bg-blue-50/50";

                      return (
                        <div
                          key={appointment.id}
                          className={`flex items-center gap-4 p-4 ${bgColorClass} rounded-lg`}
                        >
                          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                            {patientInitials}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {appointment.patientMedicalCard.firstName}{" "}
                              {appointment.patientMedicalCard.lastName}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {translateTreatment(appointment.dentalService, t)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {timeString}
                            </p>
                            <p className={`text-xs ${statusColorClass}`}>
                              {appointment.status === "completed"
                                ? t("status.completed")
                                : appointment.status === "in_progress"
                                ? t("status.inProgress")
                                : appointment.status === "scheduled"
                                ? t("status.scheduled")
                                : appointment.status === "canceled"
                                ? t("status.canceled")
                                : "Nije se pojavio"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    {todaysAppointments.length > 5 && (
                      <button
                        onClick={() => setShowAllAppointments(true)}
                        className="w-full py-2.5 px-3 text-base font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200/60 transition-colors mt-4"
                      >
                        Vidi sve termine za danas →
                      </button>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="italic">{t("welcome.noAppointments")}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                {t("welcome.recentActivity")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAppointments?.data?.length! > 0 ? (
                  recentAppointments?.data?.map((appointment) => {
                    const startTime = new Date(appointment.updatedAt);
                    const timeAgo = getTimeAgo(startTime, t);
                    const patientName = `${appointment.patientMedicalCard.firstName} ${appointment.patientMedicalCard.lastName}`;

                    // Color consistency: Blue for scheduled, Green for completed, Red for cancelled
                    const iconBgClass =
                      appointment.status === "completed"
                        ? "bg-green-100"
                        : appointment.status === "in_progress"
                        ? "bg-blue-100"
                        : appointment.status === "scheduled"
                        ? "bg-blue-100"
                        : appointment.status === "canceled"
                        ? "bg-red-100"
                        : "bg-gray-100";

                    const iconColorClass =
                      appointment.status === "completed"
                        ? "text-green-600"
                        : appointment.status === "in_progress"
                        ? "text-blue-600"
                        : appointment.status === "scheduled"
                        ? "text-blue-600"
                        : appointment.status === "canceled"
                        ? "text-red-600"
                        : "text-gray-600";

                    const activityText =
                      appointment.status === "completed"
                        ? t("welcome.treatmentCompleted")
                        : appointment.status === "in_progress"
                        ? t("welcome.treatmentInProgress")
                        : appointment.status === "scheduled"
                        ? t("welcome.appointmentScheduled")
                        : appointment.status === "canceled"
                        ? "Termin otkazan"
                        : t("welcome.activity");

                    return (
                      <div
                        key={appointment.id}
                        className="flex items-start gap-3 p-3 bg-gray-50/50 rounded-lg"
                      >
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${iconBgClass}`}
                        >
                          {appointment.status === "completed" ? (
                            <Award className={`h-4 w-4 ${iconColorClass}`} />
                          ) : appointment.status === "in_progress" ? (
                            <Activity className={`h-4 w-4 ${iconColorClass}`} />
                          ) : appointment.status === "canceled" ? (
                            <X className={`h-4 w-4 ${iconColorClass}`} />
                          ) : (
                            <Calendar className={`h-4 w-4 ${iconColorClass}`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {activityText}
                          </p>
                          <p className="text-xs text-gray-600">
                            {patientName} -{" "}
                            {translateTreatment(appointment.dentalService, t)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {timeAgo}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="italic">{t("welcome.noActivity")}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modal for all today's appointments */}
        <Dialog open={showAllAppointments} onOpenChange={setShowAllAppointments}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                {t("welcome.todayAppointmentsTitle")} ({todaysAppointments.length})
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-4">
              {todaysAppointments.map((appointment) => {
                const startTime = new Date(appointment.startTime);
                const locale = i18n.language === "en" ? "en-US" : "sr-RS";
                const timeString = startTime.toLocaleTimeString(locale, {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const patientInitials = `${appointment.patientMedicalCard.firstName.charAt(
                  0
                )}${appointment.patientMedicalCard.lastName.charAt(0)}`;

                // Color consistency: Blue for scheduled, Green for completed, Red for cancelled
                const statusColorClass =
                  appointment.status === "completed"
                    ? "text-green-600"
                    : appointment.status === "in_progress"
                    ? "text-blue-600"
                    : appointment.status === "scheduled"
                    ? "text-blue-600"
                    : appointment.status === "canceled"
                    ? "text-red-600"
                    : "text-gray-600";

                const bgColorClass =
                  appointment.status === "completed"
                    ? "bg-green-50/50"
                    : appointment.status === "scheduled"
                    ? "bg-blue-50/50"
                    : appointment.status === "canceled"
                    ? "bg-red-50/50"
                    : "bg-blue-50/50";

                return (
                  <div
                    key={appointment.id}
                    className={`flex items-center gap-4 p-4 ${bgColorClass} rounded-lg`}
                  >
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                      {patientInitials}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {appointment.patientMedicalCard.firstName}{" "}
                        {appointment.patientMedicalCard.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {translateTreatment(appointment.dentalService, t)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {timeString}
                      </p>
                      <p className={`text-xs ${statusColorClass}`}>
                        {appointment.status === "completed"
                          ? t("status.completed")
                          : appointment.status === "in_progress"
                          ? t("status.inProgress")
                          : appointment.status === "scheduled"
                          ? t("status.scheduled")
                          : appointment.status === "canceled"
                          ? t("status.canceled")
                          : "Nije se pojavio"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

// Helper function to calculate time ago using date-fns
function getTimeAgo(date: Date, t: (key: string) => string): string {
  const now = new Date();
  const diffInDays = differenceInDays(now, date);
  const diffInHours = differenceInHours(now, date);

  if (diffInDays > 0) {
    return `${t("welcome.ago")} ${diffInDays} ${
      diffInDays === 1 ? t("welcome.day") : t("welcome.days")
    }`;
  } else if (diffInHours > 0) {
    return `${t("welcome.ago")} ${diffInHours} ${
      diffInHours === 1 ? t("welcome.hour") : t("welcome.hours")
    }`;
  } else {
    return t("welcome.fewMinutesAgo");
  }
}
