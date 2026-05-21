import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { Check } from '@/src/shared/components/material-icon/material-lucide-icons';
import { cn } from '@/src/lib/utils';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: ReactNode;
  labelClassName?: string;
  descriptionClassName?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox({
  label,
  description,
  checked,
  className = '',
  labelClassName = '',
  descriptionClassName = '',
  ...props
}, ref) {
  return (
    <label className={cn('checkbox flex cursor-pointer items-start gap-3', props.disabled && 'cursor-not-allowed opacity-50', className)}>
      <span className="checkbox-control relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          className="peer sr-only"
          {...props}
        />
        <span className="checkbox-box flex h-5 w-5 items-center justify-center rounded-md border border-gray-300 bg-white transition-colors peer-checked:border-(--color-ink) peer-checked:bg-(--color-ink) peer-focus-visible:ring-4 peer-focus-visible:ring-gray-100 peer-checked:[&_span]:opacity-100">
          <span className="opacity-0 transition-opacity">
            <Check size={13} className="text-white" />
          </span>
        </span>
      </span>
      {(label || description) && (
        <span className="checkbox-content min-w-0">
          {label && <span className={cn('block text-sm font-bold text-(--color-ink)', labelClassName)}>{label}</span>}
          {description && (
            <span className={cn('mt-1 block text-xs font-medium leading-5 text-gray-400', descriptionClassName)}>
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  );
});

export default Checkbox;
