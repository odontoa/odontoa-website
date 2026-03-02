import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { FaBrain } from "react-icons/fa";
import { FormFields } from "./ClinicalAssessmentForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAnalysisEditingMode } from "@/hooks/store/useAnalysisEditingMode";

interface FunctionalAssessment {
  notes?: string;
  speech?: string;
  chewingTemporalis?: string;
  chewingMasseter?: string;
  swallowing?: string;
  breathing?: string;
  prematureContact?: string;
  forcedBite?: string;
  mandibularMobility?: string;
}

interface FunctionalAssessmentSectionProps {
  setValue: UseFormSetValue<FormFields>;
  register: UseFormRegister<FormFields>;
  functionalAssessment: FunctionalAssessment;
}

export default function FunctionalAssessmentSection({
  setValue,
  register,
  functionalAssessment,
}: FunctionalAssessmentSectionProps) {
  const { isEditing } = useAnalysisEditingMode();

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <FaBrain className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            Funkcionalna Procena
          </h3>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prevremeni Kontakt
            </label>
            {isEditing ? (
              <Input
                defaultValue={
                  functionalAssessment.prematureContact ?? undefined
                }
                type="text"
                {...register("functionalAssessment.prematureContact")}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-primary focus:border-primary"
                placeholder="Opišite prevremeni kontakt"
              />
            ) : (
              <p className="text-gray-800 bg-gray-50 text-sm max-h-[36px] p-2 pl-4 rounded-lg">
                {functionalAssessment.prematureContact
                  ? functionalAssessment.prematureContact
                  : "Nije uneto"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prinudni Zagrizaj
            </label>
            {isEditing ? (
              <Input
                defaultValue={functionalAssessment.forcedBite ?? undefined}
                type="text"
                {...register("functionalAssessment.forcedBite")}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-primary focus:border-primary"
                placeholder="Opišite prinudni zagrizaj"
              />
            ) : (
              <p className="text-gray-800 bg-gray-50 text-sm max-h-[36px] p-2 pl-4 rounded-lg">
                {functionalAssessment.forcedBite
                  ? functionalAssessment.forcedBite
                  : "Nije uneto"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pokretljivost Donje Vilice
            </label>
            {isEditing ? (
              <Input
                defaultValue={
                  functionalAssessment.mandibularMobility ?? undefined
                }
                type="text"
                {...register("functionalAssessment.mandibularMobility")}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-primary focus:border-primary"
                placeholder="Opišite pokretljivost"
              />
            ) : (
              <p className="text-gray-800 bg-gray-50 text-sm max-h-[36px] p-2 pl-4 rounded-lg">
                {functionalAssessment.mandibularMobility
                  ? functionalAssessment.mandibularMobility
                  : "Nije uneto"}
              </p>
            )}
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Disanje
            </Label>
            {isEditing ? (
              <Select
                defaultValue={functionalAssessment.breathing ?? undefined}
                onValueChange={(value) =>
                  setValue("functionalAssessment.breathing", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Izaberite uslugu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kroz nos">Kroz nos</SelectItem>
                  <SelectItem value="Kroz usta">Kroz usta</SelectItem>
                  <SelectItem value="Kombinovano">Kombinovano</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-gray-800 bg-gray-50 text-sm max-h-[36px] p-2 pl-4 rounded-lg">
                {functionalAssessment.breathing
                  ? functionalAssessment.breathing
                  : "Nije uneto"}
              </p>
            )}
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Gutanje
            </Label>
            {isEditing ? (
              <Select
                defaultValue={functionalAssessment.swallowing ?? undefined}
                onValueChange={(value) =>
                  setValue("functionalAssessment.swallowing", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Izaberite uslugu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Zrelo">Zrelo</SelectItem>
                  <SelectItem value="Infantilno">Infantilno</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-gray-800 bg-gray-50 text-sm max-h-[36px] p-2 pl-4 rounded-lg">
                {functionalAssessment.swallowing
                  ? functionalAssessment.swallowing
                  : "Nije uneto"}
              </p>
            )}
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Žvakanje (Masseteri)
            </Label>
            {isEditing ? (
              <Select
                defaultValue={functionalAssessment.chewingMasseter ?? undefined}
                onValueChange={(value) =>
                  setValue("functionalAssessment.chewingMasseter", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Izaberite uslugu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Obostrano">Obostrano</SelectItem>
                  <SelectItem value="Jednostrano levo">
                    Jednostrano levo
                  </SelectItem>
                  <SelectItem value="Jednostrano desno">
                    Jednostrano desno
                  </SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-gray-800 bg-gray-50 text-sm max-h-[36px] p-2 pl-4 rounded-lg">
                {functionalAssessment.chewingMasseter
                  ? functionalAssessment.chewingMasseter
                  : "Nije uneto"}
              </p>
            )}
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Žvakanje (Temporalisi)
            </Label>
            {isEditing ? (
              <Select
                defaultValue={
                  functionalAssessment.chewingTemporalis ?? undefined
                }
                onValueChange={(value) =>
                  setValue("functionalAssessment.chewingTemporalis", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Izaberite uslugu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Obostrano">Obostrano</SelectItem>
                  <SelectItem value="Jednostrano levo">
                    Jednostrano levo
                  </SelectItem>
                  <SelectItem value="Jednostrano desno">
                    Jednostrano desno
                  </SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-gray-800 bg-gray-50 text-sm max-h-[36px] p-2 pl-4 rounded-lg">
                {functionalAssessment.chewingTemporalis
                  ? functionalAssessment.chewingTemporalis
                  : "Nije uneto"}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Govor
            </Label>
            {isEditing ? (
              <Textarea
                defaultValue={functionalAssessment.speech ?? undefined}
                {...register("functionalAssessment.speech")}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-primary focus:border-primary"
                rows={2}
                placeholder="Opišite govor pacijenta..."
              />
            ) : (
              <p className="text-gray-800 bg-gray-50 text-sm max-h-[36px] p-2 pl-4 rounded-lg">
                {functionalAssessment.speech
                  ? functionalAssessment.speech
                  : "Nije uneto"}
              </p>
            )}
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Ostale Napomene
            </Label>
            {isEditing ? (
              <Textarea
                defaultValue={functionalAssessment.notes ?? undefined}
                {...register("functionalAssessment.notes")}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-primary focus:border-primary"
                rows={3}
                placeholder="Unesite dodatna zapažanja..."
              />
            ) : (
              <p className="text-gray-800 bg-gray-50 text-sm max-h-[36px] p-2 pl-4 rounded-lg">
                {functionalAssessment.notes
                  ? functionalAssessment.notes
                  : "Nije uneto"}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
