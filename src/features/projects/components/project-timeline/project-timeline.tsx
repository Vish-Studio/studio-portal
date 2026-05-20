import { useState, useEffect, useRef } from 'react';
import { Check, ChevronDown, ChevronUp, Eye, Pencil, Plus, Trash2, UserRound } from '@/src/shared/components/material-icon/material-lucide-icons';
import { MaterialIcon } from '@/src/shared/components';
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

  const defaultId = phases.find(p => p.status === 'active')?.id ?? phases[0]?.id ?? null;
  const [selectedId, setSelectedId] = useState<string | null>(defaultId);

  useEffect(() => {
    if (!phases.find(p => p.id === selectedId)) {
      setSelectedId(phases.find(p => p.status === 'active')?.id ?? phases[0]?.id ?? null);
    }
  }, [phases, selectedId]);

  const selectedPhase = phases.find(p => p.id === selectedId) ?? null;
  const selectedIndex = selectedPhase ? phases.indexOf(selectedPhase) : -1;
  const selectedAssignment = selectedPhase ? getPhaseAssignment(project.id, selectedPhase.id) : undefined;

  // ── Empty state ───────────────────────────────────────────────────────────

  if (phases.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
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

  // ── Two-panel layout ──────────────────────────────────────────────────────

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4 items-start">

      {/* ── LEFT: Timeline list ── */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <MaterialIcon name="route" size={15} className="text-gray-400" />
            <h2 className="text-sm font-bold text-gray-900">Timeline</h2>
          </div>
          <button
            type="button"
            onClick={() => onAddPhase(phases.length - 1)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Plus size={11} /> Add
          </button>
        </div>

        {/* Progress */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-900 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[11px] font-bold tabular-nums text-gray-500 shrink-0">
              {doneCount}/{phases.length}
            </span>
          </div>
          <p className="text-[10px] text-gray-400">{progress}% complete</p>
        </div>

        {/* Phase list */}
        <div className="relative px-2 pb-2">
          {/* Spine line */}
          {phases.length > 1 && (
            <div className="absolute left-5.5 top-4 bottom-10 w-px bg-gray-200 pointer-events-none" />
          )}

          <div className="space-y-0.5">
            {phases.map((phase, i) => {
              const isActive = phase.status === 'active';
              const isDone = phase.status === 'done';
              const isSelected = phase.id === selectedId;

              return (
                <button
                  key={phase.id}
                  type="button"
                  onClick={() => setSelectedId(phase.id)}
                  className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-gray-900 shadow-sm'
                      : isActive
                        ? 'hover:bg-amber-50'
                        : 'hover:bg-gray-50'
                  }`}
                >
                  {/* Icon circle (doubles as status indicator) */}
                  <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    isSelected
                      ? 'bg-white text-gray-900'
                      : isDone
                        ? 'bg-gray-900 text-white'
                        : isActive
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 text-gray-500'
                  }`}>
                    {isDone
                      ? <Check size={13} strokeWidth={2.5} />
                      : <MaterialIcon name={phase.icon} size={14} />
                    }
                  </div>

                  {/* Phase label */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold tabular-nums shrink-0 ${
                        isSelected ? 'text-gray-400' : 'text-gray-400'
                      }`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className={`text-xs font-bold truncate ${
                        isSelected
                          ? 'text-white'
                          : isDone
                            ? 'text-gray-500'
                            : isActive
                              ? 'text-gray-900'
                              : 'text-gray-700'
                      }`}>
                        {phase.title}
                      </span>
                    </div>
                    {phase.phaseAmount != null && (
                      <p className={`text-[10px] font-semibold mt-0.5 ml-5 ${
                        isSelected ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        ${phase.phaseAmount.toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* Active pip */}
                  {isActive && !isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Add inline */}
          <button
            type="button"
            onClick={() => onAddPhase(phases.length - 1)}
            className="mt-1 w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Plus size={12} />
            Add phase
          </button>
        </div>
      </div>

      {/* ── RIGHT: Phase detail ── */}
      {selectedPhase ? (
        <PhaseDetailCard
          phase={selectedPhase}
          phaseIndex={selectedIndex}
          totalPhases={phases.length}
          project={project}
          assignment={selectedAssignment}
          onEditPhase={onEditPhase}
          onUpdatePhase={onUpdatePhase}
          onAssignTemplate={onAssignTemplate}
          onOpenDocument={onOpenDocument}
          onViewDocument={onViewDocument}
          onCompletePhase={id => {
            onCompletePhase(id);
            const next = phases.find((p, idx) => idx > selectedIndex && p.status === 'pending');
            if (next) setSelectedId(next.id);
          }}
          onSetActivePhase={onSetActivePhase}
          onMovePhase={onMovePhase}
          onDeletePhase={id => {
            onDeletePhase(id);
            setSelectedId(phases.find(p => p.id !== id)?.id ?? null);
          }}
          onOpenDiscovery={onOpenDiscovery}
          discoveryStatus={discoveryStatus}
        />
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex items-center justify-center min-h-48">
          <p className="text-sm font-medium text-gray-400">Select a phase to view details</p>
        </div>
      )}
    </div>
  );
}
