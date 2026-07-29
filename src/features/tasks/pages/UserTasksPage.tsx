import { useState, useMemo } from 'react';
import { AlertTriangle, CheckCircle2, CheckSquare, ListTodo, Timer } from '@/src/shared/components/material-icon/material-lucide-icons';
import { isPast, parseISO } from 'date-fns';
import UserLayout from '@/src/layouts/UserLayout';
import TableTab, { type TabItem } from '@/src/shared/components/table-tab/table-tab';
import StatCard from '@/src/shared/components/stat-card/stat-card';
import CardContent from '@/src/shared/components/card-content/card-content';
import TaskCard from '../components/task-card/task-card';
import TaskRow from '../components/task-card/task-row';
import TaskDetailModal from '../components/task-detail-modal/task-detail-modal';
import { useTasksStore } from '../stores/taskStore';
import { useProjectsStore } from '@/src/features/projects';
import type { Task, TaskStatus } from '../types';
import { useAuthStore } from '@/src/features/auth';

// ─── Tab config (mirrors admin Tasks) ────────────────────────────────────────

type FilterKey = 'all' | TaskStatus;

interface TabDef { key: FilterKey; label: string; activeCls: string; }

const TABS: TabDef[] = [
  { key: 'all',         label: 'All',         activeCls: '' },
  { key: 'todo',        label: 'Todo',         activeCls: '' },
  { key: 'in-progress', label: 'In Progress',  activeCls: '' },
  { key: 'to-test',     label: 'To Test',      activeCls: '' },
  { key: 'completed',   label: 'Completed',    activeCls: '' },
];

type SortKey = 'updated' | 'due';

const EMPTY_MSG: Record<FilterKey, string> = {
  all:          'No tasks yet. Add your first one.',
  todo:         'Nothing in the backlog.',
  'in-progress':'Nothing in progress.',
  'to-test':    'Nothing to test.',
  completed:    'No completed tasks yet.',
};

// ─── UserTasks page ───────────────────────────────────────────────────────────

const UserTasks = () => {
  const { tasks, loading, error } = useTasksStore();
  const profile = useAuthStore(state => state.profile);
  const { projects } = useProjectsStore();
  const currentClientId = profile?.uid ?? '';

  // User's projects only
  const myProjects   = projects.filter(p => p.clientId === currentClientId);
  const myProjectIds = new Set(myProjects.map(p => p.id));
  const myTasks      = tasks.filter(t => (t.clientId === currentClientId || t.clientAssigneeId === currentClientId) && myProjectIds.has(t.projectId));

  const [activeTab,     setActiveTab]     = useState<FilterKey>('all');
  const [viewMode,      setViewMode]      = useState<'grid' | 'list'>('list');
  const [sortKey,       setSortKey]       = useState<SortKey>('updated');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [detailTask,    setDetailTask]    = useState<Task | null>(null);

  // ── Counts ──
  const counts = useMemo(() => ({
    all:          myTasks.length,
    todo:         myTasks.filter(t => t.status === 'todo').length,
    'in-progress':myTasks.filter(t => t.status === 'in-progress').length,
    'to-test':    myTasks.filter(t => t.status === 'to-test').length,
    completed:    myTasks.filter(t => t.status === 'completed').length,
  }), [myTasks]);

  const taskStats = useMemo(() => {
    const open = myTasks.filter(t => t.status !== 'completed');
    const overdue = open.filter(t => t.dueDate && isPast(parseISO(t.dueDate))).length;
    const highPriority = open.filter(t => t.priority === 'high').length;

    return {
      open: open.length,
      overdue,
      highPriority,
      completionRate: myTasks.length ? Math.round((counts.completed / myTasks.length) * 100) : 0,
    };
  }, [counts.completed, myTasks]);

  const tabs = useMemo<TabItem[]>(() => (
    TABS.map(tab => ({ key: tab.key, label: tab.label, count: counts[tab.key] }))
  ), [counts]);

  // ── Filtered list ──
  const filtered = useMemo(() => {
    const list = activeTab === 'all' ? myTasks : myTasks.filter(t => t.status === activeTab);
    return [...list].sort((a, b) => {
      const result = sortKey === 'due'
        ? (a.dueDate ?? '9999-12-31').localeCompare(b.dueDate ?? '9999-12-31')
        : a.updatedAt - b.updatedAt;

      return sortDirection === 'asc' ? result : -result;
    });
  }, [myTasks, activeTab, sortKey, sortDirection]);

  return (
    <UserLayout title="Tasks">
      <div className="flex flex-col gap-4 pb-10">
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <StatCard
            size="sm"
            variant="lime"
            icon={<ListTodo size={16} />}
            label="My Tasks"
            value={counts.all}
            badge={`${myProjects.length} project${myProjects.length !== 1 ? 's' : ''}`}
            badgeLabel="assigned to you"
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

        {/* Toolbar — shared table/list controls */}
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
          />
        </div>

        {/* Content */}
        {error.tasks && (
          <div className="rounded-[16px] border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error.tasks}
          </div>
        )}

        {loading.tasks && !myTasks.length ? (
          <div className="bg-white border border-gray-100 rounded-[18px] py-16 text-center">
            <p className="type-card-title text-gray-500">Loading tasks...</p>
          </div>
        ) : filtered.length === 0 ? (
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
              />
            ))}
          </div>
        ) : (
          <CardContent
            iconName="task_alt"
            title={activeTab === 'all' ? 'My work queue' : TABS.find(tab => tab.key === activeTab)?.label ?? 'Tasks'}
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
              />
            ))}
          </div>
          </CardContent>
        )}

      </div>

      {/* Task detail modal */}
      {detailTask && (
        <TaskDetailModal
          task={detailTask}
          onClose={() => setDetailTask(null)}
        />
      )}

    </UserLayout>
  );
};

export default UserTasks;
