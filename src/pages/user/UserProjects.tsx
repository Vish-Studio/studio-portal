import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Briefcase, CheckCircle, Layers, Trash2, Pencil, Check } from 'lucide-react';
import UserLayout from '@/src/components/user/user-layout/user-layout';
import Fab from '@/src/components/common/button-fab/button-fab';
import StatCard from '@/src/components/common/stat-card/stat-card';
import TableTab, { type TabItem } from '@/src/components/common/table-tab/table-tab';
import MaterialIcon from '@/src/components/common/material-icon/material-icon';
import FormSidebar, { FormSidebarFooter } from '@/src/components/common/form-sidebar/form-sidebar';
import FormField, { inputCls } from '@/src/components/common/form-field/form-field';
import Select from '@/src/components/common/select/select';
import Option from '@/src/components/common/select/option';
import ConfirmDialog from '@/src/components/common/confirm-dialog/confirm-dialog';
import { ProjectStatusBadge } from '@/src/components/common/status-badge/status-badge';
import { RowActionsMenu } from '@/src/components/common/table/table';
import { useProjectsStore, makeNewProject } from '@/src/store/projects';
import { useTasksStore } from '@/src/store/tasks';
import { useClientsStore } from '@/src/store/clients';
import { SERVICE_META, getProjectAccent, getPhaseProgress } from '@/src/data/projects';
import type { ClientProject, ServiceType, PackageType } from '@/src/data/projects';

const CURRENT_CLIENT_ID = 'c1';;

interface ProjectFormValues {
  name: string;
  service: ServiceType;
  package: PackageType | '';
  status: 'active' | 'paused' | 'completed';
  timeline: string;
}

// ─── UserProjectCard — grid variant ──────────────────────────────────────────

const UserProjectCard = ({
  project, taskCount, openTaskCount, onEdit, onDelete, onCompletePhase,
}: {
  project: ClientProject;
  taskCount: number;
  openTaskCount: number;
  onEdit: () => void;
  onDelete: () => void;
  onCompletePhase: (phaseId: string) => void;
}) => {
  const accent = getProjectAccent(project.service, project.package);
  const progress = getPhaseProgress(project.phases);
  const doneCount = project.phases.filter(p => p.status === 'done').length;
  const remaining = project.agreedPayment - project.paidPayment;

  // Phase that is active AND flagged for client action AND not yet confirmed
  const pendingPhase = project.phases.find(
    p => p.status === 'active' && p.requiresClientAction && !p.clientCompleted,
  );

  return (
    <div className="project-card bg-white border border-gray-200 rounded-[16px] hover:border-gray-300 transition-all duration-150 flex flex-col">
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 flex-1 min-w-0">{project.name}</h3>
          <div className="flex items-center gap-1 shrink-0 mt-0.5">
            <ProjectStatusBadge status={project.status} />
            <RowActionsMenu actions={[
              { label: 'Edit project', icon: <Pencil size={14} />, onClick: onEdit },
              { label: 'Delete project', icon: <Trash2 size={14} />, onClick: onDelete, variant: 'danger' },
            ]} />
          </div>
        </div>

        <p className="text-[11px] text-gray-400 truncate">{accent.label} · {project.timeline || 'TBD'}</p>

        <div className="mt-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-gray-400">
              {doneCount}/{project.phases.length} phases
              {openTaskCount > 0 && <span className="text-gray-300"> · {openTaskCount} task{openTaskCount !== 1 ? 's' : ''} open</span>}
            </span>
            <span className="text-[11px] font-bold text-gray-600 tabular-nums">{progress}%</span>
          </div>
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gray-700 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Client action callout */}
      {pendingPhase && (
        <div className="mx-4 mb-3 flex items-center gap-3 bg-violet-50 border border-violet-200 rounded-[12px] px-3 py-2.5">
          <MaterialIcon name="person" size={14} className="text-violet-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-violet-900 truncate">Action needed: {pendingPhase.title}</p>
            <p className="text-[10px] text-violet-500">Mark complete when done</p>
          </div>
          <button
            type="button"
            onClick={() => onCompletePhase(pendingPhase.id)}
            className="flex items-center gap-1 text-[10px] font-bold text-white bg-violet-600 hover:bg-violet-700 px-2.5 py-1.5 rounded-[8px] transition-colors shrink-0"
          >
            <Check size={10} strokeWidth={3} />
            Done
          </button>
        </div>
      )}

      <div className="px-4 py-2.5 border-t border-gray-50 flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-2 text-[11px] text-gray-400 flex-wrap">
          {project.agreedPayment > 0 && <span className="font-medium">${(project.agreedPayment / 1000).toFixed(0)}k</span>}
          {project.agreedPayment > 0 && <span className="text-gray-200">·</span>}
          <span>{project.timeline || 'TBD'}</span>
          {remaining === 0 && project.agreedPayment > 0 && (
            <><span className="text-gray-200">·</span><span className="font-semibold text-green-500">Settled</span></>
          )}
        </div>
        <span className="text-[10px] text-gray-400">{taskCount} task{taskCount !== 1 ? 's' : ''}</span>
      </div>
    </div>
  );
};

