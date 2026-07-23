import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Briefcase, CheckCircle, Layers, Pencil, Trash2 } from '@/src/shared/components/material-icon/material-lucide-icons';
import UserLayout from '@/src/layouts/UserLayout';
import Fab from '@/src/shared/components/button-fab/button-fab';
import StatCard from '@/src/shared/components/stat-card/stat-card';
import TableTab, { type TabItem } from '@/src/shared/components/table-tab/table-tab';
import { Button, MaterialIcon, TextInput } from '@/src/shared/components';
import FormSidebar, { FormSidebarActions, FormSidebarError, getFormErrorMessage } from '@/src/shared/components/form-sidebar/form-sidebar';
import FormField from '@/src/shared/components/form-field/form-field';
import Select from '@/src/shared/components/select/select';
import Option from '@/src/shared/components/select/option';
import ConfirmDialog from '@/src/shared/components/confirm-dialog/confirm-dialog';
import { ProjectCard, ProjectCardMini } from '@/src/features/projects';
import { canCreateProject, makeNewProject, useProjectsStore } from '@/src/features/projects';
import { FEEDBACK_MESSAGES } from '@/src/app/messages';
import { useTasksStore } from '@/src/features/tasks';
import { useClientsStore } from '@/src/features/clients';
import { SERVICE_META, getPhaseProgress, type ClientProject, type ServiceType, type PackageType } from '@/src/features/projects';
import { useAuthStore } from '@/src/features/auth';
import { useUIStore } from '@/src/app/stores/uiStore';
import { runOperationWithFeedback } from '@/src/lib/operation-feedback';
import { operationErrorMessage } from '@/src/lib/operation-errors';
import { formatPricingAmount, usePricingPackagesStore } from '@/src/features/templates';

interface ProjectFormValues {
  name: string;
  service: ServiceType;
  package: PackageType | '';
  pricingPackageId: string;
  status: 'active' | 'paused' | 'completed';
  timeline: string;
  startDate: string;
  endDate: string;
  budget: number;
}

type FilterKey = 'all' | 'active' | 'paused' | 'completed';
type SortKey = 'updated' | 'name';

const getPendingClientPhase = (project: ClientProject) =>
  project.phases.find(phase => phase.status === 'active' && phase.requiresClientAction && !phase.clientCompleted);

const inferPackageType = (name: string): PackageType | undefined => {
  const value = name.toLowerCase();
  if (value.includes('premium')) return 'premium';
  if (value.includes('growth')) return 'growth';
  if (value.includes('essential') || value.includes('starter')) return 'essentials';
  return undefined;
};

