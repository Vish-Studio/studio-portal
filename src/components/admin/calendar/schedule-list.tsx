import { CalendarDays } from 'lucide-react';
import MaterialIcon from '../../common/material-icon/material-icon';
import { EVENT_TYPE_CONFIG } from '../schedule/event-types';
import type { ScheduleEvent } from '../schedule/event-types';

interface ScheduleListProps {
  date: Date;
  events: ScheduleEvent[];
}

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

export default function ScheduleList({ date, events }: ScheduleListProps) {
  return (
    <section className="h-full rounded-[18px] bg-(--color-surface-alt) p-4 md:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <CalendarDays size={16} />
            <span>Schedule</span>
          </div>
          <h2 className="mt-3 text-[28px] font-bold leading-none text-(--color-ink)">
            {date.toLocaleDateString('en-GB', { weekday: 'long' })}
          </h2>
          <p className="mt-2 text-sm font-medium text-gray-500">{formatDate(date)}</p>
        </div>
        <span className="rounded-md bg-white px-2.5 py-1 text-xs font-bold text-gray-600">
          {events.length} item{events.length === 1 ? '' : 's'}
        </span>
      </div>

      {events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white/60 px-4 py-8 text-center">
          <MaterialIcon name="event_available" size={26} className="mx-auto text-gray-300" />
          <p className="mt-2 text-sm font-bold text-gray-600">No items planned</p>
          <p className="mt-1 text-xs font-medium text-gray-400">Plans for the selected date will appear here.</p>
        </div>
      ) : (
        <div className="max-h-72 overflow-y-auto rounded-2xl bg-white">
          {events.map(event => {
            const config = EVENT_TYPE_CONFIG[event.type];

            return (
              <div key={event.id} className="flex items-start gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0">
                <span className={`mt-1 h-9 w-1 shrink-0 rounded-full ${config.dotClass}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-bold text-(--color-ink)">{event.title}</p>
                    <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${config.bgClass} ${config.textClass}`}>
                      {config.shortLabel}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-gray-400">{event.time}</p>
                  {event.description && (
                    <p className="mt-1 line-clamp-2 text-xs font-medium text-gray-500">{event.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
