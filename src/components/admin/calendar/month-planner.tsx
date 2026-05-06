import { Plus } from 'lucide-react';
import Button from '../../common/button/button';
import MaterialIcon from '../../common/material-icon/material-icon';
import MonthYearNav from '../month-year-nav/month-year-nav';
import AgendaList from './agenda-list';
import MonthGrid from './month-grid';
import { formatPlannerDate } from './calendar-utils';
import type { CalendarEventMap } from './calendar-utils';
import type { ScheduleEvent } from '../schedule/event-types';

interface MonthPlannerProps {
  currentDate: Date;
  selectedDate: Date;
  today: Date;
  customEvents: CalendarEventMap;
  selectedEvents: ScheduleEvent[];
  monthEventsCount: number;
  openMenuId: string | null;
  onCurrentDateChange: (date: Date) => void;
  onSelectDate: (date: Date) => void;
  onAdd: (date?: Date) => void;
  onView: (event: ScheduleEvent, date: Date) => void;
  onEdit: (event: ScheduleEvent) => void;
  onDelete: (event: ScheduleEvent) => void;
  onToggleMenu: (eventId: string) => void;
}

export default function MonthPlanner({
  currentDate,
  selectedDate,
  today,
  customEvents,
  selectedEvents,
  monthEventsCount,
  openMenuId,
  onCurrentDateChange,
  onSelectDate,
  onAdd,
  onView,
  onEdit,
  onDelete,
  onToggleMenu,
}: MonthPlannerProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="overflow-hidden rounded-[18px] border border-gray-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-100 px-4 py-4 md:px-6 md:py-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-(--color-ink)">
            <MaterialIcon name="calendar_today" size={16} />
            <span>Month planner</span>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <MonthYearNav value={currentDate} onChange={onCurrentDateChange} />
            <Button type="button" size="sm" iconLeft={<Plus size={14} />} onClick={() => onAdd()}>
              Add item
            </Button>
          </div>
        </div>

        <div className="p-3 md:p-5">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3 px-1">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full month plan</p>
              <h3 className="text-xl font-bold text-gray-900">
                {currentDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
              </h3>
            </div>
            <p className="rounded-full bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-400">
              {monthEventsCount} planned
            </p>
          </div>

          <MonthGrid
            year={year}
            month={month}
            selectedDate={selectedDate}
            today={today}
            customEvents={customEvents}
            onSelectDate={onSelectDate}
          />
        </div>
      </div>

      <aside className="overflow-hidden rounded-[18px] border border-gray-200 bg-white xl:sticky xl:top-4 xl:self-start">
        <div className="flex items-center justify-between gap-4 bg-gray-100 px-4 py-4 md:px-5 md:py-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-(--color-ink)">
            <MaterialIcon name="event_note" size={16} />
            <span>Selected day</span>
          </div>
          <button
            type="button"
            onClick={() => onAdd(selectedDate)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--color-ink) text-white hover:bg-gray-800"
            aria-label="Add item to selected day"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="mx-4 border-b border-gray-100 md:mx-5" />

        <div className="p-4 md:p-5">
          <div className="mb-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Agenda</p>
            <h3 className="mt-1 text-xl font-bold text-gray-950">{formatPlannerDate(selectedDate)}</h3>
            <p className="mt-1 text-sm font-semibold text-gray-400">
              {selectedEvents.length} item{selectedEvents.length === 1 ? '' : 's'} planned
            </p>
          </div>

          <AgendaList
            events={selectedEvents}
            eventDate={selectedDate}
            emptyClassName="bg-gray-50"
            openMenuId={openMenuId}
            onAdd={onAdd}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleMenu={onToggleMenu}
          />
        </div>
      </aside>
    </section>
  );
}
