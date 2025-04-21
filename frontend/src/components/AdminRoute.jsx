import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { token, role, loading } = useAuth();

  if (loading) return null;

  if (!token || role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
