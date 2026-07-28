import { Routes, Route } from "react-router";
import MainLayout from "../layouts/MainLayout";
import MainPage from "../pages/MainPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<MainPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
