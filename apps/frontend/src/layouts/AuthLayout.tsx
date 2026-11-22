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
      <main className="flex min-h-[100svh] w-full items-center justify-center px-4 py-8">
        <Outlet />
      </main>
    </>
  );
};

export default AuthLayout;
