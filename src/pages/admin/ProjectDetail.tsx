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
import ConfirmDialog from '../../components/common/confirm-dialog/confirm-dialog';
import ProjectHeroCard from '../../components/admin/project-hero-card/project-hero-card';
import { PhaseTrack } from '../../components/admin/project-progress/project-progress';
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
import { getDefaultBlocks } from '../../data/template-blocks';
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
  const { projects, updateProject, updatePhase, insertPhase, removePhase } = useProjectsStore();
  const { clients }  = useClientsStore();
  const { members }  = useTeamStore();
  const { tasks, removeTask } = useTasksStore();
  const { getPhaseAssignment, addAssignment, removeAssignment } = useTemplateAssignmentsStore();
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
    updatePhase(project.id, editingPhaseId, {
      title: phaseTitle.trim(), icon: phaseIcon,
      targetDate: phaseDate.trim() || undefined, description: phaseDesc.trim() || undefined,
      status: phaseStatus, requiresClientAction: phaseFlag,
    });
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

        {/* Phases — view mode shows pill track, edit mode shows vertical editor */}
        <CardContent
          iconName="route"
          title="Phases"
          action={
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-gray-400">{doneCount}/{project.phases.length} done · {progress}%</span>
              {isPhasesEditing ? (
                <>
                  <button type="button" onClick={() => openInsert(project.phases.length - 1)} className="flex items-center gap-1 text-[12px] font-semibold text-gray-500 hover:text-gray-800 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                    <Plus size={13} /> Add
                  </button>
                  <button type="button" onClick={() => { setIsPhasesEditing(false); setEditingPhaseId(null); setInsertAfterIdx(null); }} className="text-[12px] font-semibold text-white bg-(--color-ink) hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors">
                    Done
                  </button>
                </>
              ) : (
                <ButtonIcon iconName="edit" clickHandler={() => setIsPhasesEditing(true)} />
              )}
            </div>
          }
          bodyClassName={isPhasesEditing ? undefined : 'px-4 md:px-6 py-4 md:py-5'}
        >
          {!isPhasesEditing ? (
            /* ── View mode: same pill display as Phase Overview ── */
            <PhaseTrack phases={project.phases} accent={accent} size="md" />
          ) : (
            /* ── Edit mode: vertical editable list ── */
          <div className="px-4 md:px-6 py-4 space-y-0">
            {project.phases.map((phase, i) => {
              const isEditing_ = editingPhaseId === phase.id;
              return (
                <div key={phase.id}>
                  {i > 0 && (
                    <div className="flex items-center gap-2 py-0.5 group">
                      <div className="flex-1 h-px bg-gray-100" />
                      {insertAfterIdx !== i - 1 && (
                        <button type="button" onClick={() => openInsert(i - 1)} className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all">
                          <Plus size={10} />
                        </button>
                      )}
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>
                  )}

                  {insertAfterIdx === i - 1 && (
                    <div className="mb-3 bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Insert phase after "{project.phases[i - 1].title}"</p>
                      <div className="grid grid-cols-[160px_1fr] gap-3">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Icon</p>
                          <IconPicker value={newPhaseIcon} onChange={setNewPhaseIcon} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Phase Title <span className="text-red-400">*</span></p>
                          <input value={newPhaseTitle} onChange={e => setNewPhaseTitle(e.target.value)} placeholder="e.g. Approval" className="w-full bg-white border border-gray-200 text-gray-900 text-sm py-2.5 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setInsertAfterIdx(null)} className="px-3 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors">Cancel</button>
                        <button type="button" onClick={confirmInsert} disabled={!newPhaseTitle.trim()} className="px-4 py-2 text-xs font-semibold text-white bg-gray-900 hover:bg-gray-700 rounded-xl disabled:opacity-40 transition-colors">Insert</button>
                      </div>
                    </div>
                  )}

                  <div className={`rounded-2xl transition-colors ${isEditing_ ? 'bg-gray-50 border border-gray-200' : 'hover:bg-gray-50'}`}>
                    {isEditing_ ? (
                      <div className="p-4 space-y-4">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Editing phase</p>
                          <button type="button" onClick={() => setEditingPhaseId(null)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400">
                            <MaterialIcon name="close" size={14} />
                          </button>
                        </div>
                        <div className="grid grid-cols-[160px_1fr] gap-3">
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Icon</p>
                            <IconPicker value={phaseIcon} onChange={setPhaseIcon} />
                          </div>
                          <div className="space-y-3">
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Title <span className="text-red-400">*</span></p>
                              <input value={phaseTitle} onChange={e => setPhaseTitle(e.target.value)} className="w-full bg-white border border-gray-200 text-gray-900 text-sm py-2.5 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Status</p>
                                <select value={phaseStatus} onChange={e => setPhaseStatus(e.target.value as PhaseStatus)} className="w-full bg-white border border-gray-200 text-gray-900 text-sm py-2.5 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200">
                                  <option value="pending">Pending</option>
                                  <option value="active">Active</option>
                                  <option value="done">Done</option>
                                </select>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Target Date</p>
                                <input value={phaseDate} onChange={e => setPhaseDate(e.target.value)} placeholder="e.g. Jun 15, 2026" className="w-full bg-white border border-gray-200 text-gray-900 text-sm py-2.5 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Notes (optional)</p>
                          <input value={phaseDesc} onChange={e => setPhaseDesc(e.target.value)} placeholder="Short note…" className="w-full bg-white border border-gray-200 text-gray-900 text-sm py-2.5 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200" />
                        </div>
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                          <div onClick={() => setPhaseFlag(v => !v)} className={`w-9 h-5 rounded-full relative transition-colors cursor-pointer ${phaseFlag ? 'bg-violet-500' : 'bg-gray-200'}`}>
                            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${phaseFlag ? 'translate-x-4' : 'translate-x-0.5'}`} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Client action required</p>
                            <p className="text-[11px] text-gray-400">Flag this phase for the client to complete and mark as done</p>
                          </div>
                          {phaseFlag && <MaterialIcon name="person" size={14} className="text-violet-500 shrink-0 ml-auto" />}
                        </label>
                        {/* Document assignment for this phase */}
                        {(() => {
                          const phaseDoc = getPhaseAssignment(id!, phase.id);
                          const tpl      = phaseDoc ? TEMPLATES.find(t => t.slug === phaseDoc.templateSlug) : null;
                          return (
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                Template Document
                              </p>
                              {phaseDoc && tpl ? (
                                <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-3 py-2.5">
                                  <MaterialIcon name={tpl.icon} size={14} className="text-gray-500 shrink-0" />
                                  <span className="text-sm font-medium text-gray-700 flex-1 truncate">
                                    {phaseDoc.documentTitle}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => navigate(`/admin/projects/${id}/templates/${phaseDoc.id}`)}
                                    className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-gray-900 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                                  >
                                    <Pencil size={11} /> Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setRemoveDocId(phaseDoc.id)}
                                    className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => { setAssignPhaseId(phase.id); setEditingPhaseId(null); }}
                                  className="flex items-center justify-center gap-2 w-full text-[11px] font-semibold text-gray-400 hover:text-gray-700 border border-dashed border-gray-300 hover:border-gray-400 rounded-xl py-2.5 transition-colors"
                                >
                                  <Plus size={12} /> Assign template document
                                </button>
                              )}
                            </div>
                          );
                        })()}

                        <div className="flex gap-2 pt-1">
                          <button type="button" onClick={() => setEditingPhaseId(null)} className="px-3 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl">Cancel</button>
                          <button type="button" onClick={savePhaseEdit} disabled={!phaseTitle.trim()} className="px-4 py-2 text-xs font-semibold text-white bg-gray-900 hover:bg-gray-700 rounded-xl disabled:opacity-40">Save changes</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 px-3 py-3 group">
                        <span className="text-[10px] font-bold text-gray-300 w-5 text-right shrink-0">{i + 1}</span>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          phase.status === 'done'   ? 'bg-(--color-ink) text-white' :
                          phase.status === 'active' ? `${accent.bg} ${accent.iconText}` :
                          'bg-gray-50 text-gray-300'
                        }`}>
                          {phase.status === 'done' ? <Check size={14} strokeWidth={2.5} /> : <MaterialIcon name={phase.icon} size={14} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className={`text-sm font-semibold leading-tight ${phase.status === 'done' ? 'text-gray-400' : phase.status === 'active' ? 'text-gray-900' : 'text-gray-400'}`}>{phase.title}</p>
                            {phase.requiresClientAction && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-violet-50 text-violet-600 border border-violet-200 shrink-0">
                                <MaterialIcon name="person" size={8} /> Client
                              </span>
                            )}
                            {phase.clientCompleted && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-green-50 text-green-600 border border-green-200 shrink-0">
                                <Check size={8} strokeWidth={3} /> Confirmed
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-[5px] border ${PHASE_STATUS_CLS[phase.status]}`}>
                              {phase.status.charAt(0).toUpperCase() + phase.status.slice(1)}
                            </span>
                            {phase.targetDate && (
                              <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                                <MaterialIcon name="schedule" size={9} /> {phase.targetDate}
                              </span>
                            )}
                            {phase.description && <span className="text-[10px] text-gray-400 truncate max-w-40">{phase.description}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button type="button" onClick={() => openPhaseEdit(phase)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100">
                            <Pencil size={12} />
                          </button>
                          <button type="button" onClick={() => setDeletePhaseId(phase.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {insertAfterIdx === project.phases.length - 1 && (
              <div className="mt-3 bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Add phase at end</p>
                <div className="grid grid-cols-[160px_1fr] gap-3">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Icon</p>
                    <IconPicker value={newPhaseIcon} onChange={setNewPhaseIcon} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Phase Title <span className="text-red-400">*</span></p>
                    <input value={newPhaseTitle} onChange={e => setNewPhaseTitle(e.target.value)} placeholder="e.g. Sign-off" className="w-full bg-white border border-gray-200 text-gray-900 text-sm py-2.5 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setInsertAfterIdx(null)} className="px-3 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl">Cancel</button>
                  <button type="button" onClick={confirmInsert} disabled={!newPhaseTitle.trim()} className="px-4 py-2 text-xs font-semibold text-white bg-gray-900 hover:bg-gray-700 rounded-xl disabled:opacity-40">Add phase</button>
                </div>
              </div>
            )}

            {project.phases.length === 0 && (
              <div className="py-8 flex flex-col items-center gap-3 text-center">
                <MaterialIcon name="checklist" size={24} className="text-gray-200" />
                <p className="text-xs font-semibold text-gray-400">No phases yet. Add phases to track progress.</p>
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
          )}
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

        {/* Phase Documents */}
        <CardContent iconName="folder_open" title="Phase Documents">
          <div className="px-4 md:px-6 py-4 flex flex-col gap-2">
            {project.phases.map(phase => {
              const assignment = getPhaseAssignment(id!, phase.id);
              const tplMeta    = assignment ? TEMPLATES.find(t => t.slug === assignment.templateSlug) : null;
              return (
                <div key={phase.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <MaterialIcon name={phase.icon} size={14} className="text-gray-500" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 w-28 shrink-0 truncate">{phase.title}</span>
                  {assignment && tplMeta ? (
                    <>
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <MaterialIcon name={tplMeta.icon} size={13} className="text-gray-400 shrink-0" />
                        <span className="text-xs text-gray-500 truncate">{assignment.documentTitle}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button type="button" onClick={() => navigate(`/admin/projects/${id}/templates/${assignment.id}`)} className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-gray-900 px-2 py-1 rounded-lg hover:bg-gray-100">
                          <Pencil size={11} /> Edit
                        </button>
                        <button type="button" onClick={() => setRemoveDocId(assignment.id)} className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-xs text-gray-300 italic">No document assigned</span>
                      <button type="button" onClick={() => setAssignPhaseId(phase.id)} className="text-[11px] font-semibold text-gray-500 hover:text-gray-900 px-2.5 py-1 rounded-lg border border-gray-200 hover:border-gray-400 transition-colors shrink-0">
                        + Assign
                      </button>
                    </>
                  )}
                </div>
              );
            })}
            {project.phases.length === 0 && (
              <p className="text-sm text-gray-400 py-4">No phases — add phases above to assign documents.</p>
            )}
          </div>
        </CardContent>

      </div>

      {detailTask && (
        <TaskDetailModal task={detailTask} onClose={() => setDetailTask(null)} onDelete={() => { setDetailTask(null); setConfirmTask(detailTask); }} />
      )}

      {assignPhaseId && assignedPhase && (
        <AssignTemplateModal
          phaseTitle={assignedPhase.title}
          onCancel={() => setAssignPhaseId(null)}
          onConfirm={slug => {
            const tplMeta  = TEMPLATES.find(t => t.slug === slug)!;
            const now      = Date.now();
            const newAssId = `ta_${now}`;
            addAssignment({ id: newAssId, projectId: id!, phaseKey: assignPhaseId, templateSlug: slug, documentTitle: tplMeta.title, blocks: getDefaultBlocks(slug), createdAt: now, updatedAt: now });
            setAssignPhaseId(null);
            navigate(`/admin/projects/${id}/templates/${newAssId}?phase=${assignPhaseId}&template=${slug}`);
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
