import { useNavigate } from 'react-router-dom';
import CardContent from '../card-content/card-content';
import ButtonIcon from '../button-icon/button-icon';
import MaterialIcon from '../ui/material-icon';
import { ProjectStatusBadge } from '../status-badge/status-badge';
import { AvatarStack } from '../avatar/avatar';
import type { AvatarStackMember } from '../avatar/avatar';
import { getProjectAccent, ALL_STAGES } from '../../data/projects';
import type { ClientProject } from '../../data/projects';
import type { TeamMember } from '../../data/team';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProjectsOverviewProps {
  projects: ClientProject[];
  members: TeamMember[];
  limit?: number;
}

// ─── ProjectsOverview ─────────────────────────────────────────────────────────

const ProjectsOverview = ({ projects, members, limit = 4 }: ProjectsOverviewProps) => {
  const navigate = useNavigate();

  const recent = [...projects]
    .sort((a, b) => b.startedAt - a.startedAt)
    .slice(0, limit);

  return (
    <CardContent
      iconName="work"
      title="Recent Projects"
      className="h-full"
      action={
        <ButtonIcon
          iconName="arrow_outward"
          clickHandler={() => navigate('/admin/projects')}
          aria-label="View all projects"
        />
      }
    >
      {recent.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-10">
          <p className="text-sm text-gray-400 font-medium">No projects yet</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {recent.map(project => {
            const accent = getProjectAccent(project.service, project.package);
            const completedCount = project.stages.filter(s => s.status === 'completed').length;
            const progress = Math.round((completedCount / ALL_STAGES.length) * 100);

            const projectMembers: AvatarStackMember[] = members
              .filter(m => project.assignedMemberIds?.includes(m.id))
              .map(m => ({ name: m.name, id: m.id }));

            return (
              <button
                key={project.id}
                type="button"
                onClick={() => navigate(`/admin/projects/${project.id}`)}
                className="w-full text-left px-4 md:px-6 py-3.5 hover:bg-(--color-surface-subtle) transition-colors group flex items-center gap-3"
              >
                {/* Service icon */}
                <div className={`w-8 h-8 rounded-xl ${accent.bg} flex items-center justify-center shrink-0`}>
                  <MaterialIcon name={accent.icon} size={14} className={accent.iconText} />
                </div>

                {/* Name + service label */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-(--color-ink) truncate leading-tight group-hover:text-gray-600 transition-colors">
                    {project.name}
                  </p>
                  <span className={`text-[10px] font-semibold ${accent.badgeText}`}>
                    {accent.label}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="hidden sm:flex items-center gap-2 w-24 shrink-0">
                  <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${accent.bar}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-gray-400 tabular-nums w-6 text-right">
                    {progress}%
                  </span>
                </div>

                {/* Team avatars */}
                {projectMembers.length > 0 && (
                  <div className="hidden md:block shrink-0">
                    <AvatarStack members={projectMembers} size="xs" limit={2} />
                  </div>
                )}

                {/* Status */}
                <div className="shrink-0">
                  <ProjectStatusBadge status={project.status} />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </CardContent>
  );
};

export default ProjectsOverview;
