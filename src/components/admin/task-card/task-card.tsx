import { FunctionComponent } from 'react';
import { format, isPast, parseISO } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import MaterialIcon from '../../common/material-icon/material-icon';
import { AvatarStack } from '../../common/avatar/avatar';
import { RowActionsMenu } from '../../common/table/table';
import type { RowAction } from '../../common/table/table';
import { TaskStatusBadge } from '../../common/status-badge/status-badge';
import { useProjectsStore } from '@/src/store/projects';
import { useTeamStore } from '@/src/store/team';
import type { Task, TaskPriority } from '@/src/data/tasks';

// ─── Priority dot colour ──────────────────────────────────────────────────────

export const PRIORITY_DOT: Record<TaskPriority, string> = {
  high: 'bg-red-400',
  medium: 'bg-amber-400',
  low: 'bg-gray-300',
};

// ─── TaskCard ─────────────────────────────────────────────────────────────────

export interface TaskCardProps {
  task: Task;
  showStatus?: boolean;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const TaskCard: FunctionComponent<TaskCardProps> = ({
  task, showStatus = true, onClick, onEdit, onDelete,
}) => {
  const { projects } = useProjectsStore();
  const { members } = useTeamStore();

  const project = projects.find(p => p.id === task.projectId);
  const assignees = members
    .filter(m => task.assigneeIds?.includes(m.id))
    .map(m => ({ name: m.name, id: m.id }));

  const due = task.dueDate ? parseISO(task.dueDate) : null;
  const overdue = due && isPast(due) && task.status !== 'completed';

  const menuActions: RowAction[] = [
    ...(onEdit ? [{ label: 'Edit task', icon: <Pencil size={14} />, onClick: onEdit }] : []),
    ...(onDelete ? [{ label: 'Delete task', icon: <Trash2 size={14} />, onClick: onDelete, variant: 'danger' as const }] : []),
  ];

  return (
    <div
      onClick={onClick}
      className={`task-card bg-white border border-gray-200 rounded-[16px] hover:border-gray-200 hover:bg-gray-50 transition-all duration-150 flex flex-col ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* ── Body ── */}
      <div className="px-4 pt-4 pb-3 flex-1">

        {/* Meta row: priority dot + project name + actions */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className={`w-1.5 h-1.5 rounded-xs shrink-0 ${PRIORITY_DOT[task.priority]}`} />
            <span className="text-[11px] text-gray-400 font-medium truncate">
              {project?.name ?? 'No project'}
            </span>
          </div>
          {menuActions.length > 0 && (
            <div className="shrink-0" onClick={e => e.stopPropagation()}>
              <RowActionsMenu actions={menuActions} />
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="px-4 py-2.5 border-t border-gray-50 flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-2 min-w-0">
          {showStatus && <TaskStatusBadge status={task.status} />}
          {assignees.length > 0 && (
            <AvatarStack members={assignees} size="xs" limit={3} />
          )}
        </div>

        {due && (
          <span className={`text-[10px] font-semibold flex items-center gap-0.5 shrink-0 ${overdue ? 'text-red-500' : 'text-gray-400'
            }`}>
            {overdue && <MaterialIcon name="warning" size={10} />}
            {format(due, 'MMM d')}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
