import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Briefcase, Check } from 'lucide-react';
import Layout from '../../components/common/layout/layout';
import CardContent from '../../components/common/card-content/card-content';
import FormField, { inputCls } from '../../components/common/form-field/form-field';
import Select from '../../components/common/select/select';
import MaterialIcon from '../../components/common/material-icon/material-icon';
import ProjectHeroCard from '../../components/admin/project-hero-card/project-hero-card';
import { PhaseTrack, PhaseSelector } from '../../components/admin/project-progress/project-progress';
import { AvatarStack } from '../../components/common/avatar/avatar';
import Avatar from '../../components/common/avatar/avatar';
import ClientPicker from '../../components/admin/pickers/client-picker/client-picker';
import MemberPicker from '../../components/admin/pickers/member-picker/member-picker';
import TaskRow from '../../components/admin/task-card/task-row';
import TaskDetailModal from '../../components/admin/task-detail-modal/task-detail-modal';
import ConfirmDialog from '../../components/common/confirm-dialog/confirm-dialog';
import { useProjectsStore, getPhaseIndex } from '../../store/projects';
import { useTeamStore } from '../../store/team';
import { useTasksStore } from '../../store/tasks';
import { DEMO_CLIENTS } from '../../data/clients';
import {
  getProjectAccent, buildStages, SERVICE_META, ALL_STAGES, STAGE_META,
} from '../../data/projects';
import type { ServiceType, PackageType } from '../../data/projects';
import type { Task, TaskStatus } from '../../data/tasks';

// ─── Form values ──────────────────────────────────────────────────────────────

interface ProjectFormValues {
  name: string;
  service: ServiceType;
  package: PackageType | '';
  status: 'active' | 'paused' | 'completed';
  timeline: string;
}

// ─── Disabled-aware input helper ─────────────────────────────────────────────

const fieldCls = (hasError: boolean) =>
  inputCls(hasError) +
  ' disabled:bg-transparent disabled:border-transparent disabled:px-0 disabled:py-1 disabled:cursor-default disabled:text-gray-900 disabled:shadow-none disabled:focus:ring-0 disabled:focus:bg-transparent';

const DISABLED_SELECT_CLS =
  'disabled:bg-transparent disabled:border-transparent disabled:px-0 disabled:py-1 disabled:cursor-default disabled:text-gray-900 disabled:appearance-none disabled:shadow-none disabled:focus:ring-0';

// ─── Project Detail Page ──────────────────────────────────────────────────────

// ─── Task status filter options ───────────────────────────────────────────────

type TaskFilter = 'all' | TaskStatus;

const TASK_FILTER_LABELS: Record<TaskFilter, string> = {
  all:           'All',
  todo:          'Todo',
  'in-progress': 'In Progress',
  'to-test':     'To Test',
  completed:     'Completed',
};

