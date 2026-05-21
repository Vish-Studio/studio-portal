import { useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Briefcase, Check, Pencil, Trash2 } from '@/src/shared/components/material-icon/material-lucide-icons';
import DashboardLayout from '@/src/layouts/DashboardLayout';
import CardContent from '@/src/shared/components/card-content/card-content';
import FormSidebar, { FormSidebarActions, FormSidebarFooter } from '@/src/shared/components/form-sidebar/form-sidebar';
import IconPicker from '@/src/features/projects/components/icon-picker/icon-picker';
import Fab from '@/src/shared/components/button-fab/button-fab';
import ProjectHeroCard from '../components/project-hero-card/project-hero-card';
import ProjectTimeline from '../components/project-timeline/project-timeline';
import { Avatar, AvatarStack, Breadcrumb, Button, ButtonIcon, ConfirmDialog, FormField, inputCls, MaterialIcon, Option, Select } from '@/src/shared/components';
import { ClientPicker } from '@/src/features/clients';
import { MemberPicker } from '@/src/shared/components';
import { TaskDetailModal, TaskRow, useTasksStore, type Task, type TaskStatus } from '@/src/features/tasks';
import { AssignTemplateModal } from '@/src/features/templates';
import { useProjectsStore } from '../stores/projectStore';
import { useTeamStore } from '@/src/features/team';
import { useTemplateAssignmentsStore } from '@/src/features/templates';
import { useClientsStore } from '@/src/features/clients';
import { useDiscoveryStore } from '@/src/features/discovery';
import { useAuthStore } from '@/src/features/auth';
import { getProjectAccent, SERVICE_META, type ServiceType, type PackageType, type Phase, type PhaseStatus } from '../types';
import { TEMPLATES } from '@/src/features/templates';

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

