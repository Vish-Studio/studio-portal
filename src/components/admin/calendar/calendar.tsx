import { FunctionComponent, useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import Button from '../../common/button/button';
import AddEventModal from '../schedule/add-event-modal';
import EventDetailsModal from '../schedule/event-details-modal';
import PlannerAgenda from './planner-agenda';
import PlannerMonthGrid from './planner-month-grid';
import {
  formatDateLine,
  getDateEvents,
  getMonthEventCount,
  getVisibleWeek,
  getWeekEventCount,
  isSameDate,
  monthNames,
} from './planner-utils';
import { useCalendarStore } from '@/src/store/calendar';
import type { ScheduleEvent } from '../schedule/event-types';

type CalendarVariant = 'dashboard' | 'full';

interface CalendarProps {
  variant?: CalendarVariant;
}

const yearOptions = Array.from({ length: 9 }, (_, index) => new Date().getFullYear() - 4 + index);

const Calendar: FunctionComponent<CalendarProps> = ({ variant = 'full' }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [viewingEvent, setViewingEvent] = useState<ScheduleEvent | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const customEvents = useCalendarStore((state) => state.customEvents);
  const addEvent = useCalendarStore((state) => state.addEvent);
  const editEvent = useCalendarStore((state) => state.editEvent);
  const removeEvent = useCalendarStore((state) => state.removeEvent);

  const today = new Date();
  const selectedEvents = useMemo(() => getDateEvents(selectedDate, customEvents), [selectedDate, customEvents]);
  const monthEventsCount = useMemo(() => getMonthEventCount(currentDate, customEvents), [currentDate, customEvents]);
  const weekEventsCount = useMemo(() => getWeekEventCount(selectedDate, customEvents), [selectedDate, customEvents]);
  const visibleWeek = useMemo(() => getVisibleWeek(selectedDate), [selectedDate]);

  const setMonthDate = (year: number, month: number, preferredDay = selectedDate.getDate()) => {
    const lastDay = new Date(year, month + 1, 0).getDate();
    const nextDate = new Date(year, month, Math.min(preferredDay, lastDay));
    setCurrentDate(new Date(year, month, 1));
    setSelectedDate(nextDate);
    setOpenMenuId(null);
  };

  const moveMonth = (offset: number) => {
    const next = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setMonthDate(next.getFullYear(), next.getMonth());
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
    setOpenMenuId(null);
  };

  const openAdd = (date = selectedDate) => {
    setSelectedDate(date);
    setEditingEvent(null);
    setShowEventForm(true);
  };

  const openView = (event: ScheduleEvent, date: Date) => {
    setSelectedDate(date);
    setViewingEvent(event);
  };

  const openEdit = (event: ScheduleEvent) => {
    setEditingEvent(event);
    setViewingEvent(null);
    setOpenMenuId(null);
    setShowEventForm(true);
  };

  const handleSaveEvent = (event: ScheduleEvent, eventDate: Date) => {
    if (editingEvent) editEvent(event, eventDate);
    else addEvent(event, eventDate);
    setShowEventForm(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (event: ScheduleEvent) => {
    removeEvent(event.id);
    setOpenMenuId(null);
  };

  if (variant === 'dashboard') {
    return (
      <>
        <section className="grid gap-4 lg:grid-cols-[minmax(280px,0.85fr)_minmax(0,2.15fr)]">
          <div className="rounded-[18px] border border-gray-200 bg-white p-4 md:p-6">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Calendar</p>
                <h2 className="mt-1 text-xl font-bold leading-none text-(--color-ink)">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
              </div>
              <span className="rounded-md bg-gray-100 px-2 py-1 text-[12px] font-bold text-gray-700">
                {monthEventsCount}
              </span>
            </div>
            <PlannerMonthGrid
              currentDate={currentDate}
              selectedDate={selectedDate}
              today={today}
              events={customEvents}
              compact
              onSelectDate={handleSelectDate}
            />
          </div>

          <div className="rounded-[18px] bg-(--color-surface-alt) p-4 md:p-6">
            <PlannerAgenda
              date={selectedDate}
              events={selectedEvents.slice(0, 3)}
              compact
              onAdd={openAdd}
              onView={openView}
            />
          </div>
        </section>

        {showEventForm && (
          <AddEventModal
            date={selectedDate}
            onAdd={handleSaveEvent}
            onClose={() => { setShowEventForm(false); setEditingEvent(null); }}
            initialEvent={editingEvent || undefined}
          />
        )}

        {viewingEvent && (
          <EventDetailsModal
            event={viewingEvent}
            onClose={() => setViewingEvent(null)}
            onEdit={() => openEdit(viewingEvent)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <section className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-gray-500">
              <CalendarDays size={18} />
              <p className="text-sm font-bold">Planner</p>
            </div>
            <h2 className="mt-2 text-3xl font-bold leading-tight text-(--color-ink)">Agenda calendar</h2>
            <p className="mt-1 text-sm font-medium text-gray-500">
              Manage meetings, briefs, phase calls, focus blocks, and admin work.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => handleSelectDate(today)}>
              Today
            </Button>
            <button
              type="button"
              onClick={() => moveMonth(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
            <select
              value={currentDate.getMonth()}
              onChange={(event) => setMonthDate(currentDate.getFullYear(), Number(event.target.value))}
              className="h-10 rounded-xl border border-gray-100 bg-white px-3 text-sm font-bold text-gray-700 outline-none focus:border-gray-300"
            >
              {monthNames.map((month, index) => (
                <option key={month} value={index}>{month}</option>
              ))}
            </select>
            <select
              value={currentDate.getFullYear()}
              onChange={(event) => setMonthDate(Number(event.target.value), currentDate.getMonth())}
              className="h-10 rounded-xl border border-gray-100 bg-white px-3 text-sm font-bold text-gray-700 outline-none focus:border-gray-300"
            >
              {yearOptions.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => moveMonth(1)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
            <Button size="sm" iconLeft={<Plus size={16} />} onClick={() => openAdd()}>
              Add item
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-[18px] bg-(--color-accent-lime) p-4 md:p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-700">Today</p>
            <p className="mt-3 text-4xl font-bold leading-none text-(--color-ink)">
              {getDateEvents(today, customEvents).length}
            </p>
          </div>
          <div className="rounded-[18px] bg-(--color-surface-alt) p-4 md:p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">This week</p>
            <p className="mt-3 text-4xl font-bold leading-none text-(--color-ink)">{weekEventsCount}</p>
          </div>
          <div className="rounded-[18px] border border-gray-200 bg-white p-4 md:p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">This month</p>
            <p className="mt-3 text-4xl font-bold leading-none text-(--color-ink)">{monthEventsCount}</p>
          </div>
          <div className="rounded-[18px] bg-(--color-ink) p-4 md:p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Selected</p>
            <p className="mt-3 text-4xl font-bold leading-none text-white">{selectedEvents.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {visibleWeek.map(day => {
            const events = getDateEvents(day, customEvents);
            const active = isSameDate(day, selectedDate);
            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => handleSelectDate(day)}
                className={`rounded-2xl p-4 text-left transition-colors ${
                  active ? 'bg-(--color-ink) text-white' : 'bg-(--color-surface-alt) text-gray-700 hover:bg-gray-100'
                }`}
              >
                <p className={`text-[10px] font-bold uppercase tracking-widest ${active ? 'text-white/50' : 'text-gray-400'}`}>
                  {day.toLocaleDateString('en-GB', { weekday: 'short' })}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-2xl font-bold leading-none">{day.getDate()}</span>
                  <span className={`rounded-full px-2 py-1 text-[11px] font-bold ${active ? 'bg-white/15 text-white' : 'bg-white text-gray-500'}`}>
                    {events.length}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.75fr)_minmax(360px,0.75fr)]">
          <div className="rounded-[18px] bg-(--color-surface-alt) p-4 md:p-6">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Month planner</p>
                <h3 className="mt-1 text-2xl font-bold text-(--color-ink)">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
              </div>
              <p className="rounded-md bg-white px-3 py-1.5 text-xs font-bold text-gray-500">{formatDateLine(selectedDate)}</p>
            </div>
            <PlannerMonthGrid
              currentDate={currentDate}
              selectedDate={selectedDate}
              today={today}
              events={customEvents}
              onSelectDate={handleSelectDate}
            />
          </div>

          <PlannerAgenda
            date={selectedDate}
            events={selectedEvents}
            openMenuId={openMenuId}
            onAdd={openAdd}
            onView={openView}
            onEdit={openEdit}
            onDelete={handleDeleteEvent}
            onToggleMenu={(eventId) => setOpenMenuId(openMenuId === eventId ? null : eventId)}
          />
        </div>
      </section>

      {showEventForm && (
        <AddEventModal
          date={selectedDate}
          onAdd={handleSaveEvent}
          onClose={() => { setShowEventForm(false); setEditingEvent(null); }}
          initialEvent={editingEvent || undefined}
        />
      )}

      {viewingEvent && (
        <EventDetailsModal
          event={viewingEvent}
          onClose={() => setViewingEvent(null)}
          onEdit={() => openEdit(viewingEvent)}
        />
      )}
    </>
  );
};

export default Calendar;
