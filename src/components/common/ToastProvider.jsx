/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message, timeout = 3000) => {
    const id = Math.random().toString(36).slice(2, 9);
    const t = { id, type, message };
    setToasts((s) => [t, ...s]);
    if (timeout > 0) setTimeout(() => setToasts((s) => s.filter(x => x.id !== id)), timeout);
    return id;
  }, []);

  const removeToast = useCallback((id) => setToasts((s) => s.filter(t => t.id !== id)), []);

  const api = {
    add: addToast,
    success: (m, t) => addToast("success", m, t),
    error: (m, t) => addToast("error", m, t),
    info: (m, t) => addToast("info", m, t),
    remove: removeToast,
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div style={{position:'fixed',top:20,right:20,zIndex:9999,display:'flex',flexDirection:'column',gap:8}}>
        {toasts.map(t => (
          <div key={t.id} style={{minWidth:220,padding:12,borderRadius:8,color:'#fff',boxShadow:'0 8px 24px rgba(0,0,0,0.3)',background:t.type==='error'?'#dc2626':t.type==='success'?'#059669':'#0ea5e9'}}>
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
