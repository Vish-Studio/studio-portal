import { useState, useMemo } from 'react';
import { CreditCard, Clock, CheckCircle } from 'lucide-react';
import UserLayout from '@/src/components/user/user-layout/user-layout';
import StatCard from '@/src/components/common/stat-card/stat-card';
import TableTab, { type TabItem } from '@/src/components/common/table-tab/table-tab';
import { MaterialIcon, StatusBadge } from '@/src/shared/components';
import { useProjectsStore } from '@/src/features/projects';
import { useClientsStore } from '@/src/features/clients';
import { getProjectAccent } from '@/src/features/projects';

const CURRENT_CLIENT_ID = 'c1';

type PaymentStatus = 'paid' | 'partial' | 'pending';
type FilterKey = 'all' | 'paid' | 'partial' | 'pending';
type SortKey = 'due' | 'project';

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
  paid: 'Paid in full',
  partial: 'Partial',
  pending: 'Pending',
};

const fmt = (n: number) =>
  '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const UserPaymentsPage = () => {
  const { projects } = useProjectsStore();
  const { clients } = useClientsStore();
  const currentClient = clients.find(c => c.id === CURRENT_CLIENT_ID);
  const [activeTab, setActiveTab] = useState<FilterKey>('all');
  const [sortKey, setSortKey] = useState<SortKey>('due');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const myProjects = projects.filter(p => p.clientId === CURRENT_CLIENT_ID);

  const rows: PaymentRow[] = myProjects.map(p => {
    const accent = getProjectAccent(p.service, p.package);
    const due = p.agreedPayment - p.paidPayment;
    const status: PaymentStatus =
      p.paidPayment >= p.agreedPayment ? 'paid'
        : p.paidPayment > 0 ? 'partial'
          : 'pending';

    return {
      id: p.id,
      project: p.name,
      service: accent.label,
      serviceIcon: accent.icon,
      agreedAmount: p.agreedPayment,
      paidAmount: p.paidPayment,
      dueAmount: due,
      status,
      timeline: p.timeline,
    };
  });

  const totalAgreed = rows.reduce((s, r) => s + r.agreedAmount, 0);
  const totalPaid = rows.reduce((s, r) => s + r.paidAmount, 0);
  const totalDue = rows.reduce((s, r) => s + r.dueAmount, 0);

  const tabCounts = useMemo(() => ({
    all: rows.length,
    paid: rows.filter(r => r.status === 'paid').length,
    partial: rows.filter(r => r.status === 'partial').length,
    pending: rows.filter(r => r.status === 'pending').length,
  }), [rows]);

  const tabs: TabItem[] = [
    { key: 'all', label: 'All', count: tabCounts.all },
    { key: 'paid', label: 'Paid', count: tabCounts.paid },
    { key: 'partial', label: 'Partial', count: tabCounts.partial },
    { key: 'pending', label: 'Pending', count: tabCounts.pending },
  ];

  const filtered = useMemo(() => {
    const list = activeTab === 'all' ? rows : rows.filter(r => r.status === activeTab);
    return [...list].sort((a, b) => {
      const result = sortKey === 'project'
        ? a.project.localeCompare(b.project, undefined, { sensitivity: 'base' })
        : a.dueAmount - b.dueAmount;

      return sortDirection === 'asc' ? result : -result;
    });
  }, [activeTab, rows, sortKey, sortDirection]);

  // ── Progress bar width for each row ──────────────────────────────────────────
  const pct = (row: PaymentRow) =>
    row.agreedAmount > 0 ? Math.round((row.paidAmount / row.agreedAmount) * 100) : 0;

  return (
    <UserLayout title="Payments">
      <div className="flex flex-col gap-6 md:gap-8 w-full mx-auto py-6 md:py-10">

        {/* Client identity chip */}
        {currentClient && (
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-[14px] bg-(--color-accent-lime) flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-gray-800">{currentClient.fullName.charAt(0)}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-(--color-ink)">{currentClient.fullName}</p>
              <p className="text-[11px] text-gray-400">{currentClient.companyName}</p>
            </div>
          </div>
        )}

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
            badge={`${Math.round((totalPaid / (totalAgreed || 1)) * 100)}%`}
            badgeLabel="of contract value"
          />
          <StatCard
            variant="dark"
            icon={<Clock size={16} />}
            label="Outstanding"
            value={fmt(totalDue)}
            badge={`${tabCounts.partial + tabCounts.pending} project${tabCounts.partial + tabCounts.pending !== 1 ? 's' : ''}`}
            badgeLabel="with balance due"
          />
        </div>

        <div className="flex-1 min-h-0 flex flex-col gap-3">
          {/* Tabs */}
          <div className="sticky top-0 z-20 -mx-4 bg-white/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 shrink-0">
            <TableTab
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={key => setActiveTab(key as FilterKey)}
              sortValue={sortKey}
              sortOptions={[
                { key: 'due', label: 'Outstanding' },
                { key: 'project', label: 'Project' },
              ]}
              onSortChange={key => setSortKey(key as SortKey)}
              sortDirection={sortDirection}
              onSortDirectionChange={setSortDirection}
            />
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-[18px] border border-gray-100 bg-white py-16 text-center">
              <p className="text-sm font-semibold text-gray-500">No payments found.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map(row => (
                <div key={row.id} className="rounded-[18px] border border-gray-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gray-100">
                        <MaterialIcon name={row.serviceIcon} size={16} className="text-gray-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-(--color-ink)">{row.project}</p>
                        <p className="truncate text-xs font-medium text-gray-400">{row.service} · {row.timeline || 'No timeline'}</p>
                      </div>
                    </div>
                    <StatusBadge label={STATUS_LABEL[row.status]} variant={STATUS_VARIANT[row.status]} />
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-(--color-surface) p-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Agreed</p>
                      <p className="mt-1 text-sm font-bold text-(--color-ink)">{fmt(row.agreedAmount)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Paid</p>
                      <p className="mt-1 text-sm font-bold text-green-600">{fmt(row.paidAmount)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Due</p>
                      <p className={`mt-1 text-sm font-bold ${row.dueAmount > 0 ? 'text-amber-600' : 'text-gray-300'}`}>
                        {row.dueAmount > 0 ? fmt(row.dueAmount) : '—'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full ${row.status === 'paid' ? 'bg-green-400' : row.status === 'partial' ? 'bg-amber-400' : 'bg-gray-300'}`}
                        style={{ width: `${pct(row)}%` }}
                      />
                    </div>
                    <span className="w-9 text-right text-[11px] font-bold text-gray-400">{pct(row)}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </UserLayout>
  );
};

export default UserPaymentsPage;
