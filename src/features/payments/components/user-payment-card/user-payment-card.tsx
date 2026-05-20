import { MaterialIcon, StatusBadge } from '@/src/shared/components';
import { formatPaymentAmount } from '../payment-list-item/payment-list-item';

export type UserPaymentStatus = 'paid' | 'partial' | 'pending';

export interface UserPaymentCardData {
  id: string;
  project: string;
  service: string;
  serviceIcon: string;
  agreedAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: UserPaymentStatus;
  timeline: string;
}

const STATUS_VARIANT: Record<UserPaymentStatus, 'green' | 'amber' | 'gray'> = {
  paid: 'green',
  partial: 'amber',
  pending: 'gray',
};

const STATUS_LABEL: Record<UserPaymentStatus, string> = {
  paid: 'Paid in full',
  partial: 'Partial',
  pending: 'Pending',
};

const paymentProgress = (row: UserPaymentCardData) =>
  row.agreedAmount > 0 ? Math.round((row.paidAmount / row.agreedAmount) * 100) : 0;

interface UserPaymentCardProps {
  payment: UserPaymentCardData;
}

export default function UserPaymentCard({ payment }: UserPaymentCardProps) {
  const progress = paymentProgress(payment);

  return (
    <div className="user-payment-card rounded-[18px] border border-gray-200 bg-white p-4">
      <div className="user-payment-card-header flex items-start justify-between gap-3">
        <div className="user-payment-card-summary flex min-w-0 items-center gap-3">
          <div className="user-payment-card-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gray-100">
            <MaterialIcon name={payment.serviceIcon} size={16} className="user-payment-card-icon-symbol text-gray-500" />
          </div>
          <div className="user-payment-card-copy min-w-0">
            <p className="user-payment-card-project truncate text-sm font-bold text-(--color-ink)">{payment.project}</p>
            <p className="user-payment-card-service truncate text-xs font-medium text-gray-400">{payment.service} - {payment.timeline || 'No timeline'}</p>
          </div>
        </div>
        <StatusBadge label={STATUS_LABEL[payment.status]} variant={STATUS_VARIANT[payment.status]} />
      </div>

      <div className="user-payment-card-amounts mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-(--color-surface) p-3">
        <div className="user-payment-card-amount">
          <p className="user-payment-card-label text-[10px] font-bold uppercase tracking-widest text-gray-400">Agreed</p>
          <p className="user-payment-card-value mt-1 text-sm font-bold text-(--color-ink)">{formatPaymentAmount(payment.agreedAmount)}</p>
        </div>
        <div className="user-payment-card-amount">
          <p className="user-payment-card-label text-[10px] font-bold uppercase tracking-widest text-gray-400">Paid</p>
          <p className="user-payment-card-value mt-1 text-sm font-bold text-green-600">{formatPaymentAmount(payment.paidAmount)}</p>
        </div>
        <div className="user-payment-card-amount">
          <p className="user-payment-card-label text-[10px] font-bold uppercase tracking-widest text-gray-400">Due</p>
          <p className={`user-payment-card-value mt-1 text-sm font-bold ${payment.dueAmount > 0 ? 'text-amber-600' : 'text-gray-300'}`}>
            {payment.dueAmount > 0 ? formatPaymentAmount(payment.dueAmount) : '-'}
          </p>
        </div>
      </div>

      <div className="user-payment-card-progress mt-3 flex items-center gap-2">
        <div className="user-payment-card-progress-track h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
          <div
            className={`user-payment-card-progress-value h-full rounded-full ${payment.status === 'paid' ? 'bg-green-400' : payment.status === 'partial' ? 'bg-amber-400' : 'bg-gray-300'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="user-payment-card-progress-label w-9 text-right text-[11px] font-bold text-gray-400">{progress}%</span>
      </div>
    </div>
  );
}
