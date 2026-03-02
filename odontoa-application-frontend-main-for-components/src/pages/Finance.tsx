import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/Button";
import { useGetFinancialData } from "@/hooks/appointments/useGetFinancialData";
import { useAuth } from "@/auth/AuthProvider";
import { useGetClinicById } from "@/hooks/clinics/useGetClinicById";
import { useGetDentists } from "@/hooks/dentists/useGetDentists";
import { PatientSelector } from "@/components/patients/PatientSelector";
import { DollarSign, Calendar, Users, FileText, TrendingUp, Download, ChevronDown, ChevronUp, Filter } from "lucide-react";
import { formatCurrency, translateTreatment, formatTime } from "@/lib/utils";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { getDateFnsLocale } from "@/lib/utils";
import * as XLSX from "xlsx";
import type { Appointment } from "@/types/Appointment";

type PeriodOption = "15" | "30" | "90" | "month" | "custom" | "all";

export const FinancePage = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { data: clinic } = useGetClinicById();
  const { data: dentists } = useGetDentists();
  
  const [period, setPeriod] = useState<PeriodOption>("30");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedDentistId, setSelectedDentistId] = useState<string>("all");
  const [selectedChair, setSelectedChair] = useState<string>("all");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>("all");
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [isFiltersExpanded, setIsFiltersExpanded] = useState<boolean>(false);

  // Calculate date range based on period
  const calculateDateRange = (selectedPeriod: PeriodOption) => {
    const today = new Date();
    let end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    let start = new Date();

    switch (selectedPeriod) {
      case "all":
        // All time - set start to a very old date (e.g., 10 years ago)
        start = new Date(2010, 0, 1);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case "15":
        start = new Date(today);
        start.setDate(today.getDate() - 15);
        break;
      case "30":
        start = new Date(today);
        start.setDate(today.getDate() - 30);
        break;
      case "90":
        start = new Date(today);
        start.setDate(today.getDate() - 90);
        break;
      case "month":
        // First day of selected month
        start = new Date(selectedYear, selectedMonth, 1);
        // Last day of selected month
        end = new Date(selectedYear, selectedMonth + 1, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case "custom":
        // Use custom dates if set
        if (startDate && endDate) {
          start = new Date(startDate);
          end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
        } else {
          // Default to last 30 days if custom but no dates set
          start = new Date(today);
          start.setDate(today.getDate() - 30);
        }
        break;
    }

    if (selectedPeriod !== "all") {
      start.setHours(0, 0, 0, 0);
    }
    return { start, end };
  };

  // Set default dates on mount and when period changes
  useEffect(() => {
    if (period === "all") {
      // For "all time", set dates to empty or a wide range
      const { start, end } = calculateDateRange(period);
      setStartDate(format(start, "yyyy-MM-dd"));
      setEndDate(format(end, "yyyy-MM-dd"));
    } else if (period !== "custom" && period !== "month") {
      const { start, end } = calculateDateRange(period);
      setStartDate(format(start, "yyyy-MM-dd"));
      setEndDate(format(end, "yyyy-MM-dd"));
    } else if (period === "month") {
      const { start, end } = calculateDateRange(period);
      setStartDate(format(start, "yyyy-MM-dd"));
      setEndDate(format(end, "yyyy-MM-dd"));
    }
  }, [period, selectedMonth, selectedYear]);

  // Get date range for query
  const getDateRange = () => {
    if (period === "custom" && startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    if (period === "month") {
      return calculateDateRange(period);
    }
    return calculateDateRange(period);
  };

  // Generate month options
  const getMonthOptions = () => {
    const months = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(2000, i, 1);
      const monthName = format(date, "MMMM", { locale: getDateFnsLocale(i18n.language) });
      // Capitalize first letter
      const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase();
      months.push({
        value: i,
        label: capitalizedMonth
      });
    }
    return months;
  };

  // Generate year options (current year ± 5 years)
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 1; i++) {
      years.push(i);
    }
    return years.reverse();
  };

  const { start, end } = getDateRange();

  // Determine dentist ID to filter by
  const dentistIdForQuery = 
    user?.role === "ADMIN"
      ? (selectedDentistId !== "all" ? parseInt(selectedDentistId) : undefined)
      : user?.sub; // For non-admin, use their own ID

  // Determine patient ID to filter by
  const patientIdForQuery = selectedPatientId && selectedPatientId !== "all" ? parseInt(selectedPatientId) : undefined;

  // Determine chair to filter by
  const chairForQuery = 
    user?.role === "ADMIN" && selectedChair !== "all"
      ? parseInt(selectedChair)
      : undefined;

  const { data: appointmentsData, isLoading } = useGetFinancialData({
    startDate: start,
    endDate: end,
    dentistId: dentistIdForQuery,
    patientId: patientIdForQuery,
    chair: chairForQuery,
  });

  const appointments = appointmentsData?.data || [];

  // Calculate total earnings
  const calculateTotalEarnings = () => {
    return appointments.reduce((total, appointment) => {
      const appointmentTotal = appointment.therapyRecords?.reduce((sum, therapy) => {
        return sum + (therapy.price ? parseFloat(therapy.price.toString()) : 0);
      }, 0) || 0;
      return total + appointmentTotal;
    }, 0);
  };

  const totalEarnings = calculateTotalEarnings();
  const completedCount = appointments.length;

  // Get display name for the selected period
  const getPeriodLabel = () => {
    if (period === "all") {
      return t("finance.allTime");
    }
    if (period === "custom") {
      return `${format(start, "dd.MM.yyyy", { locale: getDateFnsLocale(i18n.language) })} - ${format(end, "dd.MM.yyyy", { locale: getDateFnsLocale(i18n.language) })}`;
    }
    if (period === "month") {
      const monthDate = new Date(selectedYear, selectedMonth, 1);
      return format(monthDate, "MMMM yyyy", { locale: getDateFnsLocale(i18n.language) });
    }
    return t(`finance.last${period}Days`);
  };

  // Export to Excel function
  const handleExportToExcel = () => {
    if (appointments.length === 0) {
      return;
    }

    // Prepare column headers
    const headers = [
      t("finance.date"),
      t("finance.patient"),
      ...(user?.role === "ADMIN" ? [t("finance.doctor"), t("appointments.chair")] : []),
      t("finance.treatment"),
      t("finance.amount"),
    ];

    // Prepare data for Excel export
    const exportData = appointments.map((appointment: Appointment) => {
      const appointmentTotal = appointment.therapyRecords?.reduce((sum, therapy) => {
        return sum + (therapy.price ? parseFloat(therapy.price.toString()) : 0);
      }, 0) || 0;

      const row: any = {
        [t("finance.date")]: format(new Date(appointment.startTime), "dd.MM.yyyy", { locale: getDateFnsLocale(i18n.language) }),
        [t("finance.patient")]: `${appointment.patientMedicalCard.firstName} ${appointment.patientMedicalCard.lastName}`,
      };

      if (user?.role === "ADMIN") {
        row[t("finance.doctor")] = `Dr ${appointment.dentist.firstName} ${appointment.dentist.lastName}`;
        row[t("appointments.chair")] = appointment.chair;
      }

      row[t("finance.treatment")] = translateTreatment(appointment.dentalService, t);
      row[t("finance.amount")] = appointmentTotal;

      return row;
    });

    // Add summary row with all columns
    const summaryRow: any = {};
    headers.forEach((header) => {
      summaryRow[header] = "";
    });
    summaryRow[t("finance.treatment")] = t("finance.total");
    summaryRow[t("finance.amount")] = totalEarnings;
    exportData.push(summaryRow);

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const colWidths = headers.map(() => ({ wch: 25 }));
    ws["!cols"] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, t("finance.title"));

    // Generate filename
    const periodLabel = getPeriodLabel().replace(/\s+/g, "-").toLowerCase();
    const fileNameBase = t("finance.financialReportFileName");
    
    // Add patient name to filename if a specific patient is selected
    let patientNamePart = "";
    if (selectedPatientId && selectedPatientId !== "all" && appointments.length > 0) {
      const firstAppointment = appointments[0];
      if (firstAppointment.patientMedicalCard) {
        const patientName = `${firstAppointment.patientMedicalCard.firstName}-${firstAppointment.patientMedicalCard.lastName}`;
        patientNamePart = `-${patientName.toLowerCase().replace(/\s+/g, "-")}`;
      }
    }
    
    // Add doctor name to filename if a specific doctor is selected
    let doctorNamePart = "";
    if (user?.role === "ADMIN" && selectedDentistId !== "all" && dentists?.data) {
      const selectedDentist = dentists.data.find(d => d.id.toString() === selectedDentistId);
      if (selectedDentist) {
        const doctorName = `${selectedDentist.firstName}-${selectedDentist.lastName}`;
        doctorNamePart = `-dr-${doctorName.toLowerCase().replace(/\s+/g, "-")}`;
      }
    }
    
    // Add chair to filename if a specific chair is selected
    let chairPart = "";
    if (user?.role === "ADMIN" && selectedChair !== "all") {
      chairPart = `-stolica-${selectedChair}`;
    }
    
    const filename = `${fileNameBase}${patientNamePart}${doctorNamePart}${chairPart}-${periodLabel}-${format(new Date(), "yyyy-MM-dd")}.xlsx`;

    // Write file
    XLSX.writeFile(wb, filename);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t("finance.title")}
            </h1>
            <p className="text-gray-600 mt-1">
              {t("finance.subtitle")}
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <button
              type="button"
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
              className="flex items-center justify-between w-full cursor-pointer hover:opacity-80 transition-opacity"
            >
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                {t("finance.filters")}
              </CardTitle>
              {isFiltersExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </CardHeader>
          {isFiltersExpanded && (
            <CardContent className="space-y-6">
              {/* Period Selection */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="period">{t("finance.period")}</Label>
                    <Select value={period} onValueChange={(value: PeriodOption) => setPeriod(value)}>
                      <SelectTrigger id="period">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("finance.allTime")}</SelectItem>
                        <SelectItem value="15">{t("finance.last15Days")}</SelectItem>
                        <SelectItem value="30">{t("finance.last30Days")}</SelectItem>
                        <SelectItem value="90">{t("finance.last90Days")}</SelectItem>
                        <SelectItem value="month">{t("finance.specificMonth")}</SelectItem>
                        <SelectItem value="custom">{t("finance.customPeriod")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {period === "month" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="month">{t("finance.month")}</Label>
                        <Select 
                          value={selectedMonth.toString()} 
                          onValueChange={(value) => setSelectedMonth(parseInt(value))}
                        >
                          <SelectTrigger id="month">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {getMonthOptions().map((month) => (
                              <SelectItem key={month.value} value={month.value.toString()}>
                                {month.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="year">{t("finance.year")}</Label>
                        <Select 
                          value={selectedYear.toString()} 
                          onValueChange={(value) => setSelectedYear(parseInt(value))}
                        >
                          <SelectTrigger id="year">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {getYearOptions().map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {period === "custom" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="startDate">{t("finance.startDate")}</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">{t("finance.endDate")}</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {user?.role === "ADMIN" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="dentist">{t("finance.doctor")}</Label>
                        <Select value={selectedDentistId} onValueChange={setSelectedDentistId}>
                          <SelectTrigger id="dentist">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">{t("export.allDoctors")}</SelectItem>
                            {dentists?.data.map((dentist) => (
                              <SelectItem key={dentist.id} value={dentist.id.toString()}>
                                Dr {dentist.firstName} {dentist.lastName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="chair">{t("appointments.chair")}</Label>
                        <Select value={selectedChair} onValueChange={setSelectedChair}>
                          <SelectTrigger id="chair">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">{t("finance.allChairs")}</SelectItem>
                            {clinic?.chairNumber && clinic.chairNumber > 0
                              ? Array.from({ length: clinic.chairNumber }, (_, index) => {
                                  const value = String(index + 1);
                                  return (
                                    <SelectItem key={value} value={value}>
                                      {t("appointments.chair")} {value}
                                    </SelectItem>
                                  );
                                })
                              : null}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Patient Selection */}
              <div className="space-y-2">
                <Label>{t("finance.patient")}</Label>
                <PatientSelector
                  value={selectedPatientId}
                  onValueChange={setSelectedPatientId}
                  showAllOption={true}
                  allOptionLabel={t("finance.allPatients")}
                />
              </div>
            </CardContent>
          )}
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {user?.role === "ADMIN" ? t("finance.totalEarnings") : t("finance.yourEarnings")}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totalEarnings, clinic?.currency || "RSD")}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {t("finance.period")}: {getPeriodLabel()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("finance.completedAppointments")}
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {t("finance.appointmentsCount")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("finance.period")}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getPeriodLabel()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {format(start, "dd.MM.yyyy", { locale: getDateFnsLocale(i18n.language) })} - {format(end, "dd.MM.yyyy", { locale: getDateFnsLocale(i18n.language) })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Appointments List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t("finance.reportForPeriod")}: {getPeriodLabel()}
              </CardTitle>
              {appointments.length > 0 && (
                <Button
                  onClick={handleExportToExcel}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {t("finance.exportToExcel")}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                {t("common.loading")}
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>{t("finance.noData")}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">{t("finance.date")}</th>
                        <th className="text-left py-3 px-4 font-semibold">{t("finance.patient")}</th>
                        {user?.role === "ADMIN" && (
                          <th className="text-left py-3 px-4 font-semibold">{t("finance.doctor")}</th>
                        )}
                        {user?.role === "ADMIN" && (
                          <th className="text-left py-3 px-4 font-semibold">{t("appointments.chair")}</th>
                        )}
                        <th className="text-left py-3 px-4 font-semibold">{t("finance.treatment")}</th>
                        <th className="text-right py-3 px-4 font-semibold">{t("finance.amount")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appointment) => {
                        const appointmentTotal = appointment.therapyRecords?.reduce((sum, therapy) => {
                          return sum + (therapy.price ? parseFloat(therapy.price.toString()) : 0);
                        }, 0) || 0;

                        return (
                          <tr key={appointment.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              {format(new Date(appointment.startTime), "dd.MM.yyyy", { locale: getDateFnsLocale(i18n.language) })}
                              <br />
                              <span className="text-sm text-gray-500">
                                {formatTime(appointment.startTime, i18n.language === "en" ? "en-US" : "sr-RS")}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {appointment.patientMedicalCard.firstName} {appointment.patientMedicalCard.lastName}
                            </td>
                            {user?.role === "ADMIN" && (
                              <td className="py-3 px-4">
                                Dr {appointment.dentist.firstName} {appointment.dentist.lastName}
                              </td>
                            )}
                            {user?.role === "ADMIN" && (
                              <td className="py-3 px-4">
                                {t("appointments.chair")} {appointment.chair}
                              </td>
                            )}
                            <td className="py-3 px-4">
                              {translateTreatment(appointment.dentalService, t)}
                            </td>
                            <td className="py-3 px-4 text-right font-semibold text-green-600">
                              {formatCurrency(appointmentTotal, clinic?.currency || "RSD")}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 font-bold bg-gray-50">
                        <td colSpan={user?.role === "ADMIN" ? 5 : 3} className="py-3 px-4 text-right">
                          {t("finance.total")}:
                        </td>
                        <td className="py-3 px-4 text-right text-green-600 text-lg">
                          {formatCurrency(totalEarnings, clinic?.currency || "RSD")}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

