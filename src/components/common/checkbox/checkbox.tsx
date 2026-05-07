import type { InputHTMLAttributes, ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: ReactNode;
}

export default function Checkbox({ label, description, checked, className = '', ...props }: CheckboxProps) {
  return (
    <label className={cn('flex cursor-pointer items-start gap-3', props.disabled && 'cursor-not-allowed opacity-50', className)}>
      <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          className="peer sr-only"
          {...props}
        />
        <span className="flex h-5 w-5 items-center justify-center rounded-md border border-gray-300 bg-white transition-colors peer-checked:border-(--color-ink) peer-checked:bg-(--color-ink) peer-focus-visible:ring-4 peer-focus-visible:ring-gray-100">
          <Check size={13} className={cn('text-white transition-opacity', checked ? 'opacity-100' : 'opacity-0')} />
        </span>
      </span>
      {(label || description) && (
        <span className="min-w-0">
          {label && <span className="block text-sm font-bold text-(--color-ink)">{label}</span>}
          {description && <span className="mt-1 block text-xs font-medium leading-5 text-gray-400">{description}</span>}
        </span>
      )}
    </label>
  );
}