const sameStringSet = (left: string[] = [], right: string[] = []) => (
  left.length === right.length && left.every(value => right.includes(value))
);

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
  const [editSidebarOpen, setEditSidebarOpen]   = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [taskFilter, setTaskFilter]             = useState<TaskFilter>('all');
  const [detailTask, setDetailTask]             = useState<Task | null>(null);
  const [confirmTask, setConfirmTask]           = useState<Task | null>(null);
  const [assignPhaseId, setAssignPhaseId]       = useState<string | null>(null);
  const [removeDocId, setRemoveDocId]           = useState<string | null>(null);
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
      <DashboardLayout title="Project">
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-12 h-12 rounded-full bg-(--color-surface) flex items-center justify-center">
            <Briefcase size={20} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">Project not found.</p>
          <Link to="/admin/projects" className="text-sm font-semibold text-gray-900 underline underline-offset-4">Back to Projects</Link>
        </div>
      </DashboardLayout>
    );
  }

  const profile        = useAuthStore(s => s.profile);
  const { getDiscovery } = useDiscoveryStore();
  const discovery      = getDiscovery(project.id);
  const discoveryStatus = discovery?.status ?? 'not_started';

  const accent         = getProjectAccent(project.service, project.package);
  const projectMembers = members.filter(m => project.assignedMemberIds?.includes(m.id));
  const remaining      = project.agreedPayment - project.paidPayment;
  const selectedClient = clients.find(c => c.id === (isEditing ? selectedClientId : project.clientId));
  const hasPickerChanges = isEditing && (
    selectedClientId !== project.clientId ||
    !sameStringSet(selectedMemberIds, project.assignedMemberIds ?? [])
  );
  const hasProjectChanges = isDirty || hasPickerChanges;

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

  const openMobileEdit = () => {
    openEdit();
    setEditSidebarOpen(true);
  };

  const cancelEdit = () => {
    reset({ name: project.name, service: project.service, package: project.package ?? '', status: project.status, timeline: project.timeline });
    setSelectedClientId(project.clientId);
    setSelectedMemberIds(project.assignedMemberIds ?? []);
    setIsEditing(false);
    setEditSidebarOpen(false);
  };

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  const handleMemberToggle = (memberId: string) => {
    setSelectedMemberIds(prev => prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]);
  };

  const onSubmit = async (data: ProjectFormValues) => {
    await updateProject(project.id, {
      name:              data.name,
      service:           data.service,
      package:           hasPackages && data.package ? (data.package as PackageType) : undefined,
      status:            data.status,
      timeline:          data.timeline,
      clientId:          selectedClientId,
      assignedMemberIds: selectedMemberIds,
    });
    reset(data);
    setIsEditing(false);
    setEditSidebarOpen(false);
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
  const hasPhaseChanges = editingPhase
    ? phaseTitle.trim() !== editingPhase.title ||
      phaseIcon !== editingPhase.icon ||
      phaseDate.trim() !== (editingPhase.targetDate ?? '') ||
      phaseDesc.trim() !== (editingPhase.description ?? '') ||
      phaseStatus !== editingPhase.status ||
      phaseFlag !== editingPhase.requiresClientAction
    : Boolean(newPhaseTitle.trim());

  return (
    <DashboardLayout title={project.name}>
      <div className="flex flex-col gap-4 pb-12">

        <Breadcrumb previousLink="/admin/projects" previousPageName="Projects" currentPageName={project.name} />

        {/* Hero + Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProjectHeroCard project={project} />

          <CardContent iconName="edit_note" title="Project Details" className="hidden overflow-visible md:flex"
            action={
              isEditing ? (
                <div className="flex items-center gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={cancelEdit}>Cancel</Button>
                  <Button form="project-edit-form" type="submit" size="sm" disabled={isSubmitting || !hasProjectChanges} loading={isSubmitting}>
                    {isSubmitting ? 'Saving…' : 'Save'}
                  </Button>
                </div>
              ) : <ButtonIcon iconName="edit" label="Edit project details" clickHandler={openEdit} />
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
                  <ClientPicker clients={clients} selectedId={selectedClientId} onSelect={handleClientSelect} />
                ) : (
                  <div className="py-1">
                    {selectedClient ? (
                      <div className="flex items-center gap-2">
                        <Avatar name={selectedClient.fullName} id={selectedClient.id} size="sm" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{selectedClient.fullName}</p>
                          {selectedClient.companyName && <p className="text-xs text-gray-400">{selectedClient.companyName}</p>}
                        </div>
                      </div>
                    ) : <span className="text-sm text-gray-400">—</span>}
                  </div>
                )}
              </FormField>
              <FormField label="Assigned Team">
                {isEditing ? (
                  <MemberPicker members={members} selectedIds={selectedMemberIds} onToggle={handleMemberToggle} />
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

        {/* Discovery Brief */}
        {(() => {
          const canFill = false || profile?.role === 'admin' || profile?.role === 'team' || profile?.role === 'client';
          const isLocked = discoveryStatus === 'submitted' && profile?.role !== 'admin';

          const statusConfig = {
            not_started: { label: 'Not started', icon: 'edit_note', cls: 'text-gray-400 bg-gray-100', dot: 'bg-gray-300' },
            draft:       { label: 'Draft saved',  icon: 'draft',     cls: 'text-amber-700 bg-amber-100', dot: 'bg-amber-400' },
            submitted:   { label: 'Submitted',    icon: 'check_circle', cls: 'text-green-700 bg-green-100', dot: 'bg-green-500' },
          } as const;
          const s = statusConfig[discoveryStatus];

          return (
            <div className="flex items-center justify-between gap-4 bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm">
              <div className="flex items-center gap-4 min-w-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  discoveryStatus === 'submitted' ? 'bg-green-50 text-green-600' :
                  discoveryStatus === 'draft'     ? 'bg-amber-50 text-amber-600' :
                                                   'bg-gray-50 text-gray-400'
                }`}>
                  <MaterialIcon name={s.icon} size={20} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-sm font-bold text-gray-900">Discovery Brief</h3>
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${s.cls}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      {s.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {discoveryStatus === 'not_started'
                      ? `Service-specific requirements questionnaire for ${project.service.replace('-', ' ')}`
                      : discoveryStatus === 'draft'
                        ? 'Brief is saved as a draft — submit when ready'
                        : `Brief submitted${discovery?.submittedAt ? ` on ${new Date(discovery.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}`
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {isLocked ? (
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/projects/${id}/discovery`)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    <MaterialIcon name="visibility" size={14} />
                    View brief
                  </button>
                ) : canFill ? (
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/projects/${id}/discovery`)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gray-900 hover:bg-gray-700 rounded-xl transition-colors"
                  >
                    <MaterialIcon name={discoveryStatus === 'not_started' ? 'edit_note' : 'edit'} size={14} />
                    {discoveryStatus === 'not_started' ? 'Fill brief' : 'Edit brief'}
                  </button>
                ) : null}
              </div>
            </div>
          );
        })()}

        <ProjectTimeline
          project={project}
          getPhaseAssignment={getPhaseAssignment}
          onAddPhase={openInsert}
          onEditPhase={openPhaseEdit}
          onUpdatePhase={(phaseId, updates) => updatePhase(project.id, phaseId, updates)}
          onAssignTemplate={setAssignPhaseId}
          onViewDocument={(assignmentId) => navigate(`/admin/projects/${id}/templates/${assignmentId}/view`)}
          onOpenDocument={(assignmentId) => navigate(`/admin/projects/${id}/templates/${assignmentId}`)}
          onCompletePhase={(phaseId) => completePhase(project.id, phaseId)}
          onSetActivePhase={(phaseId) => setActivePhase(project.id, phaseId)}
          onMovePhase={(phaseId, direction) => movePhase(project.id, phaseId, direction)}
          onDeletePhase={setDeletePhaseId}
          onCreateDefaultPhase={(phase, afterIndex) => insertPhase(project.id, afterIndex, phase)}
          onOpenDiscovery={() => navigate(`/admin/projects/${id}/discovery`)}
          discoveryStatus={discoveryStatus}
        />

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

      <Fab
        icon={Pencil}
        ariaLabel="Edit project"
        onClick={openMobileEdit}
        className="md:hidden"
      />

      <FormSidebar
        isOpen={editSidebarOpen}
        onClose={cancelEdit}
        title="Edit Project"
        description={project.name}
        width="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="project-detail-sidebar-form flex min-h-0 flex-1 flex-col">
          <div className="project-detail-sidebar-fields flex-1 space-y-5 overflow-y-auto px-6 py-6">
            <FormField label="Project Name" required error={errors.name?.message}>
              <input {...register('name', { required: 'Required' })} className={inputCls(!!errors.name)} />
            </FormField>

            <FormField label="Service" required>
              <Select {...register('service', { required: true })}>
                {(Object.entries(SERVICE_META) as [ServiceType, typeof SERVICE_META[ServiceType]][]).map(([key, meta]) => (
                  <Option key={key} value={key}>{meta.label}</Option>
                ))}
              </Select>
            </FormField>

            {hasPackages && (
              <FormField label="Package">
                <Select {...register('package')}>
                  <Option value="">— None —</Option>
                  <Option value="essentials">Essentials</Option>
                  <Option value="growth">Growth</Option>
                  <Option value="premium">Premium</Option>
                </Select>
              </FormField>
            )}

            <FormField label="Status" required>
              <Select {...register('status', { required: true })}>
                <Option value="active">Active</Option>
                <Option value="paused">Paused</Option>
                <Option value="completed">Completed</Option>
              </Select>
            </FormField>

            <FormField label="Timeline">
              <input {...register('timeline')} className={inputCls(false)} />
            </FormField>

            <FormField label="Client">
              <ClientPicker clients={clients} selectedId={selectedClientId} onSelect={handleClientSelect} />
            </FormField>

            <FormField label="Assigned Team">
              <MemberPicker
                members={members}
                selectedIds={selectedMemberIds}
                onToggle={handleMemberToggle}
              />
            </FormField>
          </div>

          <FormSidebarActions
            onCancel={cancelEdit}
            isSubmitting={isSubmitting}
            isDirty={hasProjectChanges}
            disabled={!selectedClientId}
            submitLabel="Save"
          />
        </form>
      </FormSidebar>

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
                          <Button type="button" variant="ghost" size="sm" onClick={() => navigate(`/admin/projects/${id}/templates/${phaseDoc.id}`)}>Edit</Button>
                          <button type="button" onClick={() => setRemoveDocId(phaseDoc.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50" aria-label={`Remove ${phaseDoc.documentTitle}`}>
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
            <Button type="button" variant="secondary" onClick={() => { setEditingPhaseId(null); setInsertAfterIdx(null); }} className="flex-1">Cancel</Button>
            <Button
              type="button"
              onClick={editingPhase ? savePhaseEdit : confirmInsert}
              disabled={editingPhase ? !phaseTitle.trim() || !hasPhaseChanges : !newPhaseTitle.trim()}
              className="flex-1"
            >
              {editingPhase ? 'Save Phase' : 'Add Phase'}
            </Button>
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
    </DashboardLayout>
  );
};

export default ProjectDetail;
