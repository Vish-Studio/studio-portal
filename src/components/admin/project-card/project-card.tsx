import { Check, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import MaterialIcon from '../../common/material-icon/material-icon';
import { ProjectStatusBadge } from '../../common/status-badge/status-badge';
import { AvatarStack } from '../../common/avatar/avatar';
import type { AvatarStackMember } from '../../common/avatar/avatar';
import { RowActionsMenu } from '../../common/table/table';
import type { RowAction } from '../../common/table/table';
import { PhaseTrack } from '../project-progress/project-progress';
import { ALL_STAGES, STAGE_META, getProjectAccent } from '@/src/data/projects';
import type { ClientProject } from '@/src/data/projects';
import type { TeamMember } from '@/src/data/team';

// ─── Shared helpers ───────────────────────────────────────────────────────────

export const calcProgress = (project: ClientProject) => {
  const done = project.stages.filter(s => s.status === 'completed').length;
  return { completedCount: done, progress: Math.round((done / ALL_STAGES.length) * 100) };
};

const toStackMembers = (members: TeamMember[]): AvatarStackMember[] =>
  members.map(m => ({ name: m.name, id: m.id }));

// ─── Card props ───────────────────────────────────────────────────────────────

export interface ProjectCardProps {
  project: ClientProject;
  /** Team members pool; filtered internally to assigned ones. */
  allMembers?: TeamMember[];
  /** Row-actions menu items (edit / delete). */
  actions?: RowAction[];
  /**
   * 'default' — dark header design (used on detail pages).
   * 'surface' — light card with PhaseTrack as visual focus (used on list/grid pages).
   */
  variant?: 'default' | 'surface';
  className?: string;
}

// ─── Default variant (dark header) ───────────────────────────────────────────

const StageDots = ({ project, barClassName }: { project: ClientProject; barClassName: string }) => (
  <div className="flex items-center gap-1">
    {project.stages.map(stage => {
      const isDone = stage.status === 'completed';
      const isCurrent = stage.status === 'current';
      return (
        <div
          key={stage.key}
          title={STAGE_META[stage.key].label}
          className={`flex-1 h-1.5 rounded-full transition-all ${isDone ? barClassName : 'bg-gray-100'}`}
          style={isCurrent ? { background: 'var(--color-accent-lime)' } : undefined}
        />
      );
    })}
  </div>
);

const DefaultCard = ({
  project, projectMembers, accent, actions, navigate, progress, completedCount, remaining,
}: any) => {
  const currentStage = project.stages.find((s: any) => s.status === 'current');
  const currentMeta = currentStage ? STAGE_META[currentStage.key as import('@/src/data/projects').StageKey] : null;

  return (
    <div
      onClick={() => navigate(`/admin/projects/${project.id}`)}
      className="project-card bg-white border border-gray-100 rounded-[20px] overflow-hidden hover:shadow-md hover:cursor-pointer transition-all duration-200 flex flex-col"
    >
      {/* Dark header */}
      <div className="relative px-5 pt-5 pb-4 overflow-hidden" style={{ background: '#161719' }}>
        <div className={`absolute -top-8 -left-4 w-28 h-28 rounded-full opacity-20 blur-2xl pointer-events-none ${accent.bar}`} />

        <div className="relative flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className={`w-10 h-10 rounded-xl ${accent.bg} flex items-center justify-center shrink-0 mt-0.5`}>
              <MaterialIcon name={accent.icon} size={18} className={accent.iconText} />
            </div>
            <div className="min-w-0">
              <h3 className="text-[15px] font-bold text-white leading-snug truncate">{project.name}</h3>
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${accent.badgeBg} ${accent.badgeText}`}>
                  {accent.label}
                </span>
                <ProjectStatusBadge status={project.status} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 mt-0.5" onClick={e => e.stopPropagation()}>
            {projectMembers.length > 0 && (
              <AvatarStack members={toStackMembers(projectMembers)} size="xs" limit={3} />
            )}
            {actions && <RowActionsMenu actions={actions} />}
          </div>
        </div>

        <div className="relative flex items-center gap-2 mt-3 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[11px] text-white/30 font-medium">
            <Calendar size={10} />
            {format(project.startedAt, 'MMM d, yyyy')}
          </span>
          {currentMeta && project.status === 'active' && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-white/30">
              <span className="text-white/20">·</span>
              <MaterialIcon name={currentMeta.icon} size={10} />
              {currentMeta.label}
            </span>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
        {[
          { label: 'Stages', value: `${completedCount}/${ALL_STAGES.length}` },
          { label: 'Budget', value: `$${(project.agreedPayment / 1000).toFixed(0)}k` },
          { label: 'Timeline', value: project.timeline },
        ].map(({ label, value }) => (
          <div key={label} className="px-4 py-3">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-sm font-bold text-gray-900 truncate">{value}</p>
          </div>
        ))}
      </div>

      {/* Progress + dots */}
      <div className="px-5 py-4 flex flex-col gap-3 flex-1">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Progress</span>
            <span className="text-[11px] font-bold text-gray-600">{progress}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${accent.bar}`} style={{ width: `${progress}%` }} />
          </div>
        </div>
        <StageDots project={project} barClassName={accent.bar} />
      </div>

      {/* Footer */}
      <div className="px-5 py-3.5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[11px] text-gray-500">
            Paid: <span className="font-bold text-green-600">${project.paidPayment.toLocaleString()}</span>
          </span>
          <span className="text-gray-200 select-none">·</span>
          <span className="text-[11px] text-gray-500">
            Due:{' '}
            <span className={`font-bold ${remaining > 0 ? 'text-amber-600' : 'text-green-600'}`}>
              {remaining > 0 ? `$${remaining.toLocaleString()}` : 'Paid in full'}
            </span>
          </span>
        </div>
        {remaining === 0 && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full shrink-0">
            <Check size={9} strokeWidth={3} />
            Settled
          </span>
        )}
      </div>
    </div>
  );
};

