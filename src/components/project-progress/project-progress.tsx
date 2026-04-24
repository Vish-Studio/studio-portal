import { useState } from 'react';
import { Check } from 'lucide-react';
import MaterialIcon from '../ui/material-icon';
import { STAGE_META, ALL_STAGES } from '../../data/projects';
import type { ClientProject, ProjectStage, StageKey, AccentTokens } from '../../data/projects';

// ─── Progress Bar ─────────────────────────────────────────────────────────────

interface ProgressBarProps {
  project: ClientProject;
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

// ─── Phase Track ──────────────────────────────────────────────────────────────
// Desktop: horizontal scrollable pill sequence.
// Mobile: compact progress bar + current-phase badge, tap to expand a vertical list
//         where each phase shows its icon node on the left and label on the right.

export interface PhaseTrackProps {
  stages: ProjectStage[];
  accent: AccentTokens;
  /** When provided, phase nodes are clickable (used in edit forms). */
  onPhaseSelect?: (key: StageKey) => void;
  /** 'sm' for card view, 'md' for detail page (full labels on desktop). */
  size?: 'sm' | 'md';
}

export const PhaseTrack = ({ stages, accent, onPhaseSelect, size = 'sm' }: PhaseTrackProps) => {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const completedCount = stages.filter(s => s.status === 'completed').length;
  const progress       = Math.round((completedCount / ALL_STAGES.length) * 100);
  const currentStage   = stages.find(s => s.status === 'current');
  const currentMeta    = currentStage ? STAGE_META[currentStage.key] : null;
  const isInteractive  = !!onPhaseSelect;
  const isMd           = size === 'md';

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════════════
          MOBILE  — compact bar + collapsible vertical list (hidden on sm+)
         ════════════════════════════════════════════════════════════════════════ */}
      <div className="sm:hidden flex flex-col gap-0">

        {/* Compact summary row — always visible */}
        <button
          type="button"
          onClick={() => setMobileExpanded(v => !v)}
          className="w-full flex items-center gap-3 group"
          aria-expanded={mobileExpanded}
        >
          {/* Thin progress bar */}
          <div className="flex-1 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${accent.bar}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-gray-500 tabular-nums w-7 text-right shrink-0">
              {progress}%
            </span>
          </div>

          {/* Current-phase pill */}
          {currentMeta ? (
            <span
              className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border-2 shrink-0"
              style={{ borderColor: 'var(--color-accent-lime)', background: 'rgba(255,214,0,0.1)' }}
            >
              <MaterialIcon name={currentMeta.icon} size={10} className="text-(--color-ink)" />
              <span className="text-(--color-ink)">{currentMeta.shortLabel}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200 shrink-0">
              <Check size={9} strokeWidth={3} />
              Done
            </span>
          )}

          {/* Chevron */}
          <div
            className={`w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 transition-transform duration-200 shrink-0 group-hover:bg-gray-200 ${
              mobileExpanded ? 'rotate-180' : ''
            }`}
          >
            <MaterialIcon name="expand_more" size={14} />
          </div>
        </button>

