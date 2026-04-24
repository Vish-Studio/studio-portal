import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import ContentCard from '../card-content/card-content';
import ButtonIcon from '../button-icon/button-icon';
import { getMemberColors } from '../../data/team';
import type { TeamProject, TeamMember } from '../../data/team';

interface ProjectsOverviewProps {
  projects: TeamProject[];
  members: TeamMember[];
  limit?: number;
}

function StatusDot({ status }: { status: string }) {
  const dot: Record<string, string> = {
    active: 'bg-green-400',
    paused: 'bg-amber-400',
    completed: 'bg-gray-300',
  };
  const label: Record<string, string> = {
    active: 'text-green-700',
    paused: 'text-amber-700',
    completed: 'text-gray-500',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${label[status] ?? 'text-gray-500'}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot[status] ?? 'bg-gray-300'}`} />
      {status}
    </span>
  );
}

export default function ProjectsOverview({ projects, members, limit = 5 }: ProjectsOverviewProps) {
  const navigate = useNavigate();
  const sorted = [...projects]
    .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
    .slice(0, limit);

  return (
    <ContentCard
      iconName="work"
      title="Recent Projects"
      className="h-full"
      action={
        <ButtonIcon
          iconName="arrow_outward"
          clickHandler={() => navigate('/admin/projects')}
          aria-label="Go to projects page"
        />
      }
    >
      {sorted.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-10">
          <p className="text-sm text-gray-400 font-medium">No projects yet</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {sorted.map(project => {
            const projectMembers = members.filter(m => m.assignedProjectId === project.id);
            const ts = project.createdAt;

            return (
              <div
                key={project.id}
                className="px-4 md:px-6 py-3 hover:bg-(--color-surface) transition-colors group flex items-center gap-4"
              >
                {/* Date / time */}
                <div className="w-14 shrink-0 text-right">
                  <p className="text-xs font-semibold text-gray-500 tabular-nums">
                    {ts ? format(ts, 'MMM d') : '—'}
                  </p>
                  <p className="text-[10px] text-gray-400 tabular-nums mt-0.5">
                    {ts ? format(ts, 'h:mm a') : ''}
                  </p>
                </div>

                {/* Pip divider */}
                <div className="w-px h-8 bg-gray-100 shrink-0" />

                {/* Name + client */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-(--color-ink) truncate group-hover:text-gray-600 transition-colors">
                    {project.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{project.client}</p>
                </div>

                {/* Stacked member avatars */}
                {projectMembers.length > 0 && (
                  <div className="flex -space-x-1.5 shrink-0">
                    {projectMembers.slice(0, 3).map(member => {
                      const colors = getMemberColors(member.id);
                      return (
                        <div
                          key={member.id}
                          title={member.name}
                          className={`w-6 h-6 rounded-full ${colors.bg} flex items-center justify-center text-white text-[10px] font-bold border-2 border-white`}
                        >
                          {member.name.charAt(0)}
                        </div>
                      );
                    })}
                    {projectMembers.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-[10px] font-bold border-2 border-white">
                        +{projectMembers.length - 3}
                      </div>
                    )}
                  </div>
                )}

                {/* Status */}
                <div className="shrink-0 w-16 text-right">
                  <StatusDot status={project.status} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </ContentCard>
  );
}
