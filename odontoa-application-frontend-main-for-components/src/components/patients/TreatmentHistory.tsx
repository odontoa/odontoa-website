import { useState, useEffect } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaTooth,
  FaUserMd,
  FaCalendarAlt,
  FaPencilAlt,
  FaSyringe,
  FaTeeth,
  FaMagic,
  FaRegClock,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { getDateFnsLocale } from "@/lib/utils";

interface Treatment {
  id: string;
  date: string;
  toothNumber: number | null;
  procedure: string;
  dentist: string;
  notes: string;
  status: "done" | "pending";
  type: "medical" | "cosmetic";
}

interface TreatmentHistoryProps {
  selectedTooth: number | null;
  serviceType: "all" | "medical" | "cosmetic";
  statusFilter: "all" | "done" | "pending";
  searchTerm?: string;
  periodFilter?: "all" | "month" | "three_months" | "six_months" | "year";
  sortOrder?: "newest" | "oldest";
}

// Funkcija za dobijanje odgovarajuće ikonice za proceduru
function getTreatmentIcon(procedure: string, type: string) {
  const iconClassName = "h-6 w-6";

  if (
    procedure.toLowerCase().includes("lečenje") ||
    procedure.toLowerCase().includes("lecenje")
  ) {
    return <FaSyringe className={`${iconClassName} text-blue-600`} />;
  }

  if (procedure.toLowerCase().includes("plomba")) {
    return <FaTeeth className={`${iconClassName} text-gray-600`} />;
  }

  if (
    procedure.toLowerCase().includes("vađenje") ||
    procedure.toLowerCase().includes("vadjenje")
  ) {
    return <FaTooth className={`${iconClassName} text-red-600`} />;
  }

  if (
    procedure.toLowerCase().includes("rutinski") ||
    procedure.toLowerCase().includes("pregled")
  ) {
    return <FaUserMd className={`${iconClassName} text-green-600`} />;
  }

  if (procedure.toLowerCase().includes("izbeljivanje")) {
    return <FaMagic className={`${iconClassName} text-purple-600`} />;
  }

  if (type === "cosmetic") {
    return <FaMagic className={`${iconClassName} text-purple-600`} />;
  }

  return <FaPencilAlt className={`${iconClassName} text-primary`} />;
}

// Mock data for treatments - in a real app this would come from an API
const mockTreatments: Treatment[] = [
  {
    id: "t1",
    date: "2023-06-10",
    toothNumber: 11,
    procedure: "Lečenje kanala korena",
    dentist: "Dr Milan Petrović",
    notes: "Kompletan tretman sa kontrolom za 2 nedelje",
    status: "done",
    type: "medical",
  },
  {
    id: "t2",
    date: "2023-06-15",
    toothNumber: 21,
    procedure: "Kompozitna plomba",
    dentist: "Dr Jovana Nikolić",
    notes: "Popunjena šupljina, pacijent treba da izbegava tvrdu hranu 24 sata",
    status: "done",
    type: "medical",
  },
  {
    id: "t3",
    date: "2023-07-05",
    toothNumber: 36,
    procedure: "Vađenje zuba",
    dentist: "Dr Milan Petrović",
    notes: "Zub je bio nepopravljiv i izvađen je",
    status: "done",
    type: "medical",
  },
  {
    id: "t4",
    date: "2023-08-10",
    toothNumber: 22,
    procedure: "Izbeljivanje zuba",
    dentist: "Dr Jovana Nikolić",
    notes: "Prva sesija završena, još dve sesije zakazane",
    status: "pending",
    type: "cosmetic",
  },
  {
    id: "t5",
    date: "2023-09-01",
    toothNumber: 46,
    procedure: "Postavljanje krunice",
    dentist: "Dr Ana Marković",
    notes: "Krunica uspešno postavljena",
    status: "done",
    type: "medical",
  },
  {
    id: "t6",
    date: "2023-10-15",
    toothNumber: null,
    procedure: "Rutinski pregled",
    dentist: "Dr Milan Petrović",
    notes: "Redovno čišćenje i pregled",
    status: "done",
    type: "medical",
  },
  {
    id: "t7",
    date: "2023-11-20",
    toothNumber: null,
    procedure: "Invisalign nameštanje",
    dentist: "Dr Ana Marković",
    notes: "Početno nameštanje za kozmetičko poravnanje",
    status: "pending",
    type: "cosmetic",
  },
];

