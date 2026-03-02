import { useEffect } from "react";
import FacialFeaturesSection from "./FacialFeaturesSection";
import { SubmitHandler, useForm } from "react-hook-form";
import { Loading } from "@/components/ui/loading";
import OralFeaturesSection from "./OralFeaturesSection";
import FunctionalAssessmentSection from "./FunctionalAssessmentSection";
import { useGetClinicalAssessments } from "@/hooks/orthoCard/useGetClinicalAssessments";
import { useUpdateClinicalAssessment } from "@/hooks/orthoCard/useUpdateClinicalAssessment";
import { CalendarIcon } from "lucide-react";
import { useAnalysisEditingMode } from "@/hooks/store/useAnalysisEditingMode";
import { StickyActions } from "@/components/sticky-actions";

export interface FormFields {
  facialFeatures: {
    face?: string | null;
    lips?: string | null;
    nasolabialSulcus?: string | null;
    mentolabialSulcus?: string | null;
    profile?: string | null;
    biometricField?: string | null;
  };
  oralFeatures: {
    hygiene?: string | null;
    frenulum?: {
      gornjiLabijalni: boolean | null;
      donjiLabijalni: boolean | null;
      labijalni: boolean | null;
    };
    dentalMidlines?: string | null;
    angleClassification?: string | null;
    incisalStep?: string | null;
    buccalOcclusion?: string | null;
  };
  functionalAssessment: {
    notes?: string | null;
    speech?: string | null;
    chewingTemporalis?: string | null;
    chewingMasseter?: string | null;
    swallowing?: string | null;
    breathing?: string | null;
    prematureContact?: string | null;
    forcedBite?: string | null;
    mandibularMobility?: string | null;
  };
}

export default function ClinicalAssessmentForm() {
  const { toggleEditing } = useAnalysisEditingMode();

  const { data: clinicalAssessment } = useGetClinicalAssessments();
  const { mutate: updateAssessment } = useUpdateClinicalAssessment();

  const { handleSubmit, setValue, register, control, reset } =
    useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    toggleEditing();
    updateAssessment(data);
  };

  useEffect(() => {
    if (clinicalAssessment) {
      reset(clinicalAssessment.clinicalAssessment);
    }
  }, [clinicalAssessment, reset]);

  return (
    <form className="space-y-6 relative" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Klinička procena
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Detaljna klinička procena
          </p>
          {clinicalAssessment?.updatedAt && (
            <div className="flex items-center gap-2 my-4">
              <CalendarIcon className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">
                Poslednji put ažurirano: <span className="font-medium text-gray-800">
                  {new Date(clinicalAssessment.updatedAt).toLocaleDateString('sr-Latn-RS', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
      
      <StickyActions
        onSave={handleSubmit(onSubmit)}
      />
      
      {clinicalAssessment ? (
        <>
          <div id="facial-features" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FacialFeaturesSection
              setValue={setValue}
              register={register}
              control={control}
              facialFeatures={
                clinicalAssessment.clinicalAssessment.facialFeatures
              }
            />
            <div id="oral-features">
              <OralFeaturesSection
                setValue={setValue}
                register={register}
                control={control}
                oralFeatures={clinicalAssessment.clinicalAssessment.oralFeatures}
              />
            </div>
          </div>
          <div id="functional-assessment">
            <FunctionalAssessmentSection
              setValue={setValue}
              register={register}
              functionalAssessment={
                clinicalAssessment.clinicalAssessment.functionalAssessment
              }
            />
          </div>
        </>
      ) : (
        <Loading size="md" showLogo={false} />
      )}
    </form>
  );
}
