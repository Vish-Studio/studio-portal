import { FunctionComponent, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../common/button/button';
import Select from '../../common/select/select';
import Option from '../../common/select/option';
import CalendarSidebar from './calendar-sidebar';

type CalendarVariant = 'dashboard' | 'full';

interface CalendarProps {
  variant?: CalendarVariant;
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

const formatSelectedDate = (date: Date) =>
  date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 11 }, (_, index) => currentYear - 5 + index);

const scheduleHours = ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM'];

const scheduleBlocks = [
  { title: 'Emails design', time: '9:00 - 11:20', day: 0, start: 1, span: 2, className: 'bg-cyan-100 text-cyan-800' },
  { title: 'UX meeting', time: '11:20 - 12:00', day: 0, start: 3, span: 1, className: 'bg-violet-100 text-violet-700' },
  { title: 'Project review', time: '8:20 - 9:40', day: 1, start: 0, span: 2, className: 'bg-violet-200 text-violet-800' },
  { title: 'Brain storm', time: '11:10 - 12:50', day: 1, start: 3, span: 2, className: 'bg-cyan-100 text-cyan-800' },
  { title: 'Client call', time: '8:00 - 9:30', day: 2, start: 0, span: 2, className: 'bg-gray-100 text-gray-700' },
  { title: 'Team meeting', time: '10:50 - 12:20', day: 2, start: 3, span: 2, className: 'bg-violet-200 text-violet-800' },
  { title: 'Launch prep', time: '11:30 - 12:40', day: 3, start: 3, span: 2, className: 'bg-gray-100 text-gray-700' },
  { title: 'Landing page', time: '8:00 - 10:00', day: 4, start: 0, span: 3, className: 'bg-cyan-100 text-cyan-800' },
  { title: 'UX meeting', time: '12:00 - 1:30', day: 5, start: 4, span: 2, className: 'bg-violet-200 text-violet-800' },
  { title: 'Study time', time: '8:00 - 9:20', day: 6, start: 0, span: 2, className: 'bg-violet-200 text-violet-800' },
  { title: 'New project', time: '10:30 - 12:10', day: 6, start: 3, span: 2, className: 'bg-cyan-100 text-cyan-800' },
];

const getWeekDates = (date: Date) => {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
};