export default function TreatmentHistory({
  selectedTooth,
  serviceType,
  statusFilter,
  searchTerm = "",
  periodFilter = "all",
  sortOrder = "newest",
}: TreatmentHistoryProps) {
  const { t, i18n } = useTranslation();
  const [filteredTreatments, setFilteredTreatments] = useState<Treatment[]>([]);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(
    null
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [expandedTreatments, setExpandedTreatments] = useState<Set<string>>(
    new Set()
  );

  // Filter treatments based on all criteria
  useEffect(() => {
    let filtered = [...mockTreatments];

    // Filter by tooth if selected
    if (selectedTooth !== null) {
      filtered = filtered.filter(
        (treatment) =>
          treatment.toothNumber === selectedTooth ||
          treatment.toothNumber === null
      );
    }

    // Filter by service type
    if (serviceType !== "all") {
      filtered = filtered.filter((treatment) => treatment.type === serviceType);
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (treatment) => treatment.status === statusFilter
      );
    }

    // Filter by search term (case insensitive)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (treatment) =>
          treatment.procedure.toLowerCase().includes(term) ||
          treatment.dentist.toLowerCase().includes(term) ||
          (treatment.toothNumber &&
            treatment.toothNumber.toString().includes(term))
      );
    }

    // Filter by period
    if (periodFilter !== "all") {
      const now = new Date();
      let cutoffDate = new Date();

      switch (periodFilter) {
        case "month":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case "three_months":
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case "six_months":
          cutoffDate.setMonth(now.getMonth() - 6);
          break;
        case "year":
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(
        (treatment) => new Date(treatment.date) >= cutoffDate
      );
    }

    // Sort by date
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredTreatments(filtered);
  }, [
    selectedTooth,
    serviceType,
    statusFilter,
    searchTerm,
    periodFilter,
    sortOrder,
  ]);

  const openDetailView = (treatment: Treatment, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling the accordion when clicking the button
    setSelectedTreatment(treatment);
    setShowDetailModal(true);
  };

  // Toggle expanded state for a treatment
  const toggleTreatment = (treatmentId: string) => {
    setExpandedTreatments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(treatmentId)) {
        newSet.delete(treatmentId);
      } else {
        newSet.add(treatmentId);
      }
      return newSet;
    });
  };

  // Check if a treatment is expanded
  const isTreatmentExpanded = (treatmentId: string) => {
    return expandedTreatments.has(treatmentId);
  };

  if (filteredTreatments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>{t("patientComponents.treatmentHistory.noRecords")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredTreatments.map((treatment) => (
        <div
          key={treatment.id}
          className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
        >
          <div
            onClick={() => toggleTreatment(treatment.id)}
            className="p-4 cursor-pointer transition-colors hover:bg-gray-50"
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {getTreatmentIcon(treatment.procedure, treatment.type)}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      {treatment.procedure}
                    </h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-1 text-gray-400" />
                        {format(new Date(treatment.date), "dd.MM.yyyy", { locale: getDateFnsLocale(i18n.language) })}
                      </div>

                      {treatment.toothNumber && (
                        <div className="flex items-center">
                          <FaTooth className="mr-1 text-gray-400" />
                          {t("patientComponents.treatmentHistory.tooth")} {treatment.toothNumber}
                        </div>
                      )}

                      <div className="flex items-center">
                        <FaUserMd className="mr-1 text-gray-400" />
                        {treatment.dentist}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        treatment.type === "medical"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {treatment.type === "medical"
                        ? t("patientComponents.treatmentHistory.medical")
                        : t("patientComponents.treatmentHistory.cosmetic")}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                        treatment.status === "done"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {treatment.status === "pending" && (
                        <FaRegClock className="text-yellow-800" />
                      )}
                      {treatment.status === "done" ? t("patientComponents.treatmentHistory.completed") : t("patientComponents.treatmentHistory.inProgress")}
                    </span>
                    <div className="transition-transform duration-300">
                      {isTreatmentExpanded(treatment.id) ? (
                        <FaChevronUp className="text-gray-400" />
                      ) : (
                        <FaChevronDown className="text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isTreatmentExpanded(treatment.id)
                ? "max-h-96 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="p-4 border-t bg-gray-50">
              <p className="text-sm text-gray-700 mb-4">{treatment.notes}</p>

              <div className="flex justify-end">
                <button
                  className="text-primary px-4 py-2 text-sm bg-white rounded border border-primary transition-colors hover:bg-blue-50 focus:ring-2 focus:ring-primary/40"
                  onClick={(e) => openDetailView(treatment, e)}
                >
                  {t("patientComponents.treatmentHistory.detailedView")}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Modal za detaljni prikaz terapije */}
      {showDetailModal && selectedTreatment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                {getTreatmentIcon(
                  selectedTreatment.procedure,
                  selectedTreatment.type
                )}
                <h2 className="text-xl font-bold">
                  {selectedTreatment.procedure}
                </h2>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 text-xs">{t("patientComponents.treatmentHistory.date")}</p>
                <p className="font-medium flex items-center">
                  <FaCalendarAlt className="mr-2 text-gray-400" />
                  {format(new Date(selectedTreatment.date), "dd.MM.yyyy", { locale: getDateFnsLocale(i18n.language) })}
                </p>
              </div>

              {selectedTreatment.toothNumber && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-xs">{t("patientComponents.treatmentHistory.tooth")}</p>
                  <p className="font-medium flex items-center">
                    <FaTooth className="mr-2 text-gray-400" />
                    {selectedTreatment.toothNumber}
                  </p>
                </div>
              )}

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 text-xs">{t("patientComponents.treatmentHistory.dentist")}</p>
                <p className="font-medium flex items-center">
                  <FaUserMd className="mr-2 text-gray-400" />
                  {selectedTreatment.dentist}
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 text-xs">{t("patientComponents.treatmentHistory.type")}</p>
                <p className="font-medium">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedTreatment.type === "medical"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {selectedTreatment.type === "medical"
                      ? t("patientComponents.treatmentHistory.medical")
                      : t("patientComponents.treatmentHistory.cosmetic")}
                  </span>
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 text-xs">{t("patientComponents.treatmentHistory.status")}</p>
                <p className="font-medium">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedTreatment.status === "done"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedTreatment.status === "done"
                      ? t("patientComponents.treatmentHistory.completed")
                      : t("patientComponents.treatmentHistory.inProgress")}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-gray-500 text-xs mb-1">{t("patientComponents.treatmentHistory.notes")}</p>
              <p className="text-gray-700">{selectedTreatment.notes}</p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                {t("patientComponents.treatmentHistory.close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