export default function UserProjectsPage() {
  const { projects, loading, error, addProject, updateProject, removeProject, completePhase } = useProjectsStore();
  const profile = useAuthStore(state => state.profile);
  const showToast = useUIStore(state => state.showToast);
  const { tasks } = useTasksStore();
  const { clients } = useClientsStore();
  const pricingPackages = usePricingPackagesStore(state => state.packages);
  const currentClientId = profile?.uid ?? '';
  const currentClient = clients.find(client => client.id === currentClientId);
  const myProjects = projects.filter(project => project.clientId === currentClientId);

  const [activeTab, setActiveTab] = useState<FilterKey>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortKey, setSortKey] = useState<SortKey>('updated');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ClientProject | null>(null);
  const [confirmProject, setConfirmProject] = useState<ClientProject | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, watch, reset, formState: { errors, isDirty, isSubmitting } } =
    useForm<ProjectFormValues>({
      defaultValues: { name: '', service: 'website', package: 'essentials', status: 'active', timeline: '', startDate: new Date().toISOString().slice(0, 10), endDate: '', budget: 0 },
    });

  const watchedService = watch('service');
  const watchedPricingPackageId = watch('pricingPackageId');
  const availablePackages = useMemo(
    () => pricingPackages.filter(item => item.service === watchedService && item.kind === 'package' && item.isActive).sort((a, b) => a.price - b.price),
    [pricingPackages, watchedService],
  );
  const selectedPricingPackage = pricingPackages.find(item => item.id === watchedPricingPackageId);
  const canCreate = canCreateProject(profile?.role);

  useEffect(() => {
    if (!watchedPricingPackageId) return;
    if (watchedPricingPackageId === 'custom') {
      if (watch('package')) reset({ ...watch(), package: '' }, { keepDirty: true });
      return;
    }
    if (!selectedPricingPackage || selectedPricingPackage.service !== watchedService) {
      reset({ ...watch(), pricingPackageId: 'custom', package: '', budget: watch('budget') ?? 0 });
      return;
    }

    reset({
      ...watch(),
      pricingPackageId: selectedPricingPackage.id,
      package: inferPackageType(selectedPricingPackage.name) ?? '',
      budget: selectedPricingPackage.price,
      timeline: watch('timeline') || selectedPricingPackage.timeline || '',
    }, { keepDirty: true });
  }, [reset, selectedPricingPackage, watch, watchedPricingPackageId, watchedService]);

  const tabCounts = useMemo(() => ({
    all: myProjects.length,
    active: myProjects.filter(project => project.status === 'active').length,
    paused: myProjects.filter(project => project.status === 'paused').length,
    completed: myProjects.filter(project => project.status === 'completed').length,
  }), [myProjects]);

  const tabs: TabItem[] = [
    { key: 'all', label: 'All', count: tabCounts.all },
    { key: 'active', label: 'Active', count: tabCounts.active },
    { key: 'paused', label: 'Paused', count: tabCounts.paused },
    { key: 'completed', label: 'Completed', count: tabCounts.completed },
  ];

  const filtered = useMemo(() => {
    const list = activeTab === 'all' ? myProjects : myProjects.filter(project => project.status === activeTab);
    return [...list].sort((a, b) => {
      const result = sortKey === 'name'
        ? a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
        : a.startedAt - b.startedAt;

      return sortDirection === 'asc' ? result : -result;
    });
  }, [activeTab, myProjects, sortDirection, sortKey]);

  const avgProgress = myProjects.length
    ? Math.round(myProjects.reduce((sum, project) => sum + getPhaseProgress(project.phases), 0) / myProjects.length)
    : 0;
  const pendingActions = myProjects.filter(project => getPendingClientPhase(project)).length;

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
    setSubmitError(null);
    const firstPackage = pricingPackages.find(item => item.service === 'website' && item.isActive);
    reset({
      name: '',
      service: 'website',
      package: firstPackage ? inferPackageType(firstPackage.name) ?? '' : '',
      pricingPackageId: firstPackage?.id ?? 'custom',
      status: 'active',
      timeline: firstPackage?.timeline ?? '',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: '',
      budget: firstPackage?.price ?? 0,
    });
    setSidebarOpen(true);
  };

  const openEdit = (project: ClientProject) => {
    setEditingProject(project);
    setSubmitError(null);
    reset({
      name: project.name,
      service: project.service,
      package: project.package ?? '',
      pricingPackageId: project.pricingPackageId ?? 'custom',
      status: project.status,
      timeline: project.timeline,
      startDate: project.startDate ?? new Date(project.startedAt).toISOString().slice(0, 10),
      endDate: project.endDate ?? '',
      budget: project.agreedPayment,
    });
    setSidebarOpen(true);
  };

  const onSubmit = async (data: ProjectFormValues) => {
    if (!currentClientId) {
      const message = FEEDBACK_MESSAGES.auth.noProfile;
      setSubmitError(message);
      showToast({ status: 'error', title: FEEDBACK_MESSAGES.sidebar.projectCreateFailed, message });
      return;
    }

    setSubmitError(null);
    const payload = {
      name: data.name,
      service: data.service,
      package: data.package ? (data.package as PackageType) : undefined,
      pricingPackageId: data.pricingPackageId === 'custom' ? undefined : data.pricingPackageId,
      status: data.status,
      timeline: data.timeline,
      startDate: data.startDate,
      endDate: data.endDate || undefined,
      agreedPayment: Number(data.budget ?? 0),
      clientId: currentClientId,
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
      setSubmitError(operationErrorMessage(error));
    }
  };

  const onInvalidSubmit = (invalidErrors: unknown) => {
    setSubmitError(getFormErrorMessage(invalidErrors as Record<string, unknown>));
  };

  const clientActionFor = (project: ClientProject) => {
    const phase = getPendingClientPhase(project);
    if (!phase) return undefined;
    return {
      label: phase.title,
      description: 'Mark complete when done',
      onClick: () => completePhase(project.id, phase.id),
    };
  };

  return (
    <UserLayout title="My Projects">
      <div className="flex flex-col gap-5 py-10">
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
          <StatCard size="sm" variant="lime" icon={<Briefcase size={16} />} label="Total Projects" value={myProjects.length} badge={`${tabCounts.active} active`} badgeLabel="in progress" />
          <StatCard size="sm" variant="surface" icon={<CheckCircle size={16} />} label="Completed" value={tabCounts.completed} badge={`${tabCounts.paused} paused`} badgeLabel="on hold" />
          <StatCard size="sm" variant="dark" icon={<Layers size={16} />} label="Avg. Progress" value={`${avgProgress}%`} badge={`${myProjects.length} project${myProjects.length !== 1 ? 's' : ''}`} badgeLabel="tracked" />
        </div>

        {pendingActions > 0 && (
          <div className="flex items-center gap-3 rounded-[14px] border border-violet-200 bg-violet-50 px-4 py-3.5">
            <MaterialIcon name="person" size={16} className="shrink-0 text-violet-500" />
            <p className="text-sm font-semibold text-violet-900">
              {pendingActions} project{pendingActions !== 1 ? 's' : ''} need{pendingActions === 1 ? 's' : ''} your action
            </p>
            <p className="ml-auto hidden text-[11px] text-violet-500 sm:block">Use the action badge on each project</p>
          </div>
        )}

        <div className="sticky top-0 z-20 -mx-4 flex items-center gap-3 bg-white/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <TableTab
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={key => setActiveTab(key as FilterKey)}
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
            className="min-w-0 flex-1"
          />
        </div>

        {error.projects && (
          <div className="rounded-[16px] border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error.projects}
          </div>
        )}

        {loading.projects && !myProjects.length ? (
          <div className="flex flex-col items-center gap-3 rounded-[18px] border border-gray-100 bg-white py-16 text-center">
            <p className="text-sm font-semibold text-gray-500">Loading projects...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-[18px] border border-gray-100 bg-white py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--color-surface)">
              <Briefcase size={20} className="text-gray-300" />
            </div>
            <p className="text-sm font-semibold text-gray-500">No projects found</p>
            {canCreate && <Button type="button" variant="ghost" size="sm" onClick={openAdd} className="mt-1">Add your first project</Button>}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                detailPath="/user/projects"
                clientAction={clientActionFor(project)}
                actions={[
                  { label: 'Edit project', icon: <Pencil size={14} />, onClick: () => openEdit(project) },
                  { label: 'Delete project', icon: <Trash2 size={14} />, onClick: () => setConfirmProject(project), variant: 'danger' },
                ]}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="hidden grid-cols-[minmax(220px,1fr)_120px_90px_110px_120px_120px_32px] items-center gap-3 px-4 text-[11px] font-semibold uppercase tracking-wide text-gray-400 md:grid">
              <span>Project</span><span className="text-right">Progress</span><span className="text-right">Budget</span><span className="text-right">Remaining</span><span className="text-right">Action</span><span className="text-right">Status</span><span />
            </div>
            {filtered.map(project => (
              <ProjectCardMini
                key={project.id}
                project={project}
                detailPath="/user/projects"
                clientAction={clientActionFor(project)}
                actions={[
                  { label: 'Edit project', icon: <Pencil size={14} />, onClick: () => openEdit(project) },
                  { label: 'Delete project', icon: <Trash2 size={14} />, onClick: () => setConfirmProject(project), variant: 'danger' },
                ]}
              />
            ))}
          </div>
        )}
      </div>

      <FormSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} title={editingProject ? 'Edit Project' : 'New Project'} description={editingProject ? `Editing ${editingProject.name}` : `Adding a project for ${currentClient?.fullName ?? 'client'}`} width="md">
        <form onSubmit={handleSubmit(onSubmit, onInvalidSubmit)} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
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
            <FormField label="Pricing Package" required error={errors.pricingPackageId?.message}>
              <Select {...register('pricingPackageId', { required: true })} hasError={!!errors.pricingPackageId}>
                <Option value="custom">Custom pricing</Option>
                {availablePackages.map(item => (
                  <Option key={item.id} value={item.id}>{item.name} - {formatPricingAmount(item)}</Option>
                ))}
              </Select>
              {selectedPricingPackage && watchedPricingPackageId !== 'custom' && (
                <p className="mt-2 text-xs font-medium text-gray-400">{selectedPricingPackage.summary}</p>
              )}
            </FormField>
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
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label="Start Date" required error={errors.startDate?.message}>
                <TextInput {...register('startDate', { required: 'Start date is required' })} type="date" hasError={!!errors.startDate} />
              </FormField>
              <FormField label="End Date" error={errors.endDate?.message}>
                <TextInput {...register('endDate')} type="date" hasError={!!errors.endDate} />
              </FormField>
            </div>
            <FormField label="Budget / Price Agreed" error={errors.budget?.message}>
              <TextInput
                {...register('budget', { valueAsNumber: true, min: { value: 0, message: 'Budget cannot be negative' } })}
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                readOnly={watchedPricingPackageId !== 'custom'}
                className={watchedPricingPackageId !== 'custom' ? 'cursor-not-allowed opacity-70' : ''}
                hasError={!!errors.budget}
              />
            </FormField>
          </div>
          <FormSidebarActions
            onCancel={() => setSidebarOpen(false)}
            isSubmitting={isSubmitting}
            isDirty={isDirty}
            submitLabel={editingProject ? 'Save Changes' : 'Add Project'}
          />
        </form>
      </FormSidebar>

      {canCreate && <Fab onClick={openAdd} ariaLabel="Add project" />}

      <ConfirmDialog
        isOpen={!!confirmProject}
        title="Delete project"
        message={confirmProject ? `"${confirmProject.name}" will be permanently removed. This cannot be undone.` : ''}
        confirmLabel="Delete"
        variant="danger"
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
    </UserLayout>
  );
}
