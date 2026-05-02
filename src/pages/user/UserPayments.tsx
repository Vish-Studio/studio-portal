import { useState, useMemo } from 'react';
import { CreditCard, Clock, CheckCircle } from 'lucide-react';
import UserLayout from '@/src/components/user/user-layout/user-layout';
import StatCard from '@/src/components/common/stat-card/stat-card';
import TableData, { type Column } from '@/src/components/common/table/table';
import TableTab, { type TabItem } from '@/src/components/common/table-tab/table-tab';
import StatusBadge from '@/src/components/common/status-badge/status-badge';
import MaterialIcon from '@/src/components/common/material-icon/material-icon';
import { useProjectsStore } from '@/src/store/projects';
import { getProjectAccent } from '@/src/data/projects';
import { DEMO_CLIENTS } from '@/src/data/clients';

const CURRENT_CLIENT_ID = 'c1';
const currentClient = DEMO_CLIENTS.find(c => c.id === CURRENT_CLIENT_ID)!;

type PaymentStatus = 'paid' | 'partial' | 'pending';
type FilterKey = 'all' | 'paid' | 'partial' | 'pending';

interface PaymentRow {
  id: string;
  project: string;
  service: string;
  serviceIcon: string;
  agreedAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: PaymentStatus;
  timeline: string;
}

const STATUS_VARIANT: Record<PaymentStatus, 'green' | 'amber' | 'gray'> = {
  paid: 'green',
  partial: 'amber',
  pending: 'gray',
};

const STATUS_LABEL: Record<PaymentStatus, string> = {
  paid: 'Paid',
  partial: 'Partial',
  pending: 'Pending',
};

const fmt = (n: number) =>
  '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const UserPayments = () => {
  const { projects } = useProjectsStore();
  const [activeTab, setActiveTab] = useState<FilterKey>('all');

  const myProjects = projects.filter(p => p.clientId === CURRENT_CLIENT_ID);

  const rows: PaymentRow[] = myProjects.map(p => {
    const accent = getProjectAccent(p.service, p.package);
    const due    = p.agreedPayment - p.paidPayment;
    const status: PaymentStatus =
      p.paidPayment >= p.agreedPayment ? 'paid'
      : p.paidPayment > 0              ? 'partial'
      : 'pending';

    return {
      id:            p.id,
      project:       p.name,
      service:       accent.label,
      serviceIcon:   accent.icon,
      agreedAmount:  p.agreedPayment,
      paidAmount:    p.paidPayment,
      dueAmount:     due,
      status,
      timeline:      p.timeline,
    };
  });

  const totalAgreed  = rows.reduce((s, r) => s + r.agreedAmount, 0);
  const totalPaid    = rows.reduce((s, r) => s + r.paidAmount, 0);
  const totalDue     = rows.reduce((s, r) => s + r.dueAmount, 0);

  const tabCounts = useMemo(() => ({
    all:     rows.length,
    paid:    rows.filter(r => r.status === 'paid').length,
    partial: rows.filter(r => r.status === 'partial').length,
    pending: rows.filter(r => r.status === 'pending').length,
  }), [rows]);

  const tabs: TabItem[] = [
    { key: 'all',     label: 'All',     count: tabCounts.all },
    { key: 'paid',    label: 'Paid',    count: tabCounts.paid },
    { key: 'partial', label: 'Partial', count: tabCounts.partial },
    { key: 'pending', label: 'Pending', count: tabCounts.pending },
  ];

  const filtered = useMemo(
    () => activeTab === 'all' ? rows : rows.filter(r => r.status === activeTab),
    [activeTab, rows],
  );

  const columns: Column<PaymentRow>[] = [
    {
      key: 'project',
      label: 'Project',
      render: row => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <MaterialIcon name={row.serviceIcon} size={13} className="text-gray-500" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{row.project}</p>
            <p className="text-[10px] text-gray-400">{row.service}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'agreedAmount',
      label: 'Agreed',
      align: 'right',
      render: row => (
        <span className="text-sm font-semibold text-gray-700 tabular-nums">{fmt(row.agreedAmount)}</span>
      ),
    },
    {
      key: 'paidAmount',
      label: 'Paid',
      align: 'right',
      render: row => (
        <span className="text-sm font-semibold text-green-600 tabular-nums">{fmt(row.paidAmount)}</span>
      ),
    },
    {
      key: 'dueAmount',
      label: 'Outstanding',
      align: 'right',
      hideBelow: 'md',
      render: row => (
        <span className={`text-sm font-semibold tabular-nums ${row.dueAmount > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
          {row.dueAmount > 0 ? fmt(row.dueAmount) : '—'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: row => (
        <StatusBadge label={STATUS_LABEL[row.status]} variant={STATUS_VARIANT[row.status]} />
      ),
    },
    {
      key: 'timeline',
      label: 'Timeline',
      hideBelow: 'lg',
      render: row => (
        <span className="text-sm text-gray-400 whitespace-nowrap">{row.timeline}</span>
      ),
    },
  ];

  return (
    <UserLayout title="Payments" fullHeight>
      <div className="flex-1 min-h-0 flex flex-col gap-6 md:gap-8 w-full mx-auto pb-6">

        {/* Client header */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-[14px] bg-(--color-accent-lime) flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-gray-800">{currentClient.displayName.charAt(0)}</span>
          </div>
          <div>
            <p className="text-sm font-bold text-(--color-ink)">{currentClient.displayName}</p>
            <p className="text-[11px] text-gray-400">{currentClient.companyName}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
          <StatCard
            variant="lime"
            icon={<CreditCard size={16} />}
            label="Contract Value"
            value={fmt(totalAgreed)}
            badge={`${rows.length} project${rows.length !== 1 ? 's' : ''}`}
            badgeLabel="total"
          />
          <StatCard
            variant="surface"
            icon={<CheckCircle size={16} />}
            label="Total Paid"
            value={fmt(totalPaid)}
            badge={`${tabCounts.paid} paid`}
            badgeLabel={`${Math.round((totalPaid / totalAgreed) * 100) || 0}% of contract`}
          />
          <StatCard
            variant="dark"
            icon={<Clock size={16} />}
            label="Outstanding"
            value={fmt(totalDue)}
            badge={`${tabCounts.partial + tabCounts.pending} unpaid`}
            badgeLabel="projects"
          />
        </div>

        <div className="flex-1 min-h-0 flex flex-col gap-3">
          {/* Tabs */}
          <div className="sticky top-0 z-20 -mx-4 bg-white/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 shrink-0">
            <TableTab
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={key => setActiveTab(key as FilterKey)}
            />
          </div>

          {/* Table */}
          <div className="flex-1 min-h-0">
            <TableData<PaymentRow>
              columns={columns}
              data={filtered}
              className="h-full"
              emptyMessage="No payments found."
            />
          </div>
        </div>

      </div>
    </UserLayout>
  );
};

export default UserPayments;
