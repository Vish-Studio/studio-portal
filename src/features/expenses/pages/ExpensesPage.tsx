import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowDownLeft, ArrowUpRight, CalendarDays, Plus, WalletCards, X } from '@/src/shared/components/material-icon/material-lucide-icons';
import DashboardLayout from '@/src/layouts/DashboardLayout';
import Fab from '@/src/shared/components/button-fab/button-fab';
import FormSidebar, { FormSidebarActions } from '@/src/shared/components/form-sidebar/form-sidebar';
import StatCard from '@/src/shared/components/stat-card/stat-card';
import TableTab, { type TabItem } from '@/src/shared/components/table-tab/table-tab';
import { Avatar, Button, ConfirmDialog, FormField, inputCls, Option, Select } from '@/src/shared/components';
import { useUIStore } from '@/src/app/stores/uiStore';
import { useTeamStore } from '@/src/features/team';
import { useExpenseStore, type ExpenseInput } from '../stores/expenseStore';
import { ExpenseRecordCard, ExpenseRecordDetailsSidebar, ExpenseRecordRow } from '../components/expense-record-item';
import {
  FINANCIAL_CATEGORY_LABELS,
  type Expense,
  type FinancialRecordCategory,
  type FinancialRecordStatus,
  type FinancialRecordType,
} from '../types';

type FilterKey = 'all' | 'income' | 'expense' | 'pending';
type SortKey = 'date' | 'amount' | 'category';

interface ExpenseFormValues {
  type: FinancialRecordType;
  category: FinancialRecordCategory;
  status: FinancialRecordStatus;
  amount: number;
  title: string;
  description: string;
  vendor: string;
  memberId: string;
  date: string;
}

const CATEGORY_OPTIONS = Object.entries(FINANCIAL_CATEGORY_LABELS) as [FinancialRecordCategory, string][];
const STATUS_OPTIONS = [
  ['paid', 'Paid'],
  ['pending', 'Pending'],
  ['scheduled', 'Scheduled'],
] as const;

const today = () => new Date().toISOString().slice(0, 10);

const fmt = (amount: number) =>
  '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const toExpenseInput = (data: ExpenseFormValues): ExpenseInput => ({
  type: data.type,
  category: data.category,
  status: data.status,
  amount: Number(data.amount),
  title: data.title.trim(),
  description: data.description.trim(),
  vendor: data.vendor.trim() || undefined,
  memberId: data.memberId || undefined,
  date: data.date,
});

const defaultFormValues: ExpenseFormValues = {
  type: 'expense',
  category: 'company-expense',
  status: 'paid',
  amount: 0,
  title: '',
  description: '',
  vendor: '',
  memberId: '',
  date: today(),
};

