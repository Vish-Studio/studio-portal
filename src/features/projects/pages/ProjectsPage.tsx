import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Briefcase, CheckCircle, TrendingUp, Layers, Pencil, Trash2 } from '@/src/shared/components/material-icon/material-lucide-icons';
import DashboardLayout from '@/src/layouts/DashboardLayout';
import Fab from '@/src/shared/components/button-fab/button-fab';
import StatCard from '@/src/shared/components/stat-card/stat-card';
import TableTab, { type TabItem } from '@/src/shared/components/table-tab/table-tab';
import FormSidebar, { FormSidebarActions, FormSidebarError, getFormErrorMessage } from '@/src/shared/components/form-sidebar/form-sidebar';
import { Button, ConfirmDialog, FormField, Option, Select, TextInput } from '@/src/shared/components';
import ProjectCard, { ProjectCardMini } from '../components/project-card/project-card';
import { ClientPicker } from '@/src/features/clients';
import { MemberPicker } from '@/src/shared/components';
import { useProjectsStore, makeNewProject, canCreateProject } from '../stores/projectStore';
import { useTeamStore } from '@/src/features/team';
import { useClientsStore } from '@/src/features/clients';
import { SERVICE_META, getPhaseProgress, type ClientProject, type ServiceType, type PackageType } from '../types';
import { useUIStore } from '@/src/app/stores/uiStore';
import { FEEDBACK_MESSAGES } from '@/src/app/messages';
import { useAuthStore } from '@/src/features/auth';
import { runOperationWithFeedback } from '@/src/lib/operation-feedback';
import { firebaseErrorMessage } from '@/src/lib/firebase-errors';

interface ProjectFormValues {
  name: string;
  service: ServiceType;
  package: PackageType | '';
  status: 'active' | 'paused' | 'completed';
  timeline: string;
}

type SortKey = 'updated' | 'name';

const sameStringSet = (left: string[] = [], right: string[] = []) => (
  left.length === right.length && left.every(value => right.includes(value))
);

