import { Check, Pencil, Plus, Trash2, UserRound } from 'lucide-react';
import Button from '../../common/button/button';
import CardContent from '../../common/card-content/card-content';
import MaterialIcon from '../../common/material-icon/material-icon';
import { DEFAULT_PHASE_DEFS, getPhaseProgress } from '../../../data/projects';
import { TEMPLATES } from '../../../data/templates';
import type { ClientProject, Phase, PhaseStatus } from '../../../data/projects';
import type { TemplateAssignment } from '../../../store/template-assignments';

const PHASE_STATUS_CLS: Record<PhaseStatus, string> = {
  done: 'bg-green-50 text-green-700 border-green-200',
  active: 'bg-amber-50 text-amber-700 border-amber-200',
  pending: 'bg-gray-50 text-gray-400 border-gray-200',
};

interface ProjectTimelineProps {
  project: ClientProject;
  isManaging: boolean;
  getPhaseAssignment: (projectId: string, phaseId: string) => TemplateAssignment | undefined;
  onToggleManage: () => void;
  onAddPhase: (afterIndex: number) => void;
  onEditPhase: (phase: Phase) => void;
  onAssignTemplate: (phaseId: string) => void;
  onOpenDocument: (assignmentId: string) => void;
  onCompletePhase: (phaseId: string) => void;
  onSetActivePhase: (phaseId: string) => void;
  onMovePhase: (phaseId: string, direction: 'up' | 'down') => void;
  onDeletePhase: (phaseId: string) => void;
  onCreateDefaultPhase: (phase: Phase, afterIndex: number) => void;
}

const statusLabel = (status: PhaseStatus) => status.charAt(0).toUpperCase() + status.slice(1);

