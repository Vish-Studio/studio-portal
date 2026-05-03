import { create } from 'zustand';
export type { AdminStats, Expense } from '../data/admin';
import type { AdminStats, Expense } from '../data/admin';

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
  setStats:          (stats: AdminStats) => void;
  setRecentClients:  (clients: RecentClient[]) => void;
  setExpenses:       (expenses: Expense[]) => void;
  addExpense:        (expense: Expense) => void;
  toggleWorking:     () => void;
  incrementExpenseTotal: (amount: number) => void;
}

const EMPTY_STATS: AdminStats = { totalClients: 0, activeProjects: 0, totalRevenue: 0, totalExpenses: 0 };

export const useAdminStore = create<AdminState>((set) => ({
  stats:         EMPTY_STATS, // hydrated on app start via initStores()
  recentClients: [],
  expenses:      [],
  isWorking:     true,

  setStats:         (stats)         => set({ stats }),
  setRecentClients: (recentClients) => set({ recentClients }),
  setExpenses:      (expenses)      => set({ expenses }),

  addExpense: (expense) =>
    set((s) => ({ expenses: [expense, ...s.expenses].slice(0, 5) })),

  toggleWorking: () =>
    set((s) => ({ isWorking: !s.isWorking })),

  incrementExpenseTotal: (amount) =>
    set((s) => ({ stats: { ...s.stats, totalExpenses: s.stats.totalExpenses + amount } })),
}));
