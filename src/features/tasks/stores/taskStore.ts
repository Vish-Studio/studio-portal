import { create } from 'zustand';
import type { Task, TaskStatus, TaskPriority } from '../types';

export type { Task, TaskStatus, TaskPriority };

interface TasksState {
  tasks: Task[];
  setTasks:    (tasks: Task[]) => void;
  addTask:     (task: Task) => void;
  updateTask:  (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  removeTask:  (id: string) => void;
}

export const useTasksStore = create<TasksState>((set) => ({
  tasks: [], // hydrated on app start via initStores()

  setTasks: (tasks) => set({ tasks }),

  addTask: (task) =>
    set((s) => ({ tasks: [task, ...s.tasks] })),

  updateTask: (id, updates) =>
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t,
      ),
    })),

  removeTask: (id) =>
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
}));
