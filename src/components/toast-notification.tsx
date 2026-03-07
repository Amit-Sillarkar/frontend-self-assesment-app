// ─────────────────────────────────────────────
// FILE: src/components/toast-notification.tsx
//
// Lightweight toast system — no extra library.
// Uses a simple context + fixed overlay.
//
// USAGE in any page:
//   import { useToast } from "@/components/toast-notification";
//
//   const toast = useToast();
//   toast.success("User created successfully.");
//   toast.error("Something went wrong.");
//
// Wrap your app root (or layout) with <ToastProvider>
// ─────────────────────────────────────────────

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { CheckCircle2Icon, XCircleIcon, XIcon, Trash2Icon, InfoIcon } from "lucide-react";

// ── Types ─────────────────────────────────────

type ToastType = "success" | "error" | "info" | "delete";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  success: (msg: string) => void;
  error:   (msg: string) => void;
  info:    (msg: string) => void;
  deleted: (msg: string) => void;
}

// ── Context ───────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ── Provider ──────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((type: ToastType, message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    // Auto-dismiss after 3.5s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismiss = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  const ctx: ToastContextValue = {
    success: (msg) => push("success", msg),
    error:   (msg) => push("error",   msg),
    info:    (msg) => push("info",    msg),
    deleted: (msg) => push("delete",  msg),
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}

      {/* ── Toast stack ── */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

// ── Individual toast item ─────────────────────

const TOAST_STYLES: Record<ToastType, { bg: string; border: string; icon: ReactNode; iconColor: string }> = {
  success: {
    bg: "bg-white",
    border: "border-l-4 border-l-green-500",
    iconColor: "text-green-500",
    icon: <CheckCircle2Icon className="w-5 h-5" />,
  },
  error: {
    bg: "bg-white",
    border: "border-l-4 border-l-destructive",
    iconColor: "text-destructive",
    icon: <XCircleIcon className="w-5 h-5" />,
  },
  info: {
    bg: "bg-white",
    border: "border-l-4 border-l-primary",
    iconColor: "text-primary",
    icon: <InfoIcon className="w-5 h-5" />,
  },
  delete: {
    bg: "bg-white",
    border: "border-l-4 border-l-destructive",
    iconColor: "text-destructive",
    icon: <Trash2Icon className="w-5 h-5" />,
  },
};

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const style = TOAST_STYLES[toast.type];
  return (
    <div
      className={[
        "pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border border-border min-w-70 max-w-sm",
        style.bg,
        style.border,
        "animate-in slide-in-from-bottom-4 duration-300",
      ].join(" ")}
    >
      <span className={`mt-0.5 shrink-0 ${style.iconColor}`}>{style.icon}</span>
      <p className="flex-1 text-sm font-medium text-foreground leading-snug">
        {toast.message}
      </p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors mt-0.5"
      >
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
}