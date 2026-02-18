import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import PropTypes from "prop-types";

export const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // BOTH role can access both PRODUCER and CONSUMER routes
  if (user.role === "BOTH") {
    return children;
  }

  // If user role is not in allowed roles, redirect to their default dashboard
  if (!allowedRoles.includes(user.role)) {
    // Redirect based on user role
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (user.role === "PRODUCER") {
      return <Navigate to="/dashboard/producer" replace />;
    } else if (user.role === "CONSUMER") {
      return <Navigate to="/dashboard/consumer" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

RoleBasedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};
