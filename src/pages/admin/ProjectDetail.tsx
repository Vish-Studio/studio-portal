import { useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Briefcase, Check, Pencil, Trash2, Plus } from 'lucide-react';
import Layout from '../../components/common/layout/layout';
import CardContent from '../../components/common/card-content/card-content';
import FormField, { inputCls } from '../../components/common/form-field/form-field';
import Select from '../../components/common/select/select';
import Option from '../../components/common/select/option';
import MaterialIcon from '../../components/common/material-icon/material-icon';
import ButtonIcon from '../../components/common/button-icon/button-icon';
import IconPicker from '../../components/common/icon-picker/icon-picker';
import ProjectHeroCard from '../../components/admin/project-hero-card/project-hero-card';
import { PhaseTrack, PhaseSelector } from '../../components/admin/project-progress/project-progress';
import { AvatarStack } from '../../components/common/avatar/avatar';
import Avatar from '../../components/common/avatar/avatar';
import ClientPicker from '../../components/admin/pickers/client-picker/client-picker';
import MemberPicker from '../../components/admin/pickers/member-picker/member-picker';
import TaskRow from '../../components/admin/task-card/task-row';
import TaskDetailModal from '../../components/admin/task-detail-modal/task-detail-modal';
import ConfirmDialog from '../../components/common/confirm-dialog/confirm-dialog';
import AssignTemplateModal from '../../components/admin/template-editor/assign-template-modal';
import { useProjectsStore, getPhaseIndex } from '../../store/projects';
import { useTeamStore } from '../../store/team';
import { useTasksStore } from '../../store/tasks';
import { useTemplateAssignmentsStore } from '../../store/template-assignments';
import { DEMO_CLIENTS } from '../../data/clients';
import {
  getProjectAccent, buildStages, SERVICE_META, ALL_STAGES, STAGE_META,
} from '../../data/projects';
import { TEMPLATES } from '../../data/templates';
import { getDefaultBlocks } from '../../data/template-blocks';
import type { ServiceType, PackageType, StageKey, TimelineEvent } from '../../data/projects';
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
  all: 'All',
  todo: 'Todo',
  'in-progress': 'In Progress',
  'to-test': 'To Test',
  completed: 'Completed',
};

