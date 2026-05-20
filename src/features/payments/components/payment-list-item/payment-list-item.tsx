import { RefreshCw, Trash2 } from '@/src/shared/components/material-icon/material-lucide-icons';
import { CardListItem, MaterialIcon, RecordMeta, StatusBadge } from '@/src/shared/components';

export type PaymentStatus = 'paid' | 'pending' | 'overdue';
export type PaymentType = 'one-time' | 'recurring';
export type RecurringInterval = 'monthly' | 'quarterly' | 'annually';

export interface PaymentListItemData {
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
  'bg-violet-500',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-cyan-500',
  'bg-indigo-500',
];

const clientColor = (name: string) => CLIENT_COLORS[name.charCodeAt(0) % CLIENT_COLORS.length];

export const formatPaymentAmount = (amount: number) =>
  '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

interface PaymentListItemProps {
  payment: PaymentListItemData;
  onEdit?: (payment: PaymentListItemData) => void;
  onDelete?: (payment: PaymentListItemData) => void;
}

export default function PaymentListItem({ payment, onEdit, onDelete }: PaymentListItemProps) {
  return (
    <CardListItem
      title={payment.invoiceId}
      titleClassName="payment-list-item-invoice-id font-mono text-gray-500"
      subtitle={(
        <div className="payment-list-item-subtitle flex flex-wrap items-center gap-2">
          <RecordMeta className="payment-list-item-date" items={[{ label: payment.date, icon: 'event' }]} />
          {payment.type === 'recurring' && (
            <span className="payment-list-item-recurring type-count inline-flex items-center gap-1 rounded-md bg-violet-50 px-1.5 py-0.5 text-violet-600">
              <RefreshCw size={9} />
              {payment.interval ? INTERVAL_LABEL[payment.interval] : 'Recurring'}
            </span>
          )}
        </div>
      )}
      actions={[
        { label: 'Edit payment', icon: <MaterialIcon name="edit" size={16} />, onClick: () => onEdit?.(payment) },
        { label: 'Delete', icon: <Trash2 size={14} />, onClick: () => onDelete?.(payment), variant: 'danger' },
      ]}
      className="payment-list-item grid gap-3 rounded-[18px] border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50 md:grid-cols-[minmax(220px,1fr)_minmax(190px,1fr)_110px_110px_120px_32px] md:items-center"
      headerClassName="payment-list-item-header"
      actionsClassName="payment-list-item-actions"
    >
      <div className="payment-list-item-client flex min-w-0 items-center gap-2.5">
        <div className={`payment-list-item-avatar flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${clientColor(payment.client)} text-[11px] font-bold text-white`}>
          {payment.client.charAt(0)}
        </div>
        <div className="payment-list-item-client-copy min-w-0">
          <p className="payment-list-item-client-name type-card-title truncate text-(--color-ink)">{payment.client}</p>
          <RecordMeta items={[{ label: payment.project, icon: 'work' }]} className="payment-list-item-project mt-1" />
        </div>
      </div>

      <p className="payment-list-item-amount type-card-title text-left tabular-nums text-(--color-ink) md:text-right">
        {formatPaymentAmount(payment.amount)}
      </p>

      <StatusBadge label={payment.status} variant={STATUS_VARIANT[payment.status]} />

      <RecordMeta className="payment-list-item-next-date" items={[{ label: payment.nextDate ?? '-', icon: 'event_repeat' }]} />
    </CardListItem>
  );
}
