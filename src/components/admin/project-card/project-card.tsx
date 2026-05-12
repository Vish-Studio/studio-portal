import { useNavigate } from 'react-router-dom';
import MaterialIcon from '../../common/material-icon/material-icon';
import { ProjectStatusBadge } from '../../common/status-badge/status-badge';
import { AvatarStack } from '../../common/avatar/avatar';
import type { AvatarStackMember } from '../../common/avatar/avatar';
import { RowActionsMenu } from '../../common/table/table';
import type { RowAction } from '../../common/table/table';
import { getProjectAccent, getPhaseProgress } from '@/src/data/projects';
import type { ClientProject } from '@/src/data/projects';
import type { TeamMember } from '@/src/data/team';
import { useClientsStore } from '@/src/store/clients';

export const calcProgress = (project: ClientProject) => {
  const done     = project.phases.filter(p => p.status === 'done').length;
  const progress = getPhaseProgress(project.phases);
  return { completedCount: done, progress };
};

const toStackMembers = (members: TeamMember[]): AvatarStackMember[] =>
  members.map(m => ({ name: m.name, id: m.id }));

export interface ProjectCardProps {
  project: ClientProject;
  allMembers?: TeamMember[];
  actions?: RowAction[];
  detailPath?: string | ((project: ClientProject) => string);
  clientAction?: {
    label: string;
    description?: string;
    onClick: () => void;
  };
  variant?: 'default' | 'surface';
  className?: string;
}

const resolveDetailPath = (detailPath: ProjectCardProps['detailPath'], project: ClientProject) => {
  if (typeof detailPath === 'function') return detailPath(project);
  return detailPath ?? `/admin/projects/${project.id}`;
};