export default function ExpensesPage() {
  const { searchQuery } = useUIStore();
  const { members } = useTeamStore();
  const { expenses, addExpense, updateExpense, removeExpense } = useExpenseStore();
  const [activeTab, setActiveTab] = useState<FilterKey>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Expense | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<Expense | null>(null);
  const [deleteRecord, setDeleteRecord] = useState<Expense | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ExpenseFormValues>({ defaultValues: defaultFormValues });

  const selectedType = watch('type');
  const selectedMemberId = watch('memberId');
  const selectedMember = members.find(member => member.id === selectedMemberId);

  const totals = useMemo(() => {
    const income = expenses.filter(item => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
    const outgoing = expenses.filter(item => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
    const pending = expenses.filter(item => item.status !== 'paid').reduce((sum, item) => sum + item.amount, 0);
    return { income, outgoing, pending, net: income - outgoing };
  }, [expenses]);

  const tabCounts = useMemo(() => ({
    all: expenses.length,
    income: expenses.filter(item => item.type === 'income').length,
    expense: expenses.filter(item => item.type === 'expense').length,
    pending: expenses.filter(item => item.status !== 'paid').length,
  }), [expenses]);

  const tabs: TabItem[] = [
    { key: 'all', label: 'All', count: tabCounts.all },
    { key: 'income', label: 'Income', count: tabCounts.income },
    { key: 'expense', label: 'Expenses', count: tabCounts.expense },
    { key: 'pending', label: 'Pending', count: tabCounts.pending },
  ];

  const filtered = useMemo(() => {
    let list = expenses;
    if (activeTab === 'income') list = list.filter(item => item.type === 'income');
    if (activeTab === 'expense') list = list.filter(item => item.type === 'expense');
    if (activeTab === 'pending') list = list.filter(item => item.status !== 'paid');

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        FINANCIAL_CATEGORY_LABELS[item.category].toLowerCase().includes(q) ||
        item.vendor?.toLowerCase().includes(q) ||
        members.find(member => member.id === item.memberId)?.name.toLowerCase().includes(q),
      );
    }

    return [...list].sort((a, b) => {
      const result = sortKey === 'amount'
        ? a.amount - b.amount
        : sortKey === 'category'
          ? FINANCIAL_CATEGORY_LABELS[a.category].localeCompare(FINANCIAL_CATEGORY_LABELS[b.category])
          : Date.parse(a.date) - Date.parse(b.date);

      return sortDirection === 'asc' ? result : -result;
    });
  }, [activeTab, expenses, members, searchQuery, sortDirection, sortKey]);

  const openAdd = () => {
    setEditingRecord(null);
    reset(defaultFormValues);
    setSidebarOpen(true);
  };

  const openEdit = (record: Expense) => {
    setEditingRecord(record);
    setSelectedRecord(null);
    reset({
      type: record.type,
      category: record.category,
      status: record.status,
      amount: record.amount,
      title: record.title,
      description: record.description,
      vendor: record.vendor ?? '',
      memberId: record.memberId ?? '',
      date: record.date,
    });
    setSidebarOpen(true);
  };

  const onSubmit = (data: ExpenseFormValues) => {
    const input = toExpenseInput(data);
    if (editingRecord) updateExpense(editingRecord.id, input);
    else addExpense(input);
    setSidebarOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteRecord) return;
    removeExpense(deleteRecord.id);
    if (selectedRecord?.id === deleteRecord.id) setSelectedRecord(null);
    setDeleteRecord(null);
  };

  return (
    <DashboardLayout title="Expenses">
      <div className="flex w-full flex-col gap-6 py-6 md:min-h-full md:gap-8 md:py-10">
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <StatCard size="sm" variant="lime"
            icon={<ArrowDownLeft size={16} />}
            label="Project Income"
            value={fmt(totals.income)}
            badge={`${tabCounts.income} record${tabCounts.income === 1 ? '' : 's'}`}
            badgeLabel="incoming"
          />
          <StatCard size="sm" variant="surface"
            icon={<ArrowUpRight size={16} />}
            label="Company Expenses"
            value={fmt(totals.outgoing)}
            badge={`${tabCounts.expense} record${tabCounts.expense === 1 ? '' : 's'}`}
            badgeLabel="outgoing"
          />
          <StatCard size="sm" variant="white"
            icon={<WalletCards size={16} />}
            label="Net Balance"
            value={fmt(totals.net)}
            badge={totals.net >= 0 ? 'Positive' : 'Negative'}
            badgeLabel="current ledger"
          />
          <StatCard size="sm" variant="dark"
            icon={<CalendarDays size={16} />}
            label="Pending / Scheduled"
            value={fmt(totals.pending)}
            badge={tabCounts.pending}
            badgeLabel="open records"
          />
        </div>

        <div className="flex flex-col gap-3 md:flex-1 md:min-h-0">
          <div className="sticky top-0 z-20 -mx-4 bg-white/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <TableTab
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={key => setActiveTab(key as FilterKey)}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              sortValue={sortKey}
              sortOptions={[
                { key: 'date', label: 'Date' },
                { key: 'amount', label: 'Amount' },
                { key: 'category', label: 'Category' },
              ]}
              onSortChange={key => setSortKey(key as SortKey)}
              sortDirection={sortDirection}
              onSortDirectionChange={setSortDirection}
              actionLabel="Add Record"
              onAction={openAdd}
            />
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-[18px] border border-gray-100 bg-white py-16 text-center">
              <p className="type-card-title text-gray-500">
                {searchQuery ? `No records match "${searchQuery}".` : 'No financial records yet.'}
              </p>
              <Button type="button" className="mt-4" iconLeft={<Plus size={14} />} onClick={openAdd}>
                Add first record
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map(record => {
                const member = members.find(item => item.id === record.memberId);

                return (
                  <ExpenseRecordCard
                    key={record.id}
                    record={record}
                    memberName={member?.name}
                    onView={setSelectedRecord}
                    onEdit={openEdit}
                    onDelete={setDeleteRecord}
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="type-eyebrow hidden grid-cols-[minmax(260px,1fr)_140px_120px_32px] items-center gap-3 px-4 text-gray-400 lg:grid">
                <span>Record</span>
                <span>Status</span>
                <span className="text-right">Amount</span>
                <span />
              </div>

              {filtered.map(record => {
                const member = members.find(item => item.id === record.memberId);
                return (
                  <ExpenseRecordRow
                    key={record.id}
                    record={record}
                    memberName={member?.name}
                    onView={setSelectedRecord}
                    onEdit={openEdit}
                    onDelete={setDeleteRecord}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Fab icon={Plus} ariaLabel="Add financial record" onClick={openAdd} />

      <FormSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title={editingRecord ? 'Edit Record' : 'New Record'}
        description={editingRecord ? editingRecord.title : 'Track company expenses and project income.'}
        width="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Type" required>
                <Select {...register('type', { required: true })}>
                  <Option value="expense">Expense</Option>
                  <Option value="income">Income</Option>
                </Select>
              </FormField>
              <FormField label="Status" required>
                <Select {...register('status', { required: true })}>
                  {STATUS_OPTIONS.map(([value, label]) => (
                    <Option key={value} value={value}>{label}</Option>
                  ))}
                </Select>
              </FormField>
            </div>

            <FormField label="Title" required error={errors.title?.message}>
              <input
                {...register('title', { required: 'Title is required' })}
                placeholder={selectedType === 'income' ? 'Project payment' : 'Team salary'}
                className={inputCls(!!errors.title)}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Amount" required error={errors.amount?.message}>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  {...register('amount', { required: 'Amount is required', valueAsNumber: true, min: { value: 0.01, message: 'Amount must be greater than 0' } })}
                  className={inputCls(!!errors.amount)}
                />
              </FormField>
              <FormField label="Date" required error={errors.date?.message}>
                <input type="date" {...register('date', { required: 'Date is required' })} className={inputCls(!!errors.date)} />
              </FormField>
            </div>

            <FormField label="Category" required>
              <Select {...register('category', { required: true })}>
                {CATEGORY_OPTIONS.map(([value, label]) => (
                  <Option key={value} value={value}>{label}</Option>
                ))}
              </Select>
            </FormField>

            <FormField label={selectedType === 'income' ? 'Client / source' : 'Vendor / payee'}>
              <input {...register('vendor')} placeholder={selectedType === 'income' ? 'Acme Corp' : 'Internal payroll'} className={inputCls(false)} />
            </FormField>

            <FormField label="Team member">
              <div className="space-y-2">
                {selectedMember && (
                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-3 py-2.5">
                    <div className="flex min-w-0 items-center gap-2">
                      <Avatar name={selectedMember.name} id={selectedMember.id} size="sm" />
                      <div className="min-w-0">
                        <p className="type-card-title truncate text-gray-900">{selectedMember.name}</p>
                        <p className="type-muted truncate text-gray-400">{selectedMember.role}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setValue('memberId', '', { shouldDirty: true })}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-white hover:text-gray-700"
                      aria-label={`Remove ${selectedMember.name}`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                <Select {...register('memberId')} wrapperClassName="w-full">
                  <Option value="">No member assigned</Option>
                  {members.map(member => (
                    <Option key={member.id} value={member.id}>{member.name} — {member.role}</Option>
                  ))}
                </Select>
                <p className="type-meta text-gray-400">
                  Use this for salary, overtime, reimbursements, or member-specific payouts.
                </p>
              </div>
            </FormField>

            <FormField label="Description">
              <textarea
                {...register('description')}
                rows={4}
                placeholder="Add notes for finance reconciliation"
                className={`${inputCls(false)} resize-none`}
              />
            </FormField>
          </div>

          <FormSidebarActions
            onCancel={() => setSidebarOpen(false)}
            isSubmitting={isSubmitting}
            isDirty={isDirty}
            submitLabel={editingRecord ? 'Save Changes' : 'Create Record'}
          />
        </form>
      </FormSidebar>

      {selectedRecord && (
        <ExpenseRecordDetailsSidebar
          record={selectedRecord}
          memberName={members.find(member => member.id === selectedRecord.memberId)?.name}
          onClose={() => setSelectedRecord(null)}
          onEdit={openEdit}
          onDelete={record => setDeleteRecord(record)}
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteRecord}
        title="Delete record"
        message={deleteRecord ? `"${deleteRecord.title}" will be permanently removed from the ledger.` : ''}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteRecord(null)}
      />
    </DashboardLayout>
  );
}
