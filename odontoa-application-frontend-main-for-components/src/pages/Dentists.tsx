import { useState, useEffect } from "react";
import { Search, Trash, Users, Phone, Mail, Pencil } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Loading } from "@/components/ui/loading";
import { useSearchParams } from "react-router-dom";
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
import { useDeleteDentist } from "@/hooks/dentists/useDeleteDentist";
import { useGetDentists } from "@/hooks/dentists/useGetDentists";
import AddDentistModal from "@/components/modal/Dentist/AddDentistModal";

export const Dentists = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [dentistToDelete, setDentistToDelete] = useState<any>(null);
  const [dentistToEdit, setDentistToEdit] = useState<any>(null);
  const { mutate: deletedentist, isPending } = useDeleteDentist();

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";

  const [search, setSearch] = useState(searchQuery);

  const {
    data: dentists,
    isLoading,
    error,
    refetch,
  } = useGetDentists(page, searchQuery);

  // Show loading when search is changing
  const isSearching = search !== searchQuery;

  const handleDeleteClick = (dentist: any) => {
    setDentistToDelete(dentist);
    setDeleteConfirmId(dentist.id);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      deletedentist(deleteConfirmId, {
        onSuccess: () => {
          refetch();
          setDeleteConfirmId(null);
          setDentistToDelete(null);
        },
        onError: () => {
          // Keep the dialog open so user can see the error message
          // The error will be shown via toast from the hook
        },
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
    setDentistToDelete(null);
  };

  // When modal closes, clear edit state
  const handleCloseModal = () => {
    setOpen(false);
    setDentistToEdit(null);
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
                      {t("dentists.title")}
                    </h1>
                    <p className="text-sm lg:text-base text-gray-600 mt-1 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span className="hidden sm:inline">{t("dentists.subtitle")}</span>
                      <span className="sm:hidden">{t("dentists.subtitleShort")}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* <Button
                onClick={() => setOpen(true)}
                className="px-4 lg:px-6 py-2 lg:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-semibold text-sm lg:text-base"
              >
                <Plus className="h-4 w-4 lg:h-5 lg:w-5" />
                <span className="hidden sm:inline">Novi doktor</span>
                <span className="sm:hidden">Dodaj</span>
              </Button> */}
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
                    {t("dentists.dentistList")}
                  </CardTitle>
                  <p className="text-sm lg:text-base text-gray-600 mt-1">
                    {t("dentists.totalDentists", { count: dentists?.totalElements || 0 })}
                  </p>
                </div>

                {/* Search Section */}
                <div className="relative w-full lg:max-w-md">
                  <Input
                    type="text"
                    placeholder={t("dentists.searchPlaceholder")}
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
                        {t("dentists.fullName")}
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
                        {t("dentists.userType")}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        {t("common.actions")}
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-200">
                    {(isLoading || isSearching) ? (
                      <TableRow>
                        <TableCell colSpan={5} className="py-8 text-center">
                          <div className="flex justify-center items-center">
                            <Loading size="lg" showLogo={false} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (dentists?.data.map((dentist) => (
                      <TableRow key={dentist.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm mr-3">
                              {dentist.firstName.charAt(0)}{dentist.lastName.charAt(0)}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {dentist.firstName} {dentist.lastName}
                              </div>
                              <div className="text-xs text-gray-500">{t("dentists.doctor")}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                          #{dentist.id}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            {dentist.phone}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                            {dentist.email}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600">
                            {dentist.role}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDeleteClick(dentist)}
                              disabled={isPending}
                              className="text-red-600 hover:text-red-800 flex items-center cursor-pointer transition-colors duration-200 hover:bg-red-50 px-3 py-2 rounded-lg"
                            >
                              <Trash size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setDentistToEdit(dentist);
                                setOpen(true);
                              }}
                              disabled={isPending}
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
                  dentists?.data.map((dentist) => (
                    <div key={dentist.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm mr-3">
                            {dentist.firstName.charAt(0)}{dentist.lastName.charAt(0)}
                          </div>
                          <div>
                            <div className="text-base font-semibold text-gray-900">
                              {dentist.firstName} {dentist.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{t("dentists.doctor")} #{dentist.id}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteClick(dentist)}
                            disabled={isPending}
                            className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                          >
                            <Trash size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setDentistToEdit(dentist);
                              setOpen(true);
                            }}
                            disabled={isPending}
                            className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                          >
                            <Pencil size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{dentist.phone}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{dentist.email}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Enhanced Pagination */}
              <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 lg:p-0">
                <div className="text-sm text-gray-600 text-center sm:text-left">
                  {t("dentists.showDentists", { shown: dentists?.data.length || 0, total: dentists?.totalElements || 0 })}
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
                    disabled={dentists && page >= dentists.totalPages}
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

      <AddDentistModal open={open} setOpen={handleCloseModal} dentist={dentistToEdit} />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={!!deleteConfirmId}
        onOpenChange={(open) => !open && handleCancelDelete()}
        title={t("dentists.deleteConfirmation")}
        description={t("dentists.deleteDescription")}
        variant="destructive"
        confirmText={t("dentists.deleteDentist")}
        onConfirm={handleConfirmDelete}
        loading={isPending}
      >
        {dentistToDelete && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                {dentistToDelete.firstName.charAt(0)}{dentistToDelete.lastName.charAt(0)}
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {dentistToDelete.firstName} {dentistToDelete.lastName}
                </div>
                <div className="text-sm text-gray-600">ID: {dentistToDelete.id}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{dentistToDelete.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{dentistToDelete.email}</span>
            </div>
          </div>
        )}
      </ConfirmDialog>
    </div>
  );
};
