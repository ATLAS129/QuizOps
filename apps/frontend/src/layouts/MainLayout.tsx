import { Navigate, Outlet } from "react-router";
import Header from "../components/Header";
import LoadingSpinner from "../components/LoadingSpinner";

const MainLayout = ({
  username,
  userId,
  isAuthenticated,
  isLoading,
}: {
  username: string;
  userId: string;
  isAuthenticated: boolean;
  isLoading: boolean;
}) => {
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Header userId={userId} username={username} />

      <main className="w-full mx-auto min-h-screen px-4 py-3">
        <Outlet />
      </main>
    </>
  );
};
export default MainLayout;
