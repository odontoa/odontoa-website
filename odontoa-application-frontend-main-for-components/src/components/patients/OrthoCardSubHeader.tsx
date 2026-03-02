import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  ClipboardList,
  Box,
  TrendingUp,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const OrthoCardSubHeader: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const orthodonticSections = [
    {
      id: "clinical-assessment",
      title: t("patientComponents.orthoCardSubHeader.clinicalAssessment"),
      icon: <ClipboardList className="h-4 w-4" />,
      link: `/patients/${id}/ortho-card/clinical-assessment`,
    },
    {
      id: "study-model",
      title: t("patientComponents.orthoCardSubHeader.studyModel"),
      icon: <Box className="h-4 w-4" />,
      link: `/patients/${id}/ortho-card/study-model`,
    },
    {
      id: "analysis",
      title: t("patientComponents.orthoCardSubHeader.analysis"),
      icon: <TrendingUp className="h-4 w-4" />,
      link: `/patients/${id}/ortho-card/analysis`,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Navigation Card */}
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-4 lg:p-6">
          <div className="flex items-center justify-center">
            {/* Navigation tabs */}
            <nav className="flex flex-wrap gap-1 lg:gap-2">
              {orthodonticSections.map((section) => {
                const isActive = location.pathname.includes(section.id);
                return (
                  <Link
                    key={section.id}
                    to={section.link}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50"
                    }`}
                  >
                    <div>{section.icon}</div>
                    <span className="hidden md:inline">{section.title}</span>
                    <span className="md:hidden">
                      {section.title.split(' ')[0]}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrthoCardSubHeader; 