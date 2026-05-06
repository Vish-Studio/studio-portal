import { MoreHorizontal, Plus } from 'lucide-react';
import MaterialIcon from '../../common/material-icon/material-icon';
import { EVENT_TYPE_CONFIG } from '../schedule/event-types';
import { formatDateLine } from './planner-utils';
import type { ScheduleEvent } from '../schedule/event-types';

interface PlannerAgendaProps {
  date: Date;
  events: ScheduleEvent[];
  compact?: boolean;
  openMenuId?: string | null;
  onAdd: (date: Date) => void;
  onView: (event: ScheduleEvent, date: Date) => void;
  onEdit?: (event: ScheduleEvent) => void;
  onDelete?: (event: ScheduleEvent) => void;
  onToggleMenu?: (eventId: string) => void;
}

export default function PlannerAgenda({
  date,
  events,
  compact = false,
  openMenuId,
  onAdd,
  onView,
  onEdit,
  onDelete,
  onToggleMenu,
}: PlannerAgendaProps) {
  return (
    <div className={`flex min-w-0 flex-col ${compact ? 'h-full' : 'rounded-[18px] border border-gray-200 bg-white p-4 md:p-6'}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Selected plan</p>
          <h3 className={`${compact ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'} mt-1 font-bold leading-tight text-(--color-ink)`}>
            {date.toLocaleDateString('en-GB', { weekday: 'long' })}
          </h3>
          <p className="mt-1 text-sm font-medium text-gray-500">{formatDateLine(date)}</p>
        </div>
        <button
          type="button"
          onClick={() => onAdd(date)}
          className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-(--color-ink) px-3 text-sm font-bold text-white transition-colors hover:bg-gray-800"
        >
          <Plus size={16} />
          {!compact && <span>Add</span>}
        </button>
      </div>

      <div className={`grid gap-3 overflow-y-auto pr-1 ${compact ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'max-h-[620px]'}`}>
        {events.length === 0 ? (
          <button
            type="button"
            onClick={() => onAdd(date)}
            className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center transition-colors hover:bg-gray-100"
          >
            <MaterialIcon name="event_available" size={28} className="mx-auto text-gray-300" />
            <p className="mt-2 text-sm font-bold text-gray-600">No planning yet</p>
            <p className="mt-1 text-xs font-medium text-gray-400">Add a meeting, brief, phase call, or focus block.</p>
          </button>
        ) : (
          events.map(event => {
            const config = EVENT_TYPE_CONFIG[event.type];
            const menuOpen = openMenuId === event.id;

            return (
              <div
                key={event.id}
                className="group relative rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition-colors hover:border-gray-200"
              >
                <button
                  type="button"
                  onClick={() => onView(event, date)}
                  className="flex w-full min-w-0 items-start gap-3 text-left"
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.iconBgClass} ${config.textClass}`}>
                    <MaterialIcon name={config.icon} size={18} fill />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-(--color-ink)">{event.title}</span>
                    <span className="mt-1 block text-xs font-semibold text-gray-400">{event.time}</span>
                    {!compact && event.description && (
                      <span className="mt-2 line-clamp-2 block text-xs font-medium text-gray-500">{event.description}</span>
                    )}
                  </span>
                </button>

                {onToggleMenu && (
                  <button
                    type="button"
                    onClick={() => onToggleMenu(event.id)}
                    className="absolute right-3 top-3 rounded-lg p-1 text-gray-300 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    aria-label="Event actions"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                )}

                {!compact && (
                  <span className={`mt-3 inline-flex rounded-md px-2 py-1 text-[10px] font-bold ${config.bgClass} ${config.textClass}`}>
                    {config.label}
                  </span>
                )}

                {menuOpen && (
                  <div className="absolute right-3 top-9 z-10 w-32 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(event)}
                        className="block w-full px-3 py-2 text-left text-xs font-bold text-gray-600 hover:bg-gray-50"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(event)}
                        className="block w-full px-3 py-2 text-left text-xs font-bold text-red-500 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
