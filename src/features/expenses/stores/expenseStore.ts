import { create } from "zustand";
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
  subscribeToExpenses: () => () => void;
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

const localId = () => `expense_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const useExpenseStore = create<ExpenseState>((set) => ({
  stats: EMPTY_STATS,
  recentClients: [],
  expenses: [],
  isWorking: true,
  loading: false,
  error: null,

  subscribeToExpenses: () => {
    set({ loading: false, error: null });
    return () => undefined;
  },

  setStats: (stats) => set({ stats }),
  setRecentClients: (recentClients) => set({ recentClients }),
  setExpenses: (expenses) => set({ expenses }),

  addExpense: async (input) => {
    const now = Date.now();
    const expense: Expense = {
      ...input,
      id: localId(),
      createdAt: now,
      updatedAt: now,
    };
    set(state => ({ expenses: [expense, ...state.expenses] }));
    return expense;
  },

  updateExpense: async (id, updates) => {
    set(state => ({
      expenses: state.expenses.map(expense => (
        expense.id === id ? { ...expense, ...updates, updatedAt: Date.now() } : expense
      )),
    }));
  },

  removeExpense: async (id) => {
    set(state => ({ expenses: state.expenses.filter(expense => expense.id !== id) }));
  },

  toggleWorking: () => set((s) => ({ isWorking: !s.isWorking })),

  incrementExpenseTotal: (amount) =>
    set((s) => ({
      stats: { ...s.stats, totalExpenses: s.stats.totalExpenses + amount },
    })),
}));

export const useAdminStore = useExpenseStore;
