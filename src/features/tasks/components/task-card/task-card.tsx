import { FunctionComponent } from 'react';
import { format, isPast, parseISO } from 'date-fns';
import { Pencil, Trash2 } from '@/src/shared/components/material-icon/material-lucide-icons';
import { AvatarStack, CardListItem, RecordMeta, TaskStatusBadge, type RowAction } from '@/src/shared/components';
import { useProjectsStore } from '@/src/features/projects';
import { useTeamStore } from '@/src/features/team';
import { useClientsStore } from '@/src/features/clients';
import type { Task, TaskPriority } from '../../types';

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
    <CardListItem
      item={task}
      onOpen={onClick ? () => onClick() : undefined}
      title={task.title}
      subTitle={task.description && <p className="task-card-description type-muted line-clamp-2 text-gray-400">{task.description}</p>}
      actions={menuActions}
      className="task-card flex flex-col rounded-[16px] border border-gray-200 bg-white transition-all duration-150 hover:border-gray-200 hover:bg-gray-50"
      headerClassName="task-card-header"
      contentClassName="task-card-body"
      footerClassName="task-card-footer"
      footer={(
        <>
          <div className="task-card-footer-meta flex min-w-0 items-center gap-2">
            {showStatus && <TaskStatusBadge status={task.status} />}
          </div>

          {due && (
            <RecordMeta
              className={`shrink-0 ${overdue ? 'text-red-500 [&_.material-icon]:text-red-500 [&_.record-meta-label]:text-red-500' : ''}`}
              items={[{ label: format(due, 'MMM d'), icon: overdue ? 'warning' : 'event' }]}
            />
          )}
        </>
      )}
    >
      <div className="task-card-meta flex items-center gap-1.5">
        <span className={`task-card-priority h-1.5 w-1.5 shrink-0 rounded-full ${PRIORITY_DOT[task.priority]}`} />
        <RecordMeta items={[{ label: project?.name ?? 'No project', icon: 'work' }]} />
      </div>
      {(clientAssignee || assignees.length > 0) && (
        <div className="task-card-assignment mt-3 flex items-center justify-between gap-2 rounded-2xl bg-gray-50 px-3 py-2.5">
          <div className="task-card-assignment-meta min-w-0">
            {clientAssignee && (
              <RecordMeta items={[{ label: clientAssignee.fullName, icon: 'person' }]} />
            )}
          </div>
          {assignees.length > 0 && (
            <AvatarStack members={assignees} size="xs" limit={3} />
          )}
        </div>
      )}
    </CardListItem>
  );
};

export default TaskCard;
