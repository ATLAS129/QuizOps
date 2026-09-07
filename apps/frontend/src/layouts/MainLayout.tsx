import { Outlet } from "react-router";
import Header from "../components/Header";

const MainLayout = ({
  username,
  userId,
}: {
  username: string;
  userId: string;
}) => {
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
