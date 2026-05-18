import { useNavigate } from 'react-router-dom';
import CardContent from '@/src/components/common/card-content/card-content';
import { AvatarStack, ButtonIcon, MaterialIcon, ProjectStatusBadge, type AvatarStackMember } from '@/src/shared/components';
import { getProjectAccent, getPhaseProgress, type ClientProject } from '../../types';
import type { TeamMember } from '@/src/features/team';

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
      className="projects-overview h-full"
      action={
        <ButtonIcon
          iconName="arrow_outward"
          clickHandler={() => navigate('/admin/projects')}
          aria-label="View all projects"
        />
      }
    >
      {recent.length === 0 ? (
        <div className="projects-overview-empty flex-1 flex items-center justify-center py-10">
          <p className="text-sm text-gray-400 font-medium">No projects yet</p>
        </div>
      ) : (
        <div className="projects-overview-list flex-1 overflow-y-auto divide-y divide-gray-100">
          {recent.map(project => {
            const accent = getProjectAccent(project.service, project.package);
            const progress = getPhaseProgress(project.phases);

            const projectMembers: AvatarStackMember[] = members
              .filter(m => project.assignedMemberIds?.includes(m.id))
              .map(m => ({ name: m.name, id: m.id }));

            return (
              <button
                key={project.id}
                type="button"
                onClick={() => navigate(`/admin/projects/${project.id}`)}
                className="projects-overview-item w-full text-left px-4 md:px-6 py-3.5 hover:bg-(--color-surface-subtle) transition-colors group flex items-center gap-3"
              >
                {/* Service icon */}
                <div className={`projects-overview-icon w-8 h-8 rounded-xl ${accent.bg} flex items-center justify-center shrink-0`}>
                  <MaterialIcon name={accent.icon} size={14} className={accent.iconText} />
                </div>

                {/* Name + service label */}
                <div className="projects-overview-meta flex-1 min-w-0">
                  <p className="text-sm font-semibold text-(--color-ink) truncate leading-tight group-hover:text-gray-600 transition-colors">
                    {project.name}
                  </p>
                  <span className={`text-[10px] font-semibold ${accent.badgeText}`}>
                    {accent.label}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="projects-overview-progress hidden sm:flex items-center gap-2 w-24 shrink-0">
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
                  <div className="projects-overview-team hidden md:block shrink-0">
                    <AvatarStack members={projectMembers} size="xs" limit={2} />
                  </div>
                )}

                {/* Status */}
                <div className="projects-overview-status shrink-0">
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
