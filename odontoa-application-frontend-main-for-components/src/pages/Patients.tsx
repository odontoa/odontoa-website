import { Search, Plus, Eye, Trash, Users, Phone, Mail, User, Pencil } from "lucide-react";
import { useGetPatients } from "@/hooks/patients/useGetPatients";
import { useDeletePatient } from "@/hooks/patients/useDeletePatient";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import AddPatientModal from "@/components/modal/Patient/AddPatientModal";
import { Loading } from "@/components/ui/loading";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const PatientsPage = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<any>(null);
  const [patientToEdit, setPatientToEdit] = useState<any>(null);
  const { mutate: deletePatient, isPending: isDeleting } = useDeletePatient();

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";

  // Automatically open modal if ?add=true is present
  useEffect(() => {
    if (searchParams.get("add") === "true") {
      setOpen(true);
    }
  }, [searchParams]);

  // When modal closes, remove ?add param and clear edit state
  const handleCloseModal = () => {
    setOpen(false);
    setPatientToEdit(null);
    searchParams.delete("add");
    setSearchParams(searchParams, { replace: true });
  };

  const [search, setSearch] = useState("");

  const {
    data: patients,
    isLoading,
    error,
    refetch,
  } = useGetPatients({ page, search: searchQuery });

  // Show loading when search is changing
  const isSearching = search !== searchQuery;

  const handleDeleteClick = (patient: any) => {
    setPatientToDelete(patient);
    setDeleteConfirmId(patient.id);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      deletePatient(deleteConfirmId, {
        onSuccess: () => {
          refetch();
          setDeleteConfirmId(null);
          setPatientToDelete(null);
        },
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
    setPatientToDelete(null);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        if (search) {
          params.set("search", search);
          params.set("page", "1");
        } else {
          params.delete("search");
          params.set("page", "1");
        }
        return params;
      });
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-2 lg:p-6 space-y-6 lg:space-y-8">
        {/* Enhanced Header Section */}
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-blue-100 rounded-3xl blur-3xl"></div>

          <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl p-4 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 lg:p-3 bg-blue-600 rounded-xl shadow-lg">
                    <Users className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {t("patients.title")}
                    </h1>
                    <p className="text-sm lg:text-base text-gray-600 mt-1 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">{t("patients.subtitle")}</span>
                      <span className="sm:hidden">{t("patients.subtitleShort")}</span>
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setOpen(true)}
                className="px-4 lg:px-6 py-2 lg:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-semibold text-sm lg:text-base"
              >
                <Plus className="h-4 w-4 lg:h-5 lg:w-5" />
                <span className="hidden sm:inline">{t("patients.newPatient")}</span>
                <span className="sm:hidden">{t("common.add")}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Content Section */}
        <div className="relative">
          <Card className="shadow-xl border-0 bg-white">
            <CardHeader className="p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl lg:text-2xl font-semibold text-gray-800">
                    {t("patients.patientList")}
                  </CardTitle>
                  <p className="text-sm lg:text-base text-gray-600 mt-1">
                    {t("patients.totalPatients", { count: patients?.totalElements || 0 })}
                  </p>
                </div>

                {/* Search Section */}
                <div className="relative w-full lg:max-w-md">
                  <Input
                    type="text"
                    placeholder={t("patients.searchPlaceholder")}
                    className="w-full pl-10 pr-4 py-2 lg:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-sm lg:text-base"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 lg:p-6">
              {/* Desktop Table */}
              <div className="hidden lg:block border border-gray-200 rounded-xl overflow-hidden bg-white">
                <Table className="min-w-full">
                  <TableHeader className="bg-gray-50 border-b border-gray-200">
                    <TableRow>
                      <TableCell className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        {t("patients.fullName")}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        {t("common.id")}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        {t("patients.contact")}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        {t("common.email")}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        {t("patients.location")}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        {t("common.actions")}
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-200">
                    {(isLoading || isSearching) ? (
                      <TableRow>
                        <TableCell colSpan={6} className="py-8 text-center">
                          <div className="flex justify-center items-center">
                            <Loading size="lg" showLogo={false} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (patients?.data.map((patient) => (
                      <TableRow key={patient.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm mr-3 overflow-hidden">
                              {patient.profileImage ? (
                                <img
                                  src={patient.profileImage}
                                  alt={`${patient.firstName} ${patient.lastName}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                `${patient.firstName.charAt(0)}${patient.lastName.charAt(0)}`
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {patient.firstName} {patient.lastName}
                              </div>
                              <div className="text-xs text-gray-500">{t("patients.patient")}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                          {patient.id}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            {patient.phoneNumbers?.[0]?.phonenumber || t("common.na")}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                            {patient.email}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {patient.city && patient.country ? (
                              <span>{patient.city}, {patient.country}</span>
                            ) : patient.city ? (
                              <span>{patient.city}</span>
                            ) : patient.country ? (
                              <span>{patient.country}</span>
                            ) : (
                              <span className="text-gray-400">{t("common.notSet")}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/patients/${patient.id}/details`}
                              className="text-blue-600 hover:text-blue-800 flex items-center justify-center transition-colors duration-200 hover:bg-blue-50 px-3 py-2 rounded-lg"
                            >
                              <Eye size={16} />
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(patient)}
                              disabled={isDeleting}
                              className="text-red-600 hover:text-red-800 flex items-center cursor-pointer transition-colors duration-200 hover:bg-red-50 px-3 py-2 rounded-lg"
                            >
                              <Trash size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setPatientToEdit(patient);
                                setOpen(true);
                              }}
                              disabled={isDeleting}
                              className="text-blue-600 hover:text-blue-800 flex items-center cursor-pointer transition-colors duration-200 hover:bg-blue-50 px-3 py-2 rounded-lg"
                            >
                              <Pencil size={16} />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4 p-4">
                {(isLoading || isSearching) ? (
                  <div className="w-full flex justify-center items-center py-8">
                    <Loading size="lg" showLogo={false} />
                  </div>
                ) : (
                  patients?.data.map((patient) => (
                    <div key={patient.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm mr-3 overflow-hidden">
                            {patient.profileImage ? (
                              <img
                                src={patient.profileImage}
                                alt={`${patient.firstName} ${patient.lastName}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              `${patient.firstName.charAt(0)}${patient.lastName.charAt(0)}`
                            )}
                          </div>
                          <div>
                            <div className="text-base font-semibold text-gray-900">
                              {patient.firstName} {patient.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{t("patients.patient")} #{patient.id}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Link
                            to={`/patients/${patient.id}/details`}
                            className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                          >
                            <Eye size={16} />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(patient)}
                            disabled={isDeleting}
                            className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                          >
                            <Trash size={16} />
                          </button>
                          <button
                            onClick={() => {
                                setPatientToEdit(patient);
                                setOpen(true);
                              }}
                            disabled={isDeleting}
                            className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                          >
                            <Pencil size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{patient.phoneNumbers?.[0]?.phonenumber || 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{patient.email}</span>
                        </div>
                        {(patient.city || patient.country) && (
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="truncate">
                              {patient.city && patient.country ? (
                                <span>{patient.city}, {patient.country}</span>
                              ) : patient.city ? (
                                <span>{patient.city}</span>
                              ) : (
                                <span>{patient.country}</span>
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Enhanced Pagination */}
              <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 lg:p-0">
                <div className="text-sm text-gray-600 text-center sm:text-left">
                  {t("patients.showPatient", { shown: patients?.data.length || 0, total: patients?.totalElements || 0 })}
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
                    <span className="hidden sm:inline">{t("common.previous")}</span>
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
                    disabled={patients && page >= patients.totalPages}
                  >
                    <span className="hidden sm:inline">{t("common.next")}</span>
                    <span className="sm:hidden">→</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AddPatientModal
        open={open}
        setOpen={handleCloseModal}
        patient={patientToEdit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={!!deleteConfirmId}
        onOpenChange={(open) => !open && handleCancelDelete()}
        title={t("patients.deleteConfirmation")}
        description={t("patients.deleteDescription")}
        variant="destructive"
        confirmText={t("patients.deletePatient")}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      >
        {patientToDelete && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                {patientToDelete.profileImage ? (
                  <img
                    src={patientToDelete.profileImage}
                    alt={`${patientToDelete.firstName} ${patientToDelete.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  `${patientToDelete.firstName.charAt(0)}${patientToDelete.lastName.charAt(0)}`
                )}
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {patientToDelete.firstName} {patientToDelete.lastName}
                </div>
                <div className="text-sm text-gray-600">ID: {patientToDelete.id}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{patientToDelete.phoneNumbers?.[0]?.phonenumber || t("common.na")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{patientToDelete.email}</span>
            </div>
            {(patientToDelete.city || patientToDelete.country) && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {patientToDelete.city && patientToDelete.country ? (
                    <span>{patientToDelete.city}, {patientToDelete.country}</span>
                  ) : patientToDelete.city ? (
                    <span>{patientToDelete.city}</span>
                  ) : (
                    <span>{patientToDelete.country}</span>
                  )}
                </span>
              </div>
            )}
          </div>
        )}
      </ConfirmDialog>
    </div>
  );
};