// ─── Surface variant (light, phase-track hero) ────────────────────────────────

const SurfaceCard = ({
  project, projectMembers, accent, actions, navigate, progress, remaining,
}: any) => (
  <div
    onClick={() => navigate(`/admin/projects/${project.id}`)}
    className="project-card-surface relative bg-white border border-gray-200 rounded-[20px] overflow-hidden hover:bg-gray-100 hover:border-gray-200 hover:cursor-pointer transition-all duration-200 flex flex-col"
  >
    {/* Header */}
    <div className="pl-5 pr-4 pt-5 pb-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className={`w-9 h-9 rounded-xl ${accent.bg} flex items-center justify-center shrink-0`}>
            <MaterialIcon name={accent.icon} size={16} className={accent.iconText} />
          </div>
          <div className="min-w-0">
            <h3 className="text-[15px] font-bold text-gray-900 truncate leading-snug">{project.name}</h3>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${accent.badgeBg} ${accent.badgeText}`}>
                {accent.label}
              </span>
              <ProjectStatusBadge status={project.status} />
            </div>
          </div>
        </div>

        {/* Avatars + actions (stopPropagation so card nav doesn't fire) */}
        <div className="flex items-center gap-2 shrink-0 mt-0.5" onClick={e => e.stopPropagation()}>
          {projectMembers.length > 0 && (
            <AvatarStack members={toStackMembers(projectMembers)} size="xs" limit={3} />
          )}
          {actions && <RowActionsMenu actions={actions} />}
        </div>
      </div>
    </div>

    {/* Phase track — the visual hero of this variant */}
    <div className="px-5 pb-4 border-t border-gray-50 pt-3">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
        Current Phase
      </p>
      <PhaseTrack stages={project.stages} accent={accent} size="sm" />
    </div>

    {/* Footer strip */}
    <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/40 flex items-center gap-2 flex-wrap">
      <span className="text-[12px] font-bold text-gray-800">
        ${(project.agreedPayment / 1000).toFixed(0)}k
      </span>
      <span className="text-gray-300 select-none">·</span>
      <span className="text-[11px] text-gray-500">{project.timeline}</span>
      <span className="text-gray-300 select-none">·</span>
      <span className={`text-[11px] font-bold ${accent.badgeText}`}>{progress}%</span>
      {remaining === 0 && (
        <>
          <span className="text-gray-300 select-none">·</span>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600">
            <Check size={9} strokeWidth={3} />
            Settled
          </span>
        </>
      )}
    </div>
  </div>
);

// ─── ProjectCard (unified entry point) ───────────────────────────────────────

const ProjectCard = ({
  project,
  allMembers = [],
  actions,
  variant = 'default',
  className = '',
}: ProjectCardProps) => {
  const navigate = useNavigate();
  const accent = getProjectAccent(project.service, project.package);
  const { completedCount, progress } = calcProgress(project);
  const remaining = project.agreedPayment - project.paidPayment;
  const projectMembers = allMembers.filter(m => project.assignedMemberIds?.includes(m.id));

  const sharedProps = { project, projectMembers, accent, actions, navigate, progress, completedCount, remaining };

  return (
    <div className={className}>
      {variant === 'surface'
        ? <SurfaceCard {...sharedProps} />
        : <DefaultCard {...sharedProps} />
      }
    </div>
  );
};

// ─── Mini Project Card (list view) ───────────────────────────────────────────

export interface ProjectCardMiniProps {
  project: ClientProject;
  allMembers?: TeamMember[];
  actions?: RowAction[];
}

export const ProjectCardMini = ({ project, allMembers = [], actions }: ProjectCardMiniProps) => {
  const navigate = useNavigate();
  const accent = getProjectAccent(project.service, project.package);
  const { progress } = calcProgress(project);
  const remaining = project.agreedPayment - project.paidPayment;
  const projectMembers = allMembers.filter(m => project.assignedMemberIds?.includes(m.id));

  return (
    <div
      onClick={() => navigate(`/admin/projects/${project.id}`)}
      className="project-card-mini bg-white border border-gray-100 rounded-[16px] px-4 py-3.5 flex items-center gap-4 hover:bg-gray-50 hover:cursor-pointer transition-all duration-150 group"
    >
      <div className={`w-9 h-9 rounded-xl ${accent.bg} flex items-center justify-center shrink-0`}>
        <MaterialIcon name={accent.icon} size={16} className={accent.iconText} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-gray-900 truncate leading-tight">{project.name}</p>
        <span className={`text-[10px] font-semibold ${accent.badgeText}`}>{accent.label}</span>
      </div>

      {projectMembers.length > 0 && (
        <div className="hidden sm:block shrink-0" onClick={e => e.stopPropagation()}>
          <AvatarStack members={toStackMembers(projectMembers)} size="xs" limit={3} />
        </div>
      )}

      <div className="hidden md:flex items-center gap-2.5 w-32 shrink-0">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${accent.bar}`} style={{ width: `${progress}%` }} />
        </div>
        <span className="text-[11px] font-semibold text-gray-500 tabular-nums w-7 text-right">{progress}%</span>
      </div>

      <div className="hidden lg:block shrink-0 w-16 text-right">
        <p className="text-sm font-bold text-gray-900">${(project.agreedPayment / 1000).toFixed(0)}k</p>
        <p className="text-[10px] text-gray-400">budget</p>
      </div>

      <div className="hidden xl:block shrink-0 w-20 text-right">
        <p className={`text-sm font-bold ${remaining > 0 ? 'text-amber-600' : 'text-green-600'}`}>
          {remaining > 0 ? `$${remaining.toLocaleString()}` : 'Settled'}
        </p>
        <p className="text-[10px] text-gray-400">remaining</p>
      </div>

      <div className="shrink-0">
        <ProjectStatusBadge status={project.status} />
      </div>

      {actions && (
        <div onClick={e => e.stopPropagation()}>
          <RowActionsMenu actions={actions} />
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
