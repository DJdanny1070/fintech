import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

/**
 * Hook to access the AuthContext.
 * Must be used inside <AuthProvider>.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
