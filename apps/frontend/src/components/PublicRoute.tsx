import { Navigate } from "react-router";
import { useCurrentUser } from "../hooks/useAuth";

export default function PublicRoute({ children }: { children: any }) {
  const { data: user, isLoading, isError } = useCurrentUser();

  if (isLoading) return <p>Loading...</p>;
  if (user && !isError) return <Navigate to="/" replace />;

  return children;
}
