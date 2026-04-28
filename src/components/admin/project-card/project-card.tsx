import { useNavigate } from 'react-router-dom';
import MaterialIcon from '../../common/material-icon/material-icon';
import { ProjectStatusBadge } from '../../common/status-badge/status-badge';
import { AvatarStack } from '../../common/avatar/avatar';
import type { AvatarStackMember } from '../../common/avatar/avatar';
import { RowActionsMenu, RowActions } from '../../common/table/table';
import type { RowAction } from '../../common/table/table';
import { ALL_STAGES, STAGE_META, getProjectAccent } from '@/src/data/projects';
import type { ClientProject } from '@/src/data/projects';
import type { TeamMember } from '@/src/data/team';
import { useClientsStore } from '@/src/store/clients';

// ─── Shared helpers ───────────────────────────────────────────────────────────

export const calcProgress = (project: ClientProject) => {
  const done = project.stages.filter(s => s.status === 'completed').length;
  return { completedCount: done, progress: Math.round((done / ALL_STAGES.length) * 100) };
};

const toStackMembers = (members: TeamMember[]): AvatarStackMember[] =>
  members.map(m => ({ name: m.name, id: m.id }));

// ─── ProjectCard props ────────────────────────────────────────────────────────

export interface ProjectCardProps {
  project: ClientProject;
  allMembers?: TeamMember[];
  actions?: RowAction[];
  /** 'default' | 'surface' kept for backwards compatibility — both render the same clean card */
  variant?: 'default' | 'surface';
  className?: string;
}

// ─── ProjectCard — clean, minimal single design ───────────────────────────────

const ProjectCard = ({
  project,
  allMembers = [],
  actions,
  className = '',
}: ProjectCardProps) => {
  const navigate = useNavigate();
  const { clients } = useClientsStore();

  const accent = getProjectAccent(project.service, project.package);
  const { completedCount, progress } = calcProgress(project);
  const remaining = project.agreedPayment - project.paidPayment;
  const projectMembers = allMembers.filter(m => project.assignedMemberIds?.includes(m.id));
  const client = clients.find(c => c.id === project.clientId);
  const currentStage = project.stages.find(s => s.status === 'current');
  const currentMeta = currentStage ? STAGE_META[currentStage.key] : null;

  return (
    <div
      onClick={() => navigate(`/admin/projects/${project.id}`)}
      className={`project-card bg-white border border-gray-200 rounded-[16px] hover:border-gray-300 hover:bg-gray-50 hover:cursor-pointer transition-all duration-150 flex flex-col ${className}`}
    >
      {/* ── Header ── */}
      <div className="px-4 pt-4 pb-3">

        {/* Name + status + actions */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 flex-1 min-w-0">
            {project.name}
          </h3>
          <div
            className="flex items-center gap-1 shrink-0 mt-0.5"
            onClick={e => e.stopPropagation()}
          >
            <ProjectStatusBadge status={project.status} />
            {actions && <RowActionsMenu actions={actions} />}
          </div>
        </div>

        {/* Service · Client */}
        <p className="text-[11px] text-gray-400 truncate">
          {accent.label}
          {client ? ` · ${client.displayName}` : ''}
        </p>

        {/* Progress bar */}
        <div className="mt-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-gray-400">
              {completedCount}/{ALL_STAGES.length} phases
              {currentMeta && project.status === 'active' && (
                <span className="text-gray-300"> · {currentMeta.label}</span>
              )}
            </span>
            <span className="text-[11px] font-bold text-gray-600 tabular-nums">{progress}%</span>
          </div>
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-700 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="px-4 py-2.5 border-t border-gray-50 flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-2 text-[11px] text-gray-400 flex-wrap">
          <span className="font-medium">${(project.agreedPayment / 1000).toFixed(0)}k</span>
          <span className="text-gray-200">·</span>
          <span>{project.timeline}</span>
          {remaining === 0 && (
            <>
              <span className="text-gray-200">·</span>
              <span className="font-semibold text-green-500">Settled</span>
            </>
          )}
        </div>

        <div
          className="flex items-center gap-2 shrink-0"
          onClick={e => e.stopPropagation()}
        >
          {projectMembers.length > 0 && (
            <AvatarStack members={toStackMembers(projectMembers)} size="xs" limit={3} />
          )}
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
}

export const ProjectCardMini = ({ project, allMembers = [], actions }: ProjectCardMiniProps) => {
  const navigate = useNavigate();
  const { clients } = useClientsStore();

  const accent = getProjectAccent(project.service, project.package);
  const { progress } = calcProgress(project);
  const remaining = project.agreedPayment - project.paidPayment;
  const projectMembers = allMembers.filter(m => project.assignedMemberIds?.includes(m.id));
  const client = clients.find(c => c.id === project.clientId);

  return (
    <div
      onClick={() => navigate(`/admin/projects/${project.id}`)}
      className="project-card-mini bg-white border border-gray-200 rounded-[14px] px-4 py-3 flex items-center gap-3 hover:bg-gray-50 hover:border-gray-200 hover:cursor-pointer transition-all duration-150 group"
    >
      {/* Service icon — neutral container */}
      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
        <MaterialIcon name={accent.icon} size={14} className="text-gray-500" />
      </div>

      {/* Name + client */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 truncate leading-tight">{project.name}</p>
        <p className="text-[10px] text-gray-400 truncate">
          {accent.label}{client ? ` · ${client.displayName}` : ''}
        </p>
      </div>

      {/* Progress bar — desktop only */}
      <div className="hidden md:flex items-center gap-2 w-28 shrink-0">
        <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gray-600 rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-[11px] text-gray-400 tabular-nums w-7 text-right">{progress}%</span>
      </div>

      {/* Budget — lg+ */}
      <div className="hidden lg:block shrink-0 text-right w-14">
        <p className="text-sm font-semibold text-gray-700">${(project.agreedPayment / 1000).toFixed(0)}k</p>
        <p className="text-[10px] text-gray-400">budget</p>
      </div>

      {/* Remaining — xl+ */}
      <div className="hidden xl:block shrink-0 text-right w-16">
        <p className={`text-sm font-semibold ${remaining > 0 ? 'text-gray-700' : 'text-green-600'}`}>
          {remaining > 0 ? `$${remaining.toLocaleString()}` : 'Settled'}
        </p>
        <p className="text-[10px] text-gray-400">remaining</p>
      </div>

      {/* Team avatars */}
      {projectMembers.length > 0 && (
        <div className="hidden sm:block shrink-0" onClick={e => e.stopPropagation()}>
          <AvatarStack members={toStackMembers(projectMembers)} size="xs" limit={3} />
        </div>
      )}

      {/* Status */}
      <div className="shrink-0">
        <ProjectStatusBadge status={project.status} />
      </div>

      {/* Actions */}
      {actions && (
        <div onClick={e => e.stopPropagation()}>
          <RowActions actions={actions} />
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
