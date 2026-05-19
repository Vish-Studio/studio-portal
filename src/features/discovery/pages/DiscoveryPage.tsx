import { useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Check, ChevronRight, FileText, Lock, Pencil, Send } from 'lucide-react';
import DashboardLayout from '@/src/layouts/DashboardLayout';
import { useProjectsStore } from '@/src/features/projects';
import { useAuthStore } from '@/src/features/auth';
import { useDiscoveryStore } from '../stores/discoveryStore';
import { getDiscoverySections } from '../questions';
import type { AnswerValue, DiscoveryQuestion, DiscoverySection } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isStaff(role?: string): boolean {
  return role === 'admin' || role === 'superadmin' || role === 'freelancer';
}

function canEdit(role?: string, status?: string): boolean {
  if (role === 'superadmin') return true;
  if (status === 'submitted') return false;
  return isStaff(role) || role === 'client';
}

// ─── Individual question renderers ────────────────────────────────────────────

function QuestionField({
  question,
  value,
  onChange,
  readOnly,
  allAnswers,
}: {
  question: DiscoveryQuestion;
  value: AnswerValue | undefined;
  onChange: (id: string, val: AnswerValue) => void;
  readOnly: boolean;
  allAnswers: Record<string, AnswerValue>;
}) {
  // Conditional visibility
  if (question.showWhen) {
    const depVal = allAnswers[question.showWhen.questionId];
    if (Array.isArray(question.showWhen.value)) {
      if (!Array.isArray(depVal) || !question.showWhen.value.some(v => depVal.includes(v as string))) return null;
    } else if (depVal !== question.showWhen.value) return null;
  }

  const strVal   = typeof value === 'string' ? value : '';
  const boolVal  = typeof value === 'boolean' ? value : false;
  const arrayVal = Array.isArray(value) ? value : [];

  const inputBase =
    'w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed';

  return (
    <div className="space-y-2">
      <div>
        <label className="text-sm font-semibold text-gray-800">
          {question.label}
          {question.required && <span className="ml-1 text-red-500">*</span>}
        </label>
        {question.description && (
          <p className="mt-0.5 text-xs text-gray-500">{question.description}</p>
        )}
      </div>

      {/* ── Text ── */}
      {question.type === 'text' && (
        <input
          type="text"
          value={strVal}
          placeholder={question.placeholder}
          disabled={readOnly}
          onChange={e => onChange(question.id, e.target.value)}
          className={inputBase}
        />
      )}

      {/* ── Textarea ── */}
      {question.type === 'textarea' && (
        <textarea
          value={strVal}
          placeholder={question.placeholder}
          disabled={readOnly}
          rows={3}
          onChange={e => onChange(question.id, e.target.value)}
          className={`${inputBase} resize-none`}
        />
      )}

      {/* ── Select ── */}
      {question.type === 'select' && (
        <select
          value={strVal}
          disabled={readOnly}
          onChange={e => onChange(question.id, e.target.value)}
          className={`${inputBase} cursor-pointer`}
        >
          <option value="">Select an option…</option>
          {question.options?.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}

      {/* ── Boolean (Yes / No toggle) ── */}
      {question.type === 'boolean' && (
        <div className="flex gap-2">
          {(['Yes', 'No'] as const).map(label => {
            const isYes = label === 'Yes';
            const active = boolVal === isYes;
            return (
              <button
                key={label}
                type="button"
                disabled={readOnly}
                onClick={() => !readOnly && onChange(question.id, isYes)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  active
                    ? isYes
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-800'
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {active && <Check size={12} className="inline mr-1.5" />}
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Radio ── */}
      {question.type === 'radio' && (
        <div className="flex flex-col gap-2">
          {question.options?.map(opt => {
            const active = strVal === opt;
            return (
              <button
                key={opt}
                type="button"
                disabled={readOnly}
                onClick={() => !readOnly && onChange(question.id, opt)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all ${
                  active
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  active ? 'border-white' : 'border-gray-300'
                }`}>
                  {active && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Checkbox (multi-select) ── */}
      {question.type === 'checkbox' && (
        <div className="flex flex-wrap gap-2">
          {question.options?.map(opt => {
            const active = arrayVal.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                disabled={readOnly}
                onClick={() => {
                  if (readOnly) return;
                  const next = active ? arrayVal.filter(v => v !== opt) : [...arrayVal, opt];
                  onChange(question.id, next);
                }}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
                  active
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900'
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {active && <Check size={10} strokeWidth={3} />}
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Section panel ────────────────────────────────────────────────────────────

function SectionPanel({
  section,
  answers,
  onChange,
  readOnly,
}: {
  section: DiscoverySection;
  answers: Record<string, AnswerValue>;
  onChange: (id: string, val: AnswerValue) => void;
  readOnly: boolean;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Section header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/60">
        <div className="w-9 h-9 rounded-xl bg-gray-900 text-white flex items-center justify-center shrink-0">
          <span className="material-symbols-rounded text-[18px]">{section.icon}</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">{section.title}</h3>
          {section.description && (
            <p className="text-xs text-gray-500 mt-0.5">{section.description}</p>
          )}
        </div>
      </div>

      {/* Questions */}
      <div className="px-6 py-5 space-y-6">
        {section.questions.map(q => (
          <QuestionField
            key={q.id}
            question={q}
            value={answers[q.id]}
            onChange={onChange}
            readOnly={readOnly}
            allAnswers={answers}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Sidebar nav ──────────────────────────────────────────────────────────────

function SectionNav({
  sections,
  answers,
  activeId,
  onSelect,
}: {
  sections: DiscoverySection[];
  answers: Record<string, AnswerValue>;
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const filledCount = (section: DiscoverySection) =>
    section.questions.filter(q => {
      const v = answers[q.id];
      if (v === undefined || v === '') return false;
      if (Array.isArray(v)) return v.length > 0;
      return true;
    }).length;

  return (
    <nav className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden sticky top-6">
      <div className="px-4 py-3.5 border-b border-gray-100">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sections</p>
      </div>
      <div className="p-2">
        {sections.map((section, i) => {
          const filled = filledCount(section);
          const total  = section.questions.length;
          const done   = filled === total && total > 0;
          const isActive = section.id === activeId;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => {
                onSelect(section.id);
                document.getElementById(`section-${section.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span className={`text-[11px] font-bold tabular-nums shrink-0 ${isActive ? 'text-gray-400' : 'text-gray-400'}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className={`text-xs font-semibold flex-1 truncate ${isActive ? 'text-white' : ''}`}>
                {section.title}
              </span>
              {done
                ? <Check size={13} className={isActive ? 'text-green-400 shrink-0' : 'text-green-500 shrink-0'} strokeWidth={2.5} />
                : filled > 0
                  ? <span className={`text-[10px] font-bold shrink-0 ${isActive ? 'text-gray-300' : 'text-gray-400'}`}>{filled}/{total}</span>
                  : <ChevronRight size={13} className={`shrink-0 ${isActive ? 'text-gray-400' : 'text-gray-300'}`} />
              }
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressHeader({
  answers,
  sections,
  status,
}: {
  answers: Record<string, AnswerValue>;
  sections: DiscoverySection[];
  status: string;
}) {
  const total   = sections.reduce((n, s) => n + s.questions.length, 0);
  const filled  = sections.reduce((n, s) =>
    n + s.questions.filter(q => {
      const v = answers[q.id];
      if (v === undefined || v === '') return false;
      if (Array.isArray(v)) return v.length > 0;
      return true;
    }).length, 0);
  const pct = total > 0 ? Math.round((filled / total) * 100) : 0;

  const statusLabel: Record<string, { label: string; cls: string }> = {
    not_started: { label: 'Not started', cls: 'text-gray-400 bg-gray-100' },
    draft:       { label: 'Draft saved', cls: 'text-amber-700 bg-amber-100' },
    submitted:   { label: 'Submitted',   cls: 'text-green-700 bg-green-100' },
  };
  const badge = statusLabel[status] ?? statusLabel.not_started;

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex-1 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
          <span>{filled} of {total} questions answered</span>
          <span>{pct}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gray-900 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <span className={`text-[11px] font-bold px-3 py-1 rounded-full shrink-0 ${badge.cls}`}>
        {badge.label}
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DiscoveryPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate  = useNavigate();
  const profile   = useAuthStore(s => s.profile);
  const { projects } = useProjectsStore();
  const { getDiscovery, saveDiscovery } = useDiscoveryStore();

  const project   = projects.find(p => p.id === projectId);
  const discovery = projectId ? getDiscovery(projectId) : undefined;

  const sections  = project ? getDiscoverySections(project.service) : [];

  const [answers, setAnswers] = useState<Record<string, AnswerValue>>(
    discovery?.answers ?? {},
  );
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  const currentStatus = discovery?.status ?? 'not_started';
  const userRole      = profile?.role;
  const userId        = profile?.uid ?? 'unknown';
  const editable      = canEdit(userRole, currentStatus);

  const handleChange = useCallback((questionId: string, val: AnswerValue) => {
    setAnswers(prev => ({ ...prev, [questionId]: val }));
    setSaved(false);
  }, []);

  const handleSave = async (status: 'draft' | 'submitted') => {
    if (!projectId || !project) return;
    setSaving(true);
    saveDiscovery({
      projectId,
      serviceType: project.service,
      answers,
      status,
      userId,
    });
    setSaving(false);
    setSaved(true);
    if (status === 'submitted') {
      setTimeout(() => navigate(`/admin/projects/${projectId}`), 800);
    } else {
      setTimeout(() => setSaved(false), 2500);
    }
  };

  if (!project) {
    return (
      <DashboardLayout title="Discovery Brief">
        <div className="flex items-center justify-center py-24">
          <p className="text-gray-400 font-medium">Project not found.</p>
        </div>
      </DashboardLayout>
    );
  }

  const topbarActions = (
    <div className="flex items-center gap-2 text-sm text-gray-400">
      <Link to="/admin/projects" className="hover:text-gray-700 transition-colors">Projects</Link>
      <span>/</span>
      <Link to={`/admin/projects/${projectId}`} className="hover:text-gray-700 transition-colors truncate max-w-36">
        {project.name}
      </Link>
      <span>/</span>
      <span className="text-gray-700 font-semibold">Discovery Brief</span>
    </div>
  );

  return (
    <DashboardLayout title="" hideSearch topbarActions={topbarActions}>
      <div className="max-w-5xl mx-auto pb-20">

        {/* ── Page header ── */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(`/admin/projects/${projectId}`)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-gray-800 hover:border-gray-400 transition-colors shrink-0"
            >
              <ArrowLeft size={15} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Discovery Brief</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                {project.name} · <span className="capitalize">{project.service.replace('-', ' ')}</span>
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {!editable && currentStatus === 'submitted' && userRole !== 'superadmin' && (
              <div className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-100 rounded-xl">
                <Lock size={12} />
                Submitted — read only
              </div>
            )}

            {editable && (
              <>
                <button
                  type="button"
                  onClick={() => handleSave('draft')}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-60"
                >
                  <FileText size={14} />
                  {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save draft'}
                </button>
                <button
                  type="button"
                  onClick={() => handleSave('submitted')}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold bg-gray-900 text-white hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-60"
                >
                  <Send size={14} />
                  {currentStatus === 'submitted' ? 'Update & close' : 'Submit brief'}
                </button>
              </>
            )}

            {!editable && userRole === 'superadmin' && (
              <button
                type="button"
                onClick={() => {/* superadmin override — editable already true */}}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <Pencil size={14} />
                Edit (superadmin)
              </button>
            )}
          </div>
        </div>

        {/* Progress */}
        <ProgressHeader answers={answers} sections={sections} status={currentStatus} />

        {/* ── Two-column layout: nav + sections ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 items-start">

          {/* Sidebar nav */}
          <div className="hidden lg:block">
            <SectionNav
              sections={sections}
              answers={answers}
              activeId={activeSectionId}
              onSelect={setActiveSectionId}
            />
          </div>

          {/* Section list */}
          <div className="space-y-6">
            {/* Locked banner */}
            {!editable && (
              <div className="flex items-center gap-3 px-5 py-3.5 bg-amber-50 border border-amber-200 rounded-2xl">
                <Lock size={15} className="text-amber-600 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">Brief submitted — read only</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    {userRole === 'client'
                      ? 'This brief has been submitted. Contact your project manager to request changes.'
                      : 'Only a superadmin can edit a submitted brief.'}
                  </p>
                </div>
              </div>
            )}

            {sections.map(section => (
              <div key={section.id} id={`section-${section.id}`}>
                <SectionPanel
                  section={section}
                  answers={answers}
                  onChange={handleChange}
                  readOnly={!editable}
                />
              </div>
            ))}

            {/* Footer actions on mobile */}
            {editable && (
              <div className="flex gap-3 pt-2 lg:hidden">
                <button
                  type="button"
                  onClick={() => handleSave('draft')}
                  className="flex-1 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Save draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSave('submitted')}
                  className="flex-1 py-3 text-sm font-bold bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-colors"
                >
                  Submit brief
                </button>
              </div>
            )}

            {/* Submission info */}
            {discovery?.submittedAt && (
              <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-100 rounded-xl text-xs text-green-700">
                <Check size={13} strokeWidth={2.5} />
                <span>
                  Submitted on {new Date(discovery.submittedAt).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
