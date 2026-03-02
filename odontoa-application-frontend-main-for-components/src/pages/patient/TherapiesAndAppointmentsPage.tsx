import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Search, Plus, Edit, Eye, Filter, ChevronDown, ChevronUp, Loader2, Clock } from "lucide-react";
import { useGetTherapyRecordsByPatientID } from "@/hooks/patients/useGetTherapyRecordsByPatientID";
import { useGetAppointmentsByPatientID } from "@/hooks/appointments/useGetAppointmentsByPatientID";
import { useUpdateTherapy } from "@/hooks/patients/useUpdateTherapy";
import { format } from "date-fns";
import { TherapyViewModal } from "@/components/modal/TherapyViewModal";
import { TherapyEditWizard } from "@/components/modal/TherapyEditModal";
import { TherapyAddWizard } from "@/components/modal/TherapyAddWizard";
import { AppointmentViewModal } from "@/components/modal/AppointmentViewModal";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { useGetDentists } from "@/hooks/dentists/useGetDentists";
import { useGetClinicById } from "@/hooks/clinics/useGetClinicById";
import { getStatusBadge, getTypeBadge, useDebounce, formatCurrency, getDateFnsLocale, translateTreatment } from "@/lib/utils";
import type { AppointmentStatus } from "@/types/Appointment";
import { useTranslation } from "react-i18next";

