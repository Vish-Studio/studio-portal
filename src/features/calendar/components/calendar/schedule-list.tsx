import { useMemo, useState } from 'react';
import { CalendarDays, Plus } from '@/src/shared/components/material-icon/material-lucide-icons';
import { useCalendarStore } from '../../stores/calendarStore';
import Button from '@/src/shared/components/button/button';
import { MaterialIcon } from '@/src/shared/components';
import ScheduleSidebarForm from '../schedule/schedule-sidebar-form';
import EventDetailsModal from '../schedule/event-details-modal';
import { EVENT_TYPE_CONFIG } from '../schedule/event-types';
import type { ScheduleEvent } from '../schedule/event-types';

interface ScheduleListProps {
  date: Date;
}

const dateKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

const sortEvents = (events: ScheduleEvent[]) =>
  [...events].sort((a, b) => {
    if (a.time === 'All Day') return -1;
    if (b.time === 'All Day') return 1;
    return a.time.localeCompare(b.time);
  });

export default function ScheduleList({ date }: ScheduleListProps) {
  const customEvents = useCalendarStore((state) => state.customEvents);
  const addEvent = useCalendarStore((state) => state.addEvent);
  const editEvent = useCalendarStore((state) => state.editEvent);
  const removeEvent = useCalendarStore((state) => state.removeEvent);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [viewingEvent, setViewingEvent] = useState<ScheduleEvent | null>(null);

  const events = useMemo(
    () => sortEvents(customEvents[dateKey(date)] ?? []),
    [customEvents, date],
  );

  const openAddForm = () => {
    setEditingEvent(null);
    setShowEventForm(true);
  };

  const closeForm = () => {
    setShowEventForm(false);
    setEditingEvent(null);
  };

  const handleSaveEvent = (event: ScheduleEvent, eventDate: Date) => {
    if (editingEvent) {
      editEvent(event, eventDate);
    } else {
      addEvent(event, eventDate);
    }
    closeForm();
  };

  const handleEditEvent = (event: ScheduleEvent) => {
    setViewingEvent(null);
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleDeleteEvent = (event: ScheduleEvent) => {
    removeEvent(event.id);
    setViewingEvent(null);
    if (editingEvent?.id === event.id) {
      closeForm();
    }
  };

  return (
    <>
      <section className="schedule-list h-full rounded-[18px] bg-(--color-surface-alt) p-4 md:p-6">
        <div className="schedule-list-header mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <CalendarDays size={16} />
              {/* <span>Schedule</span> */}
              <p className="text-sm font-medium text-gray-500">{formatDate(date)}</p>
            </div>
            {/* <h2 className="mt-3 text-[24px] font-bold leading-none text-(--color-ink) md:text-[28px]">
              {date.toLocaleDateString('en-GB', { weekday: 'long' })}
            </h2>
            <p className="mt-2 text-sm font-medium text-gray-500">{formatDate(date)}</p> */}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="schedule-list-count rounded-md bg-white px-2.5 py-1 text-xs font-bold text-gray-600">
              {events.length} item{events.length === 1 ? '' : 's'}
            </span>
            <Button
              size="sm"
              onClick={openAddForm}
              iconLeft={<Plus size={14} />}
            >
              Add
            </Button>
          </div>
        </div>

        {events.length === 0 ? (
          <button
            type="button"
            onClick={openAddForm}
            className="schedule-list-empty w-full rounded-2xl border border-dashed border-gray-200 bg-white/60 px-4 py-8 text-center transition-colors hover:border-gray-300 hover:bg-white"
          >
            <MaterialIcon name="event_available" size={26} className="mx-auto text-gray-300" />
            <p className="mt-2 text-sm font-bold text-gray-600">No items planned</p>
            <p className="mt-1 text-xs font-medium text-gray-400">
              Add a team meeting, client call, project phase, or admin focus block.
            </p>
          </button>
        ) : (
          <div className="schedule-list-items max-h-80 overflow-y-auto rounded-2xl bg-white">
            {events.map(event => {
              const config = EVENT_TYPE_CONFIG[event.type];

              return (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => setViewingEvent(event)}
                  className="schedule-list-item flex w-full items-start gap-3 border-b border-gray-100 px-4 py-3 text-left transition-colors hover:bg-gray-50 last:border-b-0"
                >
                  <span className={`schedule-list-marker mt-1 h-9 w-1 shrink-0 rounded-full ${config.dotClass}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-bold text-(--color-ink)">{event.title}</p>
                      <span className={`schedule-list-type rounded-md px-1.5 py-0.5 text-[10px] font-bold ${config.bgClass} ${config.textClass}`}>
                        {config.shortLabel}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <p className="text-xs font-semibold text-gray-400">{event.time}</p>
                      {event.callLink && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400">
                          <MaterialIcon name="videocam" size={13} />
                          Call link
                        </span>
                      )}
                      {!!event.memberIds?.length && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400">
                          <MaterialIcon name="group" size={13} />
                          {event.memberIds.length} team
                        </span>
                      )}
                    </div>
                    {event.description && (
                      <p className="mt-1 line-clamp-2 text-xs font-medium text-gray-500">{event.description}</p>
                    )}
                  </div>
                  <MaterialIcon name="chevron_right" size={18} className="mt-2 shrink-0 text-gray-300" />
                </button>
              );
            })}
          </div>
        )}
      </section>

      {showEventForm && (
        <ScheduleSidebarForm
          date={date}
          initialEvent={editingEvent ?? undefined}
          onAdd={handleSaveEvent}
          onClose={closeForm}
        />
      )}

      {viewingEvent && (
        <EventDetailsModal
          event={viewingEvent}
          onClose={() => setViewingEvent(null)}
          onEdit={() => handleEditEvent(viewingEvent)}
          onDelete={() => handleDeleteEvent(viewingEvent)}
        />
      )}
    </>
  );
}
