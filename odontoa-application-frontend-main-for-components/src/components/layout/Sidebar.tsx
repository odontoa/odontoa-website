import { Link, useLocation } from "react-router-dom";
import { Users, Calendar, Home, Stethoscope, DollarSign } from "lucide-react";
import odontoaLogo from "@/assets/Full_logo_horizontal_color.png";
import { useSidebar } from "@/hooks/store/useSidebar";
import { useTranslation } from "react-i18next";

export default function Sidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const pathname = location.pathname || "/";
  const { close, isOpen } = useSidebar();

  const navItems = [
    {
      category: t("layout.sidebar.clinic"),
      items: [
        {
          title: t("layout.sidebar.home"),
          href: "/",
          icon: <Home size={20} />,
          description: t("layout.sidebar.homeDescription")
        },
        {
          title: t("layout.sidebar.patients"),
          href: "/patients",
          icon: <Users size={20} />,
          description: t("layout.sidebar.patientsDescription")
        },
        {
          title: t("layout.sidebar.dentists"),
          href: "/dentists",
          icon: <Stethoscope size={20} />,
          description: t("layout.sidebar.dentistsDescription")
        },
        {
          title: t("layout.sidebar.calendar"),
          href: "/appointments",
          icon: <Calendar size={20} />,
          description: t("layout.sidebar.calendarDescription")
        },
        {
          title: t("layout.sidebar.finance"),
          href: "/finance",
          icon: <DollarSign size={20} />,
          description: t("layout.sidebar.financeDescription")
        },
      ],
    },
  ];

  const SidebarContent = () => (
    <>
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2">
            <img src={odontoaLogo} alt="Odontoa Logo" />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map((category) => (
          <div key={category.category} className="mb-6">
            <h3 className="px-6 mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
              {category.category}
            </h3>
            <ul className="space-y-1">
              {category.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      onClick={close}
                      className={`flex items-center px-6 py-3 mx-3 rounded-xl text-sm transition-all duration-200 group ${isActive
                        ? "text-white bg-blue-600 shadow-lg font-semibold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                    >
                      <span className={`mr-3 transition-colors duration-200 ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"
                        }`}>
                        {item.icon}
                      </span>
                      <div className="flex-1">
                        <div className="font-medium">{item.title}</div>
                        <div className={`text-xs mt-0.5 ${isActive ? "text-blue-100" : "text-gray-400"
                          }`}>
                          {item.description}
                        </div>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 bg-white rounded-full ml-2"></div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="xl:hidden fixed inset-0 bg-black/50 z-40"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out
        xl:translate-x-0 xl:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col w-72 bg-white h-screen border-r border-gray-200 shadow-xl xl:shadow-none overflow-hidden">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Spacer */}
      <div className="xl:hidden h-16"></div>
    </>
  );
}
