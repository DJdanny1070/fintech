import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * Wraps a route element and redirects unauthenticated users to /login.
 * Preserves the attempted URL so login can redirect back after success.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // While the session is being restored, render nothing (avoid flash)
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontSize: 14,
          color: "var(--text-muted)",
          fontFamily: "var(--font)",
        }}
      >
        <span className="spinner" style={{ marginRight: 8 }} />
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
