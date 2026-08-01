import { Navigate, Outlet } from "react-router";
import Header from "../components/Header";
import LoadingSpinner from "../components/LoadingSpinner";

const MainLayout = ({
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

  return (
    <>
      <Header />

      <main className="w-full mx-auto min-h-screen">
        <Outlet />
      </main>
    </>
  );
};
export default MainLayout;
