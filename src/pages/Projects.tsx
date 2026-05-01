import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Briefcase, CheckCircle, TrendingUp, Layers, Pencil, Trash2 } from 'lucide-react';
import Layout from '../components/common/layout/layout';
import StatCard from '../components/common/stat-card/stat-card';
import TableTab, { type TabItem } from '../components/common/table-tab/table-tab';
import MaterialIcon from '../components/common/material-icon/material-icon';
import FormSidebar, { FormSidebarFooter } from '../components/common/form-sidebar/form-sidebar';
import FormField, { inputCls } from '../components/common/form-field/form-field';
import Select from '../components/common/select/select';
import Option from '../components/common/select/option';
import ConfirmDialog from '../components/common/confirm-dialog/confirm-dialog';
import ProjectCard, { ProjectCardMini } from '../components/admin/project-card/project-card';
import { PhaseSelector } from '../components/admin/project-progress/project-progress';
import ClientPicker from '../components/admin/pickers/client-picker/client-picker';
import MemberPicker from '../components/admin/pickers/member-picker/member-picker';
import { useProjectsStore, makeNewProject, getPhaseIndex } from '../store/projects';
import { useTeamStore } from '../store/team';
import { DEMO_CLIENTS } from '../data/clients';
import { SERVICE_META, ALL_STAGES, buildStages } from '../data/projects';
import type { ClientProject, ServiceType, PackageType } from '../data/projects';
import { useUIStore } from '../store/ui';

// ─── Form shape ───────────────────────────────────────────────────────────────

interface ProjectFormValues {
  name: string;
  service: ServiceType;
  package: PackageType | '';
  status: 'active' | 'paused' | 'completed';
  timeline: string;
}

// ─── Projects Page ────────────────────────────────────────────────────────────

