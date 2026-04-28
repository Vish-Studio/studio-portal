import { format, isPast, parseISO } from 'date-fns';
import { Pencil, Trash2, CalendarDays, Briefcase } from 'lucide-react';
import Modal from '../../common/modal/modal';
import Avatar from '../../common/avatar/avatar';
import { TaskStatusBadge, TASK_STATUS_LABEL, TASK_STATUS_VARIANT } from '../../common/status-badge/status-badge';
import { PRIORITY_DOT } from '../task-card/task-card';
import { useProjectsStore } from '@/src/store/projects';
import { useTeamStore } from '@/src/store/team';
import type { Task } from '@/src/data/tasks';

// ─── Priority label ───────────────────────────────────────────────────────────

const PRIORITY_LABEL: Record<Task['priority'], string> = {
  high:   'High',
  medium: 'Medium',
  low:    'Low',
};

// ─── TaskDetailModal ──────────────────────────────────────────────────────────

export interface TaskDetailModalProps {
  task:      Task;
  onClose:   () => void;
  onEdit?:   () => void;
  onDelete?: () => void;
}

export default function TaskDetailModal({ task, onClose, onEdit, onDelete }: TaskDetailModalProps) {
  const { projects } = useProjectsStore();
  const { members }  = useTeamStore();

  const project   = projects.find(p => p.id === task.projectId);
  const assignees = members.filter(m => task.assigneeIds?.includes(m.id));

  const due     = task.dueDate ? parseISO(task.dueDate) : null;
  const overdue = due && isPast(due) && task.status !== 'completed';

  const statusVariant = TASK_STATUS_VARIANT[task.status];
  const variantBg: Record<string, string> = {
    gray:   'bg-gray-100',
    blue:   'bg-blue-50',
    amber:  'bg-amber-50',
    green:  'bg-green-50',
  };

  const headerIcon = (
    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${variantBg[statusVariant] ?? 'bg-gray-100'}`}>
      <TaskStatusBadge status={task.status} />
    </div>
  );

  return (
    <Modal
      onClose={onClose}
      size="md"
      headerIcon={headerIcon}
      title={task.title}
      footer={
        <div className="flex gap-3">
          {onDelete && (
            <button
              type="button"
              onClick={() => { onClose(); onDelete(); }}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
            >
              <Trash2 size={14} />
              Delete
            </button>
          )}
          <div className="flex-1" />
          {onEdit && (
            <button
              type="button"
              onClick={() => { onClose(); onEdit(); }}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-700 rounded-xl transition-colors"
            >
              <Pencil size={14} />
              Edit task
            </button>
          )}
        </div>
      }
    >
      <div className="px-6 py-5 flex flex-col gap-5">

        {/* Priority + status row */}
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-xs ${PRIORITY_DOT[task.priority]}`} />
          <span className="text-xs font-semibold text-gray-500">{PRIORITY_LABEL[task.priority]} priority</span>
          <span className="text-gray-200 mx-1">·</span>
          <span className="text-xs font-semibold text-gray-500">{TASK_STATUS_LABEL[task.status]}</span>
        </div>

        {/* Description */}
        {task.description ? (
          <p className="text-sm text-gray-600 leading-relaxed">{task.description}</p>
        ) : (
          <p className="text-sm text-gray-300 italic">No description provided.</p>
        )}

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-4">

          {/* Project */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Project</p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center">
                <Briefcase size={11} className="text-gray-500" />
              </div>
              <span className="text-sm font-semibold text-gray-800 truncate">
                {project?.name ?? '—'}
              </span>
            </div>
          </div>

          {/* Due date */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Due date</p>
            {due ? (
              <div className={`flex items-center gap-2 ${overdue ? 'text-red-500' : 'text-gray-800'}`}>
                <CalendarDays size={13} className="shrink-0" />
                <span className="text-sm font-semibold">{format(due, 'MMM d, yyyy')}</span>
                {overdue && <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-md">Overdue</span>}
              </div>
            ) : (
              <span className="text-sm text-gray-300">—</span>
            )}
          </div>
        </div>

        {/* Assignees */}
        {assignees.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assigned to</p>
            <div className="flex flex-col gap-2">
              {assignees.map(m => (
                <div key={m.id} className="flex items-center gap-2.5">
                  <Avatar name={m.name} id={m.id} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{m.name}</p>
                    <p className="text-[10px] text-gray-400">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
}
