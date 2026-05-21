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

export type { Task, TaskStatus, TaskPriority };

interface TasksState {
  tasks: Task[];
  loading: { tasks: boolean };
  error: { tasks: string | null };
  setTasks:    (tasks: Task[]) => void;
  subscribeToTasks: () => Unsubscribe;
  subscribeToProjectTasks: (projectId: string) => Unsubscribe;
  addTask:     (task: Task) => Promise<void>;
  updateTask:  (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => Promise<void>;
  removeTask:  (id: string) => Promise<void>;
}

export const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  loading: { tasks: false },
  error: { tasks: null },

  setTasks: (tasks) => set({ tasks }),

  subscribeToTasks: () => {
    set({ loading: { tasks: true }, error: { tasks: null } });
    return onSnapshot(
      collection(requireFirebase().db, 'tasks'),
      snapshot => set({ tasks: snapshot.docs.map(taskDocToTask), loading: { tasks: false }, error: { tasks: null } }),
      error => set({ loading: { tasks: false }, error: { tasks: error.message } }),
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
        error: { tasks: null },
      })),
      error => set({ loading: { tasks: false }, error: { tasks: error.message } }),
    );
  },

  addTask: async (task) => {
    await addDoc(collection(requireFirebase().db, 'tasks'), {
      projectId: task.projectId,
      title: task.title,
      description: task.description ?? '',
      status: task.status === 'completed' ? 'done' : task.status === 'to-test' ? 'review' : task.status,
      assignedToId: task.assigneeIds?.[0] ?? '',
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      visibleToClient: Boolean(task.clientAssigneeId),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  updateTask: async (id, updates) => {
    await updateDoc(doc(requireFirebase().db, 'tasks', id), {
      ...(updates.title !== undefined ? { title: updates.title } : {}),
      ...(updates.description !== undefined ? { description: updates.description } : {}),
      ...(updates.status !== undefined ? { status: updates.status === 'completed' ? 'done' : updates.status === 'to-test' ? 'review' : updates.status } : {}),
      ...(updates.assigneeIds !== undefined ? { assignedToId: updates.assigneeIds[0] ?? '' } : {}),
      ...(updates.dueDate !== undefined ? { dueDate: updates.dueDate ? new Date(updates.dueDate) : null } : {}),
      updatedAt: serverTimestamp(),
    });
  },

  removeTask: async (id) => {
    await deleteDoc(doc(requireFirebase().db, 'tasks', id));
  },
}));
