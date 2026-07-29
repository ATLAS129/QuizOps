import { Navigate } from "react-router";
import { useCurrentUser } from "../hooks/useAuth";

export default function ProtectedRoute({ children }: { children: any }) {
  const { isLoading, isError } = useCurrentUser();

  if (isLoading) return <p>Loading</p>;
  if (isError) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
