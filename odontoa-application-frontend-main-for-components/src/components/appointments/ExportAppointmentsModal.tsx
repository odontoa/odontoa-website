import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Download, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ExportAppointmentsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ExportAppointmentsModal({
    isOpen,
    onClose,
}: ExportAppointmentsModalProps) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleNavigateToExport = () => {
        navigate("/appointments/export");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Download className="h-5 w-5" />
                        {t("components.exportAppointmentsModal.exportAppointments")}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="text-center space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-gray-700">
                                {t("components.exportAppointmentsModal.advancedOptions")}
                            </p>
                        </div>
                        
                        <div className="space-y-2">
                            <h3 className="font-semibold text-gray-900">{t("components.exportAppointmentsModal.availableOptions")}</h3>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>{t("components.exportAppointmentsModal.periodSelection")}</li>
                                <li>{t("components.exportAppointmentsModal.filterByStatus")}</li>
                                <li>{t("components.exportAppointmentsModal.detailedPatientSelection")}</li>
                                <li>{t("components.exportAppointmentsModal.patientSearch")}</li>
                                <li>{t("components.exportAppointmentsModal.allOrIndividual")}</li>
                            </ul>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={onClose}>
                            {t("components.exportAppointmentsModal.cancel")}
                        </Button>
                        <Button
                            onClick={handleNavigateToExport}
                            className="flex items-center gap-2"
                        >
                            {t("components.exportAppointmentsModal.goToExportPage")}
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