export default function ProjectTimeline({
  project,
  isManaging,
  getPhaseAssignment,
  onToggleManage,
  onAddPhase,
  onEditPhase,
  onAssignTemplate,
  onOpenDocument,
  onCompletePhase,
  onSetActivePhase,
  onMovePhase,
  onDeletePhase,
  onCreateDefaultPhase,
}: ProjectTimelineProps) {
  const doneCount = project.phases.filter(p => p.status === 'done').length;
  const progress = getPhaseProgress(project.phases);

  return (
    <CardContent
      iconName="route"
      title="Timeline"
      className="project-timeline"
      action={
        <div className="project-timeline-actions flex flex-wrap items-center justify-end gap-1.5">
          <span className="hidden sm:inline text-[11px] font-semibold text-gray-400">
            {doneCount}/{project.phases.length} done · {progress}%
          </span>
          <Button type="button" variant="ghost" size="sm" iconLeft={<Plus size={13} />} onClick={() => onAddPhase(project.phases.length - 1)} className="hidden sm:flex">
            Add
          </Button>
          <Button type="button" variant={isManaging ? 'primary' : 'ghost'} size="sm" onClick={onToggleManage}>
            {isManaging ? 'Done' : 'Manage'}
          </Button>
        </div>
      }
      bodyClassName="px-4 md:px-6 py-4 md:py-5"
    >
      <div className="project-timeline-body space-y-5">
        <div className="project-timeline-mobile-actions flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 sm:hidden">
          <span className="text-[11px] font-semibold text-gray-400">{doneCount}/{project.phases.length} done · {progress}%</span>
          <Button type="button" variant="secondary" size="sm" iconLeft={<Plus size={13} />} onClick={() => onAddPhase(project.phases.length - 1)}>
            Add phase
          </Button>
        </div>

        {project.phases.length > 0 && (
          <div className="project-timeline-strip rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4">
            <div className="project-timeline-strip-list flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {project.phases.map((phase, i) => {
                const isDone = phase.status === 'done';
                const isActive = phase.status === 'active';

                return (
                  <button
                    key={phase.id}
                    type="button"
                    onClick={() => onEditPhase(phase)}
                    className={`project-timeline-chip flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-bold transition-colors ${
                      isDone
                        ? 'bg-(--color-ink) text-white'
                        : isActive
                          ? 'bg-amber-500 text-white'
                          : 'bg-white text-gray-400 border border-gray-100 hover:text-gray-700'
                    }`}
                  >
                    {isDone ? <Check size={11} strokeWidth={3} /> : <MaterialIcon name={phase.icon} size={12} />}
                    <span>{i + 1}. {phase.title}</span>
                    {phase.requiresClientAction && !isDone && <UserRound size={10} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="project-timeline-head hidden grid-cols-[minmax(260px,1fr)_minmax(220px,340px)_170px] items-center gap-3 px-2 text-[10px] font-bold uppercase tracking-widest text-gray-300 lg:grid">
          <span>Phase</span>
          <span>Document</span>
          <span className="text-right">Action</span>
        </div>

        <div className="project-timeline-list grid gap-2.5">
          {project.phases.map((phase, i) => {
            const assignment = getPhaseAssignment(project.id, phase.id);
            const tplMeta = assignment ? TEMPLATES.find(t => t.slug === assignment.templateSlug) : null;
            const isActive = phase.status === 'active';
            const isDone = phase.status === 'done';

            return (
              <div
                key={phase.id}
                className={`project-timeline-item group rounded-[14px] border bg-white transition-colors ${
                  isActive ? 'border-amber-300 bg-amber-50/30 shadow-[0_0_0_1px_rgba(251,191,36,0.18)]' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="project-timeline-item-grid grid gap-3 px-3 py-3 sm:px-4 lg:grid-cols-[minmax(260px,1fr)_minmax(220px,340px)_170px] lg:items-center">
                  <button type="button" onClick={() => onEditPhase(phase)} className="project-timeline-phase flex min-w-0 items-center gap-3 text-left">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isDone ? 'bg-(--color-ink) text-white' :
                      isActive ? 'bg-amber-50 text-amber-600' :
                      'bg-gray-50 text-gray-300'
                    }`}>
                      {isDone ? <Check size={15} strokeWidth={2.6} /> : <MaterialIcon name={phase.icon} size={15} />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-300 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                        <p className={`truncate text-sm font-bold ${isDone ? 'text-gray-500' : 'text-gray-900'}`}>{phase.title}</p>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-[6px] border ${PHASE_STATUS_CLS[phase.status]}`}>
                          {statusLabel(phase.status)}
                        </span>
                        {phase.requiresClientAction && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-violet-50 text-violet-600 border border-violet-200">
                            <UserRound size={8} /> Client input
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                          <MaterialIcon name="schedule" size={9} />
                          {phase.targetDate || 'No target date'}
                        </span>
                        {phase.description && <span className="text-[10px] text-gray-400 truncate max-w-80">{phase.description}</span>}
                      </div>
                    </div>
                  </button>

                  {assignment && tplMeta ? (
                    <button type="button" onClick={() => onOpenDocument(assignment.id)} className="flex min-w-0 items-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5 text-left hover:bg-gray-100">
                      <MaterialIcon name={tplMeta.icon} size={15} className="text-gray-400 shrink-0" />
                      <span className="truncate text-xs font-bold text-gray-600">{assignment.documentTitle}</span>
                      <MaterialIcon name="edit" size={13} className="ml-auto text-gray-300 shrink-0" />
                    </button>
                  ) : (
                    <button type="button" onClick={() => onAssignTemplate(phase.id)} className="rounded-xl border border-dashed border-gray-200 px-3 py-2.5 text-left text-xs font-bold text-gray-400 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700">
                      Assign template document
                    </button>
                  )}

                  <div className="project-timeline-item-actions flex items-center justify-end gap-1.5">
                    {isActive && !isDone && (
                      <Button type="button" size="sm" onClick={() => onCompletePhase(phase.id)}>
                        Complete & advance
                      </Button>
                    )}
                    {!isActive && !isDone && !isManaging && (
                      <Button type="button" variant="secondary" size="sm" onClick={() => onSetActivePhase(phase.id)}>
                        Set active
                      </Button>
                    )}
                    {isManaging ? (
                      <>
                        <button type="button" title="Move up" disabled={i === 0} onClick={() => onMovePhase(phase.id, 'up')} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
                          <MaterialIcon name="arrow_upward" size={14} />
                        </button>
                        <button type="button" title="Move down" disabled={i === project.phases.length - 1} onClick={() => onMovePhase(phase.id, 'down')} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
                          <MaterialIcon name="arrow_downward" size={14} />
                        </button>
                        <button type="button" onClick={() => onDeletePhase(phase.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors" aria-label={`Delete ${phase.title}`}>
                          <Trash2 size={13} />
                        </button>
                      </>
                    ) : (
                      <button type="button" onClick={() => onEditPhase(phase)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-gray-700 hover:bg-gray-100" aria-label={`Edit ${phase.title}`}>
                        <Pencil size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {project.phases.length === 0 && (
            <div className="project-timeline-empty py-8 flex flex-col items-center gap-3 text-center">
              <MaterialIcon name="checklist" size={24} className="text-gray-200" />
              <p className="text-xs font-semibold text-gray-400">No phases yet. Add a phase or start with a default timeline.</p>
              <Button type="button" size="sm" onClick={() => onAddPhase(-1)}>Add phase</Button>
              <div className="flex flex-wrap gap-2 justify-center mt-1">
                {DEFAULT_PHASE_DEFS.map((def, i) => (
                  <Button
                    key={def.title}
                    type="button"
                    variant="secondary"
                    size="sm"
                    iconLeft={<MaterialIcon name={def.icon} size={11} />}
                    onClick={() => onCreateDefaultPhase({
                      id: `ph_${Date.now()}_${i}`,
                      title: def.title,
                      icon: def.icon,
                      status: i === 0 ? 'active' : 'pending',
                      requiresClientAction: false,
                      clientCompleted: false,
                    }, i - 1)}
                  >
                    {def.title}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </CardContent>
  );
}
