import { useState, useEffect, useRef } from 'react';
import { Check, ChevronDown, ChevronUp, Eye, Pencil, Plus, Trash2, UserRound } from '@/src/shared/components/material-icon/material-lucide-icons';
import { MaterialIcon, RowActionsMenu } from '@/src/shared/components';
import { DEFAULT_PHASE_DEFS, getPhaseProgress, type ClientProject, type Phase } from '../../types';
import { TEMPLATES, type TemplateAssignment } from '@/src/features/templates';

interface ProjectTimelineProps {
  project: ClientProject;
  getPhaseAssignment: (projectId: string, phaseId: string) => TemplateAssignment | undefined;
  onAddPhase: (afterIndex: number) => void;
  onEditPhase: (phase: Phase) => void;
  onUpdatePhase: (phaseId: string, updates: Partial<Phase>) => void;
  onAssignTemplate: (phaseId: string) => void;
  onOpenDocument: (assignmentId: string) => void;
  onViewDocument: (assignmentId: string) => void;
  onCompletePhase: (phaseId: string) => void;
  onSetActivePhase: (phaseId: string) => void;
  onMovePhase: (phaseId: string, direction: 'up' | 'down') => void;
  onDeletePhase: (phaseId: string) => void;
  onCreateDefaultPhase: (phase: Phase, afterIndex: number) => void;
}

// ─── Inline amount editor ─────────────────────────────────────────────────────

