import { Routes, Route } from "react-router-dom";
import PatientLayout from "@/components/layout/PatientLayout";
import PatientDetailsPage from "@/pages/patient/PatientDetailsPage";
import DentalCardPage from "@/pages/patient/DentalCardPage";
import { Dentists } from "@/pages/Dentists";
import { PatientsPage } from "@/pages/Patients";
import { AppointmentsPage } from "@/pages/Appointments";
import { CreateAppointmentPage } from "@/pages/CreateAppointmentPage";
import { CompleteAppointmentPage } from "@/pages/CompleteAppointmentPage";
import { ExportAppointmentsPage } from "@/pages/ExportAppointments";
import { FinancePage } from "@/pages/Finance";
import OrthoCardPage from "@/pages/patient/OrthoCardPage";
import ClinicalAssessmentPage from "@/pages/patient/ortho-card/ClinicalAssessmentPage";
import TherapiesAndAppointmentsPage from "@/pages/patient/TherapiesAndAppointmentsPage";
import XRayPage from "@/pages/patient/XRayPage";
import PhotosPage from "@/pages/patient/PhotosPage";
import StudyModelPage from "@/pages/patient/ortho-card/StudyModelPage";
import AnalysisPage from "@/pages/patient/ortho-card/AnalysisPage";
import ReportPage from "@/pages/patient/ReportPage";
import { FallbackPage } from "@/pages/FallbackPage";
import { Login } from "@/pages/Login";
import ProtectedRoutes from "@/layouts/ProtectedRoutes";
import { Layout } from "@/layouts/Layout";
import { Welcome } from "@/pages/Welcome";
import { DentistSettings } from "@/pages/DentistSettings";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth/login" element={<Login />} />
      <Route element={<ProtectedRoutes />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Welcome />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/dentists" element={<Dentists />} />
          <Route path="/settings" element={<DentistSettings />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/appointments/create" element={<CreateAppointmentPage />} />
          <Route path="/appointments/:id/complete" element={<CompleteAppointmentPage />} />
          <Route path="/appointments/export" element={<ExportAppointmentsPage />} />
          <Route path="/finance" element={<FinancePage />} />

          <Route path="/patients/:id" element={<PatientLayout />}>
            <Route path="details" element={<PatientDetailsPage />} />
            <Route path="therapies-and-appointments" element={<TherapiesAndAppointmentsPage />} />
            <Route path="x-ray" element={<XRayPage />} />
            <Route path="photos" element={<PhotosPage />} />
            <Route path="dental-card" element={<DentalCardPage />} />
            <Route path="ortho-card" element={<OrthoCardPage />} />
            <Route path="report" element={<ReportPage />} />
            <Route path="ortho-card">
              <Route
                path="clinical-assessment"
                element={<ClinicalAssessmentPage />}
              />
              <Route path="study-model" element={<StudyModelPage />} />
              <Route path="analysis" element={<AnalysisPage />} />
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<FallbackPage />} />
    </Routes>
  );
}
