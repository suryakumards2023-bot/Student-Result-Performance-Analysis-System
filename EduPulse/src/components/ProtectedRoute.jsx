import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth(); const location = useLocation();
  if (loading) return <div className="page">Loading your account…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return !allowedRoles || allowedRoles.includes(user.role?.toLowerCase()) ? children : <Navigate to="/dashboard" replace state={{ from: location }} />;
}
