import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { predefinedMedicalConditions } from "@/lib/constants";
import { useMedicalConditionModal } from "@/hooks/store/useMedicalConditionModal";
import { useCreateMedicalCondition } from "@/hooks/patients/useCreateMedicalCondition";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

export default function MedicalConditionModal() {
  const { t } = useTranslation();
  const { isOpen, selectedCondition, isAddDetailsOpen, selectCondition, closeAddDetails, reset } = useMedicalConditionModal();
  const createMutation = useCreateMedicalCondition();
  const [description, setDescription] = useState("");

  const handleSelectCondition = (condition: string) => {
    selectCondition(condition);
  };

  const handleAddCondition = () => {
    if (selectedCondition) {
      createMutation.mutate(
        {
          name: selectedCondition,
          description: description || undefined,
        },
        {
          onSuccess: () => {
            reset();
            setDescription("");
          },
        }
      );
    }
  };

  const handleClose = () => {
    reset();
    setDescription("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {!isAddDetailsOpen ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-800">
                {t("medicalCondition.addMedicalCondition")}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {t("medicalCondition.addMedicalConditionDescription")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-3 max-h-96">
                {predefinedMedicalConditions.map((condition, index) => (
                  <div 
                    key={index} 
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50/50 transition-colors duration-200 cursor-pointer"
                    onClick={() => handleSelectCondition(condition)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{condition}</h4>
                      </div>
                      <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                {t("medicalCondition.close")}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-800">
                {t("medicalCondition.addDetails")}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {t("medicalCondition.addDetailsDescription")} <strong>{selectedCondition}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800">{selectedCondition}</h4>
                <p className="text-sm text-blue-600 mt-1">{t("medicalCondition.medicalConditionDescription")}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition-notes" className="text-sm font-medium text-gray-700">
                  {t("medicalCondition.patientSpecificNotes")}
                </Label>
                <Textarea
                  id="condition-notes"
                  placeholder={t("medicalCondition.patientSpecificNotesPlaceholder")}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500">
                  {t("medicalCondition.patientSpecificNotesHelp")}
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={closeAddDetails}>
                {t("medicalCondition.back")}
              </Button>
              <Button 
                onClick={handleAddCondition} 
                disabled={createMutation.isPending}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {createMutation.isPending ? t("medicalCondition.adding") : t("medicalCondition.addCondition")}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
} 