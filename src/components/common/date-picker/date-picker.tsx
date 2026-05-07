import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
} from 'react';
import { format, getDay, isSameDay, startOfDay } from 'date-fns';
import MaterialIcon from '../material-icon/material-icon';
import ButtonIcon from '../button-icon/button-icon';
import Select from '../select/select';
import Option from '../select/option';
import { cn } from '@/src/lib/utils';

interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  hasError?: boolean;
  wrapperClassName?: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const toInputValue = (date: Date) => format(date, 'yyyy-MM-dd');

const fromInputValue = (value?: string) => {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return startOfDay(new Date(year, month - 1, day));
};

const getMonthDays = (monthDate: Date) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const first = new Date(year, month, 1);
  const total = new Date(year, month + 1, 0).getDate();
  const offset = getDay(first);
  return [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: total }, (_, index) => new Date(year, month, index + 1)),
  ];
};

const getYearOptions = (baseYear: number) =>
  Array.from({ length: 81 }, (_, index) => baseYear - 40 + index);

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({
    value,
    defaultValue,
    onChange,
    onBlur,
    name,
    id,
    disabled,
    hasError,
    className,
    wrapperClassName,
    placeholder = 'Select date',
    ...props
  }, ref) => {
    const initialValue = typeof value === 'string' ? value : typeof defaultValue === 'string' ? defaultValue : '';
    const [selectedValue, setSelectedValue] = useState(initialValue);
    const [isOpen, setIsOpen] = useState(false);
    const selectedDate = fromInputValue(selectedValue);
    const [visibleMonth, setVisibleMonth] = useState(selectedDate ?? startOfDay(new Date()));
    const rootRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const days = useMemo(() => getMonthDays(visibleMonth), [visibleMonth]);
    const years = useMemo(() => getYearOptions(visibleMonth.getFullYear()), [visibleMonth]);

    const setRefs = (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };

    useEffect(() => {
      if (typeof value === 'string') {
        setSelectedValue(value);
        const nextDate = fromInputValue(value);
        if (nextDate) setVisibleMonth(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1));
      }
    }, [value]);

    useEffect(() => {
      const handlePointerDown = (event: PointerEvent) => {
        if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
      };

      document.addEventListener('pointerdown', handlePointerDown);
      return () => document.removeEventListener('pointerdown', handlePointerDown);
    }, []);

    const emitChange = (nextValue: string) => {
      const input = inputRef.current;
      if (!input) return;

      input.value = nextValue;
      setSelectedValue(nextValue);
      onChange?.({
        target: input,
        currentTarget: input,
      } as ChangeEvent<HTMLInputElement>);
    };

    const selectDate = (date: Date) => {
      emitChange(toInputValue(date));
      setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
      setIsOpen(false);
    };

    const changeMonth = (nextMonth: number) => {
      setVisibleMonth(current => new Date(current.getFullYear(), nextMonth, 1));
    };

    const changeYear = (nextYear: number) => {
      setVisibleMonth(current => new Date(nextYear, current.getMonth(), 1));
    };

    return (
      <div ref={rootRef} className={cn('relative', wrapperClassName)}>
        <input
          ref={setRefs}
          id={id}
          name={name}
          value={selectedValue}
          readOnly
          tabIndex={-1}
          className="sr-only"
          onBlur={onBlur}
          {...props}
        />

        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(open => !open)}
          onBlur={() => {
            const input = inputRef.current;
            if (input) {
              onBlur?.({
                target: input,
                currentTarget: input,
              } as FocusEvent<HTMLInputElement>);
            }
          }}
          className={cn(
            'flex w-full items-center justify-between gap-3 rounded-xl border bg-gray-50 px-4 py-3 text-left text-base text-gray-900 transition-all sm:text-sm',
            'focus:outline-none focus:bg-white focus:ring-4 focus:ring-gray-100',
            disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-white',
            hasError ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-gray-400',
            className,
          )}
        >
          <span className={cn('truncate font-semibold', !selectedDate && 'text-gray-400')}>
            {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : placeholder}
          </span>
          <MaterialIcon name="calendar_today" size={18} className="shrink-0 text-gray-500" />
        </button>

        {isOpen && !disabled && (
          <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full min-w-[18rem] max-w-[calc(100vw-2rem)] rounded-[18px] border border-gray-200 bg-white p-3 shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:min-w-[20rem]">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_5.75rem] gap-2">
                <Select
                  value={visibleMonth.getMonth()}
                  onChange={event => changeMonth(Number(event.target.value))}
                  aria-label="Choose month"
                  className="h-9 rounded-xl bg-gray-50 px-3 py-0 text-xs font-bold"
                >
                  {MONTH_NAMES.map((month, index) => (
                    <Option key={month} value={index}>{month}</Option>
                  ))}
                </Select>
                <Select
                  value={visibleMonth.getFullYear()}
                  onChange={event => changeYear(Number(event.target.value))}
                  aria-label="Choose year"
                  className="h-9 rounded-xl bg-gray-50 px-3 py-0 text-xs font-bold"
                >
                  {years.map(year => (
                    <Option key={year} value={year}>{year}</Option>
                  ))}
                </Select>
              </div>
              <div className="flex shrink-0 items-center justify-end gap-1">
                <ButtonIcon
                  iconName="chevron_left"
                  aria-label="Previous month"
                  clickHandler={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}
                />
                <ButtonIcon
                  iconName="chevron_right"
                  aria-label="Next month"
                  clickHandler={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))}
                />
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {DAY_NAMES.map(day => (
                <span key={day} className="py-1 text-[10px] font-bold uppercase text-gray-400">
                  {day}
                </span>
              ))}

              {days.map((date, index) => {
                if (!date) return <span key={`empty-${index}`} className="h-9" />;
                const selected = selectedDate && isSameDay(date, selectedDate);
                const today = isSameDay(date, new Date());

                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    onClick={() => selectDate(date)}
                    className={cn(
                      'flex h-9 items-center justify-center rounded-xl text-xs font-bold transition-colors',
                      selected
                        ? 'bg-(--color-ink) text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                      today && !selected && 'bg-(--color-accent-lime) text-(--color-ink)',
                    )}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  },
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;
