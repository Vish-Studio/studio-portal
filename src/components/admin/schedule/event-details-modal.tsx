import { Phone } from 'lucide-react';
import { type ScheduleEvent, EVENT_TYPE_CONFIG } from './event-types';
import MaterialIcon from '../../common/material-icon/material-icon';
import FormSidebar, { FormSidebarFooter } from '../../common/form-sidebar/form-sidebar';

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
    <FormSidebar
      isOpen
      onClose={onClose}
      title={event.title}
      description={config.label}
      width="md"
    >
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          <div className={`flex items-center gap-3 rounded-2xl ${config.iconBgClass} px-4 py-3`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.textClass} bg-white/60`}>
              <MaterialIcon name={config.icon} size={20} fill />
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-bold ${config.textClass}`}>{config.label}</p>
              <p className={`text-xs font-semibold ${config.textClass} opacity-60`}>Schedule event</p>
            </div>
          </div>

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

          {event.description && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Notes</p>
              <p className="text-sm font-medium text-gray-700 rounded-2xl bg-(--color-surface) border border-gray-100 p-4">{event.description}</p>
            </div>
          )}

          {/* Event Details */}
          <div className="bg-(--color-surface) rounded-2xl p-4 border border-gray-100">
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full ${config.dotClass} mt-2 shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Event Details</p>
                <p className="text-sm font-medium text-gray-700">
                  {event.type === 'design-review' ? 'Design Review Session' : `${config.label} Event`}
                </p>
                <p className="text-xs text-gray-500 mt-1">Event ID: {event.id}</p>
              </div>
            </div>
          </div>
        </div>

        <FormSidebarFooter>
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
        </FormSidebarFooter>
      </div>
    </FormSidebar>
  );
}
