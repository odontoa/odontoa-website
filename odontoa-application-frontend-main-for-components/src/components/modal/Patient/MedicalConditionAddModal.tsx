import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateMedicalCondition } from "@/hooks/patients/useCreateMedicalCondition";
import { MedicalCondition } from "@/types/MedicalCondition";
import { predefinedMedicalConditions } from "@/lib/constants";
import { useTranslation } from "react-i18next";

interface MedicalConditionAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  condition?: MedicalCondition | null;
}

export default function MedicalConditionAddModal({
  isOpen,
  onClose,
}: MedicalConditionAddModalProps) {
  const { t } = useTranslation();
  const createMutation = useCreateMedicalCondition();

  const handleSelectCondition = (conditionName: string) => {
    createMutation.mutate(
      {
        name: conditionName,
        description: `Patient has ${conditionName}`,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("medicalCondition.addMedicalCondition")}</DialogTitle>
          <DialogDescription>
            {t("medicalCondition.addMedicalConditionDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-2 max-h-96">
            {
              predefinedMedicalConditions.map((condition, index) => (
                <div key={index} className="border rounded-lg p-3 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{condition}</h4>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleSelectCondition(condition)} className="ml-2">
                      {t("medicalCondition.add")}
                    </Button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("medicalCondition.close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 