import { CalendarDays } from 'lucide-react';
import AgendaItem from './agenda-item';
import type { ScheduleEvent } from '../schedule/event-types';

interface AgendaListProps {
  events: ScheduleEvent[];
  eventDate: Date;
  compact?: boolean;
  emptyClassName?: string;
  openMenuId?: string | null;
  onAdd: (date: Date) => void;
  onView: (event: ScheduleEvent, date: Date) => void;
  onEdit?: (event: ScheduleEvent) => void;
  onDelete?: (event: ScheduleEvent) => void;
  onToggleMenu?: (eventId: string) => void;
}

export default function AgendaList({
  events,
  eventDate,
  compact = false,
  emptyClassName = '',
  openMenuId,
  onAdd,
  onView,
  onEdit,
  onDelete,
  onToggleMenu,
}: AgendaListProps) {
  return (
    <div className={`grid gap-2 overflow-y-auto pr-1 ${compact ? 'max-h-80 md:grid-cols-2 xl:grid-cols-3' : 'max-h-[620px]'}`}>
      {events.length === 0 ? (
        <button
          type="button"
          onClick={() => onAdd(eventDate)}
          className={`rounded-2xl border border-dashed border-gray-200 bg-white px-4 py-8 text-center transition-colors hover:bg-gray-50 ${emptyClassName}`}
        >
          <CalendarDays size={26} className="mx-auto text-gray-300" />
          <p className="mt-2 text-sm font-semibold text-gray-500">No items planned.</p>
          <p className="mt-1 text-xs text-gray-400">Add a meeting, brief, phase call, or focus block.</p>
        </button>
      ) : (
        events.map(event => (
          <AgendaItem
            key={event.id}
            event={event}
            compact={compact}
            onView={() => onView(event, eventDate)}
            onEdit={onEdit ? () => onEdit(event) : undefined}
            onDelete={onDelete ? () => onDelete(event) : undefined}
            menuOpen={openMenuId === event.id}
            onToggleMenu={onToggleMenu ? () => onToggleMenu(event.id) : undefined}
          />
        ))
      )}
    </div>
  );
}
