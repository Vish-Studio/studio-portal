import { Clock3 } from '@/src/shared/components/material-icon/material-lucide-icons';
import { CardListItem, TaskStatusBadge } from '@/src/shared/components';
import type { Task } from '@/src/features/tasks/types';
import type { ClientProject } from '@/src/features/projects';

interface TeamDetailTaskRowProps {
  task: Task;
  project?: ClientProject;
}

export default function TeamDetailTaskRow({ task, project }: TeamDetailTaskRowProps) {
  return (
    <CardListItem
      title={task.title}
      subtitle={<p className="team-detail-task-row-project type-muted truncate text-gray-400">{project?.name ?? 'No project linked'}</p>}
      className="team-detail-task-row grid gap-3 rounded-[18px] border border-gray-200 bg-white p-4 md:grid-cols-[minmax(240px,1fr)_160px_120px] md:items-center"
      headerClassName="team-detail-task-row-header"
    >
      <div className="team-detail-task-row-meta flex items-center gap-2 text-gray-400">
        <Clock3 size={14} />
        <span className="team-detail-task-row-date type-label">{task.dueDate || 'No due date'}</span>
      </div>
      <div className="team-detail-task-row-status flex justify-start md:justify-end">
        <TaskStatusBadge status={task.status} />
      </div>
    </CardListItem>
  );
}
