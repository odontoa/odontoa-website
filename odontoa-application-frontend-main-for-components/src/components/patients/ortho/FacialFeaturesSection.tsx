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
import {
  Control,
  Controller,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { FaUser } from "react-icons/fa";
import { FormFields } from "./ClinicalAssessmentForm";
import { useAnalysisEditingMode } from "@/hooks/store/useAnalysisEditingMode";

interface FacialFeatures {
  face?: string | undefined;
  lips?: string | undefined;
  nasolabialSulcus?: string | undefined;
  mentolabialSulcus?: string | undefined;
  profile?: string | undefined;
  biometricField?: string | undefined;
}

interface FacialFeaturesSectionProps {
  setValue: UseFormSetValue<FormFields>;
  register: UseFormRegister<FormFields>;
  control: Control<FormFields, any, FormFields>;
  facialFeatures: FacialFeatures;
}

export default function FacialFeaturesSection({
  setValue,
  register,
  control,
  facialFeatures,
}: FacialFeaturesSectionProps) {
  const { isEditing } = useAnalysisEditingMode();

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FaUser className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            Facijalne Karakteristike
          </h3>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Lice</Label>

            {isEditing ? (
              <div className="space-y-2">
                <Select
                  value={facialFeatures.face ?? undefined}
                  onValueChange={(value) =>
                    setValue("facialFeatures.face", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Izaberite opciju" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Simetrično">Simetrično</SelectItem>
                    <SelectItem value="Asimetrično">Asimetrično</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <p className="text-gray-800 bg-gray-50 text-sm max-h-[36px] p-2 pl-4 rounded-lg">
                {facialFeatures.face ? facialFeatures.face : "Nije uneto"}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Usne</Label>

            {isEditing ? (
              <div className="space-y-2">
                <Controller
                  control={control}
                  name="facialFeatures.lips"
                  render={({ field }) => (
                    <Select
                      value={field.value ?? undefined}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Izaberite opciju" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Kompetentne">Kompetentne</SelectItem>
                        <SelectItem value="Potencijalno kompetentne">
                          Potencijalno kompetentne
                        </SelectItem>
                        <SelectItem value="Inkompetentne">
                          Inkompetentne
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            ) : (
              <p className="text-gray-800 bg-gray-50 text-sm max-h-[36px] p-2 pl-4 rounded-lg">
                {facialFeatures.lips ? facialFeatures.lips : "Nije uneto"}
              </p>
            )}
          </div>
        </div>
        <Label className="text-md">Odnosi Spratova Lica u Vertikali</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Nazolabijalni sulkusi
            </Label>

            {isEditing ? (
              <div className="space-y-2">
                <Select
                  defaultValue={facialFeatures.nasolabialSulcus ?? undefined}
                  onValueChange={(value) =>
                    setValue("facialFeatures.nasolabialSulcus", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Izaberite uslugu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pravilno izraženi">
                      Pravilno izraženi
                    </SelectItem>
                    <SelectItem value="Naglašeni">Naglašeni</SelectItem>
                    <SelectItem value="Zbrisani">Zbrisani</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <p className="text-gray-800 bg-gray-50 p-2 text-sm max-h-[36px] pl-4 rounded-lg">
                {facialFeatures.nasolabialSulcus
                  ? facialFeatures.nasolabialSulcus
                  : "Nije uneto"}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Mentolabijalni sulkusi
            </Label>

            {isEditing ? (
              <div className="space-y-2">
                <Select
                  defaultValue={facialFeatures.mentolabialSulcus ?? undefined}
                  onValueChange={(value) =>
                    setValue("facialFeatures.mentolabialSulcus", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Izaberite uslugu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pravilno izraženi">
                      Pravilno izraženi
                    </SelectItem>
                    <SelectItem value="Naglašeni">Naglašeni</SelectItem>
                    <SelectItem value="Zbrisani">Zbrisani</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <p className="text-gray-800 bg-gray-50 p-2 text-sm max-h-[36px] pl-4 rounded-lg">
                {facialFeatures.mentolabialSulcus
                  ? facialFeatures.mentolabialSulcus
                  : "Nije uneto"}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Profil</Label>

          {isEditing ? (
            <div className="space-y-2">
              <Select
                defaultValue={facialFeatures.profile ?? undefined}
                onValueChange={(value) =>
                  setValue("facialFeatures.profile", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Izaberite uslugu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Prav">Prav</SelectItem>
                  <SelectItem value="Konveksan">Konveksan</SelectItem>
                  <SelectItem value="Konkavan">Konkavan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <p className="text-gray-800 bg-gray-50 p-2 text-sm max-h-[36px] pl-4 rounded-lg">
              {facialFeatures.profile ? facialFeatures.profile : "Nije uneto"}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Biometrijsko Polje
          </Label>

          {isEditing ? (
            <div className="space-y-2">
              <Input
                defaultValue={facialFeatures.biometricField ?? undefined}
                {...register("facialFeatures.biometricField")}
              />
            </div>
          ) : (
            <p className="text-gray-800 bg-gray-50 p-2 text-sm max-h-[36px] pl-4 rounded-lg">
              {facialFeatures.biometricField
                ? facialFeatures.biometricField
                : "Nije uneto"}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
