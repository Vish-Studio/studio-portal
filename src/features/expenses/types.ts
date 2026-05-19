export interface AdminStats {
  totalClients: number;
  activeProjects: number;
  totalRevenue: number;
  totalExpenses: number;
}

export type FinancialRecordType = 'expense' | 'income';

export type FinancialRecordCategory =
  | 'team-salary'
  | 'overtime'
  | 'company-expense'
  | 'software'
  | 'office'
  | 'marketing'
  | 'travel'
  | 'project-income'
  | 'retainer'
  | 'other';

export type FinancialRecordStatus = 'paid' | 'pending' | 'scheduled';

export interface Expense {
  id: string;
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
  createdAt: number;
  updatedAt: number;
}

export const EXPENSE_COLORS = [
  'bg-(--color-expense-1)',
  'bg-(--color-expense-2)',
  'bg-(--color-expense-3)',
  'bg-(--color-expense-4)',
];

export const FINANCIAL_CATEGORY_LABELS: Record<FinancialRecordCategory, string> = {
  'team-salary': 'Team salary',
  overtime: 'Overtime',
  'company-expense': 'Company expense',
  software: 'Software',
  office: 'Office',
  marketing: 'Marketing',
  travel: 'Travel',
  'project-income': 'Project income',
  retainer: 'Retainer',
  other: 'Other',
};

export const FINANCIAL_STATUS_LABELS: Record<FinancialRecordStatus, string> = {
  paid: 'Paid',
  pending: 'Pending',
  scheduled: 'Scheduled',
};
