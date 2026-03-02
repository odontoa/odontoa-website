import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Breadcrumbs() {
  const { t } = useTranslation();
  const location = useLocation();
  const pathname = location.pathname;

  if (pathname === "/") {
    return null;
  }

  const pathTranslations: Record<string, string> = {
    patients: t("navigation.patients"),
    calendar: t("navigation.calendar"),
    finance: t("navigation.finance"),
    inventory: t("navigation.inventory"),
    dashboard: t("navigation.dashboard"),
    moyers: t("navigation.moyersAnalysis"),
    lundstrom: t("navigation.lundstromAnalysis"),
    odontogram: t("navigation.odontogram"),
    daily: t("navigation.dailyView"),
    weekly: t("navigation.weeklyView"),
    monthly: t("navigation.monthlyView"),
    income: t("navigation.income"),
    expenses: t("navigation.expenses"),
    reports: t("navigation.reports"),
    equipment: t("navigation.equipment"),
    consumables: t("navigation.consumables"),
    facilities: t("navigation.facilities"),
    "clinical-assessment": t("breadcrumbs.clinicalAssessment"),
    inciziva: t("navigation.incizivaSum"),
    prediction: t("navigation.prediction"),
    report: t("navigation.report"),
    measurements: t("navigation.measurements"),
    analysis: t("navigation.analysis"),
    view: t("navigation.view"),
    history: t("navigation.history"),
    all: t("navigation.allDoctors"),
    "by-doctor": t("navigation.byDoctor"),
  };

  const pathSegments = pathname.split("/").filter(Boolean);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const url = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const displayName = pathTranslations[segment] || segment;

    return {
      name: displayName,
      url: url,
      isLast: index === pathSegments.length - 1,
    };
  });

  breadcrumbs.unshift({
    name: t("layout.breadcrumbs.home"),
    url: "/",
    isLast: breadcrumbs.length === 0,
  });

  return (
    <nav className="mb-4">
      <ol className="flex items-center space-x-1 text-sm text-gray-500">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.url} className="flex items-center">
            {index > 0 && (
              <ChevronRight size={16} className="mx-1 text-gray-400" />
            )}

            {crumb.isLast ? (
              <span className="font-medium text-primary">{crumb.name}</span>
            ) : (
              <Link
                to={crumb.url}
                className="hover:text-primary transition-colors"
              >
                {crumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
