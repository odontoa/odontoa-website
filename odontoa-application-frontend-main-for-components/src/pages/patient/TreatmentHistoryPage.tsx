import TreatmentHistory from "@/components/patients/TreatmentHistory";
import { useState } from "react";
import {
  FaFileExport,
  FaFilter,
  FaPrint,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function TreatmentHistoryPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceType, setServiceType] = useState<
    "all" | "medical" | "cosmetic"
  >("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "done" | "pending">(
    "all"
  );
  const [periodFilter, setPeriodFilter] = useState<
    "all" | "month" | "three_months" | "six_months" | "year"
  >("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Enhanced Header Section */}
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl"></div>

        <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl p-4 lg:p-8">
          <div className="flex items-center gap-3">
            <div className="p-2 lg:p-3 bg-green-600 rounded-xl shadow-lg">
              <FileText className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {t("treatmentHistory.title")}
              </h1>
              <p className="text-sm lg:text-base text-gray-600 mt-1 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {t("treatmentHistory.subtitle")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative">
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="p-4 lg:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="text-xl lg:text-2xl font-semibold text-gray-800">
                {t("treatmentHistory.treatmentHistoryTitle")}
              </CardTitle>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
                >
                  <FaPrint className="text-gray-600" />
                  <span className="hidden sm:inline">{t("treatmentHistory.print")}</span>
                </button>

                <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors">
                  <FaFileExport className="text-gray-600" />
                  <span className="hidden sm:inline">{t("treatmentHistory.export")}</span>
                </button>

                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
                  }
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
                >
                  {sortOrder === "newest" ? (
                    <FaSortAmountDown className="text-gray-600" />
                  ) : (
                    <FaSortAmountUp className="text-gray-600" />
                  )}
                  <span className="hidden sm:inline">
                    {sortOrder === "newest"
                      ? t("treatmentHistory.newestFirst")
                      : t("treatmentHistory.oldestFirst")}
                  </span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium transition-colors hover:shadow-lg"
                  >
                    <FaFilter />
                    <span className="hidden sm:inline">{t("treatmentHistory.filters")}</span>
                  </button>

                  {isFilterMenuOpen && (
                    <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg p-4 z-10 w-64 border border-gray-200">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            {t("treatmentHistory.serviceType")}
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setServiceType("all")}
                              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                serviceType === "all"
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {t("treatmentHistory.all")}
                            </button>
                            <button
                              onClick={() => setServiceType("medical")}
                              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                serviceType === "medical"
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {t("treatmentHistory.medical")}
                            </button>
                            <button
                              onClick={() => setServiceType("cosmetic")}
                              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                serviceType === "cosmetic"
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {t("treatmentHistory.cosmetic")}
                            </button>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            {t("treatmentHistory.status")}
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setStatusFilter("all")}
                              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                statusFilter === "all"
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {t("treatmentHistory.all")}
                            </button>
                            <button
                              onClick={() => setStatusFilter("done")}
                              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                statusFilter === "done"
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {t("treatmentHistory.completed")}
                            </button>
                            <button
                              onClick={() => setStatusFilter("pending")}
                              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                statusFilter === "pending"
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {t("treatmentHistory.inProgress")}
                            </button>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            {t("treatmentHistory.period")}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => setPeriodFilter("all")}
                              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                periodFilter === "all"
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {t("treatmentHistory.allTime")}
                            </button>
                            <button
                              onClick={() => setPeriodFilter("month")}
                              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                periodFilter === "month"
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {t("treatmentHistory.oneMonth")}
                            </button>
                            <button
                              onClick={() => setPeriodFilter("three_months")}
                              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                periodFilter === "three_months"
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {t("treatmentHistory.threeMonths")}
                            </button>
                            <button
                              onClick={() => setPeriodFilter("six_months")}
                              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                periodFilter === "six_months"
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {t("treatmentHistory.sixMonths")}
                            </button>
                            <button
                              onClick={() => setPeriodFilter("year")}
                              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                periodFilter === "year"
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {t("treatmentHistory.oneYear")}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 lg:p-6">
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t("treatmentHistory.searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Segmenti za planirane tretmane i istoriju */}
            <div className="space-y-8">
              {/* Planirani tretmani */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  {t("treatmentHistory.plannedTreatments")}
                </h3>

                <TreatmentHistory
                  selectedTooth={null}
                  serviceType={serviceType}
                  statusFilter="pending"
                  searchTerm={searchTerm}
                  periodFilter={periodFilter}
                  sortOrder={sortOrder}
                />
              </div>

              {/* Istorija tretmana */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  {t("treatmentHistory.treatmentHistoryTitle")}
                </h3>

                <TreatmentHistory
                  selectedTooth={null}
                  serviceType={serviceType}
                  statusFilter="done"
                  searchTerm={searchTerm}
                  periodFilter={periodFilter}
                  sortOrder={sortOrder}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
