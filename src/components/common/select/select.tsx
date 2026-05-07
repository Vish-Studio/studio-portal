import React, {
  Children,
  forwardRef,
  isValidElement,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?:       boolean;
  wrapperClassName?: string;
}

interface SelectOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

const optionToString = (value: unknown) => {
  if (Array.isArray(value)) return value.join(',');
  return value == null ? '' : String(value);
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({
    hasError,
    className,
    wrapperClassName,
    children,
    disabled,
    value,
    defaultValue,
    onChange,
    onBlur,
    name,
    id,
    ...props
  }, ref) => {
    const internalRef = useRef<HTMLSelectElement | null>(null);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(() => optionToString(value ?? defaultValue));

    const options = useMemo<SelectOption[]>(() => (
      Children.toArray(children).flatMap(child => {
        if (!isValidElement<React.OptionHTMLAttributes<HTMLOptionElement>>(child)) return [];
        const optionValue = optionToString(child.props.value ?? child.props.children);
        return [{
          value: optionValue,
          label: child.props.children,
          disabled: child.props.disabled,
        }];
      })
    ), [children]);

    const selectedOption =
      options.find(option => option.value === selectedValue) ??
      options.find(option => !option.disabled) ??
      options[0];

    const syncFromNativeSelect = () => {
      const nativeValue = internalRef.current?.value;
      if (nativeValue !== undefined) setSelectedValue(nativeValue);
    };

    const setRefs = (node: HTMLSelectElement | null) => {
      internalRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };

    useLayoutEffect(() => {
      syncFromNativeSelect();
    }, []);

    useEffect(() => {
      if (value !== undefined) setSelectedValue(optionToString(value));
    }, [value]);

    useEffect(() => {
      const handlePointerDown = (event: PointerEvent) => {
        if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
      };

      document.addEventListener('pointerdown', handlePointerDown);
      return () => document.removeEventListener('pointerdown', handlePointerDown);
    }, []);

    const selectOption = (nextValue: string) => {
      const nativeSelect = internalRef.current;
      if (!nativeSelect) return;

      nativeSelect.value = nextValue;
      setSelectedValue(nextValue);
      setIsOpen(false);

      onChange?.({
        target: nativeSelect,
        currentTarget: nativeSelect,
      } as React.ChangeEvent<HTMLSelectElement>);
    };

    return (
      <div ref={rootRef} className={cn('relative', wrapperClassName)}>
        <select
          ref={setRefs}
          id={id}
          name={name}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={onBlur}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          {...props}
        >
          {children}
        </select>

        <button
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => {
            syncFromNativeSelect();
            setIsOpen(open => !open);
          }}
          onBlur={() => {
            const nativeSelect = internalRef.current;
            if (nativeSelect) {
              onBlur?.({
                target: nativeSelect,
                currentTarget: nativeSelect,
              } as React.FocusEvent<HTMLSelectElement>);
            }
          }}
          className={cn(
            'flex w-full items-center justify-between gap-3 border bg-gray-50 px-4 py-3 text-left text-base text-gray-900 rounded-xl sm:text-sm',
            'focus:outline-none focus:bg-white focus:ring-4 focus:ring-gray-100 transition-all',
            disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-white',
            hasError
              ? 'border-red-300 focus:border-red-400'
              : 'border-gray-200 focus:border-gray-400',
            className,
          )}
        >
          <span className={cn('block min-w-0 truncate', !selectedOption?.value && 'text-gray-500')}>
            {selectedOption?.label ?? 'Select...'}
          </span>
          <ChevronDown
            size={14}
            className={cn(
              'shrink-0 text-gray-400 transition-transform',
              isOpen && 'rotate-180',
            )}
          />
        </button>

        {isOpen && !disabled && (
          <div
            role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-60 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-1.5 shadow-[0_18px_50px_rgba(15,23,42,0.16)]"
          >
            {options.map(option => {
              const isSelected = option.value === selectedValue;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={option.disabled}
                  onClick={() => selectOption(option.value)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors',
                    option.disabled
                      ? 'cursor-not-allowed text-gray-300'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    isSelected && 'bg-black text-white hover:bg-black hover:text-white',
                  )}
                >
                  <span className="flex-1 truncate">{option.label}</span>
                  {isSelected && <Check size={14} className="shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';

export default Select;
