import { useState, useRef, useMemo } from "react";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loading } from "@/components/ui/loading";
import { useGetPatientsInfinite } from "@/hooks/patients/useGetPatients";
import { useDebounce, cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface PatientSelectorProps {
  value: string | null;
  onValueChange: (patientId: string | null) => void;
  showAllOption?: boolean;
  allOptionLabel?: string;
  className?: string;
}

export const PatientSelector = ({
  value,
  onValueChange,
  showAllOption = true,
  allOptionLabel,
  className,
}: PatientSelectorProps) => {
  const { t } = useTranslation();
  const [patientSearch, setPatientSearch] = useState("");
  const debouncedSearch = useDebounce(patientSearch, 300);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const {
    data: patientsData,
    isLoading: patientsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetPatientsInfinite({
    search: debouncedSearch,
  });

  // Flatten all pages into a single array and sort by ID (newest first)
  const patients = patientsData?.pages.flatMap((page: any) => page.data) || [];
  const sortedPatients = [...patients].sort((a, b) => b.id - a.id);

  // If value is "all", don't show it in the list
  const allPatients = useMemo(() => {
    if (value === "all") {
      return sortedPatients;
    }
    
    // If we have a selected patient that's not in the current list, add it
    if (value && value !== "all") {
      const selectedPatient = sortedPatients.find(p => p.id.toString() === value);
      if (!selectedPatient) {
        // Patient might not be in current page, but we'll handle it via the value prop
        return sortedPatients;
      }
    }
    
    return sortedPatients;
  }, [sortedPatients, value]);

  const handlePatientSelect = (patientId: string) => {
    onValueChange(patientId);
    setPatientSearch("");
  };

  const handleSelectAll = () => {
    onValueChange("all");
    setPatientSearch("");
  };

  const selectedPatient = value && value !== "all" 
    ? allPatients.find(p => p.id.toString() === value)
    : null;

  const defaultAllLabel = allOptionLabel || t("finance.allPatients");

  return (
    <div className={cn("space-y-3", className)}>
      <div className="relative">
        <Input
          placeholder={t("appointments.searchPatientsPlaceholder")}
          value={patientSearch}
          onChange={(e) => setPatientSearch(e.target.value)}
          className="w-full pl-10"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      {/* Selected patient indicator */}
      {selectedPatient && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-800">
              {t("appointments.selectedPatient")}: {selectedPatient.firstName} {selectedPatient.lastName}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                onValueChange(showAllOption ? "all" : null);
              }}
              className="ml-auto h-6 px-2 text-green-600 hover:bg-green-100"
            >
              ✕
            </Button>
          </div>
        </div>
      )}

      {value === "all" && showAllOption && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-blue-800">
              {defaultAllLabel}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onValueChange(null)}
              className="ml-auto h-6 px-2 text-blue-600 hover:bg-blue-100"
            >
              ✕
            </Button>
          </div>
        </div>
      )}
      
      <div className="border rounded-lg">
        {patientsLoading ? (
          <div className="p-8 text-center">
            <Loading size="sm" showLogo={false} />
          </div>
        ) : allPatients.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <p className="text-gray-500">{t("appointments.noPatientsFound")}</p>
          </div>
        ) : (
          <>
            {/* Patient list header */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">{t("appointments.patientList")}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {allPatients.length} {allPatients.length !== 1 ? t("appointments.patients") : t("appointments.patient")}
                  </span>
                  {debouncedSearch && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {t("appointments.filtered")}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <ScrollArea 
              className="h-64"
              ref={scrollAreaRef}
            >
              <div className="p-2 space-y-2">
                {/* All option */}
                {showAllOption && (
                  <div
                    onClick={handleSelectAll}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-200 border-2",
                      value === "all"
                        ? "bg-blue-100 border-blue-500 shadow-md ring-2 ring-blue-200"
                        : "hover:bg-blue-50 border-transparent hover:border-blue-200"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "w-3 h-3 rounded-full border-2 transition-colors",
                        value === "all"
                          ? "bg-blue-500 border-blue-500"
                          : "border-gray-300"
                      )} />
                      <div className="flex-1">
                        <div className={cn(
                          "font-medium transition-colors",
                          value === "all" ? "text-blue-900" : "text-gray-900"
                        )}>
                          {defaultAllLabel}
                        </div>
                      </div>
                    </div>
                    <Check
                      className={cn(
                        "h-5 w-5 transition-all duration-200",
                        value === "all"
                          ? "opacity-100 text-blue-600 scale-110"
                          : "opacity-0 scale-90"
                      )}
                    />
                  </div>
                )}

                {allPatients.map((patient) => {
                  const isSelected = value === patient.id.toString();
                  return (
                    <div
                      key={patient.id}
                      onClick={() => handlePatientSelect(patient.id.toString())}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-200 border-2",
                        isSelected
                          ? "bg-blue-100 border-blue-500 shadow-md ring-2 ring-blue-200"
                          : "hover:bg-blue-50 border-transparent hover:border-blue-200"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={cn(
                          "w-3 h-3 rounded-full border-2 transition-colors",
                          isSelected
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300"
                        )} />
                        <div className="flex-1">
                          <div className={cn(
                            "font-medium transition-colors",
                            isSelected ? "text-blue-900" : "text-gray-900"
                          )}>
                            {patient.firstName} {patient.lastName}
                          </div>
                        </div>
                      </div>
                      <Check
                        className={cn(
                          "h-5 w-5 transition-all duration-200",
                          isSelected
                            ? "opacity-100 text-blue-600 scale-110"
                            : "opacity-0 scale-90"
                        )}
                      />
                    </div>
                  );
                })}
                
                {/* Load more button */}
                {hasNextPage && (
                  <div className="p-4 text-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="w-full"
                    >
                      {isFetchingNextPage ? (
                        <>
                          <Loading size="sm" showLogo={false} />
                          <span className="ml-2">{t("appointments.loading")}</span>
                        </>
                      ) : (
                        t("appointments.loadMorePatients")
                      )}
                    </Button>
                  </div>
                )}
                
                {/* Loading indicator for auto-scroll */}
                {isFetchingNextPage && (
                  <div className="p-2 text-center">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <Loading size="sm" showLogo={false} />
                      <span>{t("appointments.loadingNewPatients")}</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </>
        )}
      </div>
    </div>
  );
};

