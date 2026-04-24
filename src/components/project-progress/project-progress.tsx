import { Check } from 'lucide-react';
import MaterialIcon from '../ui/material-icon';
import { STAGE_META, ALL_STAGES } from '../../data/projects';
import type { ClientProject } from '../../data/projects';

// ─── Progress Bar ─────────────────────────────────────────────────────────────

interface ProgressBarProps {
  project: ClientProject;
  /** Tailwind bg class for the filled portion, e.g. 'bg-blue-500'. Defaults to ink. */
  barClassName?: string;
}

export const ProjectProgressBar = ({ project, barClassName = 'bg-(--color-ink)' }: ProgressBarProps) => {
  const completedCount = project.stages.filter(s => s.status === 'completed').length;
  const progress = Math.round((completedCount / ALL_STAGES.length) * 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Progress</span>
        <span className="text-[11px] font-bold text-gray-600">{progress}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barClassName}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// ─── Stage Timeline ───────────────────────────────────────────────────────────

interface TimelineProps {
  project: ClientProject;
}

export const ProjectTimeline = ({ project }: TimelineProps) => {
  const elements: React.ReactNode[] = [];

  project.stages.forEach((stage, i) => {
    const meta      = STAGE_META[stage.key];
    const isDone    = stage.status === 'completed';
    const isCurrent = stage.status === 'current';

    if (i > 0) {
      const prevDone = project.stages[i - 1].status === 'completed';
      elements.push(
        <div
          key={`line-${i}`}
          className={`flex-1 h-0.5 mt-4.5 shrink min-w-0 transition-colors ${
            prevDone && isDone ? 'bg-(--color-ink)' : 'bg-gray-150'
          }`}
        />,
      );
    }

    elements.push(
      <div key={stage.key} className="flex flex-col items-center gap-1.5 shrink-0">
        <div
          className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
            isDone
              ? 'bg-(--color-ink) border-(--color-ink) text-white'
              : isCurrent
              ? 'bg-(--color-accent-lime) border-(--color-accent-lime) text-(--color-ink)'
              : 'bg-white border-gray-200 text-gray-300'
          }`}
        >
          {isDone ? (
            <Check size={13} strokeWidth={3} />
          ) : (
            <MaterialIcon
              name={meta.icon}
              size={15}
              className={isCurrent ? 'text-(--color-ink)' : 'text-gray-300'}
            />
          )}
        </div>
        <span
          className={`text-[9px] font-semibold text-center leading-tight w-11 ${
            isDone ? 'text-gray-500' : isCurrent ? 'text-gray-900 font-bold' : 'text-gray-300'
          }`}
        >
          {meta.shortLabel}
        </span>
      </div>,
    );
  });

  return (
    <div className="project-timeline flex items-start w-full overflow-x-auto pb-1 no-scrollbar">
      {elements}
    </div>
  );
};
