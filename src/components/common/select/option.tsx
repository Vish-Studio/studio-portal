import React, { forwardRef } from 'react';
import { cn } from '@/src/lib/utils';

export interface OptionProps extends React.OptionHTMLAttributes<HTMLOptionElement> {
  children: React.ReactNode;
}

const Option = forwardRef<HTMLOptionElement, OptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <option
        ref={ref}
        className={cn(
          'text-gray-900 bg-white hover:bg-gray-50 focus:bg-gray-50',
          'py-2 px-4',
          className,
        )}
        {...props}
      >
        {children}
      </option>
    );
  },
);

Option.displayName = 'Option';

export default Option;