const Calendar: FunctionComponent<CalendarProps> = ({ variant = 'full' }) => {
  const [visibleMonth, setVisibleMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const today = new Date();
  const compact = variant === 'dashboard';
  const days = getCalendarDays(visibleMonth);

  const setCalendarMonth = (year: number, month: number, preferredDay = selectedDate.getDate()) => {
    const lastDay = new Date(year, month + 1, 0).getDate();
    const nextSelectedDate = new Date(year, month, Math.min(preferredDay, lastDay));
    setVisibleMonth(new Date(year, month, 1));
    setSelectedDate(nextSelectedDate);
  };

  const moveMonth = (offset: number) => {
    const nextMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + offset, 1);
    setCalendarMonth(nextMonth.getFullYear(), nextMonth.getMonth());
  };

  const selectToday = () => {
    const nextToday = new Date();
    setVisibleMonth(new Date(nextToday.getFullYear(), nextToday.getMonth(), 1));
    setSelectedDate(nextToday);
  };

  const selectDate = (date: Date) => {
    setSelectedDate(date);
    setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  if (!compact) {
    const weekDates = getWeekDates(selectedDate);

    return (
      <section className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <CalendarSidebar
          visibleMonth={visibleMonth}
          selectedDate={selectedDate}
          today={today}
          days={days}
          monthNames={monthNames}
          weekDays={weekDays}
          onMoveMonth={moveMonth}
          onSelectDate={selectDate}
          isSameDate={isSameDate}
        />

        <div className="rounded-[24px] border border-gray-200 bg-(--color-surface-alt) p-4 md:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-3xl font-bold leading-none text-(--color-ink)">
                {monthNames[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
              </h2>
              <p className="mt-2 text-sm font-medium text-gray-500">{formatSelectedDate(selectedDate)}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" onClick={selectToday}>Today</Button>
              <div className="flex rounded-xl bg-white p-1">
                <button
                  type="button"
                  onClick={() => moveMonth(-1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                  aria-label="Previous month"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => moveMonth(1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                  aria-label="Next month"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              <Select
                value={String(visibleMonth.getMonth())}
                onChange={(event) => setCalendarMonth(visibleMonth.getFullYear(), Number(event.target.value))}
                wrapperClassName="w-36"
                className="h-9 bg-white px-3 py-0 text-sm font-bold"
                aria-label="Choose month"
              >
                {monthNames.map((month, index) => (
                  <Option key={month} value={String(index)}>{month}</Option>
                ))}
              </Select>
              <Select
                value={String(visibleMonth.getFullYear())}
                onChange={(event) => setCalendarMonth(Number(event.target.value), visibleMonth.getMonth())}
                wrapperClassName="w-28"
                className="h-9 bg-white px-3 py-0 text-sm font-bold"
                aria-label="Choose year"
              >
                {yearOptions.map(year => (
                  <Option key={year} value={String(year)}>{year}</Option>
                ))}
              </Select>
            </div>
          </div>

          <div className="mt-5 flex gap-3 overflow-x-auto pb-1">
            {weekDates.map(day => {
              const selected = isSameDate(day, selectedDate);
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => selectDate(day)}
                  className={`flex min-w-[140px] items-center justify-center gap-2 rounded-2xl px-5 py-4 transition-colors ${
                    selected
                      ? 'bg-white text-(--color-ink) shadow-sm'
                      : 'bg-white/50 text-gray-500 hover:bg-white'
                  }`}
                >
                  <span className="text-sm font-bold lowercase">{day.toLocaleDateString('en-GB', { weekday: 'short' })}</span>
                  <span className="text-3xl font-bold leading-none">{day.getDate()}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 overflow-x-auto rounded-[18px] bg-white p-4">
            <div className="grid min-w-[980px] grid-cols-[70px_repeat(7,minmax(120px,1fr))] grid-rows-[repeat(7,72px)]">
              {scheduleHours.map((hour, index) => (
                <div key={hour} style={{ gridColumn: 1, gridRow: index + 1 }} className="border-t border-gray-100 pt-2 text-sm font-bold text-gray-400">
                  {hour}
                </div>
              ))}
              {scheduleHours.map((hour, index) => (
                <div key={`${hour}-line`} style={{ gridColumn: '2 / -1', gridRow: index + 1 }} className="border-t border-gray-100" />
              ))}
              {scheduleBlocks.map(block => (
                <button
                  key={`${block.title}-${block.day}-${block.start}`}
                  type="button"
                  className={`m-1 rounded-2xl p-4 text-left transition-transform hover:-translate-y-0.5 ${block.className}`}
                  style={{ gridColumn: block.day + 2, gridRow: `${block.start + 1} / span ${block.span}` }}
                >
                  <span className="block text-sm font-bold">{block.title}</span>
                  <span className="mt-1 block text-xs font-semibold opacity-60">{block.time}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`rounded-[18px] ${
        compact
          ? 'bg-(--color-surface-alt) p-4 md:p-6'
          : 'border border-gray-200 bg-white p-4 md:p-6'
      }`}
    >
      <div className={`flex gap-4 ${compact ? 'flex-col' : 'flex-col lg:flex-row lg:items-end lg:justify-between'}`}>
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <CalendarDays size={16} />
            <span>Calendar</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <h2 className={`${compact ? 'text-[28px]' : 'text-[36px] md:text-[42px]'} font-bold leading-none text-(--color-ink)`}>
              {monthNames[visibleMonth.getMonth()]}
            </h2>
            <span className={`${compact ? 'text-lg' : 'text-2xl'} font-bold text-gray-400`}>
              {visibleMonth.getFullYear()}
            </span>
          </div>
          <p className="mt-2 text-sm font-medium text-gray-500">{formatSelectedDate(selectedDate)}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm" onClick={selectToday}>
            Today
          </Button>
          <div className="flex rounded-xl bg-white p-1">
            <button
              type="button"
              onClick={() => moveMonth(-1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => moveMonth(1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <Select
            value={String(visibleMonth.getMonth())}
            onChange={(event) => setCalendarMonth(visibleMonth.getFullYear(), Number(event.target.value))}
            wrapperClassName={compact ? 'w-32' : 'w-36'}
            className="h-9 bg-white px-3 py-0 text-sm font-bold"
            aria-label="Choose month"
          >
            {monthNames.map((month, index) => (
              <Option key={month} value={String(index)}>{month}</Option>
            ))}
          </Select>
          <Select
            value={String(visibleMonth.getFullYear())}
            onChange={(event) => setCalendarMonth(Number(event.target.value), visibleMonth.getMonth())}
            wrapperClassName="w-28"
            className="h-9 bg-white px-3 py-0 text-sm font-bold"
            aria-label="Choose year"
          >
            {yearOptions.map(year => (
              <Option key={year} value={String(year)}>{year}</Option>
            ))}
          </Select>
        </div>
      </div>

      <div className={`mt-5 rounded-[18px] bg-white ${compact ? 'p-3' : 'p-3 md:p-4'}`}>
        <div className={`grid grid-cols-7 ${compact ? 'gap-1.5' : 'gap-2'}`}>
          {weekDays.map(day => (
            <span
              key={day}
              className={`text-center font-bold uppercase text-gray-300 ${compact ? 'text-[9px]' : 'py-1 text-[10px] tracking-widest'}`}
            >
              {compact ? day.slice(0, 1) : day}
            </span>
          ))}

          {days.map((date, index) => {
            if (!date) return <span key={`empty-${index}`} className={compact ? 'h-9' : 'min-h-16'} />;

            const selected = isSameDate(date, selectedDate);
            const currentDay = isSameDate(date, today);

            return (
              <button
                key={date.toISOString()}
                type="button"
                onClick={() => selectDate(date)}
                className={
                  compact
                    ? `flex h-9 items-center justify-center rounded-xl text-xs font-bold transition-colors ${
                        selected
                          ? 'bg-(--color-ink) text-white'
                          : currentDay
                            ? 'bg-(--color-accent-lime) text-(--color-ink)'
                            : 'text-gray-500 hover:bg-gray-100'
                      }`
                    : `flex min-h-16 flex-col justify-between rounded-2xl border p-3 text-left transition-colors ${
                        selected
                          ? 'border-(--color-ink) bg-(--color-ink) text-white'
                          : currentDay
                            ? 'border-(--color-accent-lime) bg-(--color-accent-lime) text-(--color-ink)'
                            : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200 hover:bg-gray-50'
                      }`
                }
              >
                <span className={compact ? '' : 'text-sm font-bold'}>{date.getDate()}</span>
                {!compact && selected && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Selected</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Calendar;