// ─── Project Detail Page ──────────────────────────────────────────────────────

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, updateProject } = useProjectsStore();
  const { members } = useTeamStore();
  const { tasks, removeTask } = useTasksStore();
  const { getPhaseAssignment, addAssignment, removeAssignment } = useTemplateAssignmentsStore();
  const project = projects.find(p => p.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);

  // ── Task panel state ──
  const [taskFilter, setTaskFilter] = useState<TaskFilter>('all');
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [confirmTask, setConfirmTask] = useState<Task | null>(null);

  // ── Phase Documents state ──
  const [assignPhase, setAssignPhase] = useState<StageKey | null>(null);
  const [removeDocId, setRemoveDocId] = useState<string | null>(null);

  // ── Custom timeline state ──
  const [addingMilestone,   setAddingMilestone]   = useState(false);
  const [newIcon,           setNewIcon]           = useState('flag');
  const [newTitle,          setNewTitle]          = useState('');
  const [newDate,           setNewDate]           = useState('');
  const [newDescription,    setNewDescription]    = useState('');
  const [removeMilestoneId, setRemoveMilestoneId] = useState<string | null>(null);

  const customTimeline = project?.customTimeline ?? [];

  const handleAddMilestone = () => {
    if (!newTitle.trim()) return;
    const event: TimelineEvent = {
      id:          `tl_${Date.now()}`,
      icon:        newIcon,
      title:       newTitle.trim(),
      date:        newDate.trim(),
      description: newDescription.trim() || undefined,
    };
    updateProject(project!.id, { customTimeline: [...customTimeline, event] });
    setNewTitle(''); setNewDate(''); setNewDescription(''); setNewIcon('flag');
    setAddingMilestone(false);
  };

  const handleRemoveMilestone = (milestoneId: string) => {
    updateProject(project!.id, {
      customTimeline: customTimeline.filter(e => e.id !== milestoneId),
    });
    setRemoveMilestoneId(null);
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProjectFormValues>();

  const watchedService = watch('service');
  const hasPackages = watchedService === 'website' || watchedService === 'software';

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
  const accent = getProjectAccent(project.service, project.package);
  const projectMembers = members.filter(m => project.assignedMemberIds?.includes(m.id));
  const completedCount = project.stages.filter(s => s.status === 'completed').length;
  const progress = Math.round((completedCount / ALL_STAGES.length) * 100);
  const remaining = project.agreedPayment - project.paidPayment;
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
      name: project.name,
      service: project.service,
      package: project.package ?? '',
      status: project.status,
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
      name: data.name,
      service: data.service,
      package: hasPackages && data.package ? (data.package as PackageType) : undefined,
      status: data.status,
      timeline: data.timeline,
      clientId: selectedClientId,
      assignedMemberIds: selectedMemberIds,
      stages: buildStages(currentPhaseIndex),
    });
    setIsEditing(false);
  };

  const toggleMember = (id: string) =>
    setSelectedMemberIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );

  return (
    <Layout title={project.name}>
      <div className="flex flex-col gap-4 pb-12">

        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-3">
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

        {/* ── Top 2-col: hero + details form (matches ClientDetail pattern) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Hero card */}
          <ProjectHeroCard project={project} />

          {/* Inline edit form */}
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
                <ButtonIcon iconName="edit" clickHandler={openEdit} />
              )
            }
          >
            <form
              id="project-edit-form"
              onSubmit={handleSubmit(onSubmit)}
              className="px-4 md:px-6 py-4 md:py-5 space-y-4"
            >
              <FormField label="Project Name" required={isEditing} error={errors.name?.message}>
                <input
                  {...register('name', { required: isEditing ? 'Required' : false })}
                  disabled={!isEditing}
                  className={fieldCls(!!errors.name)}
                />
              </FormField>

              <FormField label="Service" required={isEditing} error={errors.service?.message}>
                <Select
                  {...register('service', { required: isEditing })}
                  disabled={!isEditing}
                  hasError={!!errors.service}
                  className={DISABLED_SELECT_CLS}
                >
                  {(Object.entries(SERVICE_META) as [ServiceType, (typeof SERVICE_META)[ServiceType]][]).map(
                    ([key, meta]) => (
                      <Option key={key} value={key}>{meta.label}</Option>
                    ),
                  )}
                </Select>
              </FormField>

              {(isEditing ? hasPackages : ['website', 'software'].includes(project.service)) && (
                <FormField label="Package" error={errors.package?.message}>
                  <Select
                    {...register('package')}
                    disabled={!isEditing}
                    hasError={!!errors.package}
                    className={DISABLED_SELECT_CLS}
                  >
                    <Option value="">— None —</Option>
                    <Option value="essentials">Essentials</Option>
                    <Option value="growth">Growth</Option>
                    <Option value="premium">Premium</Option>
                  </Select>
                </FormField>
              )}

              <FormField label="Status" required={isEditing} error={errors.status?.message}>
                <Select
                  {...register('status', { required: isEditing })}
                  disabled={!isEditing}
                  hasError={!!errors.status}
                  className={DISABLED_SELECT_CLS}
                >
                  <Option value="active">Active</Option>
                  <Option value="paused">Paused</Option>
                  <Option value="completed">Completed</Option>
                </Select>
              </FormField>

              <FormField label="Timeline" error={errors.timeline?.message}>
                <input
                  {...register('timeline')}
                  disabled={!isEditing}
                  className={fieldCls(!!errors.timeline)}
                />
              </FormField>

              <FormField label="Current Phase">
                {isEditing ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 overflow-x-auto">
                    <PhaseSelector selectedIndex={currentPhaseIndex} onChange={setCurrentPhaseIndex} />
                  </div>
                ) : (
                  <div className="py-1">
                    {project.stages.find(s => s.status === 'current') ? (
                      (() => {
                        const cur  = project.stages.find(s => s.status === 'current')!;
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

              <FormField label="Client">
                {isEditing ? (
                  <ClientPicker clients={DEMO_CLIENTS} selectedId={selectedClientId} onSelect={setSelectedClientId} />
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

              <FormField label="Assigned Team">
                {isEditing ? (
                  <MemberPicker members={members} selectedIds={selectedMemberIds} onToggle={toggleMember} />
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

        {/* ── Phase Journey ── */}
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

        {/* ── Team & Financials ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <CardContent iconName="payments" title="Financials" variant="white">
            <div className="px-4 md:px-6 py-4 md:py-5 flex flex-col gap-2.5">
              {[
                { label: 'Agreed',    value: `$${project.agreedPayment.toLocaleString()}`, cls: 'text-gray-900'  },
                { label: 'Paid',      value: `$${project.paidPayment.toLocaleString()}`,   cls: 'text-green-600' },
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
              <span className="text-[11px] font-semibold text-gray-400">{allProjectTaskCount} total</span>
              <Select
                value={taskFilter}
                onChange={e => setTaskFilter(e.target.value as TaskFilter)}
                className="text-[11px] font-semibold text-gray-600 bg-gray-100 border-0 rounded-lg px-2.5 py-1.5 pr-6 cursor-pointer focus:ring-2 focus:ring-gray-200"
              >
                {(Object.keys(TASK_FILTER_LABELS) as TaskFilter[]).map(k => (
                  <Option key={k} value={k}>{TASK_FILTER_LABELS[k]}</Option>
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

        {/* ── Phase Documents ── */}
        <CardContent iconName="folder_open" title="Phase Documents" variant="white">
          <div className="px-4 md:px-6 py-4 flex flex-col gap-2">
            {ALL_STAGES.map(phaseKey => {
              const meta       = STAGE_META[phaseKey];
              const assignment = getPhaseAssignment(id!, phaseKey);
              const tplMeta    = assignment ? TEMPLATES.find(t => t.slug === assignment.templateSlug) : null;
              return (
                <div key={phaseKey} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <MaterialIcon name={meta.icon} size={14} className="text-gray-500" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 w-28 shrink-0">{meta.label}</span>

                  {assignment && tplMeta ? (
                    <>
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <MaterialIcon name={tplMeta.icon} size={13} className="text-gray-400 shrink-0" />
                        <span className="text-xs text-gray-500 truncate">{assignment.documentTitle}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/projects/${id}/templates/${assignment.id}`)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-gray-900 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Pencil size={11} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setRemoveDocId(assignment.id)}
                          className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-xs text-gray-300 italic">No document assigned</span>
                      <button
                        type="button"
                        onClick={() => setAssignPhase(phaseKey)}
                        className="text-[11px] font-semibold text-gray-500 hover:text-gray-900 px-2.5 py-1 rounded-lg border border-gray-200 hover:border-gray-400 transition-colors shrink-0"
                      >
                        + Assign
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>

        {/* ── Custom Timeline ── */}
        <CardContent
          iconName="timeline"
          title="Project Timeline"
          variant="white"
          action={
            !addingMilestone && (
              <button
                type="button"
                onClick={() => setAddingMilestone(true)}
                className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Plus size={13} />
                Add milestone
              </button>
            )
          }
        >
          <div className="px-4 md:px-6 py-4 space-y-0">

            {/* ── Add form ── */}
            {addingMilestone && (
              <div className="mb-5 bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">New milestone</p>

                {/* Icon + title row */}
                <div className="grid grid-cols-[160px_1fr] gap-3">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Icon</p>
                    <IconPicker value={newIcon} onChange={setNewIcon} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Title <span className="text-red-400">*</span></p>
                    <input
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      placeholder="e.g. Design handoff complete"
                      className="w-full bg-white border border-gray-200 text-gray-900 text-sm py-2.5 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                    />
                  </div>
                </div>

                {/* Date + description row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Date</p>
                    <input
                      value={newDate}
                      onChange={e => setNewDate(e.target.value)}
                      placeholder="e.g. Jan 15, 2025"
                      className="w-full bg-white border border-gray-200 text-gray-900 text-sm py-2.5 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Description <span className="text-gray-300">(optional)</span></p>
                    <input
                      value={newDescription}
                      onChange={e => setNewDescription(e.target.value)}
                      placeholder="Short note…"
                      className="w-full bg-white border border-gray-200 text-gray-900 text-sm py-2.5 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => { setAddingMilestone(false); setNewTitle(''); setNewDate(''); setNewDescription(''); setNewIcon('flag'); }}
                    className="px-3 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddMilestone}
                    disabled={!newTitle.trim()}
                    className="px-4 py-2 text-xs font-semibold text-white bg-gray-900 hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Add milestone
                  </button>
                </div>
              </div>
            )}

            {/* ── Timeline list ── */}
            {customTimeline.length === 0 && !addingMilestone ? (
              <div className="py-8 flex flex-col items-center gap-2 text-center">
                <MaterialIcon name="timeline" size={24} className="text-gray-200" />
                <p className="text-xs font-semibold text-gray-400">No milestones yet.</p>
                <p className="text-xs text-gray-300">Add key events and dates for this project.</p>
              </div>
            ) : (
              <div className="relative">
                {/* Vertical line */}
                {customTimeline.length > 1 && (
                  <div className="absolute left-[15px] top-4 bottom-4 w-px bg-gray-100" />
                )}

                <div className="space-y-0">
                  {customTimeline.map((event) => (
                    <div key={event.id} className="flex items-start gap-4 group relative pb-5 last:pb-0">
                      {/* Icon badge */}
                      <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 relative z-10">
                        <MaterialIcon name={event.icon} size={15} className="text-gray-600" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 leading-tight">{event.title}</p>
                            {event.description && (
                              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{event.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {event.date && (
                              <span className="text-[11px] font-semibold text-gray-400 whitespace-nowrap">{event.date}</span>
                            )}
                            <button
                              type="button"
                              onClick={() => setRemoveMilestoneId(event.id)}
                              className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>

      </div>

      {/* ── Task detail modal ── */}
      {detailTask && (
        <TaskDetailModal
          task={detailTask}
          onClose={() => setDetailTask(null)}
          onDelete={() => { setDetailTask(null); setConfirmTask(detailTask); }}
        />
      )}

      {/* ── Assign template modal ── */}
      {assignPhase && (
        <AssignTemplateModal
          phaseKey={assignPhase}
          onCancel={() => setAssignPhase(null)}
          onConfirm={slug => {
            const tplMeta = TEMPLATES.find(t => t.slug === slug)!;
            const now     = Date.now();
            const newAssId = `ta_${now}`;
            addAssignment({
              id:            newAssId,
              projectId:     id!,
              phaseKey:      assignPhase,
              templateSlug:  slug,
              documentTitle: tplMeta.title,
              blocks:        getDefaultBlocks(slug),
              createdAt:     now,
              updatedAt:     now,
            });
            setAssignPhase(null);
            navigate(`/admin/projects/${id}/templates/${newAssId}?phase=${assignPhase}&template=${slug}`);
          }}
        />
      )}

      {/* ── Remove document confirmation ── */}
      <ConfirmDialog
        isOpen={!!removeDocId}
        title="Remove document"
        message="This document assignment will be removed from the project phase."
        confirmLabel="Remove"
        variant="danger"
        onConfirm={() => { if (removeDocId) removeAssignment(removeDocId); setRemoveDocId(null); }}
        onCancel={() => setRemoveDocId(null)}
      />

      {/* ── Remove milestone confirmation ── */}
      <ConfirmDialog
        isOpen={!!removeMilestoneId}
        title="Remove milestone"
        message="This milestone will be removed from the project timeline."
        confirmLabel="Remove"
        variant="danger"
        onConfirm={() => { if (removeMilestoneId) handleRemoveMilestone(removeMilestoneId); }}
        onCancel={() => setRemoveMilestoneId(null)}
      />

      {/* ── Delete task confirmation ── */}
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
