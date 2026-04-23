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

const daysAgo = (n: number) => ({ toMillis: () => Date.now() - 86400000 * n });

export const DEMO_STATS: AdminStats = {
  totalClients: 1293,
  activeProjects: 857,
  totalRevenue: 256000,
  totalExpenses: 8400,
};

export const DEMO_EXPENSES: Expense[] = [
  { id: "e1", amount: 3250, description: "Crypter - NFT UI Kit", createdAt: daysAgo(1) },
  { id: "e2", amount: 7890, description: "Bento Pro 2.0 Illustrations", createdAt: daysAgo(2) },
  { id: "e3", amount: 1500, description: "Fleet - travel shopping kit", createdAt: daysAgo(5) },
  { id: "e4", amount: 9999, description: "SimpleSocial UI Design Kit", createdAt: daysAgo(10) },
];

export const EXPENSE_COLORS = [
  "bg-(--color-expense-1)",
  "bg-(--color-expense-2)",
  "bg-(--color-expense-3)",
  "bg-(--color-expense-4)",
];
