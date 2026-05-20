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
  /** Called when the user wants to open the Discovery Brief for this project */
  onOpenDiscovery?: () => void;
  /** Status of the discovery brief ('not_started' | 'draft' | 'submitted') */
  discoveryStatus?: string;
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
  onOpenDiscovery,
  discoveryStatus,
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
  onOpenDiscovery?: () => void;
  discoveryStatus?: string;
}) {
  const isActive    = phase.status === 'active';
  const isDone      = phase.status === 'done';
  const isDiscovery = /discovery|brief/i.test(phase.title);
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

        {/* Discovery Brief prompt (only on Discovery/Brief phase) */}
        {isDiscovery && onOpenDiscovery && (
          <div>
            <SectionLabel>Discovery Brief</SectionLabel>
            <button
              type="button"
              onClick={onOpenDiscovery}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                discoveryStatus === 'submitted'
                  ? 'border-green-200 bg-green-50 hover:bg-green-100'
                  : discoveryStatus === 'draft'
                    ? 'border-amber-200 bg-amber-50 hover:bg-amber-100'
                    : 'border-dashed border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <MaterialIcon
                  name={discoveryStatus === 'submitted' ? 'check_circle' : discoveryStatus === 'draft' ? 'draft' : 'edit_note'}
                  size={16}
                  className={
                    discoveryStatus === 'submitted' ? 'text-green-600 shrink-0' :
                    discoveryStatus === 'draft'     ? 'text-amber-600 shrink-0' :
                                                     'text-gray-400 shrink-0'
                  }
                />
                <div className="min-w-0">
                  <p className={`text-xs font-bold ${
                    discoveryStatus === 'submitted' ? 'text-green-800' :
                    discoveryStatus === 'draft'     ? 'text-amber-800' :
                                                     'text-gray-700'
                  }`}>
                    {discoveryStatus === 'submitted' ? 'Brief submitted' :
                     discoveryStatus === 'draft'     ? 'Draft in progress' :
                                                      'Fill discovery brief'}
                  </p>
                  <p className={`text-[10px] mt-0.5 ${
                    discoveryStatus === 'submitted' ? 'text-green-600' :
                    discoveryStatus === 'draft'     ? 'text-amber-600' :
                                                     'text-gray-400'
                  }`}>
                    {discoveryStatus === 'submitted' ? 'Click to review' :
                     discoveryStatus === 'draft'     ? 'Click to continue editing' :
                                                      'Collect project requirements'}
                  </p>
                </div>
              </div>
              <MaterialIcon name="arrow_forward" size={14} className="text-gray-400 shrink-0" />
            </button>
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
  onUpdatePhase,
  onAssignTemplate,
  onOpenDocument,
  onViewDocument,
  onCompletePhase,
  onSetActivePhase,
  onMovePhase,
  onDeletePhase,
  onCreateDefaultPhase,
  onOpenDiscovery,
  discoveryStatus,
}: ProjectTimelineProps) {
  const phases = project.phases;
  const doneCount = phases.filter(p => p.status === 'done').length;
  const progress = getPhaseProgress(phases);
  const activePhase = phases.find(p => p.status === 'active') ?? phases.find(p => p.status === 'pending') ?? phases[phases.length - 1];
  const activeIndex = activePhase ? phases.indexOf(activePhase) : -1;
  const activeAssignment = activePhase ? getPhaseAssignment(project.id, activePhase.id) : undefined;
  const activeTemplate = activeAssignment ? TEMPLATES.find(t => t.slug === activeAssignment.templateSlug) : null;
  const needsClientInput = Boolean(activePhase?.requiresClientAction && !activePhase.clientCompleted);
  const needsAdminInput = Boolean(activePhase && !activeAssignment && !/discovery|brief/i.test(activePhase.title));
  const allDone = phases.length > 0 && doneCount === phases.length;

  const statusConfig = {
    pending: { label: 'Pending', icon: 'radio_button_unchecked', dot: 'bg-gray-300', badge: 'bg-gray-100 text-gray-600', node: 'bg-gray-100 text-gray-500' },
    active: { label: 'Active', icon: 'play_arrow', dot: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700', node: 'bg-amber-500 text-white' },
    done: { label: 'Done', icon: 'check', dot: 'bg-green-500', badge: 'bg-green-100 text-green-700', node: 'bg-gray-900 text-white' },
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

  // ── Timeline-only layout ──────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-3.5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
              allDone ? 'bg-green-50 text-green-700' : needsClientInput ? 'bg-violet-50 text-violet-700' : needsAdminInput ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-700'
            }`}>
              <MaterialIcon name={allDone ? 'task_alt' : needsClientInput ? 'person_alert' : needsAdminInput ? 'admin_panel_settings' : activePhase?.icon ?? 'route'} size={19} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-bold text-gray-900">Project Timeline</h2>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                  allDone ? 'bg-green-100 text-green-700' : needsClientInput ? 'bg-violet-100 text-violet-700' : needsAdminInput ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${allDone ? 'bg-green-500' : needsClientInput ? 'bg-violet-500' : needsAdminInput ? 'bg-amber-500' : 'bg-gray-400'}`} />
                  {allDone ? 'Timeline complete' : needsClientInput ? 'Client input required' : needsAdminInput ? 'Admin input required' : 'On track'}
                </span>
              </div>
              <p className="mt-1 text-xs leading-5 text-gray-500">
                {allDone
                  ? 'All project phases are complete.'
                  : activePhase
                    ? `Current phase: ${activePhase.title}${activePhase.targetDate ? ` · target ${activePhase.targetDate}` : ''}`
                    : 'No active phase selected.'}
              </p>
              {(activeAssignment && activeTemplate) || needsClientInput || needsAdminInput ? (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {activeAssignment && activeTemplate && (
                    <button
                      type="button"
                      onClick={() => onViewDocument(activeAssignment.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1.5 text-[11px] font-semibold text-gray-700 transition-colors hover:bg-gray-200"
                    >
                      <MaterialIcon name={activeTemplate.icon} size={13} />
                      {activeAssignment.documentTitle}
                    </button>
                  )}
                  {needsClientInput && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-2.5 py-1.5 text-[11px] font-semibold text-violet-700">
                      <MaterialIcon name="person" size={13} />
                      Waiting for client confirmation
                    </span>
                  )}
                  {needsAdminInput && (
                    <button
                      type="button"
                      onClick={() => onAssignTemplate(activePhase.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[11px] font-semibold text-amber-700 transition-colors hover:bg-amber-100"
                    >
                      <MaterialIcon name="note_add" size={13} />
                      Assign document
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          <div className="shrink-0 lg:min-w-60">
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <span className="text-[11px] font-bold text-gray-500">{progress}% complete</span>
              <span className="text-[11px] font-semibold text-gray-400">{doneCount}/{phases.length} phases</span>
            </div>
            <div className="h-1.5 w-full min-w-48 overflow-hidden rounded-full bg-gray-100 lg:w-60">
              <div className="h-full rounded-full bg-gray-900 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 px-4 py-2.5">
          <p className="text-xs font-semibold text-gray-500">
            {activePhase ? `Phase ${activeIndex + 1} of ${phases.length}` : 'Timeline phases'}
          </p>
          <button
            type="button"
            onClick={() => onAddPhase(phases.length - 1)}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-gray-900 px-3 text-xs font-bold text-white transition-colors hover:bg-gray-700"
          >
            <Plus size={13} />
            Add phase
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <MaterialIcon name="route" size={17} className="text-gray-400" />
            <h3 className="text-sm font-bold text-gray-900">Timeline</h3>
          </div>
          <div className="hidden items-center gap-6 pr-12 text-[10px] font-bold uppercase tracking-widest text-gray-400 lg:flex">
            <span className="w-32">Schedule</span>
            <span className="w-56">Document / Input</span>
            <span className="w-28 text-right">Action</span>
          </div>
        </div>

        <div className="px-3 py-3 md:px-4">
          <div className="relative">
            {phases.length > 1 && <div className="absolute left-[23px] top-8 bottom-8 w-px bg-gray-200" />}

            <div className="space-y-2">
              {phases.map((phase, i) => {
                const isActive = phase.status === 'active';
                const isDone = phase.status === 'done';
                const isDiscovery = /discovery|brief/i.test(phase.title);
                const assignment = getPhaseAssignment(project.id, phase.id);
                const tplMeta = assignment ? TEMPLATES.find(t => t.slug === assignment.templateSlug) : null;
                const allocated = phase.phaseAmount != null && phase.phaseAmount > 0;
                const cfg = statusConfig[phase.status];

                return (
                  <div key={phase.id} className={`relative grid gap-3 rounded-[18px] border px-3 py-3 transition-colors lg:grid-cols-[36px_minmax(220px,1fr)_140px_minmax(220px,260px)_150px] lg:items-center ${
                    isActive ? 'border-amber-200 bg-amber-50/35' : 'border-gray-100 bg-white hover:bg-gray-50'
                  }`}>
                    <div className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-xl ${cfg.node}`}>
                      {isDone ? <MaterialIcon name="check" size={16} /> : <MaterialIcon name={phase.icon} size={16} />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold tabular-nums text-gray-400">{String(i + 1).padStart(2, '0')}</span>
                        <h4 className="type-card-title truncate text-(--color-ink)">{phase.title}</h4>
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${cfg.badge}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                        {phase.requiresClientAction && (
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            phase.clientCompleted ? 'bg-green-50 text-green-700' : 'bg-violet-50 text-violet-700'
                          }`}>
                            <MaterialIcon name={phase.clientCompleted ? 'task_alt' : 'person'} size={11} />
                            {phase.clientCompleted ? 'Client completed' : 'Client input'}
                          </span>
                        )}
                      </div>

                      <p className="mt-1 truncate text-xs font-medium leading-5 text-gray-500">
                        {phase.description || (isActive ? 'Current project step' : isDone ? 'Completed step' : 'Upcoming step')}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 rounded-2xl bg-(--color-surface) p-2 lg:block lg:bg-transparent lg:p-0">
                      <div className="min-w-0">
                        <p className="type-meta text-gray-400 lg:hidden">Date</p>
                        <p className="truncate text-xs font-bold text-gray-700">
                          {phase.targetDate || 'No date'}
                        </p>
                      </div>
                      <div className="min-w-0 lg:mt-1">
                        <p className="type-meta text-gray-400 lg:hidden">Value</p>
                        <p className="truncate text-xs font-semibold text-gray-500">
                          {allocated ? `$${phase.phaseAmount?.toLocaleString()}` : 'No amount'}
                        </p>
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {isDiscovery && onOpenDiscovery ? (
                          <button
                            type="button"
                            onClick={onOpenDiscovery}
                            className={`inline-flex max-w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
                              discoveryStatus === 'submitted'
                                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                : discoveryStatus === 'draft'
                                  ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            <MaterialIcon name={discoveryStatus === 'submitted' ? 'check_circle' : discoveryStatus === 'draft' ? 'draft' : 'edit_note'} size={13} />
                            <span className="truncate">{discoveryStatus === 'submitted' ? 'View discovery brief' : discoveryStatus === 'draft' ? 'Continue discovery brief' : 'Fill discovery brief'}</span>
                          </button>
                        ) : null}

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
                    </div>

                    <div className="flex items-center justify-end gap-1.5">
                      {isActive && (
                        <button type="button" onClick={() => onCompletePhase(phase.id)} className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-gray-900 px-3 text-xs font-bold text-white transition-colors hover:bg-gray-700">
                          <MaterialIcon name="skip_next" size={14} />
                          Advance
                        </button>
                      )}
                      {!isActive && !isDone && (
                        <button type="button" onClick={() => onSetActivePhase(phase.id)} className="hidden h-9 items-center gap-1.5 rounded-xl bg-gray-100 px-3 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-200 xl:inline-flex">
                          <MaterialIcon name="play_arrow" size={14} />
                          Activate
                        </button>
                      )}
                      <RowActionsMenu
                        actions={[
                          { label: 'Edit phase', icon: <Pencil size={13} />, onClick: () => onEditPhase(phase) },
                          ...(!isActive && !isDone ? [{ label: 'Set active', icon: <MaterialIcon name="play_arrow" size={14} />, onClick: () => onSetActivePhase(phase.id) }] : []),
                          ...(assignment ? [{ label: 'Edit document', icon: <MaterialIcon name="edit_document" size={14} />, onClick: () => onOpenDocument(assignment.id) }] : [{ label: 'Assign document', icon: <MaterialIcon name="note_add" size={14} />, onClick: () => onAssignTemplate(phase.id) }]),
                          ...(i > 0 ? [{ label: 'Move up', icon: <ChevronUp size={14} />, onClick: () => onMovePhase(phase.id, 'up') }] : []),
                          ...(i < phases.length - 1 ? [{ label: 'Move down', icon: <ChevronDown size={14} />, onClick: () => onMovePhase(phase.id, 'down') }] : []),
                          { label: 'Delete phase', icon: <Trash2 size={13} />, onClick: () => onDeletePhase(phase.id), variant: 'danger' as const },
                        ]}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
