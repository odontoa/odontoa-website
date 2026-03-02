import StudyModelAnalysis from "@/components/patients/StudyModelAnalysis";
import OrthoCardSubHeader from "@/components/patients/OrthoCardSubHeader";
import { Card, CardContent } from "@/components/ui/card";

export default function StudyModelPage() {
  return (
    <div>
      <OrthoCardSubHeader />
      <div className="container mx-auto mt-10">
        <Card className="border-0 bg-white">
          <CardContent className="p-6">
            <StudyModelAnalysis />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