const Projects = () => {
  const { searchQuery, showToast } = useUIStore();
  const { projects, loading, error, addProject, updateProject, removeProject } = useProjectsStore();
  const profile = useAuthStore(state => state.profile);
  const { members } = useTeamStore();
  const { clients } = useClientsStore();

  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [sortKey, setSortKey] = useState<SortKey>('updated');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ClientProject | null>(null);
  const [confirmProject, setConfirmProject] = useState<ClientProject | null>(null);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, watch, reset, formState: { errors, isDirty, isSubmitting } } =
    useForm<ProjectFormValues>({
      defaultValues: { name: '', service: 'website', package: 'essentials', status: 'active', timeline: '' },
    });

  const watchedService = watch('service');
  const hasPackages = watchedService === 'website' || watchedService === 'software';
  const canCreate = canCreateProject(profile?.role);
  const canManage = profile?.role === 'superadmin' || profile?.role === 'admin';
  const hasProjectFormChanges = isDirty || (
    editingProject
      ? selectedClientId !== editingProject.clientId || !sameStringSet(selectedMemberIds, editingProject.assignedMemberIds ?? [])
      : Boolean(selectedClientId || selectedMemberIds.length)
  );

  const tabCounts = useMemo(() => ({
    all: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    paused: projects.filter(p => p.status === 'paused').length,
    completed: projects.filter(p => p.status === 'completed').length,
  }), [projects]);

  const tabs: TabItem[] = [
    { key: 'all', label: 'All', count: tabCounts.all },
    { key: 'active', label: 'Active', count: tabCounts.active },
    { key: 'paused', label: 'Paused', count: tabCounts.paused },
    { key: 'completed', label: 'Completed', count: tabCounts.completed },
  ];

  const filtered = useMemo(() => {
    let list = projects;
    if (activeTab !== 'all') list = list.filter(p => p.status === activeTab);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) || p.service.toLowerCase().includes(q) || (p.package ?? '').toLowerCase().includes(q),
      );
    }
    return [...list].sort((a, b) => {
      const result = sortKey === 'name'
        ? a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
        : a.startedAt - b.startedAt;

      return sortDirection === 'asc' ? result : -result;
    });
  }, [projects, activeTab, searchQuery, sortKey, sortDirection]);

  const totalBudget = projects.reduce((s, p) => s + p.agreedPayment, 0);
  const totalPaid = projects.reduce((s, p) => s + p.paidPayment, 0);
  const avgProgress = projects.length
    ? Math.round(projects.reduce((s, p) => s + getPhaseProgress(p.phases), 0) / projects.length)
    : 0;

  const openAdd = () => {
    if (!canCreate) {
      showToast({
        status: 'error',
        title: FEEDBACK_MESSAGES.sidebar.projectCreateFailed,
        message: FEEDBACK_MESSAGES.sidebar.projectCreateNotAllowed,
      });
      return;
    }
    setEditingProject(null);
    reset({ name: '', service: 'website', package: 'essentials', status: 'active', timeline: '' });
    setSelectedClientId('');
    setSelectedMemberIds([]);
    setSubmitError(null);
    setSidebarOpen(true);
  };

  const openEdit = (project: ClientProject) => {
    setEditingProject(project);
    reset({ name: project.name, service: project.service, package: project.package ?? '', status: project.status, timeline: project.timeline });
    setSelectedClientId(project.clientId);
    setSelectedMemberIds(project.assignedMemberIds ?? []);
    setSubmitError(null);
    setSidebarOpen(true);
  };

  const onSubmit = async (data: ProjectFormValues) => {
    if (!selectedClientId) {
      const message = FEEDBACK_MESSAGES.sidebar.projectClientRequired;
      setSubmitError(message);
      showToast({ status: 'error', title: FEEDBACK_MESSAGES.sidebar.projectClientRequiredTitle, message });
      return;
    }
    setSubmitError(null);
    const payload = {
      name: data.name,
      service: data.service,
      package: hasPackages && data.package ? (data.package as PackageType) : undefined,
      status: data.status,
      timeline: data.timeline,
      clientId: selectedClientId,
      assignedMemberIds: selectedMemberIds,
    };
    try {
      if (editingProject) {
        await runOperationWithFeedback({
          loadingLabel: 'Updating project',
          successTitle: FEEDBACK_MESSAGES.sidebar.projectUpdateSuccess,
          errorTitle: FEEDBACK_MESSAGES.sidebar.projectUpdateFailed,
          action: () => updateProject(editingProject.id, payload),
        });
      } else {
        await runOperationWithFeedback({
          loadingLabel: 'Creating project',
          successTitle: FEEDBACK_MESSAGES.sidebar.projectCreateSuccess,
          errorTitle: FEEDBACK_MESSAGES.sidebar.projectCreateFailed,
          action: () => addProject(makeNewProject(payload)),
        });
      }
      setSidebarOpen(false);
    } catch (error) {
      setSubmitError(firebaseErrorMessage(error));
    }
  };

  const onInvalidSubmit = (invalidErrors: unknown) => {
    setSubmitError(getFormErrorMessage(invalidErrors as Record<string, unknown>));
  };

  return (
    <DashboardLayout title="Projects">
      <div className="flex flex-col gap-5 pt-6 py-10">

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <StatCard size="sm" variant="lime" icon={<Briefcase size={16} />} label="Total Projects" value={projects.length} badge={`${tabCounts.active} active`} badgeLabel="in progress" />
          <StatCard size="sm" variant="surface" icon={<CheckCircle size={16} />} label="Completed" value={tabCounts.completed} badge={`${tabCounts.paused} paused`} badgeLabel="on hold" />
          <StatCard size="sm" variant="white" icon={<TrendingUp size={16} />} label="Total Value" value={`$${(totalBudget / 1000).toFixed(0)}k`} badge={`$${(totalPaid / 1000).toFixed(0)}k collected`} badgeLabel="to date" />
          <StatCard size="sm" variant="dark" icon={<Layers size={16} />} label="Avg. Progress" value={`${avgProgress}%`} badge={`${projects.length} projects`} badgeLabel="tracked" />
        </div>

        <div className="sticky top-0 z-20 -mx-4 flex items-center gap-3 bg-white/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <TableTab
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            sortValue={sortKey}
            sortOptions={[
              { key: 'updated', label: 'Most recent' },
              { key: 'name', label: 'Name' },
            ]}
            onSortChange={key => setSortKey(key as SortKey)}
            sortDirection={sortDirection}
            onSortDirectionChange={setSortDirection}
            actionLabel={canCreate ? 'Add Project' : undefined}
            onAction={canCreate ? openAdd : undefined}
          />
        </div>

        {error.projects && (
          <div className="rounded-[16px] border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error.projects}
          </div>
        )}

        {loading.projects && !projects.length ? (
          <div className="bg-white border border-gray-100 rounded-[18px] py-16 text-center">
            <p className="type-card-title text-gray-500">Loading projects...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-[18px] py-16 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-(--color-surface) flex items-center justify-center">
              <Briefcase size={20} className="text-gray-300" />
            </div>
            <p className="type-card-title text-gray-500">No projects found</p>
            {searchQuery && <p className="type-muted text-gray-400">No results for &ldquo;{searchQuery}&rdquo;</p>}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(p => (
              <ProjectCard key={p.id} project={p} allMembers={members} variant="surface" actions={canManage ? [
                { label: 'Edit project', icon: <Pencil size={14} />, onClick: () => openEdit(p) },
                { label: 'Delete project', icon: <Trash2 size={14} />, onClick: () => setConfirmProject(p), variant: 'danger' },
              ] : []} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="type-eyebrow hidden grid-cols-[minmax(220px,1fr)_120px_90px_110px_120px_120px_32px] items-center gap-3 px-4 text-gray-400 lg:grid">
              <span>Project</span><span className="text-right">Progress</span><span className="text-right">Budget</span><span className="text-right">Remaining</span><span /><span className="text-right">Status</span><span />
            </div>
            {filtered.map(p => (
              <ProjectCardMini key={p.id} project={p} allMembers={members} actions={canManage ? [
                { label: 'Edit project', icon: <Pencil size={14} />, onClick: () => openEdit(p) },
                { label: 'Delete project', icon: <Trash2 size={14} />, onClick: () => setConfirmProject(p), variant: 'danger' },
              ] : []} />
            ))}
          </div>
        )}

      </div>

      <FormSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} title={editingProject ? 'Edit Project' : 'New Project'} description={editingProject ? `Editing ${editingProject.name}` : 'Fill in the details to create a new project.'} width="md">
        <form onSubmit={handleSubmit(onSubmit, onInvalidSubmit)} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            <FormSidebarError
              title={editingProject ? FEEDBACK_MESSAGES.sidebar.projectUpdateFailed : FEEDBACK_MESSAGES.sidebar.projectCreateFailed}
              message={submitError}
            />

            <FormField label="Project Name" required error={errors.name?.message}>
              <TextInput {...register('name', { required: 'Project name is required' })} placeholder="e.g. Brand Refresh" hasError={!!errors.name} />
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
              <TextInput {...register('timeline')} placeholder="e.g. Q3 2026" hasError={!!errors.timeline} />
            </FormField>
            <FormField label="Client" required error={!selectedClientId && submitError ? 'Client is required' : undefined}>
              <ClientPicker
                clients={clients}
                selectedId={selectedClientId}
                onSelect={clientId => {
                  setSubmitError(null);
                  setSelectedClientId(clientId);
                }}
              />
            </FormField>
            <FormField label="Assign Team">
              <MemberPicker members={members} selectedIds={selectedMemberIds} onToggle={id => setSelectedMemberIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])} />
            </FormField>
          </div>
          <FormSidebarActions
            onCancel={() => setSidebarOpen(false)}
            isSubmitting={isSubmitting}
            isDirty={hasProjectFormChanges}
            submitLabel={editingProject ? 'Save Changes' : 'Add Project'}
          />
        </form>
      </FormSidebar>

      <ConfirmDialog isOpen={!!confirmProject} title="Delete project" message={confirmProject ? `"${confirmProject.name}" will be permanently removed. This cannot be undone.` : ''} confirmLabel="Delete" variant="danger"
        onConfirm={async () => {
          try {
            if (confirmProject) {
              await runOperationWithFeedback({
                loadingLabel: 'Deleting project',
                successTitle: FEEDBACK_MESSAGES.sidebar.projectDeleteSuccess,
                errorTitle: FEEDBACK_MESSAGES.sidebar.projectDeleteFailed,
                action: () => removeProject(confirmProject.id),
              });
            }
            setConfirmProject(null);
          } catch {
            // runOperationWithFeedback already logs and shows the toast.
          }
        }}
        onCancel={() => setConfirmProject(null)}
      />

      {canCreate && <Fab onClick={openAdd} ariaLabel="Add project" />}
    </DashboardLayout>
  );
};

export default Projects;
