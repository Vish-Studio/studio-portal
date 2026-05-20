import { Briefcase, UserCheck } from '@/src/shared/components/material-icon/material-lucide-icons';
import { Modal } from '@/src/shared/components';
import { getMemberColors, type TeamMember, type TeamProject } from '../../types';

interface AssignProjectModalProps {
  member: TeamMember;
  projects: TeamProject[];
  onClose: () => void;
  onAssign: (memberId: string, projectId: string | null) => Promise<void>;
}

export default function AssignProjectModal({ member, projects, onClose, onAssign }: AssignProjectModalProps) {
  const colors = getMemberColors(member.id);

  return (
    <Modal
      variant="dialog"
      size="sm"
      onClose={onClose}
      title="Assign Project"
      description={member.name}
      headerIcon={
        <div className={`assign-project-modal-avatar flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colors.bg} text-base font-bold text-white`}>
          {member.name.charAt(0)}
        </div>
      }
    >
      <div className="assign-project-modal-list flex max-h-80 flex-col gap-1.5 overflow-y-auto px-4 pb-4">
        {projects.map(project => {
          const isSelected = project.id === member.assignedProjectId;
          return (
            <button
              key={project.id}
              onClick={() => { onAssign(member.id, project.id); onClose(); }}
              className={`assign-project-modal-option flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-all ${isSelected ? 'border-black bg-black' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
            >
              <Briefcase size={14} className={`assign-project-modal-option-icon shrink-0 ${isSelected ? 'text-white/50' : 'text-gray-400'}`} />
              <div className="assign-project-modal-option-copy min-w-0 flex-1">
                <p className={`assign-project-modal-option-title type-card-title truncate ${isSelected ? 'text-white' : 'text-gray-900'}`}>{project.name}</p>
                <p className={`assign-project-modal-option-meta type-muted mt-0.5 truncate ${isSelected ? 'text-white/50' : 'text-gray-400'}`}>
                  {project.client}{project.status === 'paused' && <span className="assign-project-modal-option-paused ml-1.5">- Paused</span>}
                </p>
              </div>
              {isSelected && <UserCheck size={14} className="assign-project-modal-option-check shrink-0 text-white/70" />}
            </button>
          );
        })}
        <button
          onClick={() => { onAssign(member.id, null); onClose(); }}
          disabled={member.assignedProjectId === null}
          className="assign-project-modal-remove mt-1 w-full rounded-xl border border-dashed border-gray-200 py-2.5 text-xs font-semibold text-gray-400 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-500 disabled:pointer-events-none disabled:opacity-30"
        >
          Remove assignment
        </button>
      </div>
    </Modal>
  );
}
