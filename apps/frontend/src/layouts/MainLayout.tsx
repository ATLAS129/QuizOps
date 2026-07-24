import { Outlet } from "react-router";
import Header from "../components/Header";

const MainLayout = () => {
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
