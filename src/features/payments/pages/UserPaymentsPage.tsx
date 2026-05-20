import { useState, useMemo } from 'react';
import { CreditCard, Clock, CheckCircle } from '@/src/shared/components/material-icon/material-lucide-icons';
import UserLayout from '@/src/layouts/UserLayout';
import StatCard from '@/src/shared/components/stat-card/stat-card';
import TableTab, { type TabItem } from '@/src/shared/components/table-tab/table-tab';
import { useProjectsStore } from '@/src/features/projects';
import { useClientsStore } from '@/src/features/clients';
import { getProjectAccent } from '@/src/features/projects';
import UserPaymentCard, {
  type UserPaymentCardData,
  type UserPaymentStatus,
} from '../components/user-payment-card/user-payment-card';
import { formatPaymentAmount } from '../components/payment-list-item/payment-list-item';

const CURRENT_CLIENT_ID = 'c1';

type FilterKey = 'all' | 'paid' | 'partial' | 'pending';
type SortKey = 'due' | 'project';

const UserPaymentsPage = () => {
  const { projects } = useProjectsStore();
  const { clients } = useClientsStore();
  const currentClient = clients.find(c => c.id === CURRENT_CLIENT_ID);
  const [activeTab, setActiveTab] = useState<FilterKey>('all');
  const [sortKey, setSortKey] = useState<SortKey>('due');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const myProjects = projects.filter(p => p.clientId === CURRENT_CLIENT_ID);

  const rows: UserPaymentCardData[] = myProjects.map(p => {
    const accent = getProjectAccent(p.service, p.package);
    const due = p.agreedPayment - p.paidPayment;
    const status: UserPaymentStatus =
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
        <div className="grid shrink-0 grid-cols-2 gap-3 xl:grid-cols-3">
          <StatCard size="sm" variant="lime"
            icon={<CreditCard size={16} />}
            label="Contract Value"
            value={formatPaymentAmount(totalAgreed)}
            badge={`${rows.length} project${rows.length !== 1 ? 's' : ''}`}
            badgeLabel="total"
          />
          <StatCard size="sm" variant="surface"
            icon={<CheckCircle size={16} />}
            label="Total Paid"
            value={formatPaymentAmount(totalPaid)}
            badge={`${Math.round((totalPaid / (totalAgreed || 1)) * 100)}%`}
            badgeLabel="of contract value"
          />
          <StatCard size="sm" variant="dark"
            icon={<Clock size={16} />}
            label="Outstanding"
            value={formatPaymentAmount(totalDue)}
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
                <UserPaymentCard key={row.id} payment={row} />
              ))}
            </div>
          )}
        </div>

      </div>
    </UserLayout>
  );
};

export default UserPaymentsPage;
