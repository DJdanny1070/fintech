import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../components/common/ToastProvider";

/**
 * Wraps a route element and redirects unauthenticated users to /login.
 * Preserves the attempted URL so login can redirect back after success.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const toast = useToast();
  const wasAuthenticated = useRef(false);

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated && wasAuthenticated.current) {
      toast.warning("Session expired");
    }
    wasAuthenticated.current = isAuthenticated;
  }, [isAuthenticated, loading, toast]);

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
