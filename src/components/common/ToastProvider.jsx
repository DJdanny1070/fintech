/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

function getToastStyle(type) {
  switch (type) {
    case "error":
      return { background: "#dc2626", border: "1px solid #fca5a5" };
    case "warning":
      return { background: "#d97706", border: "1px solid #fbbf24" };
    case "success":
      return { background: "#059669", border: "1px solid #86efac" };
    default:
      return { background: "#0ea5e9", border: "1px solid #bae6fd" };
  }
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message, timeout = 3500) => {
    const id = Math.random().toString(36).slice(2, 9);
    const nextToast = { id, type, message };

    setToasts((s) => {
      const next = [...s, nextToast];
      return next.slice(-5);
    });

    if (timeout > 0) {
      window.setTimeout(() => {
        setToasts((s) => s.filter((x) => x.id !== id));
      }, timeout);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => setToasts((s) => s.filter((t) => t.id !== id)), []);

  const api = {
    add: addToast,
    success: (m, t) => addToast("success", m, t),
    error: (m, t) => addToast("error", m, t),
    warning: (m, t) => addToast("warning", m, t),
    info: (m, t) => addToast("info", m, t),
    remove: removeToast,
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              minWidth: 240,
              maxWidth: 320,
              padding: "12px 14px",
              borderRadius: 8,
              color: "#fff",
              boxShadow: "0 8px 24px rgba(0,0,0,0.28)",
              ...getToastStyle(t.type),
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export default ToastProvider;
