import { useState } from 'react';
import { Check } from 'lucide-react';
import MaterialIcon from '../../common/material-icon/material-icon';
import { getPhaseProgress } from '@/src/data/projects';
import type { ClientProject, Phase, AccentTokens } from '@/src/data/projects';

// ─── Progress Bar ─────────────────────────────────────────────────────────────

export const ProjectProgressBar = ({
  project,
  barClassName = 'bg-(--color-ink)',
}: {
  project: ClientProject;
  barClassName?: string;
}) => {
  const progress = getPhaseProgress(project.phases);
  const done     = project.phases.filter(p => p.status === 'done').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Progress</span>
        <span className="text-[11px] font-bold text-gray-600">{progress}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${barClassName}`} style={{ width: `${progress}%` }} />
      </div>
      <p className="text-[10px] text-gray-400 mt-1">{done}/{project.phases.length} phases complete</p>
    </div>
  );
};

// ─── PhaseTrack ───────────────────────────────────────────────────────────────
// Color rules:
//   done    → --color-ink (dark fill, white text)
//   active  → accent color (service/package accent fill)
//   pending → gray-100 background
//
// Desktop: horizontal scrollable pill sequence.
// Mobile:  compact progress bar + active badge, tap to expand vertical list.

export interface PhaseTrackProps {
  phases: Phase[];
  accent: AccentTokens;
  size?: 'sm' | 'md';
}

export const PhaseTrack = ({ phases, accent, size = 'sm' }: PhaseTrackProps) => {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const progress    = getPhaseProgress(phases);
  const activePhase = phases.find(p => p.status === 'active');
  const isMd        = size === 'md';

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          MOBILE — compact bar + collapsible vertical list
         ══════════════════════════════════════════════════════ */}
      <div className="sm:hidden flex flex-col gap-0">
        <button
          type="button"
          onClick={() => setMobileExpanded(v => !v)}
          className="w-full flex items-center gap-3 group"
          aria-expanded={mobileExpanded}
        >
          {/* Progress bar */}
          <div className="flex-1 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all bg-(--color-ink)" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-[11px] font-bold text-gray-500 tabular-nums w-7 text-right shrink-0">
              {progress}%
            </span>
          </div>

          {/* Active phase badge — solid accent */}
          {activePhase ? (
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-white shrink-0 ${accent.bar}`}>
              <MaterialIcon name={activePhase.icon} size={10} className="text-white" />
              <span>{activePhase.title}</span>
              {activePhase.requiresClientAction && (
                <MaterialIcon name="person" size={9} className="text-white/70" />
              )}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-(--color-ink) text-white px-2 py-0.5 rounded-full shrink-0">
              <Check size={9} strokeWidth={3} />
              Done
            </span>
          )}

          {/* Expand chevron */}
          <div className={`w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 transition-transform duration-200 shrink-0 group-hover:bg-gray-200 ${mobileExpanded ? 'rotate-180' : ''}`}>
            <MaterialIcon name="expand_more" size={14} />
          </div>
        </button>

        {/* Expanded vertical list */}
        {mobileExpanded && (
          <div className="mt-4 flex flex-col animate-in fade-in slide-in-from-top-1 duration-150">
            {phases.map((phase, i) => {
              const isDone   = phase.status === 'done';
              const isActive = phase.status === 'active';
              const isLast   = i === phases.length - 1;

              return (
                <div key={phase.id} className="flex gap-3">
                  {/* Left track: node + connector */}
                  <div className="flex flex-col items-center w-7 shrink-0">
                    <div
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-all ${
                        isDone
                          ? 'bg-(--color-ink) border-transparent text-white'
                          : isActive
                          ? `${accent.bg} ${accent.iconText} border-2`
                          : 'bg-white border-gray-200 text-gray-300'
                      }`}
                      style={isActive ? { borderColor: `var(--tw-${accent.bar.replace('bg-', '')}, currentColor)` } : undefined}
                    >
                      {isDone
                        ? <Check size={11} strokeWidth={3} />
                        : <MaterialIcon name={phase.icon} size={12} className={isActive ? accent.iconText : 'text-gray-300'} />
                      }
                    </div>
                    {!isLast && (
                      <div className={`w-0.5 flex-1 min-h-3 mt-0.5 ${isDone ? 'bg-(--color-ink)' : 'bg-gray-100'}`} />
                    )}
                  </div>

                  {/* Right: label + status */}
                  <div className={`flex-1 flex items-center justify-between ${isLast ? 'pb-0' : 'pb-4'}`}>
                    <div>
                      <p className={`text-sm font-semibold leading-tight ${
                        isDone ? 'text-gray-400' : isActive ? 'text-(--color-ink)' : 'text-gray-300'
                      }`}>
                        {phase.title}
                      </p>
                      <p className={`text-[11px] mt-0.5 ${
                        isDone ? 'text-green-500' : isActive ? accent.iconText : 'text-gray-300'
                      }`}>
                        {isDone ? 'Done' : isActive ? 'Active' : 'Pending'}
                        {phase.requiresClientAction && !isDone && (
                          <span className="ml-1 text-violet-500">· Client action</span>
                        )}
                      </p>
                    </div>
                    {isActive && (
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold text-white px-2 py-0.5 rounded-full shrink-0 ${accent.bar}`}>
                        Active
                        <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════
          DESKTOP — horizontal scrollable pills
         ══════════════════════════════════════════════════════ */}
      <div className="hidden sm:block overflow-x-auto no-scrollbar">
        <div className="flex items-center min-w-max py-0.5">
          {phases.map((phase, i) => {
            const isDone   = phase.status === 'done';
            const isActive = phase.status === 'active';
            const prevDone = i > 0 && phases[i - 1].status === 'done';

            // Connector: dark when left side is done, gray otherwise
            const connector = i > 0 ? (
              <div className={`shrink-0 h-px transition-colors ${isMd ? 'w-4' : 'w-2.5'} ${
                prevDone ? 'bg-(--color-ink)' : 'bg-gray-200'
              }`} />
            ) : null;

            // Pill colours:  done → ink  |  active → accent  |  pending → gray
            const pillCls = isDone
              ? `bg-(--color-ink) text-white ${isMd ? 'px-2.5 py-1 text-[10px]' : 'px-2 py-0.5 text-[9px]'}`
              : isActive
              ? `${accent.bar} text-white font-bold ${isMd ? 'px-3 py-1.5 text-[11px]' : 'px-2.5 py-0.5 text-[10px]'}`
              : `bg-gray-100 text-gray-400 ${isMd ? 'px-2.5 py-1 text-[10px]' : 'px-2 py-0.5 text-[9px]'}`;

            return (
              <div key={phase.id} className="flex items-center">
                {connector}
                <div
                  title={phase.title}
                  className={`inline-flex items-center gap-1 rounded-full font-semibold whitespace-nowrap shrink-0 ${pillCls}`}
                >
                  {isDone && <Check size={isMd ? 9 : 7} strokeWidth={3} />}
                  {!isDone && (
                    <MaterialIcon
                      name={phase.icon}
                      size={isMd ? 12 : 10}
                      className={isActive ? 'text-white' : 'text-gray-400'}
                    />
                  )}
                  <span>{isMd ? phase.title : phase.title.slice(0, 6)}</span>
                  {phase.requiresClientAction && !isDone && (
                    <MaterialIcon
                      name="person"
                      size={isMd ? 10 : 8}
                      className={isActive ? 'text-white/70' : 'text-gray-300'}
                    />
                  )}
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white/80 shrink-0 animate-pulse" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
