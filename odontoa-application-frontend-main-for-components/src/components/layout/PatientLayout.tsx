import { Outlet } from "react-router-dom";
import PatientHeader from "../patients/PatientHeader";

const PatientLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto p-2 lg:p-6 space-y-6 lg:space-y-8">
        <PatientHeader />
        <Outlet />
      </div>
    </div>
  );
};

export default PatientLayout;
