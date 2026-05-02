import { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Clock, CreditCard, RefreshCw, Pencil, Trash2, Eye } from 'lucide-react';
import StatCard from '@/src/components/common/stat-card/stat-card';
import Layout from '@/src/components/common/layout/layout';
import TableData, { RowActions, type Column } from '@/src/components/common/table/table';
import TableTab, { type TabItem } from '@/src/components/common/table-tab/table-tab';
import StatusBadge from '@/src/components/common/status-badge/status-badge';
import { useUIStore } from '@/src/store/ui';
import MaterialIcon from '@/src/components/common/material-icon/material-icon';

// ─── Types ────────────────────────────────────────────────────────────────────

type PaymentStatus = 'paid' | 'pending' | 'overdue';
type PaymentType = 'one-time' | 'recurring';
type RecurringInterval = 'monthly' | 'quarterly' | 'annually';
type FilterKey = 'all' | 'paid' | 'pending' | 'overdue' | 'recurring';

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

const Payments = () => {
  const { searchQuery } = useUIStore();
  const [activeTab, setActiveTab] = useState<FilterKey>('all');

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
    return list;
  }, [activeTab, searchQuery]);

  // ── Stat totals ──
  const totalCollected = PAYMENTS.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const totalPending = PAYMENTS.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
  const totalOverdue = PAYMENTS.filter(p => p.status === 'overdue').reduce((s, p) => s + p.amount, 0);

  // ── Table columns ──
  const columns: Column<Payment>[] = [
    {
      key: 'invoiceId',
      label: 'Invoice',
      render: row => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-gray-400">{row.invoiceId}</span>
          {row.type === 'recurring' && (
            <span className="inline-flex items-center gap-1 bg-violet-50 text-violet-600 text-[10px] font-semibold px-1.5 py-0.5 rounded-md">
              <RefreshCw size={9} />
              {row.interval ? INTERVAL_LABEL[row.interval] : 'Recurring'}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'client',
      label: 'Client',
      render: row => (
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-full ${clientColor(row.client)} flex items-center justify-center text-white font-bold text-[11px] shrink-0`}>
            {row.client.charAt(0)}
          </div>
          <span className="text-sm font-medium text-gray-900 whitespace-nowrap">{row.client}</span>
        </div>
      ),
    },
    {
      key: 'project',
      label: 'Project',
      hideBelow: 'md',
      render: row => (
        <span className="text-sm text-gray-500 whitespace-nowrap">{row.project}</span>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      align: 'right',
      render: row => (
        <span className="text-sm font-semibold text-gray-900 tabular-nums">{fmt(row.amount)}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: row => (
        <StatusBadge label={row.status} variant={STATUS_VARIANT[row.status]} />
      ),
    },
    {
      key: 'date',
      label: 'Date',
      hideBelow: 'lg',
      render: row => (
        <span className="text-sm text-gray-400 tabular-nums whitespace-nowrap">{row.date}</span>
      ),
    },
    {
      key: 'nextDate',
      label: 'Next Payment',
      hideBelow: 'lg',
      render: row => (
        <span className="text-sm text-gray-400 tabular-nums whitespace-nowrap">
          {row.nextDate ?? '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      align: 'right',
      width: 'w-10 md:w-auto',
      render: _row => (
        <RowActions
          actions={[
            {
              label: 'Edit payment',
              icon: <MaterialIcon name="edit" size={16} />,
              onClick: () => { }
            },
            {
              label: 'Delete', icon: <MaterialIcon name="delete" size={16} />,
              onClick: () => { },
              variant: 'danger'
            },
          ]}
        />
      ),
    },
  ];

  return (
    <Layout title="Payments" fullHeight>
      <div className="flex-1 min-h-0 flex flex-col gap-6 md:gap-8 w-full mx-auto pb-6">

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
          <StatCard
            variant="lime"
            icon={<CreditCard size={16} />}
            label="Total Collected"
            value={fmt(totalCollected)}
            badge={<><TrendingUp size={14} className="text-green-700" /> +8%</>}
            badgeLabel="vs last month"
          />
          <StatCard
            variant="surface"
            icon={<Clock size={16} />}
            label="Pending"
            value={fmt(totalPending)}
            badge={`${tabCounts.pending} invoice${tabCounts.pending !== 1 ? 's' : ''}`}
            badgeLabel="awaiting payment"
          />
          <StatCard
            variant="dark"
            icon={<TrendingDown size={16} />}
            label="Overdue"
            value={fmt(totalOverdue)}
            badge={<><TrendingDown size={14} className="text-red-400" /> {tabCounts.overdue} overdue</>}
            badgeLabel="requires attention"
          />
        </div>

        <div className="flex-1 min-h-0 flex flex-col gap-3">
          {/* Tabs */}
          <div className="sticky top-0 z-20 -mx-4 bg-white/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <TableTab
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={key => setActiveTab(key as FilterKey)}
            />
          </div>

          {/* Table — flex-1 min-h-0 ensures it fills the remaining height */}
          <div className="flex-1 min-h-0">
            <TableData<Payment>
              columns={columns}
              data={filtered}
              className="h-full"
              emptyMessage={searchQuery ? `No payments match "${searchQuery}".` : 'No payments found.'}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Payments;
