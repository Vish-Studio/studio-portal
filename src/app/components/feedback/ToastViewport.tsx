import { useEffect } from "react";
import { MaterialIcon } from "@/src/shared/components";
import { useUIStore, type ToastItem } from "@/src/app/stores/uiStore";

const toastIcon: Record<ToastItem["status"], string> = {
  success: "check_circle",
  error: "error",
  info: "info",
};

const toastTone: Record<ToastItem["status"], string> = {
  success: "border-green-200 bg-green-50 text-green-700",
  error: "border-red-200 bg-red-50 text-red-700",
  info: "border-gray-200 bg-white text-(--color-ink)",
};

function ToastCard({ toast }: { toast: ToastItem }) {
  const dismissToast = useUIStore(state => state.dismissToast);

  useEffect(() => {
    const timeout = window.setTimeout(() => dismissToast(toast.id), 4200);
    return () => window.clearTimeout(timeout);
  }, [dismissToast, toast.id]);

  return (
    <div className={`toast rounded-[16px] border px-4 py-3 shadow-[0_16px_42px_rgba(18,19,22,0.12)] ${toastTone[toast.status]}`}>
      <div className="toast-content flex items-start gap-3">
        <MaterialIcon name={toastIcon[toast.status]} size={20} fill className="toast-icon mt-0.5 shrink-0" />
        <div className="toast-copy min-w-0 flex-1">
          <p className="type-card-title">{toast.title}</p>
          {toast.message ? (
            <p className="type-muted mt-0.5 opacity-75">{toast.message}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => dismissToast(toast.id)}
          className="toast-close -mr-1 rounded-full p-1 opacity-55 transition hover:bg-black/5 hover:opacity-100"
          aria-label="Dismiss notification"
        >
          <MaterialIcon name="close" size={18} />
        </button>
      </div>
    </div>
  );
}

export function ToastViewport() {
  const toasts = useUIStore(state => state.toasts);
  const hasActiveOperation = useUIStore(state => state.activeOperations.length > 0);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className={`toast-viewport fixed inset-x-4 z-[90] flex flex-col gap-2 sm:left-auto sm:w-[390px] ${hasActiveOperation ? 'bottom-24' : 'bottom-4'}`}>
      {toasts.map(toast => (
        <ToastCard key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
