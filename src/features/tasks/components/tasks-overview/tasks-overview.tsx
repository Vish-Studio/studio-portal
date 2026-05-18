import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import CardContent from '@/src/components/common/card-content/card-content';
import { ButtonIcon, MaterialIcon, TaskStatusBadge } from '@/src/shared/components';
import { getProjectAccent } from '@/src/features/projects';
import { useProjectsStore } from '@/src/features/projects';
import type { Task } from '../../types';

interface TasksOverviewProps {
  tasks: Task[];
  limit?: number;
}

const PRIORITY_DOT: Record<Task['priority'], string> = {
  high:   'bg-red-400',
  medium: 'bg-amber-400',
  low:    'bg-gray-300',
};

const TasksOverview: FunctionComponent<TasksOverviewProps> = ({ tasks, limit = 5 }) => {
  const navigate = useNavigate();
  const { projects } = useProjectsStore();

  const recent = [...tasks]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, limit);

  return (
    <CardContent
      iconName="task_alt"
      title="Recent Tasks"
      className="h-full"
      action={
        <ButtonIcon
          iconName="arrow_outward"
          aria-label="View all tasks"
          clickHandler={() => navigate('/admin/tasks')}
        />
      }
    >
      {recent.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-10">
          <p className="text-sm text-gray-400 font-medium">No tasks yet</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {recent.map(task => {
            const project = projects.find(p => p.id === task.projectId);
            const accent  = project ? getProjectAccent(project.service, project.package) : null;
            const ago     = formatDistanceToNow(task.updatedAt, { addSuffix: true });

            return (
              <button
                key={task.id}
                type="button"
                onClick={() => navigate('/admin/tasks')}
                className="w-full text-left px-4 md:px-6 py-3.5 hover:bg-(--color-surface-subtle) transition-colors group flex items-center gap-3"
              >
                {/* Priority dot */}
                <div className={`w-1.5 h-1.5 rounded-xs shrink-0 ${PRIORITY_DOT[task.priority]}`} />

                {/* Project badge + title */}
                <div className="flex-1 min-w-0">
                  {project && accent && (
                    <div className="flex items-center gap-1 mb-0.5">
                      <MaterialIcon name={accent.icon} size={9} className={accent.badgeText} />
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${accent.badgeText}`}>
                        {project.name}
                      </span>
                    </div>
                  )}
                  <p className="text-sm font-semibold text-(--color-ink) truncate group-hover:text-gray-600 transition-colors leading-tight">
                    {task.title}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{ago}</p>
                </div>

                {/* Status badge */}
                <div className="shrink-0">
                  <TaskStatusBadge status={task.status} />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </CardContent>
  );
};

export default TasksOverview;
