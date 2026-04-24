import React, { FunctionComponent, useEffect } from 'react';
import { X } from 'lucide-react';

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
  sm: 'w-3/4 sm:max-w-[300px]',
  md: 'w-3/4 sm:max-w-[460px]',
  lg: 'w-3/4 sm:max-w-[560px]',
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
        className={`fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        aria-hidden="true"
      />

      {/* ── Panel ── */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex flex-col bg-white shadow-2xl
          ${WIDTH[width]}
          transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        aria-modal="true"
        role="dialog"
        aria-label={title}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 pt-6 pb-5 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors shrink-0 mt-0.5"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body — caller owns scroll + footer */}
        <div className="flex flex-col flex-1 min-h-0">
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
    <div className="shrink-0 border-t border-gray-100 px-6 py-4 bg-white flex gap-3">
      {children}
    </div>
  );
}

export default FormSidebar;