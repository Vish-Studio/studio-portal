import React from 'react';
import { X } from 'lucide-react';
import ButtonIcon from '../button-icon/button-icon';

export type ModalVariant = 'dialog' | 'sheet';
export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalProps {
  onClose: () => void;
  variant?: ModalVariant;
  size?: ModalSize;

  // Header
  title?: string;
  description?: string;
  headerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  /**
   * When provided, renders as a separate top row (icon left, close right),
   * with title + description stacked below. Works for both variants.
   * When omitted, title sits inline with the close button.
   */
  headerIcon?: React.ReactNode;

  // Body
  children: React.ReactNode;
  bodyClassName?: string;

  // Optional sticky footer (outside scroll area)
  footer?: React.ReactNode;
}

const SIZE_CLASS: Record<ModalSize, string> = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-[440px]',
  lg: 'sm:max-w-lg',
};

export default function Modal({
  onClose,
  variant = 'dialog',
  size = 'md',
  title,
  description,
  headerClassName,
  titleClassName,
  descriptionClassName,
  headerIcon,
  children,
  bodyClassName,
  footer,
}: ModalProps) {
  const isSheet = variant === 'sheet';

  const containerAlign = isSheet
    ? 'items-end sm:items-center'
    : 'items-center';

  const containerShape = isSheet
    ? 'rounded-t-lg sm:rounded-lg'
    : 'rounded-lg';

  const closeBtnClass = isSheet
    ? 'w-8 h-8 flex items-center justify-center rounded-full bg-white/50 hover:bg-white/80 text-gray-600 transition-colors shrink-0'
    : 'w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors shrink-0';

  const defaultHeaderClass = isSheet ? '' : 'bg-white border-b border-gray-100';
  const resolvedHeaderClass = headerClassName ?? defaultHeaderClass;

  return (
    <div
      className={`modal fixed inset-0 z-[200] flex ${containerAlign} justify-center p-0 sm:p-6`}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className={`relative w-full ${SIZE_CLASS[size]} bg-white ${containerShape} overflow-hidden shadow-2xl flex flex-col`}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className={`${resolvedHeaderClass} px-6 pt-6 pb-5 shrink-0`}>
          {headerIcon ? (
            <>
              {/* Row 1: icon left, close right */}
              <div className="flex items-start justify-between mb-4">
                <div className="shrink-0">{headerIcon}</div>
                <button onClick={onClose} className={closeBtnClass}>
                  <X size={15} strokeWidth={2.5} />
                </button>
              </div>
              {/* Row 2: title + description */}
              {title && (
                <h2 className={`text-xl font-bold ${titleClassName ?? 'text-gray-900'}`}>
                  {title}
                </h2>
              )}
              {description && (
                <p className={`text-sm font-medium mt-0.5 ${descriptionClassName ?? 'text-gray-400'}`}>
                  {description}
                </p>
              )}
            </>
          ) : (
            /* Inline: title left, close right */
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                {title && (
                  <h2 className={`text-xl font-extrabold ${titleClassName ?? 'text-gray-900'}`}>
                    {title}
                  </h2>
                )}
                {description && (
                  <p className={`text-sm font-medium mt-0.5 ${descriptionClassName ?? 'text-gray-400'}`}>
                    {description}
                  </p>
                )}
              </div>

              <ButtonIcon iconName='close' clickHandler={onClose} />
            </div>
          )}
        </div>

        {/* ── Body ── */}
        <div className={`flex-1 overflow-y-auto ${bodyClassName ?? ''}`}>
          {children}
        </div>

        {/* ── Footer ── */}
        {footer && (
          <div className="modal-footer border-t border-gray-100 px-6 py-4 bg-white shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
