import { Pencil, Trash2 } from '@/src/shared/components/material-icon/material-lucide-icons';
import {
  Button,
  CardListItem,
  FormSidebar,
  FormSidebarFooter,
  formatRecordDate,
  ListItemRow,
  MaterialIcon,
  RecordMeta,
  StatusBadge,
} from '@/src/shared/components';
import {
  FINANCIAL_CATEGORY_LABELS,
  FINANCIAL_STATUS_LABELS,
  type Expense,
  type FinancialRecordCategory,
  type FinancialRecordStatus,
} from '../types';

export const FINANCIAL_STATUS_VARIANT: Record<FinancialRecordStatus, 'green' | 'amber' | 'blue'> = {
  paid: 'green',
  pending: 'amber',
  scheduled: 'blue',
};

export const FINANCIAL_CATEGORY_ICON: Record<FinancialRecordCategory, string> = {
  'team-salary': 'groups',
  overtime: 'more_time',
  'company-expense': 'business_center',
  software: 'deployed_code',
  office: 'apartment',
  marketing: 'campaign',
  travel: 'flight_takeoff',
  'project-income': 'payments',
  retainer: 'event_repeat',
  other: 'receipt_long',
};

const fmt = (amount: number) =>
  '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const dateLabel = (value: string) => formatRecordDate(`${value}T00:00:00`, value);

interface ExpenseRecordActions {
  record: Expense;
  memberName?: string;
  onView: (record: Expense) => void;
  onEdit: (record: Expense) => void;
  onDelete: (record: Expense) => void;
}