const Projects = () => {
  const { searchQuery } = useUIStore();
  const { projects, addProject, updateProject, removeProject } = useProjectsStore();
  const { members } = useTeamStore();

  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ClientProject | null>(null);
  const [confirmProject, setConfirmProject] = useState<ClientProject | null>(null);

  // Picker / phase state — lives outside react-hook-form
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    defaultValues: { name: '', service: 'website', package: 'essentials', status: 'active', timeline: '' },
  });

  const watchedService = watch('service');
  const hasPackages = watchedService === 'website' || watchedService === 'software';

  // ── Tab counts ──
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
        p.name.toLowerCase().includes(q) ||
        p.service.toLowerCase().includes(q) ||
        (p.package ?? '').toLowerCase().includes(q),
      );
    }
    return list;
  }, [projects, activeTab, searchQuery]);

  // ── Stats ──
  const totalBudget = projects.reduce((s, p) => s + p.agreedPayment, 0);
  const totalPaid = projects.reduce((s, p) => s + p.paidPayment, 0);
  const avgProgress = projects.length
    ? Math.round(
      projects.reduce((s, p) => {
        const done = p.stages.filter(st => st.status === 'completed').length;
        return s + (done / ALL_STAGES.length) * 100;
      }, 0) / projects.length,
    )
    : 0;

  // ── Sidebar helpers ──
  const openAdd = () => {
    setEditingProject(null);
    reset({ name: '', service: 'website', package: 'essentials', status: 'active', timeline: '' });
    setSelectedClientId('');
    setSelectedMemberIds([]);
    setCurrentPhaseIndex(0);
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
    setSelectedClientId(project.clientId);
    setSelectedMemberIds(project.assignedMemberIds ?? []);
    setCurrentPhaseIndex(getPhaseIndex(project));
    setSidebarOpen(true);
  };

  const onSubmit = (data: ProjectFormValues) => {
    const payload = {
      name: data.name,
      service: data.service,
      package: hasPackages && data.package ? (data.package as PackageType) : undefined,
      status: data.status,
      timeline: data.timeline,
      clientId: selectedClientId,
      assignedMemberIds: selectedMemberIds,
    };

    if (editingProject) {
      updateProject(editingProject.id, { ...payload, stages: buildStages(currentPhaseIndex) });
    } else {
      addProject(makeNewProject({ ...payload, currentPhaseIndex }));
    }
    setSidebarOpen(false);
  };

  const handleDelete = (project: ClientProject) => setConfirmProject(project);

  const toggleMember = (id: string) =>
    setSelectedMemberIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );

  return (
    <Layout title="Projects">
      <div className="flex flex-col gap-5 pb-10">

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            variant="lime"
            icon={<Briefcase size={16} />}
            label="Total Projects"
            value={projects.length}
            badge={`${tabCounts.active} active`}
            badgeLabel="in progress"
          />
          <StatCard
            variant="surface"
            icon={<CheckCircle size={16} />}
            label="Completed"
            value={tabCounts.completed}
            badge={`${tabCounts.paused} paused`}
            badgeLabel="on hold"
          />
          <StatCard
            variant="dark"
            icon={<TrendingUp size={16} />}
            label="Total Value"
            value={`$${(totalBudget / 1000).toFixed(0)}k`}
            badge={`$${(totalPaid / 1000).toFixed(0)}k collected`}
            badgeLabel="to date"
          />
          <StatCard
            variant="white"
            icon={<Layers size={16} />}
            label="Avg. Progress"
            value={`${avgProgress}%`}
            badge={`${projects.length} projects`}
            badgeLabel="tracked"
          />
        </div>

        {/* ── Toolbar ── */}
        <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 lg:-mx-8 flex items-center gap-3 bg-white/95 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <TableTab
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              className="min-w-0 flex-1 md:flex-none"
            />

            {/* View toggle — desktop only */}
            <div className="hidden md:flex items-center gap-0.5 bg-gray-100 rounded-xl p-1 shrink-0">
              {(['list', 'grid'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  aria-label={`${mode} view`}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${viewMode === mode
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  <MaterialIcon name={mode === 'list' ? 'view_list' : 'grid_view'} size={16} />
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={openAdd}
            className="hidden sm:flex items-center gap-2 bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors shrink-0 ml-auto"
          >
            <MaterialIcon name="add" size={20} />
            Add Project
          </button>
        </div>

        {/* ── Content ── */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-[18px] py-16 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-(--color-surface) flex items-center justify-center">
              <Briefcase size={20} className="text-gray-300" />
            </div>
            <p className="text-sm font-semibold text-gray-500">No projects found</p>
            {searchQuery && (
              <p className="text-xs text-gray-400">No results for &ldquo;{searchQuery}&rdquo;</p>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(p => (
              <ProjectCard
                key={p.id}
                project={p}
                allMembers={members}
                variant="surface"
                actions={[
                  { label: 'Edit project', icon: <Pencil size={14} />, onClick: () => openEdit(p) },
                  { label: 'Delete project', icon: <Trash2 size={14} />, onClick: () => handleDelete(p), variant: 'danger' },
                ]}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="hidden grid-cols-[minmax(220px,1fr)_120px_90px_110px_120px_32px] items-center gap-3 px-4 text-[11px] font-semibold uppercase tracking-wide text-gray-400 md:grid">
              <span>Project</span>
              <span className="text-right">Progress</span>
              <span className="text-right">Budget</span>
              <span className="text-right">Remaining</span>
              <span className="text-right">Status</span>
              <span />
            </div>
            {filtered.map(p => (
              <ProjectCardMini
                key={p.id}
                project={p}
                allMembers={members}
                actions={[
                  { label: 'Edit project', icon: <Pencil size={14} />, onClick: () => openEdit(p) },
                  { label: 'Delete project', icon: <Trash2 size={14} />, onClick: () => handleDelete(p), variant: 'danger' },
                ]}
              />
            ))}
          </div>
        )}

      </div>

      {/* ── Add / Edit Sidebar ── */}
      <FormSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title={editingProject ? 'Edit Project' : 'New Project'}
        description={editingProject ? `Editing ${editingProject.name}` : 'Fill in the details to create a new project.'}
        width="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

            {/* Name */}
            <FormField label="Project Name" required error={errors.name?.message}>
              <input
                {...register('name', { required: 'Project name is required' })}
                placeholder="e.g. Brand Refresh"
                className={inputCls(!!errors.name)}
              />
            </FormField>

            {/* Service type */}
            <FormField label="Service" required error={errors.service?.message}>
              <Select
                {...register('service', { required: true })}
                hasError={!!errors.service}
              >
                {(Object.entries(SERVICE_META) as [ServiceType, typeof SERVICE_META[ServiceType]][]).map(
                  ([key, meta]) => (
                    <Option key={key} value={key}>{meta.label}</Option>
                  ),
                )}
              </Select>
            </FormField>

            {/* Package — only for website / software */}
            {hasPackages && (
              <FormField label="Package" required error={errors.package?.message}>
                <Select
                  {...register('package', { required: hasPackages })}
                  hasError={!!errors.package}
                >
                  <Option value="essentials">Essentials</Option>
                  <Option value="growth">Growth</Option>
                  <Option value="premium">Premium</Option>
                </Select>
              </FormField>
            )}

            {/* Status */}
            <FormField label="Status" required error={errors.status?.message}>
              <Select
                {...register('status', { required: true })}
                hasError={!!errors.status}
              >
                <Option value="active">Active</Option>
                <Option value="paused">Paused</Option>
                <Option value="completed">Completed</Option>
              </Select>
            </FormField>

            {/* Current phase — interactive pill selector */}
            <FormField label="Current Phase">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 overflow-x-auto">
                <PhaseSelector
                  selectedIndex={currentPhaseIndex}
                  onChange={setCurrentPhaseIndex}
                />
              </div>
            </FormField>

            {/* Timeline */}
            <FormField label="Timeline" error={errors.timeline?.message}>
              <input
                {...register('timeline')}
                placeholder="e.g. Q3 2026"
                className={inputCls(!!errors.timeline)}
              />
            </FormField>

            {/* Client picker */}
            <FormField label="Client" required error={undefined}>
              <ClientPicker
                clients={DEMO_CLIENTS}
                selectedId={selectedClientId}
                onSelect={setSelectedClientId}
              />
            </FormField>

            {/* Team members picker */}
            <FormField label="Assign Team">
              <MemberPicker
                members={members}
                selectedIds={selectedMemberIds}
                onToggle={toggleMember}
              />
            </FormField>

          </div>

          <FormSidebarFooter>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-(--color-ink) hover:bg-gray-800 rounded-xl transition-colors disabled:opacity-50"
            >
              {editingProject ? 'Save Changes' : 'Add Project'}
            </button>
          </FormSidebarFooter>
        </form>
      </FormSidebar>

      {/* ── Delete confirmation ── */}
      <ConfirmDialog
        isOpen={!!confirmProject}
        title="Delete project"
        message={confirmProject ? `"${confirmProject.name}" will be permanently removed. This cannot be undone.` : ''}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => { if (confirmProject) removeProject(confirmProject.id); setConfirmProject(null); }}
        onCancel={() => setConfirmProject(null)}
      />
    </Layout>
  );
};

export default Projects;
