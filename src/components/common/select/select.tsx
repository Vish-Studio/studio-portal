import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?:       boolean;
  wrapperClassName?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ hasError, className, wrapperClassName, children, disabled, ...props }, ref) => {
    return (
      <div className={cn('relative', wrapperClassName)}>
        <select
          ref={ref}
          disabled={disabled}
          className={cn(
            'w-full appearance-none bg-gray-50 border text-gray-900 text-sm py-3 px-4 pr-10 rounded-xl',
            'cursor-pointer focus:outline-none focus:bg-white focus:ring-4 focus:ring-gray-100 transition-all',
            hasError
              ? 'border-red-300 focus:border-red-400'
              : 'border-gray-200 focus:border-gray-400',
            className,
          )}
          {...props}
        >
          {children}
        </select>

        {!disabled && (
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';

export default Select;
