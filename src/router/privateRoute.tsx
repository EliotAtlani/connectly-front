import { Navigate, Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import MainLoader from "@/components/main-loader";

const PrivateRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <MainLoader />;

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
