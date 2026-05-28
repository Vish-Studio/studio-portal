import { useNavigate } from 'react-router-dom';
import { AvatarStack, CardListItem, formatRecordDate, MaterialIcon, ProjectStatusBadge, RecordMeta, RowActionsMenu, type AvatarStackMember, type RowAction } from '@/src/shared/components';
import { getProjectAccent, getPhaseProgress, type ClientProject } from '../../types';
import type { TeamMember } from '@/src/features/team';
import { useClientsStore } from '@/src/features/clients';

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
    <CardListItem
      item={project}
      onOpen={() => navigate(resolveDetailPath(detailPath, project))}
      title={project.name}
      subTitle={`${accent.label}`}
      actions={actions}
      className={`project-card flex flex-col rounded-[16px] border border-gray-200 bg-white hover:border-(--color-ink) transition-all duration-150 ${className}`}
      headerClassName="project-card-header"
      contentClassName="project-card-body"
      footerClassName="project-card-footer"
      footer={(
        <>
          <div className="project-card-footer-meta type-muted flex flex-wrap items-center gap-2 text-gray-400">
            <ProjectStatusBadge status={project.status} />
          </div>
          <RecordMeta className="project-card-date shrink-0" items={[{ label: formatRecordDate(project.startedAt), icon: 'event' }]} />
        </>
      )}
    >
        <div className="project-card-info mb-3 flex flex-wrap items-center gap-2">
          <span className="project-card-value type-count rounded-lg bg-gray-100 px-2 py-1 text-gray-500">${(project.agreedPayment / 1000).toFixed(0)}k</span>
          <span className="project-card-timeline type-count rounded-lg bg-gray-100 px-2 py-1 text-gray-500">{project.timeline || 'No timeline'}</span>
          {project.endDate && <span className="project-card-end-date type-count rounded-lg bg-gray-100 px-2 py-1 text-gray-500">Ends {formatRecordDate(project.endDate)}</span>}
          {remaining === 0 && <span className="project-card-settled type-count rounded-lg bg-green-50 px-2 py-1 text-green-600">Settled</span>}
        </div>
        <div className="project-card-assignment mb-3 flex min-w-0 items-center justify-between gap-2 rounded-2xl bg-gray-50 px-3 py-2.5" onClick={e => e.stopPropagation()}>
          <div className="project-card-client-team min-w-0">
            {client && (
              <RecordMeta className="project-card-client" items={[{ label: client.fullName, icon: 'person' }]} />
            )}
          </div>
          <div className="project-card-team shrink-0">
            {projectMembers.length > 0 && <AvatarStack members={toStackMembers(projectMembers)} size="xs" limit={3} />}
            {projectMembers.length === 0 && (
              <span className="project-card-unassigned type-count inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 text-gray-400">
                <MaterialIcon name="person_off" size={11} />
                No team
              </span>
            )}
          </div>
        </div>
        <div className="project-card-progress mt-3.5">
          <div className="project-card-progress-meta flex items-center justify-between mb-1.5">
            <span className="type-meta text-gray-400">
              {completedCount}/{project.phases.length} phases
              {activePhase && project.status === 'active' && (
                <span className="text-gray-300"> · {activePhase.title}</span>
              )}
            </span>
            <span className="type-meta font-bold text-gray-600 tabular-nums">{progress}%</span>
          </div>
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gray-700 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

      {clientAction && (
        <div className="project-card-client-action mx-4 mb-3 flex items-center gap-3 rounded-[12px] border border-violet-200 bg-violet-50 px-3 py-2.5" onClick={e => e.stopPropagation()}>
          <MaterialIcon name="person" size={14} className="shrink-0 text-violet-500" />
          <div className="min-w-0 flex-1">
            <p className="type-meta truncate font-semibold text-violet-900">{clientAction.label}</p>
            {clientAction.description && <p className="type-meta text-violet-500">{clientAction.description}</p>}
          </div>
          <button
            type="button"
            onClick={clientAction.onClick}
            className="type-count shrink-0 rounded-[8px] bg-violet-600 px-2.5 py-1.5 text-white transition-colors hover:bg-violet-700"
          >
            Done
          </button>
        </div>
      )}
    </CardListItem>
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
      className="project-card-mini relative bg-white border border-gray-200 rounded-[12px] px-3 py-3 hover:bg-gray-50 hover:border-gray-300 hover:cursor-pointer transition-all duration-150 lg:px-4"
    >
      <div className="project-card-mini-grid grid items-center gap-3 lg:grid-cols-[minmax(220px,1fr)_120px_90px_110px_120px_120px_32px]">
        <div className="project-card-mini-meta min-w-0">
          <div className="flex items-center gap-2">
            <MaterialIcon name={accent.icon} size={15} className="text-gray-400 shrink-0" />
            <p className="type-card-title truncate text-gray-900">{project.name}</p>
          </div>
          <p className="type-muted mt-1 truncate pl-6 text-gray-400">
            {accent.label}{client ? ` · ${client.fullName}` : ''}
          </p>
        </div>

        <div className="project-card-mini-progress flex items-center gap-2 lg:justify-end">
          <div className="h-1 w-20 overflow-hidden rounded-full bg-gray-100 lg:w-16">
            <div className="h-full rounded-full bg-gray-600" style={{ width: `${progress}%` }} />
          </div>
          <span className="type-meta w-8 text-right text-gray-400 tabular-nums">{progress}%</span>
        </div>

        <p className="type-card-title hidden text-right text-gray-700 tabular-nums lg:block">
          ${(project.agreedPayment / 1000).toFixed(0)}k
        </p>

        <p className={`type-card-title hidden text-right tabular-nums lg:block ${remaining > 0 ? 'text-gray-700' : 'text-green-600'}`}>
          {remaining > 0 ? `$${remaining.toLocaleString()}` : 'Settled'}
        </p>

        <div className="project-card-mini-client-action hidden lg:flex justify-end" onClick={e => e.stopPropagation()}>
          {clientAction ? (
            <button
              type="button"
              onClick={clientAction.onClick}
              className="type-count flex items-center gap-1.5 whitespace-nowrap rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-violet-700 transition-colors hover:bg-violet-100"
            >
              <MaterialIcon name="person" size={10} />
              {clientAction.label}
            </button>
          ) : <span />}
        </div>

        <div className="project-card-mini-status flex justify-start lg:justify-end">
          <ProjectStatusBadge status={project.status} />
        </div>

        {actions && (
          <div className="project-card-mini-actions absolute right-3 top-3 lg:static lg:flex lg:justify-end" onClick={e => e.stopPropagation()}>
            <RowActionsMenu actions={actions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
