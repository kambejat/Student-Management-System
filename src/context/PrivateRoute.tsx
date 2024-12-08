import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "./useAuth";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [user] = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
