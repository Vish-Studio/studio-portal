import { DAY_NAMES_SHORT } from '@/src/data/calendar';
import { EVENT_TYPE_CONFIG } from '../schedule/event-types';
import { getDayEvents, isSameDay } from './calendar-utils';
import type { CalendarEventMap } from './calendar-utils';

interface MiniMonthCalendarProps {
  currentDate: Date;
  selectedDate: Date;
  today: Date;
  customEvents: CalendarEventMap;
  monthEventsCount?: number;
  onSelectDate: (date: Date) => void;
}

export default function MiniMonthCalendar({
  currentDate,
  selectedDate,
  today,
  customEvents,
  monthEventsCount,
  onSelectDate,
}: MiniMonthCalendarProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = new Date(year, month, 1).getDay();

  return (
    <div className="h-full rounded-[18px] border border-gray-200 bg-white p-4 md:p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Calendar</p>
          <h3 className="mt-1 text-xl font-bold leading-none text-(--color-ink)">
            {currentDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
          </h3>
        </div>
        {typeof monthEventsCount === 'number' && (
          <span className="rounded-md bg-gray-100 px-2 py-1 text-[12px] font-bold text-gray-700">
            {monthEventsCount}
          </span>
        )}
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {DAY_NAMES_SHORT.map(day => (
          <span key={day} className="text-center text-[9px] font-bold uppercase text-gray-300">
            {day.slice(0, 1)}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDayOfMonth }).map((_, index) => (
          <span key={`mini-empty-start-${index}`} className="h-9" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const cellDate = new Date(year, month, day);
          const active = isSameDay(cellDate, selectedDate);
          const currentDay = isSameDay(cellDate, today);
          const events = getDayEvents(cellDate, customEvents);

          return (
            <button
              key={day}
              type="button"
              onClick={() => onSelectDate(cellDate)}
              className={`relative flex h-9 items-center justify-center rounded-xl text-xs font-bold transition-colors ${
                active
                  ? 'bg-(--color-ink) text-white'
                  : currentDay
                    ? 'bg-white text-gray-950 shadow-sm'
                    : 'text-gray-500 hover:bg-white'
              }`}
            >
              {day}
              {events.length > 0 && (
                <span className={`absolute bottom-1 h-1 w-1 rounded-full ${active ? 'bg-white/70' : EVENT_TYPE_CONFIG[events[0].type].dotClass}`} />
              )}
            </button>
          );
        })}

        {Array.from({ length: (7 - ((startDayOfMonth + daysInMonth) % 7)) % 7 }).map((_, index) => (
          <span key={`mini-empty-end-${index}`} className="h-9" />
        ))}
      </div>
    </div>
  );
}
