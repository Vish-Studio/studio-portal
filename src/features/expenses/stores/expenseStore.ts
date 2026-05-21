import { create } from "zustand";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  type QueryDocumentSnapshot,
  type Timestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { requireFirebase } from '@/src/firebase/requireFirebase';
export type { AdminStats, Expense, FinancialRecordCategory, FinancialRecordStatus, FinancialRecordType } from "../types";
import type { AdminStats, Expense, FinancialRecordCategory, FinancialRecordStatus, FinancialRecordType } from "../types";

interface RecentClient {
  id: string;
  fullName: string;
  email: string;
  status: string;
}

interface ExpenseState {
  stats: AdminStats;
  recentClients: RecentClient[];
  expenses: Expense[];
  isWorking: boolean;
  loading: boolean;
  error: string | null;
  subscribeToExpenses: () => Unsubscribe;
  setStats: (stats: AdminStats) => void;
  setRecentClients: (clients: RecentClient[]) => void;
  setExpenses: (expenses: Expense[]) => void;
  addExpense: (input: ExpenseInput) => Promise<Expense | undefined>;
  updateExpense: (id: string, updates: Partial<ExpenseInput>) => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
  toggleWorking: () => void;
  incrementExpenseTotal: (amount: number) => void;
}

export interface ExpenseInput {
  type: FinancialRecordType;
  category: FinancialRecordCategory;
  status: FinancialRecordStatus;
  amount: number;
  title: string;
  description: string;
  vendor?: string;
  projectId?: string;
  memberId?: string;
  date: string;
}

const EMPTY_STATS: AdminStats = {
  totalClients: 0,
  activeProjects: 0,
  totalRevenue: 0,
  totalExpenses: 0,
};

const toMillis = (value: unknown) => {
  if (typeof value === 'number') return value;
  if (value && typeof (value as Timestamp).toMillis === 'function') return (value as Timestamp).toMillis();
  if (value instanceof Date) return value.getTime();
  return Date.now();
};

const expenseFromDoc = (snapshot: QueryDocumentSnapshot): Expense => {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    type: data.type === 'income' ? 'income' : 'expense',
    category: String(data.category ?? 'other') as FinancialRecordCategory,
    status: data.status === 'pending' || data.status === 'scheduled' ? data.status : 'paid',
    amount: Number(data.amount ?? 0),
    title: String(data.title ?? 'Untitled record'),
    description: String(data.description ?? ''),
    vendor: data.vendor ? String(data.vendor) : undefined,
    projectId: data.projectId ? String(data.projectId) : undefined,
    memberId: data.memberId ? String(data.memberId) : undefined,
    date: String(data.date ?? new Date().toISOString().slice(0, 10)),
    createdAt: toMillis(data.createdAt),
    updatedAt: toMillis(data.updatedAt ?? data.createdAt),
  };
};

const toFirestoreExpense = (input: Partial<ExpenseInput>) => ({
  ...(input.type !== undefined ? { type: input.type } : {}),
  ...(input.category !== undefined ? { category: input.category } : {}),
  ...(input.status !== undefined ? { status: input.status } : {}),
  ...(input.amount !== undefined ? { amount: input.amount } : {}),
  ...(input.title !== undefined ? { title: input.title } : {}),
  ...(input.description !== undefined ? { description: input.description } : {}),
  ...(input.vendor !== undefined ? { vendor: input.vendor || '' } : {}),
  ...(input.projectId !== undefined ? { projectId: input.projectId || '' } : {}),
  ...(input.memberId !== undefined ? { memberId: input.memberId || '' } : {}),
  ...(input.date !== undefined ? { date: input.date } : {}),
});

export const useExpenseStore = create<ExpenseState>((set) => ({
  stats: EMPTY_STATS, // hydrated on app start via initStores()
  recentClients: [],
  expenses: [],
  isWorking: true,
  loading: false,
  error: null,

  subscribeToExpenses: () => {
    set({ loading: true, error: null });
    return onSnapshot(
      collection(requireFirebase().db, 'expenses'),
      snapshot => set({
        expenses: snapshot.docs.map(expenseFromDoc).sort((a, b) => b.createdAt - a.createdAt),
        loading: false,
        error: null,
      }),
      error => set({ loading: false, error: error.message }),
    );
  },

  setStats: (stats) => set({ stats }),
  setRecentClients: (recentClients) => set({ recentClients }),
  setExpenses: (expenses) => set({ expenses }),

  addExpense: async (input) => {
    const ref = await addDoc(collection(requireFirebase().db, 'expenses'), {
      ...toFirestoreExpense(input),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      ...input,
      id: ref.id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  },

  updateExpense: async (id, updates) => {
    await updateDoc(doc(requireFirebase().db, 'expenses', id), {
      ...toFirestoreExpense(updates),
      updatedAt: serverTimestamp(),
    });
  },

  removeExpense: async (id) => {
    await deleteDoc(doc(requireFirebase().db, 'expenses', id));
  },

  toggleWorking: () => set((s) => ({ isWorking: !s.isWorking })),

  incrementExpenseTotal: (amount) =>
    set((s) => ({
      stats: { ...s.stats, totalExpenses: s.stats.totalExpenses + amount },
    })),
}));

export const useAdminStore = useExpenseStore;
