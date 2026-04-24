import { useState, useMemo, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Briefcase, CheckCircle, TrendingUp, Layers, Search, X, Pencil, Trash2 } from 'lucide-react';
import Layout from '../components/layout/layout';
import StatCard from '../components/stat-card/stat-card';
import TableTab, { type TabItem } from '../components/table-tab/table-tab';
import MaterialIcon from '../components/ui/material-icon';
import FormSidebar, { FormSidebarFooter } from '../components/form-sidebar/form-sidebar';
import FormField, { inputCls, selectCls } from '../components/form-field/form-field';
import Avatar from '../components/avatar/avatar';
import ProjectCard, { ProjectCardMini } from '../components/project-card/project-card';
import { useProjectsStore, makeNewProject } from '../store/projects';
import { useTeamStore } from '../store/team';
import { DEMO_CLIENTS } from '../data/clients';
import type { Client } from '../data/clients';
import type { TeamMember } from '../data/team';
import { SERVICE_META, ALL_STAGES } from '../data/projects';
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

// ─── Searchable Client Picker ─────────────────────────────────────────────────

const ClientPicker = ({
  clients,
  selectedId,
  onSelect,
}: {
  clients: Client[];
  selectedId: string;
  onSelect: (id: string) => void;
}) => {
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const selected = clients.find(c => c.id === selectedId);

  const filtered = useMemo(
    () =>
      clients.filter(
        c =>
          c.displayName.toLowerCase().includes(query.toLowerCase()) ||
          (c.companyName ?? '').toLowerCase().includes(query.toLowerCase()),
      ),
    [clients, query],
  );

  // Close on outside click
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setQuery('');
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <div ref={ref} className="flex flex-col gap-1.5">
      {selected ? (
        <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
          <Avatar name={selected.displayName} id={selected.id} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{selected.displayName}</p>
            {selected.companyName && (
              <p className="text-xs text-gray-400 truncate">{selected.companyName}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onSelect('')}
            className="text-gray-400 hover:text-gray-700 transition-colors p-0.5"
            aria-label="Clear selection"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search clients…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className={`${inputCls(false)} pl-8`}
          />
          {query && filtered.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden max-h-44 overflow-y-auto">
              {filtered.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => { onSelect(c.id); setQuery(''); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
                >
                  <Avatar name={c.displayName} id={c.id} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{c.displayName}</p>
                    {c.companyName && <p className="text-xs text-gray-400">{c.companyName}</p>}
                  </div>
                </button>
              ))}
            </div>
          )}
          {query && filtered.length === 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-sm z-20 px-4 py-3">
              <p className="text-sm text-gray-400">No clients match &ldquo;{query}&rdquo;</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Searchable Member Multi-Picker ──────────────────────────────────────────

const MemberPicker = ({
  members,
  selectedIds,
  onToggle,
}: {
  members: TeamMember[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) => {
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const selected = members.filter(m => selectedIds.includes(m.id));
  const filtered = useMemo(
    () =>
      members.filter(
        m =>
          !selectedIds.includes(m.id) &&
          (m.name.toLowerCase().includes(query.toLowerCase()) ||
            m.role.toLowerCase().includes(query.toLowerCase())),
      ),
    [members, selectedIds, query],
  );

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setQuery('');
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <div ref={ref} className="flex flex-col gap-2">
      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map(m => (
            <div
              key={m.id}
              className="flex items-center gap-1.5 bg-gray-100 rounded-full pl-1 pr-2 py-1"
            >
              <Avatar name={m.name} id={m.id} size="xs" />
              <span className="text-xs font-medium text-gray-700 leading-none">
                {m.name.split(' ')[0]}
              </span>
              <button
                type="button"
                onClick={() => onToggle(m.id)}
                className="text-gray-400 hover:text-gray-700 transition-colors ml-0.5"
                aria-label={`Remove ${m.name}`}
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search team members…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className={`${inputCls(false)} pl-8`}
        />
        {query && filtered.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden max-h-48 overflow-y-auto">
            {filtered.map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => { onToggle(m.id); setQuery(''); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
              >
                <Avatar name={m.name} id={m.id} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{m.name}</p>
                  <p className="text-xs text-gray-400">{m.role}</p>
                </div>
              </button>
            ))}
          </div>
        )}
        {query && filtered.length === 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-sm z-20 px-4 py-3">
            <p className="text-sm text-gray-400">No members match &ldquo;{query}&rdquo;</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Projects Page ────────────────────────────────────────────────────────────

const Projects = () => {
  const { searchQuery } = useUIStore();
  const { projects, addProject, updateProject, removeProject } = useProjectsStore();
  const { members } = useTeamStore();

  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ClientProject | null>(null);

  // Picker state lives outside react-hook-form (complex nested values)
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

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
    all:       projects.length,
    active:    projects.filter(p => p.status === 'active').length,
    paused:    projects.filter(p => p.status === 'paused').length,
    completed: projects.filter(p => p.status === 'completed').length,
  }), [projects]);

  const tabs: TabItem[] = [
    { key: 'all',       label: 'All',       count: tabCounts.all       },
    { key: 'active',    label: 'Active',    count: tabCounts.active    },
    { key: 'paused',    label: 'Paused',    count: tabCounts.paused    },
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
  const totalPaid   = projects.reduce((s, p) => s + p.paidPayment, 0);
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
    setSidebarOpen(true);
  };

  const openEdit = (project: ClientProject) => {
    setEditingProject(project);
    reset({
      name:     project.name,
      service:  project.service,
      package:  project.package ?? '',
      status:   project.status,
      timeline: project.timeline,
    });
    setSelectedClientId(project.clientId);
    setSelectedMemberIds(project.assignedMemberIds ?? []);
    setSidebarOpen(true);
  };

  const onSubmit = (data: ProjectFormValues) => {
    const payload = {
      name:               data.name,
      service:            data.service,
      package:            hasPackages && data.package ? (data.package as PackageType) : undefined,
      status:             data.status,
      timeline:           data.timeline,
      clientId:           selectedClientId,
      assignedMemberIds:  selectedMemberIds,
    };

    if (editingProject) {
      updateProject(editingProject.id, payload);
    } else {
      addProject(makeNewProject(payload));
    }
    setSidebarOpen(false);
  };

  const handleDelete = (project: ClientProject) => {
    if (window.confirm(`Delete "${project.name}"? This cannot be undone.`)) {
      removeProject(project.id);
    }
  };

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
        <div className="flex items-center gap-3 flex-wrap">
          <TableTab
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            actionLabel="Add Project"
            onAction={openAdd}
          />

          {/* View toggle — desktop only */}
          <div className="ml-auto hidden md:flex items-center gap-0.5 bg-gray-100 rounded-xl p-1 shrink-0">
            {(['list', 'grid'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                aria-label={`${mode} view`}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  viewMode === mode
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <MaterialIcon name={mode === 'list' ? 'view_list' : 'grid_view'} size={16} />
              </button>
            ))}
          </div>
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
                actions={[
                  { label: 'Edit project',   icon: <Pencil size={14} />, onClick: () => openEdit(p)    },
                  { label: 'Delete project', icon: <Trash2 size={14} />, onClick: () => handleDelete(p), variant: 'danger' },
                ]}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map(p => (
              <ProjectCardMini
                key={p.id}
                project={p}
                allMembers={members}
                actions={[
                  { label: 'Edit project',   icon: <Pencil size={14} />, onClick: () => openEdit(p)    },
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
              <select
                {...register('service', { required: true })}
                className={selectCls(!!errors.service)}
              >
                {(Object.entries(SERVICE_META) as [ServiceType, typeof SERVICE_META[ServiceType]][]).map(
                  ([key, meta]) => (
                    <option key={key} value={key}>{meta.label}</option>
                  ),
                )}
              </select>
            </FormField>

            {/* Package — only for website / software */}
            {hasPackages && (
              <FormField label="Package" required error={errors.package?.message}>
                <select
                  {...register('package', { required: hasPackages })}
                  className={selectCls(!!errors.package)}
                >
                  <option value="essentials">Essentials</option>
                  <option value="growth">Growth</option>
                  <option value="premium">Premium</option>
                </select>
              </FormField>
            )}

            {/* Status */}
            <FormField label="Status" required error={errors.status?.message}>
              <select
                {...register('status', { required: true })}
                className={selectCls(!!errors.status)}
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
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
    </Layout>
  );
};

export default Projects;
