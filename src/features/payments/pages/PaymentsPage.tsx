import { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Clock, CreditCard, RefreshCw, Trash2 } from '@/src/shared/components/material-icon/material-lucide-icons';
import StatCard from '@/src/shared/components/stat-card/stat-card';
import DashboardLayout from '@/src/layouts/DashboardLayout';
import { RowActionsMenu } from '@/src/shared/components/table/table';
import TableTab, { type TabItem } from '@/src/shared/components/table-tab/table-tab';
import { MaterialIcon, RecordMeta, StatusBadge } from '@/src/shared/components';
import { useUIStore } from '@/src/app/stores/uiStore';

// ─── Types ────────────────────────────────────────────────────────────────────

type PaymentStatus = 'paid' | 'pending' | 'overdue';
type PaymentType = 'one-time' | 'recurring';
type RecurringInterval = 'monthly' | 'quarterly' | 'annually';
type FilterKey = 'all' | 'paid' | 'pending' | 'overdue' | 'recurring';
type SortKey = 'date' | 'amount';

interface Payment {
  id: string;
  invoiceId: string;
  client: string;
  project: string;
  amount: number;
  status: PaymentStatus;
  type: PaymentType;
  interval?: RecurringInterval;
  date: string;
  nextDate?: string;
}

// ─── Demo Data ────────────────────────────────────────────────────────────────

