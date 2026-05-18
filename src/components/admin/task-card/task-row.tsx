import { FunctionComponent } from 'react';
import { format, isPast, parseISO } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import { AvatarStack } from '../../common/avatar/avatar';
import { RowActionsMenu } from '../../common/table/table';
import type { RowAction } from '../../common/table/table';
import { TaskStatusBadge } from '../../common/status-badge/status-badge';
import MaterialIcon from '../../common/material-icon/material-icon';
import { useProjectsStore } from '@/src/features/projects';
import { useTeamStore } from '@/src/features/team';
import { useClientsStore } from '@/src/features/clients';
import type { Task } from '@/src/data/tasks';
import { PRIORITY_DOT } from './task-card';

// ─── TaskRow — compact list-row variant ───────────────────────────────────────

export interface TaskRowProps {
  task: Task;
  showProject?: boolean;
  showStatus?: boolean;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const TaskRow: FunctionComponent<TaskRowProps> = ({
  task,
  showProject = true,
  showStatus = true,
  onClick,
  onEdit,
  onDelete,
}) => {
  const { projects } = useProjectsStore();
  const { members } = useTeamStore();
  const { clients } = useClientsStore();

  const project = projects.find(p => p.id === task.projectId);
  const clientAssignee = clients.find(client => client.id === task.clientAssigneeId);
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
      className={`task-row flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-[14px] hover:bg-gray-50/80 hover:border-gray-200 transition-all duration-150 ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Priority indicator */}
      <span className={`task-row-priority w-1.5 h-1.5 rounded-xs shrink-0 ${PRIORITY_DOT[task.priority]}`} />

      {/* Title + project */}
      <div className="task-row-meta min-w-0 flex-1">
        <p className="type-card-title truncate text-gray-900">{task.title}</p>
        {showProject && (
          <p className="type-meta truncate text-gray-400">{project?.name ?? 'No project'}</p>
        )}
      </div>

      {/* Due date */}
      {due && (
        <span className={`type-meta hidden lg:flex items-center gap-0.5 shrink-0 ${overdue ? 'text-red-500' : 'text-gray-400'
          }`}>
          {overdue && <MaterialIcon name="warning" size={10} />}
          {format(due, 'MMM d')}
        </span>
      )}

      {/* Assignees */}
      {assignees.length > 0 && (
        <div className="task-row-assignees hidden lg:block shrink-0">
          <AvatarStack members={assignees} size="xs" limit={3} />
        </div>
      )}

      {clientAssignee && (
        <span className="type-count hidden items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 text-gray-500 lg:flex">
          <MaterialIcon name="person" size={11} />
          Client
        </span>
      )}

      {/* Status badge */}
      {showStatus && (
        <div className="task-row-status shrink-0">
          <TaskStatusBadge status={task.status} />
        </div>
      )}

      {/* Actions */}
      {menuActions.length > 0 && (
        <div className="task-row-actions shrink-0" onClick={e => e.stopPropagation()}>
          <RowActionsMenu actions={menuActions} />
        </div>
      )}
    </div>
  );
};

export default TaskRow;
