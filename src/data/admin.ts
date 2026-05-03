export interface AdminStats {
  totalClients: number;
  activeProjects: number;
  totalRevenue: number;
  totalExpenses: number;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  createdAt: { toMillis: () => number };
}

export const EXPENSE_COLORS = [
  'bg-(--color-expense-1)',
  'bg-(--color-expense-2)',
  'bg-(--color-expense-3)',
  'bg-(--color-expense-4)',
];

// Demo data lives in seed.ts — re-exported here for Storybook compatibility
export { DEMO_STATS, DEMO_EXPENSES } from './seed';