const ProjectCard = ({
  project,
  allMembers = [],
  actions,
  detailPath,
  clientAction,
  className = '',
}: ProjectCardProps) => {
  const navigate = useNavigate();
  const { clients } = useClientsStore();

  const accent         = getProjectAccent(project.service, project.package);
  const { completedCount, progress } = calcProgress(project);
  const remaining      = project.agreedPayment - project.paidPayment;
  const projectMembers = allMembers.filter(m => project.assignedMemberIds?.includes(m.id));
  const client         = clients.find(c => c.id === project.clientId);
  const activePhase    = project.phases.find(p => p.status === 'active');

  return (
    <div
      onClick={() => navigate(resolveDetailPath(detailPath, project))}
      className={`project-card bg-white border border-gray-200 rounded-[16px] hover:border-gray-300 hover:bg-gray-50 hover:cursor-pointer transition-all duration-150 flex flex-col ${className}`}
    >
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 flex-1 min-w-0">{project.name}</h3>
          <div className="flex items-center gap-1 shrink-0 mt-0.5" onClick={e => e.stopPropagation()}>
            <ProjectStatusBadge status={project.status} />
            {actions && <RowActionsMenu actions={actions} />}
          </div>
        </div>

        <p className="text-[11px] text-gray-400 truncate">
          {accent.label}{client ? ` · ${client.displayName}` : ''}
        </p>

        <div className="mt-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-gray-400">
              {completedCount}/{project.phases.length} phases
              {activePhase && project.status === 'active' && (
                <span className="text-gray-300"> · {activePhase.title}</span>
              )}
            </span>
            <span className="text-[11px] font-bold text-gray-600 tabular-nums">{progress}%</span>
          </div>
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gray-700 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {clientAction && (
        <div className="mx-4 mb-3 flex items-center gap-3 rounded-[12px] border border-violet-200 bg-violet-50 px-3 py-2.5" onClick={e => e.stopPropagation()}>
          <MaterialIcon name="person" size={14} className="shrink-0 text-violet-500" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-semibold text-violet-900">{clientAction.label}</p>
            {clientAction.description && <p className="text-[10px] text-violet-500">{clientAction.description}</p>}
          </div>
          <button
            type="button"
            onClick={clientAction.onClick}
            className="shrink-0 rounded-[8px] bg-violet-600 px-2.5 py-1.5 text-[10px] font-bold text-white transition-colors hover:bg-violet-700"
          >
            Done
          </button>
        </div>
      )}

      <div className="px-4 py-2.5 border-t border-gray-50 flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-2 text-[11px] text-gray-400 flex-wrap">
          <span className="font-medium">${(project.agreedPayment / 1000).toFixed(0)}k</span>
          <span className="text-gray-200">·</span>
          <span>{project.timeline}</span>
          {remaining === 0 && (
            <><span className="text-gray-200">·</span><span className="font-semibold text-green-500">Settled</span></>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
          {projectMembers.length > 0 && <AvatarStack members={toStackMembers(projectMembers)} size="xs" limit={3} />}
        </div>
      </div>
    </div>
  );
};

// ─── ProjectCardMini — list-row variant ──────────────────────────────────────

export interface ProjectCardMiniProps {
  project: ClientProject;
  allMembers?: TeamMember[];
  actions?: RowAction[];
  detailPath?: string | ((project: ClientProject) => string);
  clientAction?: {
    label: string;
    onClick: () => void;
  };
}

export const ProjectCardMini = ({ project, actions, detailPath, clientAction }: ProjectCardMiniProps) => {
  const navigate = useNavigate();
  const { clients } = useClientsStore();

  const accent    = getProjectAccent(project.service, project.package);
  const { progress } = calcProgress(project);
  const remaining = project.agreedPayment - project.paidPayment;
  const client    = clients.find(c => c.id === project.clientId);

  return (
    <div
      onClick={() => navigate(resolveDetailPath(detailPath, project))}
      className="project-card-mini relative bg-white border border-gray-200 rounded-[12px] px-3 py-3 hover:bg-gray-50 hover:border-gray-300 hover:cursor-pointer transition-all duration-150 md:px-4"
    >
      <div className="grid items-center gap-3 md:grid-cols-[minmax(220px,1fr)_120px_90px_110px_120px_120px_32px]">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <MaterialIcon name={accent.icon} size={15} className="text-gray-400 shrink-0" />
            <p className="truncate text-sm font-semibold leading-tight text-gray-900">{project.name}</p>
          </div>
          <p className="mt-1 truncate pl-6 text-[11px] text-gray-400">
            {accent.label}{client ? ` · ${client.displayName}` : ''}
          </p>
        </div>

        <div className="flex items-center gap-2 md:justify-end">
          <div className="h-1 w-20 overflow-hidden rounded-full bg-gray-100 md:w-16">
            <div className="h-full rounded-full bg-gray-600" style={{ width: `${progress}%` }} />
          </div>
          <span className="w-8 text-right text-[11px] text-gray-400 tabular-nums">{progress}%</span>
        </div>

        <p className="hidden text-right text-sm font-semibold text-gray-700 tabular-nums md:block">
          ${(project.agreedPayment / 1000).toFixed(0)}k
        </p>

        <p className={`hidden text-right text-sm font-semibold tabular-nums md:block ${remaining > 0 ? 'text-gray-700' : 'text-green-600'}`}>
          {remaining > 0 ? `$${remaining.toLocaleString()}` : 'Settled'}
        </p>

        <div className="hidden md:flex justify-end" onClick={e => e.stopPropagation()}>
          {clientAction ? (
            <button
              type="button"
              onClick={clientAction.onClick}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-violet-700 transition-colors hover:bg-violet-100"
            >
              <MaterialIcon name="person" size={10} />
              {clientAction.label}
            </button>
          ) : <span />}
        </div>

        <div className="flex justify-start md:justify-end">
          <ProjectStatusBadge status={project.status} />
        </div>

        {actions && (
          <div className="absolute right-3 top-3 md:static md:flex md:justify-end" onClick={e => e.stopPropagation()}>
            <RowActionsMenu actions={actions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
