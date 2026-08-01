import { Navigate, Outlet } from "react-router";
import LoadingSpinner from "../components/LoadingSpinner";

const AuthLayout = ({
  isAuthenticated,
  isLoading,
}: {
  isAuthenticated: boolean;
  isLoading: boolean;
}) => {
  if (isLoading) return <LoadingSpinner />;
  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <>
      <main className="flex items-center justify-center min-h-screen">
        <Outlet />
      </main>
    </>
  );
};

export default AuthLayout;
