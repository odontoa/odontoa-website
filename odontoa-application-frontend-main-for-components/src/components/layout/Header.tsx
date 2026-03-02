import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, Menu, X, Settings, LogOut, Languages } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import { Button } from "../ui/Button";
import { useSidebar } from "@/hooks/store/useSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { getInitials } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export default function Header() {
  const location = useLocation();
  const pathname = location.pathname;
  const { t, i18n } = useTranslation();

  const isHomePage = pathname === "/";

  const { isAuthenticated, logout, user } = useAuth();

  const translatePageName = (pageName: string): string => {
    const translations: Record<string, string> = {
      patients: t("navigation.patients"),
      dentists: t("dentists.title"),
      appointments: t("appointments.title"),
      finance: t("finance.title"),
      "tooth chart": t("navigation.odontogram"),
      sales: t("navigation.income"),
      expenses: t("navigation.expenses"),
      reports: t("navigation.reports"),
      equipment: t("navigation.equipment"),
      inventory: t("navigation.inventory"),
      facilities: t("navigation.facilities"),
      settings: t("header.settings"),
      details: t("patients.patientDetails"),
      photos: t("layout.header.photos"),
      "ortho card": t("layout.header.orthoCard"),
      "dental card": t("layout.header.dentalCard"),
      "therapies and-appointments": t("layout.header.therapiesAndAppointments"),
    };

    return translations[pageName.toLowerCase()] || pageName;
  };

  const getPageName = (): string => {
    if (isHomePage) return "";
    const pageName =
      pathname
        .split("/")
        .pop()
        ?.replace("-", " ")
        .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase()) || "Welcome";
    return translatePageName(pageName);
  };

  const getBackUrl = (): string => {
    if (pathname.includes("/patients/") && pathname.split("/").length > 2) {
      return "/patients";
    }
    return "/";
  };

  const navigate = useNavigate();

  const { isOpen, toggle } = useSidebar()

  const handleSettings = () => {
    navigate("/settings");
  };

  return (
    <header className="relative z-20 px-4 py-3 md:px-8 md:py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between ">
      <div className="flex items-center gap-4">
        <div className="xl:hidden z-50">
          <Button
            onClick={toggle}
            className="p-3 bg-white rounded-xl shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </Button>
        </div>
        {!isHomePage && (
          <Link
            to={getBackUrl()}
            className="flex items-center text-gray-500 hover:text-blue-700 bg-white/70 border border-gray-200 rounded-xl px-3 py-1.5 shadow-sm transition-all backdrop-blur-md"
          >

            <ChevronLeft size={20} />
            <span className="ml-1 font-medium">{t("common.back")}</span>
          </Link>
        )}
        <h1 className="text-xl xl:text-2xl font-bold text-gray-900 ml-2 drop-shadow-sm">
          {getPageName()}
        </h1>
      </div>
      <div className="relative flex items-center gap-4">
        {isAuthenticated ? (
          <DropdownMenu>
                         <DropdownMenuTrigger asChild>
               <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-blue-50">
                 <Avatar className="h-10 w-10 bg-blue-600 text-white border-2 border-white shadow-sm">
                   <AvatarImage src="" alt="Profile" />
                   <AvatarFallback className="bg-blue-600 text-white font-semibold text-sm">
                     {getInitials(user?.firstName, user?.lastName)}
                   </AvatarFallback>
                 </Avatar>
               </Button>
             </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSettings} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>{t("header.settings")}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>{t("header.language")}</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => i18n.changeLanguage('sr')}
                className={`cursor-pointer ${i18n.language === 'sr' ? 'bg-accent' : ''}`}
              >
                <Languages className="mr-2 h-4 w-4" />
                <span>{t("header.serbian")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => i18n.changeLanguage('en')}
                className={`cursor-pointer ${i18n.language === 'en' ? 'bg-accent' : ''}`}
              >
                <Languages className="mr-2 h-4 w-4" />
                <span>{t("header.english")}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t("auth.logout")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          null
        )}
      </div>
    </header>
  );
}
