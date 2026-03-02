import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExportAppointments } from "@/hooks/appointments/useExportAppointments";
import { useGetDentists } from "@/hooks/dentists/useGetDentists";
import { useGetAllPatients } from "@/hooks/patients/useGetAllPatients";
import { Download, Filter, ArrowLeft, Search, Users, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

export const ExportAppointmentsPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    
    // Form states
    const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "all">("monthly");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [status, setStatus] = useState<string>("all");
    const [dentistId, setDentistId] = useState<string>("all");
    const [chair, setChair] = useState<string>("all");
    const [treatmentType, setTreatmentType] = useState<string>("");
    
    // Patient selection states
    const [selectedPatientId, setSelectedPatientId] = useState<string>("all");
    const [patientSearch, setPatientSearch] = useState<string>("");

    const { mutate: exportAppointments, isPending } = useExportAppointments();
    const { data: dentists } = useGetDentists();
    const { data: patients } = useGetAllPatients();

    // Filter patients based on search
    const filteredPatients = patients?.filter((patient) =>
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(patientSearch.toLowerCase())
    ) || [];

    // Get selected patient for display
    const selectedPatient = patients?.find((patient) => patient.id.toString() === selectedPatientId);

    // Set default dates based on period
    const setDefaultDates = (selectedPeriod: "daily" | "weekly" | "monthly" | "all") => {
        const today = new Date();
        let start = new Date();
        let end = new Date();

        switch (selectedPeriod) {
            case "daily":
                start = today;
                end = today;
                break;
            case "weekly":
                const dayOfWeek = today.getDay();
                const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
                start = new Date(today.setDate(diff));
                end = new Date(start);
                end.setDate(start.getDate() + 4);
                break;
            case "monthly":
                start = new Date(today.getFullYear(), today.getMonth(), 1);
                end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                break;
            case "all":
                start = new Date(2020, 0, 1);
                end = new Date(today.getFullYear(), 11, 31);
                break;
        }

        setStartDate(format(start, "yyyy-MM-dd"));
        setEndDate(format(end, "yyyy-MM-dd"));
    };

    const handlePeriodChange = (value: "daily" | "weekly" | "monthly" | "all") => {
        setPeriod(value);
        setDefaultDates(value);
    };

    const handlePatientSelect = (patientId: string) => {
        setSelectedPatientId(patientId);
    };

    const handleExport = () => {
        const params = {
            period,
            format: "csv" as const,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            status: status !== "all" ? status : undefined,
            dentistId: dentistId !== "all" ? parseInt(dentistId) : undefined,
            chair: chair !== "all" ? parseInt(chair) : undefined,
            treatmentType: treatmentType || undefined,
            patientId: selectedPatientId !== "all" ? parseInt(selectedPatientId) : undefined,
            patientName: selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : undefined,
        };

        exportAppointments(params);
    };

    // Set default dates on mount
    useEffect(() => {
        setDefaultDates(period);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/appointments")}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {t("common.back")}
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                            <Download className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {t("export.title")}
                            </h1>
                            <p className="text-gray-600 mt-1 flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {t("export.subtitle")}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Export Settings */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Filter className="h-5 w-5" />
                                    {t("export.exportSettings")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Period Selection */}
                                <div className="space-y-2">
                                    <Label htmlFor="period">{t("export.period")} *</Label>
                                    <Select value={period} onValueChange={handlePeriodChange}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="daily">{t("export.daily")}</SelectItem>
                                            <SelectItem value="weekly">{t("export.weekly")}</SelectItem>
                                            <SelectItem value="monthly">{t("export.monthly")}</SelectItem>
                                            <SelectItem value="all">{t("export.allTime")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Date Range */}
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">{t("export.startDate")}</Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate">{t("export.endDate")}</Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>

                                {/* Status Filter */}
                                <div className="space-y-2">
                                    <Label htmlFor="status">{t("export.status")}</Label>
                                    <Select value={status} onValueChange={setStatus}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">{t("export.allStatuses")}</SelectItem>
                                            <SelectItem value="scheduled">{t("status.scheduled")}</SelectItem>
                                            <SelectItem value="in_progress">{t("status.inProgress")}</SelectItem>
                                            <SelectItem value="completed">{t("status.completed")}</SelectItem>
                                            <SelectItem value="canceled">{t("status.canceled")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Dentist Filter */}
                                <div className="space-y-2">
                                    <Label htmlFor="dentistId">{t("export.doctor")}</Label>
                                    <Select value={dentistId} onValueChange={setDentistId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t("export.allDoctors")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">{t("export.allDoctors")}</SelectItem>
                                            {dentists?.data.map((dentist) => (
                                                <SelectItem
                                                    key={dentist.id}
                                                    value={dentist.id.toString()}
                                                >
                                                    Dr {dentist.firstName} {dentist.lastName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Chair Filter */}
                                <div className="space-y-2">
                                    <Label htmlFor="chair">{t("export.chair")}</Label>
                                    <Select value={chair} onValueChange={setChair}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">{t("export.allChairs")}</SelectItem>
                                            <SelectItem value="1">{t("export.chairNumber", { number: 1 })}</SelectItem>
                                            <SelectItem value="2">{t("export.chairNumber", { number: 2 })}</SelectItem>
                                            <SelectItem value="3">{t("export.chairNumber", { number: 3 })}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Treatment Type */}
                                <div className="space-y-2">
                                    <Label htmlFor="treatmentType">{t("export.treatmentType")}</Label>
                                    <Input
                                        id="treatmentType"
                                        placeholder={t("export.treatmentTypePlaceholder")}
                                        value={treatmentType}
                                        onChange={(e) => setTreatmentType(e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Patient Selection */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    {t("export.patientSelection")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Search */}
                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center gap-2">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                            <Input
                                                placeholder={t("export.searchPatients")}
                                                value={patientSearch}
                                                onChange={(e) => setPatientSearch(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Patient List */}
                                <div className="max-h-96 overflow-y-auto border rounded-lg">
                                    {filteredPatients.length === 0 ? (
                                        <div className="p-8 text-center text-gray-500">
                                            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                            <p>{t("export.noPatientsFound")}</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y">
                                            {/* All Patients Option */}
                                            <div
                                                className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer"
                                                onClick={() => handlePatientSelect("all")}
                                            >
                                                <input
                                                    type="radio"
                                                    id="all-patients"
                                                    name="patient-selection"
                                                    checked={selectedPatientId === "all"}
                                                    onChange={() => handlePatientSelect("all")}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <Label
                                                        htmlFor="all-patients"
                                                        className="text-sm font-medium text-gray-900 cursor-pointer"
                                                    >
                                                        {t("export.allPatients")} ({patients?.length || 0})
                                                    </Label>
                                                    <p className="text-sm text-gray-500">
                                                        {t("export.exportAllPatients")}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            {/* Individual Patients */}
                                            {filteredPatients.map((patient) => (
                                                <div
                                                    key={patient.id}
                                                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer"
                                                    onClick={() => handlePatientSelect(patient.id.toString())}
                                                >
                                                    <input
                                                        type="radio"
                                                        id={`patient-${patient.id}`}
                                                        name="patient-selection"
                                                        checked={selectedPatientId === patient.id.toString()}
                                                        onChange={() => handlePatientSelect(patient.id.toString())}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <Label
                                                            htmlFor={`patient-${patient.id}`}
                                                            className="text-sm font-medium text-gray-900 cursor-pointer"
                                                        >
                                                            {patient.firstName} {patient.lastName}
                                                        </Label>
                                                        <p className="text-sm text-gray-500">
                                                            {patient.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Selection Summary */}
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        {selectedPatientId === "all" 
                                            ? t("export.exportAllPatients") + ` (${patients?.length || 0})`
                                            : selectedPatient 
                                                ? t("export.exportSelectedPatient", { name: `${selectedPatient.firstName} ${selectedPatient.lastName}` })
                                                : t("export.selectPatient")
                                        }
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Export Button */}
                <div className="flex justify-end">
                    <Button
                        onClick={handleExport}
                        disabled={isPending}
                        className="flex items-center gap-2 px-8 py-3"
                    >
                        <Download className="h-5 w-5" />
                        {isPending ? t("export.exporting") : t("export.export")}
                    </Button>
                </div>
            </div>
        </div>
    );
};
