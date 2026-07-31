import { Routes, Route } from "react-router";
import MainLayout from "../layouts/MainLayout";
import MainPage from "../pages/MainPage";
import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "../pages/LoginPage";
import { useCurrentUser } from "../hooks/useAuth";
import SignupPage from "../pages/SignupPage";

const AppRoutes = () => {
  const { data: user, isLoading, isError } = useCurrentUser();

  const isAuthenticated = user && !isError;

  return (
    <Routes>
      <Route
        element={
          <MainLayout isAuthenticated={isAuthenticated} isLoading={isLoading} />
        }
      >
        <Route path="/" element={<MainPage />} />
      </Route>

      <Route
        element={
          <AuthLayout isAuthenticated={isAuthenticated} isLoading={isLoading} />
        }
      >
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
