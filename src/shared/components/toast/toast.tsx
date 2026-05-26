import MaterialIcon from '@/src/shared/components/material-icon/material-icon';

export type ToastStatus = 'success' | 'error' | 'info';

export interface ToastProps {
  status: ToastStatus;
  title: string;
  message?: string;
  onDismiss?: () => void;
  dismissLabel?: string;
  className?: string;
}

const toastIcon: Record<ToastStatus, string> = {
  success: 'check_circle',
  error: 'error',
  info: 'info',
};

const toastTone: Record<ToastStatus, string> = {
  success: 'border-green-200 bg-green-50 text-green-700',
  error: 'border-red-200 bg-red-50 text-red-700',
  info: 'border-gray-200 bg-white text-(--color-ink)',
};

export default function Toast({
  status,
  title,
  message,
  onDismiss,
  dismissLabel = 'Dismiss notification',
  className = '',
}: ToastProps) {
  return (
    <div
      className={`toast rounded-[16px] border px-4 py-3 shadow-[0_16px_42px_rgba(18,19,22,0.12)] ${toastTone[status]} ${className}`}
      role={status === 'error' ? 'alert' : 'status'}
      aria-live={status === 'error' ? 'assertive' : 'polite'}
    >
      <div className="toast-content flex items-start gap-3">
        <MaterialIcon name={toastIcon[status]} size={20} fill className="toast-icon mt-0.5 shrink-0" />
        <div className="toast-copy min-w-0 flex-1">
          <p className="type-card-title">{title}</p>
          {message ? (
            <p className="type-muted mt-0.5 opacity-75">{message}</p>
          ) : null}
        </div>
        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            className="toast-close -mr-1 rounded-full p-1 opacity-55 transition hover:bg-black/5 hover:opacity-100"
            aria-label={dismissLabel}
          >
            <MaterialIcon name="close" size={18} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
