import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ClipboardList,
  Box,
  TrendingUp,
  FileText,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function OrthoCardPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState<string | null>(null);

  if (!id) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center">
        <p className="text-red-600">{t("orthoCard.errorPatientId")}</p>
      </div>
    );
  }

  const orthodonticSections = [
    {
      id: "clinical-assessment",
      title: t("orthoCard.clinicalAssessment"),
      description: t("orthoCard.clinicalAssessmentDesc"),
      icon: <ClipboardList className="h-8 w-8" />,
      link: `/patients/${id}/ortho-card/clinical-assessment`,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "study-model",
      title: t("orthoCard.studyModel"),
      description: t("orthoCard.studyModelDesc"),
      icon: <Box className="h-8 w-8" />,
      link: `/patients/${id}/ortho-card/study-model`,
      color: "from-orange-500 to-orange-600",
    },
    {
      id: "analysis",
      title: t("orthoCard.analysis"),
      description: t("orthoCard.analysisDesc"),
      icon: <TrendingUp className="h-8 w-8" />,
      link: `/patients/${id}/ortho-card/analysis`,
      color: "from-teal-500 to-teal-600",
    },
  ];

  useEffect(() => {
    const path = window.location.pathname;
    const section = orthodonticSections.find((s) => path.includes(s.id));
    if (section) {
      setActiveSection(section.id);
    }
  }, []);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Enhanced Header Section */}
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl"></div>

        <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl p-4 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 lg:p-3 bg-blue-600 rounded-xl shadow-lg">
                <FileText className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {t("orthoCard.title")}
                </h1>
                <p className="text-sm lg:text-base text-gray-600 mt-1 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {t("orthoCard.subtitle")}
                </p>
              </div>
            </div>

            {/* <Button
              variant="outline"
              onClick={() => navigate(`/patients/${id}/details`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Nazad na pacijenta</span>
              <span className="sm:hidden">Nazad</span>
            </Button> */}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative">
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="p-4 lg:p-6">
            <CardTitle className="text-xl lg:text-2xl font-semibold text-gray-800">
              {t("orthoCard.selectSection")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 lg:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {orthodonticSections.map((section) => (
                <div
                  key={section.id}
                  onClick={() => navigate(section.link)}
                  className={`group relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                    activeSection === section.id
                      ? "border-blue-500 bg-blue-50 shadow-lg"
                      : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/30"
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-blue-600 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300`}>
                        <div className="text-white">
                          {section.icon}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                          activeSection === section.id ? "text-blue-900" : "text-gray-900 group-hover:text-blue-800"
                        }`}>
                          {section.title}
                        </h3>
                        <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                          activeSection === section.id ? "text-blue-700" : "text-gray-600 group-hover:text-gray-700"
                        }`}>
                          {section.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
