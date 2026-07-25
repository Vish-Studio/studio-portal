import { create } from 'zustand';
import type { Task, TaskStatus, TaskPriority } from '../types';
import { useAuthStore } from '@/src/features/auth';
import type { AuthRole } from '@/src/features/auth';
import { FEEDBACK_MESSAGES } from '@/src/app/messages';

export type { Task, TaskStatus, TaskPriority };

export const TASK_CREATE_ROLES: AuthRole[] = ['superadmin', 'admin', 'user'];
export const TASK_DELETE_ROLES: AuthRole[] = ['superadmin', 'admin', 'user'];

export const canCreateTask = (role?: AuthRole | null): role is AuthRole =>
  Boolean(role && TASK_CREATE_ROLES.includes(role));

export const canDeleteTask = (role?: AuthRole | null): role is AuthRole =>
  Boolean(role && TASK_DELETE_ROLES.includes(role));

interface TasksState {
  tasks: Task[];
  loading: { tasks: boolean };
  ready: boolean;
  error: { tasks: string | null };
  setTasks: (tasks: Task[]) => void;
  subscribeToTasks: (filter?: { clientId?: string; assigneeId?: string }) => () => void;
  subscribeToProjectTasks: (projectId: string) => () => void;
  addTask: (task: Task) => Promise<void>;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
}

export const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  loading: { tasks: false },
  ready: false,
  error: { tasks: null },

  setTasks: (tasks) => set({ tasks, ready: true }),

  subscribeToTasks: () => {
    set({ loading: { tasks: false }, ready: true, error: { tasks: null } });
    return () => undefined;
  },

  subscribeToProjectTasks: () => {
    set({ loading: { tasks: false }, ready: true, error: { tasks: null } });
    return () => undefined;
  },

  addTask: async (task) => {
    if (!canCreateTask(useAuthStore.getState().profile?.role)) {
      throw new Error(FEEDBACK_MESSAGES.sidebar.taskCreateNotAllowed);
    }
    set(state => ({ tasks: [task, ...state.tasks], ready: true }));
  },

  updateTask: async (id, updates) => {
    set(state => ({
      tasks: state.tasks.map(task => (
        task.id === id ? { ...task, ...updates } : task
      )),
    }));
  },

  removeTask: async (id) => {
    if (!canDeleteTask(useAuthStore.getState().profile?.role)) {
      throw new Error(FEEDBACK_MESSAGES.sidebar.taskDeleteNotAllowed);
    }
    set(state => ({ tasks: state.tasks.filter(task => task.id !== id) }));
  },
}));
