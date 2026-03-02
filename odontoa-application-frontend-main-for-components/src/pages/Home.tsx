import {
  Users,
  Calendar,
  Stethoscope,
  CreditCard,
  TrendingUp,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useGetClinicById } from "@/hooks/clinics/useGetClinicById";
import { formatCurrency } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export const Home = () => {
  const { t } = useTranslation();
  const { data: clinic } = useGetClinicById();
  
  return (
    <div className="flex flex-col space-y-6 p-6 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-textDark">{t("dashboard.title")}</h1>
          <p className="text-textGray">
            {t("dashboard.welcome")}
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-textDark hover:bg-gray-50 flex items-center">
            <Calendar size={16} className="mr-2" />
            {t("dashboard.today")}
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center">
            <TrendingUp size={16} className="mr-2" />
            {t("dashboard.generateReport")}
          </button>
        </div>
      </header>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-textGray text-sm">{t("dashboard.todayAppointments")}</p>
              <h3 className="text-2xl font-bold text-textDark mt-1">24</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar size={20} className="text-primary" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <span className="text-success text-sm font-medium flex items-center">
              <TrendingUp size={14} className="mr-1" /> 12%
            </span>
            <span className="text-textGray text-sm ml-2">
              {t("dashboard.comparedLastWeek")}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-textGray text-sm">{t("dashboard.totalPatients")}</p>
              <h3 className="text-2xl font-bold text-textDark mt-1">1.420</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple/10 flex items-center justify-center">
              <Users size={20} className="text-purple" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <span className="text-success text-sm font-medium flex items-center">
              <TrendingUp size={14} className="mr-1" /> 5%
            </span>
            <span className="text-textGray text-sm ml-2">
              {t("dashboard.comparedLastMonth")}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-textGray text-sm">{t("dashboard.income")}</p>
              <h3 className="text-2xl font-bold text-textDark mt-1">
                {formatCurrency(98450, clinic?.currency || "RSD")}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
              <CreditCard size={20} className="text-success" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <span className="text-success text-sm font-medium flex items-center">
              <TrendingUp size={14} className="mr-1" /> 8%
            </span>
            <span className="text-textGray text-sm ml-2">
              {t("dashboard.comparedLastMonth")}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-textGray text-sm">{t("dashboard.activeStaff")}</p>
              <h3 className="text-2xl font-bold text-textDark mt-1">8/10</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center">
              <Stethoscope size={20} className="text-danger" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <span className="text-danger text-sm font-medium flex items-center">
              <AlertCircle size={14} className="mr-1" /> 2 {t("dashboard.onLeave")}
            </span>
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments Timeline */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-textDark">{t("dashboard.todaySchedule")}</h3>
            <button className="text-primary text-sm">{t("dashboard.showAll")}</button>
          </div>
          <div className="space-y-4">
            {[
              {
                time: "09:00",
                patient: "Marija Petrović",
                procedure: "Redovni pregled",
                status: "Potvrđeno",
                image: "https://picsum.photos/id/1027/200",
              },
              {
                time: "10:30",
                patient: "Nikola Đorđević",
                procedure: "Lečenje kanala",
                status: "U toku",
                image: "https://picsum.photos/id/1025/200",
              },
              {
                time: "12:00",
                patient: "Ana Simić",
                procedure: "Vađenje umnjaka",
                status: "Čeka",
                image: "https://picsum.photos/id/1062/200",
              },
              {
                time: "14:30",
                patient: "Petar Marković",
                procedure: "Izbeljivanje zuba",
                status: "Potvrđeno",
                image: "https://picsum.photos/id/1074/200",
              },
            ].map((appointment, index) => (
              <div
                key={index}
                className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <img
                    src={appointment.image}
                    alt={appointment.patient}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div className="ml-3 flex-grow">
                  <h4 className="text-sm font-medium text-textDark">
                    {appointment.patient}
                  </h4>
                  <p className="text-xs text-textGray">
                    {appointment.procedure}
                  </p>
                </div>
                <div className="flex items-center">
                  <Clock size={14} className="text-textGray mr-1" />
                  <span className="text-sm text-textGray">
                    {appointment.time}
                  </span>
                </div>
                <div className="ml-4">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      appointment.status === "Potvrđeno"
                        ? "bg-success/10 text-success"
                        : appointment.status === "U toku"
                        ? "bg-primary/10 text-primary"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {appointment.status === "Potvrđeno" ? t("dashboard.confirmed") :
                     appointment.status === "U toku" ? t("status.inProgress") :
                     appointment.status === "Čeka" ? t("dashboard.waiting") : appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reminder Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-textDark">{t("dashboard.reminders")}</h3>
            <Button variant="outline" size="sm">
              {t("dashboard.showAll")}
            </Button>
          </div>
          <div className="space-y-4">
            {[
              {
                text: "Poručiti stomatološki materijal",
                priority: "High",
                date: "Danas",
              },
              {
                text: "Sastanak osoblja",
                priority: "Medium",
                date: "Sutra, 9:00",
              },
              {
                text: "Proveriti održavanje opreme",
                priority: "Low",
                date: "24. sept 2023.",
              },
              {
                text: "Pozvati laboratoriju za rezultate",
                priority: "High",
                date: "Danas, 14:30",
              },
            ].map((reminder, index) => (
              <div
                key={index}
                className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 ${
                    reminder.priority === "High"
                      ? "bg-danger"
                      : reminder.priority === "Medium"
                      ? "bg-primary"
                      : "bg-success"
                  }`}
                ></div>
                <div className="ml-3">
                  <p className="text-sm text-textDark">{reminder.text}</p>
                  <p className="text-xs text-textGray mt-1">{reminder.date}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-4">
            + {t("dashboard.addReminder")}
          </Button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Patients */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-textDark">{t("dashboard.recentPatients")}</h3>
            <button className="text-primary text-sm">{t("dashboard.showAll")}</button>
          </div>
          <div className="space-y-4">
            {[
              {
                name: "Dragan Jovanović",
                date: "21. sept 2023.",
                status: "Kontrola",
                image: "https://picsum.photos/id/1012/200",
              },
              {
                name: "Jelena Stojanović",
                date: "20. sept 2023.",
                status: "Novi pacijent",
                image: "https://picsum.photos/id/1027/200",
              },
              {
                name: "Aleksandar Ilić",
                date: "19. sept 2023.",
                status: "Hitno",
                image: "https://picsum.photos/id/1074/200",
              },
              {
                name: "Milica Đorđević",
                date: "18. sept 2023.",
                status: "Redovno",
                image: "https://picsum.photos/id/1062/200",
              },
            ].map((patient, index) => (
              <div
                key={index}
                className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <img
                    src={patient.image}
                    alt={patient.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div className="ml-3 flex-grow">
                  <h4 className="text-sm font-medium text-textDark">
                    {patient.name}
                  </h4>
                  <p className="text-xs text-textGray">{patient.date}</p>
                </div>
                <div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      patient.status === "Novi pacijent"
                        ? "bg-primary/10 text-primary"
                        : patient.status === "Hitno"
                        ? "bg-danger/10 text-danger"
                        : patient.status === "Kontrola"
                        ? "bg-purple/10 text-purple"
                        : "bg-success/10 text-success"
                    }`}
                  >
                    {patient.status === "Novi pacijent" ? t("dashboard.newPatient") :
                     patient.status === "Hitno" ? t("dashboard.urgent") :
                     patient.status === "Kontrola" ? t("dashboard.control") :
                     patient.status === "Redovno" ? t("dashboard.regular") : patient.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-textDark">{t("dashboard.inventoryStatus")}</h3>
            <Button variant="outline" size="sm">
              {t("dashboard.showAll")}
            </Button>
          </div>
          <div className="space-y-4">
            {[
              {
                item: "Jednokratne rukavice",
                status: "Na stanju",
                quantity: "120 kutija",
              },
              {
                item: "Dentalni anestetici",
                status: "Malo na stanju",
                quantity: "5 bočica",
              },
              {
                item: "Kompozitne plombe",
                status: "Na stanju",
                quantity: "78 jedinica",
              },
              {
                item: "Sterilizacione vrećice",
                status: "Nema na stanju",
                quantity: "0 pakovanja",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div>
                  <h4 className="text-sm font-medium text-textDark">
                    {item.item}
                  </h4>
                  <p className="text-xs text-textGray">{item.quantity}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    item.status === "Na stanju"
                      ? "bg-success/10 text-success"
                      : item.status === "Malo na stanju"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-danger/10 text-danger"
                  }`}
                >
                  {item.status === "Na stanju" ? t("dashboard.inStock") :
                   item.status === "Malo na stanju" ? t("dashboard.lowStock") :
                   item.status === "Nema na stanju" ? t("dashboard.outOfStock") : item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Treatment Statistics */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-textDark">{t("dashboard.treatmentStatistics")}</h3>
            <Button variant="outline" size="sm">
              {t("dashboard.showAll")}
            </Button>
          </div>
          <div className="space-y-4">
            {[
              { name: t("dashboard.regularCheckups"), count: 45, percentage: 38 },
              { name: t("dashboard.cleaning"), count: 32, percentage: 27 },
              { name: t("dashboard.fillings"), count: 24, percentage: 20 },
              { name: t("dashboard.extractions"), count: 18, percentage: 15 },
            ].map((treatment, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-textDark font-medium">
                    {treatment.name}
                  </span>
                  <span className="text-textGray">{treatment.count}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${treatment.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
