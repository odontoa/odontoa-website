import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaClipboardList,
  FaXRay,
  FaImage,
  FaCube,
  FaChartLine,
  FaUserMd,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

interface OrthoSectionNavProps {
  patientId: string;
}

const OrthoSectionNav: React.FC<OrthoSectionNavProps> = ({ patientId }) => {
  const { t } = useTranslation();
  const location = useLocation();

  const orthodonticSections = [
    {
      id: "clinical-assessment",
      title: t("patientComponents.orthoSectionNav.clinicalAssessment"),
      description: t("patientComponents.orthoSectionNav.clinicalAssessmentDesc"),
      icon: <FaUserMd className="h-6 w-6 text-primary" />,
      link: `/patients/${patientId}/ortho-card/clinical-assessment`,
    },
    {
      id: "treatment-history",
      title: t("patientComponents.orthoSectionNav.treatmentFlow"),
      description: t("patientComponents.orthoSectionNav.treatmentFlowDesc"),
      icon: <FaClipboardList className="h-6 w-6 text-primary" />,
      link: `/patients/${patientId}/ortho-card/treatment-history`,
    },
    {
      id: "x-ray",
      title: t("patientComponents.orthoSectionNav.xrayImages"),
      description: t("patientComponents.orthoSectionNav.xrayImagesDesc"),
      icon: <FaXRay className="h-6 w-6 text-primary" />,
      link: `/patients/${patientId}/ortho-card/x-ray`,
    },
    {
      id: "photos",
      title: t("patientComponents.orthoSectionNav.photos"),
      description: t("patientComponents.orthoSectionNav.photosDesc"),
      icon: <FaImage className="h-6 w-6 text-primary" />,
      link: `/patients/${patientId}/ortho-card/photos`,
    },
    {
      id: "study-model",
      title: t("patientComponents.orthoSectionNav.studyModel"),
      description: t("patientComponents.orthoSectionNav.studyModelDesc"),
      icon: <FaCube className="h-6 w-6 text-primary" />,
      link: `/patients/${patientId}/ortho-card/study-model`,
    },
    {
      id: "analysis",
      title: t("patientComponents.orthoSectionNav.analysis"),
      description: t("patientComponents.orthoSectionNav.analysisDesc"),
      icon: <FaChartLine className="h-6 w-6 text-primary" />,
      link: `/patients/${patientId}/ortho-card/analysis`,
    },
  ];

  return (
    <div className="bg-white border-b border-gray-200 w-full m-0 p-0">
      <div className="flex w-full m-0 p-0 overflow-x-auto">
        {orthodonticSections.map((section) => {
          const isActive = location.pathname.includes(section.id);
          return (
            <Link
              key={section.id}
              to={section.link}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div>{section.icon}</div>
              <span>{section.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default OrthoSectionNav;