// ─── Project Detail Page ──────────────────────────────────────────────────────

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { projects, updateProject } = useProjectsStore();
  const { members } = useTeamStore();
  const { tasks, updateTask, removeTask } = useTasksStore();
  const project = projects.find(p => p.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);

  // ── Task panel state ──
  const [taskFilter,  setTaskFilter]  = useState<TaskFilter>('all');
  const [detailTask,  setDetailTask]  = useState<Task | null>(null);
  const [confirmTask, setConfirmTask] = useState<Task | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProjectFormValues>();

  const watchedService = watch('service');
  const hasPackages    = watchedService === 'website' || watchedService === 'software';

  // ── Not found ──
  if (!project) {
    return (
      <Layout title="Project">
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-12 h-12 rounded-full bg-(--color-surface) flex items-center justify-center">
            <Briefcase size={20} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">Project not found.</p>
          <Link to="/admin/projects" className="text-sm font-semibold text-gray-900 underline underline-offset-4">
            Back to Projects
          </Link>
        </div>
      </Layout>
    );
  }

  // Derived values
  const accent         = getProjectAccent(project.service, project.package);
  const projectMembers = members.filter(m => project.assignedMemberIds?.includes(m.id));
  const completedCount = project.stages.filter(s => s.status === 'completed').length;
  const progress       = Math.round((completedCount / ALL_STAGES.length) * 100);
  const remaining      = project.agreedPayment - project.paidPayment;
  const selectedClient = DEMO_CLIENTS.find(c => c.id === (isEditing ? selectedClientId : project.clientId));

  // ── Project tasks ──
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const projectTasks = useMemo(() => {
    const base = tasks.filter(t => t.projectId === id);
    const filtered = taskFilter === 'all' ? base : base.filter(t => t.status === taskFilter);
    return [...filtered].sort((a, b) => b.createdAt - a.createdAt);
  }, [tasks, id, taskFilter]);

  const allProjectTaskCount = useMemo(() => tasks.filter(t => t.projectId === id).length, [tasks, id]);

  const openEdit = () => {
    reset({
      name:     project.name,
      service:  project.service,
      package:  project.package ?? '',
      status:   project.status,
      timeline: project.timeline,
    });
    setSelectedClientId(project.clientId);
    setSelectedMemberIds(project.assignedMemberIds ?? []);
    setCurrentPhaseIndex(getPhaseIndex(project));
    setIsEditing(true);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const onSubmit = (data: ProjectFormValues) => {
    updateProject(project.id, {
      name:              data.name,
      service:           data.service,
      package:           hasPackages && data.package ? (data.package as PackageType) : undefined,
      status:            data.status,
      timeline:          data.timeline,
      clientId:          selectedClientId,
      assignedMemberIds: selectedMemberIds,
      stages:            buildStages(currentPhaseIndex),
    });
    setIsEditing(false);
  };

  const toggleMember = (id: string) =>
    setSelectedMemberIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );

  return (
    <Layout title={project.name}>
      <div className="pb-12">

        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/admin/projects"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-800 hover:border-gray-400 transition-colors shrink-0"
          >
            <ArrowLeft size={15} />
          </Link>
          <span className="text-sm text-gray-400 font-medium">Projects</span>
          <span className="text-gray-200">/</span>
          <span className="text-sm font-semibold text-gray-700 truncate">{project.name}</span>
        </div>

        {/* ── Two-column layout (matches ClientDetail) ── */}
        <div className="flex flex-col lg:flex-row gap-5 items-start">

          {/* ═══ Left panel ═══ */}
          <div className="w-full lg:w-80 xl:w-92 shrink-0 flex flex-col gap-4">

            {/* Dark hero card */}
            <ProjectHeroCard project={project} />

            {/* ── Inline edit form (CardContent, same pattern as ClientDetail) ── */}
            <CardContent
              iconName="edit_note"
              title="Project Details"
              variant="white"
              action={
                isEditing ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="text-[12px] font-semibold text-gray-500 hover:text-gray-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      form="project-edit-form"
                      type="submit"
                      disabled={isSubmitting || !isDirty}
                      className="text-[12px] font-semibold text-white bg-(--color-ink) hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg transition-colors"
                    >
                      {isSubmitting ? 'Saving…' : 'Save'}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={openEdit}
                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <MaterialIcon name="edit" size={13} />
                    Edit
                  </button>
                )
              }
            >
              <form
                id="project-edit-form"
                onSubmit={handleSubmit(onSubmit)}
                className="px-4 md:px-6 py-4 md:py-5 space-y-4"
              >
                {/* Name */}
                <FormField label="Project Name" required={isEditing} error={errors.name?.message}>
                  <input
                    {...register('name', { required: isEditing ? 'Required' : false })}
                    disabled={!isEditing}
                    className={fieldCls(!!errors.name)}
                  />
                </FormField>

                {/* Service */}
                <FormField label="Service" required={isEditing} error={errors.service?.message}>
                  <Select
                    {...register('service', { required: isEditing })}
                    disabled={!isEditing}
                    hasError={!!errors.service}
                    className={DISABLED_SELECT_CLS}
                  >
                    {(Object.entries(SERVICE_META) as [ServiceType, (typeof SERVICE_META)[ServiceType]][]).map(
                      ([key, meta]) => (
                        <option key={key} value={key}>{meta.label}</option>
                      ),
                    )}
                  </Select>
                </FormField>

                {/* Package (website/software only) */}
                {(isEditing ? hasPackages : ['website', 'software'].includes(project.service)) && (
                  <FormField label="Package" error={errors.package?.message}>
                    <Select
                      {...register('package')}
                      disabled={!isEditing}
                      hasError={!!errors.package}
                      className={DISABLED_SELECT_CLS}
                    >
                      <option value="">— None —</option>
                      <option value="essentials">Essentials</option>
                      <option value="growth">Growth</option>
                      <option value="premium">Premium</option>
                    </Select>
                  </FormField>
                )}

                {/* Status */}
                <FormField label="Status" required={isEditing} error={errors.status?.message}>
                  <Select
                    {...register('status', { required: isEditing })}
                    disabled={!isEditing}
                    hasError={!!errors.status}
                    className={DISABLED_SELECT_CLS}
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                  </Select>
                </FormField>

                {/* Timeline */}
                <FormField label="Timeline" error={errors.timeline?.message}>
                  <input
                    {...register('timeline')}
                    disabled={!isEditing}
                    className={fieldCls(!!errors.timeline)}
                  />
                </FormField>

                {/* Current Phase */}
                <FormField label="Current Phase">
                  {isEditing ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 overflow-x-auto">
                      <PhaseSelector
                        selectedIndex={currentPhaseIndex}
                        onChange={setCurrentPhaseIndex}
                      />
                    </div>
                  ) : (
                    <div className="py-1">
                      {project.stages.find(s => s.status === 'current') ? (
                        (() => {
                          const cur = project.stages.find(s => s.status === 'current')!;
                          const meta = STAGE_META[cur.key];
                          return (
                            <span
                              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-(--color-ink) px-2.5 py-1 rounded-full border"
                              style={{ borderColor: 'var(--color-accent-lime)', background: 'rgba(255,214,0,0.1)' }}
                            >
                              <MaterialIcon name={meta.icon} size={11} />
                              {meta.label}
                            </span>
                          );
                        })()
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                          <Check size={10} strokeWidth={3} />
                          All phases complete
                        </span>
                      )}
                    </div>
                  )}
                </FormField>

                {/* Client */}
                <FormField label="Client">
                  {isEditing ? (
                    <ClientPicker
                      clients={DEMO_CLIENTS}
                      selectedId={selectedClientId}
                      onSelect={setSelectedClientId}
                    />
                  ) : (
                    <div className="py-1">
                      {selectedClient ? (
                        <div className="flex items-center gap-2">
                          <Avatar name={selectedClient.displayName} id={selectedClient.id} size="sm" />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{selectedClient.displayName}</p>
                            {selectedClient.companyName && (
                              <p className="text-xs text-gray-400">{selectedClient.companyName}</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </div>
                  )}
                </FormField>

                {/* Team members */}
                <FormField label="Assigned Team">
                  {isEditing ? (
                    <MemberPicker
                      members={members}
                      selectedIds={selectedMemberIds}
                      onToggle={toggleMember}
                    />
                  ) : (
                    <div className="py-1">
                      {projectMembers.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <AvatarStack
                            members={projectMembers.map(m => ({ name: m.name, id: m.id }))}
                            size="sm"
                            limit={3}
                          />
                          {projectMembers.length > 3 && (
                            <span className="text-xs text-gray-400">+{projectMembers.length - 3} more</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No team assigned</span>
                      )}
                    </div>
                  )}
                </FormField>

              </form>
            </CardContent>
          </div>

          {/* ═══ Right panel ═══ */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">

            {/* Phase Journey — CardContent style */}
            <CardContent
              iconName="route"
              title="Phase Journey"
              variant="white"
              bodyClassName="px-4 md:px-6 py-4 md:py-5"
              action={
                <span className="text-[11px] font-semibold text-gray-400">
                  {completedCount}/{ALL_STAGES.length} complete · {progress}%
                </span>
              }
            >
              <PhaseTrack stages={project.stages} accent={accent} size="md" />
            </CardContent>

            {/* Team & Financials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Assigned Team — CardContent style */}
              <CardContent iconName="group" title="Assigned Team" variant="white">
                {projectMembers.length === 0 ? (
                  <div className="px-4 md:px-6 py-4 md:py-5">
                    <p className="text-sm text-gray-400">No team members assigned.</p>
                  </div>
                ) : (
                  <div className="px-4 md:px-6 py-4 md:py-5 flex flex-col gap-3">
                    {projectMembers.map(m => (
                      <div key={m.id} className="flex items-center gap-3">
                        <Avatar name={m.name} id={m.id} size="sm" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{m.name}</p>
                          <p className="text-xs text-gray-400">{m.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>

              {/* Financials — CardContent style */}
              <CardContent iconName="payments" title="Financials" variant="white">
                <div className="px-4 md:px-6 py-4 md:py-5 flex flex-col gap-2.5">
                  {[
                    { label: 'Agreed',    value: `$${project.agreedPayment.toLocaleString()}`, cls: 'text-gray-900'   },
                    { label: 'Paid',      value: `$${project.paidPayment.toLocaleString()}`,   cls: 'text-green-600'  },
                    { label: 'Remaining', value: remaining > 0 ? `$${remaining.toLocaleString()}` : 'Settled', cls: remaining > 0 ? 'text-amber-600' : 'text-green-600' },
                  ].map(({ label, value, cls }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{label}</span>
                      <span className={`text-sm font-bold ${cls}`}>{value}</span>
                    </div>
                  ))}
                  {remaining === 0 && (
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-green-600 bg-green-50 rounded-lg px-3 py-2">
                      <Check size={11} strokeWidth={3} />
                      Project fully settled
                    </div>
                  )}
                </div>
              </CardContent>
            </div>

            {/* ── Tasks ── */}
            <CardContent
              iconName="task_alt"
              title="Tasks"
              variant="white"
              action={
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-gray-400">
                    {allProjectTaskCount} total
                  </span>
                  <Select
                    value={taskFilter}
                    onChange={e => setTaskFilter(e.target.value as TaskFilter)}
                    className="text-[11px] font-semibold text-gray-600 bg-gray-100 border-0 rounded-lg px-2.5 py-1.5 pr-6 cursor-pointer focus:ring-2 focus:ring-gray-200"
                  >
                    {(Object.keys(TASK_FILTER_LABELS) as TaskFilter[]).map(k => (
                      <option key={k} value={k}>{TASK_FILTER_LABELS[k]}</option>
                    ))}
                  </Select>
                </div>
              }
            >
              {projectTasks.length === 0 ? (
                <div className="px-6 py-8 flex flex-col items-center gap-2 text-center">
                  <MaterialIcon name="task_alt" size={22} className="text-gray-200" />
                  <p className="text-xs font-semibold text-gray-400">
                    {allProjectTaskCount === 0 ? 'No tasks for this project yet.' : 'No tasks match this filter.'}
                  </p>
                </div>
              ) : (
                <div className="px-4 md:px-6 py-4 flex flex-col gap-2">
                  {projectTasks.map(task => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      showProject={false}
                      showStatus
                      onClick={() => setDetailTask(task)}
                      onDelete={() => setConfirmTask(task)}
                    />
                  ))}
                </div>
              )}
            </CardContent>

          </div>
        </div>
      </div>

      {/* ── Task detail modal ── */}
      {detailTask && (
        <TaskDetailModal
          task={detailTask}
          onClose={() => setDetailTask(null)}
          onDelete={() => { setDetailTask(null); setConfirmTask(detailTask); }}
        />
      )}

      {/* ── Delete confirmation ── */}
      <ConfirmDialog
        isOpen={!!confirmTask}
        title="Delete task"
        message={confirmTask ? `"${confirmTask.title}" will be permanently removed.` : ''}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => { if (confirmTask) removeTask(confirmTask.id); setConfirmTask(null); }}
        onCancel={() => setConfirmTask(null)}
      />
    </Layout>
  );
};

export default ProjectDetail;
