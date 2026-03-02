import { useAuth } from "@/auth/AuthProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LoadingPage } from "@/components/ui/loading";

const ProtectedRoutes = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
