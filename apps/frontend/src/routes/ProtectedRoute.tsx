import { Navigate, Outlet } from "react-router";
import LoadingSpinner from "../components/LoadingSpinner";

const Protectedroute = ({
  isAuthenticated,
  isLoading,
}: {
  isAuthenticated: boolean;
  isLoading: boolean;
}) => {
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
export default Protectedroute;
