import { Routes, Route } from "react-router";
import MainLayout from "../layouts/MainLayout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<div>Main page</div>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
