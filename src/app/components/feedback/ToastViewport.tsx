import { useEffect } from "react";
import { useUIStore, type ToastItem } from "@/src/app/stores/uiStore";
import Toast from "@/src/shared/components/toast/toast";

function ToastCard({ toast }: { toast: ToastItem }) {
  const dismissToast = useUIStore(state => state.dismissToast);

  useEffect(() => {
    const timeout = window.setTimeout(() => dismissToast(toast.id), 4200);
    return () => window.clearTimeout(timeout);
  }, [dismissToast, toast.id]);

  return (
    <Toast
      status={toast.status}
      title={toast.title}
      message={toast.message}
      onDismiss={() => dismissToast(toast.id)}
    />
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
