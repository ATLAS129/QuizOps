import { Routes, Route } from "react-router";
import MainLayout from "../layouts/MainLayout";
import MainPage from "../pages/MainPage";
import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "../pages/LoginPage";
import { useCurrentUser } from "../hooks/useAuth";
import SignupPage from "../pages/SignupPage";
import ProfilePage from "../pages/ProfilePage";
import MyDecksPage from "../pages/MyDecksPage";
import DeckPage from "../pages/DeсkPage";

const AppRoutes = () => {
  const { data: user, isLoading, isError } = useCurrentUser();

  const isAuthenticated = user && !isError;

  return (
    <Routes>
      <Route
        element={
          <MainLayout
            isAuthenticated={isAuthenticated}
            isLoading={isLoading}
            userId={user?.id}
            username={user?.name}
          />
        }
      >
        <Route path="/" element={<MainPage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/profile/:userId/decks" element={<MyDecksPage />} />
        <Route path="/deck/:deckId" element={<DeckPage />} />
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
