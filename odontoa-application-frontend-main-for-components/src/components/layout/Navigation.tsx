import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Users,
  Calendar,
  PieChart,
  FileText,
  Pill,
  Building,
  DollarSign,
  LayoutDashboard,
  Home,
  ClipboardList,
  BarChart,
  Clock,
} from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

// Type definitions for navigation structure
type SecondaryNavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

type TertiaryNavItem = {
  title: string;
  href: string;
};

const getNavigationStructure = (t: (key: string) => string) => ({
  primary: [
    {
      id: "dashboard",
      title: t("navigation.dashboard"),
      href: "/",
      icon: <LayoutDashboard size={20} />,
    },
    {
      id: "patients",
      title: t("navigation.patients"),
      href: "/patients",
      icon: <Users size={20} />,
    },
    {
      id: "calendar",
      title: t("navigation.calendar"),
      href: "/calendar",
      icon: <Calendar size={20} />,
    },
    {
      id: "finance",
      title: t("navigation.finance"),
      href: "/finance",
      icon: <DollarSign size={20} />,
    },
    {
      id: "inventory",
      title: t("navigation.inventory"),
      href: "/inventory",
      icon: <Building size={20} />,
    },
  ],
  secondary: {
    dashboard: [
      { title: t("navigation.overview"), href: "/dashboard", icon: <Home size={18} /> },
      {
        title: t("navigation.activities"),
        href: "/dashboard/activities",
        icon: <Clock size={18} />,
      },
      {
        title: t("navigation.statistics"),
        href: "/dashboard/stats",
        icon: <BarChart size={18} />,
      },
    ],
    patients: [
      {
        title: t("navigation.patientList"),
        href: "/patients",
        icon: <ClipboardList size={18} />,
      },
      {
        title: t("navigation.moyersAnalysis"),
        href: "/patients/moyers",
        icon: <FileText size={18} />,
      },
      {
        title: t("navigation.lundstromAnalysis"),
        href: "/patients/lundstrom",
        icon: <FileText size={18} />,
      },
      {
        title: t("navigation.odontogram"),
        href: "/patients/odontogram",
        icon: <FileText size={18} />,
      },
    ],
    calendar: [
      {
        title: t("navigation.dailyView"),
        href: "/calendar/daily",
        icon: <Calendar size={18} />,
      },
      {
        title: t("navigation.weeklyView"),
        href: "/calendar/weekly",
        icon: <Calendar size={18} />,
      },
      {
        title: t("navigation.monthlyView"),
        href: "/calendar/monthly",
        icon: <Calendar size={18} />,
      },
    ],
    finance: [
      {
        title: t("navigation.income"),
        href: "/finance/income",
        icon: <DollarSign size={18} />,
      },
      {
        title: t("navigation.expenses"),
        href: "/finance/expenses",
        icon: <PieChart size={18} />,
      },
      {
        title: t("navigation.reports"),
        href: "/finance/reports",
        icon: <BarChart size={18} />,
      },
    ],
    inventory: [
      {
        title: t("navigation.equipment"),
        href: "/inventory/equipment",
        icon: <Pill size={18} />,
      },
      {
        title: t("navigation.consumables"),
        href: "/inventory/consumables",
        icon: <Pill size={18} />,
      },
      {
        title: t("navigation.facilities"),
        href: "/inventory/facilities",
        icon: <Building size={18} />,
      },
    ],
  },
  tertiary: {
    "patients/moyers": [
      { title: t("navigation.incizivaSum"), href: "/patients/moyers/inciziva" },
      { title: t("navigation.prediction"), href: "/patients/moyers/prediction" },
      { title: t("navigation.report"), href: "/patients/moyers/report" },
    ],
    "patients/lundstrom": [
      { title: t("navigation.measurements"), href: "/patients/lundstrom/measurements" },
      { title: t("navigation.analysis"), href: "/patients/lundstrom/analysis" },
    ],
    "patients/odontogram": [
      { title: t("navigation.view"), href: "/patients/odontogram/view" },
      { title: t("navigation.history"), href: "/patients/odontogram/history" },
    ],
    "calendar/daily": [
      { title: t("navigation.allDoctors"), href: "/calendar/daily/all" },
      { title: t("navigation.byDoctor"), href: "/calendar/daily/by-doctor" },
    ],
  },
});

export default function Navigation() {
  const { t } = useTranslation();
  const location = useLocation();
  const pathname = location.pathname || "/";
  const navigationStructure = getNavigationStructure(t);

  const activePrimary =
    navigationStructure.primary.find(
      (item) =>
        pathname.startsWith(item.href) ||
        (item.href === "/" && pathname === "/")
    )?.id || "dashboard";

  const isActive = (href: string): boolean => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  const getTertiaryKey = (): keyof typeof navigationStructure.tertiary | null => {
    for (const key in navigationStructure.tertiary) {
      if (pathname.includes(key)) return key as keyof typeof navigationStructure.tertiary;
    }
    return null;
  };

  const tertiaryKey = getTertiaryKey();
  
  // Type guard for secondary navigation
  const secondaryNavItems = (activePrimary as keyof typeof navigationStructure.secondary) in navigationStructure.secondary
    ? navigationStructure.secondary[activePrimary as keyof typeof navigationStructure.secondary]
    : null;

  return (
    <div className="navigation-container">
      {/* Primary Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm w-full sticky top-0 z-20">
        <div className="container mx-auto">
          <div className="flex items-center h-16">
            <div className="flex items-center gap-8">
              {navigationStructure.primary.map((item) => (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`flex items-center h-16 px-4 transition-colors ${
                    activePrimary === item.id
                      ? "text-primary border-b-2 border-primary font-semibold"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  <span className="text-[16px]">{item.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

            {/* Secondary Navigation */}
      {secondaryNavItems && (
        <div className="bg-white border-b border-gray-200 py-2 w-full sticky top-16 z-10">                                                                      
          <div className="container mx-auto">
            <div className="flex items-center gap-2 px-1 overflow-x-auto">      
              {secondaryNavItems.map((item: SecondaryNavItem) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center px-4 py-2 rounded-md text-[14px] transition-colors ${
                    isActive(item.href)
                      ? "bg-blue-50 text-primary font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

            {/* Tertiary Navigation */}
      {tertiaryKey && navigationStructure.tertiary[tertiaryKey] && (
        <div className="bg-white border-b border-gray-100 w-full sticky top-[112px] z-5">                                                                       
          <div className="container mx-auto">
            <div className="flex items-center gap-6 px-4">
              {navigationStructure.tertiary[tertiaryKey].map((item: TertiaryNavItem) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`py-3 text-[13px] transition-colors border-b-2 ${
                    isActive(item.href)
                      ? "border-primary text-primary font-medium"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
