import { Check, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useLocation, useNavigate } from 'react-router-dom';
import MaterialIcon from '../ui/material-icon';
import { ProjectStatusBadge } from '../status-badge/status-badge';
import { ALL_STAGES, STAGE_META, getProjectAccent } from '../../data/projects';
import type { ClientProject } from '../../data/projects';
import ButtonIcon from '../button-icon/button-icon';

// ─── Shared helpers ───────────────────────────────────────────────────────────

const calcProgress = (project: ClientProject) => {
  const done = project.stages.filter(s => s.status === 'completed').length;
  return { completedCount: done, progress: Math.round((done / ALL_STAGES.length) * 100) };
};

// ─── Stage segment dots (compact progress indicator) ─────────────────────────

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

// ─── Full Project Card ────────────────────────────────────────────────────────

interface ProjectCardProps {
  project: ClientProject;
  className?: string;
}

const ProjectCard = ({ project, className = '' }: ProjectCardProps) => {
  const navigate = useNavigate();
  const accent = getProjectAccent(project.service, project.package);
  const { completedCount, progress } = calcProgress(project);
  const remaining = project.agreedPayment - project.paidPayment;
  const currentStage = project.stages.find(s => s.status === 'current');
  const currentMeta = currentStage ? STAGE_META[currentStage.key] : null;
  const location = useLocation();


  return (
    <div
      onClick={() => navigate(`/admin/projects/${project.id}`)}
      className={`project-card bg-white border border-gray-200 rounded-[20px] overflow-hidden hover:cursor-pointer hover:bg-gray-50 transition-all duration-200 flex flex-col ${className}`}>
      <div className="project-card-header relative px-5 pt-5 pb-5 overflow-hidden">
        <div className="relative flex items-start justify-between gap-3 mb-6">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className={`w-10 h-10 rounded-xl ${accent.bg} flex items-center justify-center shrink-0 mt-0.5`}>
              <MaterialIcon name={accent.icon} size={18} className={accent.iconText} />
            </div>

            <h3 className="text-[15px] font-bold leading-snug truncate">{project.name}</h3>
          </div>
        </div>

        {/* Started + current stage */}
        <div className="flex items-center justify-between gap-3 ">
          <div className="flex items-end gap-1.5 mt-1.5 flex-wrap">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${accent.badgeBg} ${accent.badgeText}`}>
              {accent.label}
            </span>
            <ProjectStatusBadge status={project.status} />
          </div>

          <div className="relative flex items-center justify-end gap-2 mt-3 flex-wrap text-black/30 ">
            {currentMeta && project.status === 'active' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium">
                <span className="text-white/20">·</span>
                <MaterialIcon name={currentMeta.icon} size={10} />
                {currentMeta.label}
              </span>
            )}

            <span className="inline-flex items-center gap-1 text-[11px] font-medium">
              <Calendar size={10} />
              {format(project.startedAt, 'MMM d, yyyy')}
            </span>
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="hidden md:grid grid-cols-3 divide-x divide-gray-100 border border-gray-100">
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

      {/* ── Progress + stage dots ── */}
      <div className="hidden md:flex px-5 py-4 flex-col gap-3 flex-1">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Progress</span>
            <span className="text-[11px] font-bold text-gray-600">{progress}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${accent.bar}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <StageDots project={project} barClassName={accent.bar} />
      </div>

      {/* ── Financial footer ── */}
      <div className="hidden md:flex px-5 py-3.5 border-t border-gray-100 bg-gray-50/50 items-center justify-between gap-3">
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

// ─── Mini Project Card (for list view) ───────────────────────────────────────

interface ProjectCardMiniProps {
  project: ClientProject;
}

export const ProjectCardMini = ({ project }: ProjectCardMiniProps) => {
  const navigate = useNavigate();
  const accent = getProjectAccent(project.service, project.package);
  const { progress } = calcProgress(project);
  const remaining = project.agreedPayment - project.paidPayment;

  return (
    <div
      className="project-card-mini bg-white border border-gray-100 rounded-[16px] px-4 py-3.5 flex items-center gap-4 hover:bg-gray-100 hover:cursor-pointer duration-200 group transition-all ease-in-out"
      onClick={() => navigate(`/admin/projects/${project.id}`)}>

      {/* Service icon */}
      <div className={`w-9 h-9 rounded-xl ${accent.bg} flex items-center justify-center shrink-0`}>
        <MaterialIcon name={accent.icon} size={16} className={accent.iconText} />
      </div>

      {/* Name + service label */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-gray-900 truncate leading-tight">{project.name}</p>
        <span className={`text-[10px] font-semibold ${accent.badgeText}`}>{accent.label}</span>
      </div>

      {/* Mini progress bar */}
      <div className="hidden sm:flex items-center gap-2.5 w-32 shrink-0">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${accent.bar}`} style={{ width: `${progress}%` }} />
        </div>
        <span className="text-[11px] font-semibold text-gray-500 tabular-nums w-7 text-right">{progress}%</span>
      </div>

      {/* Budget */}
      <div className="hidden md:block shrink-0 w-16 text-right">
        <p className="text-sm font-bold text-gray-900">${(project.agreedPayment / 1000).toFixed(0)}k</p>
        <p className="text-[10px] text-gray-400">budget</p>
      </div>

      {/* Remaining */}
      <div className="hidden lg:block shrink-0 w-20 text-right">
        <p className={`text-sm font-bold ${remaining > 0 ? 'text-amber-600' : 'text-green-600'}`}>
          {remaining > 0 ? `$${remaining.toLocaleString()}` : 'Settled'}
        </p>
        <p className="text-[10px] text-gray-400">remaining</p>
      </div>

      {/* Timeline */}
      <div className="hidden xl:block shrink-0 w-16 text-right">
        <p className="text-sm font-semibold text-gray-600">{project.timeline}</p>
        <p className="text-[10px] text-gray-400">timeline</p>
      </div>

      {/* Status */}
      <div className="shrink-0">
        <ProjectStatusBadge status={project.status} />
      </div>
    </div >
  );
};

export default ProjectCard;
