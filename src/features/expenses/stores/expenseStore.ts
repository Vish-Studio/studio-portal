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
  setStats: (stats: AdminStats) => void;
  setRecentClients: (clients: RecentClient[]) => void;
  setExpenses: (expenses: Expense[]) => void;
  addExpense: (input: ExpenseInput) => Expense;
  updateExpense: (id: string, updates: Partial<ExpenseInput>) => void;
  removeExpense: (id: string) => void;
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

export const useExpenseStore = create<ExpenseState>((set) => ({
  stats: EMPTY_STATS, // hydrated on app start via initStores()
  recentClients: [],
  expenses: [],
  isWorking: true,

  setStats: (stats) => set({ stats }),
  setRecentClients: (recentClients) => set({ recentClients }),
  setExpenses: (expenses) => set({ expenses }),

  addExpense: (input) => {
    const now = Date.now();
    const expense: Expense = {
      ...input,
      id: `fin_${now}`,
      createdAt: now,
      updatedAt: now,
    };

    set((s) => ({ expenses: [expense, ...s.expenses] }));
    return expense;
  },

  updateExpense: (id, updates) =>
    set((s) => ({
      expenses: s.expenses.map((expense) =>
        expense.id === id ? { ...expense, ...updates, updatedAt: Date.now() } : expense,
      ),
    })),

  removeExpense: (id) =>
    set((s) => ({ expenses: s.expenses.filter((expense) => expense.id !== id) })),

  toggleWorking: () => set((s) => ({ isWorking: !s.isWorking })),

  incrementExpenseTotal: (amount) =>
    set((s) => ({
      stats: { ...s.stats, totalExpenses: s.stats.totalExpenses + amount },
    })),
}));

export const useAdminStore = useExpenseStore;
