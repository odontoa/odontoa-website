import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Control,
  Controller,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { FaTooth } from "react-icons/fa";
import { FormFields } from "./ClinicalAssessmentForm";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAnalysisEditingMode } from "@/hooks/store/useAnalysisEditingMode";

interface OralFeatures {
  hygiene?: string;
  frenulum?: {
    gornjiLabijalni: boolean;
    donjiLabijalni: boolean;
    labijalni: boolean;
  };
  dentalMidlines?: string;
  angleClassification?: string;
  incisalStep?: string;
  buccalOcclusion?: string;
}

interface OralFeaturesSectionProps {
  setValue: UseFormSetValue<FormFields>;
  register: UseFormRegister<FormFields>;
  control: Control<FormFields, any, FormFields>;
  oralFeatures: OralFeatures;
}

export default function OralFeaturesSection({
  setValue,
  register,
  control,
  oralFeatures,
}: OralFeaturesSectionProps) {
  const { isEditing } = useAnalysisEditingMode();

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <FaTooth className="h-5 w-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            Oralni i Dentalni Detalji
          </h3>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Higijena</Label>
          {isEditing ? (
            <div className="space-y-2">
              <Select
                defaultValue={oralFeatures.hygiene ?? undefined}
                onValueChange={(value) =>
                  setValue("oralFeatures.hygiene", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Izaberite uslugu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dobra">Dobra</SelectItem>
                  <SelectItem value="Loša">Loša</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <p className="text-gray-800 bg-gray-50 text-sm max-h-[36px] p-2 pl-4 rounded-lg">
              {oralFeatures.hygiene ? oralFeatures.hygiene : "Nije uneto"}
            </p>
          )}
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700">
            Izražen Frenulum
          </Label>
          {isEditing ? (
            <div className="flex flex-wrap gap-3">
              <Controller
                control={control}
                name="oralFeatures.frenulum.gornjiLabijalni"
                render={({ field }) => (
                  <div className="flex flex-row items-center gap-2">
                    <Input
                      type="checkbox"
                      className="w-5"
                      checked={field.value ?? false}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                    <Label className="text-sm font-medium text-gray-700">
                      Gornji labijalni
                    </Label>
                  </div>
                )}
              />
              <Controller
                control={control}
                name="oralFeatures.frenulum.donjiLabijalni"
                render={({ field }) => (
                  <div className="flex flex-row items-center gap-2">
                    <Input
                      type="checkbox"
                      className="w-5"
                      checked={field.value ?? false}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                    <Label className="text-sm font-medium text-gray-700">
                      Donji labijalni
                    </Label>
                  </div>
                )}
              />
              <Controller
                control={control}
                name="oralFeatures.frenulum.labijalni"
                render={({ field }) => (
                  <div className="flex flex-row items-center gap-2">
                    <Input
                      type="checkbox"
                      className="w-5"
                      checked={field.value ?? false}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                    <Label className="text-sm font-medium text-gray-700">
                      Lingualni
                    </Label>
                  </div>
                )}
              />
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              <div className="flex flex-row items-center gap-2">
                <Input
                  disabled
                  type="checkbox"
                  className="w-5"
                  checked={oralFeatures.frenulum?.gornjiLabijalni ?? false}
                />
                <Label className="text-sm font-medium text-gray-700">
                  Gornji labijalni
                </Label>
              </div>
              <div className="flex flex-row items-center gap-2">
                <Input
                  disabled
                  type="checkbox"
                  className="w-5"
                  checked={oralFeatures.frenulum?.donjiLabijalni ?? false}
                />
                <Label className="text-sm font-medium text-gray-700">
                  Donji labijalni
                </Label>
              </div>
              <div className="flex flex-row items-center gap-2">
                <Input
                  disabled
                  type="checkbox"
                  className="w-5"
                  checked={oralFeatures.frenulum?.labijalni ?? false}
                />
                <Label className="text-sm font-medium text-gray-700">
                  Lingualni
                </Label>
              </div>
            </div>
          )}

          {/* {isEditing ? (
            <div className="flex flex-wrap gap-3">
              <div className="flex flex-row items-center gap-2">
                <Input
                  className="w-5"
                  type="checkbox"
                  name="gornjiLabijalni"
                  checked={frenulum.gornjiLabijalni}
                  onChange={handleCheckboxChange}
                />
                <Label className="text-sm font-medium text-gray-700">
                  Gornji labijalni
                </Label>
              </div>
              <div className="flex flex-row items-center gap-2">
                <Input
                  className="w-5"
                  type="checkbox"
                  name="donjiLabijalni"
                  checked={frenulum.donjiLabijalni}
                  onChange={handleCheckboxChange}
                />
                <Label className="text-sm font-medium text-gray-700">
                  Donji labijalni
                </Label>
              </div>
              <div className="flex flex-row items-center gap-2">
                <Input
                  className="w-5"
                  type="checkbox"
                  name="labijalni"
                  checked={frenulum.labijalni}
                  onChange={handleCheckboxChange}
                />
                <Label className="text-sm font-medium text-gray-700">
                  Lingualni
                </Label>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              <div className="flex flex-row items-center gap-2">
                <Input
                  disabled
                  checked={
                    oralFeatures.frenulum &&
                    oralFeatures.frenulum.gornjiLabijalni
                  }
                  className="w-5"
                  type="checkbox"
                />
                <Label className="text-sm font-medium text-gray-700">
                  Gornji labijalni
                </Label>
              </div>
              <div className="flex flex-row items-center gap-2">
                <Input
                  disabled
                  checked={
                    oralFeatures.frenulum &&
                    oralFeatures.frenulum.donjiLabijalni
                  }
                  className="w-5"
                  type="checkbox"
                />
                <Label className="text-sm font-medium text-gray-700">
                  Donji labijalni
                </Label>
              </div>
              <div className="flex flex-row items-center gap-2">
                <Input
                  disabled
                  checked={
                    oralFeatures.frenulum && oralFeatures.frenulum.labijalni
                  }
                  className="w-5"
                  type="checkbox"
                />
                <Label className="text-sm font-medium text-gray-700">
                  Lingualni
                </Label>
              </div>
            </div>
          )} */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Sredine Zubnih Nizova
            </Label>
            {isEditing ? (
              <Select
                defaultValue={oralFeatures.dentalMidlines ?? undefined}
                onValueChange={(value) =>
                  setValue("oralFeatures.dentalMidlines", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Izaberite uslugu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Poklapaju se">Poklapaju se</SelectItem>
                  <SelectItem value="Ne poklapaju se">
                    Ne poklapaju se
                  </SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-gray-800 bg-gray-50 text-sm max-h-[36px] p-2 pl-4 rounded-lg">
                {oralFeatures.dentalMidlines
                  ? oralFeatures.dentalMidlines
                  : "Nije uneto"}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Klasifikacija po Uglu
            </Label>
            {isEditing ? (
              <Select
                defaultValue={oralFeatures.angleClassification ?? undefined}
                onValueChange={(value) =>
                  setValue("oralFeatures.angleClassification", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Odaberite opciju" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="I klasa">I klasa</SelectItem>
                  <SelectItem value="Nepravilan">II/1 klasa</SelectItem>
                  <SelectItem value="II/2 klasa">II/2 klasa</SelectItem>
                  <SelectItem value="III klasa">III klasa</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-gray-800 bg-gray-50 text-sm max-h-[36px] p-2 pl-4 rounded-lg">
                {oralFeatures.angleClassification
                  ? oralFeatures.angleClassification
                  : "Nije uneto"}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Bočni odnos
            </Label>
            {isEditing ? (
              <Select
                defaultValue={oralFeatures.buccalOcclusion ?? undefined}
                onValueChange={(value) =>
                  setValue("oralFeatures.buccalOcclusion", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Odaberite opciju" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pravilan">Pravilan</SelectItem>
                  <SelectItem value="Nepravilan">Nepravilan</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-gray-800 bg-gray-50 text-sm max-h-[36px] p-2 pl-4 rounded-lg">
                {oralFeatures.buccalOcclusion
                  ? oralFeatures.buccalOcclusion
                  : "Nije uneto"}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700">
            Incizalni Stepenik
          </Label>
          {isEditing ? (
            <Input
              type="text"
              defaultValue={oralFeatures.incisalStep ?? undefined}
              {...register("oralFeatures.incisalStep")}
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-primary focus:border-primary"
              placeholder="Unesite vrednost u mm"
            />
          ) : (
            <p className="text-gray-800 bg-gray-50 text-sm max-h-[36px] p-2 pl-4 rounded-lg">
              {oralFeatures.incisalStep
                ? oralFeatures.incisalStep
                : "Nije uneto"}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
