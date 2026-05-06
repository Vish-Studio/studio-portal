import { FunctionComponent, useMemo, useState } from 'react';
import AddEventModal from '../schedule/add-event-modal';
import EventDetailsModal from '../schedule/event-details-modal';
import type { ScheduleEvent } from '../schedule/event-types';
import { useCalendarStore } from '@/src/store/calendar';
import DashboardPlanner from './dashboard-planner';
import MonthPlanner from './month-planner';
import { getDayEvents, getMonthEventCount } from './calendar-utils';

type CalendarVariant = 'dashboard' | 'full';

interface CalendarProps {
  variant?: CalendarVariant;
}

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
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const selectedEvents = useMemo(() => getDayEvents(selectedDate, customEvents), [selectedDate, customEvents]);
  const monthEventsCount = useMemo(
    () => getMonthEventCount(year, month, daysInMonth, customEvents),
    [customEvents, daysInMonth, month, year],
  );

  const handleCurrentDateChange = (date: Date) => {
    setCurrentDate(date);
    const nextYear = date.getFullYear();
    const nextMonth = date.getMonth();
    const nextDaysInMonth = new Date(nextYear, nextMonth + 1, 0).getDate();
    setSelectedDate(new Date(nextYear, nextMonth, Math.min(selectedDate.getDate(), nextDaysInMonth)));
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

  const toggleMenu = (eventId: string) => {
    setOpenMenuId(openMenuId === eventId ? null : eventId);
  };

  return (
    <>
      {variant === 'dashboard' ? (
        <DashboardPlanner
          today={today}
          currentDate={currentDate}
          selectedDate={selectedDate}
          customEvents={customEvents}
          events={selectedEvents}
          monthEventsCount={monthEventsCount}
          onAdd={openAdd}
          onView={openView}
          onSelectDate={handleSelectDate}
        />
      ) : (
        <MonthPlanner
          currentDate={currentDate}
          selectedDate={selectedDate}
          today={today}
          customEvents={customEvents}
          selectedEvents={selectedEvents}
          monthEventsCount={monthEventsCount}
          openMenuId={openMenuId}
          onCurrentDateChange={handleCurrentDateChange}
          onSelectDate={handleSelectDate}
          onAdd={openAdd}
          onView={openView}
          onEdit={openEdit}
          onDelete={handleDeleteEvent}
          onToggleMenu={toggleMenu}
        />
      )}

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
