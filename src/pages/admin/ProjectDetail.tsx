import { useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Briefcase, Check, Pencil, Trash2, Plus, UserRound } from 'lucide-react';
import Layout from '../../components/common/layout/layout';
import CardContent from '../../components/common/card-content/card-content';
import FormSidebar, { FormSidebarFooter } from '../../components/common/form-sidebar/form-sidebar';
import FormField, { inputCls } from '../../components/common/form-field/form-field';
import Select from '../../components/common/select/select';
import Option from '../../components/common/select/option';
import MaterialIcon from '../../components/common/material-icon/material-icon';
import ButtonIcon from '../../components/common/button-icon/button-icon';
import IconPicker from '../../components/common/icon-picker/icon-picker';
import ConfirmDialog from '../../components/common/confirm-dialog/confirm-dialog';
import ProjectHeroCard from '../../components/admin/project-hero-card/project-hero-card';
import { AvatarStack } from '../../components/common/avatar/avatar';
import Avatar from '../../components/common/avatar/avatar';
import ClientPicker from '../../components/admin/pickers/client-picker/client-picker';
import MemberPicker from '../../components/admin/pickers/member-picker/member-picker';
import TaskRow from '../../components/admin/task-card/task-row';
import TaskDetailModal from '../../components/admin/task-detail-modal/task-detail-modal';
import AssignTemplateModal from '../../components/admin/template-editor/assign-template-modal';
import { useProjectsStore } from '../../store/projects';
import { useTeamStore } from '../../store/team';
import { useTasksStore } from '../../store/tasks';
import { useTemplateAssignmentsStore } from '../../store/template-assignments';
import { useClientsStore } from '../../store/clients';
import { getProjectAccent, getPhaseProgress, SERVICE_META, DEFAULT_PHASE_DEFS } from '../../data/projects';
import { TEMPLATES } from '../../data/templates';
import type { ServiceType, PackageType, Phase, PhaseStatus } from '../../data/projects';
import type { Task, TaskStatus } from '../../data/tasks';

interface ProjectFormValues {
  name: string; service: ServiceType; package: PackageType | ''; status: 'active' | 'paused' | 'completed'; timeline: string;
}

const fieldCls = (hasError: boolean) =>
  inputCls(hasError) + ' disabled:bg-transparent disabled:border-transparent disabled:px-0 disabled:py-1 disabled:cursor-default disabled:text-gray-900 disabled:shadow-none disabled:focus:ring-0';

const DISABLED_SELECT_CLS = 'disabled:bg-transparent disabled:border-transparent disabled:px-0 disabled:py-1 disabled:cursor-default disabled:text-gray-900 disabled:appearance-none disabled:shadow-none';

type TaskFilter = 'all' | TaskStatus;
const TASK_FILTER_LABELS: Record<TaskFilter, string> = {
  all: 'All', todo: 'Todo', 'in-progress': 'In Progress', 'to-test': 'To Test', completed: 'Completed',
};

