import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { CheckSquare } from 'lucide-react';
import Layout from '../components/common/layout/layout';
import FormSidebar, { FormSidebarFooter } from '../components/common/form-sidebar/form-sidebar';
import Fab from '../components/common/button-fab/button-fab';
import TableTab, { type TabItem } from '../components/common/table-tab/table-tab';
import { Button, Checkbox, ConfirmDialog, DatePicker, FormField, inputCls, Option, Select } from '@/src/shared/components';
import TaskCard from '../components/admin/task-card/task-card';
import TaskRow from '../components/admin/task-card/task-row';
import TaskDetailModal from '../components/admin/task-detail-modal/task-detail-modal';
import MemberPicker from '../components/admin/pickers/member-picker/member-picker';
import { useTasksStore } from '../store/tasks';
import { useProjectsStore } from '../store/projects';
import { useTeamStore } from '../store/team';
import { useClientsStore } from '../store/clients';
import { useUIStore } from '../store/ui';
import type { Task, TaskStatus, TaskPriority } from '../data/tasks';

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
  const { searchQuery } = useUIStore();
  const { tasks, addTask, updateTask, removeTask } = useTasksStore();
  const { projects } = useProjectsStore();
  const { members } = useTeamStore();
  const { clients } = useClientsStore();

  const [activeTab, setActiveTab] = useState<FilterKey>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortKey, setSortKey] = useState<SortKey>('updated');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [assignToClient, setAssignToClient] = useState(false);
  const [confirmTask, setConfirmTask] = useState<Task | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } =
    useForm<TaskFormValues>({
      defaultValues: { title: '', description: '', projectId: '', status: 'todo', priority: 'medium', dueDate: '' },
    });

  const selectedProjectId = watch('projectId');
  const selectedProject = projects.find(project => project.id === selectedProjectId);
  const selectedClient = clients.find(client => client.id === selectedProject?.clientId);

  // ── Counts per status ──
  const counts = useMemo(() => ({
    all: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    'to-test': tasks.filter(t => t.status === 'to-test').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  }), [tasks]);

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
    setEditingTask(null);
    reset({
      title: '', description: '', projectId: '',
      status: activeTab === 'all' ? 'todo' : activeTab as TaskStatus,
      priority: 'medium', dueDate: '',
    });
    setSelectedMemberIds([]);
    setAssignToClient(false);
    setSidebarOpen(true);
  };

  const openEdit = (task: Task) => {
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
    setSidebarOpen(true);
  };

  const onSubmit = (data: TaskFormValues) => {
    const payload: Partial<Omit<Task, 'id' | 'createdAt'>> = {
      title: data.title,
      description: data.description || undefined,
      projectId: data.projectId,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate || undefined,
      assigneeIds: selectedMemberIds.length ? selectedMemberIds : undefined,
      clientAssigneeId: assignToClient ? selectedProject?.clientId : undefined,
      updatedAt: Date.now(),
    };

    if (editingTask) {
      updateTask(editingTask.id, payload);
    } else {
      addTask({ id: `tk_${Date.now()}`, createdAt: Date.now(), ...payload } as Task);
    }
    setSidebarOpen(false);
  };

  const handleStatusChange = (task: Task, status: TaskStatus) => {
    updateTask(task.id, { status, updatedAt: Date.now() });
  };

  return (
    <Layout title="Tasks">
      <div className="flex flex-col gap-4 pb-10">

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
            actionLabel="Add Task"
            onAction={openAdd}
          />
        </div>

        {/* ── Content ── */}
        {filtered.length === 0 ? (
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
                onEdit={() => openEdit(task)}
                onDelete={() => setConfirmTask(task)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map(task => (
              <TaskRow
                key={task.id}
                task={task}
                showStatus={activeTab === 'all'}
                onClick={() => setDetailTask(task)}
                onEdit={() => openEdit(task)}
                onDelete={() => setConfirmTask(task)}
              />
            ))}
          </div>
        )}

      </div>

      {/* ── Mobile FAB ── */}
      <Fab onClick={openAdd} ariaLabel="Add task" />

      {/* ── Task detail modal ── */}
      {detailTask && (
        <TaskDetailModal
          task={detailTask}
          onClose={() => setDetailTask(null)}
          onEdit={() => { setDetailTask(null); openEdit(detailTask); }}
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

      {/* ── Add / Edit Sidebar ── */}
      <FormSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title={editingTask ? 'Edit Task' : 'New Task'}
        description={editingTask ? `Editing "${editingTask.title}"` : 'Add a task to a project.'}
        width="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

            <FormField label="Task Title" required error={errors.title?.message}>
              <input
                {...register('title', { required: 'Title is required' })}
                placeholder="e.g. Implement checkout flow"
                className={inputCls(!!errors.title)}
              />
            </FormField>

            <FormField label="Description" error={errors.description?.message}>
              <textarea
                {...register('description')}
                rows={3}
                placeholder="Optional details or acceptance criteria…"
                className={inputCls(false) + ' resize-none'}
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

          <FormSidebarFooter>
            <Button
              type="button"
              onClick={() => setSidebarOpen(false)}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              className="flex-1"
            >
              {editingTask ? 'Save Changes' : 'Add Task'}
            </Button>
          </FormSidebarFooter>
        </form>
      </FormSidebar>
    </Layout>
  );
};

export default Tasks;
