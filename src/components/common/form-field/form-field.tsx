import React from 'react';

// ─── FormField wrapper ────────────────────────────────────────────────────────

export interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

/**
 * Labelled form field with error and hint support.
 * Works with any input — just pass it as children.
 * Designed to compose with react-hook-form's `register` spread.
 */
export default function FormField({ label, required, error, hint, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

// ─── Input class helper ───────────────────────────────────────────────────────

/**
 * Returns Tailwind input classes with optional error state styling.
 * Pass `hasError` to add red border when a validation error is present.
 */
export function inputCls(hasError?: boolean): string {
  return [
    'w-full bg-gray-50 border text-gray-900 text-base sm:text-sm py-3 px-4 rounded-xl',
    'focus:outline-none focus:bg-white focus:ring-4 focus:ring-gray-100 transition-all',
    hasError
      ? 'border-red-300 focus:border-red-400'
      : 'border-gray-200 focus:border-gray-400',
  ].join(' ');
}

// ─── Select class helper ──────────────────────────────────────────────────────

export function selectCls(hasError?: boolean): string {
  return inputCls(hasError) + ' cursor-pointer';
}
