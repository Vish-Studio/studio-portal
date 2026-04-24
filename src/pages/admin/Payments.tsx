import { CreditCard, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import StatCard from '@/src/components/stat-card/stat-card';
import Layout from '@/src/components/layout/layout';

const transactions = [
  { id: 'INV-001', client: 'Acme Corp', amount: '$2,400', status: 'Paid', date: 'Apr 15, 2026' },
  { id: 'INV-002', client: 'TechStart Ltd', amount: '$1,800', status: 'Pending', date: 'Apr 18, 2026' },
  { id: 'INV-003', client: 'NovaSoft', amount: '$3,200', status: 'Paid', date: 'Apr 10, 2026' },
  { id: 'INV-004', client: 'Bright Labs', amount: '$900', status: 'Overdue', date: 'Apr 5, 2026' },
  { id: 'INV-005', client: 'Global Co', amount: '$1,600', status: 'Pending', date: 'Apr 20, 2026' },
  { id: 'INV-006', client: 'Vertex Inc', amount: '$4,100', status: 'Paid', date: 'Apr 8, 2026' },
];

const statusStyles: Record<string, string> = {
  Paid: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Overdue: 'bg-red-100 text-red-600',
};

const Payments = () => {
  return (
    <Layout title="Payments">
      <div className="flex-1 flex flex-col gap-4 md:gap-6">

        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            variant="lime"
            icon={<CreditCard size={16} />}
            label="Total Collected"
            value="$18,240"
            badge={<><TrendingUp size={14} className="text-green-700" /> +8%</>}
            badgeLabel="vs last month"
            onAction={() => {}}
          />
          <StatCard
            variant="surface"
            icon={<Clock size={16} />}
            label="Pending"
            value="$3,400"
            badge="5 invoices"
            badgeLabel="Awaiting payment"
            onAction={() => {}}
          />
          <StatCard
            variant="dark"
            icon={<TrendingDown size={16} />}
            label="Overdue"
            value="$900"
            badge={<><TrendingDown size={14} className="text-red-400" /> 1 invoice</>}
            badgeLabel="Past due date"
            onAction={() => {}}
          />
        </div>

        {/* Transactions table */}
        <div className="rounded-[24px] bg-(--color-surface-alt) border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100">
            <h3 className="text-base font-semibold text-(--color-ink)">Recent Transactions</h3>
            <span className="text-xs font-medium text-gray-400">{transactions.length} entries</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Invoice</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Client</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, i) => (
                  <tr
                    key={tx.id}
                    className={`transition-colors hover:bg-white/60 ${i !== transactions.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{tx.id}</td>
                    <td className="px-6 py-4 font-medium text-(--color-ink)">{tx.client}</td>
                    <td className="px-6 py-4 font-semibold text-(--color-ink)">{tx.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyles[tx.status]}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default Payments;
