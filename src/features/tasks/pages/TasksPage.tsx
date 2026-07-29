import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { AlertTriangle, CheckCircle2, CheckSquare, ListTodo, Timer } from '@/src/shared/components/material-icon/material-lucide-icons';
import { isPast, parseISO } from 'date-fns';
import DashboardLayout from '@/src/layouts/DashboardLayout';
import FormSidebar, { FormSidebarActions, FormSidebarError, getFormErrorMessage } from '@/src/shared/components/form-sidebar/form-sidebar';
import Fab from '@/src/shared/components/button-fab/button-fab';
import TableTab, { type TabItem } from '@/src/shared/components/table-tab/table-tab';
import { Button, CardContent, Checkbox, ConfirmDialog, DatePicker, FormField, Option, Select, TextArea, TextInput } from '@/src/shared/components';
import StatCard from '@/src/shared/components/stat-card/stat-card';
import TaskCard from '../components/task-card/task-card';
import TaskRow from '../components/task-card/task-row';
import TaskDetailModal from '../components/task-detail-modal/task-detail-modal';
import { MemberPicker } from '@/src/shared/components';
import { canCreateTask, canDeleteTask, useTasksStore } from '../stores/taskStore';
import { useProjectsStore } from '@/src/features/projects';
import { useTeamStore } from '@/src/features/team';
import { useClientsStore } from '@/src/features/clients';
import { useUIStore } from '@/src/app/stores/uiStore';
import { FEEDBACK_MESSAGES } from '@/src/app/messages';
import { useAuthStore } from '@/src/features/auth';
import { runOperationWithFeedback } from '@/src/lib/operation-feedback';
import { operationErrorMessage } from '@/src/lib/operation-errors';
import type { Task, TaskStatus, TaskPriority } from '../types';

// ─── Tab config ───────────────────────────────────────────────────────────────

type FilterKey = 'all' | TaskStatus;

interface TabDef {
  key: FilterKey;
  label: string;
}

const TABS: TabDef[] = [
  { key: 'all', label: 'All' },
  { key: 'todo', label: 'Todo' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'to-test', label: 'To Test' },
  { key: 'completed', label: 'Completed' },
];

type SortKey = 'updated' | 'due';

const EMPTY_MSG: Record<FilterKey, string> = {
  all: 'No tasks yet. Add your first one.',
  todo: 'Nothing in the backlog.',
  'in-progress': 'Nothing in progress.',
  'to-test': 'Nothing to test.',
  completed: 'No completed tasks yet.',
};

const sameStringSet = (left: string[] = [], right: string[] = []) => (
  left.length === right.length && left.every(value => right.includes(value))
);

// ─── Form values ──────────────────────────────────────────────────────────────

interface TaskFormValues {
  title: string;
  description: string;
  projectId: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
}

// ─── Tasks Page ───────────────────────────────────────────────────────────────

