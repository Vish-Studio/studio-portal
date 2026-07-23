import { useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Check, ChevronRight, FileText, Lock, Send } from '@/src/shared/components/material-icon/material-lucide-icons';
import DashboardLayout from '@/src/layouts/DashboardLayout';
import { Option, Select } from '@/src/shared/components';
import { useProjectsStore } from '@/src/features/projects';
import { useAuthStore } from '@/src/features/auth';
import { useDiscoveryStore } from '../stores/discoveryStore';
import { getDiscoverySections } from '../questions';
import type { AnswerValue, DiscoveryQuestion, DiscoverySection } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function canEdit(role?: string, status?: string): boolean {
  if (role === 'superadmin') return true;
  if (status === 'submitted') return false;
  return role === 'user';
}

function isFilled(v: AnswerValue | undefined): boolean {
  if (v === undefined || v === '') return false;
  if (Array.isArray(v)) return v.length > 0;
  return true;
}

function sectionFillCount(section: DiscoverySection, answers: Record<string, AnswerValue>) {
  return section.questions.filter(q => isFilled(answers[q.id])).length;
}

// ─── Question input field ─────────────────────────────────────────────────────

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
  // Conditional display
  if (question.showWhen) {
    const dep = allAnswers[question.showWhen.questionId];
    if (Array.isArray(dep)) {
      if (!dep.includes(question.showWhen.value as string)) return null;
    } else if (dep !== question.showWhen.value) return null;
  }

  const str   = typeof value === 'string' ? value : '';
  const bool  = typeof value === 'boolean' ? value : false;
  const arr   = Array.isArray(value) ? value : [];

  const inputCls =
    'w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed';

  return (
    <div className="space-y-2.5">
      {/* Label */}
      <div>
        <p className="text-sm font-semibold text-gray-800">
          {question.label}
          {question.required && <span className="ml-1 text-red-400">*</span>}
        </p>
        {question.description && (
          <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">{question.description}</p>
        )}
      </div>

      {/* Text */}
      {question.type === 'text' && (
        <input type="text" value={str} placeholder={question.placeholder}
          disabled={readOnly} onChange={e => onChange(question.id, e.target.value)}
          className={inputCls} />
      )}

      {/* Textarea */}
      {question.type === 'textarea' && (
        <textarea value={str} placeholder={question.placeholder}
          disabled={readOnly} rows={3}
          onChange={e => onChange(question.id, e.target.value)}
          className={`${inputCls} resize-none`} />
      )}

      {/* Select */}
      {question.type === 'select' && (
        <Select value={str} disabled={readOnly}
          onChange={e => onChange(question.id, e.target.value)}
          className={`${inputCls} cursor-pointer`}>
          <Option value="">Select an option...</Option>
          {question.options?.map(opt => <Option key={opt} value={opt}>{opt}</Option>)}
        </Select>
      )}

      {/* Boolean — Yes / No */}
      {question.type === 'boolean' && (
        <div className="flex gap-2">
          {(['Yes', 'No'] as const).map(label => {
            const isYes = label === 'Yes';
            const active = bool === isYes;
            return (
              <button key={label} type="button" disabled={readOnly}
                onClick={() => !readOnly && onChange(question.id, isYes)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold border transition-all
                  ${active
                    ? isYes ? 'bg-gray-900 text-white border-gray-900' : 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}>
                {active && <Check size={12} strokeWidth={3} />}
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* Radio */}
      {question.type === 'radio' && (
        <div className="flex flex-col gap-1.5">
          {question.options?.map(opt => {
            const active = str === opt;
            return (
              <button key={opt} type="button" disabled={readOnly}
                onClick={() => !readOnly && onChange(question.id, opt)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all
                  ${active
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  active ? 'border-white' : 'border-gray-300'
                }`}>
                  {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {/* Checkbox multi-select */}
      {question.type === 'checkbox' && (
        <div className="flex flex-wrap gap-2">
          {question.options?.map(opt => {
            const active = arr.includes(opt);
            return (
              <button key={opt} type="button" disabled={readOnly}
                onClick={() => {
                  if (readOnly) return;
                  onChange(question.id, active ? arr.filter(v => v !== opt) : [...arr, opt]);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all
                  ${active
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-100 hover:border-gray-400 hover:text-gray-900'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}>
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

// ─── Section card ─────────────────────────────────────────────────────────────

function SectionCard({
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
  const filled = sectionFillCount(section, answers);
  const total  = section.questions.length;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      {/* Header — matches CardContent header style */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50">
        <div className="w-8 h-8 rounded-xl bg-(--color-ink) text-white flex items-center justify-center shrink-0">
          <span className="material-symbols-rounded text-[16px]">{section.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-gray-900">{section.title}</h3>
          {section.description && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">{section.description}</p>
          )}
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 ${
          filled === total && total > 0
            ? 'bg-green-100 text-green-700'
            : filled > 0
              ? 'bg-amber-100 text-amber-700'
              : 'bg-gray-100 text-gray-400'
        }`}>
          {filled}/{total}
        </span>
      </div>

      {/* Questions */}
      <div className="px-5 py-5 space-y-6">
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

// ─── Desktop sidebar nav ──────────────────────────────────────────────────────

function SidebarNav({
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
  return (
    <nav className="bg-white border border-gray-100 rounded-2xl overflow-hidden sticky top-4 max-h-[calc(100vh-5rem)] overflow-y-auto">
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sections</p>
      </div>
      <div className="p-1.5">
        {sections.map((section, i) => {
          const filled   = sectionFillCount(section, answers);
          const total    = section.questions.length;
          const done     = filled === total && total > 0;
          const isActive = section.id === activeId;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => {
                onSelect(section.id);
                document.getElementById(`section-${section.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors ${
                isActive ? 'bg-gray-900' : 'hover:bg-gray-50'
              }`}
            >
              <span className="text-[10px] font-bold tabular-nums shrink-0 text-gray-400">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className={`text-xs font-semibold flex-1 truncate ${isActive ? 'text-white' : 'text-gray-700'}`}>
                {section.title}
              </span>
              {done
                ? <Check size={12} className={isActive ? 'text-green-400 shrink-0' : 'text-green-500 shrink-0'} strokeWidth={2.5} />
                : filled > 0
                  ? <span className={`text-[10px] font-bold shrink-0 ${isActive ? 'text-gray-400' : 'text-gray-400'}`}>{filled}/{total}</span>
                  : <ChevronRight size={12} className={`shrink-0 ${isActive ? 'text-gray-500' : 'text-gray-300'}`} />
              }
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ─── Mobile section tab strip ─────────────────────────────────────────────────

function MobileSectionStrip({
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
  return (
    <div className="lg:hidden bg-white border border-gray-100 rounded-2xl px-3 py-3">
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {sections.map((section, i) => {
          const filled   = sectionFillCount(section, answers);
          const total    = section.questions.length;
          const done     = filled === total && total > 0;
          const partial  = filled > 0 && !done;
          const isActive = section.id === activeId;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => {
                onSelect(section.id);
                document.getElementById(`section-${section.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`flex items-center gap-1.5 shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : done
                    ? 'bg-green-50 text-green-700 border border-green-100'
                    : partial
                      ? 'bg-amber-50 text-amber-700 border border-amber-100'
                      : 'bg-gray-50 text-gray-600 border border-gray-100 hover:border-gray-300'
              }`}
            >
              {done && !isActive
                ? <Check size={10} strokeWidth={3} />
                : <span className="font-bold">{i + 1}</span>
              }
              <span className="hidden sm:inline max-w-24 truncate">{section.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Progress strip ───────────────────────────────────────────────────────────

function ProgressStrip({
  answers,
  sections,
  status,
}: {
  answers: Record<string, AnswerValue>;
  sections: DiscoverySection[];
  status: string;
}) {
  const total  = sections.reduce((n, s) => n + s.questions.length, 0);
  const filled = sections.reduce((n, s) => n + sectionFillCount(s, answers), 0);
  const pct    = total > 0 ? Math.round((filled / total) * 100) : 0;

  const STATUS_CFG: Record<string, { label: string; cls: string }> = {
    not_started: { label: 'Not started', cls: 'text-gray-500 bg-gray-100' },
    draft:       { label: 'Draft',       cls: 'text-amber-700 bg-amber-100' },
    submitted:   { label: 'Submitted',   cls: 'text-green-700 bg-green-100' },
  };
  const badge = STATUS_CFG[status] ?? STATUS_CFG.not_started;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4">
      <div className="flex items-center justify-between gap-4 mb-2.5">
        <p className="text-xs font-semibold text-gray-500">
          {filled} of {total} answered
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-700 tabular-nums">{pct}%</span>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${badge.cls}`}>
            {badge.label}
          </span>
        </div>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-900 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DiscoveryPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate          = useNavigate();
  const profile           = useAuthStore(s => s.profile);
  const { projects }      = useProjectsStore();
  const { getDiscovery, saveDiscovery } = useDiscoveryStore();

  const project   = projects.find(p => p.id === projectId);
  const discovery = projectId ? getDiscovery(projectId) : undefined;
  const sections  = project ? getDiscoverySections(project.service) : [];

  const [answers, setAnswers]           = useState<Record<string, AnswerValue>>(discovery?.answers ?? {});
  const [activeSectionId, setActive]    = useState(sections[0]?.id ?? '');
  const [saving, setSaving]             = useState(false);
  const [saved, setSaved]               = useState(false);

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
    saveDiscovery({ projectId, serviceType: project.service, answers, status, userId });
    setSaving(false);
    setSaved(true);
    if (status === 'submitted') {
      setTimeout(() => navigate(`/admin/projects/${projectId}`), 700);
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
    <div className="hidden sm:flex items-center gap-1.5 text-sm text-gray-400">
      <Link to="/admin/projects" className="hover:text-gray-700 transition-colors">Projects</Link>
      <span>/</span>
      <Link to={`/admin/projects/${projectId}`} className="hover:text-gray-700 transition-colors truncate max-w-28">
        {project.name}
      </Link>
      <span>/</span>
      <span className="text-gray-700 font-semibold">Discovery Brief</span>
    </div>
  );

  return (
    <DashboardLayout title="" hideSearch topbarActions={topbarActions}>
      <div className="pb-20 space-y-4">

        {/* ── Page header ── */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          {/* Back + title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => navigate(`/admin/projects/${projectId}`)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-gray-800 hover:border-gray-400 transition-colors shrink-0"
            >
              <ArrowLeft size={15} />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Discovery Brief</h1>
              <p className="text-xs text-gray-500 truncate">
                {project.name} · <span className="capitalize">{project.service.replace('-', ' ')}</span>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {!editable && (
              <div className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-100 rounded-xl">
                <Lock size={12} />
                <span className="hidden sm:inline">Submitted — read only</span>
                <span className="sm:hidden">Read only</span>
              </div>
            )}
            {editable && (
              <>
                <button
                  type="button"
                  onClick={() => handleSave('draft')}
                  disabled={saving}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-xl transition-colors disabled:opacity-60"
                >
                  <FileText size={13} />
                  {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save draft'}
                </button>
                <button
                  type="button"
                  onClick={() => handleSave('submitted')}
                  disabled={saving}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold bg-gray-900 text-white hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-60"
                >
                  <Send size={13} />
                  {currentStatus === 'submitted' ? 'Update' : 'Submit brief'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Progress */}
        <ProgressStrip answers={answers} sections={sections} status={currentStatus} />

        {/* Mobile section strip */}
        <MobileSectionStrip
          sections={sections}
          answers={answers}
          activeId={activeSectionId}
          onSelect={setActive}
        />

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4 items-start">

          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <SidebarNav
              sections={sections}
              answers={answers}
              activeId={activeSectionId}
              onSelect={setActive}
            />
          </div>

          {/* Section cards */}
          <div className="space-y-4">

            {/* Locked banner */}
            {!editable && (
              <div className="flex items-start gap-3 px-5 py-4 bg-amber-50 border border-amber-100 rounded-2xl">
                <Lock size={15} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">Brief submitted — read only</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    {userRole === 'user'
                      ? 'Contact your project manager to request changes.'
                      : 'Only a superadmin can edit a submitted brief.'}
                  </p>
                </div>
              </div>
            )}

            {sections.map(section => (
              <div key={section.id} id={`section-${section.id}`} className="scroll-mt-4">
                <SectionCard
                  section={section}
                  answers={answers}
                  onChange={handleChange}
                  readOnly={!editable}
                />
              </div>
            ))}

            {/* Mobile footer actions */}
            {editable && (
              <div className="flex gap-3 pt-1 lg:hidden">
                <button
                  type="button"
                  onClick={() => handleSave('draft')}
                  className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <FileText size={14} />
                  Save draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSave('submitted')}
                  className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-colors"
                >
                  <Send size={14} />
                  Submit brief
                </button>
              </div>
            )}

            {/* Submission info */}
            {discovery?.submittedAt && (
              <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-100 rounded-xl">
                <Check size={13} strokeWidth={2.5} className="text-green-600 shrink-0" />
                <span className="text-xs font-medium text-green-700">
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
