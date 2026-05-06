import { DAY_NAMES_SHORT } from '@/src/data/calendar';
import { EVENT_TYPE_CONFIG } from '../schedule/event-types';
import { getDayEvents, isSameDay } from './calendar-utils';
import type { CalendarEventMap } from './calendar-utils';

interface MonthGridProps {
  year: number;
  month: number;
  selectedDate: Date;
  today: Date;
  customEvents: CalendarEventMap;
  onSelectDate: (date: Date) => void;
}

export default function MonthGrid({
  year,
  month,
  selectedDate,
  today,
  customEvents,
  onSelectDate,
}: MonthGridProps) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = new Date(year, month, 1).getDay();

  return (
    <>
      <div className="mb-2 grid grid-cols-7 gap-1.5 md:gap-2">
        {DAY_NAMES_SHORT.map(day => (
          <div key={day} className="text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5 md:gap-2">
        {Array.from({ length: startDayOfMonth }).map((_, index) => (
          <div key={`empty-start-${index}`} className="min-h-[72px] sm:min-h-[88px] md:min-h-28" />
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
              className={`flex min-h-[72px] min-w-0 flex-col rounded-2xl border p-2 text-left transition-colors sm:min-h-[88px] md:min-h-28 ${
                active
                  ? 'border-(--color-ink) bg-(--color-ink) text-white shadow-md'
                  : currentDay
                    ? 'border-gray-200 bg-white'
                    : 'border-transparent bg-(--color-surface-alt) hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className={`text-sm font-bold ${active ? 'text-white' : currentDay ? 'text-gray-950' : 'text-gray-600'}`}>
                  {day}
                </span>
                {events.length > 0 && (
                  <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${active ? 'bg-white/15 text-white/70' : 'bg-white text-gray-400'}`}>
                    {events.length}
                  </span>
                )}
              </div>

              <div className="mt-2 hidden min-w-0 flex-1 flex-col gap-1 sm:flex">
                {events.slice(0, 2).map(event => (
                  <span
                    key={event.id}
                    className={`min-w-0 truncate rounded-md px-1.5 py-1 text-[10px] font-bold ${
                      active ? 'bg-white/10 text-white/80' : `${EVENT_TYPE_CONFIG[event.type].bgClass} ${EVENT_TYPE_CONFIG[event.type].textClass}`
                    }`}
                  >
                    {event.time !== 'All Day' ? `${event.time} · ` : ''}{event.title}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex flex-wrap items-center gap-1">
                {events.slice(0, 3).map(event => (
                  <span key={event.id} className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-white/70' : EVENT_TYPE_CONFIG[event.type].dotClass}`} />
                ))}
                {events.length > 3 && (
                  <span className={`text-[9px] font-bold ${active ? 'text-white/45' : 'text-gray-400'}`}>
                    +{events.length - 3}
                  </span>
                )}
              </div>
            </button>
          );
        })}

        {Array.from({ length: (7 - ((startDayOfMonth + daysInMonth) % 7)) % 7 }).map((_, index) => (
          <div key={`empty-end-${index}`} className="min-h-[72px] sm:min-h-[88px] md:min-h-28" />
        ))}
      </div>
    </>
  );
}
