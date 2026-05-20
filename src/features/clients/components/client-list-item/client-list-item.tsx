import { Pencil, Trash2 } from '@/src/shared/components/material-icon/material-lucide-icons';
import { ClientStatusBadge, formatRecordDate, RecordMeta, RowActionsMenu } from '@/src/shared/components';
import type { Client, ClientStatus } from '../../types';

interface ClientListItemProps {
  client: Client;
  onOpen: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

const STATUS_COLOR: Record<ClientStatus, string> = {
  active: 'bg-green',
  inactive: 'bg-amber-400',
  lost: 'bg-red-400',
};

export default function ClientListItem({ client, onOpen, onEdit, onDelete }: ClientListItemProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(client)}
      onKeyDown={event => { if (event.key === 'Enter') onOpen(client); }}
      className="client-list-item grid cursor-pointer gap-3 rounded-[18px] border border-gray-200 bg-white p-4 text-left transition-colors hover:bg-gray-50 lg:grid-cols-[minmax(220px,1fr)_minmax(170px,0.7fr)_120px_110px_32px] lg:items-center"
    >
      <div className="client-list-item-main flex min-w-0 items-center gap-3">
        <div className={`client-list-item-avatar flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${STATUS_COLOR[client.status]} text-xs font-bold text-white`}>
          {client.fullName.charAt(0).toUpperCase()}
        </div>
        <div className="client-list-item-copy min-w-0">
          <p className="client-list-item-name type-card-title truncate text-(--color-ink)">{client.fullName}</p>
          <RecordMeta items={[{ label: client.companyName || 'No company', icon: 'business' }]} className="client-list-item-company mt-1" />
        </div>
      </div>

      <div className="client-list-item-contact min-w-0">
        <p className="client-list-item-email type-label truncate text-gray-600">{client.email}</p>
        <RecordMeta items={[{ label: client.phone || 'No phone', icon: 'call' }]} className="client-list-item-phone mt-1" />
      </div>

      <RecordMeta className="client-list-item-created" items={[{ label: formatRecordDate(client.createdAt?.toDate?.()), icon: 'event' }]} />

      <div className="client-list-item-status flex items-center justify-between gap-3 lg:justify-end">
        <ClientStatusBadge status={client.status} />
        <div className="client-list-item-actions" onClick={event => event.stopPropagation()}>
          <RowActionsMenu
            actions={[
              { label: 'Edit client', icon: <Pencil size={14} />, onClick: () => onEdit(client) },
              { label: 'Delete', icon: <Trash2 size={14} />, onClick: () => onDelete(client), variant: 'danger' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
