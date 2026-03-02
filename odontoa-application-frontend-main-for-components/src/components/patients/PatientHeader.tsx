import { useGetPatientById } from "@/hooks/patients/useGetPatientById";
import { calculateAge, getInitials, isActive, isActiveTab, getDateFnsLocale } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { User, Calendar, Phone, Mail, FileText } from "lucide-react";
import AddPatientModal from "@/components/modal/Patient/AddPatientModal";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { useDefaultChair } from "@/hooks/useDefaultChair";

const PatientHeader = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { defaultChair } = useDefaultChair();

  const { data: patient, isLoading, isError } = useGetPatientById();
  const [editModalOpen, setEditModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
        <Loading size="md" showLogo={false} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl text-center">
        <p className="text-red-600">{t("patientComponents.patientHeader.errorLoading")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Patient Info Card */}
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm relative">
        <CardContent className="p-4 lg:p-6 lg:pt-10">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 lg:h-20 lg:w-20 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-xl lg:text-2xl overflow-hidden">
                {patient?.profileImage ? (
                  <img
                    src={patient?.profileImage}
                    alt={`${patient?.firstName} ${patient?.lastName}`}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  getInitials(patient?.firstName, patient?.lastName)
                )}
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {`${patient?.firstName} ${patient?.lastName}`}
                </h1>
                <p className="text-sm lg:text-base text-gray-600 mt-1 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {t("patientComponents.patientHeader.patient")} #{patient?.id}
                </p>
              </div>
            </div>

            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* First Row */}
                <div className="flex items-center gap-2 p-2 bg-gray-50/50 rounded-lg">
                  <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{t("patientComponents.patientHeader.age")}</p>
                    <p className="font-medium text-gray-900">{calculateAge(patient?.birthDate)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 bg-gray-50/50 rounded-lg">
                  <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{t("patientComponents.patientHeader.birthDate")}</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(patient?.birthDate!), "dd.MM.yyyy", { locale: getDateFnsLocale(i18n.language) })}
                    </p>
                  </div>
                </div>

                {/* Second Row */}
                <div className="flex items-start gap-2 p-2 bg-gray-50/50 rounded-lg">
                  <Phone className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{t("patientComponents.patientHeader.phones")}</p>
                    <div className="space-y-1">
                      {patient?.phoneNumbers?.map((phone, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 text-sm">{phone.phonenumber}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2 bg-gray-50/50 rounded-lg">
                  <Mail className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{t("patientComponents.patientHeader.email")}</p>
                    <p className="font-medium text-gray-900 break-all">{patient?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-4 right-4 z-10 flex gap-4">
            <Link to={`/appointments/create?patientId=${patient?.id}&chair=${defaultChair}`}>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-gray-600 hover:text-green-600 hover:border-green-600 bg-white/90 hover:bg-green-50 border-gray-300 shadow-sm"
              >
                <Calendar className="h-4 w-4 mr-1" />
                {t("patientComponents.patientHeader.scheduleAppointment")}
              </Button>
            </Link>
            <Link to={`/patients/${patient?.id}/report`}>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-gray-600 hover:text-blue-600 hover:border-blue-600 bg-white/90 hover:bg-blue-50 border-gray-300 shadow-sm"
              >
                <FileText className="h-4 w-4 mr-1" />
                {t("patientComponents.patientHeader.report")}
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditModalOpen(true)}
              className="h-8 px-3 text-gray-600 hover:text-blue-600 hover:border-blue-600 bg-white/90 hover:bg-blue-50 border-gray-300 shadow-sm"
            >
              <Pencil className="h-4 w-4 mr-1" />
              {t("patientComponents.patientHeader.edit")}
            </Button>
          </div>
          <AddPatientModal
            open={editModalOpen}
            setOpen={setEditModalOpen}
            patient={patient}
          />
        </CardContent>
      </Card>

      {/* Navigation Card */}
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-4 lg:p-6">
          <nav className="flex flex-wrap gap-1 lg:gap-2">
            <Link
              to={`/patients/${patient?.id}/details`}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${isActive(`/patients/${patient?.id}/details`, location.pathname)
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50"
                }`}
            >
              {t("patientComponents.patientHeader.patientOverview")}
            </Link>
            <Link
              to={`/patients/${patient?.id}/therapies-and-appointments`}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${isActive(
                `/patients/${patient?.id}/therapies-and-appointments`,
                location.pathname
              )
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50"
                }`}
            >
              {t("patientComponents.patientHeader.therapiesAndAppointments")}
            </Link>
            <Link
              to={`/patients/${patient?.id}/x-ray`}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${isActive(
                `/patients/${patient?.id}/x-ray`,
                location.pathname
              )
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50"
                }`}
            >
              {t("patientComponents.patientHeader.xrayImages")}
            </Link>
            <Link
              to={`/patients/${patient?.id}/photos`}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${isActive(
                `/patients/${patient?.id}/photos`,
                location.pathname
              )
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50"
                }`}
            >
              {t("patientComponents.patientHeader.photos")}
            </Link>
            <Link
              to={`/patients/${patient?.id}/ortho-card`}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${isActiveTab(`/patients/${patient?.id}/ortho-card`, location.pathname)
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50"
                }`}
            >
              {t("patientComponents.patientHeader.orthoCard")}
            </Link>
            <Link
              to={`/patients/${patient?.id}/dental-card`}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${isActive(
                `/patients/${patient?.id}/dental-card`,
                location.pathname
              )
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50"
                }`}
            >
              {t("patientComponents.patientHeader.dentalCard")}
            </Link>
            <Link
              to={`/patients/${patient?.id}/report`}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${isActive(
                `/patients/${patient?.id}/report`,
                location.pathname
              )
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50"
                }`}
            >
              {t("patientComponents.patientHeader.report")}
            </Link>
          </nav>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientHeader;
