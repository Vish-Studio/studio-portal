import React, { FunctionComponent, ReactNode, useEffect } from 'react';
import { X } from '@/src/shared/components/material-icon/material-lucide-icons';
import { FEEDBACK_MESSAGES } from '@/src/app/messages';
import Button from '../button/button';

export type SidebarWidth = 'sm' | 'md' | 'lg';

export interface FormSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  /** sm = 380px  md = 460px  lg = 560px */
  width?: SidebarWidth;
  children: React.ReactNode;
}

const WIDTH: Record<SidebarWidth, string> = {
  sm: 'w-full sm:max-w-[300px]',
  md: 'w-full sm:max-w-[460px]',
  lg: 'w-full sm:max-w-[560px]',
};

/**
 * Reusable right-side drawer.
 * Children are responsible for the form element, scrollable body, and footer buttons.
 * This keeps the sidebar unopinionated about form libraries and submit strategy.
 *
 * Typical usage:
 * ```tsx
 * <FormSidebar isOpen={open} onClose={close} title="New Client">
 *   <form onSubmit={handleSubmit(onSave)} className="flex flex-col flex-1 min-h-0">
 *     <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
 *       ...fields...
 *     </div>
 *     <FormSidebarFooter>
 *       <button type="submit">Save</button>
 *     </FormSidebarFooter>
 *   </form>
 * </FormSidebar>
 * ```
 */
const FormSidebar: FunctionComponent<FormSidebarProps> = ({
  isOpen,
  onClose,
  title,
  description,
  width = 'md',
  children,
}) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        onClick={onClose}
        className={`form-sidebar-overlay fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        aria-hidden="true"
      />

      {/* ── Panel ── */}
      <aside
        className={`form-sidebar fixed inset-y-0 right-0 z-50 flex flex-col border-l border-(--color-sidebar-border-dark) bg-(--color-sidebar-bg) text-white shadow-2xl shadow-black/35
          ${WIDTH[width]}
          transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        aria-modal="true"
        role="dialog"
        aria-label={title}
      >
        {/* Header */}
        <div className="form-sidebar-header flex items-start justify-between gap-4 px-6 pt-6 pb-5 border-b border-white/10 shrink-0">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            {description && (
              <p className="mt-1 text-sm leading-5 text-gray-500">{description}</p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/8 text-gray-400 hover:bg-white/12 hover:text-white transition-colors shrink-0 mt-0.5"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body — caller owns scroll + footer */}
        <div className="form-sidebar-body flex flex-col flex-1 min-h-0">
          {children}
        </div>
      </aside>
    </>
  );
}


/**
 * Sticky footer helper — place inside your form, after the scrollable fields div.
*/
export function FormSidebarFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="form-sidebar-footer flex shrink-0 gap-3 border-t border-white/10 bg-(--color-sidebar-bg) px-6 py-4 [&_a]:flex-1 [&_a>button]:w-full [&_button]:min-w-0 [&_button]:flex-1">
      {children}
    </div>
  );
}

export function FormSidebarError({
  title = FEEDBACK_MESSAGES.common.unableToSave,
  message,
}: {
  title?: string;
  message: string | null;
}) {
  if (!message) return null;

  return (
    <div className="form-sidebar-error rounded-[16px] border border-red-100 bg-red-50 px-4 py-3" role="alert">
      <p className="type-label font-semibold text-red-700">{title}</p>
      <p className="type-muted mt-1 text-red-600">{message}</p>
    </div>
  );
}

const getNestedErrorMessage = (value: unknown): string | null => {
  if (!value || typeof value !== 'object') return null;
  if ('message' in value && typeof value.message === 'string') return value.message;

  for (const child of Object.values(value as Record<string, unknown>)) {
    const message = getNestedErrorMessage(child);
    if (message) return message;
  }

  return null;
};

export function getFormErrorMessage(
  errors: Record<string, unknown>,
  fallback = FEEDBACK_MESSAGES.common.fixHighlightedFields,
) {
  return getNestedErrorMessage(errors) ?? fallback;
}

export function FormSidebarActions({
  onCancel,
  submitLabel,
  cancelLabel = 'Cancel',
  isSubmitting = false,
  isDirty = true,
  disabled = false,
  submitIcon,
}: {
  onCancel: () => void;
  submitLabel: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  isDirty?: boolean;
  disabled?: boolean;
  submitIcon?: ReactNode;
}) {
  return (
    <FormSidebarFooter>
      <Button type="button" onClick={onCancel} variant="secondary" className="flex-1">
        {cancelLabel}
      </Button>
      <Button
        type="submit"
        loading={isSubmitting}
        disabled={disabled || isSubmitting || !isDirty}
        iconLeft={submitIcon}
        className="flex-1"
      >
        {submitLabel}
      </Button>
    </FormSidebarFooter>
  );
}

export default FormSidebar;
