import { X, Link as LinkIcon, Phone } from 'lucide-react';
import { type ScheduleEvent, EVENT_TYPE_CONFIG } from './event-types';
import MaterialIcon from '../ui/material-icon';

interface EventDetailsModalProps {
  event: ScheduleEvent;
  onClose: () => void;
  onEdit: () => void;
}

export default function EventDetailsModal({ event, onClose, onEdit }: EventDetailsModalProps) {
  const config = EVENT_TYPE_CONFIG[event.type];

  const openCallLink = () => {
    if (event.callLink && (event.callLink.startsWith('http://') || event.callLink.startsWith('https://'))) {
      window.open(event.callLink, '_blank');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Sheet */}
      <div
        className="relative w-full sm:max-w-[440px] bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`${config.iconBgClass} px-6 pt-6 pb-5 transition-colors duration-200`}>
          <div className="flex items-start justify-between mb-5">
            {/* Type icon badge */}
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${config.textClass} bg-white/60`}>
              <MaterialIcon name={config.icon} size={22} fill />
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/50 hover:bg-white/80 text-gray-600 transition-colors"
            >
              <X size={15} strokeWidth={2.5} />
            </button>
          </div>
          <h2 className={`text-xl font-bold ${config.textClass}`}>{event.title}</h2>
          <p className={`text-sm font-medium ${config.textClass} opacity-60 mt-0.5`}>{config.label}</p>
        </div>

        {/* Content */}
        <div className="px-6 py-5 flex flex-col gap-5 flex-1 overflow-y-auto">
          {/* Time */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Time</p>
            <div className="flex items-center gap-2">
              <MaterialIcon name="schedule" size={16} className="text-gray-500" />
              <p className="text-sm font-medium text-gray-700">{event.time}</p>
            </div>
          </div>

          {/* Call Link */}
          {event.callLink && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Call Link</p>
              <button
                onClick={openCallLink}
                className="w-full flex items-center gap-3 p-3 bg-(--color-surface) border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors">
                  <Phone size={16} />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-xs font-semibold text-gray-400 mb-0.5">Join Meeting</p>
                  <p className="text-sm font-medium text-blue-600 truncate">{event.callLink}</p>
                </div>
                <MaterialIcon name="open_in_new" size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors shrink-0" />
              </button>
            </div>
          )}

          {/* Event Details Summary */}
          <div className="bg-(--color-surface) rounded-2xl p-4 border border-gray-100">
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full ${config.dotClass} mt-2 shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Event Details</p>
                <p className="text-sm font-medium text-gray-700">{event.type === 'design-review' ? 'Design Review Session' : `${config.label} Event`}</p>
                <p className="text-xs text-gray-500 mt-1">Event ID: {event.id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-100 px-6 py-4 flex gap-3 bg-white">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-(--color-surface) rounded-2xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="flex-1 px-4 py-3 bg-(--color-ink) rounded-2xl text-sm font-bold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <MaterialIcon name="edit" size={16} className="text-white" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