const PHASE_STATUS_CLS: Record<PhaseStatus, string> = {
  done:    'bg-green-50 text-green-700 border-green-200',
  active:  'bg-amber-50 text-amber-700 border-amber-200',
  pending: 'bg-gray-50  text-gray-400  border-gray-200',
};

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, updateProject, updatePhase, insertPhase, removePhase, completePhase, movePhase, setActivePhase } = useProjectsStore();
  const { clients }  = useClientsStore();
  const { members }  = useTeamStore();
  const { tasks, removeTask } = useTasksStore();
  const { getPhaseAssignment, removeAssignment } = useTemplateAssignmentsStore();
  const project = projects.find(p => p.id === id);

  const [isEditing, setIsEditing]               = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [taskFilter, setTaskFilter]             = useState<TaskFilter>('all');
  const [detailTask, setDetailTask]             = useState<Task | null>(null);
  const [confirmTask, setConfirmTask]           = useState<Task | null>(null);
  const [assignPhaseId, setAssignPhaseId]       = useState<string | null>(null);
  const [removeDocId, setRemoveDocId]           = useState<string | null>(null);
  const [isPhasesEditing, setIsPhasesEditing]   = useState(false);
  const [editingPhaseId, setEditingPhaseId]     = useState<string | null>(null);
  const [insertAfterIdx, setInsertAfterIdx]     = useState<number | null>(null);
  const [deletePhaseId, setDeletePhaseId]       = useState<string | null>(null);
  const [phaseTitle, setPhaseTitle]             = useState('');
  const [phaseIcon, setPhaseIcon]               = useState('flag');
  const [phaseDate, setPhaseDate]               = useState('');
  const [phaseDesc, setPhaseDesc]               = useState('');
  const [phaseStatus, setPhaseStatus]           = useState<PhaseStatus>('pending');
  const [phaseFlag, setPhaseFlag]               = useState(false);
  const [newPhaseTitle, setNewPhaseTitle]       = useState('');
  const [newPhaseIcon, setNewPhaseIcon]         = useState('flag');

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting, isDirty } } = useForm<ProjectFormValues>();
  const watchedService = watch('service');
  const hasPackages    = watchedService === 'website' || watchedService === 'software';

  if (!project) {
    return (
      <Layout title="Project">
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-12 h-12 rounded-full bg-(--color-surface) flex items-center justify-center">
            <Briefcase size={20} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">Project not found.</p>
          <Link to="/admin/projects" className="text-sm font-semibold text-gray-900 underline underline-offset-4">Back to Projects</Link>
        </div>
      </Layout>
    );
  }

  const accent         = getProjectAccent(project.service, project.package);
  const projectMembers = members.filter(m => project.assignedMemberIds?.includes(m.id));
  const progress       = getPhaseProgress(project.phases);
  const doneCount      = project.phases.filter(p => p.status === 'done').length;
  const remaining      = project.agreedPayment - project.paidPayment;
  const selectedClient = clients.find(c => c.id === (isEditing ? selectedClientId : project.clientId));

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const projectTasks = useMemo(() => {
    const base     = tasks.filter(t => t.projectId === id);
    const filtered = taskFilter === 'all' ? base : base.filter(t => t.status === taskFilter);
    return [...filtered].sort((a, b) => b.createdAt - a.createdAt);
  }, [tasks, id, taskFilter]);

  const allProjectTaskCount = useMemo(() => tasks.filter(t => t.projectId === id).length, [tasks, id]);

  const openEdit = () => {
    reset({ name: project.name, service: project.service, package: project.package ?? '', status: project.status, timeline: project.timeline });
    setSelectedClientId(project.clientId);
    setSelectedMemberIds(project.assignedMemberIds ?? []);
    setIsEditing(true);
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
    });
    setIsEditing(false);
  };

  const openPhaseEdit = (phase: Phase) => {
    setInsertAfterIdx(null);
    setEditingPhaseId(phase.id);
    setPhaseTitle(phase.title);
    setPhaseIcon(phase.icon);
    setPhaseDate(phase.targetDate ?? '');
    setPhaseDesc(phase.description ?? '');
    setPhaseStatus(phase.status);
    setPhaseFlag(phase.requiresClientAction);
  };

  const savePhaseEdit = () => {
    if (!editingPhaseId || !phaseTitle.trim()) return;
    const updates = {
      title: phaseTitle.trim(), icon: phaseIcon,
      targetDate: phaseDate.trim() || undefined, description: phaseDesc.trim() || undefined,
      status: phaseStatus, requiresClientAction: phaseFlag,
      ...(phaseFlag ? { clientCompleted: false } : {}),
    };
    updatePhase(project.id, editingPhaseId, updates);
    if (phaseStatus === 'active') setActivePhase(project.id, editingPhaseId);
    if (phaseStatus === 'done') completePhase(project.id, editingPhaseId);
    setEditingPhaseId(null);
  };

  const openInsert = (afterIndex: number) => {
    setEditingPhaseId(null);
    setInsertAfterIdx(afterIndex);
    setNewPhaseTitle('');
    setNewPhaseIcon('flag');
  };

  const confirmInsert = () => {
    if (!newPhaseTitle.trim()) return;
    insertPhase(project.id, insertAfterIdx!, {
      id: `ph_${Date.now()}`, title: newPhaseTitle.trim(), icon: newPhaseIcon,
      status: 'pending', requiresClientAction: false, clientCompleted: false,
    });
    setInsertAfterIdx(null);
  };

  const assignedPhase = assignPhaseId ? project.phases.find(p => p.id === assignPhaseId) : null;
  const editingPhase = editingPhaseId ? project.phases.find(p => p.id === editingPhaseId) : null;

  return (
    <Layout title={project.name}>
      <div className="flex flex-col gap-4 pb-12">

        {/* Breadcrumb */}
        <div className="flex items-center gap-3">
          <Link to="/admin/projects" className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-800 hover:border-gray-400 transition-colors shrink-0">
            <ArrowLeft size={15} />
          </Link>
          <span className="text-sm text-gray-400 font-medium">Projects</span>
          <span className="text-gray-200">/</span>
          <span className="text-sm font-semibold text-gray-700 truncate">{project.name}</span>
        </div>

        {/* Hero + Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProjectHeroCard project={project} />

          <CardContent iconName="edit_note" title="Project Details"
            action={
              isEditing ? (
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => { reset(); setIsEditing(false); }} className="text-[12px] font-semibold text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-100">Cancel</button>
                  <button form="project-edit-form" type="submit" disabled={isSubmitting || !isDirty} className="text-[12px] font-semibold text-white bg-(--color-ink) hover:bg-gray-700 disabled:opacity-40 px-3 py-1.5 rounded-lg transition-colors">
                    {isSubmitting ? 'Saving…' : 'Save'}
                  </button>
                </div>
              ) : <ButtonIcon iconName="edit" clickHandler={openEdit} />
            }
          >
            <form id="project-edit-form" onSubmit={handleSubmit(onSubmit)} className="px-4 md:px-6 py-4 md:py-5 space-y-4">
              <FormField label="Project Name" required={isEditing} error={errors.name?.message}>
                <input {...register('name', { required: isEditing ? 'Required' : false })} disabled={!isEditing} className={fieldCls(!!errors.name)} />
              </FormField>
              <FormField label="Service" required={isEditing}>
                <Select {...register('service', { required: isEditing })} disabled={!isEditing} className={DISABLED_SELECT_CLS}>
                  {(Object.entries(SERVICE_META) as [ServiceType, typeof SERVICE_META[ServiceType]][]).map(([key, meta]) => (
                    <Option key={key} value={key}>{meta.label}</Option>
                  ))}
                </Select>
              </FormField>
              {(isEditing ? hasPackages : ['website', 'software'].includes(project.service)) && (
                <FormField label="Package">
                  <Select {...register('package')} disabled={!isEditing} className={DISABLED_SELECT_CLS}>
                    <Option value="">— None —</Option>
                    <Option value="essentials">Essentials</Option>
                    <Option value="growth">Growth</Option>
                    <Option value="premium">Premium</Option>
                  </Select>
                </FormField>
              )}
              <FormField label="Status" required={isEditing}>
                <Select {...register('status', { required: isEditing })} disabled={!isEditing} className={DISABLED_SELECT_CLS}>
                  <Option value="active">Active</Option>
                  <Option value="paused">Paused</Option>
                  <Option value="completed">Completed</Option>
                </Select>
              </FormField>
              <FormField label="Timeline">
                <input {...register('timeline')} disabled={!isEditing} className={fieldCls(false)} />
              </FormField>
              <FormField label="Client">
                {isEditing ? (
                  <ClientPicker clients={clients} selectedId={selectedClientId} onSelect={setSelectedClientId} />
                ) : (
                  <div className="py-1">
                    {selectedClient ? (
                      <div className="flex items-center gap-2">
                        <Avatar name={selectedClient.displayName} id={selectedClient.id} size="sm" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{selectedClient.displayName}</p>
                          {selectedClient.companyName && <p className="text-xs text-gray-400">{selectedClient.companyName}</p>}
                        </div>
                      </div>
                    ) : <span className="text-sm text-gray-400">—</span>}
                  </div>
                )}
              </FormField>
              <FormField label="Assigned Team">
                {isEditing ? (
                  <MemberPicker members={members} selectedIds={selectedMemberIds} onToggle={mid => setSelectedMemberIds(prev => prev.includes(mid) ? prev.filter(x => x !== mid) : [...prev, mid])} />
                ) : (
                  <div className="py-1">
                    {projectMembers.length > 0
                      ? <AvatarStack members={projectMembers.map(m => ({ name: m.name, id: m.id }))} size="sm" limit={3} />
                      : <span className="text-sm text-gray-400">No team assigned</span>
                    }
                  </div>
                )}
              </FormField>
            </form>
          </CardContent>
        </div>

        {/* Phases */}
        <CardContent
          iconName="route"
          title="Timeline"
          action={
            <div className="flex flex-wrap items-center justify-end gap-1.5">
              <span className="hidden sm:inline text-[11px] font-semibold text-gray-400">{doneCount}/{project.phases.length} done · {progress}%</span>
              <button type="button" onClick={() => openInsert(project.phases.length - 1)} className="hidden sm:flex items-center gap-1 text-[12px] font-semibold text-gray-600 hover:text-gray-900 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <Plus size={13} /> Add
              </button>
              <button type="button" onClick={() => setIsPhasesEditing(v => !v)} className={`text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-colors ${isPhasesEditing ? 'bg-(--color-ink) text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                {isPhasesEditing ? 'Done' : 'Manage'}
              </button>
            </div>
          }
          bodyClassName="px-4 md:px-6 py-4 md:py-5"
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 sm:hidden">
              <span className="text-[11px] font-semibold text-gray-400">{doneCount}/{project.phases.length} done · {progress}%</span>
              <button type="button" onClick={() => openInsert(project.phases.length - 1)} className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-gray-700 border border-gray-100">
                <Plus size={13} /> Add phase
              </button>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4">
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {project.phases.map((phase, i) => {
                  const isDone = phase.status === 'done';
                  const isActive = phase.status === 'active';
                  return (
                    <button
                      key={phase.id}
                      type="button"
                      onClick={() => openPhaseEdit(phase)}
                      className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-bold transition-colors ${
                        isDone
                          ? 'bg-(--color-ink) text-white'
                          : isActive
                            ? 'bg-amber-500 text-white'
                            : 'bg-white text-gray-400 border border-gray-100 hover:text-gray-700'
                      }`}
                    >
                      {isDone ? <Check size={11} strokeWidth={3} /> : <MaterialIcon name={phase.icon} size={12} />}
                      <span>{i + 1}. {phase.title}</span>
                      {phase.requiresClientAction && !isDone && <UserRound size={10} />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="hidden grid-cols-[minmax(260px,1fr)_minmax(220px,340px)_170px] items-center gap-3 px-2 text-[10px] font-bold uppercase tracking-widest text-gray-300 lg:grid">
              <span>Phase</span>
              <span>Document</span>
              <span className="text-right">Action</span>
            </div>

            <div className="grid gap-2.5">
              {project.phases.map((phase, i) => {
                const assignment = getPhaseAssignment(id!, phase.id);
                const tplMeta = assignment ? TEMPLATES.find(t => t.slug === assignment.templateSlug) : null;
                const isActive = phase.status === 'active';
                const isDone = phase.status === 'done';
                return (
                  <div key={phase.id} className={`group rounded-[14px] border bg-white transition-colors ${
                    isActive ? 'border-amber-300 bg-amber-50/30 shadow-[0_0_0_1px_rgba(251,191,36,0.18)]' : 'border-gray-100 hover:border-gray-200'
                  }`}>
                    <div className="grid gap-3 px-3 py-3 sm:px-4 lg:grid-cols-[minmax(260px,1fr)_minmax(220px,340px)_170px] lg:items-center">
                      <button type="button" onClick={() => openPhaseEdit(phase)} className="flex min-w-0 items-center gap-3 text-left">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isDone ? 'bg-(--color-ink) text-white' :
                          isActive ? 'bg-amber-50 text-amber-600' :
                          'bg-gray-50 text-gray-300'
                        }`}>
                          {isDone ? <Check size={15} strokeWidth={2.6} /> : <MaterialIcon name={phase.icon} size={15} />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-300 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                            <p className={`truncate text-sm font-bold ${isDone ? 'text-gray-500' : 'text-gray-900'}`}>{phase.title}</p>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-[6px] border ${PHASE_STATUS_CLS[phase.status]}`}>
                              {phase.status.charAt(0).toUpperCase() + phase.status.slice(1)}
                            </span>
                            {phase.requiresClientAction && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-violet-50 text-violet-600 border border-violet-200">
                                <UserRound size={8} /> Client input
                              </span>
                            )}
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                              <MaterialIcon name="schedule" size={9} />
                              {phase.targetDate || 'No target date'}
                            </span>
                            {phase.description && <span className="text-[10px] text-gray-400 truncate max-w-80">{phase.description}</span>}
                          </div>
                        </div>
                      </button>

                      {assignment && tplMeta ? (
                        <button type="button" onClick={() => navigate(`/admin/projects/${id}/templates/${assignment.id}`)} className="flex min-w-0 items-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5 text-left hover:bg-gray-100">
                          <MaterialIcon name={tplMeta.icon} size={15} className="text-gray-400 shrink-0" />
                          <span className="truncate text-xs font-bold text-gray-600">{assignment.documentTitle}</span>
                          <MaterialIcon name="edit" size={13} className="ml-auto text-gray-300 shrink-0" />
                        </button>
                      ) : (
                        <button type="button" onClick={() => setAssignPhaseId(phase.id)} className="rounded-xl border border-dashed border-gray-200 px-3 py-2.5 text-left text-xs font-bold text-gray-400 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700">
                          Assign template document
                        </button>
                      )}

                      <div className="flex items-center justify-end gap-1.5">
                        {isActive && !isDone && (
                          <button type="button" onClick={() => completePhase(project.id, phase.id)} className="rounded-lg bg-(--color-ink) px-3 py-2 text-xs font-bold text-white hover:bg-gray-800">
                            Complete & advance
                          </button>
                        )}
                        {!isActive && !isDone && !isPhasesEditing && (
                          <button type="button" onClick={() => setActivePhase(project.id, phase.id)} className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-200">
                            Set active
                          </button>
                        )}
                        {isPhasesEditing ? (
                          <>
                            <button type="button" title="Move up" disabled={i === 0} onClick={() => movePhase(project.id, phase.id, 'up')} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
                              <MaterialIcon name="arrow_upward" size={14} />
                            </button>
                            <button type="button" title="Move down" disabled={i === project.phases.length - 1} onClick={() => movePhase(project.id, phase.id, 'down')} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
                              <MaterialIcon name="arrow_downward" size={14} />
                            </button>
                            <button type="button" onClick={() => setDeletePhaseId(phase.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                              <Trash2 size={13} />
                            </button>
                          </>
                        ) : (
                          <button type="button" onClick={() => openPhaseEdit(phase)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-gray-700 hover:bg-gray-100">
                            <Pencil size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

            {project.phases.length === 0 && (
              <div className="py-8 flex flex-col items-center gap-3 text-center">
                <MaterialIcon name="checklist" size={24} className="text-gray-200" />
                <p className="text-xs font-semibold text-gray-400">No phases yet. Add a phase or start with a default timeline.</p>
                <button type="button" onClick={() => openInsert(-1)} className="px-3 py-2 text-xs font-semibold text-white bg-(--color-ink) rounded-xl">Add phase</button>
                <div className="flex flex-wrap gap-2 justify-center mt-1">
                  {DEFAULT_PHASE_DEFS.map((def, i) => (
                    <button key={def.title} type="button" onClick={() => insertPhase(project.id, i - 1, { id: `ph_${Date.now()}_${i}`, title: def.title, icon: def.icon, status: i === 0 ? 'active' : 'pending', requiresClientAction: false, clientCompleted: false })}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                      <MaterialIcon name={def.icon} size={11} /> {def.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          </div>
        </CardContent>

        {/* Team & Financials */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CardContent iconName="group" title="Assigned Team">
            {projectMembers.length === 0 ? (
              <div className="px-4 md:px-6 py-4"><p className="text-sm text-gray-400">No team members assigned.</p></div>
            ) : (
              <div className="px-4 md:px-6 py-4 flex flex-col gap-3">
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

          <CardContent iconName="payments" title="Financials">
            <div className="px-4 md:px-6 py-4 flex flex-col gap-2.5">
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
                  <Check size={11} strokeWidth={3} /> Project fully settled
                </div>
              )}
            </div>
          </CardContent>
        </div>

        {/* Tasks */}
        <CardContent iconName="task_alt" title="Tasks"
          action={
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-gray-400">{allProjectTaskCount} total</span>
              <Select value={taskFilter} onChange={e => setTaskFilter(e.target.value as TaskFilter)} className="text-[11px] font-semibold text-gray-600 bg-gray-100 border-0 rounded-lg px-2.5 py-1.5 pr-6 cursor-pointer">
                {(Object.keys(TASK_FILTER_LABELS) as TaskFilter[]).map(k => <Option key={k} value={k}>{TASK_FILTER_LABELS[k]}</Option>)}
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
                <TaskRow key={task.id} task={task} showProject={false} showStatus onClick={() => setDetailTask(task)} onDelete={() => setConfirmTask(task)} />
              ))}
            </div>
          )}
        </CardContent>

      </div>

      {detailTask && (
        <TaskDetailModal task={detailTask} onClose={() => setDetailTask(null)} onDelete={() => { setDetailTask(null); setConfirmTask(detailTask); }} />
      )}

      <FormSidebar
        isOpen={!!editingPhase || insertAfterIdx !== null}
        onClose={() => { setEditingPhaseId(null); setInsertAfterIdx(null); }}
        title={editingPhase ? 'Edit Phase' : 'Add Phase'}
        description={editingPhase ? editingPhase.title : 'Create a new step in this project timeline.'}
        width="md"
      >
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            {editingPhase ? (
              <>
                <div className="rounded-2xl bg-(--color-surface) border border-gray-100 p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${editingPhase.status === 'active' ? `${accent.bg} ${accent.iconText}` : 'bg-white text-gray-500'}`}>
                    <MaterialIcon name={editingPhase.icon} size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-400">Timeline phase</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{editingPhase.title}</p>
                  </div>
                </div>

                <FormField label="Icon">
                  <IconPicker value={phaseIcon} onChange={setPhaseIcon} />
                </FormField>

                <FormField label="Title" required>
                  <input value={phaseTitle} onChange={e => setPhaseTitle(e.target.value)} className={inputCls(!phaseTitle.trim())} />
                </FormField>

                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Status">
                    <Select value={phaseStatus} onChange={e => setPhaseStatus(e.target.value as PhaseStatus)}>
                      <Option value="pending">Pending</Option>
                      <Option value="active">Active</Option>
                      <Option value="done">Done</Option>
                    </Select>
                  </FormField>
                  <FormField label="Target Date">
                    <input value={phaseDate} onChange={e => setPhaseDate(e.target.value)} placeholder="e.g. Jun 15, 2026" className={inputCls(false)} />
                  </FormField>
                </div>

                <FormField label="Notes">
                  <textarea value={phaseDesc} onChange={e => setPhaseDesc(e.target.value)} rows={3} placeholder="Short note for this phase" className={`${inputCls(false)} resize-none`} />
                </FormField>

                <button type="button" onClick={() => setPhaseFlag(v => !v)} className="w-full flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white px-4 py-3 text-left hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Client action required</p>
                    <p className="text-xs text-gray-400">Show this phase as client-owned until completion.</p>
                  </div>
                  <div className={`w-9 h-5 rounded-full relative transition-colors shrink-0 ${phaseFlag ? 'bg-violet-500' : 'bg-gray-200'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${phaseFlag ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </div>
                </button>

                {(() => {
                  const phaseDoc = getPhaseAssignment(id!, editingPhase.id);
                  const tpl = phaseDoc ? TEMPLATES.find(t => t.slug === phaseDoc.templateSlug) : null;
                  return (
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Document</p>
                      {phaseDoc && tpl ? (
                        <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-(--color-surface) px-3 py-3">
                          <MaterialIcon name={tpl.icon} size={16} className="text-gray-500 shrink-0" />
                          <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-700">{phaseDoc.documentTitle}</span>
                          <button type="button" onClick={() => navigate(`/admin/projects/${id}/templates/${phaseDoc.id}`)} className="text-xs font-semibold text-gray-600 hover:text-gray-900">Edit</button>
                          <button type="button" onClick={() => setRemoveDocId(phaseDoc.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => { setAssignPhaseId(editingPhase.id); setEditingPhaseId(null); }} className="w-full rounded-2xl border border-dashed border-gray-300 px-4 py-3 text-sm font-semibold text-gray-500 hover:border-gray-400 hover:text-gray-800">
                          Assign template document
                        </button>
                      )}
                    </div>
                  );
                })()}
              </>
            ) : (
              <>
                <div className="rounded-2xl bg-(--color-surface) border border-gray-100 p-4">
                  <p className="text-xs font-semibold text-gray-400">Position</p>
                  <p className="mt-1 text-sm font-bold text-gray-900">
                    {insertAfterIdx === null || insertAfterIdx < 0
                      ? 'At the start of the timeline'
                      : `After ${project.phases[insertAfterIdx]?.title ?? 'the selected phase'}`}
                  </p>
                </div>
                <FormField label="Icon">
                  <IconPicker value={newPhaseIcon} onChange={setNewPhaseIcon} />
                </FormField>
                <FormField label="Title" required>
                  <input value={newPhaseTitle} onChange={e => setNewPhaseTitle(e.target.value)} placeholder="e.g. Client approval" className={inputCls(!newPhaseTitle.trim())} />
                </FormField>
              </>
            )}
          </div>

          <FormSidebarFooter>
            <button type="button" onClick={() => { setEditingPhaseId(null); setInsertAfterIdx(null); }} className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
            <button
              type="button"
              onClick={editingPhase ? savePhaseEdit : confirmInsert}
              disabled={editingPhase ? !phaseTitle.trim() : !newPhaseTitle.trim()}
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-(--color-ink) hover:bg-gray-800 rounded-xl transition-colors disabled:opacity-40"
            >
              {editingPhase ? 'Save Phase' : 'Add Phase'}
            </button>
          </FormSidebarFooter>
        </div>
      </FormSidebar>

      {assignPhaseId && assignedPhase && (
        <AssignTemplateModal
          phaseTitle={assignedPhase.title}
          onCancel={() => setAssignPhaseId(null)}
          onConfirm={slug => {
            setAssignPhaseId(null);
            navigate(`/admin/projects/${id}/templates/new?phase=${assignPhaseId}&template=${slug}`);
          }}
        />
      )}

      <ConfirmDialog isOpen={!!removeDocId} title="Remove document" message="This document assignment will be removed from the phase." confirmLabel="Remove" variant="danger"
        onConfirm={() => { if (removeDocId) removeAssignment(removeDocId); setRemoveDocId(null); }}
        onCancel={() => setRemoveDocId(null)}
      />
      <ConfirmDialog isOpen={!!deletePhaseId} title="Delete phase" message="This phase will be permanently removed." confirmLabel="Delete" variant="danger"
        onConfirm={() => { if (deletePhaseId) removePhase(project.id, deletePhaseId); setDeletePhaseId(null); }}
        onCancel={() => setDeletePhaseId(null)}
      />
      <ConfirmDialog isOpen={!!confirmTask} title="Delete task" message={confirmTask ? `"${confirmTask.title}" will be permanently removed.` : ''} confirmLabel="Delete" variant="danger"
        onConfirm={() => { if (confirmTask) removeTask(confirmTask.id); setConfirmTask(null); }}
        onCancel={() => setConfirmTask(null)}
      />
    </Layout>
  );
};

export default ProjectDetail;