export default function TherapiesAndAppointmentsPage() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTherapy, setSelectedTherapy] = useState<any>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddWizardOpen, setIsAddWizardOpen] = useState(false);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState("");

  const searchTerm = searchParams.get("search") || "";
  const viewType = (searchParams.get("view") as "therapies" | "appointments") || "therapies";
  const treatmentTypeFilter = (searchParams.get("treatmentType") as "all" | "stomatoloski" | "ortodontski") || "all";
  const doctorFilter = searchParams.get("doctor") || "all";
  const statusFilter = (searchParams.get("status") as "all" | "scheduled" | "completed" | "canceled" | "in_progress") || "all";
  const page = parseInt(searchParams.get("page") || "1");
  
  // Check for URL parameters to auto-open specific therapy
  const openTherapy = searchParams.get("openTherapy");
  const appointmentId = searchParams.get("appointmentId");
  
  const debouncedSearchValue = useDebounce(searchInputValue, 500);

  const { data: clinic } = useGetClinicById();
  const { data: therapyRecords } = useGetTherapyRecordsByPatientID({
    page: page,
    filter: viewType === "therapies" ? debouncedSearchValue : "",
    dentistId: viewType === "therapies" && doctorFilter !== "all" ? doctorFilter : undefined,
    treatmentType: treatmentTypeFilter !== "all" ? treatmentTypeFilter : undefined,
  });

  const { data: appointments } = useGetAppointmentsByPatientID(
    page,
    10, // limit
    statusFilter !== "all" ? (statusFilter as AppointmentStatus) : undefined,
    viewType === "appointments" ? debouncedSearchValue : "",
    viewType === "appointments" && doctorFilter !== "all" ? doctorFilter : undefined
  );

  const { data: dentists } = useGetDentists();
  const updateTherapyMutation = useUpdateTherapy();

  // Auto-open specific therapy when navigating from appointment modal
  useEffect(() => {
    if (openTherapy === "true" && appointmentId && therapyRecords?.data) {
      // Find the therapy record that matches the appointment ID
      const matchingTherapy = therapyRecords.data.find(
        (therapy) => therapy.appointment.id.toString() === appointmentId
      );
      
      if (matchingTherapy) {
        setSelectedTherapy(matchingTherapy);
        setIsViewModalOpen(true);
        
        // Clean up URL parameters after opening
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete("openTherapy");
        newSearchParams.delete("appointmentId");
        setSearchParams(newSearchParams, { replace: true });
      }
    }
  }, [openTherapy, appointmentId, therapyRecords, searchParams, setSearchParams]);

  // Initialize search input value from URL params
  useEffect(() => {
    setSearchInputValue(searchTerm);
  }, [searchTerm]);

  // Update URL when debounced search value changes
  useEffect(() => {
    if (debouncedSearchValue !== searchTerm) {
      updateSearchParams({ search: debouncedSearchValue, page: "1" });
    }
  }, [debouncedSearchValue, searchTerm]);

  const handleViewTherapy = (therapy: any) => {
    setSelectedTherapy(therapy);
    setIsViewModalOpen(true);
  };

  const handleEditTherapy = (therapy: any) => {
    setSelectedTherapy(therapy);
    setIsEditModalOpen(true);
  };

  const handleSaveTherapy = async (data: any) => {
    if (!selectedTherapy?.id) {
      toast.error(t("dentalCard.errorTherapyId"));
      return;
    }

    try {
      await updateTherapyMutation.mutateAsync({
        therapyId: selectedTherapy.id,
        data: data
      });
      handleCloseEditModal();
    } catch (error) {
      // Error handling is done in the hook
      console.error("Error updating therapy:", error);
    }
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedTherapy(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTherapy(null);
  };

  const updateSearchParams = (updates: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });
    setSearchParams(newSearchParams);
  };

  const handleSearchChange = (value: string) => {
    setSearchInputValue(value);
  };

  const handleTreatmentTypeChange = (value: string) => {
    updateSearchParams({ treatmentType: value, page: "1" });
  };

  const handleDoctorChange = (value: string) => {
    updateSearchParams({ doctor: value, page: "1" });
  };

  const handleStatusChange = (value: string) => {
    updateSearchParams({ status: value, page: "1" });
  };

  const handleViewChange = (value: string) => {
    // Reset filters and search when switching views
    setSearchInputValue("");
    if (value === "therapies") {
      updateSearchParams({ view: value, page: "1", status: "", search: "", doctor: "all" });
    } else {
      updateSearchParams({ view: value, page: "1", search: "", doctor: "all" });
    }
  };

  const handleViewAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsViewModalOpen(true);
  };

  const handleEditAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsEditModalOpen(true);
  };

  // If adding therapy, show the wizard instead of the main content
  if (isAddWizardOpen && viewType === "therapies") {
    return (
      <TherapyAddWizard
        onCancel={() => setIsAddWizardOpen(false)}
      />
    );
  }

  // If editing therapy, show the wizard instead of the main content
  if (isEditModalOpen && selectedTherapy && viewType === "therapies") {
    return (
      <TherapyEditWizard
        therapy={selectedTherapy}
        onCancel={handleCloseEditModal}
        onSave={handleSaveTherapy}
      />
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header Card */}
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-4 lg:mb-6">
            <div className="flex items-center gap-4">
              <CardTitle className="text-lg lg:text-2xl font-semibold text-gray-800 flex items-center gap-2">
                {viewType === "therapies" ? (
                  <Calendar className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
                ) : (
                  <Clock className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
                )}
                {viewType === "therapies" ? t("therapiesAndAppointments.therapies") : t("therapiesAndAppointments.appointments")}
              </CardTitle>
              <Tabs value={viewType} onValueChange={handleViewChange} className="w-auto">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="therapies" className="text-sm cursor-pointer">{t("therapiesAndAppointments.therapies")}</TabsTrigger>
                  <TabsTrigger value="appointments" className="text-sm cursor-pointer">{t("therapiesAndAppointments.appointments")}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            {viewType === "therapies" && (
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white w-full lg:w-auto"
                onClick={() => setIsAddWizardOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("therapiesAndAppointments.addTherapy")}
              </Button>
            )}
          </div>

          {/* Search Bar - Always Visible */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder={viewType === "therapies" ? t("therapiesAndAppointments.searchTherapies") : t("therapiesAndAppointments.searchAppointments")}
              value={searchInputValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Toggle Button - Mobile Only */}
          <div className="lg:hidden">
            <Button
              variant="outline"
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
              className="w-full flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {t("therapiesAndAppointments.filters")}
              </span>
              {isFiltersExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          {/* Filters - Collapsible on Mobile */}
          <div className={`${isFiltersExpanded ? 'block' : 'hidden'} lg:block`}>
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${viewType === "therapies" ? "lg:grid-cols-2" : "lg:grid-cols-2"} gap-3 lg:gap-4`}>
              {/* Treatment Type Filter - Only for therapies */}
              {viewType === "therapies" && (
                <Select value={treatmentTypeFilter} onValueChange={handleTreatmentTypeChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("therapiesAndAppointments.treatmentType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("therapiesAndAppointments.all")}</SelectItem>
                    <SelectItem value="stomatoloski">{t("therapiesAndAppointments.dental")}</SelectItem>
                    <SelectItem value="ortodontski">{t("therapiesAndAppointments.orthodontic")}</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <Select value={doctorFilter} onValueChange={handleDoctorChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("therapiesAndAppointments.doctor")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("therapiesAndAppointments.allDoctors")}</SelectItem>
                  {dentists?.data?.map((dentist) => (
                    <SelectItem key={dentist.id} value={dentist.id.toString()}>
                      {dentist.firstName} {dentist.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter - Only for appointments */}
              {viewType === "appointments" && (
                <Select value={statusFilter} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("therapiesAndAppointments.status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("therapiesAndAppointments.allStatuses")}</SelectItem>
                    <SelectItem value="scheduled">{t("therapiesAndAppointments.scheduled")}</SelectItem>
                    <SelectItem value="completed">{t("therapiesAndAppointments.completed")}</SelectItem>
                    <SelectItem value="canceled">{t("therapiesAndAppointments.canceled")}</SelectItem>
                    <SelectItem value="in_progress">{t("therapiesAndAppointments.inProgress")}</SelectItem>
                    <SelectItem value="no_show">{t("therapiesAndAppointments.noShow")}</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {/* <Input
                type="date"
                placeholder="Od"
                value={dateFrom}
                onChange={(e) => handleDateFromChange(e.target.value)}
                className="text-sm"
              />

              <Input
                type="date"
                placeholder="Do"
                value={dateTo}
                onChange={(e) => handleDateToChange(e.target.value)}
                className="text-sm"
              /> */}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Desktop Table */}
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hidden xl:block">
        <CardContent className="p-4 lg:p-6">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>{t("therapiesAndAppointments.date")}</TableHead>
                  <TableHead>{t("therapiesAndAppointments.time")}</TableHead>
                  {viewType === "therapies" && <TableHead>{t("therapiesAndAppointments.type")}</TableHead>}
                  <TableHead>
                    {viewType === "therapies" ? t("therapiesAndAppointments.treatment") : t("therapiesAndAppointments.service")}
                  </TableHead>
                  {viewType === "therapies" && <TableHead>{t("therapiesAndAppointments.toothRegion")}</TableHead>}
                  <TableHead>{t("therapiesAndAppointments.doctor")}</TableHead>
                  {viewType === "therapies" && <TableHead>{t("therapiesAndAppointments.type")}</TableHead>}
                  {viewType === "therapies" && <TableHead>{t("therapiesAndAppointments.diagnosisTherapy")}</TableHead>}
                  {viewType === "appointments" && <TableHead>{t("therapiesAndAppointments.chair")}</TableHead>}
                  <TableHead>{t("therapiesAndAppointments.notes")}</TableHead>
                  {viewType === "therapies" && <TableHead>{t("therapiesAndAppointments.price")}</TableHead>}
                  {viewType === "appointments" && <TableHead>{t("therapiesAndAppointments.status")}</TableHead>}
                  <TableHead>{t("therapiesAndAppointments.action")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {viewType === "therapies" ? (
                  therapyRecords && therapyRecords.totalElements > 0 ? (
                    therapyRecords.data.map((therapy) => (
                      <TableRow key={therapy.id}>
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(therapy.appointment.startTime), "dd.MM.yyyy", { locale: getDateFnsLocale(i18n.language) })}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(therapy.appointment.startTime), "HH:mm", { locale: getDateFnsLocale(i18n.language) })}
                        </TableCell>
                        <TableCell>
                          {getTypeBadge(therapy.appointment.treatmentType, t)}
                        </TableCell>
                        <TableCell className="font-medium max-w-32 truncate">
                          {translateTreatment(therapy.appointment.dentalService, t)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {therapy.isGlobal ? t("therapiesAndAppointments.allTeeth") : therapy.toothNumber}
                        </TableCell>
                        <TableCell className="max-w-32 truncate">
                          {therapy.appointment.dentist.firstName} {therapy.appointment.dentist.lastName}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{therapy.entryType}</Badge>
                        </TableCell>
                        <TableCell className="max-w-40 truncate">
                          <div className="space-y-1">
                            {therapy.dgValue && (
                              <div className="text-xs text-blue-600">
                                DG: {therapy.dgValue}
                              </div>
                            )}
                            {(therapy.therapies || []).map((therapyItem, index) => (
                              <div key={index} className="text-xs text-green-600">
                                TH: {therapyItem.thGroupName}: {therapyItem.thValue}
                              </div>
                            ))}
                            {(!therapy.dgValue && (!therapy.therapies || therapy.therapies.length === 0)) && (
                              <span className="text-gray-400">{t("common.na")}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-40 truncate">
                          {therapy.notes}
                        </TableCell>
                        <TableCell>
                          {therapy.price ? (
                            <span className="text-green-600 font-medium">
                              {formatCurrency(therapy.price, clinic?.currency || "RSD")}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleViewTherapy(therapy)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleEditTherapy(therapy)}
                              disabled={updateTherapyMutation.isPending}
                            >
                              {updateTherapyMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Edit className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-8">
                        <div className="text-gray-500">
                          <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                          <p className="text-lg font-medium text-gray-900 mb-2">
                            {therapyRecords && therapyRecords.totalElements > 0
                              ? t("therapiesAndAppointments.noResultsForFilters")
                              : t("therapiesAndAppointments.noTherapiesFound")
                            }
                          </p>
                          <p className="text-sm text-gray-600">
                            {therapyRecords && therapyRecords.totalElements > 0
                              ? t("therapiesAndAppointments.tryChangeFilters")
                              : t("therapiesAndAppointments.tryChangeFiltersOrAdd")
                            }
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                ) : (
                  appointments && appointments.totalElements > 0 ? (
                    appointments.data.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(appointment.startTime), "dd.MM.yyyy", { locale: getDateFnsLocale(i18n.language) })}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(appointment.startTime), "HH:mm", { locale: getDateFnsLocale(i18n.language) })}
                        </TableCell>
                        <TableCell className="font-medium max-w-32 truncate">
                          {translateTreatment(appointment.dentalService, t)}
                        </TableCell>
                        <TableCell className="max-w-32 truncate">
                          {appointment.dentist.firstName} {appointment.dentist.lastName}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {appointment.chair}
                        </TableCell>
                        <TableCell className="max-w-40 truncate">
                          {appointment.notes}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(appointment.status, t)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleViewAppointment(appointment)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {/* <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleEditAppointment(appointment)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button> */}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="text-gray-500">
                          <Clock className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                          <p className="text-lg font-medium text-gray-900 mb-2">
                            {appointments && appointments.totalElements > 0
                              ? t("therapiesAndAppointments.noResultsForFilters")
                              : t("therapiesAndAppointments.noAppointmentsFound")
                            }
                          </p>
                          <p className="text-sm text-gray-600">
                            {appointments && appointments.totalElements > 0
                              ? t("therapiesAndAppointments.tryChangeFilters")
                              : t("therapiesAndAppointments.tryChangeFilters")
                            }
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Cards */}
      <div className="xl:hidden space-y-3">
        {viewType === "therapies" ? (
          therapyRecords && therapyRecords.totalElements > 0 ? (
            therapyRecords.data.map((therapy) => (
              <Card key={therapy.id} className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-gray-900">
                            {format(new Date(therapy.appointment.startTime), "dd.MM.yyyy HH:mm", { locale: getDateFnsLocale(i18n.language) })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getTypeBadge(therapy.appointment.treatmentType, t)}
                          {getStatusBadge(therapy.appointment.status, t)}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleViewTherapy(therapy)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditTherapy(therapy)}
                          disabled={updateTherapyMutation.isPending}
                        >
                          {updateTherapyMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Edit className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Treatment Details */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                        <span className="text-gray-500">{t("therapiesAndAppointments.treatmentLabel")}</span>
                        <p className="font-medium truncate">{translateTreatment(therapy.appointment.dentalService, t)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">{t("therapiesAndAppointments.toothLabel")}</span>
                        <p className="font-medium">{therapy.isGlobal ? t("therapiesAndAppointments.allTeeth") : therapy.toothNumber}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">{t("therapiesAndAppointments.doctorLabel")}</span>
                        <p className="font-medium truncate">
                          {therapy.appointment.dentist.firstName} {therapy.appointment.dentist.lastName}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">{t("therapiesAndAppointments.typeLabel")}</span>
                        <Badge variant="outline" className="text-xs">{therapy.entryType}</Badge>
                      </div>
                    </div>

                    {/* Diagnosis/Therapy */}
                    <div>
                      <span className="text-gray-500 text-sm">{t("therapiesAndAppointments.diagnosisTherapy")}:</span>
                      <div className="space-y-1 mt-1">
                        {therapy.dgValue && (
                          <p className="text-sm font-medium text-blue-600">
                            DG: {therapy.dgValue}
                          </p>
                        )}
                        {(therapy.therapies || []).map((therapyItem, index) => (
                          <p key={index} className="text-sm font-medium text-green-600">
                            TH: {therapyItem.thGroupName}: {therapyItem.thValue}
                          </p>
                        ))}
                        {(!therapy.dgValue && (!therapy.therapies || therapy.therapies.length === 0)) && (
                          <p className="text-sm text-gray-400">{t("common.na")}</p>
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    {therapy.notes && (
                      <div>
                        <span className="text-gray-500 text-sm">{t("therapiesAndAppointments.notesLabel")}</span>
                        <p className="text-sm">{therapy.notes}</p>
                      </div>
                    )}

                    {/* Price */}
                    {therapy.price && (
                      <div>
                        <span className="text-gray-500 text-sm">{t("therapiesAndAppointments.priceLabel")}</span>
                        <p className="text-sm font-medium text-green-600">
                          {formatCurrency(therapy.price, clinic?.currency || "RSD")}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="text-gray-500">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    {therapyRecords && therapyRecords.totalElements > 0
                      ? t("therapiesAndAppointments.noResultsForFilters")
                      : t("therapiesAndAppointments.noTherapiesFound")
                    }
                  </p>
                  <p className="text-sm text-gray-600">
                    {therapyRecords && therapyRecords.totalElements > 0
                      ? t("therapiesAndAppointments.tryChangeFilters")
                      : t("therapiesAndAppointments.tryChangeFiltersOrAdd")
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        ) : (
          appointments && appointments.totalElements > 0 ? (
            appointments.data.map((appointment) => (
              <Card key={appointment.id} className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-gray-900">
                            {format(new Date(appointment.startTime), "dd.MM.yyyy HH:mm", { locale: getDateFnsLocale(i18n.language) })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(appointment.status, t)}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleViewAppointment(appointment)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditAppointment(appointment)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">{t("therapiesAndAppointments.serviceLabel")}</span>
                        <p className="font-medium truncate">{translateTreatment(appointment.dentalService, t)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">{t("therapiesAndAppointments.chairLabel")}</span>
                        <p className="font-medium">{appointment.chair}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">{t("therapiesAndAppointments.doctorLabel")}</span>
                        <p className="font-medium truncate">
                          {appointment.dentist.firstName} {appointment.dentist.lastName}
                        </p>
                      </div>
                    </div>

                    {/* Notes */}
                    {appointment.notes && (
                      <div>
                        <span className="text-gray-500 text-sm">{t("therapiesAndAppointments.notesLabel")}</span>
                        <p className="text-sm">{appointment.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="text-gray-500">
                  <Clock className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    {appointments && appointments.totalElements > 0
                      ? t("therapiesAndAppointments.noResultsForFilters")
                      : t("therapiesAndAppointments.noAppointmentsFound")
                    }
                  </p>
                  <p className="text-sm text-gray-600">
                    {appointments && appointments.totalElements > 0
                      ? t("therapiesAndAppointments.tryChangeFilters")
                      : t("therapiesAndAppointments.tryChangeFilters")
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>

      {/* Enhanced Pagination */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 lg:p-0">
        <div className="text-sm text-gray-600 text-center sm:text-left">
          {viewType === "therapies" ? (
            <>{t("therapiesAndAppointments.showingTherapies", { shown: therapyRecords?.data.length || 0, total: therapyRecords?.totalElements || 0 })}</>
          ) : (
            <>{t("therapiesAndAppointments.showingAppointments", { shown: appointments?.data.length || 0, total: appointments?.totalElements || 0 })}</>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="px-3 lg:px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm"
            onClick={() => {
              setSearchParams((prev) => {
                const params = new URLSearchParams(prev);
                params.set("page", (page - 1).toString());
                return params;
              });
            }}
            disabled={page === 1}
          >
            <span className="hidden sm:inline">{t("therapiesAndAppointments.previous")}</span>
            <span className="sm:hidden">←</span>
          </Button>
          <div className="px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm">
            {page}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="px-3 lg:px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm"
            onClick={() => {
              setSearchParams((prev) => {
                const params = new URLSearchParams(prev);
                params.set("page", (page + 1).toString());
                return params;
              });
            }}
            disabled={
              viewType === "therapies" 
                ? therapyRecords && page >= therapyRecords.totalPages
                : appointments && page >= appointments.totalPages
            }
          >
            <span className="hidden sm:inline">{t("therapiesAndAppointments.next")}</span>
            <span className="sm:hidden">→</span>
          </Button>
        </div>
      </div>

      {viewType === "therapies" && (
        <TherapyViewModal
          therapy={selectedTherapy}
          isOpen={isViewModalOpen}
          onClose={handleCloseViewModal}
        />
      )}

      {viewType === "appointments" && (
        <AppointmentViewModal
          appointment={selectedAppointment}
          isOpen={isViewModalOpen}
          onClose={() => {
            setSelectedAppointment(null);
            setIsViewModalOpen(false);
          }}
        />
      )}
    </div>
  );
} 