export function ExpenseRecordRow({ record, memberName, onView, onEdit, onDelete }: ExpenseRecordActions) {
  const isIncome = record.type === 'income';

  return (
    <ListItemRow
      item={record}
      onOpen={onView}
      title={record.title}
      subtitle={(
        <RecordMeta
          className="expense-record-row-meta"
          items={[
            { label: FINANCIAL_CATEGORY_LABELS[record.category], icon: FINANCIAL_CATEGORY_ICON[record.category] },
            { label: dateLabel(record.date), icon: 'event' },
            memberName && { label: memberName, icon: 'person' },
            !memberName && record.vendor && { label: record.vendor, icon: 'storefront' },
          ]}
        />
      )}
      icon={(
        <div className={`expense-record-row-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${isIncome ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
          <MaterialIcon name={FINANCIAL_CATEGORY_ICON[record.category]} size={18} />
        </div>
      )}
      actions={[
        { label: 'Edit record', icon: <Pencil size={14} />, onClick: () => onEdit(record) },
        { label: 'Delete', icon: <Trash2 size={14} />, onClick: () => onDelete(record), variant: 'danger' },
      ]}
      secondary={<StatusBadge label={FINANCIAL_STATUS_LABELS[record.status]} variant={FINANCIAL_STATUS_VARIANT[record.status]} />}
      tertiary={(
        <p className={`expense-record-row-amount type-card-title tabular-nums lg:text-right ${isIncome ? 'text-green-700' : 'text-(--color-ink)'}`}>
          {isIncome ? '+' : '-'}{fmt(record.amount)}
        </p>
      )}
      status={(
        <span className={`expense-record-row-type type-count inline-flex items-center rounded-md px-1.5 py-0.5 ${isIncome ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {isIncome ? 'Income' : 'Expense'}
        </span>
      )}
      className="expense-record-row"
      gridClassName="lg:grid-cols-[minmax(260px,1fr)_140px_120px_110px_32px]"
    />
  );
}

export function ExpenseRecordCard({ record, memberName, onView, onEdit, onDelete }: ExpenseRecordActions) {
  const isIncome = record.type === 'income';

  return (
    <CardListItem
      item={record}
      onOpen={onView}
      title={record.title}
      icon={(
        <div className={`expense-record-card-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${isIncome ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
          <MaterialIcon name={FINANCIAL_CATEGORY_ICON[record.category]} size={18} />
        </div>
      )}
      actions={[
        { label: 'Edit record', icon: <Pencil size={14} />, onClick: () => onEdit(record) },
        { label: 'Delete', icon: <Trash2 size={14} />, onClick: () => onDelete(record), variant: 'danger' },
      ]}
      className="expense-record-card flex flex-col rounded-[18px] border border-gray-200 bg-white text-left transition-colors hover:bg-gray-50"
      headerClassName="expense-record-card-header"
      actionsClassName="expense-record-card-actions"
      footerClassName="expense-record-card-footer mt-auto flex items-center justify-between gap-3 border-t border-gray-50 px-4 py-2.5"
      footer={(
        <>
          <div className="expense-record-card-footer-meta flex min-w-0 items-center gap-2">
            <StatusBadge label={FINANCIAL_STATUS_LABELS[record.status]} variant={FINANCIAL_STATUS_VARIANT[record.status]} />
          </div>
          <RecordMeta className="expense-record-card-date shrink-0" items={[{ label: dateLabel(record.date), icon: 'event' }]} />
        </>
      )}
    >
      <div className="expense-record-card-summary flex items-center justify-between gap-3 rounded-2xl bg-gray-50 px-3 py-2.5">
        <div className="expense-record-card-summary-meta min-w-0">
          <span className={`expense-record-card-type type-count inline-flex items-center rounded-md px-1.5 py-0.5 ${isIncome ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {isIncome ? 'Income' : 'Expense'}
          </span>
          {(memberName || record.vendor) && (
            <RecordMeta
              className="expense-record-card-assignment mt-1"
              items={[{ label: memberName ?? record.vendor ?? '', icon: memberName ? 'person' : 'storefront' }]}
            />
          )}
        </div>
        <p className={`expense-record-card-amount type-card-title shrink-0 tabular-nums ${isIncome ? 'text-green-700' : 'text-(--color-ink)'}`}>
          {isIncome ? '+' : '-'}{fmt(record.amount)}
        </p>
      </div>
      <RecordMeta
        className="expense-record-card-meta mt-3"
        items={[
          { label: FINANCIAL_CATEGORY_LABELS[record.category], icon: FINANCIAL_CATEGORY_ICON[record.category] },
        ]}
      />

    </CardListItem>
  );
}

export function ExpenseRecordDetailsSidebar({
  record,
  memberName,
  onClose,
  onEdit,
  onDelete,
}: {
  record: Expense;
  memberName?: string;
  onClose: () => void;
  onEdit: (record: Expense) => void;
  onDelete: (record: Expense) => void;
}) {
  const isIncome = record.type === 'income';

  return (
    <FormSidebar isOpen onClose={onClose} title="Record details" description={record.title} width="md">
      <div className="expense-record-details flex min-h-0 flex-1 flex-col">
        <div className="expense-record-details-body flex-1 overflow-y-auto px-6 py-5">
          <div className="expense-record-details-summary mb-5 border-b border-gray-100 pb-5">
            <div className="expense-record-details-header mb-4 flex items-start gap-3">
              <div className={`expense-record-details-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${isIncome ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                <MaterialIcon name={FINANCIAL_CATEGORY_ICON[record.category]} size={20} />
              </div>
              <div className="expense-record-details-title-wrap min-w-0 flex-1">
                <div className="expense-record-details-title-row flex flex-wrap items-center gap-2">
                  <h2 className="expense-record-details-title text-xl font-bold leading-tight text-(--color-ink)">{record.title}</h2>
                  <span className={`expense-record-details-type type-count inline-flex items-center rounded-md px-1.5 py-0.5 ${isIncome ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {isIncome ? 'Income' : 'Expense'}
                  </span>
                </div>
                <p className="expense-record-details-category mt-1 text-xs font-semibold text-gray-400">{FINANCIAL_CATEGORY_LABELS[record.category]}</p>
              </div>
            </div>
            <div className="expense-record-details-amount-card rounded-[18px] bg-(--color-surface) p-4">
              <p className="expense-record-details-amount-label type-label text-gray-400">Amount</p>
              <p className={`expense-record-details-amount mt-1 text-3xl font-bold ${isIncome ? 'text-green-700' : 'text-(--color-ink)'}`}>
                {isIncome ? '+' : '-'}{fmt(record.amount)}
              </p>
            </div>
          </div>

          <div className="expense-record-details-grid grid grid-cols-1 gap-3">
            {[
              { label: 'Date', value: dateLabel(record.date) },
              { label: 'Paid to / from', value: record.vendor ?? 'Not specified' },
              record.memberId && { label: 'Assigned team member', value: memberName ?? 'Team member' },
              { label: 'Notes', value: record.description || 'No description added.' },
            ].filter(Boolean).map(item => (
              <div key={(item as { label: string }).label} className="expense-record-details-info rounded-2xl bg-(--color-surface) p-4">
                <p className="expense-record-details-info-label type-label text-gray-400">{(item as { label: string }).label}</p>
                <p className="expense-record-details-info-value mt-1 text-sm font-semibold leading-6 text-gray-800">{(item as { value: string }).value}</p>
              </div>
            ))}
            <div className="expense-record-details-info rounded-2xl bg-(--color-surface) p-4">
              <p className="expense-record-details-info-label type-label text-gray-400">Status</p>
              <div className="expense-record-details-status mt-2">
                <StatusBadge label={FINANCIAL_STATUS_LABELS[record.status]} variant={FINANCIAL_STATUS_VARIANT[record.status]} />
              </div>
            </div>
          </div>
        </div>

        <FormSidebarFooter>
          <Button type="button" variant="danger" iconLeft={<Trash2 size={14} />} onClick={() => onDelete(record)}>
            Delete
          </Button>
          <Button type="button" iconLeft={<Pencil size={14} />} onClick={() => onEdit(record)}>
            Edit
          </Button>
        </FormSidebarFooter>
      </div>
    </FormSidebar>
  );
}
