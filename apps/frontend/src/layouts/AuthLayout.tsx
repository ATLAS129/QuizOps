import { Navigate, Outlet } from "react-router";

const AuthLayout = ({
  isAuthenticated,
  isLoading,
}: {
  isAuthenticated: boolean;
  isLoading: boolean;
}) => {
  if (isLoading) return <p>Loading...</p>;
  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <Outlet />
      </div>
    </>
  );
};

export default AuthLayout;
