import { EVENT_TYPE_CONFIG } from '../schedule/event-types';
import { getDateEvents, getMonthDays, isSameDate, weekDays } from './planner-utils';
import type { PlannerEventMap } from './planner-utils';

interface PlannerMonthGridProps {
  currentDate: Date;
  selectedDate: Date;
  today: Date;
  events: PlannerEventMap;
  compact?: boolean;
  onSelectDate: (date: Date) => void;
}

export default function PlannerMonthGrid({
  currentDate,
  selectedDate,
  today,
  events,
  compact = false,
  onSelectDate,
}: PlannerMonthGridProps) {
  const days = getMonthDays(currentDate);

  return (
    <div className={`grid grid-cols-7 ${compact ? 'gap-1.5' : 'gap-2'}`}>
      {weekDays.map(day => (
        <div
          key={day}
          className={`text-center font-bold uppercase text-gray-300 ${compact ? 'text-[9px]' : 'text-[10px] tracking-widest'}`}
        >
          {compact ? day.slice(0, 1) : day}
        </div>
      ))}

      {days.map((date, index) => {
        if (!date) {
          return <div key={`empty-${index}`} className={compact ? 'h-9' : 'min-h-24'} />;
        }

        const dayEvents = getDateEvents(date, events);
        const selected = isSameDate(date, selectedDate);
        const currentDay = isSameDate(date, today);

        return (
          <button
            key={date.toISOString()}
            type="button"
            onClick={() => onSelectDate(date)}
            className={
              compact
                ? `relative flex h-9 items-center justify-center rounded-xl text-xs font-bold transition-colors ${
                    selected
                      ? 'bg-(--color-ink) text-white'
                      : currentDay
                        ? 'bg-gray-100 text-gray-950'
                        : 'text-gray-500 hover:bg-gray-100'
                  }`
                : `group flex min-h-24 flex-col rounded-2xl border p-3 text-left transition-all ${
                    selected
                      ? 'border-(--color-ink) bg-(--color-ink) text-white shadow-sm'
                      : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
                  }`
            }
          >
            {compact ? (
              <>
                <span>{date.getDate()}</span>
                {dayEvents.length > 0 && (
                  <span
                    className={`absolute bottom-1 h-1 w-1 rounded-full ${
                      selected ? 'bg-white/70' : EVENT_TYPE_CONFIG[dayEvents[0].type].dotClass
                    }`}
                  />
                )}
              </>
            ) : (
              <>
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-sm font-bold ${selected ? 'text-white' : 'text-gray-700'}`}>
                    {date.getDate()}
                  </span>
                  {dayEvents.length > 0 && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        selected ? 'bg-white/15 text-white' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {dayEvents.length}
                    </span>
                  )}
                </div>
                <div className="mt-3 flex flex-col gap-1 overflow-hidden">
                  {dayEvents.slice(0, 3).map(event => (
                    <span
                      key={event.id}
                      className={`truncate rounded-md px-2 py-1 text-[11px] font-bold ${
                        selected ? 'bg-white/10 text-white' : `${EVENT_TYPE_CONFIG[event.type].bgClass} ${EVENT_TYPE_CONFIG[event.type].textClass}`
                      }`}
                    >
                      {event.time !== 'All Day' ? `${event.time.split(' ')[0]} ` : ''}
                      {event.title}
                    </span>
                  ))}
                  {dayEvents.length > 3 && (
                    <span className={`text-[11px] font-bold ${selected ? 'text-white/60' : 'text-gray-400'}`}>
                      +{dayEvents.length - 3} more
                    </span>
                  )}
                </div>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}
