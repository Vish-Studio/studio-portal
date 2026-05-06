import { FunctionComponent, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Select from '../../common/select/select';
import Option from '../../common/select/option';

type CalendarVariant = 'dashboard' | 'full';

interface CalendarProps {
  variant?: CalendarVariant;
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
  className?: string;
}

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 13 }, (_, index) => currentYear - 6 + index);

const isSameDate = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const getCalendarDays = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = new Date(year, month, 1).getDay();
  const days: Array<Date | null> = [];

  for (let index = 0; index < startOffset; index += 1) days.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) days.push(new Date(year, month, day));
  while (days.length % 7 !== 0) days.push(null);

  return days;
};

const Calendar: FunctionComponent<CalendarProps> = ({
  variant = 'full',
  selectedDate: controlledSelectedDate,
  onDateChange,
  className = '',
}) => {
  const [visibleMonth, setVisibleMonth] = useState(new Date());
  const [internalSelectedDate, setInternalSelectedDate] = useState(new Date());
  const [pickerOpen, setPickerOpen] = useState(false);

  const compact = variant === 'dashboard';
  const selectedDate = controlledSelectedDate ?? internalSelectedDate;
  const days = getCalendarDays(visibleMonth);

  const updateSelectedDate = (date: Date) => {
    if (!controlledSelectedDate) setInternalSelectedDate(date);
    onDateChange?.(date);
  };

  const setCalendarMonth = (year: number, month: number, preferredDay = selectedDate.getDate()) => {
    const lastDay = new Date(year, month + 1, 0).getDate();
    const nextSelectedDate = new Date(year, month, Math.min(preferredDay, lastDay));
    setVisibleMonth(new Date(year, month, 1));
    updateSelectedDate(nextSelectedDate);
  };

  const moveMonth = (offset: number) => {
    const nextMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + offset, 1);
    setCalendarMonth(nextMonth.getFullYear(), nextMonth.getMonth());
  };

  const selectDate = (date: Date) => {
    updateSelectedDate(date);
    setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  return (
    <section
      className={`rounded-[18px] bg-(--color-ink) text-white ${compact ? 'p-4 sm:p-5' : 'w-full p-4 md:p-6'
        } ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => setPickerOpen(open => !open)}
            className="text-left"
            aria-expanded={pickerOpen}
          >
            <h2 className={`${compact ? 'text-sm lg:text-[24px]' : 'text-[28px] md:text-[32px]'} font-bold leading-none text-white`}>
              {monthNames[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
            </h2>
          </button>
        </div>

        <div className={`flex items-center ${compact ? 'gap-1' : 'gap-4'}`}>
          <button
            type="button"
            onClick={() => moveMonth(-1)}
            className={`${compact ? 'h-7 w-7 rounded-lg' : 'h-9 w-9 rounded-xl'} flex items-center justify-center text-gray-400 transition-colors hover:bg-white/10 hover:text-white`}
            aria-label="Previous month"
          >
            <ChevronLeft size={compact ? 18 : 22} />
          </button>
          <button
            type="button"
            onClick={() => moveMonth(1)}
            className={`${compact ? 'h-7 w-7 rounded-lg' : 'h-9 w-9 rounded-xl'} flex items-center justify-center text-gray-400 transition-colors hover:bg-white/10 hover:text-white`}
            aria-label="Next month"
          >
            <ChevronRight size={compact ? 18 : 22} />
          </button>
        </div>
      </div>

      {pickerOpen && (
        <div className={`${compact ? 'mt-3' : 'mt-5'} grid gap-2 sm:grid-cols-2`}>
          <Select
            value={String(visibleMonth.getMonth())}
            onChange={(event) => setCalendarMonth(visibleMonth.getFullYear(), Number(event.target.value))}
            className={`${compact ? 'h-8 text-xs' : 'h-10 text-sm'} border-white/10 bg-white/10 px-3 py-0 font-bold text-white hover:bg-white/15 focus:bg-white/10 focus:ring-white/10`}
            aria-label="Choose month"
          >
            {monthNames.map((month, index) => (
              <Option key={month} value={String(index)}>{month}</Option>
            ))}
          </Select>
          <Select
            value={String(visibleMonth.getFullYear())}
            onChange={(event) => setCalendarMonth(Number(event.target.value), visibleMonth.getMonth())}
            className={`${compact ? 'h-8 text-xs' : 'h-10 text-sm'} border-white/10 bg-white/10 px-3 py-0 font-bold text-white hover:bg-white/15 focus:bg-white/10 focus:ring-white/10`}
            aria-label="Choose year"
          >
            {yearOptions.map(year => (
              <Option key={year} value={String(year)}>{year}</Option>
            ))}
          </Select>
        </div>
      )}

      <div className={`${compact ? 'mt-6' : 'mt-8'} grid grid-cols-7 ${compact ? 'gap-x-1.5 gap-y-3' : 'gap-x-2 gap-y-4'}`}>
        {weekDays.map(day => (
          <span
            key={day}
            className={`text-center font-bold uppercase text-gray-400 ${compact ? 'text-[9px]' : 'text-[11px] tracking-widest'}`}
          >
            {day.slice(0, 2)}
          </span>
        ))}

        {days.map((date, index) => {
          if (!date) return <span key={`empty-${index}`} className={compact ? 'h-8' : 'h-10'} />;

          const selected = isSameDate(date, selectedDate);

          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => selectDate(date)}
              className={`flex items-center justify-center rounded-full font-bold transition-colors ${compact ? 'h-8 text-xs' : 'h-10 text-sm'
                } ${selected
                  ? 'bg-(--color-accent-lime) text-(--color-ink)'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default Calendar;
