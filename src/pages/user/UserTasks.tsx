import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { CheckSquare, LayoutGrid, List, Plus } from 'lucide-react';
import UserLayout from '@/src/components/user/user-layout/user-layout';
import FormSidebar, { FormSidebarFooter } from '@/src/components/common/form-sidebar/form-sidebar';
import FormField, { inputCls } from '@/src/components/common/form-field/form-field';
import Select from '@/src/components/common/select/select';
import Option from '@/src/components/common/select/option';
import ConfirmDialog from '@/src/components/common/confirm-dialog/confirm-dialog';
import Fab from '@/src/components/common/button-fab/button-fab';
import TaskCard from '@/src/components/admin/task-card/task-card';
import TaskRow from '@/src/components/admin/task-card/task-row';
import TaskDetailModal from '@/src/components/admin/task-detail-modal/task-detail-modal';
import { useTasksStore } from '@/src/store/tasks';
import { useProjectsStore } from '@/src/store/projects';
import type { Task, TaskStatus, TaskPriority } from '@/src/data/tasks';

const CURRENT_CLIENT_ID = 'c1';

// ─── Tab config (mirrors admin Tasks) ────────────────────────────────────────

type FilterKey = 'all' | TaskStatus;

interface TabDef { key: FilterKey; label: string; activeCls: string; }

const TABS: TabDef[] = [
  { key: 'all',         label: 'All',         activeCls: 'bg-gray-900 text-white' },
  { key: 'todo',        label: 'Todo',         activeCls: 'bg-gray-600 text-white' },
  { key: 'in-progress', label: 'In Progress',  activeCls: 'bg-blue-600 text-white' },
  { key: 'to-test',     label: 'To Test',      activeCls: 'bg-amber-500 text-white' },
  { key: 'completed',   label: 'Completed',    activeCls: 'bg-green-600 text-white' },
];

const EMPTY_MSG: Record<FilterKey, string> = {
  all:          'No tasks yet. Add your first one.',
  todo:         'Nothing in the backlog.',
  'in-progress':'Nothing in progress.',
  'to-test':    'Nothing to test.',
  completed:    'No completed tasks yet.',
};

interface TaskFormValues {
  title: string;
  description: string;
  projectId: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
}

// ─── UserTasks page ───────────────────────────────────────────────────────────