const Tasks = () => {
  const { searchQuery, showToast } = useUIStore();
  const profile = useAuthStore(state => state.profile);
  const { tasks, loading, error, addTask, updateTask, removeTask } = useTasksStore();
  const { projects } = useProjectsStore();
  const { members } = useTeamStore();
  const { clients } = useClientsStore();

  const [activeTab, setActiveTab] = useState<FilterKey>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortKey, setSortKey] = useState<SortKey>('updated');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [assignToClient, setAssignToClient] = useState(false);
  const [confirmTask, setConfirmTask] = useState<Task | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, reset, watch, formState: { errors, isDirty, isSubmitting } } =
    useForm<TaskFormValues>({
      defaultValues: { title: '', description: '', projectId: '', status: 'todo', priority: 'medium', dueDate: '' },
    });

  const selectedProjectId = watch('projectId');
  const selectedProject = projects.find(project => project.id === selectedProjectId);
  const selectedClient = clients.find(client => client.id === selectedProject?.clientId);
  const canCreate = canCreateTask(profile?.role);
  const canDelete = canDeleteTask(profile?.role);
  const canEdit = canCreate;
  const hasTaskFormChanges = isDirty || (
    editingTask
      ? !sameStringSet(selectedMemberIds, editingTask.assigneeIds ?? []) || assignToClient !== Boolean(editingTask.clientAssigneeId)
      : selectedMemberIds.length > 0 || assignToClient
  );

  // ── Counts per status ──
  const counts = useMemo(() => ({
    all: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    'to-test': tasks.filter(t => t.status === 'to-test').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  }), [tasks]);

  const taskStats = useMemo(() => {
    const open = tasks.filter(t => t.status !== 'completed');
    const overdue = open.filter(t => t.dueDate && isPast(parseISO(t.dueDate))).length;
    const highPriority = open.filter(t => t.priority === 'high').length;

    return {
      open: open.length,
      overdue,
      highPriority,
      completionRate: tasks.length ? Math.round((counts.completed / tasks.length) * 100) : 0,
    };
  }, [counts.completed, tasks]);

  const tabs = useMemo<TabItem[]>(() => (
    TABS.map(tab => ({ key: tab.key, label: tab.label, count: counts[tab.key] }))
  ), [counts]);

  // ── Filtered list ──
  const filtered = useMemo(() => {
    let list = activeTab === 'all' ? tasks : tasks.filter(t => t.status === activeTab);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.description ?? '').toLowerCase().includes(q),
      );
    }
    return [...list].sort((a, b) => {
      const result = sortKey === 'due'
        ? (a.dueDate ?? '9999-12-31').localeCompare(b.dueDate ?? '9999-12-31')
        : a.updatedAt - b.updatedAt;

      return sortDirection === 'asc' ? result : -result;
    });
  }, [tasks, activeTab, searchQuery, sortKey, sortDirection]);

  // ── Sidebar helpers ──
  const openAdd = () => {
    if (!canCreate) {
      showToast({
        status: 'error',
        title: FEEDBACK_MESSAGES.sidebar.taskCreateFailed,
        message: FEEDBACK_MESSAGES.sidebar.taskCreateNotAllowed,
      });
      return;
    }
    setEditingTask(null);
    reset({
      title: '', description: '', projectId: '',
      status: activeTab === 'all' ? 'todo' : activeTab as TaskStatus,
      priority: 'medium', dueDate: '',
    });
    setSelectedMemberIds([]);
    setAssignToClient(false);
    setSubmitError(null);
    setSidebarOpen(true);
  };

  const openEdit = (task: Task) => {
    if (!canEdit) return;
    setEditingTask(task);
    reset({
      title: task.title,
      description: task.description ?? '',
      projectId: task.projectId,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ?? '',
    });
    setSelectedMemberIds(task.assigneeIds ?? []);
    setAssignToClient(Boolean(task.clientAssigneeId));
    setSubmitError(null);
    setSidebarOpen(true);
  };

  const onSubmit = async (data: TaskFormValues) => {
    setSubmitError(null);
    const project = projects.find(item => item.id === data.projectId);
    if (!project) {
      setSubmitError('Select a project');
      return;
    }

    const payload: Partial<Omit<Task, 'id' | 'createdAt'>> = {
      clientId: project.clientId,
      title: data.title,
      description: data.description || undefined,
      projectId: data.projectId,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate || undefined,
      assigneeIds: selectedMemberIds.length ? selectedMemberIds : undefined,
      clientAssigneeId: assignToClient ? project.clientId : '',
      updatedAt: Date.now(),
    };

    try {
      if (editingTask) {
        await runOperationWithFeedback({
          loadingLabel: 'Updating task',
          successTitle: FEEDBACK_MESSAGES.sidebar.taskUpdateSuccess,
          errorTitle: FEEDBACK_MESSAGES.sidebar.taskUpdateFailed,
          action: () => updateTask(editingTask.id, payload),
        });
      } else {
        await runOperationWithFeedback({
          loadingLabel: 'Creating task',
          successTitle: FEEDBACK_MESSAGES.sidebar.taskCreateSuccess,
          errorTitle: FEEDBACK_MESSAGES.sidebar.taskCreateFailed,
          action: () => addTask({ id: `tk_${Date.now()}`, createdAt: Date.now(), ...payload } as Task),
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

  const handleStatusChange = (task: Task, status: TaskStatus) => {
    updateTask(task.id, { status, updatedAt: Date.now() });
  };

  return (
    <DashboardLayout title="Tasks">
      <div className="flex flex-col gap-4 pb-10">
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <StatCard
            size="sm"
            variant="lime"
            icon={<ListTodo size={16} />}
            label="Total Tasks"
            value={counts.all}
            badge={`${counts.todo} todo`}
            badgeLabel="backlog"
          />
          <StatCard
            size="sm"
            variant="surface"
            icon={<Timer size={16} />}
            label="Open Work"
            value={taskStats.open}
            badge={`${counts['in-progress']} in progress`}
            badgeLabel="active tasks"
          />
          <StatCard
            size="sm"
            variant="white"
            icon={<AlertTriangle size={16} />}
            label="Overdue"
            value={taskStats.overdue}
            badge={`${taskStats.highPriority} high priority`}
            badgeLabel="needs attention"
          />
          <StatCard
            size="sm"
            variant="dark"
            icon={<CheckCircle2 size={16} />}
            label="Completed"
            value={counts.completed}
            badge={`${taskStats.completionRate}%`}
            badgeLabel="completion rate"
          />
        </div>

        {/* ── Toolbar: tabs + optional page controls ── */}
        <div className="sticky top-0 z-20 -mx-4 bg-white/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <TableTab
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={key => setActiveTab(key as FilterKey)}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            sortValue={sortKey}
            sortOptions={[
              { key: 'updated', label: 'Recently updated' },
              { key: 'due', label: 'Due date' },
            ]}
            onSortChange={key => setSortKey(key as SortKey)}
            sortDirection={sortDirection}
            onSortDirectionChange={setSortDirection}
            actionLabel={canCreate ? 'Add Task' : undefined}
            onAction={canCreate ? openAdd : undefined}
          />
        </div>

        {/* ── Content ── */}
        {error.tasks && (
          <div className="rounded-[16px] border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error.tasks}
          </div>
        )}

        {loading.tasks && !tasks.length ? (
          <div className="bg-white border border-gray-100 rounded-[18px] py-16 text-center">
            <p className="type-card-title text-gray-500">Loading tasks...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-[18px] py-16 flex flex-col items-center gap-3 text-center">
            <CheckSquare size={26} className="text-gray-200" />
            <p className="text-sm font-semibold text-gray-400">
              {searchQuery ? `No results for "${searchQuery}"` : EMPTY_MSG[activeTab]}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                showStatus={activeTab === 'all'}
                onClick={() => setDetailTask(task)}
                onEdit={canEdit ? () => openEdit(task) : undefined}
                onDelete={canDelete ? () => setConfirmTask(task) : undefined}
              />
            ))}
          </div>
        ) : (
          <CardContent
            iconName="task_alt"
            title={activeTab === 'all' ? 'Work queue' : TABS.find(tab => tab.key === activeTab)?.label ?? 'Tasks'}
            action={<span className="text-xs font-semibold text-gray-400">{filtered.length} task{filtered.length !== 1 ? 's' : ''}</span>}
          >
          <div className="flex flex-col">
            {filtered.map(task => (
              <TaskRow
                key={task.id}
                task={task}
                showStatus={activeTab === 'all'}
                embedded
                onClick={() => setDetailTask(task)}
                onEdit={canEdit ? () => openEdit(task) : undefined}
                onDelete={canDelete ? () => setConfirmTask(task) : undefined}
              />
            ))}
          </div>
          </CardContent>
        )}

      </div>

      {/* ── Mobile FAB ── */}
      {canCreate && <Fab onClick={openAdd} ariaLabel="Add task" />}

      {/* ── Task detail modal ── */}
      {detailTask && (
        <TaskDetailModal
          task={detailTask}
          onClose={() => setDetailTask(null)}
          onEdit={canEdit ? () => { setDetailTask(null); openEdit(detailTask); } : undefined}
          onDelete={canDelete ? () => { setDetailTask(null); setConfirmTask(detailTask); } : undefined}
        />
      )}

      {/* ── Delete confirmation ── */}
      <ConfirmDialog
        isOpen={!!confirmTask}
        title="Delete task"
        message={confirmTask ? `"${confirmTask.title}" will be permanently removed.` : ''}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={async () => {
          try {
            if (confirmTask) {
              await runOperationWithFeedback({
                loadingLabel: 'Deleting task',
                successTitle: FEEDBACK_MESSAGES.sidebar.taskDeleteSuccess,
                errorTitle: FEEDBACK_MESSAGES.sidebar.taskDeleteFailed,
                action: () => removeTask(confirmTask.id),
              });
            }
            setConfirmTask(null);
          } catch {
            // runOperationWithFeedback already logs and shows the toast.
          }
        }}
        onCancel={() => setConfirmTask(null)}
      />

      {/* ── Add / Edit Sidebar ── */}
      <FormSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title={editingTask ? 'Edit Task' : 'New Task'}
        description={editingTask ? `Editing "${editingTask.title}"` : 'Add a task to a project.'}
        width="md"
      >
        <form onSubmit={handleSubmit(onSubmit, onInvalidSubmit)} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            <FormSidebarError
              title={editingTask ? FEEDBACK_MESSAGES.sidebar.taskUpdateFailed : FEEDBACK_MESSAGES.sidebar.taskCreateFailed}
              message={submitError}
            />

            <FormField label="Task Title" required error={errors.title?.message}>
              <TextInput
                {...register('title', { required: FEEDBACK_MESSAGES.validation.titleRequired })}
                placeholder="e.g. Implement checkout flow"
                hasError={!!errors.title}
              />
            </FormField>

            <FormField label="Description" error={errors.description?.message}>
              <TextArea
                {...register('description')}
                rows={3}
                placeholder="Optional details or acceptance criteria..."
              />
            </FormField>

            <FormField label="Project" required error={errors.projectId?.message}>
              <Select
                {...register('projectId', { required: 'Select a project' })}
                hasError={!!errors.projectId}
              >
                <Option value="">— Select project —</Option>
                {projects.map(p => (
                  <Option key={p.id} value={p.id}>{p.name}</Option>
                ))}
              </Select>
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Status" error={errors.status?.message}>
                <Select {...register('status')} hasError={!!errors.status}>
                  <Option value="todo">Todo</Option>
                  <Option value="in-progress">In Progress</Option>
                  <Option value="to-test">To Test</Option>
                  <Option value="completed">Completed</Option>
                </Select>
              </FormField>

              <FormField label="Priority" error={errors.priority?.message}>
                <Select {...register('priority')} hasError={!!errors.priority}>
                  <Option value="high">High</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="low">Low</Option>
                </Select>
              </FormField>
            </div>

            <FormField label="Due Date" error={errors.dueDate?.message}>
              <DatePicker {...register('dueDate')} hasError={!!errors.dueDate} />
            </FormField>

            <FormField label="Assign Members">
              <MemberPicker
                members={members}
                selectedIds={selectedMemberIds}
                onToggle={id =>
                  setSelectedMemberIds(prev =>
                    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
                  )
                }
              />
            </FormField>

            <FormField label="Client Task">
              <Checkbox
                checked={assignToClient}
                disabled={!selectedClient}
                onChange={event => setAssignToClient(event.target.checked)}
                label={selectedClient ? `Assign to ${selectedClient.fullName}` : 'Select a project first'}
                description={
                  selectedClient
                    ? `This task will appear in ${selectedClient.fullName}'s client dashboard and task list.`
                    : 'Client tasks are linked through the selected project.'
                }
                className="rounded-2xl border border-gray-100 bg-(--color-surface) p-4"
              />
            </FormField>

          </div>

          <FormSidebarActions
            onCancel={() => setSidebarOpen(false)}
            isSubmitting={isSubmitting}
            isDirty={hasTaskFormChanges}
            submitLabel={editingTask ? 'Save Changes' : 'Add Task'}
          />
        </form>
      </FormSidebar>
    </DashboardLayout>
  );
};

export default Tasks;
