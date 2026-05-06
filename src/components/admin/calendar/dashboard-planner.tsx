import { CalendarCheck, Plus } from 'lucide-react';
import Button from '../../common/button/button';
import AgendaList from './agenda-list';
import MiniMonthCalendar from './mini-month-calendar';
import { formatPlannerDate } from './calendar-utils';
import type { CalendarEventMap } from './calendar-utils';
import type { ScheduleEvent } from '../schedule/event-types';

interface DashboardPlannerProps {
  today: Date;
  currentDate: Date;
  selectedDate: Date;
  customEvents: CalendarEventMap;
  events: ScheduleEvent[];
  monthEventsCount: number;
  onAdd: (date: Date) => void;
  onView: (event: ScheduleEvent, date: Date) => void;
  onSelectDate: (date: Date) => void;
}

export default function DashboardPlanner({
  today,
  currentDate,
  selectedDate,
  customEvents,
  events,
  monthEventsCount,
  onAdd,
  onView,
  onSelectDate,
}: DashboardPlannerProps) {
  const visibleEvents = events.slice(0, 4);
  const hiddenCount = Math.max(events.length - visibleEvents.length, 0);

  return (
    <section className="grid items-stretch gap-4 lg:grid-cols-[minmax(300px,0.9fr)_minmax(0,2.1fr)]">
      <MiniMonthCalendar
        currentDate={currentDate}
        selectedDate={selectedDate}
        today={today}
        customEvents={customEvents}
        monthEventsCount={monthEventsCount}
        onSelectDate={onSelectDate}
      />

      <div className="flex h-full min-w-0 flex-col rounded-[18px] bg-(--color-surface-alt) p-4 md:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <CalendarCheck size={16} />
              <span>Selected plan</span>
            </div>
            <h3 className="mt-4 text-[24px] font-bold leading-none text-(--color-ink) md:text-[30px]">
              {selectedDate.toLocaleDateString('en-GB', { weekday: 'long' })}
            </h3>
            <p className="mt-2 text-sm font-medium text-gray-500">{formatPlannerDate(selectedDate)}</p>
          </div>
          <span className="rounded-md bg-white px-2 py-1 text-[12px] font-bold text-gray-700">
            {events.length} item{events.length === 1 ? '' : 's'}
          </span>
        </div>

        <AgendaList
          events={visibleEvents}
          eventDate={selectedDate}
          compact
          emptyClassName="md:col-span-2 xl:col-span-3"
          onAdd={onAdd}
          onView={onView}
        />

        {hiddenCount > 0 && (
          <p className="mt-2 text-xs font-semibold text-gray-400">
            +{hiddenCount} more item{hiddenCount === 1 ? '' : 's'} on this day
          </p>
        )}
      </div>
    </section>
  );
}
