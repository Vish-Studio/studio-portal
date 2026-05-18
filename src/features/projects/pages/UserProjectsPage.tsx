import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Briefcase, CheckCircle, Layers, Pencil, Trash2 } from 'lucide-react';
import UserLayout from '@/src/components/user/user-layout/user-layout';
import Fab from '@/src/components/common/button-fab/button-fab';
import Button from '@/src/components/common/button/button';
import StatCard from '@/src/components/common/stat-card/stat-card';
import TableTab, { type TabItem } from '@/src/components/common/table-tab/table-tab';
import { MaterialIcon } from '@/src/shared/components';
import FormSidebar, { FormSidebarFooter } from '@/src/components/common/form-sidebar/form-sidebar';
import FormField, { inputCls } from '@/src/components/common/form-field/form-field';
import Select from '@/src/components/common/select/select';
import Option from '@/src/components/common/select/option';
import ConfirmDialog from '@/src/components/common/confirm-dialog/confirm-dialog';
import { ProjectCard, ProjectCardMini } from '@/src/features/projects';
import { makeNewProject, useProjectsStore } from '@/src/features/projects';
import { useTasksStore } from '@/src/features/tasks';
import { useClientsStore } from '@/src/features/clients';
import { SERVICE_META, getPhaseProgress, type ClientProject, type ServiceType, type PackageType } from '@/src/features/projects';

const CURRENT_CLIENT_ID = 'c1';

interface ProjectFormValues {
  name: string;
  service: ServiceType;
  package: PackageType | '';
  status: 'active' | 'paused' | 'completed';
  timeline: string;
}

type FilterKey = 'all' | 'active' | 'paused' | 'completed';
type SortKey = 'updated' | 'name';

const getPendingClientPhase = (project: ClientProject) =>
  project.phases.find(phase => phase.status === 'active' && phase.requiresClientAction && !phase.clientCompleted);

export default function UserProjectsPage() {
  const { projects, addProject, updateProject, removeProject, completePhase } = useProjectsStore();
  const { tasks } = useTasksStore();
  const { clients } = useClientsStore();
  const currentClient = clients.find(client => client.id === CURRENT_CLIENT_ID);
  const myProjects = projects.filter(project => project.clientId === CURRENT_CLIENT_ID);

  const [activeTab, setActiveTab] = useState<FilterKey>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortKey, setSortKey] = useState<SortKey>('updated');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
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
    setEditingProject(null);
    reset({ name: '', service: 'website', package: 'essentials', status: 'active', timeline: '' });
    setSidebarOpen(true);
  };

  const openEdit = (project: ClientProject) => {
    setEditingProject(project);
    reset({
      name: project.name,
      service: project.service,
      package: project.package ?? '',
      status: project.status,
      timeline: project.timeline,
    });
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

    if (editingProject) updateProject(editingProject.id, payload);
    else addProject(makeNewProject(payload));
    setSidebarOpen(false);
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
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <StatCard variant="lime" icon={<Briefcase size={16} />} label="Total Projects" value={myProjects.length} badge={`${tabCounts.active} active`} badgeLabel="in progress" />
          <StatCard variant="surface" icon={<CheckCircle size={16} />} label="Completed" value={tabCounts.completed} badge={`${tabCounts.paused} paused`} badgeLabel="on hold" />
          <StatCard variant="dark" icon={<Layers size={16} />} label="Avg. Progress" value={`${avgProgress}%`} badge={`${myProjects.length} project${myProjects.length !== 1 ? 's' : ''}`} badgeLabel="tracked" />
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
            actionLabel="Add Project"
            onAction={openAdd}
            className="min-w-0 flex-1"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-[18px] border border-gray-100 bg-white py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--color-surface)">
              <Briefcase size={20} className="text-gray-300" />
            </div>
            <p className="text-sm font-semibold text-gray-500">No projects found</p>
            <button onClick={openAdd} className="mt-1 text-xs font-semibold text-gray-400 underline transition-colors hover:text-gray-700">Add your first project</button>
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
        <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
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
            <Button type="button" onClick={() => setSidebarOpen(false)} variant="secondary" className="flex-1">Cancel</Button>
            <Button type="submit" loading={isSubmitting} className="flex-1">
              {editingProject ? 'Save Changes' : 'Add Project'}
            </Button>
          </FormSidebarFooter>
        </form>
      </FormSidebar>

      <Fab onClick={openAdd} ariaLabel="Add project" />

      <ConfirmDialog
        isOpen={!!confirmProject}
        title="Delete project"
        message={confirmProject ? `"${confirmProject.name}" will be permanently removed. This cannot be undone.` : ''}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => { if (confirmProject) removeProject(confirmProject.id); setConfirmProject(null); }}
        onCancel={() => setConfirmProject(null)}
      />
    </UserLayout>
  );
}
