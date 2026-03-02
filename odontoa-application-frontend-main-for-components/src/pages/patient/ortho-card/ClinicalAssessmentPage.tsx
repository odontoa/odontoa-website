import ClinicalAssessmentForm from "@/components/patients/ortho/ClinicalAssessmentForm";
import OrthoCardSubHeader from "@/components/patients/OrthoCardSubHeader";
import { Card, CardContent } from "@/components/ui/card";

export default function ClinicalAssessmentPage() {
  return (
    <div>
      <OrthoCardSubHeader />
      <div className="container mx-auto mt-10">
        <Card className="border-0 bg-white">
          <CardContent className="p-6">
            <ClinicalAssessmentForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
