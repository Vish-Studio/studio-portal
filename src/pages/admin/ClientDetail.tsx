import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { ArrowLeft, Mail, Phone, Building2, Check, Briefcase } from 'lucide-react';
import Layout from '../../components/layout/layout';
import FormSidebar, { FormSidebarFooter } from '../../components/form-sidebar/form-sidebar';
import FormField, { inputCls, selectCls } from '../../components/form-field/form-field';
import MaterialIcon from '../../components/ui/material-icon';
import { ClientStatusBadge, ProjectStatusBadge } from '../../components/status-badge/status-badge';
import { useClientsStore } from '../../store/clients';
import type { ClientStatus } from '../../store/clients';
import { DEMO_PROJECTS, STAGE_META, ALL_STAGES } from '../../data/projects';
import type { ClientProject } from '../../data/projects';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClientFormValues {
  displayName: string;
  companyName: string;
  email: string;
  phone: string;
  status: ClientStatus;
}

// ─── Timeline stepper ────────────────────────────────────────────────────────

function ProjectTimeline({ project }: { project: ClientProject }) {
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
          className={`flex-1 h-0.5 mt-[18px] shrink min-w-0 ${prevDone && isDone ? 'bg-black' : 'bg-gray-200'}`}
        />,
      );
    }

    elements.push(
      <div key={stage.key} className="flex flex-col items-center gap-2 shrink-0">
        <div
          className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all
            ${isDone    ? 'bg-black border-black text-white'
            : isCurrent ? 'bg-(--color-accent-lime) border-(--color-accent-lime) text-(--color-ink)'
            :             'bg-white border-gray-200 text-gray-300'}`}
        >
          {isDone
            ? <Check size={14} strokeWidth={3} />
            : <MaterialIcon name={meta.icon} size={16} className={isCurrent ? 'text-(--color-ink)' : 'text-gray-300'} />
          }
        </div>
        <span className={`text-[10px] font-semibold text-center leading-tight w-12 ${
          isDone ? 'text-gray-600' : isCurrent ? 'text-gray-900 font-bold' : 'text-gray-300'
        }`}>
          {meta.shortLabel}
        </span>
      </div>,
    );
  });

  return (
    <div className="flex items-start w-full overflow-x-auto pb-1 no-scrollbar">
      {elements}
    </div>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────

function ProjectCard({ project }: { project: ClientProject }) {
  const currentStage   = project.stages.find(s => s.status === 'current');
  const currentMeta    = currentStage ? STAGE_META[currentStage.key] : null;
  const completedCount = project.stages.filter(s => s.status === 'completed').length;
  const remaining      = project.agreedPayment - project.paidPayment;
  const progress       = Math.round((completedCount / ALL_STAGES.length) * 100);

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-[24px] overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-(--color-surface) flex items-center justify-center shrink-0">
            <Briefcase size={18} className="text-gray-500" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-gray-900 truncate">{project.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Started {format(project.startedAt, 'MMM d, yyyy')} &middot; {project.timeline}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {currentMeta && project.status !== 'completed' && (
            <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-semibold text-gray-500 bg-(--color-surface) px-2.5 py-1 rounded-full">
              <MaterialIcon name={currentMeta.icon} size={12} />
              {currentMeta.label}
            </span>
          )}
          <ProjectStatusBadge status={project.status} />
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-6 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Progress — {completedCount} of {ALL_STAGES.length} stages
          </span>
          <span className="text-[10px] font-semibold text-gray-400">{progress}%</span>
        </div>
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-black rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Timeline */}
      <div className="px-6 py-5 border-t border-gray-100 mt-2">
        <ProjectTimeline project={project} />
      </div>

      {/* Financials */}
      <div className="px-6 pb-6 grid grid-cols-3 gap-4">
        <div className="bg-(--color-surface) rounded-[16px] p-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Agreed</p>
          <p className="text-lg font-bold text-(--color-ink)">${project.agreedPayment.toLocaleString()}</p>
        </div>
        <div className="bg-(--color-surface) rounded-[16px] p-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Paid</p>
          <p className="text-lg font-bold text-green-600">${project.paidPayment.toLocaleString()}</p>
        </div>
        <div className={`rounded-[16px] p-4 ${remaining > 0 ? 'bg-amber-50' : 'bg-green-50'}`}>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Remaining</p>
          <p className={`text-lg font-bold ${remaining > 0 ? 'text-amber-700' : 'text-green-600'}`}>
            {remaining > 0 ? `$${remaining.toLocaleString()}` : 'Paid in full'}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Summary card ─────────────────────────────────────────────────────────────

function SummaryCard({ variant = 'white', children, className = '' }: {
  variant?: 'lime' | 'dark' | 'surface' | 'white';
  children: React.ReactNode;
  className?: string;
}) {
  const bg: Record<string, string> = {
    lime:    'bg-(--color-accent-lime)',
    dark:    'bg-(--color-ink)',
    surface: 'bg-(--color-surface-alt)',
    white:   'bg-white border border-gray-100 shadow-sm',
  };
  return <div className={`${bg[variant]} rounded-[24px] p-6 flex flex-col gap-3 ${className}`}>{children}</div>;
}

// ─── Client Detail Page ───────────────────────────────────────────────────────

export default function ClientDetail() {
  // Route param is `:id` — not `:clientId`
  const { id } = useParams<{ id: string }>();
  const { clients, updateClient } = useClientsStore();
  const client = clients.find(c => c.id === id);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ClientFormValues>();

  const openEdit = () => {
    if (!client) return;
    reset({
      displayName: client.displayName,
      companyName: client.companyName ?? '',
      email:       client.email,
      phone:       client.phone ?? '',
      status:      client.status,
    });
    setSidebarOpen(true);
  };

  const onSubmit = (data: ClientFormValues) => {
    if (!client) return;
    updateClient(client.id, data);
    setSidebarOpen(false);
  };

  // ── Not found ──
  if (!client) {
    return (
      <Layout title="Client">
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-12 h-12 rounded-full bg-(--color-surface) flex items-center justify-center">
            <Briefcase size={20} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">Client not found.</p>
          <Link to="/admin/clients" className="text-sm font-semibold text-gray-900 underline underline-offset-4">
            Back to Clients
          </Link>
        </div>
      </Layout>
    );
  }

  const projects      = DEMO_PROJECTS.filter(p => p.clientId === id);
  const activeCount   = projects.filter(p => p.status === 'active').length;
  const totalAgreed   = projects.reduce((s, p) => s + p.agreedPayment, 0);
  const totalPaid     = projects.reduce((s, p) => s + p.paidPayment, 0);
  const totalRemaining = totalAgreed - totalPaid;

  return (
    <Layout>
      <div className="max-w-[1100px] mx-auto space-y-6 pb-12">

        {/* ── Header ── */}
        <div className="flex items-center gap-4 flex-wrap">
          <Link
            to="/admin/clients"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-400 transition-colors shrink-0"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900 truncate">{client.displayName}</h1>
              {client.companyName && (
                <span className="text-sm text-gray-400 font-medium">{client.companyName}</span>
              )}
              <ClientStatusBadge status={client.status} />
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Client since {client.createdAt?.toDate ? format(client.createdAt.toDate(), 'MMM d, yyyy') : '—'}
            </p>
          </div>
          <button
            onClick={openEdit}
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 px-4 py-2 rounded-xl hover:border-gray-400 transition-colors shrink-0"
          >
            <MaterialIcon name="edit" size={15} />
            Edit
          </button>
        </div>

        {/* ── Summary cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

          {/* Projects — lime */}
          <SummaryCard variant="lime">
            <div className="flex items-center gap-2 text-gray-700">
              <Briefcase size={15} />
              <p className="text-[11px] font-bold uppercase tracking-widest">Projects</p>
            </div>
            <p className="text-[38px] font-extrabold text-(--color-ink) leading-none">{projects.length}</p>
            <div className="flex items-center gap-2 mt-auto">
              <span className="text-[12px] font-bold text-gray-900 bg-white/60 px-2 py-0.5 rounded-[6px]">
                {activeCount} active
              </span>
              <span className="text-sm font-medium text-gray-700">
                {projects.length - activeCount} done / paused
              </span>
            </div>
          </SummaryCard>

          {/* Financials — surface */}
          <SummaryCard variant="surface">
            <div className="flex items-center gap-2 text-gray-600">
              <MaterialIcon name="payments" size={15} />
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Total Value</p>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-[38px] font-extrabold text-(--color-ink) leading-none">
                ${(totalAgreed / 1000).toFixed(0)}k
              </p>
              <span className="text-sm font-medium text-gray-500">agreed</span>
            </div>
            <div className="flex items-center gap-2 mt-auto">
              <span className="text-[12px] font-bold text-gray-900 bg-white px-2 py-0.5 rounded-[6px]">
                ${totalPaid.toLocaleString()} paid
              </span>
              <span className="text-sm font-medium text-gray-500">
                ${totalRemaining.toLocaleString()} left
              </span>
            </div>
          </SummaryCard>

          {/* Contact — dark */}
          <SummaryCard variant="dark">
            <div className="flex items-center gap-2 text-gray-400">
              <Mail size={15} />
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Contact</p>
            </div>
            <div className="space-y-2 mt-1">
              <div className="flex items-center gap-2">
                <Mail size={13} className="text-gray-500 shrink-0" />
                <span className="text-sm font-medium text-gray-300 truncate">{client.email}</span>
              </div>
              {client.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={13} className="text-gray-500 shrink-0" />
                  <span className="text-sm font-medium text-gray-300">{client.phone}</span>
                </div>
              )}
              {client.companyName && (
                <div className="flex items-center gap-2">
                  <Building2 size={13} className="text-gray-500 shrink-0" />
                  <span className="text-sm font-medium text-gray-300 truncate">{client.companyName}</span>
                </div>
              )}
            </div>
          </SummaryCard>

        </div>

        {/* ── Projects ── */}
        {projects.length === 0 ? (
          <div className="bg-white border border-gray-100 shadow-sm rounded-[24px] p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-(--color-surface) flex items-center justify-center mx-auto mb-4">
              <Briefcase size={20} className="text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-900">No projects yet</p>
            <p className="text-xs text-gray-400 mt-1">Projects for this client will appear here.</p>
          </div>
        ) : (
          <div className="space-y-5">
            <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Projects ({projects.length})
            </h2>
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

      </div>

      {/* ── Edit Sidebar ── */}
      <FormSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title="Edit Client"
        description={`Editing ${client.displayName}`}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

            <FormField label="Full Name" required error={errors.displayName?.message}>
              <input {...register('displayName', { required: 'Name is required' })} className={inputCls(!!errors.displayName)} />
            </FormField>

            <FormField label="Company Name" error={errors.companyName?.message}>
              <input {...register('companyName')} className={inputCls(!!errors.companyName)} />
            </FormField>

            <FormField label="Email Address" required error={errors.email?.message}>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                })}
                type="email"
                className={inputCls(!!errors.email)}
              />
            </FormField>

            <FormField label="Phone Number" error={errors.phone?.message}>
              <input
                {...register('phone', {
                  pattern: { value: /^[+\d\s\-()+.]{7,20}$/, message: 'Enter a valid phone number' },
                })}
                type="tel"
                className={inputCls(!!errors.phone)}
              />
            </FormField>

            <FormField label="Status" required error={errors.status?.message}>
              <select {...register('status', { required: true })} className={selectCls(!!errors.status)}>
                <option value="active">Active — recurring client</option>
                <option value="inactive">Inactive — no longer active</option>
                <option value="lost">Lost — churned</option>
              </select>
            </FormField>

          </div>

          <FormSidebarFooter>
            <button type="button" onClick={() => setSidebarOpen(false)}
              className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-black hover:bg-gray-800 rounded-xl transition-colors disabled:opacity-50">
              Save Changes
            </button>
          </FormSidebarFooter>
        </form>
      </FormSidebar>
    </Layout>
  );
}
