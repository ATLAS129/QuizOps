import { Navigate, Outlet } from "react-router";
import Header from "../components/Header";

const MainLayout = ({
  isAuthenticated,
  isLoading,
}: {
  isAuthenticated: boolean;
  isLoading: boolean;
}) => {
  if (isLoading) return <p>Loading</p>;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Header />

      <main className="container mx-auto min-h-screen">
        <Outlet />
      </main>
    </>
  );
};
export default MainLayout;
