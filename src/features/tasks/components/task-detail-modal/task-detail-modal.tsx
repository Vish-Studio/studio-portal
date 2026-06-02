import { format, formatDistanceToNow, isPast, parseISO } from 'date-fns';
import FormSidebar, { FormSidebarFooter } from '@/src/shared/components/form-sidebar/form-sidebar';
import { Avatar, Button, MaterialIcon, TASK_STATUS_LABEL, TaskStatusBadge } from '@/src/shared/components';
import { getProjectAccent } from '@/src/features/projects';
import { PRIORITY_DOT } from '../task-card/task-card';
import { useProjectsStore } from '@/src/features/projects';
import { useTeamStore } from '@/src/features/team';
import { useClientsStore } from '@/src/features/clients';
import type { Task } from '../../types';

const PRIORITY_LABEL: Record<Task['priority'], string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

function InfoBlock({
  icon,
  label,
  children,
  tone = 'default',
}: {
  icon: string;
  label: string;
  children: React.ReactNode;
  tone?: 'default' | 'danger';
}) {
  return (
    <div className="task-detail-info-block rounded-2xl bg-(--color-surface) p-4">
      <div className="task-detail-info-block-row flex items-start gap-3">
        <div className={`task-detail-info-block-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tone === 'danger' ? 'bg-red-50 text-red-500' : 'bg-white text-gray-500'}`}>
          <MaterialIcon name={icon} size={17} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
          <div className="mt-1 text-sm font-semibold text-(--color-ink)">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function TaskDetailModal({ task, onClose, onEdit, onDelete }: TaskDetailModalProps) {
  const { projects } = useProjectsStore();
  const { members } = useTeamStore();
  const { clients } = useClientsStore();

  const project = projects.find(p => p.id === task.projectId);
  const clientAssignee = clients.find(client => client.id === task.clientAssigneeId);
  const assignees = members.filter(member => task.assigneeIds?.includes(member.id));
  const due = task.dueDate ? parseISO(task.dueDate) : null;
  const overdue = due && isPast(due) && task.status !== 'completed';
  const projectAccent = project ? getProjectAccent(project.service, project.package) : null;

  return (
    <FormSidebar
      isOpen
      onClose={onClose}
      title="Task details"
      description={project?.name ?? 'No linked project'}
      width="md"
    >
      <div className="task-detail flex min-h-0 flex-1 flex-col">
        <div className="task-detail-body flex-1 overflow-y-auto px-6 py-5">
          <div className="task-detail-summary mb-5 pb-5 border-b border-gray-100">
            <div className="task-detail-summary-header mb-4 flex items-start justify-between gap-3">
              <span className={`task-detail-priority mt-1 h-2 w-2 shrink-0 rounded-full ${PRIORITY_DOT[task.priority]}`} />
              <div className="task-detail-title min-w-0 flex-1">
                <h2 className="text-xl font-bold leading-tight text-(--color-ink)">{task.title}</h2>
                <p className="mt-2 text-xs font-semibold text-gray-400">
                  Updated {formatDistanceToNow(task.updatedAt, { addSuffix: true })}
                </p>
              </div>
              <TaskStatusBadge status={task.status} />
            </div>

            {task.description ? (
              <p className="rounded-2xl bg-(--color-surface-alt) p-4 text-sm font-medium leading-6 text-gray-600">
                {task.description}
              </p>
            ) : (
              <p className="rounded-2xl border border-dashed border-gray-200 bg-(--color-surface-alt) p-4 text-sm font-medium text-gray-400">
                No description provided.
              </p>
            )}
          </div>

          <div className="task-detail-grid grid grid-cols-1 gap-3">
            <InfoBlock icon="flag" label="Priority">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${PRIORITY_DOT[task.priority]}`} />
                {PRIORITY_LABEL[task.priority]} priority
              </div>
            </InfoBlock>

            <InfoBlock icon="task_alt" label="Status">
              {TASK_STATUS_LABEL[task.status]}
            </InfoBlock>

            <InfoBlock icon={projectAccent?.icon ?? 'work'} label="Project">
              {project ? (
                <div className="flex items-center gap-2">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${projectAccent?.bg ?? 'bg-gray-100'}`}>
                    <MaterialIcon name={projectAccent?.icon ?? 'work'} size={14} className={projectAccent?.iconText ?? 'text-gray-500'} />
                  </span>
                  <span className="truncate">{project.name}</span>
                </div>
              ) : (
                <span className="text-gray-400">No project linked</span>
              )}
            </InfoBlock>

            <InfoBlock icon="event" label="Due date" tone={overdue ? 'danger' : 'default'}>
              {due ? (
                <div className={overdue ? 'text-red-600' : ''}>
                  {format(due, 'MMM d, yyyy')}
                  {overdue && (
                    <span className="ml-2 rounded-md bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-600">
                      Overdue
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-gray-400">No due date</span>
              )}
            </InfoBlock>

            <InfoBlock icon="group" label="Assigned to">
              {assignees.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {assignees.map(member => (
                    <div key={member.id} className="flex items-center gap-2.5">
                      <Avatar name={member.name} id={member.id} color={member.avatarColor} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-(--color-ink)">{member.name}</p>
                        <p className="text-xs font-medium text-gray-400">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-gray-400">Unassigned</span>
              )}
            </InfoBlock>

            <InfoBlock icon="person" label="Client visibility">
              {clientAssignee ? (
                <div className="flex flex-col gap-1">
                  <span>{clientAssignee.fullName}</span>
                  <span className="text-xs font-medium text-gray-400">
                    Visible in the client dashboard and task list
                  </span>
                </div>
              ) : (
                <span className="text-gray-400">Internal team task only</span>
              )}
            </InfoBlock>

            <InfoBlock icon="history" label="Timeline">
              <div className="space-y-1 text-sm">
                <p>Created {format(task.createdAt, 'MMM d, yyyy')}</p>
                <p className="text-gray-400">Updated {format(task.updatedAt, 'MMM d, yyyy')}</p>
              </div>
            </InfoBlock>
          </div>
        </div>

        <FormSidebarFooter>
          {onDelete && (
            <Button
              type="button"
              variant="danger"
              onClick={onDelete}
              className="flex-1"
              iconLeft={<MaterialIcon name="delete" size={16} />}
            >
              Delete
            </Button>
          )}
          {onEdit && (
            <Button
              type="button"
              onClick={onEdit}
              className="flex-1"
              iconLeft={<MaterialIcon name="edit" size={16} className="text-white" />}
            >
              Edit task
            </Button>
          )}
        </FormSidebarFooter>
      </div>
    </FormSidebar>
  );
}
