import { createContext, useCallback, useContext, useRef, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, tone = "ok") => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, message, tone }]);
      window.setTimeout(() => dismiss(id), 4200);
    },
    [dismiss]
  );

  const toast = {
    success: (message) => push(message, "ok"),
    error: (message) => push(message, "over"),
    info: (message) => push(message, "warn"),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 w-[min(92vw,22rem)]">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`rounded border px-4 py-3 text-sm shadow-lg backdrop-blur-sm font-body animate-[fadeIn_150ms_ease-out] ${
              t.tone === "ok"
                ? "bg-canvas-50/95 border-sage-500/60 text-sage-600"
                : t.tone === "over"
                ? "bg-canvas-50/95 border-wax-500/60 text-wax-600"
                : "bg-canvas-50/95 border-warn-500/60 text-warn-600"
            }`}
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
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