function PhaseAmountInput({
  value,
  total,
  onChange,
}: {
  value?: number;
  total: number;
  onChange: (amount: number | undefined) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const commit = () => {
    const n = parseFloat(draft.replace(/,/g, ''));
    onChange(isNaN(n) || draft.trim() === '' ? undefined : Math.max(0, n));
    setEditing(false);
  };

  const pct = total > 0 && value != null ? Math.round((value / total) * 100) : null;

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 flex-1 bg-white border-2 border-gray-900 rounded-xl px-3 py-2.5">
          <span className="text-sm font-bold text-gray-400">$</span>
          <input
            ref={inputRef}
            type="number"
            min="0"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={e => {
              if (e.key === 'Enter') commit();
              if (e.key === 'Escape') setEditing(false);
            }}
            className="flex-1 text-sm font-bold text-gray-900 bg-transparent outline-none min-w-0"
            placeholder="0.00"
            autoFocus
          />
        </div>
        <button
          type="button"
          onMouseDown={e => { e.preventDefault(); commit(); }}
          className="px-4 py-2.5 text-xs font-bold bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-colors shrink-0"
        >
          Save
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => { setDraft(value != null ? String(value) : ''); setEditing(true); }}
      className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-300 hover:bg-white transition-all text-left group"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-gray-400">$</span>
        {value != null ? (
          <span className="text-sm font-bold text-gray-900">
            {value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
          </span>
        ) : (
          <span className="text-sm text-gray-400">Click to set amount</span>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {pct != null && (
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{pct}%</span>
        )}
        <Pencil size={12} className="text-gray-300 group-hover:text-gray-600 transition-colors" />
      </div>
    </button>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">{children}</p>
  );
}

// ─── Phase detail card ────────────────────────────────────────────────────────

function PhaseDetailCard({
  phase,
  phaseIndex,
  totalPhases,
  project,
  assignment,
  onEditPhase,
  onUpdatePhase,
  onAssignTemplate,
  onOpenDocument,
  onViewDocument,
  onCompletePhase,
  onSetActivePhase,
  onMovePhase,
  onDeletePhase,
}: {
  phase: Phase;
  phaseIndex: number;
  totalPhases: number;
  project: ClientProject;
  assignment?: TemplateAssignment;
  onEditPhase: (p: Phase) => void;
  onUpdatePhase: (id: string, u: Partial<Phase>) => void;
  onAssignTemplate: (id: string) => void;
  onOpenDocument: (id: string) => void;
  onViewDocument: (id: string) => void;
  onCompletePhase: (id: string) => void;
  onSetActivePhase: (id: string) => void;
  onMovePhase: (id: string, dir: 'up' | 'down') => void;
  onDeletePhase: (id: string) => void;
}) {
  const isActive    = phase.status === 'active';
  const isDone      = phase.status === 'done';
  const tplMeta     = assignment ? TEMPLATES.find(t => t.slug === assignment.templateSlug) : null;
  const allocated = project.phases.reduce((s, p) => s + (p.phaseAmount ?? 0), 0);

  const iconBg = isDone
    ? 'bg-gray-900 text-white'
    : isActive
      ? 'bg-amber-500 text-white'
      : 'bg-gray-100 text-gray-500';

  const statusBadge = isDone
    ? 'bg-green-100 text-green-700'
    : isActive
      ? 'bg-amber-100 text-amber-700'
      : 'bg-gray-100 text-gray-600';

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col h-full">
      {/* Card header */}
      <div className={`px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3 rounded-t-2xl ${isActive ? 'bg-amber-50' : ''}`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
            {isDone
              ? <Check size={18} strokeWidth={2.5} />
              : <MaterialIcon name={phase.icon} size={20} />
            }
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-gray-900 truncate">{phase.title}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBadge}`}>
                {phase.status.charAt(0).toUpperCase() + phase.status.slice(1)}
              </span>
              {phase.requiresClientAction && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-violet-600">
                  <UserRound size={9} /> Client action
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onEditPhase(phase)}
          title="Edit phase details"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-colors shrink-0"
        >
          <Pencil size={14} />
        </button>
      </div>

      {/* Card body */}
      <div className="flex-1 flex flex-col gap-5 px-5 py-5">

        {/* Meta: date + description */}
        {(phase.targetDate || phase.description) && (
          <div className="space-y-1.5">
            {phase.targetDate && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <MaterialIcon name="schedule" size={13} className="text-gray-400 shrink-0" />
                <span className="font-medium">{phase.targetDate}</span>
              </div>
            )}
            {phase.description && (
              <p className="text-xs text-gray-600 leading-relaxed">{phase.description}</p>
            )}
          </div>
        )}

        {/* Document */}
        <div>
          <SectionLabel>Document</SectionLabel>
          {assignment && tplMeta ? (
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
              <MaterialIcon name={tplMeta.icon} size={15} className="text-gray-500 shrink-0" />
              <span className="text-xs font-semibold text-gray-800 flex-1 truncate">{assignment.documentTitle}</span>
              <button
                type="button"
                title="View"
                onClick={() => onViewDocument(assignment.id)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors"
              >
                <Eye size={13} />
              </button>
              <button
                type="button"
                title="Edit"
                onClick={() => onOpenDocument(assignment.id)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors"
              >
                <Pencil size={12} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onAssignTemplate(phase.id)}
              className="w-full flex items-center gap-2 px-3 py-3 border-2 border-dashed border-gray-200 rounded-xl text-xs font-semibold text-gray-500 hover:border-gray-400 hover:text-gray-800 hover:bg-gray-50 transition-all"
            >
              <Plus size={13} />
              Assign document
            </button>
          )}
        </div>

        {/* Phase payment */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <SectionLabel>Phase Payment</SectionLabel>
            {allocated > 0 && (
              <span className="text-[10px] font-semibold text-gray-500 mb-2">
                ${allocated.toLocaleString()} / ${project.agreedPayment.toLocaleString()} total
              </span>
            )}
          </div>
          <PhaseAmountInput
            value={phase.phaseAmount}
            total={project.agreedPayment}
            onChange={amount => onUpdatePhase(phase.id, { phaseAmount: amount })}
          />
        </div>
      </div>

      {/* Card footer — actions + reorder */}
      <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between gap-3">
        {/* Reorder / delete */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            title="Move up"
            disabled={phaseIndex === 0}
            onClick={() => onMovePhase(phase.id, 'up')}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-800 hover:bg-gray-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronUp size={15} />
          </button>
          <button
            type="button"
            title="Move down"
            disabled={phaseIndex === totalPhases - 1}
            onClick={() => onMovePhase(phase.id, 'down')}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-800 hover:bg-gray-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronDown size={15} />
          </button>
          <div className="w-px h-4 bg-gray-200 mx-1" />
          <button
            type="button"
            title="Delete phase"
            onClick={() => onDeletePhase(phase.id)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>

        {/* Primary actions */}
        <div className="flex items-center gap-2">
          {!isActive && !isDone && (
            <button
              type="button"
              onClick={() => onSetActivePhase(phase.id)}
              className="px-3 py-1.5 text-xs font-bold text-gray-700 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Set active
            </button>
          )}
          {isActive && (
            <button
              type="button"
              onClick={() => onCompletePhase(phase.id)}
              className="px-4 py-2 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Complete & advance
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProjectTimeline({
  project,
  getPhaseAssignment,
  onAddPhase,
  onEditPhase,
  onAssignTemplate,
  onOpenDocument,
  onViewDocument,
  onCompletePhase,
  onSetActivePhase,
  onMovePhase,
  onDeletePhase,
  onCreateDefaultPhase,
}: ProjectTimelineProps) {
  const phases = project.phases;
  const doneCount = phases.filter(p => p.status === 'done').length;
  const progress = getPhaseProgress(phases);

  const statusConfig = {
    pending: { label: 'Pending', dot: 'bg-gray-300', badge: 'bg-gray-100 text-gray-600', bar: 'bg-gray-200' },
    active: { label: 'Active', dot: 'bg-(--color-accent-lime)', badge: 'bg-(--color-accent-lime) text-(--color-ink)', bar: 'bg-(--color-accent-lime)' },
    done: { label: 'Done', dot: 'bg-gray-900', badge: 'bg-gray-900 text-white', bar: 'bg-gray-900' },
  } as const;

  // ── Empty state ───────────────────────────────────────────────────────────

  if (phases.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <MaterialIcon name="route" size={16} className="text-gray-400" />
            <h2 className="text-sm font-bold text-gray-900">Timeline</h2>
          </div>
          <button
            type="button"
            onClick={() => onAddPhase(-1)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Plus size={12} /> Add phase
          </button>
        </div>
        <div className="py-14 flex flex-col items-center gap-4 text-center px-6">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
            <MaterialIcon name="checklist" size={22} className="text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-700">No phases yet</p>
            <p className="text-xs text-gray-500 mt-1">Add a phase or start from a default template.</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mt-1">
            {DEFAULT_PHASE_DEFS.map((def, i) => (
              <button
                key={def.title}
                type="button"
                onClick={() => onCreateDefaultPhase({
                  id: `ph_${Date.now()}_${i}`,
                  title: def.title,
                  icon: def.icon,
                  status: i === 0 ? 'active' : 'pending',
                  requiresClientAction: false,
                  clientCompleted: false,
                }, i - 1)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-colors"
              >
                <MaterialIcon name={def.icon} size={11} />
                {def.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Timeline layout ───────────────────────────────────────────────────────

  return (
    <div className="overflow-hidden rounded-[18px] border border-gray-200/80 bg-white shadow-[0_18px_50px_var(--color-shadow-subtle)]">
      <div className="flex flex-col gap-4 px-4 py-4 md:px-5 md:py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-[10px] bg-(--color-surface-alt) text-(--color-ink)">
              <MaterialIcon name="route" size={15} />
            </span>
            <h2 className="type-panel-title text-(--color-ink)">Project Timeline</h2>
          </div>
          <p className="mt-1 text-xs font-semibold text-gray-500">
            {doneCount}/{phases.length} steps complete · {progress}% delivery progress
          </p>
        </div>
        <button
          type="button"
          onClick={() => onAddPhase(phases.length - 1)}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-gray-900 px-4 text-xs font-bold text-white transition-colors hover:bg-gray-700"
        >
          <Plus size={13} />
          Add step
        </button>
      </div>

      <div className="mx-4 border-b border-gray-100 md:mx-5" />

      <div className="p-4 md:p-5">
        <div className="rounded-[18px] bg-(--color-surface-alt) p-4">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="type-label text-gray-400">Delivery path</p>
              <p className="mt-1 text-lg font-bold text-(--color-ink)">{project.timeline || 'Timeline not set'}</p>
            </div>
            <div className="min-w-[180px]">
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <span className="text-[11px] font-bold text-gray-500">{progress}% complete</span>
                <span className="text-[11px] font-semibold text-gray-400">{phases.length} steps</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white">
                <div className="h-full rounded-full bg-gray-900 transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
            {phases.slice(0, 6).map((phase, index) => {
              const isActive = phase.status === 'active';
              const cfg = statusConfig[phase.status];

              return (
                <button
                  key={phase.id}
                  type="button"
                  onClick={() => onEditPhase(phase)}
                  className="min-w-0 rounded-[14px] bg-white p-3 text-left transition-colors hover:bg-gray-50"
                >
                  <div className={`h-2 rounded-full ${cfg.bar}`} />
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold tabular-nums text-gray-400">{String(index + 1).padStart(2, '0')}</span>
                    <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                    <span className={`truncate text-[11px] font-bold ${isActive ? 'text-(--color-ink)' : 'text-gray-500'}`}>
                      {phase.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100 border-t border-gray-100">
        {phases.map((phase, i) => {
          const isActive = phase.status === 'active';
          const isDone = phase.status === 'done';
          const assignment = getPhaseAssignment(project.id, phase.id);
          const tplMeta = assignment ? TEMPLATES.find(t => t.slug === assignment.templateSlug) : null;
          const allocated = phase.phaseAmount != null && phase.phaseAmount > 0;
          const cfg = statusConfig[phase.status];

          return (
            <div key={phase.id} className={`grid gap-3 px-4 py-3.5 md:px-5 xl:grid-cols-[minmax(260px,1fr)_minmax(150px,190px)_minmax(170px,260px)_auto] xl:items-center ${
              isActive ? 'bg-(--color-accent-lime)/10' : 'bg-white'
            }`}>
              <div className="grid min-w-0 grid-cols-[36px_minmax(0,1fr)] gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${isDone ? 'bg-gray-900 text-white' : isActive ? 'bg-(--color-accent-lime) text-(--color-ink)' : 'bg-gray-100 text-gray-500'}`}>
                  {isDone ? <MaterialIcon name="check" size={16} /> : <MaterialIcon name={phase.icon} size={16} />}
                </div>
                <div className="min-w-0">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold tabular-nums text-gray-400">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="truncate text-sm font-bold text-gray-900">{phase.title}</h3>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${cfg.badge}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                  </div>
                  <p className="mt-1 truncate text-xs font-medium text-gray-500">
                    {phase.description || (isActive ? 'Current step' : isDone ? 'Completed step' : 'Upcoming step')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 rounded-xl bg-(--color-surface-alt) p-2 xl:bg-transparent xl:p-0">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</p>
                  <p className="mt-1 truncate text-xs font-bold text-gray-700">{phase.targetDate || 'No date'}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Value</p>
                  <p className="mt-1 truncate text-xs font-bold text-gray-700">{allocated ? `$${phase.phaseAmount?.toLocaleString()}` : 'No amount'}</p>
                </div>
              </div>

              <div className="min-w-0">
                {assignment && tplMeta ? (
                  <button
                    type="button"
                    onClick={() => onViewDocument(assignment.id)}
                    className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1.5 text-[11px] font-semibold text-gray-700 transition-colors hover:bg-gray-200"
                  >
                    <MaterialIcon name={tplMeta.icon} size={13} />
                    <span className="truncate">{assignment.documentTitle}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onAssignTemplate(phase.id)}
                    className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-2.5 py-1.5 text-[11px] font-semibold text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-800"
                  >
                    <MaterialIcon name="note_add" size={13} />
                    <span className="truncate">Assign document</span>
                  </button>
                )}
              </div>

              <div className="flex items-center justify-end gap-1.5">
                {isActive && (
                  <button type="button" onClick={() => onCompletePhase(phase.id)} className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-(--color-accent-lime) px-3 text-xs font-bold text-(--color-ink) transition-colors hover:bg-(--color-accent-lime)">
                    <MaterialIcon name="skip_next" size={14} />
                    Advance
                  </button>
                )}
                {!isActive && !isDone && (
                  <button type="button" onClick={() => onSetActivePhase(phase.id)} className="hidden h-9 items-center gap-1.5 rounded-xl bg-gray-100 px-3 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-200 2xl:inline-flex">
                    <MaterialIcon name="play_arrow" size={14} />
                    Activate
                  </button>
                )}
                <RowActionsMenu
                  actions={[
                    { label: 'Edit step', icon: <Pencil size={13} />, onClick: () => onEditPhase(phase) },
                    ...(!isActive && !isDone ? [{ label: 'Set active', icon: <MaterialIcon name="play_arrow" size={14} />, onClick: () => onSetActivePhase(phase.id) }] : []),
                    ...(assignment ? [{ label: 'Edit document', icon: <MaterialIcon name="edit_document" size={14} />, onClick: () => onOpenDocument(assignment.id) }] : [{ label: 'Assign document', icon: <MaterialIcon name="note_add" size={14} />, onClick: () => onAssignTemplate(phase.id) }]),
                    ...(i > 0 ? [{ label: 'Move up', icon: <ChevronUp size={14} />, onClick: () => onMovePhase(phase.id, 'up') }] : []),
                    ...(i < phases.length - 1 ? [{ label: 'Move down', icon: <ChevronDown size={14} />, onClick: () => onMovePhase(phase.id, 'down') }] : []),
                    { label: 'Delete step', icon: <Trash2 size={13} />, onClick: () => onDeletePhase(phase.id), variant: 'danger' as const },
                  ]}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
