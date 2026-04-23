import { create } from "zustand";
import { DEMO_STATS, DEMO_EXPENSES, DEMO_RECENT_CLIENTS } from "../data/admin";
export type { AdminStats, Expense } from "../data/admin";

import type { AdminStats, Expense } from "../data/admin";

interface RecentClient {
  id: string;
  displayName: string;
  email: string;
  status: string;
}

interface AdminState {
  stats: AdminStats;
  recentClients: RecentClient[];
  expenses: Expense[];
  isWorking: boolean;
  setStats: (stats: AdminStats) => void;
  setRecentClients: (clients: RecentClient[]) => void;
  setExpenses: (expenses: Expense[]) => void;
  addExpense: (expense: Expense) => void;
  toggleWorking: () => void;
  incrementExpenseTotal: (amount: number) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  stats: DEMO_STATS,
  recentClients: DEMO_RECENT_CLIENTS,
  expenses: DEMO_EXPENSES,
  isWorking: true,

  setStats: (stats) => set({ stats }),
  setRecentClients: (recentClients) => set({ recentClients }),
  setExpenses: (expenses) => set({ expenses }),

  addExpense: (expense) =>
    set((state) => ({
      expenses: [expense, ...state.expenses].slice(0, 5),
    })),

  toggleWorking: () =>
    set((state) => ({ isWorking: !state.isWorking })),

  incrementExpenseTotal: (amount) =>
    set((state) => ({
      stats: { ...state.stats, totalExpenses: state.stats.totalExpenses + amount },
    })),
}));
