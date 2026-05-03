import { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import MaterialIcon from '../../common/material-icon/material-icon';
import Tooltip from '../../common/tooltip/tooltip';
import EventBadge from '../schedule/event-badge';
import AddEventModal from '../schedule/add-event-modal';
import EventDetailsModal from '../schedule/event-details-modal';
import { EVENT_TYPE_CONFIG } from '../schedule/event-types';
import type { ScheduleEvent } from '../schedule/event-types';
import ContentCard from '../../common/card-content/card-content';
import ButtonIcon from '../../common/button-icon/button-icon';

export type { ScheduleEvent };

const parseTimeToMinutes = (timeStr: string): number => {
  if (timeStr === 'All Day') return -1; // All day events come first

  // Extract the first time from strings like "10:00 AM - 11:00 AM"
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return 1440; // Invalid time goes to end

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3].toUpperCase();

  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

const sortEventsByTime = (events: ScheduleEvent[]): ScheduleEvent[] => {
  return [...events].sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));
};

interface DailyScheduleProps {
  date: Date;
  events: ScheduleEvent[];
  onAddEvent?: (event: ScheduleEvent, date: Date) => void;
  onEditEvent?: (event: ScheduleEvent, date: Date) => void;
  onRemoveEvent?: (eventId: string) => void;
}

export default function DailySchedule({ date, events, onAddEvent, onEditEvent, onRemoveEvent }: DailyScheduleProps) {
  const [showModal, setShowModal] = useState(false);
  const [viewingEvent, setViewingEvent] = useState<ScheduleEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const sortedEvents = sortEventsByTime(events);

  const handleEditEvent = (event: ScheduleEvent) => {
    setEditingEvent(event);
    setShowModal(true);
    setOpenMenuId(null);
  };

  const handleViewEvent = (event: ScheduleEvent) => {
    setViewingEvent(event);
  };

  const handleEditFromView = () => {
    if (viewingEvent) {
      handleEditEvent(viewingEvent);
      setViewingEvent(null);
    }
  };

  const handleCloseViewModal = () => {
    setViewingEvent(null);
  };

  const handleSaveEvent = (event: ScheduleEvent, eventDate: Date) => {
    if (editingEvent) {
      onEditEvent?.(event, eventDate);
    } else {
      onAddEvent?.(event, eventDate);
    }
    setShowModal(false);
    setEditingEvent(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEvent(null);
  };

  return (
    <>
      <ContentCard
        title="Daily Schedule"
        iconName="schedule"
        className="h-full"
        bodyClassName="flex flex-col gap-4 overflow-y-auto flex-1 min-h-0 px-4 md:px-6 py-4"
        action={
          onAddEvent ? (
            // <button
            //   onClick={() => setShowModal(true)}
            //   className="w-9 h-9 flex items-center justify-center rounded-full bg-(--color-ink) text-white hover:bg-gray-700 transition-colors"
            //   aria-label="Add event"
            // >
            //   <MaterialIcon name="add" size={18} />
            // </button>
            <ButtonIcon
              iconName='add'
              clickHandler={() => setShowModal(true)} />
          ) : undefined
        }
      >
        {sortedEvents.length > 0 ? (
          sortedEvents.map(event => (
            <div key={event.id} className="flex gap-3 items-start group relative">
              <Tooltip content={EVENT_TYPE_CONFIG[event.type].label} side="right">
                <EventBadge type={event.type} variant="icon" />
              </Tooltip>
              <button
                onClick={() => handleViewEvent(event)}
                className="flex flex-col gap-0.5 min-w-0 flex-1 pt-0.5 text-left hover:opacity-80 transition-opacity"
              >
                <h4 className="text-gray-900 font-bold text-sm tracking-tight truncate leading-tight">
                  {event.title}
                </h4>
                <span className="text-gray-400 text-xs font-semibold">{event.time}</span>
              </button>
              {(onEditEvent || onRemoveEvent) && (
                <div className="relative shrink-0">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === event.id ? null : event.id)}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Event options"
                  >
                    <MaterialIcon name="more_vert" size={16} />
                  </button>
                  {openMenuId === event.id && (
                    <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-red z-50 min-w-[140px]">
                      {onEditEvent && (
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-t-lg transition-colors"
                        >
                          <MaterialIcon name="edit" size={14} />
                          Edit
                        </button>
                      )}
                      {onRemoveEvent && (
                        <button
                          onClick={() => { onRemoveEvent(event.id); setOpenMenuId(null); }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-b-lg transition-colors"
                        >
                          <MaterialIcon name="delete" size={14} />
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-center py-10 opacity-50">
            <CalendarIcon size={28} className="text-gray-300 mb-2" />
            <p className="text-sm font-medium text-gray-500">No events scheduled.</p>
            <p className="text-xs text-gray-400 mt-1">Enjoy your free day!</p>
          </div>
        )}
      </ContentCard>

      {/* Modals — fixed-position, unaffected by parent overflow */}
      {showModal && (onAddEvent || onEditEvent) && (
        <AddEventModal
          date={date}
          onAdd={handleSaveEvent}
          onClose={handleCloseModal}
          initialEvent={editingEvent || undefined}
        />
      )}
      {viewingEvent && (
        <EventDetailsModal
          event={viewingEvent}
          onClose={handleCloseViewModal}
          onEdit={handleEditFromView}
        />
      )}
    </>
  );
}
