import { Edit2, MoreHorizontal, Trash2 } from 'lucide-react';
import MaterialIcon from '../../common/material-icon/material-icon';
import { EVENT_TYPE_CONFIG } from '../schedule/event-types';
import type { ScheduleEvent } from '../schedule/event-types';

interface AgendaItemProps {
  event: ScheduleEvent;
  compact?: boolean;
  onView: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  menuOpen?: boolean;
  onToggleMenu?: () => void;
}

export default function AgendaItem({
  event,
  compact = false,
  onView,
  onEdit,
  onDelete,
  menuOpen,
  onToggleMenu,
}: AgendaItemProps) {
  const config = EVENT_TYPE_CONFIG[event.type];

  return (
    <div className="relative rounded-2xl border border-gray-100 bg-white p-3 shadow-[0_1px_0_rgba(17,24,39,0.02)] transition-colors hover:border-gray-200">
      <div className="flex items-start gap-3">
        <div className={`flex ${compact ? 'h-9 w-9' : 'h-10 w-10'} shrink-0 items-center justify-center rounded-xl ${config.iconBgClass} ${config.textClass}`}>
          <MaterialIcon name={config.icon} size={compact ? 15 : 17} fill />
        </div>

        <button type="button" onClick={onView} className="min-w-0 flex-1 text-left">
          <p className="truncate text-sm font-bold text-gray-900">{event.title}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-400">{event.time}</span>
            {!compact && (
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${config.bgClass} ${config.textClass}`}>
                {config.shortLabel}
              </span>
            )}
          </div>
        </button>

        {onEdit && onDelete && onToggleMenu && (
          <div className="relative">
            <button
              type="button"
              onClick={onToggleMenu}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-300 hover:bg-gray-50 hover:text-gray-700"
              aria-label={`${event.title} options`}
            >
              <MoreHorizontal size={16} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-9 z-20 w-32 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
                <button
                  type="button"
                  onClick={onEdit}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  <Edit2 size={12} /> Edit
                </button>
                <button
                  type="button"
                  onClick={onDelete}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
