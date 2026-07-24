import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <>
      <main className="container mx-auto min-h-screen">
        <Outlet />
      </main>
    </>
  );
};
export default MainLayout;
