import { create } from 'zustand';
import { DEMO_TASKS } from '../data/tasks';
import type { Task, TaskStatus, TaskPriority } from '../data/tasks';

export type { Task, TaskStatus, TaskPriority };

interface TasksState {
  tasks: Task[];
  addTask:    (task: Task) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  removeTask: (id: string) => void;
}

export const useTasksStore = create<TasksState>((set) => ({
  tasks: DEMO_TASKS,

  addTask: (task) =>
    set((state) => ({ tasks: [task, ...state.tasks] })),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t,
      ),
    })),

  removeTask: (id) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
}));
