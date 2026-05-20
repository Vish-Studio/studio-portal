import { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Clock, CreditCard } from '@/src/shared/components/material-icon/material-lucide-icons';
import StatCard from '@/src/shared/components/stat-card/stat-card';
import DashboardLayout from '@/src/layouts/DashboardLayout';
import TableTab, { type TabItem } from '@/src/shared/components/table-tab/table-tab';
import { useUIStore } from '@/src/app/stores/uiStore';
import PaymentListItem, {
  formatPaymentAmount,
  type PaymentListItemData,
} from '../components/payment-list-item/payment-list-item';

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterKey = 'all' | 'paid' | 'pending' | 'overdue' | 'recurring';
type SortKey = 'date' | 'amount';

// ─── Demo Data ────────────────────────────────────────────────────────────────

const PAYMENTS: PaymentListItemData[] = [
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
            value={formatPaymentAmount(totalCollected)}
            badge={<><TrendingUp size={14} className="text-green-700" /> +8%</>}
            badgeLabel="vs last month"
          />
          <StatCard size="sm" variant="surface"
            icon={<Clock size={16} />}
            label="Pending"
            value={formatPaymentAmount(totalPending)}
            badge={`${tabCounts.pending} invoice${tabCounts.pending !== 1 ? 's' : ''}`}
            badgeLabel="awaiting payment"
          />
          <StatCard size="sm" variant="dark"
            icon={<TrendingDown size={16} />}
            label="Overdue"
            value={formatPaymentAmount(totalOverdue)}
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
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map(payment => (
                <PaymentListItem
                  key={payment.id}
                  payment={payment}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PaymentsPage;
