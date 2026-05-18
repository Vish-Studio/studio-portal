import { Phone } from 'lucide-react';
import { type ScheduleEvent, EVENT_TYPE_CONFIG } from './event-types';
import { MaterialIcon } from '@/src/shared/components';
import FormSidebar, { FormSidebarFooter } from '@/src/components/common/form-sidebar/form-sidebar';
import Button from '@/src/components/common/button/button';
import { useProjectsStore } from '@/src/features/projects';
import { useClientsStore } from '@/src/features/clients';
import { useTeamStore } from '@/src/features/team';

interface EventDetailsModalProps {
  event: ScheduleEvent;
  onClose: () => void;
  onEdit: () => void;
  onDelete?: () => void;
}

export default function EventDetailsModal({ event, onClose, onEdit, onDelete }: EventDetailsModalProps) {
  const config = EVENT_TYPE_CONFIG[event.type];
  const { projects } = useProjectsStore();
  const { clients } = useClientsStore();
  const { members } = useTeamStore();
  const project = projects.find(p => p.id === event.projectId);
  const phase = project?.phases.find(p => p.id === event.phaseId);
  const client = clients.find(c => c.id === event.clientId);
  const assignedMembers = members.filter(m => event.memberIds?.includes(m.id));

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
      <div className="event-details flex flex-col flex-1 min-h-0">
        <div className="event-details-body flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          <div className={`event-details-summary flex items-center gap-3 rounded-2xl ${config.iconBgClass} px-4 py-3`}>
            <div className={`event-details-summary-icon w-10 h-10 rounded-xl flex items-center justify-center ${config.textClass} bg-white/60`}>
              <MaterialIcon name={config.icon} size={20} fill />
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-bold ${config.textClass}`}>{config.label}</p>
              <p className={`text-xs font-semibold ${config.textClass} opacity-60`}>Schedule event</p>
            </div>
          </div>

          {/* Time */}
          <div className="event-details-section">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Time</p>
            <div className="event-details-time flex items-center gap-2">
              <MaterialIcon name="schedule" size={16} className="text-gray-500" />
              <p className="text-sm font-medium text-gray-700">{event.time}</p>
            </div>
          </div>

          {/* Call Link */}
          {event.callLink && (
            <div className="event-details-section">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Call Link</p>
              <button
                onClick={openCallLink}
                className="event-details-call-link w-full flex items-center gap-3 p-3 bg-(--color-surface) border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors group"
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
            <div className="event-details-section">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Notes</p>
              <p className="text-sm font-medium text-gray-700 rounded-2xl bg-(--color-surface) border border-gray-100 p-4">{event.description}</p>
            </div>
          )}

          {(project || phase || client || assignedMembers.length > 0) && (
            <div className="event-details-section">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Linked work</p>
              <div className="event-details-linked rounded-2xl bg-(--color-surface) border border-gray-100 p-4 space-y-3">
                {project && (
                  <div className="flex items-center gap-2">
                    <MaterialIcon name="work" size={15} className="text-gray-400" />
                    <p className="text-sm font-semibold text-gray-800">{project.name}</p>
                  </div>
                )}
                {phase && (
                  <div className="flex items-center gap-2">
                    <MaterialIcon name={phase.icon} size={15} className="text-gray-400" />
                    <p className="text-sm font-medium text-gray-700">{phase.title}</p>
                  </div>
                )}
                {client && (
                  <div className="flex items-center gap-2">
                    <MaterialIcon name="person" size={15} className="text-gray-400" />
                    <p className="text-sm font-medium text-gray-700">{client.fullName}</p>
                  </div>
                )}
                {assignedMembers.length > 0 && (
                  <div className="flex items-center gap-2">
                    <MaterialIcon name="group" size={15} className="text-gray-400" />
                    <p className="text-sm font-medium text-gray-700">
                      {assignedMembers.map(member => member.name).join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Event Details */}
          <div className="event-details-meta bg-(--color-surface) rounded-2xl p-4 border border-gray-100">
            <div className="event-details-meta-row flex items-start gap-3">
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
          <Button
            onClick={onClose}
            variant="secondary"
            className="flex-1"
          >
            Close
          </Button>
          {onDelete && (
            <Button
              onClick={onDelete}
              variant="danger"
              className="flex-1"
              iconLeft={<MaterialIcon name="delete" size={16} />}
            >
              Delete
            </Button>
          )}
          <Button
            onClick={onEdit}
            className="flex-1"
            iconLeft={<MaterialIcon name="edit" size={16} className="text-white" />}
          >
            Edit
          </Button>
        </FormSidebarFooter>
      </div>
    </FormSidebar>
  );
}
