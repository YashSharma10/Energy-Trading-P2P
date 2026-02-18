import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const PublicRoute = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Only redirect to "/profile" if the user is trying to access auth-related pages
  const isAuthPage = ["/login", "/register", "/verify-otp"].includes(location.pathname);

  if (user && isAuthPage) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
