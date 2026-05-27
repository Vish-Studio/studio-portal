import { create } from 'zustand';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { requireFirebase } from '@/src/firebase/requireFirebase';
import { taskDocToTask } from '@/src/firebase/firestoreTransformers';
import type { Task, TaskStatus, TaskPriority } from '../types';
import { useAuthStore } from '@/src/features/auth';
import type { AuthRole } from '@/src/types/auth';
import { FEEDBACK_MESSAGES } from '@/src/app/messages';

export type { Task, TaskStatus, TaskPriority };

export const TASK_CREATE_ROLES: AuthRole[] = ['superadmin', 'admin', 'freelancer'];
export const TASK_DELETE_ROLES: AuthRole[] = ['superadmin', 'admin'];

export const canCreateTask = (role?: AuthRole | null): role is AuthRole =>
  Boolean(role && TASK_CREATE_ROLES.includes(role));

export const canDeleteTask = (role?: AuthRole | null): role is AuthRole =>
  Boolean(role && TASK_DELETE_ROLES.includes(role));

const taskStatusToFirestore = (status: TaskStatus) =>
  status === 'completed' ? 'done' : status === 'to-test' ? 'review' : status;

const taskToCreateDoc = (task: Task) => ({
  clientId: task.clientId ?? task.clientAssigneeId ?? '',
  projectId: task.projectId,
  title: task.title,
  description: task.description ?? '',
  status: taskStatusToFirestore(task.status),
  completed: task.status === 'completed',
  priority: task.priority,
  assigneeIds: task.assigneeIds ?? [],
  assignedToId: task.assigneeIds?.[0] ?? '',
  ...(task.clientAssigneeId ? { clientAssigneeId: task.clientAssigneeId } : {}),
  visibleToClient: Boolean(task.clientAssigneeId),
  ...(task.dueDate ? { dueDate: new Date(task.dueDate) } : {}),
  createdById: useAuthStore.getState().profile?.uid ?? '',
  createdByRole: useAuthStore.getState().profile?.role ?? '',
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});

const taskUpdatesToDoc = (updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => ({
  ...(updates.clientId !== undefined ? { clientId: updates.clientId } : {}),
  ...(updates.projectId !== undefined ? { projectId: updates.projectId } : {}),
  ...(updates.title !== undefined ? { title: updates.title } : {}),
  ...(updates.description !== undefined ? { description: updates.description ?? '' } : {}),
  ...(updates.status !== undefined ? {
    status: taskStatusToFirestore(updates.status),
    completed: updates.status === 'completed',
  } : {}),
  ...(updates.priority !== undefined ? { priority: updates.priority } : {}),
  ...(updates.assigneeIds !== undefined ? {
    assigneeIds: updates.assigneeIds ?? [],
    assignedToId: updates.assigneeIds?.[0] ?? '',
  } : {}),
  ...(updates.clientAssigneeId !== undefined ? {
    clientAssigneeId: updates.clientAssigneeId ?? '',
    visibleToClient: Boolean(updates.clientAssigneeId),
  } : {}),
  ...(updates.dueDate !== undefined ? { dueDate: updates.dueDate ? new Date(updates.dueDate) : null } : {}),
  updatedAt: serverTimestamp(),
});

interface TasksState {
  tasks: Task[];
  loading: { tasks: boolean };
  ready: boolean;
  error: { tasks: string | null };
  setTasks:    (tasks: Task[]) => void;
  subscribeToTasks: (filter?: { clientId?: string; assigneeId?: string }) => Unsubscribe;
  subscribeToProjectTasks: (projectId: string) => Unsubscribe;
  addTask:     (task: Task) => Promise<void>;
  updateTask:  (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => Promise<void>;
  removeTask:  (id: string) => Promise<void>;
}

export const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  loading: { tasks: false },
  ready: false,
  error: { tasks: null },

  setTasks: (tasks) => set({ tasks, ready: true }),

  subscribeToTasks: (filter) => {
    set({ loading: { tasks: true }, error: { tasks: null } });
    const db = requireFirebase().db;
    const tasksRef = filter?.clientId
      ? query(collection(db, 'tasks'), where('clientId', '==', filter.clientId))
      : filter?.assigneeId
        ? query(collection(db, 'tasks'), where('assigneeIds', 'array-contains', filter.assigneeId))
        : collection(db, 'tasks');

    return onSnapshot(
      tasksRef,
      snapshot => set({ tasks: snapshot.docs.map(taskDocToTask), loading: { tasks: false }, ready: true, error: { tasks: null } }),
      error => set({ loading: { tasks: false }, ready: true, error: { tasks: error.message } }),
    );
  },

  subscribeToProjectTasks: (projectId) => {
    set({ loading: { tasks: true }, error: { tasks: null } });
    return onSnapshot(
      query(collection(requireFirebase().db, 'tasks'), where('projectId', '==', projectId)),
      snapshot => set(state => ({
        tasks: [
          ...state.tasks.filter(task => task.projectId !== projectId),
          ...snapshot.docs.map(taskDocToTask),
        ],
        loading: { tasks: false },
        ready: true,
        error: { tasks: null },
      })),
      error => set({ loading: { tasks: false }, ready: true, error: { tasks: error.message } }),
    );
  },

  addTask: async (task) => {
    if (!canCreateTask(useAuthStore.getState().profile?.role)) {
      throw new Error(FEEDBACK_MESSAGES.sidebar.taskCreateNotAllowed);
    }
    await addDoc(collection(requireFirebase().db, 'tasks'), taskToCreateDoc(task));
  },

  updateTask: async (id, updates) => {
    await updateDoc(doc(requireFirebase().db, 'tasks', id), taskUpdatesToDoc(updates));
  },

  removeTask: async (id) => {
    if (!canDeleteTask(useAuthStore.getState().profile?.role)) {
      throw new Error(FEEDBACK_MESSAGES.sidebar.taskDeleteNotAllowed);
    }
    await deleteDoc(doc(requireFirebase().db, 'tasks', id));
  },
}));