// ─── UserProjectCardMini — list-row variant ───────────────────────────────────

const UserProjectCardMini = ({
  project, onEdit, onDelete, onCompletePhase,
}: {
  project: ClientProject;
  onEdit: () => void;
  onDelete: () => void;
  onCompletePhase: (phaseId: string) => void;
}) => {
  const accent = getProjectAccent(project.service, project.package);
  const progress = getPhaseProgress(project.phases);
  const remaining = project.agreedPayment - project.paidPayment;

  const pendingPhase = project.phases.find(
    p => p.status === 'active' && p.requiresClientAction && !p.clientCompleted,
  );

  return (
    <div className="project-card-mini bg-white border border-gray-200 rounded-[12px] px-3 py-3 hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 md:px-4">
      <div className="grid items-center gap-3 md:grid-cols-[minmax(200px,1fr)_120px_90px_110px_auto_120px_32px]">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <MaterialIcon name={accent.icon} size={15} className="text-gray-400 shrink-0" />
            <p className="truncate text-sm font-semibold leading-tight text-gray-900">{project.name}</p>
          </div>
          <p className="mt-1 truncate pl-6 text-[11px] text-gray-400">{accent.label}</p>
        </div>

        <div className="flex items-center gap-2 md:justify-end">
          <div className="h-1 w-20 overflow-hidden rounded-full bg-gray-100 md:w-16">
            <div className="h-full rounded-full bg-gray-600" style={{ width: `${progress}%` }} />
          </div>
          <span className="w-8 text-right text-[11px] text-gray-400 tabular-nums">{progress}%</span>
        </div>

        <p className="hidden text-right text-sm font-semibold text-gray-700 tabular-nums md:block">
          {project.agreedPayment > 0 ? `$${(project.agreedPayment / 1000).toFixed(0)}k` : '—'}
        </p>

        <p className={`hidden text-right text-sm font-semibold tabular-nums md:block ${remaining > 0 ? 'text-gray-700' : 'text-green-600'}`}>
          {project.agreedPayment === 0 ? '—' : remaining > 0 ? `$${remaining.toLocaleString()}` : 'Settled'}
        </p>

        {/* Client action pill */}
        <div className="hidden md:flex justify-end">
          {pendingPhase ? (
            <button
              type="button"
              onClick={() => onCompletePhase(pendingPhase.id)}
              className="flex items-center gap-1.5 text-[10px] font-bold text-violet-700 bg-violet-50 border border-violet-200 hover:bg-violet-100 px-2.5 py-1 rounded-full transition-colors whitespace-nowrap"
            >
              <MaterialIcon name="person" size={10} />
              {pendingPhase.title}
            </button>
          ) : <span />}
        </div>

        <div className="flex justify-start md:justify-end">
          <ProjectStatusBadge status={project.status} />
        </div>

        <div className="absolute right-3 top-3 md:static md:flex md:justify-end">
          <RowActionsMenu actions={[
            { label: 'Edit project', icon: <Pencil size={14} />, onClick: onEdit },
            { label: 'Delete project', icon: <Trash2 size={14} />, onClick: onDelete, variant: 'danger' },
          ]} />
        </div>
      </div>
    </div>
  );
};

// ─── UserProjects page ────────────────────────────────────────────────────────

