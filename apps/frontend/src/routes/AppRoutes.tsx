import { Routes, Route } from "react-router";
import MainLayout from "../layouts/MainLayout";
import MainPage from "../pages/MainPage";
import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "../pages/LoginPage";
import { useCurrentUser } from "../hooks/useAuth";
import SignupPage from "../pages/SignupPage";
import ProfilePage from "../pages/ProfilePage";
import MyDecksPage from "../pages/MyDecksPage";
import QuizPage from "../pages/QuizPage";
import DeckPage from "../pages/DeckPage";
import Protectedroute from "./ProtectedRoute";
import ExplorePage from "../pages/ExplorePage";

const AppRoutes = () => {
  const { data: user, isLoading, isError } = useCurrentUser();

  const isAuthenticated = user && !isError;

  return (
    <Routes>
      <Route element={<MainLayout userId={user?.id} username={user?.name} />}>
        <Route path="/" element={<ExplorePage />} />
        <Route
          element={
            <Protectedroute
              isAuthenticated={isAuthenticated}
              isLoading={isLoading}
            />
          }
        >
          <Route path="/main" element={<MainPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/profile/:userId/decks" element={<MyDecksPage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/deck/:deckId" element={<DeckPage />} />
        </Route>
      </Route>

      <Route path="/deck/:deckId/take" element={<QuizPage />} />

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