const UserTasks = () => {
  const { tasks, addTask, updateTask, removeTask } = useTasksStore();
  const { projects } = useProjectsStore();

  // User's projects only
  const myProjects   = projects.filter(p => p.clientId === CURRENT_CLIENT_ID);
  const myProjectIds = new Set(myProjects.map(p => p.id));
  const myTasks      = tasks.filter(t => myProjectIds.has(t.projectId));

  const [activeTab,     setActiveTab]     = useState<FilterKey>('all');
  const [viewMode,      setViewMode]      = useState<'grid' | 'list'>('grid');
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [editingTask,   setEditingTask]   = useState<Task | null>(null);
  const [confirmTask,   setConfirmTask]   = useState<Task | null>(null);
  const [detailTask,    setDetailTask]    = useState<Task | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<TaskFormValues>({
      defaultValues: { title: '', description: '', projectId: '', status: 'todo', priority: 'medium', dueDate: '' },
    });

  // ── Counts ──
  const counts = useMemo(() => ({
    all:          myTasks.length,
    todo:         myTasks.filter(t => t.status === 'todo').length,
    'in-progress':myTasks.filter(t => t.status === 'in-progress').length,
    'to-test':    myTasks.filter(t => t.status === 'to-test').length,
    completed:    myTasks.filter(t => t.status === 'completed').length,
  }), [myTasks]);

  // ── Filtered list ──
  const filtered = useMemo(() => {
    const list = activeTab === 'all' ? myTasks : myTasks.filter(t => t.status === activeTab);
    return [...list].sort((a, b) => b.updatedAt - a.updatedAt);
  }, [myTasks, activeTab]);

  // ── Sidebar helpers ──
  const openAdd = () => {
    setEditingTask(null);
    reset({
      title: '', description: '',
      projectId: myProjects[0]?.id ?? '',
      status: activeTab === 'all' ? 'todo' : activeTab as TaskStatus,
      priority: 'medium', dueDate: '',
    });
    setSidebarOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    reset({
      title:       task.title,
      description: task.description ?? '',
      projectId:   task.projectId,
      status:      task.status,
      priority:    task.priority,
      dueDate:     task.dueDate ?? '',
    });
    setSidebarOpen(true);
  };

  const onSubmit = (data: TaskFormValues) => {
    const payload: Partial<Omit<Task, 'id' | 'createdAt'>> = {
      title:       data.title,
      description: data.description || undefined,
      projectId:   data.projectId,
      status:      data.status,
      priority:    data.priority,
      dueDate:     data.dueDate || undefined,
      updatedAt:   Date.now(),
    };
    if (editingTask) {
      updateTask(editingTask.id, payload);
    } else {
      addTask({ id: `tk_${Date.now()}`, createdAt: Date.now(), ...payload } as Task);
    }
    setSidebarOpen(false);
  };

  return (
    <UserLayout title="Tasks">
      <div className="flex flex-col gap-4 pb-10">

        {/* Toolbar — identical structure to admin Tasks */}
        <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 lg:-mx-8 flex items-center gap-3 bg-white/95 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-3">

            {/* Mobile tab dropdown */}
            <Select
              value={activeTab}
              onChange={e => setActiveTab(e.target.value as FilterKey)}
              wrapperClassName="w-full sm:hidden"
              className="py-2.5"
            >
              {TABS.map(tab => (
                <Option key={tab.key} value={tab.key}>
                  {tab.label} ({counts[tab.key]})
                </Option>
              ))}
            </Select>

            {/* Desktop tab pills */}
            <div className="hidden items-center gap-1 overflow-x-auto rounded-xl bg-gray-100 p-1 no-scrollbar sm:flex">
              {TABS.map(tab => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex shrink-0 items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold transition-all whitespace-nowrap ${
                      isActive ? tab.activeCls + ' shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-white/70'
                    }`}
                  >
                    {tab.label}
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none ${
                      isActive ? 'bg-white/25 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {counts[tab.key]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* View toggle */}
            <div className="hidden sm:flex items-center gap-0.5 p-1 bg-gray-100 rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}
                aria-label="Grid view"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}
                aria-label="List view"
              >
                <List size={14} />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={openAdd}
            className="hidden sm:flex items-center gap-2 bg-gray-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-700 transition-colors shrink-0 ml-auto"
          >
            <Plus size={14} />
            Add Task
          </button>
        </div>

        {/* Content */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-[18px] py-16 flex flex-col items-center gap-3 text-center">
            <CheckSquare size={26} className="text-gray-200" />
            <p className="text-sm font-semibold text-gray-400">{EMPTY_MSG[activeTab]}</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
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

      {/* Mobile FAB */}
      <Fab onClick={openAdd} ariaLabel="Add task" />

      {/* Task detail modal */}
      {detailTask && (
        <TaskDetailModal
          task={detailTask}
          onClose={() => setDetailTask(null)}
          onEdit={() => { setDetailTask(null); openEdit(detailTask); }}
          onDelete={() => { setDetailTask(null); setConfirmTask(detailTask); }}
        />
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!confirmTask}
        title="Delete task"
        message={confirmTask ? `"${confirmTask.title}" will be permanently removed.` : ''}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => { if (confirmTask) removeTask(confirmTask.id); setConfirmTask(null); }}
        onCancel={() => setConfirmTask(null)}
      />

      {/* Add / Edit Sidebar */}
      <FormSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title={editingTask ? 'Edit Task' : 'New Task'}
        description={editingTask ? `Editing "${editingTask.title}"` : 'Add a task to one of your projects.'}
        width="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

            <FormField label="Task Title" required error={errors.title?.message}>
              <input
                {...register('title', { required: 'Title is required' })}
                placeholder="e.g. Review design mockups"
                className={inputCls(!!errors.title)}
              />
            </FormField>

            <FormField label="Description" error={errors.description?.message}>
              <textarea
                {...register('description')}
                rows={3}
                placeholder="Optional details or context…"
                className={inputCls(false) + ' resize-none'}
              />
            </FormField>

            {/* Project selector — only user's projects */}
            <FormField label="Project" required error={errors.projectId?.message}>
              <Select
                {...register('projectId', { required: 'Select a project' })}
                hasError={!!errors.projectId}
              >
                <Option value="">— Select project —</Option>
                {myProjects.map(p => (
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
              <input type="date" {...register('dueDate')} className={inputCls(false)} />
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
              {editingTask ? 'Save Changes' : 'Add Task'}
            </button>
          </FormSidebarFooter>
        </form>
      </FormSidebar>
    </UserLayout>
  );
};

export default UserTasks;