const UserProjects = () => {
  const { projects, addProject, updateProject, removeProject, completePhase } = useProjectsStore();
  const { tasks } = useTasksStore();
  const { clients } = useClientsStore();
  const currentClient = clients.find(c => c.id === CURRENT_CLIENT_ID);

  const myProjects = projects.filter(p => p.clientId === CURRENT_CLIENT_ID);

  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ClientProject | null>(null);
  const [confirmProject, setConfirmProject] = useState<ClientProject | null>(null);

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } =
    useForm<ProjectFormValues>({
      defaultValues: { name: '', service: 'website', package: 'essentials', status: 'active', timeline: '' },
    });

  const watchedService = watch('service');
  const hasPackages = watchedService === 'website' || watchedService === 'software';

  const tabCounts = useMemo(() => ({
    all: myProjects.length,
    active: myProjects.filter(p => p.status === 'active').length,
    paused: myProjects.filter(p => p.status === 'paused').length,
    completed: myProjects.filter(p => p.status === 'completed').length,
  }), [myProjects]);

  const tabs: TabItem[] = [
    { key: 'all', label: 'All', count: tabCounts.all },
    { key: 'active', label: 'Active', count: tabCounts.active },
    { key: 'paused', label: 'Paused', count: tabCounts.paused },
    { key: 'completed', label: 'Completed', count: tabCounts.completed },
  ];

  const filtered = useMemo(
    () => activeTab === 'all' ? myProjects : myProjects.filter(p => p.status === activeTab),
    [myProjects, activeTab],
  );

  const avgProgress = myProjects.length
    ? Math.round(myProjects.reduce((s, p) => s + getPhaseProgress(p.phases), 0) / myProjects.length)
    : 0;

  // Count projects that have a pending client action
  const pendingActions = myProjects.filter(p =>
    p.phases.some(ph => ph.status === 'active' && ph.requiresClientAction && !ph.clientCompleted),
  ).length;

  const openAdd = () => {
    setEditingProject(null);
    reset({ name: '', service: 'website', package: 'essentials', status: 'active', timeline: '' });
    setSidebarOpen(true);
  };

  const openEdit = (project: ClientProject) => {
    setEditingProject(project);
    reset({ name: project.name, service: project.service, package: project.package ?? '', status: project.status, timeline: project.timeline });
    setSidebarOpen(true);
  };

  const onSubmit = (data: ProjectFormValues) => {
    const payload = {
      name: data.name,
      service: data.service,
      package: hasPackages && data.package ? (data.package as PackageType) : undefined,
      status: data.status,
      timeline: data.timeline,
      clientId: CURRENT_CLIENT_ID,
    };
    if (editingProject) {
      updateProject(editingProject.id, payload);
    } else {
      addProject(makeNewProject(payload));
    }
    setSidebarOpen(false);
  };

  const getTaskCounts = (projectId: string) => {
    const pt = tasks.filter(t => t.projectId === projectId);
    return { taskCount: pt.length, openTaskCount: pt.filter(t => t.status !== 'completed').length };
  };

  return (
    <UserLayout title="My Projects">
      <div className="flex flex-col gap-5 py-10">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <StatCard variant="lime" icon={<Briefcase size={16} />} label="Total Projects" value={myProjects.length} badge={`${tabCounts.active} active`} badgeLabel="in progress" />
          <StatCard variant="surface" icon={<CheckCircle size={16} />} label="Completed" value={tabCounts.completed} badge={`${tabCounts.paused} paused`} badgeLabel="on hold" />
          <StatCard variant="dark" icon={<Layers size={16} />} label="Avg. Progress" value={`${avgProgress}%`} badge={`${myProjects.length} project${myProjects.length !== 1 ? 's' : ''}`} badgeLabel="tracked" />
        </div>

        {/* Pending actions banner */}
        {pendingActions > 0 && (
          <div className="flex items-center gap-3 px-4 py-3.5 bg-violet-50 border border-violet-200 rounded-[14px]">
            <MaterialIcon name="person" size={16} className="text-violet-500 shrink-0" />
            <p className="text-sm font-semibold text-violet-900">
              {pendingActions} project{pendingActions !== 1 ? 's' : ''} need{pendingActions === 1 ? 's' : ''} your action
            </p>
            <p className="text-[11px] text-violet-500 ml-auto">Look for the purple badge on each card</p>
          </div>
        )}

        {/* Toolbar */}
        <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 lg:-mx-8 flex items-center gap-3 bg-white/95 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <TableTab tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} className="min-w-0 flex-1 md:flex-none" />
            <div className="hidden md:flex items-center gap-0.5 bg-gray-100 rounded-xl p-1 shrink-0">
              {(['list', 'grid'] as const).map(mode => (
                <button key={mode} onClick={() => setViewMode(mode)} aria-label={`${mode} view`}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${viewMode === mode ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <MaterialIcon name={mode === 'list' ? 'view_list' : 'grid_view'} size={16} />
                </button>
              ))}
            </div>
          </div>
          <button type="button" onClick={openAdd} className="hidden sm:flex items-center gap-2 bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors shrink-0 ml-auto">
            <MaterialIcon name="add" size={20} />
            Add Project
          </button>
        </div>

        {/* Content */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-[18px] py-16 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-(--color-surface) flex items-center justify-center">
              <Briefcase size={20} className="text-gray-300" />
            </div>
            <p className="text-sm font-semibold text-gray-500">No projects found</p>
            <button onClick={openAdd} className="mt-1 text-xs font-semibold text-gray-400 hover:text-gray-700 underline transition-colors">Add your first project</button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(p => {
              const { taskCount, openTaskCount } = getTaskCounts(p.id);
              return (
                <UserProjectCard key={p.id} project={p} taskCount={taskCount} openTaskCount={openTaskCount}
                  onEdit={() => openEdit(p)} onDelete={() => setConfirmProject(p)}
                  onCompletePhase={(phaseId) => completePhase(p.id, phaseId)}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="hidden grid-cols-[minmax(200px,1fr)_120px_90px_110px_auto_120px_32px] items-center gap-3 px-4 text-[11px] font-semibold uppercase tracking-wide text-gray-400 md:grid">
              <span>Project</span>
              <span className="text-right">Progress</span>
              <span className="text-right">Budget</span>
              <span className="text-right">Remaining</span>
              <span className="text-right">Action</span>
              <span className="text-right">Status</span>
              <span />
            </div>
            {filtered.map(p => (
              <UserProjectCardMini key={p.id} project={p}
                onEdit={() => openEdit(p)} onDelete={() => setConfirmProject(p)}
                onCompletePhase={(phaseId) => completePhase(p.id, phaseId)}
              />
            ))}
          </div>
        )}

      </div>

      <FormSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} title={editingProject ? 'Edit Project' : 'New Project'} description={editingProject ? `Editing ${editingProject.name}` : `Adding a project for ${currentClient?.displayName ?? 'client'}`} width="md">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            <FormField label="Project Name" required error={errors.name?.message}>
              <input {...register('name', { required: 'Project name is required' })} placeholder="e.g. Brand Refresh" className={inputCls(!!errors.name)} />
            </FormField>
            <FormField label="Service" required error={errors.service?.message}>
              <Select {...register('service', { required: true })} hasError={!!errors.service}>
                {(Object.entries(SERVICE_META) as [ServiceType, typeof SERVICE_META[ServiceType]][]).map(([key, meta]) => (
                  <Option key={key} value={key}>{meta.label}</Option>
                ))}
              </Select>
            </FormField>
            {hasPackages && (
              <FormField label="Package" required error={errors.package?.message}>
                <Select {...register('package', { required: hasPackages })} hasError={!!errors.package}>
                  <Option value="essentials">Essentials</Option>
                  <Option value="growth">Growth</Option>
                  <Option value="premium">Premium</Option>
                </Select>
              </FormField>
            )}
            <FormField label="Status" required error={errors.status?.message}>
              <Select {...register('status', { required: true })} hasError={!!errors.status}>
                <Option value="active">Active</Option>
                <Option value="paused">Paused</Option>
                <Option value="completed">Completed</Option>
              </Select>
            </FormField>
            <FormField label="Timeline" error={errors.timeline?.message}>
              <input {...register('timeline')} placeholder="e.g. Q3 2026" className={inputCls(!!errors.timeline)} />
            </FormField>
          </div>
          <FormSidebarFooter>
            <button type="button" onClick={() => setSidebarOpen(false)} className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 text-sm font-semibold text-white bg-(--color-ink) hover:bg-gray-800 rounded-xl transition-colors disabled:opacity-50">
              {editingProject ? 'Save Changes' : 'Add Project'}
            </button>
          </FormSidebarFooter>
        </form>
      </FormSidebar>

      <Fab onClick={openAdd} ariaLabel="Add project" />

      <ConfirmDialog isOpen={!!confirmProject} title="Delete project" message={confirmProject ? `"${confirmProject.name}" will be permanently removed. This cannot be undone.` : ''} confirmLabel="Delete" variant="danger"
        onConfirm={() => { if (confirmProject) removeProject(confirmProject.id); setConfirmProject(null); }}
        onCancel={() => setConfirmProject(null)}
      />
    </UserLayout>
  );
};

export default UserProjects;