        {/* Vertical phase list — shown when expanded */}
        {mobileExpanded && (
          <div className="mt-4 flex flex-col animate-in fade-in slide-in-from-top-1 duration-150">
            {stages.map((stage, i) => {
              const isDone    = stage.status === 'completed';
              const isCurrent = stage.status === 'current';
              const isLast    = i === stages.length - 1;
              const meta      = STAGE_META[stage.key];

              return (
                <div key={stage.key} className="flex gap-3">

                  {/* Left track: node + vertical connector */}
                  <div className="flex flex-col items-center w-7 shrink-0">
                    <div
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-all ${
                        isDone
                          ? `${accent.bar} border-transparent text-white`
                          : isCurrent
                          ? 'text-(--color-ink)'
                          : 'bg-white border-gray-200 text-gray-300'
                      }`}
                      style={isCurrent ? { borderColor: 'var(--color-accent-lime)', background: 'rgba(255,214,0,0.15)' } : undefined}
                    >
                      {isDone
                        ? <Check size={11} strokeWidth={3} />
                        : <MaterialIcon name={meta.icon} size={12} className={isCurrent ? 'text-(--color-ink)' : 'text-gray-300'} />
                      }
                    </div>

                    {/* Connector to next node */}
                    {!isLast && (
                      <div className={`w-0.5 flex-1 min-h-3 mt-0.5 ${isDone ? accent.bar : 'bg-gray-100'}`} />
                    )}
                  </div>

                  {/* Right: label + status — optionally interactive */}
                  <button
                    type="button"
                    disabled={!isInteractive}
                    onClick={() => onPhaseSelect?.(stage.key)}
                    className={`flex-1 flex items-center justify-between ${isLast ? 'pb-0' : 'pb-4'} text-left ${
                      isInteractive ? 'cursor-pointer hover:opacity-75' : 'cursor-default'
                    }`}
                  >
                    <div>
                      <p className={`text-sm font-semibold leading-tight ${
                        isDone ? 'text-gray-400' : isCurrent ? 'text-(--color-ink)' : 'text-gray-300'
                      }`}>
                        {meta.label}
                      </p>
                      <p className={`text-[11px] mt-0.5 ${
                        isDone ? 'text-green-500' : isCurrent ? 'text-amber-500' : 'text-gray-300'
                      }`}>
                        {isDone ? 'Completed' : isCurrent ? 'In Progress' : 'Upcoming'}
                      </p>
                    </div>

                    {isCurrent && (
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-(--color-ink) px-2 py-0.5 rounded-full border shrink-0"
                        style={{ borderColor: 'var(--color-accent-lime)', background: 'rgba(255,214,0,0.15)' }}
                      >
                        Active
                        <span className="w-1 h-1 rounded-full bg-(--color-ink) animate-pulse" />
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          DESKTOP  — horizontal scrollable pills (hidden below sm)
         ════════════════════════════════════════════════════════════════════════ */}
      <div className="hidden sm:block overflow-x-auto no-scrollbar">
        <div className="flex items-center min-w-max py-0.5">
          {stages.map((stage, i) => {
            const isDone    = stage.status === 'completed';
            const isCurrent = stage.status === 'current';
            const prevDone  = i > 0 && stages[i - 1].status === 'completed';
            const meta      = STAGE_META[stage.key];

            // Connector line
            const connector = i > 0 ? (
              <div
                className={`shrink-0 h-px transition-colors ${isMd ? 'w-4' : 'w-2.5'} ${
                  prevDone && (isDone || isCurrent) ? accent.bar : 'bg-gray-200'
                }`}
              />
            ) : null;

            // Pill classes per status
            const pillCls = isDone
              ? `${accent.bar} text-white ${isMd ? 'px-2.5 py-1 text-[10px]' : 'px-2 py-0.5 text-[9px]'}`
              : isCurrent
              ? `border-2 text-(--color-ink) font-bold ${isMd ? 'px-3 py-1.5 text-[11px]' : 'px-2.5 py-0.5 text-[10px]'}`
              : `bg-gray-100 text-gray-400 ${isMd ? 'px-2.5 py-1 text-[10px]' : 'px-2 py-0.5 text-[9px]'}`;

            return (
              <div key={stage.key} className="flex items-center">
                {connector}
                <button
                  type="button"
                  disabled={!isInteractive}
                  onClick={() => onPhaseSelect?.(stage.key)}
                  title={meta.label}
                  style={isCurrent ? { borderColor: 'var(--color-accent-lime)', background: 'rgba(255,214,0,0.1)' } : undefined}
                  className={`inline-flex items-center gap-1 rounded-full font-semibold whitespace-nowrap transition-all shrink-0 ${pillCls} ${
                    isInteractive ? 'cursor-pointer hover:opacity-75 active:scale-95' : 'cursor-default'
                  }`}
                >
                  {isDone && <Check size={isMd ? 9 : 7} strokeWidth={3} />}
                  {!isDone && (
                    <MaterialIcon
                      name={meta.icon}
                      size={isMd ? 12 : 10}
                      className={isCurrent ? 'text-(--color-ink)' : 'text-gray-400'}
                    />
                  )}
                  <span>{isCurrent && isMd ? meta.label : meta.shortLabel}</span>
                  {isCurrent && (
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse"
                      style={{ background: 'var(--color-ink)' }}
                    />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

// ─── Stage Timeline (vertical stepper, legacy detail view) ────────────────────

export const ProjectTimeline = ({ project }: { project: ClientProject }) => {
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

// ─── Phase Selector (for forms) ───────────────────────────────────────────────
// Interactive pill selector — horizontally scrollable.
// selectedIndex: 0 = discovery is current, 8 = all stages complete.

export interface PhaseSelectorProps {
  selectedIndex: number;
  onChange: (index: number) => void;
}

export const PhaseSelector = ({ selectedIndex, onChange }: PhaseSelectorProps) => (
  <div className="overflow-x-auto no-scrollbar">
    <div className="flex items-center min-w-max gap-0 py-0.5">
      {ALL_STAGES.map((key, i) => {
        const meta      = STAGE_META[key];
        const isDone    = i < selectedIndex;
        const isCurrent = i === selectedIndex;
        const isAllDone = selectedIndex === ALL_STAGES.length;

        return (
          <div key={key} className="flex items-center shrink-0">
            {i > 0 && (
              <div
                className={`w-3 h-px shrink-0 transition-colors ${isDone || isAllDone ? 'bg-gray-400' : 'bg-gray-200'}`}
              />
            )}
            <button
              type="button"
              onClick={() => onChange(i)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition-all ${
                isCurrent && !isAllDone
                  ? 'bg-(--color-ink) text-white shadow-sm'
                  : isDone || isAllDone
                  ? 'bg-gray-300 text-gray-700'
                  : 'bg-white border border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-600'
              }`}
            >
              <MaterialIcon name={meta.icon} size={10} />
              <span>{meta.shortLabel}</span>
            </button>
          </div>
        );
      })}

      {/* All complete */}
      <div className="flex items-center shrink-0">
        <div className={`w-3 h-px shrink-0 transition-colors ${selectedIndex === ALL_STAGES.length ? 'bg-green-400' : 'bg-gray-200'}`} />
        <button
          type="button"
          onClick={() => onChange(ALL_STAGES.length)}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition-all ${
            selectedIndex === ALL_STAGES.length
              ? 'bg-green-500 text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-400 hover:border-green-400 hover:text-green-600'
          }`}
        >
          <Check size={9} strokeWidth={3} />
          <span>Done</span>
        </button>
      </div>
    </div>
  </div>
);
