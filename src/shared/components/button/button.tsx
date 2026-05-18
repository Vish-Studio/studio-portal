import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-(--color-ink) text-white hover:bg-gray-800 disabled:hover:bg-(--color-ink)',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:hover:bg-gray-100',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:hover:bg-transparent',
  danger: 'bg-red-50 text-red-600 hover:bg-red-100 disabled:hover:bg-red-50',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 rounded-lg',
  md: 'h-10 px-4 rounded-xl',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      disabled={isDisabled}
      className={`button type-control inline-flex items-center justify-center gap-2 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
