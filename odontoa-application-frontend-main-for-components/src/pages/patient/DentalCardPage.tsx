import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import {
  Search,
  Activity,
  Calendar,
  FileText,
  Eye,
  Edit,
  Loader2,
} from "lucide-react";
import { useGetTherapyRecordsByPatientID } from "@/hooks/patients/useGetTherapyRecordsByPatientID";
import { TherapyAddModal } from "@/components/modal/TherapyAddModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  getStatusBadge,
  useDebounce,
  formatCurrency,
  getDateFnsLocale,
  translateTreatment,
  getToothStatusLabel,
} from "@/lib/utils";
import { useSearchParams } from "react-router-dom";
import { useUpdateTherapy } from "@/hooks/patients/useUpdateTherapy";
import { useGetClinicById } from "@/hooks/clinics/useGetClinicById";
import { TherapyViewModal } from "@/components/modal/TherapyViewModal";
import { TherapyEditWizard } from "@/components/modal/TherapyEditModal";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { SVGOdontogram } from "@/components/patients/dental/SVGOdontogram";
import { useMemo } from "react";
import { type ToothStatus } from "@/lib/utils";

export default function DentalCardPage() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTherapy, setSelectedTherapy] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // const [enableUpdate, setEnableUpdate] = useState(false);
  const [clickedToothForModal, setClickedToothForModal] = useState<
    number | null
  >(null);
  const [searchInputValue, setSearchInputValue] = useState("");

  const debouncedSearchValue = useDebounce(searchInputValue, 500);

  const page = parseInt(searchParams.get("page") || "1");

  const { data: clinic } = useGetClinicById();

  const handleToothSelect = (toothNum: number) => {
    // If toothNum is 0, it means reset was requested - don't open modal
    if (toothNum === 0) {
      setSelectedTooth(null);
      setClickedToothForModal(null);
      return;
    }

    // If editing mode is enabled, just open modal without selecting the tooth
    // if (enableUpdate) {
    //   setClickedToothForModal(toothNum);
    //   setIsAddModalOpen(true);
    //   return;
    // }

    // Only set selectedTooth when not in editing mode
    setSelectedTooth(toothNum);
  };

  const { data: therapyRecords } = useGetTherapyRecordsByPatientID({
    // toothNumber: enableUpdate ? null : selectedTooth, // Don't filter when editing
    toothNumber: selectedTooth,
    page,
    filter: debouncedSearchValue,
  });

  // Process therapy records to determine tooth statuses
  // Get all therapy records (not paginated) to determine statuses for all teeth
  const { data: allTherapyRecords } = useGetTherapyRecordsByPatientID({
    toothNumber: null,
    page: 1,
    filter: "",
  });

  // Create a map of tooth number to most recent therapy group
  const teethStatuses = useMemo<Record<string, ToothStatus>>(() => {
    if (!allTherapyRecords?.data) return {};

    const statusMap: Record<string, { therapyGroup: string; date: Date }> = {};

    allTherapyRecords.data.forEach((therapy) => {
      if (therapy.isGlobal) return; // Skip global therapies

      // Only process therapies that have therapy groups
      if (!therapy.therapies || therapy.therapies.length === 0) return;

      const toothNum = therapy.toothNumber.toString();
      const therapyDate = new Date(therapy.appointment.startTime);

      // Get the first therapy group (most important one)
      const therapyGroup = therapy.therapies[0].thGroupName;

      // Keep the most recent therapy group for each tooth
      if (!statusMap[toothNum] || therapyDate > statusMap[toothNum].date) {
        statusMap[toothNum] = {
          therapyGroup,
          date: therapyDate,
        };
      }
    });

    const result: Record<string, ToothStatus> = {};
    Object.keys(statusMap).forEach((toothNum) => {
      result[toothNum] = statusMap[toothNum].therapyGroup;
    });

    return result;
  }, [allTherapyRecords]);

  // Create a map of tooth number to tooth areas that have been treated
  const treatmentsByTooth = useMemo<Record<string, string[]>>(() => {
    if (!allTherapyRecords?.data) return {};

    const treatmentsMap: Record<string, Set<string>> = {};

    allTherapyRecords.data.forEach((therapy) => {
      if (therapy.isGlobal) return; // Skip global therapies
      if (!therapy.toothAreas || therapy.toothAreas.length === 0) return;

      const toothNum = therapy.toothNumber.toString();

      // Initialize set if it doesn't exist
      if (!treatmentsMap[toothNum]) {
        treatmentsMap[toothNum] = new Set<string>();
      }

      // Add all tooth areas from this therapy
      therapy.toothAreas.forEach((area: string) => {
        treatmentsMap[toothNum].add(area);
      });
    });

    // Convert sets to arrays
    const result: Record<string, string[]> = {};
    Object.keys(treatmentsMap).forEach((toothNum) => {
      result[toothNum] = Array.from(treatmentsMap[toothNum]);
    });

    return result;
  }, [allTherapyRecords]);

  const handleSearchChange = (value: string) => {
    setSearchInputValue(value);
  };

  const handleViewTherapy = (therapy: any) => {
    setSelectedTherapy(therapy);
    setIsViewModalOpen(true);
  };

  const handleEditTherapy = (therapy: any) => {
    setSelectedTherapy(therapy);
    setIsEditModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedTherapy(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTherapy(null);
  };

  const handleSaveTherapy = async (data: any) => {
    if (!selectedTherapy?.id) {
      toast.error(t("dentalCard.errorTherapyId"));
      return;
    }

    try {
      await updateTherapyMutation.mutateAsync({
        therapyId: selectedTherapy.id,
        data: data,
      });
      handleCloseEditModal();
    } catch (error) {
      // Error handling is done in the hook
      console.error("Error updating therapy:", error);
    }
  };

  const updateTherapyMutation = useUpdateTherapy();

  return (
    <>
      {isEditModalOpen && selectedTherapy ? (
        <TherapyEditWizard
          therapy={selectedTherapy}
          onCancel={handleCloseEditModal}
          onSave={handleSaveTherapy}
        />
      ) : (
        <div className="space-y-6 lg:space-y-8">
        {/* Enhanced Header Section */}
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl"></div>

          <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl p-4 lg:p-8">
            <div className="flex items-center gap-3">
              <div className="p-2 lg:p-3 bg-blue-600 rounded-xl shadow-lg">
                <Activity className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {t("dentalCard.title")}
                </h1>
                <p className="text-sm lg:text-base text-gray-600 mt-1 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {t("dentalCard.subtitle")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Test SVG with Hover Effects */}
        <Card className="shadow-xl bg-white">
          <CardHeader className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl lg:text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                Odontogram
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 lg:p-6 pt-0">
            <div className="w-full flex justify-center items-center bg-gray-50 rounded-lg p-8 overflow-auto">
              <SVGOdontogram
                teethStatuses={teethStatuses}
                treatmentsByTooth={treatmentsByTooth}
                onToothClick={(toothNumber) => {
                  console.log("Clicked tooth:", toothNumber);
                  handleToothSelect(parseInt(toothNumber));
                }}
              />
            </div>

            {/* Legend Section */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {t("dentalCard.legend") || "Legend"}
              </h3>

              {/* Color Legend - Therapy Categories */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  {t("dentalCard.colorMeanings") || "Therapy Categories"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* No Treatment */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-gray-200 border border-gray-400 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">
                      {getToothStatusLabel(null, t)}
                    </span>
                  </div>
                  {/* Vađenje zuba - Extracted Tooth */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-red-500 border border-red-700 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">
                      {t("constants.thGroups.Vađenje zuba") || "Vađenje zuba"}
                    </span>
                  </div>
                  {/* Endodontska terapija */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-blue-200 border border-blue-400 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">
                      {t(`constants.thGroupCategories.Endodontska terapija`) ||
                        "Endodontska terapija"}
                    </span>
                  </div>
                  {/* Restaurativna terapija */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-green-200 border border-green-400 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">
                      {t(
                        `constants.thGroupCategories.Restaurativna terapija`
                      ) || "Restaurativna terapija"}
                    </span>
                  </div>
                  {/* Protetska terapija */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-purple-200 border border-purple-400 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">
                      {t(`constants.thGroupCategories.Protetska terapija`) ||
                        "Protetska terapija"}
                    </span>
                  </div>
                  {/* Higijenska i parodontološka terapija */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-cyan-200 border border-cyan-400 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">
                      {t(
                        `constants.thGroupCategories.Higijenska i parodontološka terapija`
                      ) || "Higijenska i parodontološka terapija"}
                    </span>
                  </div>
                  {/* Hirurške intervencije */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-red-200 border border-red-400 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">
                      {t(`constants.thGroupCategories.Hirurške intervencije`) ||
                        "Hirurške intervencije"}
                    </span>
                  </div>
                  {/* Preventiva i topička terapija */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-yellow-200 border border-yellow-400 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">
                      {t(
                        `constants.thGroupCategories.Preventiva i topička terapija`
                      ) || "Preventiva i topička terapija"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Treatment History Section */}
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
              <CardTitle className="text-xl lg:text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                {t("dentalCard.therapyRecords")}
              </CardTitle>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder={t("dentalCard.searchPlaceholder")}
                  value={searchInputValue}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 lg:p-6 pt-0">
            {/* Desktop Table */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hidden lg:block">
              <CardContent className="p-4 lg:p-6">
                <div className="overflow-x-auto">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20">
                          {t("dentalCard.date")}
                        </TableHead>
                        <TableHead className="min-w-32">
                          {t("common.therapyName")}
                        </TableHead>
                        <TableHead className="w-20">
                          {t("dentalCard.tooth")}
                        </TableHead>
                        <TableHead className="min-w-32">
                          {t("dentalCard.doctor")}
                        </TableHead>
                        <TableHead className="w-20">
                          {t("dentalCard.therapyType")}
                        </TableHead>
                        <TableHead className="min-w-32">Dg/Th</TableHead>
                        <TableHead className="min-w-40">
                          {t("common.notes")}
                        </TableHead>
                        <TableHead className="w-24">
                          {t("dentalCard.price")}
                        </TableHead>
                        <TableHead className="w-24">
                          {t("dentalCard.status")}
                        </TableHead>
                        <TableHead className="w-32">
                          {t("dentalCard.actions")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {therapyRecords && therapyRecords.totalElements > 0 ? (
                        therapyRecords.data.map((therapy) => (
                          <TableRow key={therapy.id}>
                            <TableCell className="whitespace-nowrap">
                              {format(
                                new Date(therapy.appointment.startTime),
                                "dd.MM.yyyy",
                                { locale: getDateFnsLocale(i18n.language) }
                              )}
                            </TableCell>
                            <TableCell className="font-medium max-w-32 truncate">
                              {translateTreatment(
                                therapy.appointment.dentalService,
                                t
                              )}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {therapy.isGlobal
                                ? t("dentalCard.allTeeth")
                                : therapy.toothNumber}
                            </TableCell>
                            <TableCell className="max-w-32 truncate">
                              {therapy.appointment.dentist.firstName &&
                              therapy.appointment.dentist.lastName
                                ? `${therapy.appointment.dentist.firstName} ${therapy.appointment.dentist.lastName}`
                                : t("common.notSet")}
                            </TableCell>
                            <TableCell>
                              {therapy.entryType ? (
                                <Badge variant="outline" className="text-xs">
                                  {therapy.entryType}
                                </Badge>
                              ) : (
                                <span className="text-gray-400">
                                  {t("common.notSet")}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="max-w-40 truncate">
                              <div className="space-y-1">
                                {therapy.dgValue && (
                                  <div className="text-xs text-blue-600">
                                    DG: {therapy.dgValue}
                                  </div>
                                )}
                                {(therapy.therapies || []).map(
                                  (therapyItem, index) => (
                                    <div
                                      key={index}
                                      className="text-xs text-green-600"
                                    >
                                      TH: {therapyItem.thGroupName}:{" "}
                                      {therapyItem.thValue}
                                    </div>
                                  )
                                )}
                                {!therapy.dgValue &&
                                  (!therapy.therapies ||
                                    therapy.therapies.length === 0) && (
                                    <span className="text-gray-400">
                                      {t("common.notSet")}
                                    </span>
                                  )}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-40 truncate">
                              {therapy.notes ? (
                                therapy.notes
                              ) : (
                                <span className="text-gray-900">
                                  {t("common.notSet")}
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              {therapy.price ? (
                                <span className="text-green-600 font-medium">
                                  {formatCurrency(
                                    therapy.price,
                                    clinic?.currency || "RSD"
                                  )}
                                </span>
                              ) : (
                                <span className="text-gray-400">
                                  {t("common.notSet")}
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(therapy.appointment.status, t)}
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
                                {/* <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Trash2 className="h-4 w-4" />
                          </Button> */}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-8">
                            <div className="text-gray-500">
                              <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                              <p className="text-lg font-medium text-gray-900 mb-2">
                                {therapyRecords &&
                                therapyRecords.totalElements > 0
                                  ? t("dentalCard.noResultsForFilters")
                                  : t("dentalCard.noEntriesFound")}
                              </p>
                              <p className="text-sm text-gray-600">
                                {therapyRecords &&
                                therapyRecords.totalElements > 0
                                  ? t("dentalCard.tryChangeFilters")
                                  : t("dentalCard.tryChangeFiltersOrAdd")}
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3">
              {therapyRecords && therapyRecords.totalElements > 0 ? (
                therapyRecords.data.map((therapy) => (
                  <Card
                    key={therapy.id}
                    className="shadow-lg border-0 bg-white/90 backdrop-blur-sm"
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-gray-900">
                                {format(
                                  new Date(therapy.appointment.startTime),
                                  "dd.MM.yyyy",
                                  { locale: getDateFnsLocale(i18n.language) }
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(therapy.appointment.status)}
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
                            <span className="text-gray-500">Tretman:</span>
                            <p className="font-medium truncate">
                              {translateTreatment(
                                therapy.appointment.dentalService,
                                t
                              )}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Zub:</span>
                            <p className="font-medium">
                              {therapy.isGlobal
                                ? t("dentalCard.allTeeth")
                                : therapy.toothNumber}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Doktor:</span>
                            <p className="font-medium truncate">
                              {therapy.appointment.dentist.firstName &&
                              therapy.appointment.dentist.lastName
                                ? `${therapy.appointment.dentist.firstName} ${therapy.appointment.dentist.lastName}`
                                : t("common.notSet")}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Tip:</span>
                            {therapy.entryType ? (
                              <Badge variant="outline" className="text-xs">
                                {therapy.entryType}
                              </Badge>
                            ) : (
                              <p className="font-medium text-gray-400">
                                {t("common.notSet")}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Diagnosis/Therapy */}
                        <div>
                          <span className="text-gray-500 text-sm">Dg/Th:</span>
                          <div className="space-y-1 mt-1">
                            {therapy.dgValue && (
                              <p className="text-sm font-medium text-blue-600">
                                DG: {therapy.dgValue}
                              </p>
                            )}
                            {(therapy.therapies || []).map(
                              (therapyItem, index) => (
                                <p
                                  key={index}
                                  className="text-sm font-medium text-green-600"
                                >
                                  TH: {therapyItem.thGroupName}:{" "}
                                  {therapyItem.thValue}
                                </p>
                              )
                            )}
                            {!therapy.dgValue &&
                              (!therapy.therapies ||
                                therapy.therapies.length === 0) && (
                                <p className="text-sm text-gray-400">
                                  {t("common.notSet")}
                                </p>
                              )}
                          </div>
                        </div>

                        {/* Notes */}
                        <div>
                          <span className="text-gray-500 text-sm">
                            Beleška:
                          </span>
                          <p className="text-sm">
                            {therapy.notes ? (
                              therapy.notes
                            ) : (
                              <span className="text-gray-900">
                                {t("common.notSet")}
                              </span>
                            )}
                          </p>
                        </div>

                        {/* Price */}
                        <div>
                          <span className="text-gray-500 text-sm">Cena:</span>
                          <p className="text-sm font-medium text-green-600">
                            {therapy.price
                              ? formatCurrency(
                                  therapy.price,
                                  clinic?.currency || "RSD"
                                )
                              : t("common.notSet")}
                          </p>
                        </div>
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
                          ? t("dentalCard.noResultsForFilters")
                          : t("dentalCard.noEntriesFound")}
                      </p>
                      <p className="text-sm text-gray-600">
                        {therapyRecords && therapyRecords.totalElements > 0
                          ? t("dentalCard.tryChangeFilters")
                          : t("dentalCard.tryChangeFiltersOrAdd")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Enhanced Pagination */}
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 lg:p-0">
              <div className="text-sm text-gray-600 text-center sm:text-left">
                {t("common.show")} {therapyRecords?.data.length}{" "}
                {t("common.of")} {therapyRecords?.totalElements}{" "}
                {t("dentalCard.therapies")}
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
                  <span className="hidden sm:inline">
                    {t("common.previous")}
                  </span>
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
                  disabled={therapyRecords && page >= therapyRecords.totalPages}
                >
                  <span className="hidden sm:inline">{t("common.next")}</span>
                  <span className="sm:hidden">→</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      )}
      <TherapyAddModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setClickedToothForModal(null);
        }}
        selectedTooth={clickedToothForModal}
      />
      <TherapyViewModal
        therapy={selectedTherapy}
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
      />
    </>
  );
}