const PAYMENTS: Payment[] = [
  { id: '1', invoiceId: 'INV-001', client: 'Acme Corp', project: 'Brand Refresh', amount: 2400, status: 'paid', type: 'recurring', interval: 'monthly', date: 'Apr 15, 2026', nextDate: 'May 15, 2026' },
  { id: '2', invoiceId: 'INV-002', client: 'TechStart Ltd', project: 'App Development', amount: 1800, status: 'pending', type: 'recurring', interval: 'monthly', date: 'Apr 18, 2026', nextDate: 'May 18, 2026' },
  { id: '3', invoiceId: 'INV-003', client: 'NovaSoft', project: 'Dashboard UI', amount: 3200, status: 'paid', type: 'one-time', date: 'Apr 10, 2026' },
  { id: '4', invoiceId: 'INV-004', client: 'Bright Labs', project: 'Logo Design', amount: 900, status: 'overdue', type: 'one-time', date: 'Apr 5, 2026' },
  { id: '5', invoiceId: 'INV-005', client: 'Global Co', project: 'E-commerce Platform', amount: 1600, status: 'pending', type: 'recurring', interval: 'quarterly', date: 'Apr 20, 2026', nextDate: 'Jul 20, 2026' },
  { id: '6', invoiceId: 'INV-006', client: 'Vertex Inc', project: 'Brand Refresh', amount: 4100, status: 'paid', type: 'recurring', interval: 'monthly', date: 'Apr 8, 2026', nextDate: 'May 8, 2026' },
  { id: '7', invoiceId: 'INV-007', client: 'Peak Digital', project: 'Mobile App', amount: 5500, status: 'paid', type: 'recurring', interval: 'annually', date: 'Apr 1, 2026', nextDate: 'Apr 1, 2027' },
  { id: '8', invoiceId: 'INV-008', client: 'Summit Media', project: 'Content Strategy', amount: 1200, status: 'overdue', type: 'recurring', interval: 'monthly', date: 'Mar 28, 2026', nextDate: 'Apr 28, 2026' },
  { id: '9', invoiceId: 'INV-009', client: 'BluePrint Co', project: 'UX Audit', amount: 750, status: 'paid', type: 'one-time', date: 'Apr 3, 2026' },
  { id: '10', invoiceId: 'INV-010', client: 'Orbit Labs', project: 'SEO Campaign', amount: 980, status: 'pending', type: 'recurring', interval: 'monthly', date: 'Apr 22, 2026', nextDate: 'May 22, 2026' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const INTERVAL_LABEL: Record<RecurringInterval, string> = {
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  annually: 'Annual',
};

const STATUS_VARIANT: Record<PaymentStatus, 'green' | 'amber' | 'red'> = {
  paid: 'green',
  pending: 'amber',
  overdue: 'red',
};

const CLIENT_COLORS = [
  'bg-violet-500', 'bg-blue-500', 'bg-emerald-500',
  'bg-orange-500', 'bg-pink-500', 'bg-cyan-500', 'bg-indigo-500',
];

const clientColor = (name: string) =>
  CLIENT_COLORS[name.charCodeAt(0) % CLIENT_COLORS.length];

// ─── Payments Page ────────────────────────────────────────────────────────────

const PaymentsPage = () => {
  const { searchQuery } = useUIStore();
  const [activeTab, setActiveTab] = useState<FilterKey>('all');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // ── Tab counts ──
  const tabCounts = useMemo(() => ({
    all: PAYMENTS.length,
    paid: PAYMENTS.filter(p => p.status === 'paid').length,
    pending: PAYMENTS.filter(p => p.status === 'pending').length,
    overdue: PAYMENTS.filter(p => p.status === 'overdue').length,
    recurring: PAYMENTS.filter(p => p.type === 'recurring').length,
  }), []);

  const tabs: TabItem[] = [
    { key: 'all', label: 'All', count: tabCounts.all },
    { key: 'paid', label: 'Paid', count: tabCounts.paid },
    { key: 'pending', label: 'Pending', count: tabCounts.pending },
    { key: 'overdue', label: 'Overdue', count: tabCounts.overdue },
    { key: 'recurring', label: 'Recurring', count: tabCounts.recurring },
  ];

  // ── Filtered rows ──
  const filtered = useMemo(() => {
    let list = PAYMENTS;
    if (activeTab === 'recurring') list = list.filter(p => p.type === 'recurring');
    else if (activeTab !== 'all') list = list.filter(p => p.status === activeTab);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.client.toLowerCase().includes(q) ||
        p.project.toLowerCase().includes(q) ||
        p.invoiceId.toLowerCase().includes(q),
      );
    }
    return [...list].sort((a, b) => {
      const result = sortKey === 'amount'
        ? a.amount - b.amount
        : Date.parse(a.date) - Date.parse(b.date);

      return sortDirection === 'asc' ? result : -result;
    });
  }, [activeTab, searchQuery, sortKey, sortDirection]);

  // ── Stat totals ──
  const totalCollected = PAYMENTS.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const totalPending = PAYMENTS.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
  const totalOverdue = PAYMENTS.filter(p => p.status === 'overdue').reduce((s, p) => s + p.amount, 0);

  return (
    <DashboardLayout title="Payments">
      <div className="flex flex-col gap-6 w-full mx-auto py-6 md:min-h-full md:gap-8 md:py-10">

        {/* Stats row */}
        <div className="grid shrink-0 grid-cols-2 gap-3 xl:grid-cols-3">
          <StatCard size="sm" variant="lime"
            icon={<CreditCard size={16} />}
            label="Total Collected"
            value={fmt(totalCollected)}
            badge={<><TrendingUp size={14} className="text-green-700" /> +8%</>}
            badgeLabel="vs last month"
          />
          <StatCard size="sm" variant="surface"
            icon={<Clock size={16} />}
            label="Pending"
            value={fmt(totalPending)}
            badge={`${tabCounts.pending} invoice${tabCounts.pending !== 1 ? 's' : ''}`}
            badgeLabel="awaiting payment"
          />
          <StatCard size="sm" variant="dark"
            icon={<TrendingDown size={16} />}
            label="Overdue"
            value={fmt(totalOverdue)}
            badge={<><TrendingDown size={14} className="text-red-400" /> {tabCounts.overdue} overdue</>}
            badgeLabel="requires attention"
          />
        </div>

        <div className="flex flex-col gap-3 md:flex-1 md:min-h-0">
          {/* Tabs */}
          <div className="sticky top-0 z-20 -mx-4 bg-white/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <TableTab
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={key => setActiveTab(key as FilterKey)}
              sortValue={sortKey}
              sortOptions={[
                { key: 'date', label: 'Date created' },
                { key: 'amount', label: 'Amount' },
              ]}
              onSortChange={key => setSortKey(key as SortKey)}
              sortDirection={sortDirection}
              onSortDirectionChange={setSortDirection}
            />
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-[18px] border border-gray-100 bg-white py-16 text-center">
              <p className="type-card-title text-gray-500">
                {searchQuery ? `No payments match "${searchQuery}".` : 'No payments found.'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="type-eyebrow hidden grid-cols-[minmax(220px,1fr)_minmax(190px,1fr)_110px_110px_120px_32px] items-center gap-3 px-4 text-gray-400 md:grid">
                <span>Invoice</span>
                <span>Client / Project</span>
                <span className="text-right">Amount</span>
                <span>Status</span>
                <span>Next</span>
                <span />
              </div>

              {filtered.map(payment => (
                <div
                  key={payment.id}
                  className="grid gap-3 rounded-[18px] border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50 md:grid-cols-[minmax(220px,1fr)_minmax(190px,1fr)_110px_110px_120px_32px] md:items-center"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="type-label font-mono text-gray-500">{payment.invoiceId}</span>
                      {payment.type === 'recurring' && (
                        <span className="type-count inline-flex items-center gap-1 rounded-md bg-violet-50 px-1.5 py-0.5 text-violet-600">
                          <RefreshCw size={9} />
                          {payment.interval ? INTERVAL_LABEL[payment.interval] : 'Recurring'}
                        </span>
                      )}
                    </div>
                    <RecordMeta className="mt-1" items={[{ label: payment.date, icon: 'event' }]} />
                  </div>

                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${clientColor(payment.client)} text-[11px] font-bold text-white`}>
                      {payment.client.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="type-card-title truncate text-(--color-ink)">{payment.client}</p>
                      <RecordMeta items={[{ label: payment.project, icon: 'work' }]} className="mt-1" />
                    </div>
                  </div>

                  <p className="type-card-title text-left tabular-nums text-(--color-ink) md:text-right">
                    {fmt(payment.amount)}
                  </p>

                  <StatusBadge label={payment.status} variant={STATUS_VARIANT[payment.status]} />

                  <RecordMeta items={[{ label: payment.nextDate ?? '—', icon: 'event_repeat' }]} />

                  <div className="flex justify-end">
                    <RowActionsMenu
                      actions={[
                        { label: 'Edit payment', icon: <MaterialIcon name="edit" size={16} />, onClick: () => { } },
                        { label: 'Delete', icon: <Trash2 size={14} />, onClick: () => { }, variant: 'danger' },
                      ]}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PaymentsPage;
